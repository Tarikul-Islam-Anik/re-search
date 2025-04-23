import { create } from 'zustand';

export interface DocumentFile {
  id: string;
  name: string;
  originalText: string;
  summary: string;
}

interface DocumentStore {
  files: DocumentFile[];
  activeFileId: string | null;
  isProcessing: boolean;

  // Actions
  addFile: (file: DocumentFile) => void;
  setActiveFileId: (id: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  getActiveFile: () => DocumentFile | undefined;
  updateFileSummary: (id: string, summary: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  files: [],
  activeFileId: null,
  isProcessing: false,

  addFile: (file) => {
    set((state) => ({
      files: [...state.files, file],
      activeFileId: state.activeFileId === null ? file.id : state.activeFileId,
    }));
  },

  setActiveFileId: (id) => {
    set({ activeFileId: id });
  },

  setIsProcessing: (isProcessing) => {
    set({ isProcessing });
  },

  getActiveFile: () => {
    const { files, activeFileId } = get();
    return files.find((file) => file.id === activeFileId);
  },

  updateFileSummary: (id, summary) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, summary } : file
      ),
    }));
  },
}));
