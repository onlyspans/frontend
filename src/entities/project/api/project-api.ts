import { apiClient } from '@/shared/api';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  QueryProjectsParams
} from '../model/project';

const BASE = '/projects';

const projectEndpoints = {
  list: BASE,
  byId: (id: string) => `${BASE}/${id}`
} as const;

function buildListParams(params?: QueryProjectsParams): URLSearchParams {
  const search = new URLSearchParams();
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.pageSize != null) search.set('pageSize', String(params.pageSize));
  if (params?.ownerId) search.set('ownerId', params.ownerId);
  if (params?.status) search.set('status', params.status);
  if (params?.search) search.set('search', params.search);
  if (params?.sortBy) search.set('sortBy', params.sortBy);
  if (params?.sortOrder) search.set('sortOrder', params.sortOrder);
  if (params?.tagIds?.length) {
    for (const id of params.tagIds) search.append('tagIds', id);
  }
  return search;
}

export const projectApi = {
  getList: (params?: QueryProjectsParams) => {
    const search = buildListParams(params);
    const query = search.toString();
    const url = query ? `${projectEndpoints.list}?${query}` : projectEndpoints.list;
    return apiClient
      .get<PaginatedListResponse<Project>>(url)
      .then((r) => r.data);
  },

  getById: (id: string) =>
    apiClient.get<Project>(projectEndpoints.byId(id)).then((r) => r.data),

  create: (body: CreateProjectRequest) =>
    apiClient.post<Project>(projectEndpoints.list, body).then((r) => r.data),

  update: (id: string, body: UpdateProjectRequest) =>
    apiClient.put<Project>(projectEndpoints.byId(id), body).then((r) => r.data),

  delete: (id: string) => apiClient.delete(projectEndpoints.byId(id))
};
