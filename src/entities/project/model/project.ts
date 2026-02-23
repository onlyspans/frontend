import type { Tag } from '@/entities/tag';

export type ProjectStatus = 'active' | 'archived' | 'suspended';

export type LifecycleStage = 'development' | 'testing' | 'staging' | 'production';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  ownerId: string | null;
  tags: Tag[];
  lifecycleStages: LifecycleStage[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  releases?: Array<{
    id: string;
    projectId: string;
    version: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CreateProjectRequest {
  name: string; // 1–255
  slug: string; // 1–255, URL-friendly
  description?: string;
  status?: ProjectStatus;
  ownerId?: string;
  lifecycleStages?: LifecycleStage[];
  tagIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectRequest {
  name?: string;
  slug?: string;
  description?: string;
  status?: ProjectStatus;
  ownerId?: string;
  lifecycleStages?: LifecycleStage[];
  tagIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface ProjectsListParams {
  page?: number;
  pageSize?: number;
  ownerId?: string;
  status?: ProjectStatus;
  search?: string;
  tagIds?: string[];
}
