import { apiClient } from '@/shared/api';
import type { PaginatedListResponse } from '@/shared/api/types';
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  TagsListParams
} from '../model/tag';

const BASE = '/tags';

const tagEndpoints = {
  list: BASE,
  byId: (id: string) => `${BASE}/${id}`
} as const;

export const tagApi = {
  getList: (params?: TagsListParams) =>
    apiClient
      .get<PaginatedListResponse<Tag>>(tagEndpoints.list, { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Tag>(tagEndpoints.byId(id)).then((r) => r.data),

  create: (body: CreateTagRequest) =>
    apiClient.post<Tag>(tagEndpoints.list, body).then((r) => r.data),

  update: (id: string, body: UpdateTagRequest) =>
    apiClient.put<Tag>(tagEndpoints.byId(id), body).then((r) => r.data),

  delete: (id: string) => apiClient.delete(tagEndpoints.byId(id))
};
