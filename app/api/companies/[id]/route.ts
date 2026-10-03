import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/lib/services/company.service";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const company = await CompanyService.getById(params.id);

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
