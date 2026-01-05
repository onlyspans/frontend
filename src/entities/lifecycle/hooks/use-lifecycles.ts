import { useQuery } from '@tanstack/react-query';
import { lifecycleApi } from '../api/lifecycle-api';
import type { Lifecycle } from '../model/lifecycle';
import { lifecycleQueryKeys } from './query-keys';

export function useLifecycles() {
  return useQuery<Lifecycle[]>({
    queryKey: lifecycleQueryKeys.all,
    queryFn: () => lifecycleApi.getLifecycles(),
    staleTime: 5 * 60 * 1000
  });
}
