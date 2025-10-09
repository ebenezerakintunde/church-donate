# Database Fix Scripts

## Fix Existing Churches

If you have existing churches in the database that were created before the `slug` and `publicId` fields were added, they won't have these required fields and will show "undefined" in URLs.

### Option 1: Run the Fix Script (Recommended)

This script will automatically add missing `publicId` and `slug` fields to all existing churches:

```bash
node scripts/fix-existing-churches.mjs
```

**Prerequisites:**

- Make sure you have a `.env.local` file with `MONGODB_URI` configured
- The script will connect to your database and update all churches

### Option 2: Delete and Recreate Churches

Simply delete the old churches from the admin dashboard and create new ones. New churches will automatically have all required fields.

### Option 3: Use the Debug Button

1. Go to Admin Dashboard
2. Click "Add New Church"
3. Click the orange "🧪 DEBUG: Create 5 Random Churches" button
4. Delete your old churches

---

## Verification

After running the fix script, refresh your admin dashboard and verify:

- ✅ All churches show their donation page URL correctly
- ✅ "View Page" buttons work properly
- ✅ No red warning messages appear
