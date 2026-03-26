import { api } from '@/shared/api';
import type { VariableSetResponse } from '@/entities/variable-set';

const PROJECTS_BASE = '/api/projects';

const projectVariableSetsEndpoints = {
  list: (projectId: string) => `${PROJECTS_BASE}/${projectId}/variable-sets`,
  link: (projectId: string, setId: string) => `${PROJECTS_BASE}/${projectId}/variable-sets/${setId}`
} as const;

export const projectVariableSetsApi = {
  getProjectVariableSets: (projectId: string) =>
    api.variables
      .get<VariableSetResponse[]>(projectVariableSetsEndpoints.list(projectId))
      .then((r) => r.data),

  link: (projectId: string, setId: string) =>
    api.variables.post(projectVariableSetsEndpoints.link(projectId, setId)),

  unlink: (projectId: string, setId: string) =>
    api.variables.delete(projectVariableSetsEndpoints.link(projectId, setId))
};
