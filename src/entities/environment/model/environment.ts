export interface Environment {
  id: string;
  name: string;
  description: string | null;
  color?: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateEnvironmentRequest {
  name: string;
  description?: string;
  color?: string;
  position: number;
}

export interface UpdateEnvironmentRequest {
  name?: string;
  description?: string | null;
  color?: string | null;
  position?: number;
}

export interface ReorderEnvironmentsRequest {
  environmentIds: string[];
}
