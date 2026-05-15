import type { ProcessesListParams } from '../model/process';

export const processQueryKeys = {
  all: ['processes'] as const,
  lists: (projectId: string) => ['processes', projectId, 'list'] as const,
  list: (projectId: string, params?: ProcessesListParams) =>
    ['processes', projectId, 'list', params] as const,
  detail: (id: string) => ['processes', 'detail', id] as const,
  deploymentLogs: (deploymentId: string) =>
    ['processes', 'deploymentLogs', deploymentId] as const
} as const;
