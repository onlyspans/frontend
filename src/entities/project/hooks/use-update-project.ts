import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { UpdateProjectRequest } from '../model/project';
import { projectQueryKeys } from './query-keys';

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(updated.id)
      });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list() });
    }
  });
}
