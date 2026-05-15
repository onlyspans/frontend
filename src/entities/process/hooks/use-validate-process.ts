import { useMutation } from '@tanstack/react-query';
import { processApi } from '../api/process-api';
import type { ValidateProcessRequest } from '../model/process';

export function useValidateProcess() {
  return useMutation({
    mutationFn: (body: ValidateProcessRequest) => processApi.validate(body)
  });
}
