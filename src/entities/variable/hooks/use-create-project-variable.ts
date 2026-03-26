import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableApi } from '../api/variable-api';
import type { CreateVariableRequest } from '../model/types';
import { variableQueryKeys } from './query-keys';

export function useCreateProjectVariable(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVariableRequest) => variableApi.createProjectVariable(projectId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableQueryKeys.projectLists() });
    }
  });
}
