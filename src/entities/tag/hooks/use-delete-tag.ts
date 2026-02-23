import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTag } from '../api/tag-api';
import { tagQueryKeys } from './query-keys';

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
    },
  });
}
