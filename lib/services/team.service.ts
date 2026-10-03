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
}
