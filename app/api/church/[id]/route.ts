import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Church from "@/models/Church";
import { deleteQRCode } from "@/lib/generateQr";
import { deleteChurchLogoFromCloudinary } from "@/lib/cloudinary";
import { generateSlug, generateUniqueSlug } from "@/lib/slugGenerator";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/middleware";

/**
 * GET /api/church/[id] - Get a single church
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    await connectDB();

    const church = await Church.findById(id);

    if (!church) {
      return errorResponse("Church not found", 404);
    }

    return successResponse({ church });
  } catch (error) {
    console.error("Error fetching church:", error);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * PUT /api/church/[id] - Update a church
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      nickname,
      country,
      address,
      description,
      logo,
      managerEmails,
      bankDetails,
    } = body;

    // Find existing church
    const existingChurch = await Church.findById(id);

    if (!existingChurch) {
      return errorResponse("Church not found", 404);
    }

    // Prepare update data
    const updateData: {
      name: string;
      nickname?: string;
      country: string;
      address: string;
      description: string;
      logo?: string;
      managerEmails?: string[];
      bankDetails: typeof existingChurch.bankDetails;
      slug?: string;
    } = {
      name: name || existingChurch.name,
      nickname: nickname !== undefined ? nickname : existingChurch.nickname,
      country: country || existingChurch.country,
      address: address || existingChurch.address,
      description: description || existingChurch.description,
      logo: logo !== undefined ? logo : existingChurch.logo,
      managerEmails:
        managerEmails !== undefined
          ? managerEmails
          : existingChurch.managerEmails,
      bankDetails: bankDetails || existingChurch.bankDetails,
    };

    // If name changed, regenerate slug
    if (name && name !== existingChurch.name) {
      const baseSlug = generateSlug(name);
      updateData.slug = generateUniqueSlug(baseSlug);
    }

    // Update church (publicId and qrCodePath never change)
    const updatedChurch = await Church.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return successResponse({
      message: "Church updated successfully",
      church: updatedChurch,
    });
  } catch (error: unknown) {
    console.error("Error updating church:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse("A church with this ID already exists", 400);
    }

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const errMsg =
        "message" in error && typeof error.message === "string"
          ? error.message
          : "Validation error";
      return errorResponse(errMsg, 400);
    }

    return errorResponse("Internal server error", 500);
  }
}

/**
 * DELETE /api/church/[id] - Delete a church
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    await connectDB();

    const church = await Church.findById(id);

    if (!church) {
      return errorResponse("Church not found", 404);
    }

    // Delete QR code from Cloudinary (if publicId exists)
    if (church.publicId) {
      await deleteQRCode(church.publicId);
      // Also delete logo from Cloudinary
      await deleteChurchLogoFromCloudinary(church.publicId);
    }

    // Delete church
    await Church.findByIdAndDelete(id);

    return successResponse({
      message: "Church deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting church:", error);
    return errorResponse("Internal server error", 500);
  }
}
