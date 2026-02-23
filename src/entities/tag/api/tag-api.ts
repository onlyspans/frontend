import { apiClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { PaginatedListResponse } from '@/shared/api/types';
import type { Tag, CreateTagRequest, UpdateTagRequest, TagsListParams } from '../model/tag';

export async function getTags(params?: TagsListParams): Promise<PaginatedListResponse<Tag>> {
  const { data } = await apiClient.get<PaginatedListResponse<Tag>>(
    API_ENDPOINTS.TAGS.BASE,
    { params }
  );
  return data;
}

export async function getTagById(id: string): Promise<Tag> {
  const { data } = await apiClient.get<Tag>(API_ENDPOINTS.TAGS.BY_ID(id));
  return data;
}

export async function createTag(body: CreateTagRequest): Promise<Tag> {
  const { data } = await apiClient.post<Tag>(API_ENDPOINTS.TAGS.BASE, body);
  return data;
}

export async function updateTag(id: string, body: UpdateTagRequest): Promise<Tag> {
  const { data } = await apiClient.put<Tag>(API_ENDPOINTS.TAGS.BY_ID(id), body);
  return data;
}

export async function deleteTag(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.TAGS.BY_ID(id));
}
