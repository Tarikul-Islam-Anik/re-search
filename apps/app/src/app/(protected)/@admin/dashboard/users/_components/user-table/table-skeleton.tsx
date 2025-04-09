'use client';

import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';

const columnHeaders = [
  '',
  'Name',
  'Email',
  'Phone Number',
  'Role',
  'Beta Access',
  'Joined',
  'Actions',
];

const TOTAL_ROWS = 9;

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[250px]" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columnHeaders.map((header) => (
                <TableHead key={header} className="h-11">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: TOTAL_ROWS }).map((_, i) => (
              <TableRow key={i}>
                {columnHeaders.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
    </div>
  );
}
