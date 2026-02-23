import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTag } from '../api/tag-api';
import type { CreateTagRequest } from '../model/tag';
import { tagQueryKeys } from './query-keys';

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagRequest) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
    },
  });
}
