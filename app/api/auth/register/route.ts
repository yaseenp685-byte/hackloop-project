import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { RegisterSchema } from "@/lib/validation/auth.schema";
import { handleApiError } from "@/lib/errors/AppError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);
    const result = await AuthService.register(validated);

    const response = NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );

    // Set HTTP-only secure cookie for web browser sessions
    response.cookies.set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
