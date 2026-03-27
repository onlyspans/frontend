import { api } from '@/shared/api';
import type { CreateVariableRequest, VariableResponse } from '@/entities/variable';
import type {
  CreateVariableSetRequest,
  UpdateVariableSetRequest,
  VariableSetDetailResponse,
  VariableSetResponse
} from '../model/types';

const BASE = '/variable-sets';

const variableSetEndpoints = {
  list: BASE,
  byId: (id: string) => `${BASE}/${id}`,
  variables: (id: string) => `${BASE}/${id}/variables`
} as const;

export const variableSetApi = {
  getList: () =>
    api.variables.get<VariableSetResponse[]>(variableSetEndpoints.list).then((r) => r.data),

  getById: (id: string) =>
    api.variables
      .get<VariableSetDetailResponse>(variableSetEndpoints.byId(id))
      .then((r) => r.data),

  create: (body: CreateVariableSetRequest) =>
    api.variables.post<VariableSetResponse>(variableSetEndpoints.list, body).then((r) => r.data),

  update: (id: string, body: UpdateVariableSetRequest) =>
    api.variables
      .put<VariableSetResponse>(variableSetEndpoints.byId(id), body)
      .then((r) => r.data),

  delete: (id: string) => api.variables.delete(variableSetEndpoints.byId(id)).then((r) => r.data),

  addVariable: (id: string, body: CreateVariableRequest) =>
    api.variables
      .post<VariableResponse>(variableSetEndpoints.variables(id), body)
      .then((r) => r.data)
};
