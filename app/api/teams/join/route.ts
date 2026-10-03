import { NextRequest, NextResponse } from "next/server";
import { TeamService } from "@/lib/services/team.service";
import { JoinTeamSchema } from "@/lib/validation/team.schema";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = JoinTeamSchema.parse(body);

    const team = await TeamService.joinByCode(user.userId, validated.inviteCode);

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
