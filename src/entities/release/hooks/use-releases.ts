import { useQuery } from '@tanstack/react-query';
import { getReleases } from '../api/release-api';
import type { ReleasesListParams } from '../model/release';
import { releaseQueryKeys } from './query-keys';

export function useReleases(projectId: string, params?: ReleasesListParams) {
  return useQuery({
    queryKey: releaseQueryKeys.list(projectId, params),
    queryFn: () => getReleases(projectId, params),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}
