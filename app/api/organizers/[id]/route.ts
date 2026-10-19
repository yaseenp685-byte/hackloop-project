import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, AppError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizer = await prisma.organizerProfile.findFirst({
      where: { OR: [{ id: params.id }, { userId: params.id }] },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!organizer) {
      throw AppError.notFound(`Organizer profile "${params.id}" not found.`);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: organizer.id,
        name: organizer.user.name,
        email: organizer.user.email,
        phone: organizer.user.phone || "",
        organizationName: organizer.organizationName,
        organizationType: organizer.organizationType,
        designation: organizer.designation,
        district: organizer.district,
        verificationStatus: organizer.verificationStatus,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
