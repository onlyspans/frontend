import axios from 'axios';
import type { ApiError, ApiResponse } from './types';

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;

    if (apiError?.message) {
      return apiError.message;
    }

    if (error.response?.status === 401) {
      return 'Authentication required';
    }

    if (error.response?.status === 403) {
      return 'Access forbidden';
    }

    if (error.response?.status === 404) {
      return 'Resource not found';
    }

    if (error.response?.status === 500) {
      return 'Internal server error';
    }

    if (error.message) {
      return error.message;
    }
  }

  return 'An unknown error occurred';
}

export function extractData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}
