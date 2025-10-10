import { NextRequest, NextResponse } from "next/server";
import { sendGetStartedNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, churchName, location, phone, message } = body;

    // Validate required fields
    if (!name || !email || !churchName || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Send notification email to main admin
    const emailSent = await sendGetStartedNotification(
      name,
      email,
      churchName,
      location,
      phone,
      message
    );

    if (!emailSent) {
      console.warn("Email notification failed, but request was received");
    }

    return NextResponse.json(
      {
        message: "Request submitted successfully. We'll be in touch soon!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Get Started API] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit request. Please try again." },
      { status: 500 }
    );
  }
}
