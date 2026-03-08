import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../api/tag-api';
import { tagQueryKeys } from './query-keys';

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: tagQueryKeys.detail(id) });
    },
  });
}
