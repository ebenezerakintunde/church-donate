import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import {
  comparePassword,
  generateToken,
  generateOTP,
  storeOTP,
} from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";
import { rateLimit, errorResponse, successResponse } from "@/lib/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    // Rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = `login:${email}:${clientIp}`;

    if (!rateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      return errorResponse(
        "Too many login attempts. Please try again in 15 minutes.",
        429
      );
    }

    // Connect to database
    await connectDB();

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return errorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, admin.password);

    if (!isValidPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate OTP
    const otp = generateOTP();
    // Use admin.email from database to ensure consistency
    storeOTP(admin.email, otp);
    console.log(`🔑 OTP stored for: ${admin.email} - Code: ${otp}`);

    // Send OTP via email
    await sendOTPEmail(admin.email, otp);

    // Generate temporary token (valid for 10 minutes, only for OTP verification)
    const tempToken = generateToken(
      {
        adminId: admin._id.toString(),
        email: admin.email,
        type: "temp",
      },
      "10m"
    );

    return successResponse({
      message: "OTP sent to your email",
      tempToken,
      email: admin.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
