import type { TagsListParams } from '../model/tag';

export const tagQueryKeys = {
  all: (params?: TagsListParams) => ['tags', params] as const,
  lists: () => ['tags', 'list'] as const,
  list: (params?: TagsListParams) => ['tags', 'list', params] as const,
  detail: (id: string) => ['tags', 'detail', id] as const
} as const;
