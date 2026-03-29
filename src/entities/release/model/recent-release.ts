export interface RecentReleaseProjectEnvironment {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RecentReleaseProject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  emoji: string | null;
  status: string;
  ownerId: string | null;
  environmentIds: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  environments: RecentReleaseProjectEnvironment[];
}

export interface RecentReleaseItem {
  id: string;
  projectId: string;
  version: string;
  snapshotId: string | null;
  changelog: string | null;
  notes: string | null;
  structure: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  project: RecentReleaseProject;
}

export interface RecentReleasesListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tagIds?: string[];
}
