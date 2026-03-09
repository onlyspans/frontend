import { api } from '@/shared/api';
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
    api.projects
      .get<PaginatedListResponse<Tag>>(tagEndpoints.list, { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.projects.get<Tag>(tagEndpoints.byId(id)).then((r) => r.data),

  create: (body: CreateTagRequest) =>
    api.projects.post<Tag>(tagEndpoints.list, body).then((r) => r.data),

  update: (id: string, body: UpdateTagRequest) =>
    api.projects.put<Tag>(tagEndpoints.byId(id), body).then((r) => r.data),

  delete: (id: string) => api.projects.delete(tagEndpoints.byId(id))
};
