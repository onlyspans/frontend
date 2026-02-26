import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { CreateProjectRequest } from '../model/project';
import { projectQueryKeys } from './query-keys';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.listPrefix() });
    }
  });
}
