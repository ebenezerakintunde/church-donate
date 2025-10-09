import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import connectDB from "@/lib/db";
import Admin, { AdminStatus } from "@/models/Admin";
import { sendAdminInvite } from "@/lib/email";
import crypto from "crypto";

/**
 * POST /api/admin/invite
 * Send an invitation to a new admin (protected)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Check if requesting admin is the main admin
    const requestingAdmin = await Admin.findById(authResult.admin?.adminId);
    if (!requestingAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mainAdminEmail = process.env.MAIN_ADMIN;
    const isMainAdmin =
      mainAdminEmail &&
      requestingAdmin.email.toLowerCase() === mainAdminEmail.toLowerCase();

    if (!isMainAdmin) {
      return NextResponse.json(
        { error: "Only the main administrator can invite new admins" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: name, email" },
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

    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin with this email already exists" },
        { status: 400 }
      );
    }

    // Generate unique invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create pending admin
    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase(),
      status: AdminStatus.PENDING,
      inviteToken,
      inviteTokenExpiry,
    });

    // Send invitation email
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/admin/invite/${inviteToken}`;

    try {
      await sendAdminInvite(email, name, inviteUrl);
    } catch (emailError) {
      console.error("Error sending invite email:", emailError);
      // Don't fail the whole operation if email fails
      // In development, log the invite URL
      console.log(`📧 Invite URL for ${email}: ${inviteUrl}`);
    }

    // Return admin without sensitive data
    const adminData = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      status: newAdmin.status,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    };

    return NextResponse.json(
      {
        message: "Admin invitation sent successfully",
        admin: adminData,
        inviteUrl:
          process.env.NODE_ENV === "development" ? inviteUrl : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending admin invite:", error);
    return NextResponse.json(
      { error: "Failed to send admin invitation" },
      { status: 500 }
    );
  }
}
