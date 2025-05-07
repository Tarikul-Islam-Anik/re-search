import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PaperData {
  id?: string;
  title: string;
  abstract?: string;
  content: string;
  keywords: string[];
  publicationDate?: Date;
  doi?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  isSaving: boolean;
  isError: boolean;
  errorMessage?: string;
}

interface PaperStore {
  paper: PaperData;
  setPaper: (paper: Partial<PaperData>) => void;
  resetPaper: () => void;
}

const DEFAULT_PAPER: PaperData = {
  title: 'Untitled Paper',
  abstract: '',
  content: '',
  keywords: [],
  isSaving: false,
  isError: false,
};

export const usePaperStore = create<PaperStore>()(
  persist(
    (set) => ({
      paper: DEFAULT_PAPER,
      setPaper: (paperData) =>
        set((state) => ({
          paper: { ...state.paper, ...paperData },
        })),
      resetPaper: () => set({ paper: DEFAULT_PAPER }),
    }),
    {
      name: 'paper-storage',
    }
  )
);
