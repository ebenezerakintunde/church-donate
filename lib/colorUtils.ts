/**
 * Color Utility Functions
 * Convert hex colors to various shades for theming
 */

/**
 * Convert hex to RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Generate a color shade by adjusting lightness
 */
export function generateShade(hex: string, lightness: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const newRgb = hslToRgb(hsl.h, hsl.s, lightness);

  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generate a complete color palette from a single hex color
 * Returns Tailwind-like scale (50, 100, 200, ..., 900)
 */
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export function generateColorPalette(hex: string): ColorPalette {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    // Return default blue palette if invalid color
    return {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    };
  }

  // Generate shades by adjusting lightness
  const palette: ColorPalette = {
    50: generateShade(hex, 95),
    100: generateShade(hex, 90),
    200: generateShade(hex, 80),
    300: generateShade(hex, 70),
    400: generateShade(hex, 60),
    500: hex, // Base color
    600: generateShade(hex, 45),
    700: generateShade(hex, 35),
    800: generateShade(hex, 25),
    900: generateShade(hex, 20),
  };

  return palette;
}

/**
 * Get dynamic theme CSS classes for church donation page
 */
export function getThemeStyles(themeColor?: string) {
  if (!themeColor) {
    // Default to current primary colors
    return {
      bgGradient:
        "bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900",
      headerGradient: "bg-gradient-to-r from-primary-800 to-primary-900",
      buttonBg: "bg-primary-600 hover:bg-primary-700",
      textAccent: "text-primary-300",
      textLight: "text-primary-200",
      borderColor: "border-primary-600",
      copyButtonBg: "bg-primary-500/10 hover:bg-primary-500/20",
      iconColor: "text-primary-400",
    };
  }

  const palette = generateColorPalette(themeColor);

  // Return inline styles since we can't use dynamic Tailwind classes
  return {
    bgGradientStyle: {
      background: `linear-gradient(to bottom right, ${palette[800]}, ${palette[900]}, ${palette[900]})`,
    },
    headerGradientStyle: {
      background: `linear-gradient(to right, ${palette[800]}, ${palette[900]})`,
    },
    buttonStyle: {
      backgroundColor: palette[600],
    },
    buttonHoverStyle: {
      backgroundColor: palette[700],
    },
    textAccentColor: palette[300],
    textLightColor: palette[200],
    borderColor: palette[600],
    copyButtonBgColor: `${palette[500]}1A`, // 10% opacity
    copyButtonHoverColor: `${palette[500]}33`, // 20% opacity
    iconColor: palette[400],
    palette, // Include full palette for custom usage
  };
}

/**
 * Validate if a color has sufficient contrast for accessibility
 */
export function hasGoodContrast(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;

  // Calculate relative luminance
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;

  // Should be dark enough for white text (luminance < 0.5)
  return luminance < 0.5;
}
