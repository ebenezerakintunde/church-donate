import QRCode from "qrcode";
import {
  uploadQrCodeToCloudinary,
  deleteQrCodeFromCloudinary,
} from "./cloudinary";

/**
 * Generates a QR code for a church donation page and uploads to Cloudinary
 * @param publicId - The unique public ID for the church
 * @param baseUrl - The base URL of the application
 * @returns The Cloudinary URL of the uploaded QR code image
 */
export async function generateQRCode(
  publicId: string,
  baseUrl: string
): Promise<string> {
  try {
    // Add source=qr parameter to track QR scans separately
    const donationUrl = `${baseUrl}/church/${publicId}?source=qr`;

    // Generate QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(donationUrl, {
      width: 1000,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadQrCodeToCloudinary(
      qrCodeDataUrl,
      publicId
    );

    return cloudinaryUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Deletes a QR code from Cloudinary
 * @param publicId - The church's unique public ID
 */
export async function deleteQRCode(publicId: string): Promise<void> {
  try {
    await deleteQrCodeFromCloudinary(publicId);
  } catch (error) {
    console.error("Error deleting QR code:", error);
  }
}
