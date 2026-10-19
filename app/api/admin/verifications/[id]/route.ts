import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/services/admin.service";
import { VerificationDecisionSchema } from "@/lib/validation/admin.schema";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ADMIN"]);

    const body = await req.json();
    const validated = VerificationDecisionSchema.parse(body);

    const result = await AdminService.decideVerification(
      params.id,
      user.userId,
      validated.decision,
      validated.notes
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
