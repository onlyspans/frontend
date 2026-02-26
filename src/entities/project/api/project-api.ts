import { apiClient } from '@/shared/api';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  QueryProjectsParams
} from '../model/project';

const BASE = '/projects';

const MAX_ICON_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_ICON_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

const projectEndpoints = {
  list: BASE,
  byId: (id: string) => `${BASE}/${id}`,
  icon: (id: string) => `${BASE}/${id}/icon`
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

  delete: (id: string) => apiClient.delete(projectEndpoints.byId(id)),

  uploadIcon: async (id: string, file: File): Promise<Project> => {
    if (file.size > MAX_ICON_SIZE) {
      return Promise.reject(new Error('File size must be at most 2 MB'));
    }
    if (!ALLOWED_ICON_TYPES.includes(file.type)) {
      return Promise.reject(new Error('Allowed formats: PNG, JPEG, GIF, WebP'));
    }
    const formData = new FormData();
    formData.append('file', file);
    const r = await apiClient
      .post<Project>(projectEndpoints.icon(id), formData, {
        headers: {
          'Content-Type': undefined
        } as Record<string, string | undefined>
      });
    return r.data;
  }
};
