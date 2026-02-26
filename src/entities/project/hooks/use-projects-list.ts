import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { QueryProjectsParams } from '../model/project';
import { projectQueryKeys } from './query-keys';

export function useProjectsList(params?: QueryProjectsParams) {
  return useQuery({
    queryKey: projectQueryKeys.list(params),
    queryFn: () => projectApi.getList(params),
    staleTime: 5 * 60 * 1000
  });
}
