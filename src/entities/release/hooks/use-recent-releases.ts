import { useQuery } from '@tanstack/react-query';
import { recentReleasesApi } from '../api/recent-releases-api';
import type { RecentReleasesListParams } from '../model/recent-release';
import { releaseQueryKeys } from './query-keys';

export function useRecentReleases(params: RecentReleasesListParams) {
  return useQuery({
    queryKey: releaseQueryKeys.recent.list(params),
    queryFn: () => recentReleasesApi.getRecent(params),
    staleTime: 5 * 60 * 1000
  });
}
