import { NextRequest, NextResponse } from "next/server";
import { SubmissionService } from "@/lib/services/submission.service";
import { CreateSubmissionSchema } from "@/lib/validation/submission.schema";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissions = await SubmissionService.getSubmissions(params.id);
    return NextResponse.json({
      success: true,
      data: submissions,
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
    const body = await req.json();
    const validated = CreateSubmissionSchema.parse({
      ...body,
      hackathonId: params.id,
    });

    const submission = await SubmissionService.submitProject(user.userId, validated);

    return NextResponse.json(
      {
        success: true,
        data: submission,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
