'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import LatexEditor from '@/components/latex-editor/latex-editor';
import { useGetPaper, useSavePaper } from '@/hooks/query/paper';
import { useLatexEditorStore } from '@/store/use-latex-editor-store';
import { usePaperStore } from '@/store/use-paper-store';
import { Button } from '@repo/design-system/components/ui/button';
import { Loader2 } from 'lucide-react';

const PaperWritePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paperId = searchParams.get('id');

  const { paper, setPaper } = usePaperStore();
  const { content } = useLatexEditorStore();

  // Fetch paper if ID is provided
  const { isLoading: isFetching } = useGetPaper(paperId);

  // Save paper mutation
  const { mutate: saveOrUpdatePaper, isPending: isSaving } = useSavePaper({
    onSuccess: (data) => {
      setPaper({ id: data.id, isSaving: false });

      // Navigate to the edit page with the ID if it's a new paper
      if (!paperId && data.id) {
        router.push(`/paper/write?id=${data.id}`);
      }
    },
    onError: () => {
      setPaper({ isError: true, errorMessage: 'Failed to save paper' });
    },
  });

  // Sync content with paper content when editing
  useEffect(() => {
    setPaper({ content });
  }, [content, setPaper]);

  // Auto-save on content change with debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (paper.id && content && !isSaving) {
        saveOrUpdatePaper(paper);
      }
    }, 3000);

    return () => clearTimeout(timerId);
  }, [content, paper, isSaving, saveOrUpdatePaper]);

  const handleSave = () => {
    setPaper({ isSaving: true });
    saveOrUpdatePaper(paper);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between bg-muted/20 p-4">
        <input
          type="text"
          value={paper.title}
          onChange={(e) => setPaper({ title: e.target.value })}
          className="w-full border-none bg-transparent font-medium text-lg outline-none focus:ring-0"
          placeholder="Untitled Paper"
        />
        <Button
          onClick={handleSave}
          disabled={isSaving || isFetching}
          className="ml-2"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className="flex-1">
        <LatexEditor />
      </div>
    </div>
  );
};

PaperWritePage.displayName = 'PaperWritePage';

export default PaperWritePage;
