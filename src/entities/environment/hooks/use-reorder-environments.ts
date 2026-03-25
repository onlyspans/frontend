import { useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentApi } from '../api/environment-api';
import { environmentQueryKeys } from './query-keys';

export function useReorderEnvironments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (environmentIds: string[]) => environmentApi.reorder(environmentIds),
    onSuccess: (updatedList) => {
      queryClient.setQueryData(environmentQueryKeys.list(), updatedList);
      queryClient.invalidateQueries({ queryKey: environmentQueryKeys.lists() });
    }
  });
}
