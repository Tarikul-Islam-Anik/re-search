'use client';

import { useDeletePaper, useListPapers } from '@/hooks/query/paper';
import type { PaperData } from '@/store/use-paper-store';
import { Button } from '@repo/design-system/components/ui/button';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { format } from 'date-fns';
import { Edit, FileText, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Extended paper type returned from API that includes createdAt/updatedAt
interface PaperWithTimestamps extends PaperData {
  createdAt?: string;
  updatedAt?: string;
}

export default function PaperManagePage() {
  const {
    data: papers,
    isLoading,
    isError,
  } = useListPapers() as {
    data: PaperWithTimestamps[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  const deletePaper = useDeletePaper();
  const router = useRouter();

  function renderTableContent() {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="py-2">
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell className="py-2">
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell className="py-2">
            <Skeleton className="h-8 w-[180px]" />
          </TableCell>
        </TableRow>
      ));
    }

    if (!papers?.length) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            No papers found
          </TableCell>
        </TableRow>
      );
    }

    return papers.map((paper) => (
      <TableRow key={paper.id}>
        <TableCell className="py-2 font-medium">{paper.title}</TableCell>
        <TableCell className="py-2">
          {paper.createdAt ? format(new Date(paper.createdAt), 'PPP') : 'N/A'}
        </TableCell>
        <TableCell className="space-x-2 py-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (paper.id) {
                router.push(`/paper/write?paperId=${paper.id}`);
              }
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (paper.id) {
                router.push(`/paper/read?paperId=${paper.id}`);
              }
            }}
          >
            <FileText size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              try {
                if (paper.id) {
                  await deletePaper.mutateAsync(paper.id);
                  toast.success('Paper deleted successfully');
                }
              } catch (error) {
                toast.error('Failed to delete paper');
              }
            }}
            disabled={deletePaper.isPending}
          >
            <Trash2 size={16} />
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        Failed to load papers. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Manage Papers</h1>
        <Button onClick={() => router.push('/paper/write')}>
          Create New Paper
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Title</TableHead>
              <TableHead className="h-9 py-2">Created At</TableHead>
              <TableHead className="h-9 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>
    </div>
  );
}
