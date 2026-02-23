import { apiClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Release,
  CreateReleaseRequest,
  UpdateReleaseRequest,
  ReleasesListParams
} from '../model/release';

export async function getReleases(
  projectId: string,
  params?: ReleasesListParams
): Promise<PaginatedListResponse<Release>> {
  const endpoints = API_ENDPOINTS.RELEASES(projectId);
  const { data } = await apiClient.get<PaginatedListResponse<Release>>(
    endpoints.BASE,
    { params }
  );
  return data;
}

export async function getReleaseById(
  projectId: string,
  releaseId: string
): Promise<Release> {
  const endpoints = API_ENDPOINTS.RELEASES(projectId);
  const { data } = await apiClient.get<Release>(endpoints.BY_ID(releaseId));
  return data;
}

export async function createRelease(
  projectId: string,
  body: CreateReleaseRequest
): Promise<Release> {
  const endpoints = API_ENDPOINTS.RELEASES(projectId);
  const { data } = await apiClient.post<Release>(endpoints.BASE, body);
  return data;
}

export async function updateRelease(
  projectId: string,
  releaseId: string,
  body: UpdateReleaseRequest
): Promise<Release> {
  const endpoints = API_ENDPOINTS.RELEASES(projectId);
  const { data } = await apiClient.put<Release>(
    endpoints.BY_ID(releaseId),
    body
  );
  return data;
}

export async function deleteRelease(
  projectId: string,
  releaseId: string
): Promise<void> {
  const endpoints = API_ENDPOINTS.RELEASES(projectId);
  await apiClient.delete(endpoints.BY_ID(releaseId));
}
