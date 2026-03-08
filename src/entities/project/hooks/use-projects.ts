import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { Project } from '../model/project';
import { projectQueryKeys } from './query-keys';

export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.list({ page: 1, pageSize: 100 }),
    queryFn: () => projectApi.getList({ page: 1, pageSize: 100 }),
    select: (data): Project[] => data.items,
    staleTime: 5 * 60 * 1000
  });
}
