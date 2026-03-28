import { useEventsSearch } from './use-events-search';

const STALE_MS = 60_000;

export function useRecentEventsPreview(limit = 5, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  return useEventsSearch({
    page: 1,
    size: limit,
    sortBy: 'timestamp',
    sortOrder: 'desc',
    enabled,
    staleTime: STALE_MS
  });
}
