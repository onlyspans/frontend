import { useQuery } from '@tanstack/react-query';
import { processApi } from '../api/process-api';
import type { ProcessesListParams } from '../model/process';
import { processQueryKeys } from './query-keys';

export function useProcessesByProject(projectId: string, params?: ProcessesListParams) {
  return useQuery({
    queryKey: processQueryKeys.list(projectId, params),
    queryFn: () => processApi.getListByProject(projectId, params),
    enabled: !!projectId,
    staleTime: 30 * 1000
  });
}
