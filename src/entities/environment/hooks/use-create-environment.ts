import { useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentApi } from '../api/environment-api';
import type { CreateEnvironmentRequest } from '../model/environment';
import { environmentQueryKeys } from './query-keys';

export function useCreateEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnvironmentRequest) => environmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: environmentQueryKeys.lists() });
    }
  });
}
