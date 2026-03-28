import type { QueryProjectsParams } from '../model/project';

export const projectQueryKeys = {
  listPrefix: () => ['projects', 'list'] as const,
  list: (params?: QueryProjectsParams) => ['projects', 'list', params] as const,
  detail: (id: string) => ['projects', 'detail', id] as const,
  detailBySlug: (slug: string) => ['projects', 'detailBySlug', slug] as const
} as const;
