export type ProcessStatus =
  | 'Created'
  | 'Validating'
  | 'Validated'
  | 'ValidationFailed'
  | 'Running'
  | 'AwaitingApproval'
  | 'Completed'
  | 'Failed'
  | 'Cancelled'
  | 'RollingBack'
  | 'RolledBack'
  | string;

export interface ProcessStepResponse {
  id: string;
  name: string;
  order: number;
  description: string | null;
  type: string;
  script: string | null;
  scriptPath: string | null;
  optional: boolean;
  blocking: boolean;
  onFailure: string;
  timeout: string | null;
  status: string;
}

export interface ProcessVariableResponse {
  name: string;
  source: string;
  hasValue: boolean;
}

export interface ProcessResponse {
  id: string;
  projectId: string;
  environmentId: string;
  releaseVersion: string;
  status: ProcessStatus;
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
  stepsCount: number;
  steps: ProcessStepResponse[];
  variables: ProcessVariableResponse[];
}

export interface ProcessesListParams {
  environmentId?: string;
  releaseVersion?: string;
  fallbackToLatestInEnvironment?: boolean;
}

export interface CreateProcessRequest {
  projectId: string;
  environmentId: string;
  releaseVersion: string;
  yaml: string;
}

export interface ValidateProcessRequest {
  yaml: string;
  projectId?: string | null;
  environmentId?: string | null;
}

export interface ResolvedStepResponse {
  name: string;
  order: number;
  description: string | null;
  type: string;
  script: string | null;
  scriptPath: string | null;
  optional: boolean;
  blocking: boolean;
  onFailure: string | null;
  timeout: string | null;
}

export interface ProcessValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  unresolvedVariables: string[];
  steps: ResolvedStepResponse[] | null;
}

export interface DeploymentRequest {
  processId: string;
  targetId: string;
  targetType: string;
  snapshotKey: string;
}

export interface DeploymentResponse {
  deploymentId: string;
  processId: string;
  status: string;
  completedAt: string | null;
  summary: string | null;
  errorMessage: string | null;
  errorType: string | null;
}

export interface DeploymentLogEntry {
  timestamp: string;
  level: string;
  message: string;
  source: string | null;
}

export interface DeploymentLogRealtimeMessage extends DeploymentLogEntry {
  deploymentId: string;
}

export interface DeploymentLogResponse {
  deploymentId: string;
  entries: DeploymentLogEntry[];
}
