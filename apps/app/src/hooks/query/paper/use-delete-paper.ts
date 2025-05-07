import { deletePaper } from '@/services/paper-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeletePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaper,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
    onError: (error) => {
      toast.error('Failed to delete paper', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
