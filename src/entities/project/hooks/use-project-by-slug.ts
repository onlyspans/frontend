import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import { projectQueryKeys } from './query-keys';

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: projectQueryKeys.detailBySlug(slug),
    queryFn: () => projectApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000
  });
}
