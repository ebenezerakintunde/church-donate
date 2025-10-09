import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import connectDB from "@/lib/db";
import Admin, { AdminStatus } from "@/models/Admin";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin
 * Get all admin users (protected)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all admins, excluding passwords
    const admins = await Admin.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    // Get main admin email from environment
    const mainAdminEmail = process.env.MAIN_ADMIN;

    // Add isMainAdmin flag and ensure status is set for each admin
    const adminsWithFlags = admins.map((admin) => {
      const adminObj = admin.toObject();
      return {
        ...adminObj,
        status: adminObj.status || AdminStatus.ACTIVE, // Default to active for existing admins
        isMainAdmin:
          mainAdminEmail &&
          admin.email.toLowerCase() === mainAdminEmail.toLowerCase(),
      };
    });

    return NextResponse.json({
      admins: adminsWithFlags,
      count: adminsWithFlags.length,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin
 * Create a new admin user (protected)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Return admin without password
    const adminData = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    };

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: adminData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
