import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

/**
 * DELETE /api/admin/[id]
 * Delete an admin user (protected, with safeguards)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authResult = authenticateRequest(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    // Get requesting admin
    const requestingAdmin = await Admin.findById(authResult.admin?.adminId);
    if (!requestingAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin to delete exists
    const adminToDelete = await Admin.findById(id);
    if (!adminToDelete) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Check if requesting admin is the main admin
    const mainAdminEmail = process.env.MAIN_ADMIN;
    const isMainAdmin =
      mainAdminEmail &&
      requestingAdmin.email.toLowerCase() === mainAdminEmail.toLowerCase();

    // If NOT main admin, they can only delete their own account
    if (!isMainAdmin && authResult.admin?.adminId !== id) {
      return NextResponse.json(
        { error: "You can only delete your own account" },
        { status: 403 }
      );
    }

    // Prevent deletion of the main admin account
    if (
      mainAdminEmail &&
      adminToDelete.email.toLowerCase() === mainAdminEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Cannot delete the main administrator account" },
        { status: 400 }
      );
    }

    // Count total admins
    const adminCount = await Admin.countDocuments();

    // Prevent deletion of the last admin
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }

    // Main admin cannot delete themselves
    if (isMainAdmin && authResult.admin?.adminId === id) {
      return NextResponse.json(
        {
          error: "Main admin cannot delete their own account",
        },
        { status: 400 }
      );
    }

    // Delete the admin
    await Admin.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
