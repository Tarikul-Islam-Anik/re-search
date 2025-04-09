'use client';
import type { Subscription, User } from '@repo/database';
import type { Table } from '@tanstack/react-table';
import type React from 'react';
import { DeleteSelectedAlert } from './delete-selected-alert';
import { SearchFilter } from './filters/search-filter';
import { StatusFilter } from './filters/status-filter';
import { ViewColumns } from './filters/view-columns';

interface TableFiltersProps {
  id: string;
  table: Table<
    User & { subscription: Subscription; _count: { vaults: number } }
  >;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
  error: Error | null;
}

export default function TableFilters({
  id,
  table,
  inputRef,
  isLoading,
  error,
}: TableFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <SearchFilter
          id={id}
          table={table}
          inputRef={inputRef}
          isLoading={isLoading}
          error={error}
        />
        <StatusFilter
          id={id}
          table={table}
          isLoading={isLoading}
          error={error}
        />
      </div>
      <div className="flex items-center gap-3">
        {table.getSelectedRowModel().rows.length > 0 && (
          <DeleteSelectedAlert table={table} />
        )}
        <ViewColumns table={table} />
      </div>
    </div>
  );
}
