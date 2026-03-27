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

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'An unknown error occurred';
}

export function extractData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export function getApiStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.status;
}

export function isApiStatus(error: unknown, status: number): boolean {
  return getApiStatus(error) === status;
}

export function getApiValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data as ApiError | undefined;
  return data?.errors;
}

export function getApiProblemDetail(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data as ApiError | undefined;
  return data?.detail;
}

export function getFirstValidationErrorMessage(error: unknown): string | undefined {
  const errors = getApiValidationErrors(error);
  if (!errors) return undefined;

  for (const messages of Object.values(errors)) {
    if (messages.length > 0) return messages[0];
  }

  return undefined;
}
