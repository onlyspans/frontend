import type { ProjectsListParams } from '../model/project';

export const projectQueryKeys = {
  all: (spaceId: string) => ['projects', spaceId] as const,
  list: (params?: ProjectsListParams) => ['projects', 'list', params] as const,
  detail: (id: string) => ['projects', 'detail', id] as const
} as const;
