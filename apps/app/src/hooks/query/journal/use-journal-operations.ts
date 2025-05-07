import { journalService } from '@/services/journal-service';
import type { JournalFile } from '@/services/journal-service';
import { useJournalStore } from '@/store/use-journal-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetFiles } from '../file/use-get-files';
import { useCheckUserVaults } from '../user/use-check-user-vaults';

interface JournalInput {
  title?: string;
  content: string;
  mood?: string;
  editorData?: {
    cursorPosition?: number;
    wordCount?: number;
    characterCount?: number;
    lastEditedAt?: string;
  };
  attachments?: string[];
}

export function useJournalOperations() {
  const queryClient = useQueryClient();
  const { data: vaultData } = useCheckUserVaults();
  const vaultId = vaultData?.vaultId;
  const { data: filesData } = useGetFiles();
  const { getActiveEntry, updateEntry, updateEntryId } = useJournalStore();

  const createJournal = useMutation({
    mutationFn: async (input: JournalInput) => {
      if (!vaultId) throw new Error('No vault selected');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create journal entry');
      }

      return response.json();
    },
    onSuccess: () => {
      if (vaultId) {
        queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
      }
    },
  });

  const updateJournal = useMutation({
    mutationFn: async ({
      journalId,
      input,
    }: { journalId: string; input: JournalInput }) => {
      if (!vaultId) throw new Error('No vault selected');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/journal/${journalId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update journal entry');
      }

      return response.json();
    },
    onSuccess: () => {
      if (vaultId) {
        queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
      }
    },
  });

  const saveCurrentEntry = async () => {
    const entry = getActiveEntry();
    if (!entry || !vaultId) return;

    try {
      // Prepare the input data
      const input = {
        title: entry.title,
        content: entry.content,
        editorData: entry.editorData,
        attachments: entry.attachments.map((a) => a.id),
      };

      // Check if this is a new entry or an existing one
      // Since we use CUID in the database, we can check if the ID starts with 'cl'
      const isExistingEntry = entry.id.startsWith('cl');

      if (isExistingEntry) {
        // Update the existing entry
        const result = await updateJournal.mutateAsync({
          journalId: entry.id,
          input,
        });

        // Update the local store with the server response
        if (result) {
          updateEntry(entry.id, {
            title: result.title || 'Untitled',
            content: result.content || '',
            attachments: result.files.map((file: JournalFile) => ({
              id: file.id,
              name: file.name,
              url: file.url,
              type: file.size ? 'document' : 'unknown',
            })),
          });
        }
      } else {
        // Create a new entry
        const result = await createJournal.mutateAsync(input);

        // If creation was successful, update the local store with the new ID
        if (result.success) {
          // We need to fetch the newly created entry to get its ID
          const journals = await queryClient.fetchQuery({
            queryKey: ['journals', vaultId],
            queryFn: () => journalService.getJournals(vaultId),
          });

          const newEntry = journals[0]; // The most recent entry
          if (newEntry) {
            // First update the entry data
            updateEntry(entry.id, {
              title: newEntry.title || 'Untitled',
              content: newEntry.content || '',
              attachments: newEntry.files.map((file: JournalFile) => ({
                id: file.id,
                name: file.name,
                url: file.url,
                type: file.size ? 'document' : 'unknown',
              })),
            });

            // Then update the ID
            updateEntryId(entry.id, newEntry.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to save journal entry'
      );
    }
  };

  return {
    createJournal,
    updateJournal,
    saveCurrentEntry,
    isLoading: createJournal.isPending || updateJournal.isPending,
    availableFiles: filesData,
  };
}
