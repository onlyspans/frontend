export interface Tag {
  id: string;
  name: string;
  description: string | null;
  color: string | null; // hex, например '#FF5733'
  projects?: Array<{ id: string; name: string; slug: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string; // 1–100 символов
  description?: string;
  color?: string; // hex
}

export interface UpdateTagRequest {
  name?: string; // 1–100
  description?: string;
  color?: string;
}

export interface TagsListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
