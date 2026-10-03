import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/services/admin.service";
import { ResolveModerationSchema } from "@/lib/validation/admin.schema";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ADMIN"]);

    const body = await req.json();
    const validated = ResolveModerationSchema.parse(body);

    const result = await AdminService.resolveModeration(
      params.id,
      user.userId,
      validated.status,
      validated.resolutionNotes
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
