# Theme Color Customization Feature

## 📋 Overview

Churches can now customize their donation page with a personalized theme color! The system automatically generates a complete color palette from a single hex color, applying it to backgrounds, buttons, gradients, and accents throughout the church donation page.

## ✨ Features Implemented

### 1. **Color Picker with Live Preview**

- **Component**: `app/components/ThemeColorPicker.tsx`
- Color input (both color picker and manual hex input)
- Live preview modal showing how the page will look
- Sample donation page preview with the selected color
- Color palette visualization
- Contrast validation warning for light colors

### 2. **Color Generation System**

- **File**: `lib/colorUtils.ts`
- Converts HEX → RGB → HSL for color manipulation
- Generates complete 10-shade palette (50, 100...900)
- Creates dynamic gradients from single color
- Provides fallback to default primary blue if no color set

### 3. **Admin Integration**

- **File**: `app/admin/dashboard/page.tsx`
- Theme color picker added to church creation/edit modal
- Located after logo upload section
- Saves color to database

### 4. **Manager Integration**

- **File**: `app/manage/[id]/page.tsx`
- Managers can edit church theme color
- Same UI experience as admin dashboard
- Managers cannot create churches, only edit

### 5. **Dynamic Church Donation Page**

- **File**: `app/church/[id]/ChurchDonationPage.tsx`
- Background gradient uses theme color shades 800-900
- Header gradient uses theme color shades 800-900
- All buttons use theme color shade 600 (with hover opacity)
- Light accent backgrounds use theme color shades 50-100
- Automatic fallback to default blue if no theme set

### 6. **Database Updates**

- **File**: `models/Church.ts`
- Added `themeColor` field (optional string, hex format)
- Validation: Must be valid hex color (#RRGGBB format)

### 7. **API Updates**

- **Files**:
  - `app/api/church/route.ts` - POST endpoint
  - `app/api/church/[id]/route.ts` - PUT endpoint
  - `app/api/manager/church/[id]/route.ts` - Manager PUT endpoint
- All endpoints now accept and store `themeColor`

## 🎨 How It Works

### Color Palette Generation

From a single hex color (e.g., `#ef4444`), the system generates:

```
50:  Very light (95% lightness)  → #fef2f2
100: Light (90% lightness)       → #fee2e2
200: Light (80% lightness)       → #fecaca
300: Medium-light (70%)          → #fca5a5
400: Medium-light (60%)          → #f87171
500: Base color                  → #ef4444
600: Medium-dark (45%)           → #dc2626
700: Dark (35%)                  → #b91c1c
800: Very dark (25%)             → #991b1b
900: Very dark (20%)             → #7f1d1d
```

### Applied Styles

**Background**: Linear gradient using shades 800, 900, 900

**Header**: Linear gradient using shades 800-900

**Buttons**: Shade 600 (with 90% opacity on hover)

**Light Accents**: Shades 50-100

## 📝 Usage Instructions

### For Admins

1. Go to Admin Dashboard
2. Click "Add Church" or edit existing church
3. Scroll to "Theme Color" section (after logo upload)
4. Pick a color or enter hex code
5. Click "Preview Theme" to see how it looks
6. Save the church

### For Managers

1. Log in as church manager
2. Navigate to your church edit page
3. Find "Theme Color" section (after logo upload)
4. Pick a color or enter hex code
5. Click "Preview Theme" to see how it looks
6. Save changes

### Best Practices

1. **Use Darker Colors**: Colors with good contrast work best

   - ✅ Good: #1e40af, #dc2626, #059669
   - ⚠️ Caution: #fbbf24, #a78bfa (may be too light)

2. **Preview Before Saving**: Always check the preview to ensure readability

3. **Existing Churches**: Churches without a theme color will continue using the default blue theme

## 🔧 Technical Details

### Storage Format

- Stored as: Hex color string (`#RRGGBB`)
- Example: `"#3b82f6"`
- Optional field (undefined/null = use default)

### Fallback Behavior

```typescript
// If church has themeColor
style={{ background: 'linear-gradient(...)' with custom colors }}

// If church has NO themeColor
className="bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900"
```

### TypeScript Interfaces Updated

```typescript
interface Church {
  // ... other fields
  themeColor?: string; // Optional hex color
}
```

## 🧪 Testing

### Test Cases

1. **Create New Church with Theme**

   - Select color → Preview → Save → Visit page → Verify colors

2. **Edit Existing Church**

   - Load church → Change color → Preview → Save → Verify

3. **Remove Theme Color**

   - Edit church → Clear color input → Save → Should revert to default

4. **Invalid Color**

   - Try entering invalid hex → Should show validation error

5. **Manager Access**
   - Manager should be able to edit theme
   - Preview should work for managers

### Migration

- ✅ Existing churches automatically work with default colors
- ✅ No database migration needed (optional field)
- ✅ Backward compatible

## 📄 Files Modified/Created

### New Files

- `lib/colorUtils.ts` - Color generation utilities
- `app/components/ThemeColorPicker.tsx` - Color picker component
- `docs/THEME-COLOR-FEATURE.md` - This documentation

### Modified Files

- `models/Church.ts` - Added themeColor field
- `app/admin/dashboard/page.tsx` - Added color picker
- `app/manage/[id]/page.tsx` - Added color picker for managers
- `app/church/[id]/ChurchDonationPage.tsx` - Applied dynamic theming
- `app/api/church/route.ts` - POST endpoint
- `app/api/church/[id]/route.ts` - PUT endpoint
- `app/api/manager/church/[id]/route.ts` - Manager PUT endpoint

## 🚀 Future Enhancements

Potential improvements:

1. **Preset Color Palettes**: Offer pre-selected branded colors
2. **Font Customization**: Allow custom fonts per church
3. **Logo-Based Colors**: Extract colors from uploaded logo
4. **Accessibility Score**: Calculate and show WCAG compliance
5. **Export Theme**: Download theme colors as CSS variables
6. **Dark Mode Support**: Automatically generate dark mode variants

## 🎯 Benefits

1. **Brand Consistency**: Churches can match their existing brand colors
2. **Visual Identity**: Each church has a unique, recognizable look
3. **User Experience**: More engaging and personalized donation pages
4. **No Design Skills Needed**: Automatic palette generation
5. **Flexible**: Easy to change or remove theme

## ⚡ Performance

- Zero performance impact if no theme color set
- Minimal JavaScript (color calculation done once on render)
- No external dependencies
- Inline styles only when needed

---

**Implementation Date**: October 10, 2025  
**Status**: ✅ Complete and Tested
