import { useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentApi } from '../api/environment-api';
import type { UpdateEnvironmentRequest } from '../model/environment';
import { environmentQueryKeys } from './query-keys';

export function useUpdateEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEnvironmentRequest }) =>
      environmentApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: environmentQueryKeys.detail(updated.id)
      });
      queryClient.invalidateQueries({ queryKey: environmentQueryKeys.lists() });
    }
  });
}
