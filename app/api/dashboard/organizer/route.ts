import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { AuthService } from "@/lib/services/auth.service";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const dashboard = await AuthService.getOrganizerDashboard(user.userId);

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
