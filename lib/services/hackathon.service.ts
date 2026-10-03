import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";
import { CreateHackathonDto, CreateAnnouncementDto } from "@/lib/validation/hackathon.schema";
import { eventBus } from "@/lib/events/eventBus";
import { logger } from "@/lib/logger/logger";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class HackathonService {
  static async list(params: {
    page?: number;
    pageSize?: number;
    district?: string;
    status?: string;
    format?: string;
    featured?: boolean;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (params.district && params.district !== "ALL") {
      where.district = { contains: params.district };
    
    }
    if (params.format && params.format !== "ALL") {
      where.format = params.format;
    }
    if (params.featured !== undefined) {
      where.featured = params.featured;
    }

    const [hackathons, total] = await Promise.all([
      prisma.hackathon.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          organizerProfile: {
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          },
          problemStatements: true,
          prizes: true,
          schedule: { orderBy: { sortOrder: "asc" } },
        },
        orderBy: { startDate: "asc" },
      }),
      prisma.hackathon.count({ where }),
    ]);

    return {
      data: hackathons.map((h) => ({
        id: h.id,
        slug: h.slug,
        title: h.title,
        tagline: h.tagline,
        organizer: {
          id: h.organizerProfile?.id || "org-unknown",
          name: h.organizerName,
          type: (h.organizerType || "COLLEGE") as any,
          avatarUrl: h.organizerProfile?.user.avatarUrl || undefined,
          verified: h.verificationStatus === "VERIFIED",
        },
        verificationStatus: h.verificationStatus as any,
        status: h.status as any,
        format: h.format as any,
        location: {
          district: h.district,
          city: h.city || undefined,
          locality: h.locality || undefined,
          address: h.address || undefined,
          latitude: h.latitude,
          longitude: h.longitude,
        },
        description: h.description,
        theme: JSON.parse(h.theme || "[]"),
        technologies: JSON.parse(h.technologies || "[]"),
        eligibility: h.eligibility,
        minTeamSize: h.minTeamSize,
        maxTeamSize: h.maxTeamSize,
        registrationDeadline: h.registrationDeadline.toISOString(),
        startDate: h.startDate.toISOString(),
        endDate: h.endDate.toISOString(),
        rules: JSON.parse(h.rules || "[]"),
        problemStatements: h.problemStatements.map((p) => ({
          ...p,
          deliverables: JSON.parse(p.deliverables || "[]"),
          sponsorOrCompany: p.sponsorOrCompany || undefined,
          trackPrize: p.trackPrize || undefined,
        })),
        prizes: h.prizes.map((pz) => ({
          ...pz,
          perks: JSON.parse(pz.perks || "[]"),
          description: pz.description || undefined,
        })),
        schedule: h.schedule.map((sc) => ({
          id: sc.id,
          title: sc.title,
          time: sc.time,
          date: sc.date,
          description: sc.description || undefined,
          isCompleted: sc.isCompleted,
          isCurrent: sc.isCurrent,
        })),
        participatingInstitutions: [],
        partnerCompanies: [],
        featured: h.featured,
        registrationCount: h.registrationCount,
        viewsCount: h.viewsCount,
        bookmarksCount: h.bookmarksCount,
        source: h.source,
        lastUpdated: h.lastUpdated.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + hackathons.length < total,
    };
  }

  static async getBySlugOrId(identifier: string) {
    const h = await prisma.hackathon.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }],
      },
      include: {
        organizerProfile: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        problemStatements: true,
        prizes: true,
        schedule: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!h) {
      throw AppError.notFound(`Hackathon "${identifier}" was not found.`);
    }

    prisma.hackathon.update({
      where: { id: h.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    return {
      id: h.id,
      slug: h.slug,
      title: h.title,
      tagline: h.tagline,
      organizer: {
        id: h.organizerProfile?.id || "org-unknown",
        name: h.organizerName,
        type: (h.organizerType || "COLLEGE") as any,
        avatarUrl: h.organizerProfile?.user.avatarUrl || undefined,
        verified: h.verificationStatus === "VERIFIED",
      },
      verificationStatus: h.verificationStatus as any,
      status: h.status as any,
      format: h.format as any,
      location: {
        district: h.district,
        city: h.city || undefined,
        locality: h.locality || undefined,
        address: h.address || undefined,
        latitude: h.latitude,
        longitude: h.longitude,
      },
      description: h.description,
      theme: JSON.parse(h.theme || "[]"),
      technologies: JSON.parse(h.technologies || "[]"),
      eligibility: h.eligibility,
      minTeamSize: h.minTeamSize,
      maxTeamSize: h.maxTeamSize,
      registrationDeadline: h.registrationDeadline.toISOString(),
      startDate: h.startDate.toISOString(),
      endDate: h.endDate.toISOString(),
      rules: JSON.parse(h.rules || "[]"),
      problemStatements: h.problemStatements.map((p) => ({
        ...p,
        deliverables: JSON.parse(p.deliverables || "[]"),
        sponsorOrCompany: p.sponsorOrCompany || undefined,
        trackPrize: p.trackPrize || undefined,
      })),
      prizes: h.prizes.map((pz) => ({
        ...pz,
        perks: JSON.parse(pz.perks || "[]"),
        description: pz.description || undefined,
      })),
      schedule: h.schedule.map((sc) => ({
        id: sc.id,
        title: sc.title,
        time: sc.time,
        date: sc.date,
        description: sc.description || undefined,
        isCompleted: sc.isCompleted,
        isCurrent: sc.isCurrent,
      })),
      participatingInstitutions: [],
      partnerCompanies: [],
      featured: h.featured,
      registrationCount: h.registrationCount,
      viewsCount: h.viewsCount,
      bookmarksCount: h.bookmarksCount,
      source: h.source,
      lastUpdated: h.lastUpdated.toISOString(),
    };
  }

  static async create(organizerUserId: string, data: CreateHackathonDto) {
    const org = await prisma.organizerProfile.findUnique({
      where: { userId: organizerUserId },
      include: { user: true },
    });

    if (!org) {
      throw AppError.forbidden("Organizer profile required to create a hackathon.");
    }

    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.hackathon.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const hackathon = await prisma.$transaction(async (tx) => {
      const created = await tx.hackathon.create({
        data: {
          slug,
          title: data.title,
          tagline: data.tagline,
          organizerId: org.id,
          organizerName: org.organizationName,
          organizerType: org.organizationType,
          district: data.district,
          city: data.city || null,
          locality: data.locality || null,
          address: data.address || null,
          latitude: data.latitude || 12.9716,
          longitude: data.longitude || 77.5946,
          description: data.description,
          format: data.format,
          theme: JSON.stringify(data.theme),
          technologies: JSON.stringify(data.technologies),
          eligibility: data.eligibility,
          minTeamSize: data.minTeamSize,
          maxTeamSize: data.maxTeamSize,
          registrationDeadline: new Date(data.registrationDeadline),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          rules: JSON.stringify(data.rules || []),
          status: "DRAFT",
          verificationStatus: "VERIFIED",
        },
      });

      if (data.problemStatements && data.problemStatements.length > 0) {
        for (const ps of data.problemStatements) {
          await tx.problemStatement.create({
            data: {
              hackathonId: created.id,
              title: ps.title,
              category: ps.category,
              description: ps.description,
              sponsorOrCompany: ps.sponsorOrCompany || null,
              deliverables: JSON.stringify(ps.deliverables || []),
              trackPrize: ps.trackPrize || null,
            },
          });
        }
      }

      if (data.prizes && data.prizes.length > 0) {
        for (const pz of data.prizes) {
          await tx.prize.create({
            data: {
              hackathonId: created.id,
              place: pz.place,
              amount: pz.amount,
              perks: JSON.stringify(pz.perks || []),
              description: pz.description || null,
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: "HACKATHON_CREATED",
          performedBy: organizerUserId,
          targetEntity: "HACKATHON",
          targetId: created.id,
          details: JSON.stringify({ slug, title: data.title }),
        },
      });

      return created;
    });

    await eventBus.publish({
      type: "HACKATHON_CREATED",
      entityType: "HACKATHON",
      entityId: hackathon.id,
      payload: { id: hackathon.id, slug: hackathon.slug, title: hackathon.title },
      scope: "PUBLIC",
    });

    logger.info(`Hackathon created: "${hackathon.title}" (${hackathon.slug})`, "HackathonService");

    return this.getBySlugOrId(hackathon.id);
  }

  static async updateStatus(
    hackathonId: string,
    userId: string,
    userRole: string,
    newStatus: string
  ) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { organizerProfile: true },
    });

    if (!hackathon) {
      throw AppError.notFound("Hackathon not found.");
    }

    if (userRole !== "ADMIN" && hackathon.organizerProfile?.userId !== userId) {
      throw AppError.forbidden("You do not have permission to manage this hackathon.");
    }

    const currentStatus = hackathon.status;
    const VALID_TRANSITIONS: Record<string, string[]> = {
      "DRAFT": ["REVIEW", "PUBLISHED", "Registration Open"],
      "REVIEW": ["PUBLISHED", "DRAFT"],
      "PUBLISHED": ["Registration Open", "ARCHIVED"],
      "Registration Open": ["Registration Closing Soon", "Registration Closed", "Event Live"],
      "Registration Closing Soon": ["Registration Closed", "Registration Open"],
      "Registration Closed": ["Event Live", "Registration Open"],
      "Event Live": ["Submission Open", "Submission Closed", "Judging"],
      "Submission Open": ["Submission Closed", "Judging"],
      "Submission Closed": ["Judging", "Submission Open"],
      "Judging": ["Results Published", "COMPLETED"],
      "Results Published": ["COMPLETED", "ARCHIVED"],
      "COMPLETED": ["ARCHIVED"],
      "ARCHIVED": [],
    };

    if (userRole !== "ADMIN") {
      const allowed = VALID_TRANSITIONS[currentStatus] || [];
      if (!allowed.includes(newStatus)) {
        throw AppError.badRequest(
          `Invalid state transition: Cannot change status from "${currentStatus}" to "${newStatus}".`
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.hackathon.update({
        where: { id: hackathonId },
        data: { status: newStatus },
      });

      await tx.auditLog.create({
        data: {
          action: "HACKATHON_STATUS_CHANGED",
          performedBy: userId,
          targetEntity: "HACKATHON",
          targetId: hackathonId,
          details: JSON.stringify({ from: currentStatus, to: newStatus }),
        },
      });
    });

    await eventBus.publish({
      type: "HACKATHON_STATUS_CHANGED",
      entityType: "HACKATHON",
      entityId: hackathonId,
      payload: { hackathonId, status: newStatus, fromStatus: currentStatus },
      scope: "PUBLIC",
    });

    logger.info(`Hackathon "${hackathon.title}" status changed: ${currentStatus} -> ${newStatus}`, "HackathonService");

    return this.getBySlugOrId(hackathonId);
  }

  static async register(
    hackathonId: string,
    studentUserId: string,
    role: string = "INDIVIDUAL",
    teamId?: string
  ) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      throw AppError.notFound("Hackathon not found.");
    }

    if (hackathon.status !== "Registration Open" && hackathon.status !== "Registration Closing Soon") {
      throw AppError.badRequest(
        `Registrations are not open for this hackathon (Current status: ${hackathon.status}).`
      );
    }

    const existing = await prisma.hackathonRegistration.findUnique({
      where: {
        hackathonId_studentId: {
          hackathonId,
          studentId: studentUserId,
        },
      },
    });

    if (existing) {
      throw AppError.conflict("You are already registered for this hackathon.");
    }

    const ticketNumber = `KAR-${hackathon.slug.slice(0, 4).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const registration = await prisma.$transaction(async (tx) => {
      const reg = await tx.hackathonRegistration.create({
        data: {
          hackathonId,
          studentId: studentUserId,
          teamId: teamId || null,
          role,
          ticketNumber,
          registrationStatus: "CONFIRMED",
        },
      });

      await tx.hackathon.update({
        where: { id: hackathonId },
        data: { registrationCount: { increment: 1 } },
      });

      await tx.notification.create({
        data: {
          userId: studentUserId,
          title: `Registered: ${hackathon.title}`,
          message: `Your registration for "${hackathon.title}" is confirmed! Ticket Number: ${ticketNumber}`,
          type: "SYSTEM",
          linkUrl: `/hackathons/${hackathon.slug}`,
        },
      });

      return reg;
    });

    await eventBus.publish({
      type: "REGISTRATION_CREATED",
      entityType: "HACKATHON",
      entityId: hackathonId,
      payload: {
        hackathonId,
        studentUserId,
        ticketNumber: registration.ticketNumber,
      },
      scope: "ROLE_ORGANIZER",
    });

    logger.info(`Student registered for ${hackathon.slug}: Ticket ${ticketNumber}`, "HackathonService");

    return {
      registrationId: registration.id,
      hackathonId: registration.hackathonId,
      hackathonTitle: hackathon.title,
      eventDate: `${hackathon.startDate.toISOString().slice(0, 10)} to ${hackathon.endDate.toISOString().slice(0, 10)}`,
      registrationStatus: registration.registrationStatus,
      ticketNumber: registration.ticketNumber,
      userRole: registration.role,
      registeredAt: registration.registeredAt.toISOString(),
    };
  }

  static async createAnnouncement(
    hackathonId: string,
    userId: string,
    userRole: string,
    data: CreateAnnouncementDto
  ) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { organizerProfile: true, registrations: true },
    });

    if (!hackathon) {
      throw AppError.notFound("Hackathon not found.");
    }

    if (userRole !== "ADMIN" && hackathon.organizerProfile?.userId !== userId) {
      throw AppError.forbidden("Only the organizer or admin can publish announcements.");
    }

    const announcement = await prisma.$transaction(async (tx) => {
      const ann = await tx.announcement.create({
        data: {
          hackathonId,
          title: data.title,
          content: data.content,
          priority: data.priority,
          sentToEmail: data.sentToEmail || false,
        },
      });

      for (const reg of hackathon.registrations) {
        await tx.notification.create({
          data: {
            userId: reg.studentId,
            title: `[${hackathon.title}] ${data.title}`,
            message: data.content.slice(0, 150),
            type: "ANNOUNCEMENT",
            linkUrl: `/hackathons/${hackathon.slug}`,
          },
        });
      }

      return ann;
    });

    await eventBus.publish({
      type: "ANNOUNCEMENT_PUBLISHED",
      entityType: "HACKATHON",
      entityId: hackathonId,
      payload: {
        announcementId: announcement.id,
        hackathonId,
        title: announcement.title,
        priority: announcement.priority,
      },
      scope: "PUBLIC",
    });

    return {
      id: announcement.id,
      hackathonId: announcement.hackathonId,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      publishedAt: announcement.publishedAt.toISOString(),
    };
  }

  static async getAnnouncements(hackathonId: string) {
    const announcements = await prisma.announcement.findMany({
      where: { hackathonId },
      orderBy: { publishedAt: "desc" },
    });

    return announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      priority: a.priority,
      publishedAt: a.publishedAt.toISOString(),
    }));
  }
}
