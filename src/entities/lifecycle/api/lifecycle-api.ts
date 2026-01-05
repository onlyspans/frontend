// import { apiClient, extractData } from '@/shared/api';
// import type { ApiResponse } from '@/shared/api/types';
import type { Lifecycle } from '../model/lifecycle';

// Mocked API calls - replace with real API endpoints when ready
export const lifecycleApi = {
  getLifecycles: async (): Promise<Lifecycle[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'lifecycle-1',
            name: 'Standard',
            description: 'Standard lifecycle with dev, staging, and production environments'
          },
          {
            id: 'lifecycle-2',
            name: 'Simple',
            description: 'Simple lifecycle with dev and production environments'
          },
          {
            id: 'lifecycle-3',
            name: 'Custom',
            description: 'Custom lifecycle that you can configure yourself'
          }
        ]);
      }, 500);
    });

    // Real implementation (commented out):
    // const response = await apiClient.get<ApiResponse<Lifecycle[]>>(
    //   '/lifecycles'
    // );
    // return extractData(response);
  }
};

