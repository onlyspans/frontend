import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableApi } from '../api/variable-api';
import { variableQueryKeys } from './query-keys';

export function useDeleteVariable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => variableApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableQueryKeys.all() });
    }
  });
}
