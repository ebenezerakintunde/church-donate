import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/middleware";

/**
 * Initial admin setup endpoint
 * This should only work if there are no admins in the database
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if any admin exists
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return errorResponse("Admin already exists. Use login instead.", 400);
    }

    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return errorResponse("Email, password, and name are required", 400);
    }

    if (password.length < 8) {
      return errorResponse("Password must be at least 8 characters", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    return successResponse(
      {
        message: "Admin created successfully",
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      },
      201
    );
  } catch (error: unknown) {
    console.error("Admin setup error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse("Email already exists", 400);
    }

    return errorResponse("Internal server error", 500);
  }
}

/**
 * Check if initial setup is needed
 */
export async function GET() {
  try {
    await connectDB();

    const adminCount = await Admin.countDocuments();

    return successResponse({
      setupNeeded: adminCount === 0,
      adminCount,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return errorResponse("Internal server error", 500);
  }
}
