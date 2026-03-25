export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export type HexColorErrorKey =
  | 'project.creation.colorErrorStartWithHash'
  | 'project.creation.colorErrorSevenChars'
  | 'project.creation.colorErrorHexOnly';

export function getHexColorErrorKey(value: string): HexColorErrorKey | null {
  if (!value.trim()) return null;
  if (!value.startsWith('#')) return 'project.creation.colorErrorStartWithHash';
  if (value.length !== 7) return 'project.creation.colorErrorSevenChars';
  if (!HEX_COLOR_REGEX.test(value)) return 'project.creation.colorErrorHexOnly';
  return null;
}
