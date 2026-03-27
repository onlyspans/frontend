import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableApi } from '../api/variable-api';
import type { UpdateVariableRequest, VariableResponse } from '../model/types';
import { variableQueryKeys } from './query-keys';
import { variableSetQueryKeys } from '@/entities/variable-set';

export function useUpdateVariable() {
  const queryClient = useQueryClient();

  return useMutation<
    VariableResponse,
    unknown,
    { id: string; body: UpdateVariableRequest; projectId?: string; setId?: string }
  >({
    mutationFn: ({
      id,
      body
    }) => variableApi.update(id, body),
    onSuccess: (
      updated: VariableResponse,
      variables: { id: string; body: UpdateVariableRequest; projectId?: string; setId?: string }
    ) => {
      const projectId = updated.projectId ?? variables.projectId;
      const setId = updated.variableSetId ?? variables.setId;

      if (projectId) {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.projectList(projectId) });
      }

      if (setId) {
        queryClient.invalidateQueries({
          queryKey: variableSetQueryKeys.detail(setId)
        });
      }

      if (!projectId && !setId) {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.all() });
      } else {
        queryClient.invalidateQueries({ queryKey: variableQueryKeys.projectLists() });
        queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.list() });
      }
    }
  });
}
