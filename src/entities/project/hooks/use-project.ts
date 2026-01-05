import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { Project } from '../model/project';
import { projectQueryKeys } from './query-keys';
import { useCurrentSpace } from '@/entities/space';

export function useProject(projectId: string) {
  const { space } = useCurrentSpace();

  return useQuery<Project>({
    queryKey: projectQueryKeys.detail(space?.id || '', projectId),
    queryFn: () => {
      if (!space?.id) {
        throw new Error('Space ID is required');
      }
      return projectApi.getProjectById(projectId);
    },
    enabled: !!space?.id && !!projectId,
    staleTime: 5 * 60 * 1000
  });
}
