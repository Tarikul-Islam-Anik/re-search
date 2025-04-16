import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import {
  getPaperDetails,
  searchPapers,
} from '../app/(protected)/@user/search/_components/search-api';
import type { SearchFilters } from '../app/(protected)/@user/search/_components/search-filter-types';

// Default filters
const defaultFilters: SearchFilters = {
  keywords: [],
  topics: [],
  journals: [],
  yearRange: [1990, new Date().getFullYear()],
  authors: [],
};

type SearchStore = {
  // Search state
  query: string;
  setQuery: (query: string) => void;
  filters: SearchFilters;
  updateFilters: (newFilters: Partial<SearchFilters>) => void;

  // Selected paper state
  selectedPaperId: string | null;
  selectPaper: (id: string) => void;

  // Reset state
  reset: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  // Search state
  query: '',
  setQuery: (query) => set({ query }),
  filters: defaultFilters,
  updateFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  // Selected paper state
  selectedPaperId: null,
  selectPaper: (id) => set({ selectedPaperId: id }),

  // Reset state
  reset: () =>
    set({
      query: '',
      filters: defaultFilters,
      selectedPaperId: null,
    }),
}));

// Hook to get papers based on the current query and filters
export function useSearchPapers() {
  const { query, filters } = useSearchStore();

  return useQuery({
    queryKey: ['papers', query, filters],
    queryFn: () => searchPapers(query, filters),
    enabled: query.length > 0,
  });
}

// Hook to get details of the selected paper
export function useSelectedPaper() {
  const selectedPaperId = useSearchStore((state) => state.selectedPaperId);

  return useQuery({
    queryKey: ['paperDetails', selectedPaperId],
    queryFn: () => (selectedPaperId ? getPaperDetails(selectedPaperId) : null),
    enabled: !!selectedPaperId,
  });
}
