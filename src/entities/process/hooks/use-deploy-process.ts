import { useMutation } from '@tanstack/react-query';
import { processApi } from '../api/process-api';
import type { DeploymentRequest } from '../model/process';

export function useDeployProcess() {
  return useMutation({
    mutationFn: (body: DeploymentRequest) => processApi.deploy(body)
  });
}
