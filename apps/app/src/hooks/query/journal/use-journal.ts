import { type Journal, journalService } from '@/services/journal-service';
import { useJournalStore } from '@/store/use-journal-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useCheckUserVaults } from '../user/use-check-user-vaults';

export function useJournal(journalId: string) {
  const { data } = useCheckUserVaults();
  const vaultId = data?.vaultId || '';
  const { setActiveEntryId } = useJournalStore();

  // Fetch the journal entry
  const {
    data: journal,
    isLoading,
    isError,
    error,
  } = useQuery<Journal>({
    queryKey: ['journal', vaultId, journalId],
    queryFn: () => journalService.getJournal(vaultId, journalId),
    enabled: !!vaultId && !!journalId,
  });

  // Set the journal as active in the journal store when loaded
  useEffect(() => {
    if (journal) {
      // Convert the journal from the API to the format expected by the journal store
      const storeEntry = {
        id: journal.id,
        title: journal.title || 'Untitled',
        content: journal.content,
        attachments: journal.files.map((file) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          type: file.size ? 'document' : 'unknown',
        })),
        createdAt: journal.createdAt,
        updatedAt: journal.updatedAt,
      };

      // Import the journal into the store
      setActiveEntryId(storeEntry.id);
    }
  }, [journal, setActiveEntryId]);

  return {
    journal,
    isLoading,
    isError,
    error,
  };
}
