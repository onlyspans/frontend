import { useQuery } from '@tanstack/react-query';
import { getTags } from '../api/tag-api';
import type { TagsListParams } from '../model/tag';
import { tagQueryKeys } from './query-keys';

export function useTags(params?: TagsListParams) {
  return useQuery({
    queryKey: tagQueryKeys.list(params),
    queryFn: () => getTags(params),
    staleTime: 5 * 60 * 1000,
  });
}
