import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { spaceApi } from '../api/space-api';
import type { Space } from '../model/space';
import { spaceQueryKeys } from './query-keys';

export function useCurrentSpace() {
  const params = useParams();
  const spaceSlug = params.spaceSlug;

  const { data: space, isLoading, error } = useQuery<Space>({
    queryKey: spaceQueryKeys.detail(spaceSlug!),
    queryFn: () => {
      if (!spaceSlug) {
        throw new Error('Space slug is required');
      }
      return spaceApi.getSpaceBySlug(spaceSlug);
    },
    enabled: !!spaceSlug,
    staleTime: 5 * 60 * 1000
  });

  return {
    space,
    isLoading,
    error,
    spaceSlug
  };
}
