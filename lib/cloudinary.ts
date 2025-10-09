import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload a QR code image to Cloudinary
 * @param dataUrl - Base64 data URL of the QR code
 * @param publicId - The church's unique public ID
 * @param version - Optional timestamp for cache busting (defaults to current time)
 * @returns The secure URL of the uploaded image
 */
export async function uploadQrCodeToCloudinary(
  dataUrl: string,
  publicId: string,
  version?: number
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "churchdonate/qrcodes",
      public_id: publicId,
      overwrite: true,
      invalidate: true, // Invalidate CDN cache on overwrite
      resource_type: "image",
    });
    // Use provided version (church's updatedAt) or current time for cache busting
    const versionParam = version || Date.now();
    return `${result.secure_url}?v=${versionParam}`;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload QR code to Cloudinary");
  }
}

/**
 * Delete a QR code from Cloudinary
 * @param publicId - The church's unique public ID
 */
export async function deleteQrCodeFromCloudinary(
  publicId: string
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(`churchdonate/qrcodes/${publicId}`, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Don't throw - we don't want to fail church deletion if Cloudinary delete fails
  }
}

/**
 * Upload a church logo to Cloudinary
 * @param dataUrl - Base64 data URL of the logo image
 * @param publicId - The church's unique public ID
 * @param version - Optional timestamp for cache busting (defaults to current time)
 * @returns The secure URL of the uploaded image
 */
export async function uploadChurchLogoToCloudinary(
  dataUrl: string,
  publicId: string,
  version?: number
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "churchdonate/churchlogo",
      public_id: publicId,
      overwrite: true,
      invalidate: true, // Invalidate CDN cache on overwrite
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // Limit size while maintaining aspect ratio
        { quality: "auto", fetch_format: "auto" }, // Optimize quality and format
      ],
    });
    // Use provided version (church's updatedAt) or current time for cache busting
    const versionParam = version || Date.now();
    return `${result.secure_url}?v=${versionParam}`;
  } catch (error) {
    console.error("Cloudinary logo upload error:", error);
    throw new Error("Failed to upload church logo to Cloudinary");
  }
}

/**
 * Delete a church logo from Cloudinary
 * @param publicId - The church's unique public ID
 */
export async function deleteChurchLogoFromCloudinary(
  publicId: string
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(`churchdonate/churchlogo/${publicId}`, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary logo delete error:", error);
    // Don't throw - we don't want to fail church deletion if Cloudinary delete fails
  }
}

export default cloudinary;
