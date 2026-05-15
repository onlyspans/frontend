import { api } from '@/shared/api';
import type {
  CreateProcessRequest,
  DeploymentLogResponse,
  DeploymentRequest,
  DeploymentResponse,
  ProcessesListParams,
  ProcessResponse,
  ProcessValidationResponse,
  ValidateProcessRequest
} from '../model/process';

const PROCESSES_BASE = '/api/Processes';
const DEPLOYMENT_BASE = '/api/Deployment';

const processEndpoints = {
  listByProject: (projectId: string) => `${PROCESSES_BASE}/by-project/${projectId}`,
  byId: (id: string) => `${PROCESSES_BASE}/${id}`,
  validate: `${PROCESSES_BASE}/validate`,
  create: PROCESSES_BASE,
  deploy: DEPLOYMENT_BASE,
  deploymentLogs: (deploymentId: string) => `${DEPLOYMENT_BASE}/${deploymentId}/logs`
} as const;

export const processApi = {
  getListByProject: (projectId: string, params?: ProcessesListParams) =>
    api.processes
      .get<ProcessResponse[]>(processEndpoints.listByProject(projectId), { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.processes.get<ProcessResponse>(processEndpoints.byId(id)).then((r) => r.data),

  validate: (body: ValidateProcessRequest) =>
    api.processes
      .post<ProcessValidationResponse>(processEndpoints.validate, body)
      .then((r) => r.data),

  create: (body: CreateProcessRequest) =>
    api.processes.post<ProcessResponse>(processEndpoints.create, body).then((r) => r.data),

  deploy: (body: DeploymentRequest) =>
    api.processes.post<DeploymentResponse>(processEndpoints.deploy, body).then((r) => r.data),

  getDeploymentLogs: (deploymentId: string) =>
    api.processes
      .get<DeploymentLogResponse>(processEndpoints.deploymentLogs(deploymentId))
      .then((r) => r.data)
};
