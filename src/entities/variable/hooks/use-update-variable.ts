import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableApi } from '../api/variable-api';
import type { UpdateVariableRequest, VariableResponse } from '../model/types';
import { variableQueryKeys } from './query-keys';

export function useUpdateVariable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateVariableRequest }) =>
      variableApi.update(id, body),
    onSuccess: (updated: VariableResponse) => {
      const projectId = updated.projectId;
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.projectList(projectId) });
      } else {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.all() });
      }
    }
  });
}
