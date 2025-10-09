// Quick verification script to check Cloudinary migration
const mongoose = require("mongoose");
const fs = require("fs");

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

const ChurchSchema = new mongoose.Schema(
  {
    name: String,
    publicId: String,
    qrCodePath: String,
  },
  { timestamps: true }
);

const Church = mongoose.models.Church || mongoose.model("Church", ChurchSchema);

async function verifyMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const churches = await Church.find({})
      .select("name publicId qrCodePath")
      .lean();

    console.log(`Found ${churches.length} churches:\n`);

    let cloudinaryCount = 0;
    let localCount = 0;

    churches.forEach((church, index) => {
      console.log(`${index + 1}. ${church.name}`);
      console.log(`   ID: ${church.publicId || "N/A"}`);
      console.log(`   QR: ${church.qrCodePath}`);

      if (church.qrCodePath && church.qrCodePath.includes("cloudinary.com")) {
        console.log(`   ✅ On Cloudinary`);
        cloudinaryCount++;
      } else {
        console.log(`   ⚠️  Still local`);
        localCount++;
      }
      console.log("");
    });

    console.log("=".repeat(50));
    console.log("SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total churches: ${churches.length}`);
    console.log(`✅ On Cloudinary: ${cloudinaryCount}`);
    console.log(`⚠️  Still local: ${localCount}`);
    console.log("=".repeat(50));

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyMigration();
