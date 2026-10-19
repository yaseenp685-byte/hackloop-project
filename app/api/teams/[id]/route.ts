import { NextRequest, NextResponse } from "next/server";
import { TeamService } from "@/lib/services/team.service";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = await TeamService.getTeam(params.id);

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
