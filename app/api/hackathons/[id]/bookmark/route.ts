import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError, AppError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { id } = params;

    const hackathon = await prisma.hackathon.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!hackathon) {
      throw AppError.notFound("Hackathon not found.");
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_hackathonId: {
          userId: user.userId,
          hackathonId: hackathon.id,
        },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.bookmark.delete({ where: { id: existing.id } }),
        prisma.hackathon.update({
          where: { id: hackathon.id },
          data: { bookmarksCount: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({
        success: true,
        data: { bookmarked: false },
      });
    } else {
      await prisma.$transaction([
        prisma.bookmark.create({
          data: {
            userId: user.userId,
            hackathonId: hackathon.id,
          },
        }),
        prisma.hackathon.update({
          where: { id: hackathon.id },
          data: { bookmarksCount: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({
        success: true,
        data: { bookmarked: true },
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
