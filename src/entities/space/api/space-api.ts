import type { CreateSpaceFormData } from '@/entities/space/model/create-space-schema';
import type { Space } from '@/entities/space/model/space';
// import { apiClient, extractData } from '@/shared/api';
// import type { ApiResponse } from '@/shared/api/types';
// import { API_ENDPOINTS } from '@/shared/api/endpoints';

// Mocked API calls - replace with real API endpoints when ready
export const spaceApi = {
  getSpaces: async (): Promise<Space[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'space-1',
            slug: 'default',
            name: 'Default Space',
            description: 'Default workspace',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await apiClient.get<ApiResponse<Space[]>>(
    //   API_ENDPOINTS.SPACES.BASE
    // );
    // return extractData(response);
  },

  getSpaceById: async (id: string): Promise<Space> => {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockSpaces: Space[] = [
          {
            id: 'space-1',
            slug: 'default',
            name: 'Default Space',
            description: 'Default workspace',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        const space = mockSpaces.find((s) => s.id === id);
        if (space) {
          resolve(space);
        } else {
          reject(new Error(`Space with id ${id} not found`));
        }
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await apiClient.get<ApiResponse<Space>>(
    //   API_ENDPOINTS.SPACES.BY_ID(id)
    // );
    // return extractData(response);
  },

  getSpaceBySlug: async (slug: string): Promise<Space> => {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockSpaces: Space[] = [
          {
            id: 'space-1',
            slug: 'default',
            name: 'Default Space',
            description: 'Default workspace',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        const space = mockSpaces.find((s) => s.slug === slug);
        if (space) {
          resolve(space);
        } else {
          reject(new Error(`Space with slug ${slug} not found`));
        }
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await apiClient.get<ApiResponse<Space>>(
    //   API_ENDPOINTS.SPACES.BY_SLUG(slug)
    // );
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
          description: 'New workspace',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }, 1000);
    });

    // Real implementation (commented out):
    // const response = await apiClient.post<ApiResponse<Space>>(
    //   API_ENDPOINTS.SPACES.BASE,
    //   data
    // );
    // return extractData(response);
  }
};

