// import { apiClient, extractData } from '@/shared/api';
// import type { ApiResponse } from '@/shared/api/types';
import type { CreateProjectFormData } from '@/entities/project';
import type { Project } from '../model/project';

// Mocked API calls - replace with real API endpoints when ready
export const projectApi = {
  createProject: async (data: CreateProjectFormData, spaceId: string): Promise<Project> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `project-${Date.now()}`,
          spaceId,
          name: data.name,
          description: data.description,
          avatar: data.avatar || undefined,
          deployTo: data.deployTo,
          lifecycleId: data.lifecycleId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }, 1000);
    });

    // Real implementation (commented out):
    // const formData = new FormData();
    // formData.append('name', data.name);
    // formData.append('description', data.description);
    // formData.append('deployTo', data.deployTo);
    // formData.append('lifecycleId', data.lifecycleId);
    // if (data.avatar) {
    //   formData.append('avatar', data.avatar);
    // }
    // if (data.avatarFile) {
    //   formData.append('avatarFile', data.avatarFile);
    // }
    // const response = await apiClient.post<ApiResponse<Project>>(
    //   '/projects',
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   }
    // );
    // return extractData(response);
  },

  getProjects: async (spaceId: string): Promise<Project[]> => {
    // Mock implementation

    const names: string[] = ['My Awesome Project', 'Backend Service', 'Frontend App'];
    const descriptions: string[] = ['A sample project for demonstration purposes', 'Main backend service for handling API requests', 'React application for the user interface'];

    const projects = Array.from({ length: 83 }, (_id, _index) => ({
      id: crypto.randomUUID(),
      spaceId,
      name: `${names[Math.floor(Math.random() * names.length)]} ${crypto.randomUUID().substring(0, 4)}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      avatar: 'https://via.placeholder.com/150',
      deployTo: 'aws' as 'aws' | 'yandex-cloud' | 'kubernetes',
      lifecycleId: `lifecycle-${_index % 3 + 1}`,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }));

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await apiClient.get<ApiResponse<Project[]>>(`/spaces/${spaceId}/projects`);
    // return extractData(response);
  },

  getProjectById: async (id: string): Promise<Project> => {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockProjects: Project[] = [
          {
            id: 'project-1',
            spaceId: 'space-1',
            name: 'My Awesome Project',
            description: 'A sample project for demonstration purposes',
            avatar: 'https://via.placeholder.com/150',
            deployTo: 'aws',
            lifecycleId: 'lifecycle-1',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'project-2',
            spaceId: 'space-1',
            name: 'Backend Service',
            description: 'Main backend service for handling API requests',
            deployTo: 'kubernetes',
            lifecycleId: 'lifecycle-2',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 'project-3',
            spaceId: 'space-1',
            name: 'Frontend App',
            description: 'React application for the user interface',
            deployTo: 'yandex-cloud',
            lifecycleId: 'lifecycle-1',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 259200000).toISOString()
          }
        ];

        const project = mockProjects.find((p) => p.id === id);
        if (project) {
          resolve(project);
        } else {
          reject(new Error(`Project with id ${id} not found`));
        }
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    // return extractData(response);
  }
};

