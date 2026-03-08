import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import { projectQueryKeys } from './query-keys';

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: projectQueryKeys.detail(id) });
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'projects' &&
          query.queryKey[1] === 'detailBySlug'
      });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.listPrefix() });
    },
  });
}
