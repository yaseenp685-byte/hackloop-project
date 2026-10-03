import { NextRequest, NextResponse } from "next/server";
import { TeamService } from "@/lib/services/team.service";
import { CreateTeamSchema } from "@/lib/validation/team.schema";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = CreateTeamSchema.parse(body);

    const team = await TeamService.create(user.userId, validated);

    return NextResponse.json(
      {
        success: true,
        data: team,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
