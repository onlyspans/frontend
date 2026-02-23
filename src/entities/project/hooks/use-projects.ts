import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/project-api';
import type { Project } from '../model/project';
import { projectQueryKeys } from './query-keys';

/** Список проектов (первая страница, 100 элементов). Для пагинации используйте useProjectsList. */
export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.list({ page: 1, pageSize: 100 }),
    queryFn: () => getProjects({ page: 1, pageSize: 100 }),
    select: (data): Project[] => data.items,
    staleTime: 5 * 60 * 1000
  });
}
