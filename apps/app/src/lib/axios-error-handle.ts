import { toast } from 'sonner';

import { AxiosError } from 'axios';

// Function to handle API errors
export const handleApiError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    toast.error('An unexpected error occurred');
    return;
  }

  // Network error
  if (error.code === 'ERR_NETWORK') {
    toast.error('Network Error: API server connection failed');
    return;
  }

  // Response error
  if (error.response) {
    const message =
      error.response.data?.message || error.message || 'Unknown error';
    toast.error(`Error: ${message}`);
    return;
  }

  // Other Axios errors
  toast.error(`Request error: ${error.message}`);
};
