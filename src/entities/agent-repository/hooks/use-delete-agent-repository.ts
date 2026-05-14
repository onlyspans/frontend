import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agentRepositoryApi } from '../api/agent-repository-api';
import { agentRepositoryQueryKeys } from './query-keys';

interface DeleteAgentRepositoryVariables {
  id: string;
  projectId?: string;
}

export function useDeleteAgentRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteAgentRepositoryVariables) =>
      agentRepositoryApi.delete(id),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: agentRepositoryQueryKeys.detail(variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: variables.projectId
          ? agentRepositoryQueryKeys.project(variables.projectId)
          : agentRepositoryQueryKeys.lists()
      });
    }
  });
}
