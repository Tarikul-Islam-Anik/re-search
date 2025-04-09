'use client';

import { useGetManyUsers } from '@/hooks/query/user/use-get-many-users';
import type { User } from '@repo/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design-system/components/ui/alert-dialog';
import { Button } from '@repo/design-system/components/ui/button';
import type { Table } from '@tanstack/react-table';
import axios from 'axios';
import { CircleAlert, Trash } from 'lucide-react';
import { toast } from 'sonner';
interface DeleteSelectedDialogProps {
  table: Table<User>;
}

export function DeleteSelectedAlert({ table }: DeleteSelectedDialogProps) {
  const { refetch } = useGetManyUsers();

  const selectedItems = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const selectedItemsCount = selectedItems.length;

  const handleDelete = async () => {
    for (const user of selectedItems) {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/user`, {
        data: {
          id: user.id,
        },
      });
    }
    await refetch();
    table.resetRowSelection();
    toast.success('Users deleted successfully');
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-auto" variant="outline">
          <Trash
            className="-ms-1 me-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Delete
          <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
            {selectedItemsCount}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {selectedItemsCount} selected{' '}
              {selectedItemsCount === 1 ? 'row' : 'rows'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
