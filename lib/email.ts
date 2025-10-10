import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "ChurchDonate";
const EMAIL_FROM_EMAIL =
  process.env.EMAIL_FROM_EMAIL || "onboarding@resend.dev";
const EMAIL_FROM = `${EMAIL_FROM_NAME} <${EMAIL_FROM_EMAIL}>`;

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
      from: EMAIL_FROM,
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
            <div style="background: linear-gradient(135deg, #5b21b6 0%, #7e22ce 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${
                process.env.BASE_URL || "https://churchdonate.org"
              }/logos/full-logo.svg" alt="ChurchDonate" style="height: 40px; width: auto;" />
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Your Login Code</h2>
              <p>Hello,</p>
              <p>You requested to log in to ChurchDonate Admin Dashboard. Use the code below to complete your login:</p>
              <div style="background: white; border: 2px dashed #7e22ce; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
                <h1 style="color: #7e22ce; margin: 0; font-size: 36px; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
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

/**
 * Send admin invitation email
 */
export async function sendAdminInvite(
  email: string,
  name: string,
  inviteUrl: string
): Promise<boolean> {
  if (!resend) {
    console.error("Resend is not configured. Cannot send invitation email.");
    // In development, log the invite URL to console
    console.log(`📧 Admin invitation for ${email} (${name}): ${inviteUrl}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "You've been invited to ChurchDonate Admin",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5b21b6 0%, #7e22ce 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${
                process.env.BASE_URL || "https://churchdonate.org"
              }/logos/full-logo.svg" alt="ChurchDonate" style="height: 40px; width: auto;" />
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Admin Invitation</h2>
              <p>Hello ${name},</p>
              <p>You've been invited to join ChurchDonate as an administrator. Click the button below to set up your account and create your password.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteUrl}" style="background: #7e22ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Accept Invitation</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <div style="background: white; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 8px; word-break: break-all; font-size: 14px; color: #7e22ce;">
                ${inviteUrl}
              </div>
              <p><strong>This invitation will expire in 7 days.</strong></p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                This is an automated email from ChurchDonate. Please do not reply to this message.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Admin invitation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    // In development, log the invite URL to console as fallback
    console.log(`📧 Admin invitation for ${email} (${name}): ${inviteUrl}`);
    return false;
  }
}

/**
 * Send get started notification to main admin
 */
export async function sendGetStartedNotification(
  name: string,
  email: string,
  churchName: string,
  location: string,
  phone?: string,
  message?: string
): Promise<boolean> {
  if (!resend) {
    console.error("Resend is not configured. Cannot send notification email.");
    // In development, log the details to console
    console.log(`📧 Get Started Request:`, {
      name,
      email,
      churchName,
      location,
      phone,
      message,
    });
    return false;
  }

  const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN || "admin@churchdonate.org";

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: MAIN_ADMIN_EMAIL,
      replyTo: email,
      subject: `New Church Profile Request - ${churchName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5b21b6 0%, #7e22ce 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${
                process.env.BASE_URL || "https://churchdonate.org"
              }/logos/full-logo.svg" alt="ChurchDonate" style="height: 40px; width: auto;" />
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">New Church Profile Request</h2>
              <p>A church administrator has requested to get started with ChurchDonate.</p>
              
              <div style="background: white; border-left: 4px solid #7e22ce; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #7e22ce;">Contact Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #7e22ce;">${email}</a></p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
              </div>

              <div style="background: white; border-left: 4px solid #5b21b6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #5b21b6;">Church Information</h3>
                <p><strong>Church Name:</strong> ${churchName}</p>
                <p><strong>Location:</strong> ${location}</p>
              </div>

              ${
                message
                  ? `
              <div style="background: white; border-left: 4px solid #48bb78; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #48bb78;">Additional Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              `
                  : ""
              }

              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666;">Please follow up with this request to set up their church profile.</p>
              </div>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                This is an automated notification from ChurchDonate.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Get started notification sent to ${MAIN_ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error("Failed to send get started notification:", error);
    // In development, log the details to console as fallback
    console.log(`📧 Get Started Request:`, {
      name,
      email,
      churchName,
      location,
      phone,
      message,
    });
    return false;
  }
}

/**
 * Send OTP email to manager
 */
export async function sendManagerOTPEmail(
  email: string,
  otp: string
): Promise<boolean> {
  if (!resend) {
    console.error("Resend is not configured. Cannot send manager OTP email.");
    // In development, log the OTP to console
    console.log(`📧 Manager OTP for ${email}: ${otp}`);
    return false;
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Your ChurchDonate Manager Login Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5b21b6 0%, #7e22ce 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${
                process.env.BASE_URL || "https://churchdonate.org"
              }/logos/full-logo.svg" alt="ChurchDonate" style="height: 40px; width: auto;" />
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Your Manager Login Code</h2>
              <p>Hello,</p>
              <p>You requested to log in to manage your church profiles. Use the code below to access your dashboard:</p>
              <div style="background: white; border: 2px dashed #7e22ce; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
                <h1 style="color: #7e22ce; margin: 0; font-size: 36px; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
              </div>
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>Your session will last for 1 hour after logging in.</p>
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

    console.log(`✅ Manager OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send manager OTP email:", error);
    // In development, log the OTP to console as fallback
    console.log(`📧 Manager OTP for ${email}: ${otp}`);
    return false;
  }
}
