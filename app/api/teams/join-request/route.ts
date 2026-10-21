import { NextRequest, NextResponse } from "next/server";
import { TeamService } from "@/lib/services/team.service";
import { authenticateRequest } from "@/lib/auth/middleware";
import { JoinTeamRequestSchema, HandleJoinRequestSchema } from "@/lib/validation/project.schema";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = JoinTeamRequestSchema.parse(body);

    const request = await TeamService.requestToJoin(user.userId, validated);

    return NextResponse.json(
      {
        success: true,
        data: request,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = HandleJoinRequestSchema.parse(body);

    const result = await TeamService.handleJoinRequest(
      user.userId,
      validated.requestId,
      validated.action
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
