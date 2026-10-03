import { NextRequest, NextResponse } from "next/server";
import { HackathonService } from "@/lib/services/hackathon.service";
import { CreateHackathonSchema } from "@/lib/validation/hackathon.schema";
import { authenticateRequest, requireRole } from "@/lib/auth/middleware";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 10;
    const district = searchParams.get("district") || undefined;
    const status = searchParams.get("status") || undefined;
    const format = searchParams.get("format") || undefined;
    const featured = searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined;

    const result = await HackathonService.list({
      page,
      pageSize,
      district,
      status,
      format,
      featured,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const body = await req.json();
    const validated = CreateHackathonSchema.parse(body);

    const hackathon = await HackathonService.create(user.userId, validated);

    return NextResponse.json(
      {
        success: true,
        data: hackathon,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
