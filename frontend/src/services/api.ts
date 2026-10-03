export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * A generic fetch wrapper that automatically handles JSON parsing and throws ApiError on failure.
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const userId = sessionStorage.getItem('synthnotes_user_id') || 'acc_rohan';
    
    const headers = new Headers(options?.headers);
    headers.set('X-User-Id', userId);
    
    const response = await fetch(url, { ...options, headers });
    
    const text = await response.text();
    let data;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || response.statusText || 'Unknown API Error';
      throw new ApiError(errorMsg, response.status);
    }
    
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err instanceof Error ? err.message : 'Network Error');
  }
}
