import { NextRequest, NextResponse } from "next/server";
import { CommunityService } from "@/lib/services/community.service";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const community = await CommunityService.getById(params.id);

    return NextResponse.json({
      success: true,
      data: community,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
