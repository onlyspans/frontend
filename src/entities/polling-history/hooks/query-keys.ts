import type { PollingHistoryListParams } from '../model/polling-history';

export const pollingHistoryQueryKeys = {
  all: () => ['polling-history'] as const,
  repository: (repositoryId: string) =>
    ['polling-history', 'repository', repositoryId] as const,
  repositoryList: (
    repositoryId: string,
    params?: Omit<PollingHistoryListParams, 'repositoryId'>
  ) => ['polling-history', 'repository', repositoryId, params] as const
} as const;
