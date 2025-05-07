import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface EditorData {
  cursorPosition?: number;
  wordCount?: number;
  characterCount?: number;
  lastEditedAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  attachments: Attachment[];
  editorData?: EditorData;
  createdAt: string;
  updatedAt: string;
}

interface JournalState {
  entries: JournalEntry[];
  activeEntryId: string | null;

  // Actions
  createEntry: () => string;
  updateEntry: (
    id: string,
    updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>
  ) => void;
  updateEntryId: (oldId: string, newId: string) => void;
  deleteEntry: (id: string) => void;
  setActiveEntryId: (id: string | null) => void;
  getActiveEntry: () => JournalEntry | undefined;
  addAttachment: (entryId: string, attachment: Omit<Attachment, 'id'>) => void;
  removeAttachment: (entryId: string, attachmentId: string) => void;
  updateEditorData: (entryId: string, editorData: EditorData) => void;
  clearActiveEntry: () => void;
}

// Create the journal store with persistence
export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      activeEntryId: null,

      // Create a new journal entry with default values
      createEntry: () => {
        const newEntry: JournalEntry = {
          id: uuidv4(),
          title: 'Untitled',
          content: '',
          attachments: [],
          editorData: {
            wordCount: 0,
            characterCount: 0,
            lastEditedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
          activeEntryId: newEntry.id,
        }));

        return newEntry.id;
      },

      // Update an existing journal entry
      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== id) return entry;
            return {
              ...entry,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // Delete a journal entry
      deleteEntry: (id) => {
        set((state) => {
          const newEntries = state.entries.filter((entry) => entry.id !== id);
          const newActiveId =
            state.activeEntryId === id
              ? newEntries.length > 0
                ? newEntries[0].id
                : null
              : state.activeEntryId;

          return {
            entries: newEntries,
            activeEntryId: newActiveId,
          };
        });
      },

      // Set the active journal entry
      setActiveEntryId: (id) => {
        set({ activeEntryId: id });
      },

      // Get the active journal entry
      getActiveEntry: () => {
        const { entries, activeEntryId } = get();
        return entries.find((entry) => entry.id === activeEntryId);
      },

      // Add an attachment to a journal entry
      addAttachment: (entryId, attachment) => {
        const attachmentWithId = {
          ...attachment,
          id: uuidv4(),
        };

        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== entryId) return entry;
            return {
              ...entry,
              attachments: [...entry.attachments, attachmentWithId],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // Remove an attachment from a journal entry
      removeAttachment: (entryId, attachmentId) => {
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== entryId) return entry;
            return {
              ...entry,
              attachments: entry.attachments.filter(
                (a) => a.id !== attachmentId
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // Update editor data for a journal entry
      updateEditorData: (entryId, editorData) => {
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== entryId) return entry;
            return {
              ...entry,
              editorData: {
                ...entry.editorData,
                ...editorData,
                lastEditedAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // Clear the active journal entry
      clearActiveEntry: () => {
        set({ activeEntryId: null });
      },

      // Update an entry's ID (used after server creation)
      updateEntryId: (oldId: string, newId: string) => {
        set((state) => ({
          entries: state.entries.map((entry) => {
            if (entry.id !== oldId) return entry;
            return {
              ...entry,
              id: newId,
            };
          }),
          activeEntryId:
            state.activeEntryId === oldId ? newId : state.activeEntryId,
        }));
      },
    }),
    {
      name: 'journal-storage',
    }
  )
);
