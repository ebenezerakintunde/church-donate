import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface ManagerAuthResult {
  authenticated: boolean;
  email?: string;
  error?: string;
}

/**
 * Authenticate manager request
 */
export function authenticateManagerRequest(
  request: NextRequest
): ManagerAuthResult {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authenticated: false,
        error: "No authentication token provided",
      };
    }

    const token = authHeader.substring(7);

    try {
      const result = jwt.verify(token, JWT_SECRET);
      const decoded = result as { email: string; type: string };

      if (decoded.type !== "manager") {
        return {
          authenticated: false,
          error: "Invalid token type",
        };
      }

      return {
        authenticated: true,
        email: decoded.email,
      };
    } catch {
      return {
        authenticated: false,
        error: "Invalid or expired token",
      };
    }
  } catch {
    return {
      authenticated: false,
      error: "Authentication failed",
    };
  }
}
