import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";
import { CreateTeamDto, InviteMemberDto } from "@/lib/validation/team.schema";
import { eventBus } from "@/lib/events/eventBus";
import { logger } from "@/lib/logger/logger";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export class TeamService {
  static async create(studentUserId: string, data: CreateTeamDto) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: data.hackathonId },
    });

    if (!hackathon) {
      throw AppError.notFound("Hackathon not found.");
    }

    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        studentId: studentUserId,
        team: { hackathonId: data.hackathonId },
      },
      include: { team: true },
    });

    if (existingMembership) {
      throw AppError.conflict(
        `You are already a member of team "${existingMembership.team.name}" for this hackathon.`
      );
    }

    let inviteCode = generateInviteCode();
    let isUnique = false;
    while (!isUnique) {
      const codeExists = await prisma.team.findUnique({ where: { inviteCode } });
      if (!codeExists) isUnique = true;
      else inviteCode = generateInviteCode();
    }

    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          hackathonId: data.hackathonId,
          name: data.name,
          description: data.description,
          maxMembers: hackathon.maxTeamSize,
          inviteCode,
          status: "FORMING",
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          studentId: studentUserId,
          role: "LEADER",
          status: "ACTIVE",
        },
      });

      const reg = await tx.hackathonRegistration.findUnique({
        where: {
          hackathonId_studentId: {
            hackathonId: data.hackathonId,
            studentId: studentUserId,
          },
        },
      });

      if (reg) {
        await tx.hackathonRegistration.update({
          where: { id: reg.id },
          data: {
            teamId: newTeam.id,
            role: "LEADER",
          },
        });
      } else {
        const ticketNumber = `KAR-${hackathon.slug.slice(0, 4).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
        await tx.hackathonRegistration.create({
          data: {
            hackathonId: data.hackathonId,
            studentId: studentUserId,
            teamId: newTeam.id,
            role: "LEADER",
            ticketNumber,
            registrationStatus: "CONFIRMED",
          },
        });
        await tx.hackathon.update({
          where: { id: data.hackathonId },
          data: { registrationCount: { increment: 1 } },
        });
      }

      return newTeam;
    });

    await eventBus.publish({
      type: "TEAM_CREATED",
      entityType: "TEAM",
      entityId: team.id,
      payload: { teamId: team.id, name: team.name, hackathonId: team.hackathonId },
      scope: "PUBLIC",
    });

    logger.info(`Team created: "${team.name}" (Code: ${team.inviteCode})`, "TeamService");

    return this.getTeam(team.id);
  }

  static async joinByCode(studentUserId: string, inviteCode: string) {
    const team = await prisma.team.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
      include: {
        members: true,
        hackathon: true,
      },
    });

    if (!team) {
      throw AppError.notFound("Invalid team invite code. Team does not exist.");
    }

    if (team.members.length >= team.maxMembers) {
      throw AppError.badRequest(
        `Team has reached maximum capacity of ${team.maxMembers} members.`
      );
    }

    const alreadyMember = team.members.some((m) => m.studentId === studentUserId);
    if (alreadyMember) {
      throw AppError.conflict("You are already a member of this team.");
    }

    const inAnotherTeam = await prisma.teamMember.findFirst({
      where: {
        studentId: studentUserId,
        team: { hackathonId: team.hackathonId },
      },
      include: { team: true },
    });

    if (inAnotherTeam) {
      throw AppError.conflict(
        `You are already in another team ("${inAnotherTeam.team.name}") for this hackathon.`
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          studentId: studentUserId,
          role: "MEMBER",
          status: "ACTIVE",
        },
      });

      const reg = await tx.hackathonRegistration.findUnique({
        where: {
          hackathonId_studentId: {
            hackathonId: team.hackathonId,
            studentId: studentUserId,
          },
        },
      });

      if (reg) {
        await tx.hackathonRegistration.update({
          where: { id: reg.id },
          data: {
            teamId: team.id,
            role: "MEMBER",
          },
        });
      } else {
        const ticketNumber = `KAR-${team.hackathon.slug.slice(0, 4).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
        await tx.hackathonRegistration.create({
          data: {
            hackathonId: team.hackathonId,
            studentId: studentUserId,
            teamId: team.id,
            role: "MEMBER",
            ticketNumber,
            registrationStatus: "CONFIRMED",
          },
        });
        await tx.hackathon.update({
          where: { id: team.hackathonId },
          data: { registrationCount: { increment: 1 } },
        });
      }
    });

    await eventBus.publish({
      type: "TEAM_MEMBER_JOINED",
      entityType: "TEAM",
      entityId: team.id,
      payload: { teamId: team.id, studentUserId },
      scope: "PUBLIC",
    });

    return this.getTeam(team.id);
  }

  static async inviteMember(teamId: string, currentUserId: string, data: InviteMemberDto) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      throw AppError.notFound("Team not found.");
    }

    const isMember = team.members.some((m) => m.studentId === currentUserId);
    if (!isMember) {
      throw AppError.forbidden("Only team members can invite others.");
    }

    if (team.members.length >= team.maxMembers) {
      throw AppError.badRequest("Team has reached max capacity.");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        invitedByUserId: currentUserId,
        invitedEmailOrUsn: data.invitedEmailOrUsn.toLowerCase(),
        expiresAt,
        status: "PENDING",
      },
    });

    const recipient = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.invitedEmailOrUsn.toLowerCase() },
          { studentProfile: { usnOrRollNo: data.invitedEmailOrUsn } },
        ],
      },
    });

    if (recipient) {
      await prisma.notification.create({
        data: {
          userId: recipient.id,
          title: `Team Invitation: ${team.name}`,
          message: `You have been invited to join team "${team.name}". Use invite code ${team.inviteCode} to join!`,
          type: "INVITATION",
          linkUrl: `/dashboard/student?tab=teams`,
        },
      });
    }

    return invitation;
  }

  static async getTeam(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        hackathon: true,
        members: {
          include: {
            student: {
              include: { studentProfile: true },
            },
          },
        },
        submissions: true,
      },
    });

    if (!team) {
      throw AppError.notFound("Team not found.");
    }

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      maxMembers: team.maxMembers,
      inviteCode: team.inviteCode,
      status: team.status,
      hackathon: {
        id: team.hackathon.id,
        slug: team.hackathon.slug,
        title: team.hackathon.title,
        status: team.hackathon.status,
      },
      members: team.members.map((m) => ({
        id: m.student.id,
        name: m.student.name,
        email: m.student.email,
        role: m.role,
        college: m.student.studentProfile?.collegeName || "Institution",
        joinedAt: m.joinedAt.toISOString(),
      })),
      submissionsCount: team.submissions.length,
      createdAt: team.createdAt.toISOString(),
    };
  }

  static async listRecruitingTeams(params: { role?: string; search?: string; hackathonId?: string }, currentUserId?: string) {
    const where: any = {
      isOpenForMembers: true,
      status: { in: ["FORMING", "READY"] },
    };

    if (params.hackathonId) {
      where.hackathonId = params.hackathonId;
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q } },
        { projectIdea: { contains: q } },
        { requiredRoles: { contains: q } },
        { hackathon: { title: { contains: q } } },
      ];
    }

    if (params.role && params.role !== "ALL") {
      where.requiredRoles = { contains: params.role };
    }

    const teams = await prisma.team.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
            slug: true,
            district: true,
            format: true,
            startDate: true,
            endDate: true,
          },
        },
        members: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                role: true,
                studentProfile: {
                  select: {
                    collegeName: true,
                    skills: true,
                  },
                },
              },
            },
          },
        },
        joinRequests: {
          where: { userId: currentUserId || "ANONYMOUS" },
          select: { id: true, status: true, role: true },
        },
      },
    });

    return teams.map((t) => {
      let parsedRoles: string[] = [];
      try {
        parsedRoles = JSON.parse(t.requiredRoles || "[]");
      } catch {
        parsedRoles = [];
      }

      const leader = t.members.find((m) => m.role === "LEADER") || t.members[0];
      const isLeader = currentUserId ? leader?.studentId === currentUserId : false;
      const isMember = currentUserId ? t.members.some((m) => m.studentId === currentUserId) : false;
      const myRequest = currentUserId && (t.joinRequests as any[])?.length > 0 ? (t.joinRequests as any[])[0] : null;

      return {
        id: t.id,
        name: t.name,
        description: t.description,
        projectIdea: t.projectIdea,
        requiredRoles: parsedRoles,
        isOpenForMembers: t.isOpenForMembers,
        maxMembers: t.maxMembers,
        currentMembersCount: t.members.length,
        hackathon: t.hackathon,
        leader: leader
          ? {
              id: leader.student.id,
              name: leader.student.name,
              college: leader.student.studentProfile?.collegeName || "Karnataka Tech Institute",
            }
          : null,
        members: t.members.map((m) => ({
          id: m.student.id,
          name: m.student.name,
          role: m.role,
          college: m.student.studentProfile?.collegeName || "Karnataka Tech Institute",
        })),
        isLeader,
        isMember,
        myRequestStatus: myRequest ? myRequest.status : null,
        createdAt: t.createdAt.toISOString(),
      };
    });
  }

  static async requestToJoin(studentUserId: string, data: { teamId: string; role: string; message?: string }) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
      include: {
        hackathon: true,
        members: true,
      },
    });

    if (!team) {
      throw AppError.notFound("Team not found.");
    }

    if (!team.isOpenForMembers) {
      throw AppError.badRequest("This team is currently not accepting new members.");
    }

    if (team.members.length >= team.maxMembers) {
      throw AppError.badRequest("This team has already reached its maximum member limit.");
    }

    // Check if user is already a member
    const existingMember = team.members.find((m) => m.studentId === studentUserId);
    if (existingMember) {
      throw AppError.badRequest("You are already a member of this team.");
    }

    // Check if user already belongs to another team in this hackathon
    const anotherTeamMember = await prisma.teamMember.findFirst({
      where: {
        studentId: studentUserId,
        team: { hackathonId: team.hackathonId },
      },
      include: { team: true },
    });

    if (anotherTeamMember) {
      throw AppError.badRequest(
        `You are already in team "${anotherTeamMember.team.name}" for this hackathon.`
      );
    }

    // Check existing request
    const existingReq = await prisma.teamJoinRequest.findUnique({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: studentUserId,
        },
      },
    });

    if (existingReq) {
      if (existingReq.status === "PENDING") {
        throw AppError.conflict("You already have a pending join request for this team.");
      }
      // If previously rejected, allow re-requesting by updating status
      const updated = await prisma.teamJoinRequest.update({
        where: { id: existingReq.id },
        data: {
          status: "PENDING",
          role: data.role,
          message: data.message,
        },
      });
      return updated;
    }

    const request = await prisma.teamJoinRequest.create({
      data: {
        teamId: data.teamId,
        userId: studentUserId,
        role: data.role,
        message: data.message,
        status: "PENDING",
      },
      include: {
        user: { select: { name: true } },
      },
    });

    // Notify team leader
    const leader = team.members.find((m) => m.role === "LEADER") || team.members[0];
    if (leader) {
      await prisma.notification.create({
        data: {
          userId: leader.studentId,
          title: `Join Request: ${team.name}`,
          message: `${request.user.name} requested to join ${team.name} as ${data.role}.`,
          type: "INVITATION",
          linkUrl: `/teams`,
        },
      });
    }

    return request;
  }

  static async handleJoinRequest(leaderUserId: string, requestId: string, action: "ACCEPT" | "REJECT") {
    const request = await prisma.teamJoinRequest.findUnique({
      where: { id: requestId },
      include: {
        team: {
          include: {
            members: true,
            hackathon: true,
          },
        },
        user: {
          select: { id: true, name: true },
        },
      },
    });

    if (!request) {
      throw AppError.notFound("Join request not found.");
    }

    const isLeader = request.team.members.some(
      (m) => m.studentId === leaderUserId && m.role === "LEADER"
    );

    if (!isLeader) {
      throw AppError.forbidden("Only the team leader can accept or reject join requests.");
    }

    if (request.status !== "PENDING") {
      throw AppError.badRequest(`This request is already marked as ${request.status}.`);
    }

    if (action === "REJECT") {
      const updated = await prisma.teamJoinRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });

      await prisma.notification.create({
        data: {
          userId: request.userId,
          title: `Team Update: ${request.team.name}`,
          message: `Your request to join ${request.team.name} was not accepted at this time.`,
          type: "SYSTEM_ALERT",
          linkUrl: `/teams`,
        },
      });

      return updated;
    }

    // Action is ACCEPT
    if (request.team.members.length >= request.team.maxMembers) {
      throw AppError.badRequest("Team is already at maximum capacity.");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedReq = await tx.teamJoinRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      await tx.teamMember.create({
        data: {
          teamId: request.teamId,
          studentId: request.userId,
          role: "MEMBER",
          status: "ACTIVE",
        },
      });

      // Update or create hackathon registration
      const reg = await tx.hackathonRegistration.findUnique({
        where: {
          hackathonId_studentId: {
            hackathonId: request.team.hackathonId,
            studentId: request.userId,
          },
        },
      });

      if (reg) {
        await tx.hackathonRegistration.update({
          where: { id: reg.id },
          data: {
            teamId: request.teamId,
            role: "MEMBER",
          },
        });
      } else {
        const ticketNumber = `KAR-${request.team.hackathon.slug.slice(0, 4).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
        await tx.hackathonRegistration.create({
          data: {
            hackathonId: request.team.hackathonId,
            studentId: request.userId,
            teamId: request.teamId,
            role: "MEMBER",
            ticketNumber,
            registrationStatus: "CONFIRMED",
          },
        });
        await tx.hackathon.update({
          where: { id: request.team.hackathonId },
          data: { registrationCount: { increment: 1 } },
        });
      }

      // Close team if reached capacity
      if (request.team.members.length + 1 >= request.team.maxMembers) {
        await tx.team.update({
          where: { id: request.teamId },
          data: { isOpenForMembers: false },
        });
      }

      await tx.notification.create({
        data: {
          userId: request.userId,
          title: `Welcome to ${request.team.name}!`,
          message: `Your request to join ${request.team.name} has been approved! You are now part of the team.`,
          type: "INVITATION",
          linkUrl: `/dashboard/student?tab=teams`,
        },
      });

      return updatedReq;
    });

    return result;
  }

  static async updateRecruitment(
    leaderUserId: string,
    data: {
      teamId: string;
      projectIdea?: string;
      requiredRoles?: string[];
      isOpenForMembers?: boolean;
    }
  ) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
      include: { members: true },
    });

    if (!team) {
      throw AppError.notFound("Team not found.");
    }

    const isLeader = team.members.some(
      (m) => m.studentId === leaderUserId && m.role === "LEADER"
    );

    if (!isLeader) {
      throw AppError.forbidden("Only the team leader can update recruitment settings.");
    }

    const updateData: any = {};
    if (data.projectIdea !== undefined) updateData.projectIdea = data.projectIdea;
    if (data.requiredRoles !== undefined) updateData.requiredRoles = JSON.stringify(data.requiredRoles);
    if (data.isOpenForMembers !== undefined) updateData.isOpenForMembers = data.isOpenForMembers;

    const updated = await prisma.team.update({
      where: { id: data.teamId },
      data: updateData,
    });

    return updated;
  }
}
