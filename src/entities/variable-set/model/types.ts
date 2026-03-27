import type { VariableResponse } from '@/entities/variable';

export interface CreateVariableSetRequest {
  name: string;
  description?: string | null;
}

export interface UpdateVariableSetRequest {
  name?: string;
  description?: string | null;
}

export interface VariableSetResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VariableSetDetailResponse extends VariableSetResponse {
  variables: VariableResponse[];
}
