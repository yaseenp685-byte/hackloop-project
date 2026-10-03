import { NextRequest, NextResponse } from "next/server";
import { InstitutionService } from "@/lib/services/institution.service";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const institution = await InstitutionService.getById(params.id);

    return NextResponse.json({
      success: true,
      data: institution,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
