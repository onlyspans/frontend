import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import { projectQueryKeys } from './query-keys';

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list() });
    },
  });
}
