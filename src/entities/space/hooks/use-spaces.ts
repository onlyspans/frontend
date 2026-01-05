import { useQuery } from '@tanstack/react-query';
import { spaceApi } from '../api/space-api';
import type { Space } from '../model/space';
import { spaceQueryKeys } from './query-keys';

export function useSpaces() {
  return useQuery<Space[]>({
    queryKey: spaceQueryKeys.all,
    queryFn: () => spaceApi.getSpaces(),
    staleTime: 5 * 60 * 1000
  });
}
