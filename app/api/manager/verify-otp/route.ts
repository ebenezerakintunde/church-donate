import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Use the same in-memory store from login (in production, use Redis)
type OtpStoreValue = { otp: string; createdAt: number; attempts: number };
type GlobalWithOtpStore = typeof globalThis & {
  managerOtpStore?: Map<string, OtpStoreValue>;
};

const otpStore = new Map<string, OtpStoreValue>();

// This is a shared reference to the same Map instance used in login
// In production, this should be a shared store like Redis
if (typeof globalThis !== "undefined") {
  if (!(globalThis as GlobalWithOtpStore).managerOtpStore) {
    (globalThis as GlobalWithOtpStore).managerOtpStore = otpStore;
  }
}

const sharedOtpStore = (globalThis as GlobalWithOtpStore)
  .managerOtpStore as Map<string, OtpStoreValue>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tempToken, otp } = body;

    if (!tempToken || !otp) {
      return NextResponse.json(
        { error: "Temporary token and OTP are required" },
        { status: 400 }
      );
    }

    // Verify temp token
    let decoded: { email: string; type: string };
    try {
      const result = jwt.verify(tempToken, JWT_SECRET);
      decoded = result as { email: string; type: string };
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (decoded.type !== "manager-otp") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      );
    }

    const email = decoded.email;
    const stored = sharedOtpStore.get(email);

    if (!stored) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 401 }
      );
    }

    // Check if OTP expired (10 minutes)
    const now = Date.now();
    if (now - stored.createdAt > 10 * 60 * 1000) {
      sharedOtpStore.delete(email);
      return NextResponse.json({ error: "OTP has expired" }, { status: 401 });
    }

    // Check max attempts (5)
    if (stored.attempts >= 5) {
      sharedOtpStore.delete(email);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 401 }
      );
    }

    // Verify OTP
    if (stored.otp !== otp) {
      stored.attempts += 1;
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 401 });
    }

    // OTP is valid - delete it
    sharedOtpStore.delete(email);

    // Create session token (1 hour expiry)
    const token = jwt.sign(
      {
        email,
        type: "manager",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      email,
    });
  } catch (error) {
    console.error("[Manager Verify OTP] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
