import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api/event-api';
import type { SearchEventsRequest } from '../model/types';
import { eventQueryKeys } from './query-keys';

export type UseEventsSearchParams = Omit<SearchEventsRequest, 'page'> & {
  page?: number; // 1-based for UI
  enabled?: boolean;
  staleTime?: number;
};

function toApiPage(uiPage: number | undefined): number | undefined {
  if (uiPage == null) return undefined;
  return Math.max(0, uiPage - 1);
}

export function useEventsSearch(params: UseEventsSearchParams) {
  const { enabled = true, page, staleTime, ...rest } = params;

  const request: SearchEventsRequest = {
    ...rest,
    page: toApiPage(page)
  };

  return useQuery({
    queryKey: eventQueryKeys.search(request),
    queryFn: () => eventApi.search(request),
    enabled,
    ...(staleTime != null ? { staleTime } : {})
  });
}
