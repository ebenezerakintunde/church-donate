import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin, { AdminStatus } from "@/models/Admin";
import bcrypt from "bcryptjs";

/**
 * POST /api/admin/accept-invite
 * Accept an admin invitation and set password
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    // Validate required fields
    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing required fields: token, password" },
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

    // Find admin by invite token
    const admin = await Admin.findOne({
      inviteToken: token,
      status: AdminStatus.PENDING,
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (admin.inviteTokenExpiry && admin.inviteTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update admin: set password, clear invite token, activate account
    admin.password = hashedPassword;
    admin.status = AdminStatus.ACTIVE;
    admin.inviteToken = undefined;
    admin.inviteTokenExpiry = undefined;
    await admin.save();

    return NextResponse.json({
      message: "Account activated successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/accept-invite?token=xxx
 * Verify if an invitation token is valid
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await connectDB();

    // Find admin by invite token
    const admin = await Admin.findOne({
      inviteToken: token,
      status: AdminStatus.PENDING,
    }).select("name email inviteTokenExpiry");

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (admin.inviteTokenExpiry && admin.inviteTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error verifying invite:", error);
    return NextResponse.json(
      { error: "Failed to verify invitation" },
      { status: 500 }
    );
  }
}
