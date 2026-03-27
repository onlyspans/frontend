import { useQuery } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import { variableSetQueryKeys } from './query-keys';

export function useVariableSet(id: string) {
  return useQuery({
    queryKey: variableSetQueryKeys.detail(id),
    queryFn: () => variableSetApi.getById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000
  });
}
