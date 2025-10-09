import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.warn(
    "⚠️  RESEND_API_KEY is not set. Email functionality will not work."
  );
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Send OTP email to admin
 */
export async function sendOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  if (!resend) {
    console.error("Resend is not configured. Cannot send OTP email.");
    // In development, log the OTP to console
    console.log(`📧 OTP for ${email}: ${otp}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: "ChurchDonate <onboarding@resend.dev>", // Update this with your verified domain
      to: email,
      subject: "Your ChurchDonate Login Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">⛪ ChurchDonate</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Your Login Code</h2>
              <p>Hello,</p>
              <p>You requested to log in to ChurchDonate Admin Dashboard. Use the code below to complete your login:</p>
              <div style="background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
                <h1 style="color: #667eea; margin: 0; font-size: 36px; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
              </div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                This is an automated email from ChurchDonate. Please do not reply to this message.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    // In development, log the OTP to console as fallback
    console.log(`📧 OTP for ${email}: ${otp}`);
    return false;
  }
}
