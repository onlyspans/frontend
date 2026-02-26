import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import { projectQueryKeys } from './query-keys';

export function useUploadProjectIcon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      projectApi.uploadIcon(projectId, file),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(updated.id) });
    }
  });
}
