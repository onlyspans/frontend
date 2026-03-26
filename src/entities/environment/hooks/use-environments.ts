import { useQuery } from '@tanstack/react-query';
import { environmentApi } from '../api/environment-api';
import { environmentQueryKeys } from './query-keys';

export function useEnvironments() {
  return useQuery({
    queryKey: environmentQueryKeys.list(),
    queryFn: () => environmentApi.getList(),
    staleTime: 5 * 60 * 1000
  });
}
