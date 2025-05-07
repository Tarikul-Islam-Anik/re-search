import { type SavePaperResponse, savePaper } from '@/services/paper-service';
import type { PaperData } from '@/store/use-paper-store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SavePaperOptions {
  onSuccess?: (data: SavePaperResponse) => void;
  onError?: (error: Error) => void;
}

export function useSavePaper(options?: SavePaperOptions) {
  return useMutation({
    mutationFn: async (paperData: PaperData) => {
      return savePaper(paperData);
    },
    onSuccess: (data) => {
      toast.success('Paper saved successfully');
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Failed to save paper', {
        description:
          'An error occurred while saving your paper. Please try again.',
      });
      options?.onError?.(error);
    },
  });
}
