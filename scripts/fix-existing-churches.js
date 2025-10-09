/**
 * Script to fix existing churches that are missing publicId or slug fields
 * Run this with: node scripts/fix-existing-churches.mjs
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Generate church ID (same as idGenerator.ts)
function generateChurchId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segment = () => {
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

// Generate slug (same as slugGenerator.ts)
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateUniqueSlug(baseSlug) {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

async function fixChurches() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");

    const Church = mongoose.model(
      "Church",
      new mongoose.Schema({}, { strict: false })
    );

    const churches = await Church.find({});
    console.log(`Found ${churches.length} churches`);

    let fixed = 0;

    for (const church of churches) {
      let needsUpdate = false;
      const updates = {};

      if (!church.publicId) {
        updates.publicId = generateChurchId();
        needsUpdate = true;
        console.log(`  - Adding publicId to: ${church.name}`);
      }

      if (!church.slug) {
        const baseSlug = generateSlug(church.name);
        updates.slug = generateUniqueSlug(baseSlug);
        needsUpdate = true;
        console.log(`  - Adding slug to: ${church.name}`);
      }

      if (needsUpdate) {
        await Church.findByIdAndUpdate(church._id, updates);
        fixed++;
        console.log(`✓ Fixed: ${church.name}`);
      }
    }

    console.log(`\n✅ Done! Fixed ${fixed} out of ${churches.length} churches`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixChurches();
