import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import type { UpdateVariableSetRequest } from '../model/types';
import { variableSetQueryKeys } from './query-keys';

export function useUpdateVariableSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateVariableSetRequest }) =>
      variableSetApi.update(id, body),
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.detail(variables.id) });
    }
  });
}
