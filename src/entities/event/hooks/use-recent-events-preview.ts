import { useEventsSearch } from './use-events-search';

const STALE_MS = 60_000;
const DEFAULT_PREVIEW_LIMIT = 5;
const MAX_PREVIEW_LIMIT = 100;

function sanitizeRecentPreviewLimit(limit: number | undefined): number {
  if (limit === undefined) return DEFAULT_PREVIEW_LIMIT;
  const n = Math.floor(Number(limit));
  if (!Number.isFinite(n) || n < 1) return DEFAULT_PREVIEW_LIMIT;
  return Math.min(n, MAX_PREVIEW_LIMIT);
}

export function useRecentEventsPreview(
  limit: number = DEFAULT_PREVIEW_LIMIT,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const size = sanitizeRecentPreviewLimit(limit);

  return useEventsSearch({
    page: 1,
    size,
    sortBy: 'timestamp',
    sortOrder: 'desc',
    enabled,
    staleTime: STALE_MS
  });
}
