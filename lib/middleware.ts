import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "./auth";

/**
 * Rate limiting store (in production, use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiting middleware
 */
export function rateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Clean up expired records
  if (record && now > record.resetAt) {
    rateLimitStore.delete(identifier);
  }

  const current = rateLimitStore.get(identifier);

  if (!current) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxAttempts) {
    return false;
  }

  current.count++;
  return true;
}

/**
 * Get rate limit info
 */
export function getRateLimitInfo(identifier: string) {
  const record = rateLimitStore.get(identifier);
  if (!record) {
    return { attempts: 0, resetAt: null };
  }
  return { attempts: record.count, resetAt: new Date(record.resetAt) };
}

/**
 * Authentication middleware for API routes
 */
export function authenticateRequest(request: NextRequest): {
  authenticated: boolean;
  admin?: JWTPayload;
  error?: string;
} {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, error: "No token provided" };
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return { authenticated: false, error: "Invalid or expired token" };
  }

  // Check if it's a session token (not a temp token for OTP verification)
  if (payload.type === "temp") {
    return { authenticated: false, error: "Invalid token type" };
  }

  return { authenticated: true, admin: payload };
}

/**
 * Helper to create error responses
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Helper to create success responses
 */
export function successResponse(
  data: Record<string, unknown>,
  status: number = 200
) {
  return NextResponse.json(data, { status });
}
