import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variableSetApi } from '../api/variable-set-api';
import type { CreateVariableRequest } from '@/entities/variable';
import { invalidateVariableSetQueries } from './invalidate-variable-set-queries';

export function useAddVariableToSet(setId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateVariableRequest) => variableSetApi.addVariable(setId, body),
    onSuccess: () => {
      invalidateVariableSetQueries(queryClient, setId);
    }
  });
}
