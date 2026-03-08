import type { TagsListParams } from '../model/tag';

const TAGS_ROOT = ['tags'] as const;

export const tagQueryKeys = {
  all: () => TAGS_ROOT,
  lists: () => [...TAGS_ROOT, 'list'] as const,
  list: (params?: TagsListParams) => [...TAGS_ROOT, 'list', params] as const,
  detail: (id: string) => [...TAGS_ROOT, 'detail', id] as const
} as const;
