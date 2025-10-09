/**
 * ChurchDonate - Setup Verification Script
 * Run this to verify your setup is correct
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

console.log("\n🔍 ChurchDonate - Setup Verification\n");
console.log("Checking project setup...\n");

// Check required directories
const requiredDirs = [
  "app",
  "app/admin",
  "app/api",
  "lib",
  "models",
  "public/qrcodes",
  "docs",
];

console.log("📁 Checking directories...");
requiredDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    checks.passed.push(`✅ Directory exists: ${dir}`);
  } else {
    checks.failed.push(`❌ Directory missing: ${dir}`);
  }
});

// Check required files
const requiredFiles = [
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "README.md",
  "lib/db.ts",
  "lib/auth.ts",
  "lib/email.ts",
  "lib/generateQr.ts",
  "models/Admin.ts",
  "models/Church.ts",
  "app/page.tsx",
  "app/layout.tsx",
];

console.log("\n📄 Checking core files...");
requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ File exists: ${file}`);
  } else {
    checks.failed.push(`❌ File missing: ${file}`);
  }
});

// Check environment file
console.log("\n🔐 Checking environment configuration...");
const envExample = path.join(__dirname, ".env.example");
const envLocal = path.join(__dirname, ".env.local");

if (fs.existsSync(envExample)) {
  checks.passed.push("✅ .env.example exists");
} else {
  checks.warnings.push("⚠️  .env.example not found (optional)");
}

if (fs.existsSync(envLocal)) {
  checks.passed.push("✅ .env.local exists");

  // Read and check environment variables
  const envContent = fs.readFileSync(envLocal, "utf8");
  const requiredVars = ["MONGODB_URI", "JWT_SECRET", "BASE_URL"];

  requiredVars.forEach((varName) => {
    if (envContent.includes(varName)) {
      checks.passed.push(`✅ ${varName} configured`);
    } else {
      checks.failed.push(`❌ ${varName} not found in .env.local`);
    }
  });

  if (envContent.includes("RESEND_API_KEY")) {
    checks.passed.push("✅ RESEND_API_KEY configured");
  } else {
    checks.warnings.push(
      "⚠️  RESEND_API_KEY not configured (OTP will log to console)"
    );
  }

  if (envContent.includes("MAIN_ADMIN")) {
    checks.passed.push("✅ MAIN_ADMIN configured");
  } else {
    checks.warnings.push(
      "⚠️  MAIN_ADMIN not configured (recommended for production)"
    );
  }
} else {
  checks.failed.push("❌ .env.local not found - create it from .env.example");
}

// Check node_modules
console.log("\n📦 Checking dependencies...");
if (fs.existsSync(path.join(__dirname, "node_modules"))) {
  checks.passed.push("✅ node_modules exists");

  // Check for key packages
  const keyPackages = [
    "next",
    "react",
    "mongoose",
    "qrcode",
    "bcryptjs",
    "jsonwebtoken",
    "resend",
  ];

  keyPackages.forEach((pkg) => {
    const pkgPath = path.join(__dirname, "node_modules", pkg);
    if (fs.existsSync(pkgPath)) {
      checks.passed.push(`✅ Package installed: ${pkg}`);
    } else {
      checks.failed.push(`❌ Package missing: ${pkg}`);
    }
  });
} else {
  checks.failed.push("❌ node_modules not found - run: npm install");
}

// Print results
console.log("\n\n═══════════════════════════════════════════");
console.log("           VERIFICATION RESULTS");
console.log("═══════════════════════════════════════════\n");

if (checks.passed.length > 0) {
  console.log("✅ PASSED CHECKS:\n");
  checks.passed.forEach((check) => console.log(`   ${check}`));
  console.log("");
}

if (checks.warnings.length > 0) {
  console.log("⚠️  WARNINGS:\n");
  checks.warnings.forEach((warning) => console.log(`   ${warning}`));
  console.log("");
}

if (checks.failed.length > 0) {
  console.log("❌ FAILED CHECKS:\n");
  checks.failed.forEach((failure) => console.log(`   ${failure}`));
  console.log("");
}

console.log("═══════════════════════════════════════════\n");

// Final summary
const totalChecks =
  checks.passed.length + checks.failed.length + checks.warnings.length;
const passRate = ((checks.passed.length / totalChecks) * 100).toFixed(1);

console.log(`📊 Summary:`);
console.log(`   Total Checks: ${totalChecks}`);
console.log(`   Passed: ${checks.passed.length}`);
console.log(`   Failed: ${checks.failed.length}`);
console.log(`   Warnings: ${checks.warnings.length}`);
console.log(`   Pass Rate: ${passRate}%\n`);

if (checks.failed.length === 0) {
  console.log("🎉 All critical checks passed!");
  console.log("\n📖 Next steps:");
  console.log("   1. Start development server: npm run dev");
  console.log("   2. Visit: http://localhost:3010/admin/setup");
  console.log("   3. Create your admin account");
  console.log("   4. Start managing churches!\n");

  if (checks.warnings.length > 0) {
    console.log("💡 Note: Review warnings above for optimal setup.\n");
  }

  process.exit(0);
} else {
  console.log("⚠️  Some checks failed. Please fix the issues above.\n");
  console.log("📖 Need help? Check:");
  console.log("   - README.md");
  console.log("   - docs/SETUP.md");
  console.log("   - docs/API.md\n");
  process.exit(1);
}
