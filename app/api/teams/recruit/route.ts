import { NextRequest, NextResponse } from "next/server";
import { TeamService } from "@/lib/services/team.service";
import { authenticateRequest, optionalAuthenticateRequest } from "@/lib/auth/middleware";
import { UpdateRecruitmentSchema } from "@/lib/validation/project.schema";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await optionalAuthenticateRequest(req);
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;
    const hackathonId = searchParams.get("hackathonId") || undefined;

    const teams = await TeamService.listRecruitingTeams(
      { search, role, hackathonId },
      user?.userId
    );

    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = UpdateRecruitmentSchema.parse(body);

    const team = await TeamService.updateRecruitment(user.userId, validated);

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
