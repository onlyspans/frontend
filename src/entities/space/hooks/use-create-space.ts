import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spaceApi } from '../api/space-api';
import type { CreateSpaceFormData } from '@/entities/space';
import type { Space } from '../model/space';
import { spaceQueryKeys } from './query-keys';

export function useCreateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSpaceFormData) => spaceApi.createSpace(data),
    onMutate: async (newSpaceData) => {
      await queryClient.cancelQueries({ queryKey: spaceQueryKeys.all });

      const previousSpaces = queryClient.getQueryData<Space[]>(spaceQueryKeys.all);

      queryClient.setQueryData<Space[]>(spaceQueryKeys.all, (old = []) => {
        const optimisticSpace: Space = {
          id: `temp-${Date.now()}`,
          slug: newSpaceData.slug,
          name: newSpaceData.name,
          description: newSpaceData.description || 'New workspace',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return [...old, optimisticSpace];
      });

      return { previousSpaces };
    },
    onError: (_err, _newSpaceData, context) => {
      if (context?.previousSpaces) {
        queryClient.setQueryData(spaceQueryKeys.all, context.previousSpaces);
      }
    },
    onSuccess: (newSpace) => {
      queryClient.setQueryData<Space[]>(spaceQueryKeys.all, (old = []) => {
        const withoutTemp = old.filter((s) => !s.id.startsWith('temp-'));
        return [...withoutTemp, newSpace];
      });
    }
  });
}
