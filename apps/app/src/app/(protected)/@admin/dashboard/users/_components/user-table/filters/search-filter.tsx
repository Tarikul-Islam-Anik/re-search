'use client';

import type { User } from '@repo/database';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import type { Table } from '@tanstack/react-table';
import { CircleX, ListFilter } from 'lucide-react';
import type React from 'react';

interface SearchFilterProps {
  id: string;
  table: Table<User>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  error: Error | null;
}

export function SearchFilter({
  id,
  table,
  inputRef,
  isLoading,
  error,
}: SearchFilterProps) {
  const column = table.getColumn('name');
  const filterValue = column?.getFilterValue() as string;

  return (
    <div className="relative">
      <Input
        id={`${id}-input`}
        ref={inputRef}
        className={cn('peer ps-9 sm:min-w-60', filterValue && 'pe-9')}
        value={filterValue ?? ''}
        onChange={(e) => column?.setFilterValue(e.target.value)}
        placeholder="Filter by name or email..."
        type="text"
        aria-label="Filter by name or email"
        disabled={isLoading || !!error}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
      </div>
      {filterValue && (
        <button
          type="button"
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear filter"
          onClick={() => {
            column?.setFilterValue('');
            inputRef.current?.focus();
          }}
        >
          <CircleX size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
