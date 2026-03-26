const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/** Returns dark (#000) or light (#fff) text color for contrast on the given hex background. */
export function getContrastTextColor(hex: string | null | undefined): '#000' | '#fff' {
  const normalizedHex = hex?.trim()?.toLowerCase();
  if (!normalizedHex || !HEX_COLOR_REGEX.test(normalizedHex)) return '#fff';
  const r = parseInt(normalizedHex.slice(1, 3), 16) / 255;
  const g = parseInt(normalizedHex.slice(3, 5), 16) / 255;
  const b = parseInt(normalizedHex.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? '#000' : '#fff';
}
