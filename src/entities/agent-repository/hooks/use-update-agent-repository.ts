import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agentRepositoryApi } from '../api/agent-repository-api';
import type { UpdateRepositoryRequest } from '../model/agent-repository';
import { agentRepositoryQueryKeys } from './query-keys';

interface UpdateAgentRepositoryVariables {
  id: string;
  projectId?: string;
  data: UpdateRepositoryRequest;
}

export function useUpdateAgentRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateAgentRepositoryVariables) =>
      agentRepositoryApi.update(id, data),
    onSuccess: (repository, variables) => {
      queryClient.invalidateQueries({
        queryKey: agentRepositoryQueryKeys.detail(repository.id)
      });
      queryClient.invalidateQueries({
        queryKey: variables.projectId
          ? agentRepositoryQueryKeys.project(variables.projectId)
          : agentRepositoryQueryKeys.lists()
      });
    }
  });
}
