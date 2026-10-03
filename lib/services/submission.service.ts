import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors/AppError";
import { CreateSubmissionDto, EvaluateSubmissionDto } from "@/lib/validation/submission.schema";
import { eventBus } from "@/lib/events/eventBus";
import { logger } from "@/lib/logger/logger";

export class SubmissionService {
  static async submitProject(studentUserId: string, data: CreateSubmissionDto) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
      include: {
        members: true,
        hackathon: true,
      },
    });

    if (!team) {
      throw AppError.notFound("Team not found.");
    }

    const isMember = team.members.some((m) => m.studentId === studentUserId);
    if (!isMember) {
      throw AppError.forbidden("You must be an active member of this team to submit a project.");
    }

    const hackathon = team.hackathon;
    if (hackathon.status === "COMPLETED" || hackathon.status === "ARCHIVED") {
      throw AppError.badRequest("Submissions are closed for this hackathon.");
    }

    const submission = await prisma.$transaction(async (tx) => {
      const existing = await tx.submission.findUnique({
        where: {
          hackathonId_teamId: {
            hackathonId: data.hackathonId,
            teamId: data.teamId,
          },
        },
      });

      let sub;
      if (existing) {
        sub = await tx.submission.update({
          where: { id: existing.id },
          data: {
            problemStatementId: data.problemStatementId || null,
            projectTitle: data.projectTitle,
            tagline: data.tagline,
            description: data.description,
            demoUrl: data.demoUrl || null,
            repoUrl: data.repoUrl || null,
            status: "SUBMITTED",
          },
        });
      } else {
        sub = await tx.submission.create({
          data: {
            hackathonId: data.hackathonId,
            teamId: data.teamId,
            problemStatementId: data.problemStatementId || null,
            projectTitle: data.projectTitle,
            tagline: data.tagline,
            description: data.description,
            demoUrl: data.demoUrl || null,
            repoUrl: data.repoUrl || null,
            status: "SUBMITTED",
          },
        });
      }

      await tx.team.update({
        where: { id: data.teamId },
        data: { status: "SUBMITTED" },
      });

      return sub;
    });

    await eventBus.publish({
      type: "PROJECT_SUBMITTED",
      entityType: "SUBMISSION",
      entityId: submission.id,
      payload: {
        submissionId: submission.id,
        teamId: data.teamId,
        hackathonId: data.hackathonId,
        projectTitle: data.projectTitle,
      },
      scope: "ROLE_ORGANIZER",
    });

    logger.info(`Submission received for team "${team.name}": "${submission.projectTitle}"`, "SubmissionService");

    return submission;
  }

  static async evaluate(judgeUserId: string, submissionId: string, data: EvaluateSubmissionDto) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { hackathon: true, team: true },
    });

    if (!submission) {
      throw AppError.notFound("Submission not found.");
    }

    const evalRecord = await prisma.$transaction(async (tx) => {
      const evaluation = await tx.evaluation.upsert({
        where: {
          submissionId_judgeId: {
            submissionId,
            judgeId: judgeUserId,
          },
        },
        create: {
          submissionId,
          judgeId: judgeUserId,
          score: data.score,
          criteriaBreakdown: JSON.stringify(data.criteriaBreakdown || {}),
          notes: data.notes,
        },
        update: {
          score: data.score,
          criteriaBreakdown: JSON.stringify(data.criteriaBreakdown || {}),
          notes: data.notes,
        },
      });

      const allEvals = await tx.evaluation.findMany({
        where: { submissionId },
        select: { score: true },
      });

      const avgScore = allEvals.reduce((acc, curr) => acc + curr.score, 0) / allEvals.length;

      await tx.submission.update({
        where: { id: submissionId },
        data: {
          score: Math.round(avgScore * 10) / 10,
          status: "UNDER_REVIEW",
        },
      });

      return evaluation;
    });

    await eventBus.publish({
      type: "EVALUATION_RECORDED",
      entityType: "SUBMISSION",
      entityId: submissionId,
      payload: { submissionId, judgeUserId, score: data.score },
      scope: "ROLE_ORGANIZER",
    });

    return evalRecord;
  }

  static async getSubmissions(hackathonId: string) {
    const submissions = await prisma.submission.findMany({
      where: { hackathonId },
      include: {
        team: {
          include: {
            members: {
              include: { student: true },
            },
          },
        },
        problemStatement: true,
        evaluations: {
          include: {
            judge: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { score: "desc" },
    });

    return submissions.map((s) => ({
      id: s.id,
      teamId: s.teamId,
      teamName: s.team.name,
      projectTitle: s.projectTitle,
      tagline: s.tagline,
      description: s.description,
      demoUrl: s.demoUrl,
      repoUrl: s.repoUrl,
      status: s.status,
      score: s.score,
      rank: s.rank,
      feedback: s.feedback,
      submittedAt: s.submittedAt.toISOString(),
      evaluationsCount: s.evaluations.length,
      members: s.team.members.map((m) => ({
        id: m.student.id,
        name: m.student.name,
      })),
    }));
  }
}
