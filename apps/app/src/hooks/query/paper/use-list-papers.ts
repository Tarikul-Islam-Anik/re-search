import { listPapers } from '@/services/paper-service';
import type { PaperData } from '@/store/use-paper-store';
import { useQuery } from '@tanstack/react-query';

export function useListPapers() {
  return useQuery<PaperData[]>({
    queryKey: ['papers'],
    queryFn: listPapers,
    refetchOnWindowFocus: false,
  });
}
