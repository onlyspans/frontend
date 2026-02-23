import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseApi } from '../api/release-api';
import type { CreateReleaseRequest } from '../model/release';
import { releaseQueryKeys } from './query-keys';

export function useCreateRelease(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReleaseRequest) =>
      releaseApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: releaseQueryKeys.lists(projectId),
      });
    },
  });
}
