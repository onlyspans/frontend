import { apiClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsListParams,
} from '../model/project';

export async function getProjects(
  params?: ProjectsListParams
): Promise<PaginatedListResponse<Project>> {
  const { data } = await apiClient.get<PaginatedListResponse<Project>>(
    API_ENDPOINTS.PROJECTS.BASE,
    { params }
  );
  return data;
}

export async function getProjectById(id: string): Promise<Project> {
  const { data } = await apiClient.get<Project>(
    API_ENDPOINTS.PROJECTS.BY_ID(id)
  );
  return data;
}

export async function createProject(body: CreateProjectRequest): Promise<Project> {
  const { data } = await apiClient.post<Project>(
    API_ENDPOINTS.PROJECTS.BASE,
    body
  );
  return data;
}

export async function updateProject(
  id: string,
  body: UpdateProjectRequest
): Promise<Project> {
  const { data } = await apiClient.put<Project>(
    API_ENDPOINTS.PROJECTS.BY_ID(id),
    body
  );
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
}
