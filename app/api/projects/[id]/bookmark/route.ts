import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project.service";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const result = await ProjectService.toggleBookmark(params.id, user.userId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
