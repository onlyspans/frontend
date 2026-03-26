import { useQuery } from '@tanstack/react-query';
import { environmentApi } from '../api/environment-api';
import { environmentQueryKeys } from './query-keys';

export function useEnvironment(id?: string) {
  return useQuery({
    queryKey: id ? environmentQueryKeys.detail(id) : environmentQueryKeys.all(),
    queryFn: () => {
      if (!id) return Promise.reject(new Error('Environment id is required'));
      return environmentApi.getById(id);
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000
  });
}
