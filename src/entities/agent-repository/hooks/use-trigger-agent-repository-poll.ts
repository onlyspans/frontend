import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agentRepositoryApi } from '../api/agent-repository-api';
import { agentRepositoryQueryKeys } from './query-keys';

interface TriggerAgentRepositoryPollVariables {
  repositoryId: string;
  projectId?: string;
}

export function useTriggerAgentRepositoryPoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ repositoryId }: TriggerAgentRepositoryPollVariables) =>
      agentRepositoryApi.triggerPoll(repositoryId),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: agentRepositoryQueryKeys.detail(variables.repositoryId)
      });
      queryClient.invalidateQueries({
        queryKey: variables.projectId
          ? agentRepositoryQueryKeys.project(variables.projectId)
          : agentRepositoryQueryKeys.lists()
      });
    }
  });
}
