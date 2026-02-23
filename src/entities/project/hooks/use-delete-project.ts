import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../api/project-api';
import { projectQueryKeys } from './query-keys';

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list() });
    },
  });
}
