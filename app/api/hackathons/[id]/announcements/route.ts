import { NextRequest, NextResponse } from "next/server";
import { HackathonService } from "@/lib/services/hackathon.service";
import { CreateAnnouncementSchema } from "@/lib/validation/hackathon.schema";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcements = await HackathonService.getAnnouncements(params.id);
    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const body = await req.json();
    const validated = CreateAnnouncementSchema.parse(body);

    const announcement = await HackathonService.createAnnouncement(
      params.id,
      user.userId,
      user.role,
      validated
    );

    return NextResponse.json(
      {
        success: true,
        data: announcement,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
