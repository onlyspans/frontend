const STORAGE_KEY = 'developer-platform:recent_projects';

/** Max number of slugs stored (LRU-style bump on access). */
export const RECENT_PROJECT_SLUGS_MAX = 5;

function readSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string' && x.length > 0);
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // quota / private mode
  }
}

/** Ordered list of recently opened project slugs (newest first). */
export function getRecentProjectSlugs(): string[] {
  return readSlugs();
}

/** Move slug to front and cap length. Call after opening a project or picking it in the switcher. */
export function recordProjectVisit(slug: string): void {
  if (!slug.trim()) return;
  const prev = readSlugs();
  const next = [slug, ...prev.filter((s) => s !== slug)].slice(
    0,
    RECENT_PROJECT_SLUGS_MAX
  );
  writeSlugs(next);
}

/** Drop slugs that no longer exist in the loaded project list. */
export function pruneRecentProjectSlugs(validSlugs: Set<string>): void {
  const cur = readSlugs();
  const next = cur.filter((s) => validSlugs.has(s));
  if (next.length !== cur.length) {
    writeSlugs(next);
  }
}
