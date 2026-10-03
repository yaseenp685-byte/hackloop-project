import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/services/admin.service";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ADMIN"]);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const verifications = await AdminService.getVerifications(status);

    return NextResponse.json({
      success: true,
      data: verifications,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
