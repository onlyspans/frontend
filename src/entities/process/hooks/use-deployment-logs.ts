import { useQuery } from '@tanstack/react-query';
import { processApi } from '../api/process-api';
import { processQueryKeys } from './query-keys';

export function useDeploymentLogs(deploymentId: string | null | undefined) {
  return useQuery({
    queryKey: processQueryKeys.deploymentLogs(deploymentId ?? ''),
    queryFn: () => processApi.getDeploymentLogs(deploymentId!),
    enabled: !!deploymentId,
    staleTime: 5 * 1000
  });
}
