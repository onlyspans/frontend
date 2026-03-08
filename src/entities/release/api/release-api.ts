import { apiClient } from '@/shared/api';
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
    apiClient
      .get<PaginatedListResponse<Release>>(
        releaseEndpoints(projectId).list,
        { params }
      )
      .then((r) => r.data),

  getById: (projectId: string, releaseId: string) =>
    apiClient
      .get<Release>(releaseEndpoints(projectId).byId(releaseId))
      .then((r) => r.data),

  create: (projectId: string, body: CreateReleaseRequest) =>
    apiClient
      .post<Release>(releaseEndpoints(projectId).list, body)
      .then((r) => r.data),

  update: (
    projectId: string,
    releaseId: string,
    body: UpdateReleaseRequest
  ) =>
    apiClient
      .put<Release>(
        releaseEndpoints(projectId).byId(releaseId),
        body
      )
      .then((r) => r.data),

  delete: (projectId: string, releaseId: string) =>
    apiClient.delete(releaseEndpoints(projectId).byId(releaseId))
};
