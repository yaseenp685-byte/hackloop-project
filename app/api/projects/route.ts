import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project.service";
import { authenticateRequest, optionalAuthenticateRequest } from "@/lib/auth/middleware";
import { CreateProjectSchema } from "@/lib/validation/project.schema";
import { handleApiError } from "@/lib/errors/AppError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await optionalAuthenticateRequest(req);
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const sort = (searchParams.get("sort") as "recent" | "likes" | "views") || "recent";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const result = await ProjectService.list(
      { search, category, sort, page, limit },
      user?.userId
    );

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const body = await req.json();
    const validated = CreateProjectSchema.parse(body);

    const project = await ProjectService.create(user.userId, validated);

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
