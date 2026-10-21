import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";
import { AppError } from "@/lib/errors/AppError";
import { prisma } from "@/lib/db";

export async function authenticateRequest(req: NextRequest): Promise<TokenPayload> {
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Also check secure auth cookie if present
    const cookieToken = req.cookies.get("auth_token")?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) {
    throw AppError.unauthorized("Authentication token is required to access this resource.");
  }

  const payload = verifyToken(token);

  // Verify in database that account is still active and not banned/disabled
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, isActive: true, role: true },
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized("User account is inactive or no longer exists.");
  }

  // Ensure role has not been demoted since token issuance
  if (user.role !== payload.role) {
    payload.role = user.role as any;
  }

  return payload;
}

export async function optionalAuthenticateRequest(req: NextRequest): Promise<TokenPayload | null> {
  try {
    return await authenticateRequest(req);
  } catch {
    return null;
  }
}

export function requireRole(user: TokenPayload, allowedRoles: string[]) {
  if (!allowedRoles.includes(user.role)) {
    throw AppError.forbidden(
      `Access denied. Requires one of [${allowedRoles.join(", ")}], but account role is ${user.role}.`
    );
  }
}

export function requireSelfOrAdmin(user: TokenPayload, targetUserId: string) {
  if (user.role === "ADMIN") return;
  if (user.userId !== targetUserId) {
    throw AppError.forbidden("Access denied: You are not authorized to modify another user's data.");
  }
}
