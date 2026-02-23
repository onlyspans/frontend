export type ReleaseStatus =
  | 'draft'
  | 'created'
  | 'scheduled'
  | 'delivering'
  | 'delivered'
  | 'deployed'
  | 'failed'
  | 'rolled_back'
  | 'cancelled';

export interface ReleaseStructure {
  projectId: string;
  projectName: string;
  version: string;
  snapshotId: string;
  config: {
    processes: Array<{ id: string; name: string; config: Record<string, string> }>;
    variables: Record<string, string>;
    assets: Array<{ id: string; name: string; url: string; metadata: Record<string, string> }>;
  };
  metadata: Record<string, string>;
}

export interface Release {
  id: string;
  projectId: string;
  project?: { id: string; name: string; slug: string };
  version: string;
  snapshotId: string | null;
  status: ReleaseStatus;
  changelog: string | null;
  notes: string | null;
  structure: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateReleaseRequest {
  version: string; // semver
  changelog?: string;
  notes?: string;
  structure?: ReleaseStructure | Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateReleaseRequest {
  status?: ReleaseStatus;
  snapshotId?: string;
  changelog?: string;
  notes?: string;
  structure?: ReleaseStructure | Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ReleasesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  version?: string;
}
