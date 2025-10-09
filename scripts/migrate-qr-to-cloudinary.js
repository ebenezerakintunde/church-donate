/* eslint-disable @typescript-eslint/no-require-imports */
// Migration script to move all QR codes from local disk to Cloudinary
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

// Read .env.local manually
const envPath = ".env.local";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ChurchSchema = new mongoose.Schema(
  {
    name: String,
    publicId: String,
    qrCodePath: String,
  },
  { timestamps: true }
);

const Church = mongoose.models.Church || mongoose.model("Church", ChurchSchema);

async function migrateQrCodes() {
  try {
    console.log("🚀 Starting QR code migration to Cloudinary...\n");

    // Check Cloudinary config
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("❌ Error: Cloudinary credentials not found in .env.local");
      console.log("   Please add:");
      console.log("   - CLOUDINARY_CLOUD_NAME");
      console.log("   - CLOUDINARY_API_KEY");
      console.log("   - CLOUDINARY_API_SECRET");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const churches = await Church.find({}).lean();
    console.log(`Found ${churches.length} churches\n`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const church of churches) {
      const churchName = church.name;
      const qrCodePath = church.qrCodePath;
      const publicId = church.publicId;

      console.log(`Processing: ${churchName}`);
      console.log(`  Current QR Path: ${qrCodePath}`);
      console.log(`  Public ID: ${publicId || "N/A"}`);

      // Skip if already on Cloudinary
      if (qrCodePath && qrCodePath.startsWith("https://res.cloudinary.com")) {
        console.log("  ⏭️  Already on Cloudinary - skipping\n");
        skippedCount++;
        continue;
      }

      // Skip if no publicId
      if (!publicId) {
        console.log("  ⚠️  No publicId - skipping (needs manual fix)\n");
        skippedCount++;
        continue;
      }

      // Try to find the local QR code file
      let localFilePath;
      if (qrCodePath) {
        // Remove leading slash if present
        const relativePath = qrCodePath.startsWith("/")
          ? qrCodePath.substring(1)
          : qrCodePath;
        localFilePath = path.join(process.cwd(), "public", relativePath);
      } else {
        // Try common path
        localFilePath = path.join(
          process.cwd(),
          "public",
          "qrcodes",
          `${publicId}.png`
        );
      }

      console.log(`  Looking for file: ${localFilePath}`);

      if (!fs.existsSync(localFilePath)) {
        console.log(
          "  ⚠️  Local file not found - will regenerate from publicId\n"
        );

        // Regenerate QR code and upload to Cloudinary
        try {
          const QRCode = require("qrcode");
          const baseUrl = process.env.BASE_URL || "http://localhost:3010";
          const donationUrl = `${baseUrl}/church/${publicId}?source=qr`;

          // Generate QR code as data URL
          const qrCodeDataUrl = await QRCode.toDataURL(donationUrl, {
            width: 1000,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });

          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(qrCodeDataUrl, {
            folder: "churchdonate/qrcodes",
            public_id: publicId,
            overwrite: true,
            resource_type: "image",
          });

          console.log(`  ✅ Regenerated and uploaded to Cloudinary`);
          console.log(`  URL: ${result.secure_url}`);

          // Update database
          await Church.findByIdAndUpdate(church._id, {
            qrCodePath: result.secure_url,
          });

          console.log(`  ✅ Database updated\n`);
          migratedCount++;
        } catch (error) {
          console.error(`  ❌ Error regenerating QR code:`, error.message);
          console.log("");
          errorCount++;
        }
        continue;
      }

      // Read local file
      try {
        const fileBuffer = fs.readFileSync(localFilePath);
        const base64 = fileBuffer.toString("base64");
        const dataUrl = `data:image/png;base64,${base64}`;

        // Upload to Cloudinary
        console.log(`  📤 Uploading to Cloudinary...`);
        const result = await cloudinary.uploader.upload(dataUrl, {
          folder: "churchdonate/qrcodes",
          public_id: publicId,
          overwrite: true,
          resource_type: "image",
        });

        console.log(`  ✅ Uploaded successfully`);
        console.log(`  URL: ${result.secure_url}`);

        // Update database
        await Church.findByIdAndUpdate(church._id, {
          qrCodePath: result.secure_url,
        });

        console.log(`  ✅ Database updated\n`);
        migratedCount++;
      } catch (error) {
        console.error(`  ❌ Error migrating:`, error.message);
        console.log("");
        errorCount++;
      }
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB\n");

    // Summary
    console.log("=".repeat(50));
    console.log("MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total churches: ${churches.length}`);
    console.log(`✅ Successfully migrated: ${migratedCount}`);
    console.log(`⏭️  Skipped (already on Cloudinary): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log("=".repeat(50));

    if (errorCount > 0) {
      console.log(
        "\n⚠️  Some QR codes failed to migrate. Check the errors above."
      );
    } else {
      console.log("\n🎉 Migration completed successfully!");
      console.log("\nYou can now safely delete the local QR codes:");
      console.log("   rm -rf public/qrcodes/*.png");
      console.log("   (or manually delete the public/qrcodes folder)");
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

migrateQrCodes();
