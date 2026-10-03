import { NextRequest, NextResponse } from "next/server";
import { HackathonService } from "@/lib/services/hackathon.service";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json().catch(() => ({}));

    const result = await HackathonService.register(
      user.userId,
      params.id,
      body.teamId
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
