export interface CreateVariableRequest {
  key: string;
  value: string;
  environmentId?: string | null;
  variableSetId?: string | null;
}

export interface UpdateVariableRequest {
  key?: string;
  value?: string;
  environmentId?: string | null;
}

export interface VariableResponse {
  id: string;
  key: string;
  value: string;
  environmentId: string | null;
  projectId: string | null;
  variableSetId: string | null;
  createdAt: string;
  updatedAt: string;
}
