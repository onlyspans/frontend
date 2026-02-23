import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTag } from '../api/tag-api';
import type { UpdateTagRequest } from '../model/tag';
import { tagQueryKeys } from './query-keys';

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagRequest }) =>
      updateTag(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
    },
  });
}
