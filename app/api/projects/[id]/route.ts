import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project.service";
import { optionalAuthenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await optionalAuthenticateRequest(req);
    const project = await ProjectService.getById(params.id, user?.userId);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
