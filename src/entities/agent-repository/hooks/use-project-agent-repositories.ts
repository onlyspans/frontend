import { useQuery } from '@tanstack/react-query';
import { agentRepositoryApi } from '../api/agent-repository-api';
import type { AgentRepositoryListParams } from '../model/agent-repository';
import { agentRepositoryQueryKeys } from './query-keys';

export function useProjectAgentRepositories(
  projectId: string,
  params?: Omit<AgentRepositoryListParams, 'projectId'>
) {
  const requestParams = {
    pageSize: 200,
    ...params,
    projectId
  };

  return useQuery({
    queryKey: agentRepositoryQueryKeys.projectList(projectId, params),
    queryFn: () => agentRepositoryApi.getList(requestParams),
    enabled: !!projectId,
    staleTime: 60 * 1000
  });
}
