import { useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentApi } from '../api/environment-api';
import { environmentQueryKeys } from './query-keys';

export function useDeleteEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => environmentApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: environmentQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: environmentQueryKeys.detail(id) });
    }
  });
}
