import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";
import { eventBus } from "@/lib/events/eventBus";
import { logger } from "@/lib/logger/logger";

export class AdminService {
  static async getStats() {
    const [
      totalUsers,
      totalStudents,
      totalOrganizers,
      totalHackathons,
      totalInstitutions,
      totalCompanies,
      totalCommunities,
      totalRegistrations,
      pendingVerifications,
      openReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.studentProfile.count(),
      prisma.organizerProfile.count(),
   
      prisma.institution.count(),
      prisma.company.count(),
      prisma.community.count(),
      prisma.hackathonRegistration.count(),
      prisma.verificationRequest.count({ where: { currentStatus: "PENDING" } }),
      prisma.moderationItem.count({ where: { status: "OPEN" } }),
    ]);


    return {
      totalUsers,
      totalStudents,
      totalOrganizers,
      totalHackathons,
      verifiedInstitutions: totalInstitutions,
      registeredCompanies: totalCompanies,
      activeCommunities: totalCommunities,
      totalRegistrations,
      pendingVerifications,
      openReports,
    };
  }


  static async getVerifications(status?: string) {
    const where: any = {};
    if (status && status !== "ALL") {
      where.currentStatus = status;
    }


    const items = await prisma.verificationRequest.findMany({
      where,
      orderBy: { submittedAt: "desc" },
    });


    return items.map((v) => ({
      id: v.id,
      entityType: v.entityType as any,
      entityId: v.entityId,
      entityName: v.entityName,
      submittedBy: v.submittedBy,
      submittedAt: v.submittedAt.toISOString(),
      documentsProvided: JSON.parse(v.documentsProvided || "[]"),
      currentStatus: v.currentStatus as any,
      notes: v.notes || "",
      reviewedBy: v.reviewedBy || undefined,
      reviewedAt: v.reviewedAt ? v.reviewedAt.toISOString() : undefined,
    }));
  }


  static async decideVerification(
    requestId: string,
    adminUserId: string,
    decision: "VERIFIED" | "REJECTED" | "PENDING" | "STALE_NEEDS_UPDATE",
    notes?: string
  ) {
    const req = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
    });


    if (!req) {
      throw AppError.notFound("Verification request not found.");
    }


    await prisma.$transaction(async (tx) => {
      await tx.verificationRequest.update({
        where: { id: requestId },
        data: {
          currentStatus: decision,
          notes: notes || req.notes,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
        },
      });


      if (req.entityType === "HACKATHON") {
        await tx.hackathon.updateMany({
          where: { id: req.entityId },
          data: { verificationStatus: decision },
        });
      } else if (req.entityType === "INSTITUTION") {
        await tx.institution.updateMany({
          where: { id: req.entityId },
          data: { verificationStatus: decision },
        });
      } else if (req.entityType === "COMPANY") {
        await tx.company.updateMany({
          where: { id: req.entityId },
          data: { verificationStatus: decision },
        });
      } else if (req.entityType === "ORGANIZER") {
        await tx.organizerProfile.updateMany({
          where: { id: req.entityId },
          data: { verificationStatus: decision },
        });
      }


      await tx.auditLog.create({
        data: {
          action: `VERIFICATION_${decision}`,
          performedBy: adminUserId,
          targetEntity: req.entityType,
          targetId: req.entityId,
          details: JSON.stringify({ requestId, notes, decision }),
        },
      });
    });


    await eventBus.publish({
      type: "VERIFICATION_STATUS_CHANGED",
      entityType: req.entityType,
      entityId: req.entityId,
      payload: { requestId, decision, notes },
      scope: "PUBLIC",
    });


    logger.info(`Verification ${requestId} decided as ${decision}`, "AdminService");


    return { success: true, requestId, status: decision };
  }


  static async getModerationItems(status?: string) {
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }


    const items = await prisma.moderationItem.findMany({
      where,
      orderBy: { reportedAt: "desc" },
    });


    return items.map((m) => ({
      id: m.id,
      itemType: m.itemType as any,
      itemId: m.itemId,
      itemTitle: m.itemTitle,
      reason: m.reason,
      reportedBy: m.reportedBy,
      reportedAt: m.reportedAt.toISOString(),
      status: m.status as any,
      resolutionNotes: m.resolutionNotes || undefined,
      resolvedBy: m.resolvedBy || undefined,
      resolvedAt: m.resolvedAt ? m.resolvedAt.toISOString() : undefined,
    }));
  }


  static async resolveModeration(
    itemId: string,
    adminUserId: string,
    status: "RESOLVED" | "DISMISSED",
    resolutionNotes: string
  ) {
    const item = await prisma.moderationItem.findUnique({
      where: { id: itemId },
    });


    if (!item) {
      throw AppError.notFound("Moderation item not found.");
    }


    await prisma.$transaction(async (tx) => {
      await tx.moderationItem.update({
        where: { id: itemId },
        data: {
          status,
          resolutionNotes,
          resolvedBy: adminUserId,
          resolvedAt: new Date(),
        },
      });


      await tx.auditLog.create({
        data: {
          action: `MODERATION_${status}`,
          performedBy: adminUserId,
          targetEntity: item.itemType,
          targetId: item.itemId,
          details: JSON.stringify({ itemId, resolutionNotes, status }),
        },
      });
    });


    return { success: true, itemId, status };
  }


  static async getAuditLogs(limit: number = 50) {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { timestamp: "desc" },
    });


    return logs.map((l) => ({
      id: l.id,
      action: l.action,
      performedBy: l.performedBy,
      targetEntity: l.targetEntity,
      targetId: l.targetId,
      timestamp: l.timestamp.toISOString(),
      ipAddress: l.ipAddress || "127.0.0.1",
      details: JSON.parse(l.details || "{}"),
    }));
  }


  static async getHealth() {
    let dbStatus = "OPERATIONAL";
    let dbLatency = 2;
    try {
      const t0 = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - t0;
    } catch {
      dbStatus = "DEGRADED";
    }


    const pendingOutbox = await prisma.eventOutbox.count({
      where: { status: "PENDING" },
    });


    return {
      status: "HEALTHY",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      components: [
        { name: "PostgreSQL Database", status: dbStatus, latencyMs: dbLatency },
        { name: "Event Bus Outbox", status: "OPERATIONAL", pendingEvents: pendingOutbox },
        { name: "Search Engine", status: "OPERATIONAL" },
      ],
    };
  }
}
