import { apiClient } from '@/shared/api';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsListParams
} from '../model/project';

const BASE = '/projects';

const projectEndpoints = {
  list: BASE,
  byId: (id: string) => `${BASE}/${id}`
} as const;

export const projectApi = {
  getList: (params?: ProjectsListParams) =>
    apiClient
      .get<PaginatedListResponse<Project>>(projectEndpoints.list, { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Project>(projectEndpoints.byId(id)).then((r) => r.data),

  create: (body: CreateProjectRequest) =>
    apiClient.post<Project>(projectEndpoints.list, body).then((r) => r.data),

  update: (id: string, body: UpdateProjectRequest) =>
    apiClient.put<Project>(projectEndpoints.byId(id), body).then((r) => r.data),

  delete: (id: string) => apiClient.delete(projectEndpoints.byId(id))
};
