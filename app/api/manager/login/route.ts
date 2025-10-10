import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Church from "@/models/Church";
import { sendManagerOTPEmail } from "@/lib/email";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// In-memory store for OTPs (in production, use Redis)
// Shared globally across API routes
type OtpStoreValue = { otp: string; createdAt: number; attempts: number };
type GlobalWithOtpStore = typeof globalThis & {
  managerOtpStore?: Map<string, OtpStoreValue>;
};

if (typeof globalThis !== "undefined") {
  if (!(globalThis as GlobalWithOtpStore).managerOtpStore) {
    (globalThis as GlobalWithOtpStore).managerOtpStore = new Map<
      string,
      OtpStoreValue
    >();
  }
}
const otpStore = (globalThis as GlobalWithOtpStore).managerOtpStore as Map<
  string,
  OtpStoreValue
>;

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired OTPs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (now - value.createdAt > 10 * 60 * 1000) {
      // 10 minutes
      otpStore.delete(key);
    }
  }
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting: 5 attempts per 5 minutes
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `${normalizedEmail}-${clientIp}`;
    const rateLimit = rateLimitStore.get(rateLimitKey);
    const now = Date.now();

    if (rateLimit) {
      if (rateLimit.count >= 5 && now < rateLimit.resetAt) {
        const waitTime = Math.ceil((rateLimit.resetAt - now) / 1000 / 60);
        return NextResponse.json(
          {
            error: `Too many attempts. Please try again in ${waitTime} minute${
              waitTime > 1 ? "s" : ""
            }.`,
          },
          { status: 429 }
        );
      } else if (now >= rateLimit.resetAt) {
        rateLimitStore.delete(rateLimitKey);
      }
    }

    // Check if email is a manager for any church
    await connectDB();
    const churches = await Church.find({
      managerEmails: normalizedEmail,
    }).lean();

    if (!churches || churches.length === 0) {
      // Update rate limit
      const existing = rateLimitStore.get(rateLimitKey);
      if (existing && now < existing.resetAt) {
        existing.count += 1;
      } else {
        rateLimitStore.set(rateLimitKey, {
          count: 1,
          resetAt: now + 5 * 60 * 1000, // 5 minutes
        });
      }

      return NextResponse.json(
        { error: "No church profiles found for this email" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    otpStore.set(normalizedEmail, {
      otp,
      createdAt: now,
      attempts: 0,
    });

    // Update rate limit
    const existing = rateLimitStore.get(rateLimitKey);
    if (existing && now < existing.resetAt) {
      existing.count += 1;
    } else {
      rateLimitStore.set(rateLimitKey, {
        count: 1,
        resetAt: now + 5 * 60 * 1000,
      });
    }

    // Send OTP email
    await sendManagerOTPEmail(normalizedEmail, otp);

    // Create temporary token
    const tempToken = jwt.sign(
      { email: normalizedEmail, type: "manager-otp" },
      JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return NextResponse.json({
      message: "Login code sent to your email",
      tempToken,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("[Manager Login] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
