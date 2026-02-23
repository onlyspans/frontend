import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { ProjectsListParams } from '../model/project';
import { projectQueryKeys } from './query-keys';

export function useProjectsList(params?: ProjectsListParams) {
  return useQuery({
    queryKey: projectQueryKeys.list(params),
    queryFn: () => projectApi.getList(params),
    staleTime: 5 * 60 * 1000
  });
}
