import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import { variableSetQueryKeys } from './query-keys';

export function useDeleteVariableSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => variableSetApi.delete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: variableSetQueryKeys.detail(variables.id) });
    }
  });
}
