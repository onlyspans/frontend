import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import type { CreateVariableSetRequest } from '../model/types';
import { variableSetQueryKeys } from './query-keys';

export function useCreateVariableSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVariableSetRequest) => variableSetApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variableSetQueryKeys.lists() });
    }
  });
}
