import { api } from '@/shared/api';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Release,
  CreateReleaseRequest,
  UpdateReleaseRequest,
  ReleasesListParams
} from '../model/release';

const releaseEndpoints = (projectId: string) => {
  const BASE = `/projects/${projectId}/releases`;
  return {
    list: BASE,
    byId: (id: string) => `${BASE}/${id}`
  } as const;
};

export const releaseApi = {
  getList: (projectId: string, params?: ReleasesListParams) =>
    api.projects
      .get<PaginatedListResponse<Release>>(
        releaseEndpoints(projectId).list,
        { params }
      )
      .then((r) => r.data),

  getById: (projectId: string, releaseId: string) =>
    api.projects
      .get<Release>(releaseEndpoints(projectId).byId(releaseId))
      .then((r) => r.data),

  create: (projectId: string, body: CreateReleaseRequest) =>
    api.projects
      .post<Release>(releaseEndpoints(projectId).list, body)
      .then((r) => r.data),

  update: (
    projectId: string,
    releaseId: string,
    body: UpdateReleaseRequest
  ) =>
    api.projects
      .put<Release>(
        releaseEndpoints(projectId).byId(releaseId),
        body
      )
      .then((r) => r.data),

  delete: (projectId: string, releaseId: string) =>
    api.projects.delete(releaseEndpoints(projectId).byId(releaseId))
};
