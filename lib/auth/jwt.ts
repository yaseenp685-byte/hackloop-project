import jwt from "jsonwebtoken";
import { AppError } from "@/lib/errors/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "karnataka_hackathon_dev_secret_key_super_secure_2026_xyz";
const JWT_EXPIRES_IN = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "STUDENT" | "ORGANIZER" | "ADMIN" | "JUDGE" | "COMMUNITY_COORDINATOR";
  name: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw AppError.unauthorized("Authentication token expired. Please sign in again.");
    }
    throw AppError.unauthorized("Invalid authentication token.");
  }
}
