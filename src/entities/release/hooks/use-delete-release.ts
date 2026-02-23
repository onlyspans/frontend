import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRelease } from '../api/release-api';
import { releaseQueryKeys } from './query-keys';

export function useDeleteRelease(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (releaseId: string) => deleteRelease(projectId, releaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: releaseQueryKeys.lists(projectId),
      });
    },
  });
}
