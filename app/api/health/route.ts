import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";

/**
 * Public health check endpoint
 * - Verifies MongoDB connection
 * - Verifies Cloudinary connectivity (api.ping)
 * - Writes a heartbeat document to MongoDB to prevent inactivity shutdown
 */
export async function GET() {
  const results: {
    mongo?: string;
    cloudinary?: string;
    heartbeatId?: string;
    error?: string;
  } = {};

  try {
    // MongoDB connectivity
    await connectDB();
    results.mongo = "ok";

    // Cloudinary connectivity
    try {
      const ping = await cloudinary.api.ping();
      results.cloudinary = ping?.status || "ok";
    } catch (err) {
      results.cloudinary = "failed";
      results.error = `Cloudinary ping failed: ${
        err instanceof Error ? err.message : String(err)
      }`;
    }

    // Heartbeat write to keep MongoDB active
    try {
      const collection = mongoose.connection.db.collection("healthchecks");
      const insertResult = await collection.insertOne({
        message: "health-ok",
        checkedAt: new Date(),
      });
      results.heartbeatId = insertResult.insertedId.toString();
    } catch (err) {
      results.error = `Heartbeat write failed: ${
        err instanceof Error ? err.message : String(err)
      }`;
    }

    return NextResponse.json({
      status: "ok",
      ...results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        ...results,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

