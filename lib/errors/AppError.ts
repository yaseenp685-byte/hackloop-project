import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, statusCode: number = 400, code: string = "BAD_REQUEST", details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message: string = "Authentication required") {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message: string = "Access denied: insufficient permissions") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message: string = "Requested resource not found") {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static conflict(message: string) {
    return new AppError(message, 409, "CONFLICT");
  }

  static internal(message: string = "An unexpected server error occurred") {
    return new AppError(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export function handleApiError(error: unknown) {
  // Re-throw Next.js dynamic rendering bail-out error so Next.js treats the route as dynamic
  if (
    typeof error === "object" &&
    error !== null &&
    ("digest" in error && (error as any).digest === "DYNAMIC_SERVER_USAGE")
  ) {
    throw error;
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request payload validation failed",
          details: error.flatten().fieldErrors,
        },
      },
      { status: 422 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Generic fallback: never expose internal error stack traces or raw SQL queries to clients
  console.error("[INTERNAL_ERROR]", error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An internal server error occurred. Please try again later.",
      },
    },
    { status: 500 }
  );
}
