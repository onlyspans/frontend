import { useQuery } from '@tanstack/react-query';
import { projectVariableSetsApi } from '../api/project-variable-sets-api';
import { projectVariableSetsQueryKeys } from './query-keys';

export function useProjectVariableSets(projectId: string) {
  return useQuery({
    queryKey: projectVariableSetsQueryKeys.list(projectId),
    queryFn: () => projectVariableSetsApi.getProjectVariableSets(projectId),
    enabled: Boolean(projectId),
    staleTime: 30 * 1000
  });
}
