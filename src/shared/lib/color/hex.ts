export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export type HexColorErrorKey =
  | 'project.creation.colorErrorStartWithHash'
  | 'project.creation.colorErrorSevenChars'
  | 'project.creation.colorErrorHexOnly';

export function getHexColorErrorKey(value: string): HexColorErrorKey | null {
  const v = value.trim();
  if (!v) return null;
  if (!v.startsWith('#')) return 'project.creation.colorErrorStartWithHash';
  if (v.length !== 7) return 'project.creation.colorErrorSevenChars';
  if (!HEX_COLOR_REGEX.test(v)) return 'project.creation.colorErrorHexOnly';
  return null;
}
