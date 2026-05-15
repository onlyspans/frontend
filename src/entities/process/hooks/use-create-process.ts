import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processApi } from '../api/process-api';
import type { CreateProcessRequest } from '../model/process';
import { processQueryKeys } from './query-keys';

export function useCreateProcess(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateProcessRequest) => processApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processQueryKeys.lists(projectId) });
    }
  });
}
