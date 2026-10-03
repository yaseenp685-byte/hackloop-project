import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, AppError } from "@/lib/errors/AppError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.studentProfile.findFirst({
      where: { OR: [{ id: params.id }, { userId: params.id }] },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!student) {
      throw AppError.notFound(`Student profile "${params.id}" not found.`);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
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
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
