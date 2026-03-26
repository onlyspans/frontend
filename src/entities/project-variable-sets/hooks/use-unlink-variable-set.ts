import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectVariableSetsApi } from '../api/project-variable-sets-api';
import { projectVariableSetsQueryKeys } from './query-keys';

export function useUnlinkVariableSet(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId }: { setId: string }) => projectVariableSetsApi.unlink(projectId, setId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectVariableSetsQueryKeys.list(projectId) });
    }
  });
}
