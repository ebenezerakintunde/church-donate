import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { verifyToken, verifyOTP, generateToken } from "@/lib/auth";
import { rateLimit, errorResponse, successResponse } from "@/lib/middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tempToken, otp } = body;

    // Validate input
    if (!tempToken || !otp) {
      return errorResponse("Temp token and OTP are required", 400);
    }

    // Rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = `verify-otp:${clientIp}`;

    if (!rateLimit(rateLimitKey, 10, 15 * 60 * 1000)) {
      return errorResponse(
        "Too many verification attempts. Please try again later.",
        429
      );
    }

    // Verify temp token
    const payload = verifyToken(tempToken);

    if (!payload || payload.type !== "temp") {
      return errorResponse("Invalid or expired temp token", 401);
    }

    console.log(`🔍 Verifying OTP for email from token: ${payload.email}`);

    // Verify OTP
    const isValidOTP = verifyOTP(payload.email, otp);

    if (!isValidOTP) {
      return errorResponse("Invalid or expired OTP", 401);
    }

    // Connect to database
    await connectDB();

    // Get admin details
    const admin = await Admin.findById(payload.adminId).select("-password");

    if (!admin) {
      return errorResponse("Admin not found", 404);
    }

    // Generate session token (valid for 7 days)
    const sessionToken = generateToken(
      {
        adminId: admin._id.toString(),
        email: admin.email,
        type: "session",
      },
      "7d"
    );

    return successResponse({
      message: "Login successful",
      token: sessionToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return errorResponse("Internal server error", 500);
  }
}
