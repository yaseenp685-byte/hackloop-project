import { NextRequest, NextResponse } from "next/server";
import { TeamService } from "@/lib/services/team.service";
import { InviteMemberSchema } from "@/lib/validation/team.schema";
import { authenticateRequest } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = InviteMemberSchema.parse(body);

    const invitation = await TeamService.inviteMember(
      params.id,
      user.userId,
      validated
    );

    return NextResponse.json(
      {
        success: true,
        data: invitation,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
