'use client';
import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { useReferences } from '@/hooks/query/reference/use-references';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/design-system/components/ui/alert-dialog';
import { Button } from '@repo/design-system/components/ui/button';
import { buttonVariants } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { cn } from '@repo/design-system/lib/utils';
import { FileDown } from 'lucide-react';
import { AlertCircle, Loader2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ReferencesPage() {
  const { references, isLoading, isError, error, deleteReference, isDeleting } =
    useReferences();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState<string | null>(
    null
  );

  const handleDeleteClick = (id: string) => {
    setReferenceToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (referenceToDelete) {
      await deleteReference(referenceToDelete);
      setDeleteConfirmOpen(false);
      setReferenceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setReferenceToDelete(null);
  };

  return (
    <Container>
      <Section>
        <div className="flex justify-between">
          <SectionHeader>
            <SectionTitle>Manage Papers</SectionTitle>
            <SectionDescription>
              Manage your papers in your vault.
            </SectionDescription>
          </SectionHeader>
          <Button asChild variant="outline">
            <Link href="/references/bulk-export">
              <FileDown className="" />
              Bulk Export
            </Link>
          </Button>
        </div>
        <SectionContent>
          <>
            <div>
              {isLoading && (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : 'Failed to load references'}
                  </AlertDescription>
                </Alert>
              )}

              {!isLoading && !isError && references?.length === 0 && (
                <div className="flex h-32 flex-col items-center justify-center space-y-3 text-center">
                  <p className="text-muted-foreground">
                    You haven't added any references yet
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/references/add">Add your first reference</Link>
                  </Button>
                </div>
              )}

              {!isLoading &&
                !isError &&
                references &&
                references.length > 0 && (
                  <div className="relative overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Authors</TableHead>
                          <TableHead>Journal</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead className="w-[50px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {references.map((reference) => (
                          <TableRow key={reference.id}>
                            <TableCell className="font-medium">
                              {reference.title}
                              {reference.doi && (
                                <div className="mt-1 text-muted-foreground text-xs">
                                  DOI: {reference.doi}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{reference.authors}</TableCell>
                            <TableCell>{reference.journal}</TableCell>
                            <TableCell>{reference.year}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    aria-label="Open menu"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/references/${reference.id}`}>
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/references/${reference.id}/edit`}
                                    >
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
                                    onClick={() =>
                                      handleDeleteClick(reference.id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </div>

            <AlertDialog
              open={deleteConfirmOpen}
              onOpenChange={setDeleteConfirmOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Reference</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this reference? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={cancelDelete}
                    disabled={isDeleting}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className={cn(
                      buttonVariants({ variant: 'destructive' }),
                      isDeleting ? 'cursor-not-allowed opacity-50' : ''
                    )}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className=" animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        </SectionContent>
      </Section>
    </Container>
  );
}
