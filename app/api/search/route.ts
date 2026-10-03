import { NextRequest, NextResponse } from "next/server";
import { SearchService } from "@/lib/services/search.service";
import { SearchParamsSchema } from "@/lib/validation/search.schema";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validated = SearchParamsSchema.parse(body);

    const data = await SearchService.search({
      query: validated.query,
      filters: validated.filters,
      page: validated.page,
      pageSize: validated.pageSize,
    });

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        source: "Karnataka Universal Discovery Index (Production Engine)",
        cached: false,
        latencyMs: data.searchDurationMs,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("q") || "";
    const category = searchParams.get("category") || "ALL";
    const district = searchParams.get("district") || undefined;
    const radiusKm = searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined;
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
    const sortBy = searchParams.get("sortBy") || "relevance";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 10;
    const technologies = searchParams.getAll("technologies");

    const filters: any = {
      category,
      district,
      sortBy,
      radiusKm,
    };

    if (technologies.length > 0) {
      filters.technologies = technologies;
    }

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      filters.userCoords = { latitude: lat, longitude: lng };
    }

    const data = await SearchService.search({
      query,
      filters,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        source: "Karnataka Universal Discovery Index (Production Engine)",
        cached: false,
        latencyMs: data.searchDurationMs,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
