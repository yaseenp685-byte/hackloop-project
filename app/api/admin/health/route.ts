import { NextResponse } from "next/server";
import { AdminService } from "@/lib/services/admin.service";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET() {
  try {
    const health = await AdminService.getHealth();
    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
