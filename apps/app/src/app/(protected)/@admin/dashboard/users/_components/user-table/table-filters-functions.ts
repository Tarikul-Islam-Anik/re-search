import type { Subscription, User } from '@repo/database';
import type { FilterFn } from '@tanstack/react-table';

export const multiColumnFilterFn: FilterFn<
  User & { subscription: Subscription; _count: { vaults: number } }
> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const statusFilterFn: FilterFn<
  User & { subscription: Subscription; _count: { vaults: number } }
> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) {
    return true;
  }
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};
