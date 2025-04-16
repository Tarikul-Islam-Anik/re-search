import { create } from 'zustand';

// Define the shape of our reference state
interface Reference {
  id?: string;
  doi: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
  url: string;
}

interface ReferenceStore {
  reference: Reference;
  setReference: (data: Reference) => void;
  resetReference: () => void;
}

// Default empty state
const defaultReference: Reference = {
  doi: '',
  title: '',
  authors: '',
  journal: '',
  year: '',
  volume: '',
  issue: '',
  pages: '',
  url: '',
};

// Create the store
export const useReferenceStore = create<ReferenceStore>((set) => ({
  reference: defaultReference,
  setReference: (data) => set({ reference: data }),
  resetReference: () => set({ reference: defaultReference }),
}));
