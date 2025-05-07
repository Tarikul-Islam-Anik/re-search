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
  const { getActiveEntry } = useJournalStore();

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
      queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
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
      queryClient.invalidateQueries({ queryKey: ['journals', vaultId] });
    },
  });

  const saveCurrentEntry = async () => {
    const entry = getActiveEntry();
    if (!entry) return;

    try {
      // Prepare the input data
      const input = {
        title: entry.title,
        content: entry.content,
        editorData: entry.editorData,
        attachments: entry.attachments.map((a) => a.id),
      };

      // Check if this is a new entry or an existing one by looking for the entry in the database
      // If the ID matches a pattern like a UUID, it's likely an existing entry from the database
      const isExistingEntry =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          entry.id
        );

      if (isExistingEntry) {
        // Update the existing entry
        await updateJournal.mutateAsync({
          journalId: entry.id,
          input,
        });
      } else {
        // Create a new entry
        await createJournal.mutateAsync(input);
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      throw error;
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
