'use client';

import { useDeleteFile, useGetFiles } from '@/hooks/query/file/use-get-files';
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
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export default function ManageFilesPage() {
  const { data: files, isLoading, isError } = useGetFiles();
  const deleteFile = useDeleteFile();

  function renderTableContent() {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="py-2">
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell className="py-2">
            <Skeleton className="h-4 w-[80px]" />
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

    if (!files?.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            No files found
          </TableCell>
        </TableRow>
      );
    }

    return files.map((file) => (
      <TableRow key={file.id}>
        <TableCell className="py-2 font-medium">{file.name}</TableCell>
        <TableCell className="py-2">{formatFileSize(file.size)}</TableCell>
        <TableCell className="py-2">
          {format(new Date(file.createdAt), 'PPP')}
        </TableCell>
        <TableCell className="space-x-2 py-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(file.url, '_blank')}
          >
            <Download />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              try {
                await deleteFile.mutateAsync(file.id);
                toast.success('File deleted successfully');
              } catch (error) {
                toast.error('Failed to delete file');
              }
            }}
            disabled={deleteFile.isPending}
          >
            <Trash2 />
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        Failed to load files. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Size</TableHead>
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
