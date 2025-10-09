import { NextRequest } from "next/server";
import { uploadChurchLogoToCloudinary } from "@/lib/cloudinary";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/middleware";

/**
 * POST /api/upload/logo - Upload a church logo to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    const body = await request.json();
    const { imageData, publicId, version } = body;

    if (!imageData || !publicId) {
      return errorResponse("Image data and publicId are required", 400);
    }

    // Validate that imageData is a base64 data URL
    if (!imageData.startsWith("data:image/")) {
      return errorResponse("Invalid image data format", 400);
    }

    // Upload to Cloudinary with optional version (church's updatedAt timestamp)
    const logoUrl = await uploadChurchLogoToCloudinary(
      imageData,
      publicId,
      version
    );

    return successResponse({
      message: "Logo uploaded successfully",
      logoUrl,
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    return errorResponse("Failed to upload logo", 500);
  }
}
