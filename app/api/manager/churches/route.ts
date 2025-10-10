import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Church from "@/models/Church";
import { authenticateManagerRequest } from "@/lib/managerAuth";

/**
 * GET /api/manager/churches - Get all churches managed by this manager
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate
    const auth = authenticateManagerRequest(request);
    if (!auth.authenticated || !auth.email) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find all churches where this email is a manager
    const churches = await Church.find({
      managerEmails: auth.email,
    })
      .select("-__v") // Exclude version key
      .sort({ name: 1 });

    return NextResponse.json({
      churches,
      count: churches.length,
    });
  } catch (error) {
    console.error("[Manager Churches] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
