import { useQuery } from '@tanstack/react-query';
import { pollingHistoryApi } from '../api/polling-history-api';
import type { PollingHistoryListParams } from '../model/polling-history';
import { pollingHistoryQueryKeys } from './query-keys';

interface UseRepositoryPollingHistoryOptions {
  enabled?: boolean;
  params?: Omit<PollingHistoryListParams, 'repositoryId'>;
}

export function useRepositoryPollingHistory(
  repositoryId: string | undefined,
  options: UseRepositoryPollingHistoryOptions = {}
) {
  const { enabled = true, params } = options;
  const requestParams = {
    pageSize: 50,
    ...params,
    repositoryId
  };

  return useQuery({
    queryKey: pollingHistoryQueryKeys.repositoryList(repositoryId ?? '', params),
    queryFn: () => pollingHistoryApi.getList(requestParams),
    enabled: enabled && !!repositoryId,
    select: (data) => ({
      ...data,
      items: [...data.items].sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    })
  });
}
