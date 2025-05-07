import { getPaper } from '@/services/paper-service';
import { useLatexEditorStore } from '@/store/use-latex-editor-store';
import { usePaperStore } from '@/store/use-paper-store';
import type { PaperData } from '@/store/use-paper-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useGetPaper(paperId: string | null) {
  const { setPaper } = usePaperStore();
  const { setContent } = useLatexEditorStore();

  const query = useQuery<PaperData | null>({
    queryKey: ['paper', paperId],
    queryFn: async () => {
      if (!paperId) return null;
      return getPaper(paperId);
    },
    enabled: !!paperId,
    refetchOnWindowFocus: false,
  });

  // Handle store updates when data changes
  useEffect(() => {
    if (query.data) {
      setPaper(query.data);
      if (query.data.content) {
        setContent(query.data.content);
      }
    }
  }, [query.data, setPaper, setContent]);

  return query;
}
