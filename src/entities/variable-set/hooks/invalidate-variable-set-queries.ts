import type { QueryClient } from '@tanstack/react-query';
import { variableSetQueryKeys } from './query-keys';

export function invalidateVariableSetQueries(queryClient: QueryClient, setId: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(setId) }),
    queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.lists() })
  ]);
}
