import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { Project } from '../model/project';
import { projectQueryKeys } from './query-keys';
import { useCurrentSpace } from '@/entities/space';

export function useProjects() {
  const { space } = useCurrentSpace();

  return useQuery<Project[]>({
    queryKey: projectQueryKeys.all(space?.id || ''),
    queryFn: () => {
      if (!space?.id) {
        throw new Error('Space ID is required');
      }
      return projectApi.getProjects(space.id);
    },
    enabled: !!space?.id,
    staleTime: 5 * 60 * 1000
  });
}
