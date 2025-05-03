'use client';

import { Container } from '@/components/container';
import { useGetUserStats } from '@/hooks/query/user/use-get-user-stats';
import { useUserStore } from '@/store/user';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { BookIcon, BookmarkIcon, FileTextIcon, FolderIcon } from 'lucide-react';

export default function Dashboard() {
  const { user } = useUserStore();
  const { data: stats, isLoading, error } = useGetUserStats(user?.id);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-semibold text-2xl">
            Please sign in to view your dashboard
          </h1>
        </div>
      </div>
    );
  }

  return (
    <Container className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="font-bold text-2xl">Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Your research activity overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Vaults Stat Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Vaults</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {stats?.vaultCount ?? 0}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Your organized research collections
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Files Stat Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Files</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {stats?.fileCount ?? 0}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Documents in your research library
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* References Stat Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">References</CardTitle>
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {stats?.referenceCount ?? 0}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Citations and bibliographic entries
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Journals Stat Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Journals</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {stats?.journalCount ?? 0}
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Research notes and journal entries
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mt-8 rounded-md bg-red-100 p-4 text-red-700">
          Error loading dashboard stats. Please try refreshing the page.
        </div>
      )}
    </Container>
  );
}
