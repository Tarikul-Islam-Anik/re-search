'use client';

import type { User } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import type { Table } from '@tanstack/react-table';
import { Columns3 } from 'lucide-react';

interface ViewColumnsProps {
  table: Table<User>;
}

export function ViewColumns({ table }: ViewColumnsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Columns3
            className="opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(event) => event.preventDefault()}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
