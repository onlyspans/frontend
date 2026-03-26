import { useQuery } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import { variableSetQueryKeys } from './query-keys';

export function useVariableSets() {
  return useQuery({
    queryKey: variableSetQueryKeys.list(),
    queryFn: () => variableSetApi.getList(),
    staleTime: 60 * 1000
  });
}
