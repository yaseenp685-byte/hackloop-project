import { NextRequest, NextResponse } from "next/server";
import { SubmissionService } from "@/lib/services/submission.service";
import { EvaluateSubmissionSchema } from "@/lib/validation/submission.schema";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const body = await req.json();
    const validated = EvaluateSubmissionSchema.parse(body);

    const evaluation = await SubmissionService.evaluate(
      user.userId,
      params.id,
      validated
    );

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
