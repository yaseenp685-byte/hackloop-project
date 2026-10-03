import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/lib/services/search.service";
import { handleApiError } from "@/lib/errors/AppError";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("q") || "";

    const suggestions = await SearchService.suggestions(query);

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
