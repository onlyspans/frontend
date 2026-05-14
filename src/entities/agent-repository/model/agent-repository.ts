export interface AgentRepository {
  id: string;
  projectId: string;
  url: string;
  branch: string;
  tagPattern: string | null;
  lastKnownCommit: string | null;
  enabled: boolean;
  pollIntervalSeconds: number;
  lastPolledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentRepositoryList {
  items: AgentRepository[];
  nextPageToken: string | null;
  totalCount: number;
}

export interface AgentRepositoryListParams {
  projectId?: string;
  pageSize?: number;
  pageToken?: string;
}

export interface RegisterRepositoryRequest {
  projectId: string;
  url: string;
  branch?: string;
  tagPattern?: string | null;
  credentialId?: string | null;
  pollIntervalSeconds?: number;
}

export interface UpdateRepositoryRequest {
  branch?: string | null;
  tagPattern?: string | null;
  credentialId?: string | null;
  pollIntervalSeconds?: number | null;
  enabled?: boolean | null;
}

export interface TriggerAgentRepositoryPollResult {
  id: string;
  repositoryId: string;
  detectedRef: string | null;
  commitSha: string | null;
  status: string;
  artifactKey: string | null;
  artifactVersion: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
}
