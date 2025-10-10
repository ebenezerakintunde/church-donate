import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Church from "@/models/Church";
import { authenticateManagerRequest } from "@/lib/managerAuth";

/**
 * GET /api/manager/church/[id] - Get a single church (if manager has access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate
    const auth = authenticateManagerRequest(request);
    if (!auth.authenticated || !auth.email) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const church = await Church.findById(id);

    if (!church) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 });
    }

    // Check if this manager has access to this church
    if (!church.managerEmails || !church.managerEmails.includes(auth.email)) {
      return NextResponse.json(
        { error: "You don't have access to this church" },
        { status: 403 }
      );
    }

    return NextResponse.json({ church });
  } catch (error) {
    console.error("[Manager Get Church] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/manager/church/[id] - Update a church (if manager has access)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate
    const auth = authenticateManagerRequest(request);
    if (!auth.authenticated || !auth.email) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const existingChurch = await Church.findById(id);

    if (!existingChurch) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 });
    }

    // Check if this manager has access to this church
    if (
      !existingChurch.managerEmails ||
      !existingChurch.managerEmails.includes(auth.email)
    ) {
      return NextResponse.json(
        { error: "You don't have access to this church" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      nickname,
      country,
      address,
      description,
      logo,
      themeColor,
      managerEmails,
      bankDetails,
    } = body;

    // Validate that manager isn't removing themselves
    if (managerEmails && Array.isArray(managerEmails)) {
      if (!managerEmails.includes(auth.email)) {
        return NextResponse.json(
          {
            error:
              "You cannot remove yourself as a manager. Another manager or admin must remove you.",
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data (managers can't change publicId, slug, or qrCodePath)
    const updateData: {
      name: string;
      nickname?: string;
      country: string;
      address: string;
      description: string;
      logo?: string;
      themeColor?: string;
      managerEmails?: string[];
      bankDetails: typeof existingChurch.bankDetails;
    } = {
      name: name || existingChurch.name,
      nickname: nickname !== undefined ? nickname : existingChurch.nickname,
      country: country || existingChurch.country,
      address: address || existingChurch.address,
      description: description || existingChurch.description,
      logo: logo !== undefined ? logo : existingChurch.logo,
      themeColor:
        themeColor !== undefined ? themeColor : existingChurch.themeColor,
      managerEmails:
        managerEmails !== undefined
          ? managerEmails
          : existingChurch.managerEmails,
      bankDetails: bankDetails || existingChurch.bankDetails,
    };

    // Update church
    const updatedChurch = await Church.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Church updated successfully",
      church: updatedChurch,
    });
  } catch (error: unknown) {
    console.error("[Manager Update Church] Error:", error);

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
      return NextResponse.json({ error: errMsg }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
