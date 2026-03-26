import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import { variableSetQueryKeys } from './query-keys';

export function useDeleteVariableSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => variableSetApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.details() });
    }
  });
}
