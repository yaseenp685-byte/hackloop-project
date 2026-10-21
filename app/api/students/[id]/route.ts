import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, AppError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.studentProfile.findFirst({
      where: { OR: [{ id: params.id }, { userId: params.id }] },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            projects: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                title: true,
                tagline: true,
                category: true,
                technologies: true,
                likesCount: true,
                repoUrl: true,
                demoUrl: true,
              },
            },
            registrations: {
              orderBy: { registeredAt: "desc" },
              include: {
                hackathon: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    startDate: true,
                    format: true,
                    district: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw AppError.notFound(`Student profile "${params.id}" not found.`);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        userId: student.userId,
        name: student.user.name,
        email: student.user.email,
        bio: student.bio || "",
        usnOrRollNo: student.usnOrRollNo || "",
        collegeName: student.collegeName,
        universityName: student.universityName || "",
        district: student.district,
        graduationYear: student.graduationYear,
        degreeBranch: student.degreeBranch,
        skills: JSON.parse(student.skills || "[]"),
        technologies: JSON.parse(student.technologies || "[]"),
        interests: JSON.parse(student.interests || "[]"),
        githubUrl: student.githubUrl || "",
        linkedinUrl: student.linkedinUrl || "",
        portfolioUrl: student.portfolioUrl || "",
        verificationStatus: student.verificationStatus,
        projects: student.user.projects.map((p) => {
          let techs = [];
          try {
            techs = JSON.parse(p.technologies);
          } catch {
            techs = [];
          }
          return {
            ...p,
            technologies: techs,
          };
        }),
        hackathons: student.user.registrations.map((r) => ({
          id: r.hackathon.id,
          title: r.hackathon.title,
          slug: r.hackathon.slug,
          startDate: r.hackathon.startDate.toISOString(),
          mode: r.hackathon.format,
          district: r.hackathon.district,
          role: r.role,
          registrationStatus: r.registrationStatus,
          ticketNumber: r.ticketNumber,
        })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
