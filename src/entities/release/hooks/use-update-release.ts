import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRelease } from '../api/release-api';
import type { UpdateReleaseRequest } from '../model/release';
import { releaseQueryKeys } from './query-keys';

export function useUpdateRelease(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      releaseId,
      data,
    }: {
      releaseId: string;
      data: UpdateReleaseRequest;
    }) => updateRelease(projectId, releaseId, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: releaseQueryKeys.detail(projectId, updated.id),
      });
      queryClient.invalidateQueries({
        queryKey: releaseQueryKeys.lists(projectId),
      });
    },
  });
}
