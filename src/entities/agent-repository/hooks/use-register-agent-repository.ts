import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agentRepositoryApi } from '../api/agent-repository-api';
import type { RegisterRepositoryRequest } from '../model/agent-repository';
import { agentRepositoryQueryKeys } from './query-keys';

export function useRegisterAgentRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRepositoryRequest) => agentRepositoryApi.register(data),
    onSuccess: (repository) => {
      queryClient.invalidateQueries({
        queryKey: agentRepositoryQueryKeys.project(repository.projectId)
      });
    }
  });
}
