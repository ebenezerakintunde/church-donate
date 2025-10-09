import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Church from "@/models/Church";
import { errorResponse, successResponse } from "@/lib/middleware";

/**
 * GET /api/public/church/[id] - Get church details by public ID (public endpoint)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const church = await Church.findOne({ publicId: id });

    if (!church) {
      return errorResponse("Church not found", 404);
    }

    // Increment view count
    await Church.findByIdAndUpdate(church._id, { $inc: { viewCount: 1 } });

    return successResponse({ church });
  } catch (error) {
    console.error("Error fetching church:", error);
    return errorResponse("Internal server error", 500);
  }
}
