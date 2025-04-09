'use client';

import { useGetManyUsers } from '@/hooks/query/user/use-get-many-users';
import type { User } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import type { Row } from '@tanstack/react-table';
import axios from 'axios';
import { Ellipsis } from 'lucide-react';
import { toast } from 'sonner';

interface RowActionsProps {
  row: Row<User>;
}

export function RowActions({ row }: RowActionsProps) {
  const { refetch } = useGetManyUsers();

  const handleDelete = async () => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/user`, {
      data: {
        id: row.original.id,
      },
    });
    toast.success('Users deleted successfully');
    refetch();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Plan</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Student</DropdownMenuItem>
                <DropdownMenuItem>Researcher</DropdownMenuItem>
                <DropdownMenuItem>Institution</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
