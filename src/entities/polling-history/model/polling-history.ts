export type PollingHistoryStatus =
  | 'running'
  | 'completed'
  | 'no_changes'
  | 'failed'
  | 'uploaded_notify_failed'
  | (string & {});

export interface PollingHistory {
  id: string;
  repositoryId: string;
  detectedRef: string | null;
  commitSha: string | null;
  status: PollingHistoryStatus;
  artifactKey: string | null;
  artifactVersion: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface PollingHistoryList {
  items: PollingHistory[];
  nextPageToken: string | null;
  totalCount: number;
}

export interface PollingHistoryListParams {
  repositoryId?: string;
  status?: PollingHistoryStatus;
  pageSize?: number;
  pageToken?: string;
}
