import { useQuery } from '@tanstack/react-query';
import { variableApi } from '../api/variable-api';
import { variableQueryKeys } from './query-keys';

export function useProjectVariables(projectId: string) {
  return useQuery({
    queryKey: variableQueryKeys.projectList(projectId),
    queryFn: () => variableApi.getProjectVariables(projectId),
    enabled: Boolean(projectId),
    staleTime: 30 * 1000
  });
}
