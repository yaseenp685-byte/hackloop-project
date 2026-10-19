import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth/middleware";
import { AuthService } from "@/lib/services/auth.service";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const currentUser = await AuthService.getCurrentUser(user.userId);

    return NextResponse.json({
      success: true,
      data: currentUser,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
