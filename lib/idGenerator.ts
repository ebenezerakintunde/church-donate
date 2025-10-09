import { customAlphabet } from "nanoid";

/**
 * Generate a unique church ID
 * Format: abc12-def34-ghi56-jkl78 (20 characters + 3 dashes = 23 total)
 * Only lowercase letters and numbers
 */
export function generateChurchId(): string {
  // Generate 20 random characters (lowercase letters and numbers)
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 20);
  const id = nanoid();

  // Split into groups of 5 with dashes
  return id.match(/.{1,5}/g)?.join("-") || id;
}
