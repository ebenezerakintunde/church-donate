import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Church from "@/models/Church";
import { generateChurchId } from "@/lib/idGenerator";
import { generateQRCode } from "@/lib/generateQr";
import { generateSlug, generateUniqueSlug } from "@/lib/slugGenerator";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/middleware";

const BASE_URL = process.env.BASE_URL || "http://localhost:3010";

/**
 * GET /api/church - List all churches
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    await connectDB();

    const churches = await Church.find().sort({ createdAt: -1 });

    return successResponse({
      churches,
      count: churches.length,
    });
  } catch (error) {
    console.error("Error fetching churches:", error);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * POST /api/church - Create a new church
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return errorResponse(auth.error || "Unauthorized", 401);
    }

    await connectDB();

    const body = await request.json();
    const { name, nickname, country, address, description, logo, bankDetails } =
      body;

    // Validate required fields
    if (!name || !country || !address || !description || !bankDetails) {
      return errorResponse("Missing required fields", 400);
    }

    if (!bankDetails.accountName || !bankDetails.bankName) {
      return errorResponse("Bank name and account name are required", 400);
    }

    // Validate that at least one payment method is provided
    if (
      !bankDetails.iban &&
      !bankDetails.accountNumber &&
      !bankDetails.revolutLink
    ) {
      return errorResponse(
        "At least one payment method required (IBAN, Account Number, or Revolut Link)",
        400
      );
    }

    // Generate unique public ID
    const publicId = generateChurchId();

    // Generate unique slug from church name
    const baseSlug = generateSlug(name);
    const slug = generateUniqueSlug(baseSlug);

    // Generate QR code
    const qrCodePath = await generateQRCode(publicId, BASE_URL);

    // Create church
    const church = await Church.create({
      name,
      nickname,
      slug,
      publicId,
      country,
      address,
      description,
      logo,
      bankDetails,
      qrCodePath,
    });

    return successResponse(
      {
        message: "Church created successfully",
        church,
      },
      201
    );
  } catch (error: unknown) {
    console.error("Error creating church:", error);

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
