import { useQuery } from '@tanstack/react-query';
import { releaseApi } from '../api/release-api';
import { releaseQueryKeys } from './query-keys';

export function useRelease(projectId: string, releaseId: string) {
  return useQuery({
    queryKey: releaseQueryKeys.detail(projectId, releaseId),
    queryFn: () => releaseApi.getById(projectId, releaseId),
    enabled: !!projectId && !!releaseId,
    staleTime: 5 * 60 * 1000
  });
}
