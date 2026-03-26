import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableApi } from '../api/variable-api';
import { variableQueryKeys } from './query-keys';

export function useDeleteVariable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; projectId?: string; setId?: string }) => variableApi.delete(id),
    onSuccess: (_data, variables) => {
      if (variables.projectId) {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.projectList(variables.projectId) });
      }
      if (variables.setId) {
        queryClient.invalidateQueries({
          queryKey: ['variable-sets', 'detail', variables.setId]
        });
      }
      if (!variables.projectId && !variables.setId) {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.all() });
      } else {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.projectLists() });
        queryClient.invalidateQueries({ queryKey: ['variable-sets', 'list'] });
      }
    }
  });
}
