import { api } from '@/shared/api';
import type {
  PollingHistoryList,
  PollingHistoryListParams
} from '../model/polling-history';

const AGENTS_BASE = '/api/agents';

const pollingHistoryEndpoints = {
  list: `${AGENTS_BASE}/polling-history`
} as const;

export const pollingHistoryApi = {
  getList: (params?: PollingHistoryListParams) =>
    api.agents
      .get<PollingHistoryList>(pollingHistoryEndpoints.list, { params })
      .then((r) => r.data)
};
