import { useQuery } from '@tanstack/react-query';
import { processApi } from '../api/process-api';
import { processQueryKeys } from './query-keys';

export function useProcess(processId: string | null | undefined) {
  return useQuery({
    queryKey: processQueryKeys.detail(processId ?? ''),
    queryFn: () => processApi.getById(processId!),
    enabled: !!processId,
    staleTime: 30 * 1000
  });
}
