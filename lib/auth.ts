import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable inside .env.local"
  );
}

export interface JWTPayload {
  adminId: string;
  email: string;
  type?: "temp" | "session";
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(
  payload: JWTPayload,
  expiresIn: string | number = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store for OTPs (in production, use Redis or database)
 * Format: { email: { otp: string, expiresAt: number } }
 */
declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

const otpStore =
  global.otpStore || new Map<string, { otp: string; expiresAt: number }>();

if (!global.otpStore) {
  global.otpStore = otpStore;
}

/**
 * Store an OTP for an email (expires in 10 minutes)
 */
export function storeOTP(email: string, otp: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { otp, expiresAt });
}

/**
 * Verify an OTP for an email
 */
export function verifyOTP(email: string, otp: string): boolean {
  // Debug: Show all stored OTPs
  console.log("📋 OTP Store contents:", Array.from(otpStore.keys()));

  const stored = otpStore.get(email);

  if (!stored) {
    console.log("❌ No OTP found for:", email);
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    console.log("❌ OTP expired for:", email);
    otpStore.delete(email);
    return false;
  }

  // Trim whitespace from both OTPs for comparison
  const storedOTP = stored.otp.trim();
  const inputOTP = otp.trim();

  console.log("🔍 Comparing OTPs - Stored:", storedOTP, "Input:", inputOTP);

  if (storedOTP !== inputOTP) {
    console.log("❌ OTP mismatch");
    return false;
  }

  // OTP is valid, remove it
  otpStore.delete(email);
  console.log("✅ OTP verified successfully");
  return true;
}

/**
 * Clean up expired OTPs (call this periodically)
 */
export function cleanupExpiredOTPs(): void {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}
