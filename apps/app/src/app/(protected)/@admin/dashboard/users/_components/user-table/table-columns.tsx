import type { Subscription, User } from '@repo/database';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { cn } from '@repo/design-system/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { RowActions } from './row-actions';
import { multiColumnFilterFn, statusFilterFn } from './table-filters-functions';

export const usersColumns: ColumnDef<
  User & { subscription: Subscription; _count: { vaults: number } }
>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const isChecked = table.getIsAllPageRowsSelected();
      const isIndeterminate = table.getIsSomePageRowsSelected();

      return (
        <Checkbox
          checked={isIndeterminate ? 'indeterminate' : isChecked}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="font-medium">{name || 'N/A'}</div>;
    },
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    size: 220,
  },
  {
    header: 'Plan',
    accessorKey: 'subscription.plan',
    cell: ({ row }) => {
      const plan = row.original.subscription.plan;
      return (
        <div className="text-muted-foreground capitalize">{plan || 'N/A'}</div>
      );
    },
    size: 120,
  },
  {
    header: 'Status',
    accessorKey: 'subscription.status',
    cell: ({ row }) => {
      const status = row.original.subscription.status;
      return (
        <Badge
          className={cn('capitalize', {
            'bg-green-500 dark:bg-green-600': status === 'ACTIVE',
            'bg-red-500 dark:bg-red-600': status === 'INACTIVE',
            'bg-yellow-500 dark:bg-yellow-600': status === 'TRIAL',
            'bg-gray-500 dark:bg-gray-600':
              status === 'EXPIRED' || status === 'CANCELLED',
          })}
        >
          {status}
        </Badge>
      );
    },
    size: 100,
    filterFn: statusFilterFn,
  },
  {
    header: 'Role',
    accessorKey: 'role',
    cell: ({ row }) => (
      <div>
        <span className="capitalize leading-none">
          {row.original.role}
        </span>{' '}
      </div>
    ),
    size: 100,
  },

  {
    header: 'Joined',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return createdAt ? format(createdAt, 'PPP') : 'N/A';
    },
    size: 120,
  },

  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];
