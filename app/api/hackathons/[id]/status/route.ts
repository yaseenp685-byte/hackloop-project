import { NextRequest, NextResponse } from "next/server";
import { HackathonService } from "@/lib/services/hackathon.service";
import { UpdateStatusSchema } from "@/lib/validation/hackathon.schema";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const body = await req.json();
    const validated = UpdateStatusSchema.parse(body);

    const result = await HackathonService.updateStatus(
      params.id,
      user.userId,
      user.role,
      validated.status
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
