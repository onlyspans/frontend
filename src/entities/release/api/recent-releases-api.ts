import { api } from '@/shared/api';
import type { PaginatedListResponse } from '@/shared/api/types';
import type { RecentReleaseItem, RecentReleasesListParams } from '../model/recent-release';

const RECENT_PATH = '/releases/recent';

function buildRecentListParams(params?: RecentReleasesListParams): URLSearchParams {
  const search = new URLSearchParams();
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.pageSize != null) search.set('pageSize', String(params.pageSize));
  const trimmed = params?.search?.trim();
  if (trimmed) search.set('search', trimmed);
  if (params?.tagIds?.length) {
    for (const id of params.tagIds) search.append('tagIds', id);
  }
  return search;
}

export const recentReleasesApi = {
  getRecent: (params?: RecentReleasesListParams) => {
    const qs = buildRecentListParams(params);
    const query = qs.toString();
    const url = query ? `${RECENT_PATH}?${query}` : RECENT_PATH;
    return api.projects
      .get<PaginatedListResponse<RecentReleaseItem>>(url)
      .then((r) => r.data);
  }
};
