import type { ReleasesListParams } from '../model/release';

export const releaseQueryKeys = {
  all: (projectId: string) => ['releases', projectId] as const,
  lists: (projectId: string) => ['releases', projectId, 'list'] as const,
  list: (projectId: string, params?: ReleasesListParams) =>
    ['releases', projectId, 'list', params] as const,
  detail: (projectId: string, releaseId: string) =>
    ['releases', projectId, releaseId] as const
} as const;
