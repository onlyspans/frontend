import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '../api/project-api';
import { projectQueryKeys } from './query-keys';

export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000
  });
}
