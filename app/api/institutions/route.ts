import { NextRequest, NextResponse } from "next/server";
import { InstitutionService } from "@/lib/services/institution.service";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 20;
    const type = searchParams.get("type") || undefined;
    const district = searchParams.get("district") || undefined;

    const result = await InstitutionService.list({
      page,
      pageSize,
      type,
      district,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
