// Quick script to check church view counts directly from MongoDB
import { Schema, models, model, connect, disconnect } from "mongoose";
import { existsSync, readFileSync } from "fs";

// Read .env.local manually
const envPath = ".env.local";
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const ChurchSchema = new Schema(
  {
    name: String,
    publicId: String,
    pageViews: { type: Number, default: 0 },
    qrScans: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Church = models.Church || model("Church", ChurchSchema);

async function checkViews() {
  try {
    await connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const churches = await Church.find({})
      .select("name publicId pageViews qrScans viewCount")
      .lean();

    console.log(`Found ${churches.length} churches:\n`);
    churches.forEach((church, index) => {
      console.log(`${index + 1}. ${church.name}`);
      console.log(`   ID: ${church.publicId || "N/A"}`);
      console.log(`   Page Views: ${church.pageViews || 0}`);
      console.log(`   QR Scans: ${church.qrScans || 0}`);
      console.log(`   Old viewCount: ${church.viewCount || 0}`);
      console.log("");
    });

    await disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkViews();
