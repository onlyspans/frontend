import type { CreateSpaceFormData } from '@/entities/space/model/create-space-schema';
import type { Space } from '@/entities/space/model/space';
// import { api, extractData } from '@/shared/api';
// import type { ApiResponse } from '@/shared/api/types';

const spaces = [
  {
    id: 'space-1',
    slug: 'default',
    name: 'Default Space',
    description: 'Default workspace',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'space-2',
    slug: 'space-2',
    name: 'Dev Space',
    description: 'developer workspace',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Mocked API calls - replace with real API endpoints when ready
export const spaceApi = {
  getSpaces: async (): Promise<Space[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(spaces);
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await api.projects.get<ApiResponse<Space[]>>('/spaces');
    // return extractData(response);
  },

  getSpaceById: async (id: string): Promise<Space> => {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const space = spaces.find((s) => s.id === id);
        if (space) {
          resolve(space);
        } else {
          reject(new Error(`Space with id ${id} not found`));
        }
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await api.projects.get<ApiResponse<Space>>(`/spaces/${id}`);
    // return extractData(response);
  },

  getSpaceBySlug: async (slug: string): Promise<Space> => {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const space = spaces.find((s) => s.slug === slug);
        if (space) {
          resolve(space);
        } else {
          reject(new Error(`Space with slug ${slug} not found`));
        }
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await api.projects.get<ApiResponse<Space>>(`/spaces/slug/${slug}`);
    // return extractData(response);
  },

  createSpace: async (data: CreateSpaceFormData): Promise<Space> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `space-${Date.now()}`,
          slug: data.slug,
          name: data.name,
          description: data.description || 'New workspace',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }, 1000);
    });

    // Real implementation (commented out):
    // const response = await api.projects.post<ApiResponse<Space>>('/spaces', data);
    // return extractData(response);
  }
};
