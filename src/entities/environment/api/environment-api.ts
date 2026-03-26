import { api } from '@/shared/api';
import type {
  CreateEnvironmentRequest,
  Environment,
  ReorderEnvironmentsRequest,
  UpdateEnvironmentRequest
} from '../model/environment';

const BASE = '/environments';

const environmentEndpoints = {
  list: BASE,
  byId: (id: string) => `${BASE}/${id}`,
  reorder: `${BASE}/reorder`
} as const;

export const environmentApi = {
  getList: () =>
    api.projects.get<Environment[]>(environmentEndpoints.list).then((r) => r.data),

  getById: (id: string) =>
    api.projects.get<Environment>(environmentEndpoints.byId(id)).then((r) => r.data),

  create: (body: CreateEnvironmentRequest) =>
    api.projects.post<Environment>(environmentEndpoints.list, body).then((r) => r.data),

  update: (id: string, body: UpdateEnvironmentRequest) =>
    api.projects
      .patch<Environment>(environmentEndpoints.byId(id), body)
      .then((r) => r.data),

  delete: (id: string) => api.projects.delete(environmentEndpoints.byId(id)),

  reorder: (environmentIds: string[]) =>
    api.projects
      .put<Environment[]>(environmentEndpoints.reorder, {
        environmentIds
      } satisfies ReorderEnvironmentsRequest)
      .then((r) => r.data)
};
