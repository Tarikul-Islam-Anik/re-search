import { type Journal, journalService } from '@/services/journal-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCheckUserVaults } from '../user/use-check-user-vaults';

export function useJournals() {
  const queryClient = useQueryClient();
  const { data } = useCheckUserVaults();
  const vaultId = data?.vaultId || '';

  // Fetch all journal entries
  const {
    data: journals,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Journal[]>({
    queryKey: ['journals', vaultId],
    queryFn: () => journalService.getJournals(vaultId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create a journal entry
  const createJournal = useMutation({
    mutationFn: (data: {
      title?: string;
      content: string;
      attachments?: string[];
    }) => journalService.createJournal(vaultId, data),
    onSuccess: () => {
      toast.success('Journal entry created successfully');
      queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
    },
    onError: () => {
      toast.error('Failed to create journal entry');
    },
  });

  // Update a journal entry
  const updateJournal = useMutation({
    mutationFn: ({
      journalId,
      data,
    }: {
      journalId: string;
      data: {
        title?: string;
        content?: string;
        attachments?: string[];
      };
    }) => journalService.updateJournal(vaultId, journalId, data),
    onSuccess: () => {
      toast.success('Journal entry updated successfully');
      queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
    },
    onError: () => {
      toast.error('Failed to update journal entry');
    },
  });

  // Delete a journal entry
  const deleteJournal = useMutation({
    mutationFn: (journalId: string) =>
      journalService.deleteJournal(vaultId, journalId),
    onSuccess: () => {
      toast.success('Journal entry deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
    },
    onError: () => {
      toast.error('Failed to delete journal entry');
    },
  });

  return {
    journals,
    isLoading,
    isError,
    error,
    refetch,
    createJournal: createJournal.mutate,
    isCreating: createJournal.isPending,
    updateJournal: updateJournal.mutate,
    isUpdating: updateJournal.isPending,
    deleteJournal: deleteJournal.mutate,
    isDeleting: deleteJournal.isPending,
  };
}
