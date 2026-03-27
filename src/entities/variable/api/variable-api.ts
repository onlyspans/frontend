import { api } from '@/shared/api';
import type {
  CreateVariableRequest,
  UpdateVariableRequest,
  VariableResponse
} from '../model/types';

const PROJECTS_BASE = '/projects';
const VARIABLES_BASE = '/variables';

const variableEndpoints = {
  projectList: (projectId: string) => `${PROJECTS_BASE}/${projectId}/variables`,
  byId: (id: string) => `${VARIABLES_BASE}/${id}`
} as const;

export const variableApi = {
  getProjectVariables: (projectId: string) =>
    api.variables
      .get<VariableResponse[]>(variableEndpoints.projectList(projectId))
      .then((r) => r.data),

  createProjectVariable: (projectId: string, body: CreateVariableRequest) =>
    api.variables
      .post<VariableResponse>(variableEndpoints.projectList(projectId), body)
      .then((r) => r.data),

  update: (id: string, body: UpdateVariableRequest) =>
    api.variables.put<VariableResponse>(variableEndpoints.byId(id), body).then((r) => r.data),

  delete: (id: string) => api.variables.delete(variableEndpoints.byId(id)).then((r) => r.data)
};
