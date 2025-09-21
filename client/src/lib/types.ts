export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || 'An error occurred';
  }
  return 'An error occurred';
}
