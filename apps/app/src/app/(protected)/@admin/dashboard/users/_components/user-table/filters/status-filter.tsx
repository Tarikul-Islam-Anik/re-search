'use client';

import type { Subscription, User } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { Label } from '@repo/design-system/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import type { Table } from '@tanstack/react-table';
import { Filter } from 'lucide-react';
import { useMemo } from 'react';

interface StatusFilterProps {
  id: string;
  table: Table<
    User & { subscription: Subscription; _count: { vaults: number } }
  >;
  isLoading: boolean;
  error: Error | null;
}

export function StatusFilter({
  id,
  table,
  isLoading,
  error,
}: StatusFilterProps) {
  // Get unique role values
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn('role');

    if (!statusColumn) {
      return [];
    }

    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn('role')?.getFacetedUniqueValues()]);

  // Get counts for each role
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn('role');

    if (!statusColumn) {
      return new Map();
    }

    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn('role')?.getFacetedUniqueValues()]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn('role')?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn('role')?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn('role')?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn('role')
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={isLoading || !!error}>
          <Filter
            className="opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Role
          {selectedStatuses.length > 0 && (
            <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
              {selectedStatuses.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-36 p-3" align="start">
        <div className="space-y-3">
          <div className="font-medium text-muted-foreground text-xs">
            Filters
          </div>
          <div className="space-y-3">
            {uniqueStatusValues.map((value, i) => (
              <div key={value + i} className="flex items-center gap-2">
                <Checkbox
                  id={`${id}-${i}`}
                  checked={selectedStatuses.includes(value)}
                  onCheckedChange={(checked: boolean) =>
                    handleStatusChange(checked, value)
                  }
                />
                <Label
                  htmlFor={`${id}-${i}`}
                  className="flex grow justify-between gap-2 font-normal capitalize"
                >
                  {value}
                  <span className="ms-2 text-muted-foreground text-xs">
                    {statusCounts.get(value)}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
