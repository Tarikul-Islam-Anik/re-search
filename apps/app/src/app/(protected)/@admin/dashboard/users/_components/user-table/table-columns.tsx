import type { User } from '@repo/database';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { cn } from '@repo/design-system/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { RowActions } from './row-actions';
import { multiColumnFilterFn, statusFilterFn } from './table-filters-functions';

export const usersColumns: ColumnDef<User>[] = [
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
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
    cell: ({ row }) => {
      const phoneNumber = row.getValue('phoneNumber') as string;
      return (
        <div className="text-muted-foreground">{phoneNumber || 'N/A'}</div>
      );
    },
    size: 120,
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
    header: 'Beta Access',
    accessorKey: 'betaAccess',
    cell: ({ row }) => {
      const betaAccess = row.getValue('betaAccess');
      return (
        <Badge
          className={cn(
            Boolean(!betaAccess) &&
              'bg-muted-foreground/60 text-primary-foreground'
          )}
        >
          {betaAccess ? 'Yes' : 'No'}
        </Badge>
      );
    },
    size: 100,
    filterFn: statusFilterFn,
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
