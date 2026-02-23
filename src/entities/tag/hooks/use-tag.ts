import { useQuery } from '@tanstack/react-query';
import { tagApi } from '../api/tag-api';
import { tagQueryKeys } from './query-keys';

export function useTag(id: string) {
  return useQuery({
    queryKey: tagQueryKeys.detail(id),
    queryFn: () => tagApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
}
