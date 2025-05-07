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
import { referenceService } from '@/services/reference-service';
import {
  type CitationStyle,
  formatCitation,
  getCitationStyles,
} from '@/utils/citation-formatter';
import {
  type ExportFormat,
  downloadFile,
  exportReference,
  getExportFormats,
} from '@/utils/export-reference';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Label } from '@repo/design-system/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@repo/design-system/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Download,
  Edit,
  Loader2,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReferenceDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { deleteReference, isDeleting } = useReferences();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [citationStyle, setCitationStyle] = useState<CitationStyle>('apa');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('bibtex');
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const {
    data: reference,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reference', id],
    queryFn: () => referenceService.getReference(id),
  });

  const handleDelete = async () => {
    await deleteReference(id);
    setDeleteConfirmOpen(false);
    router.push('/references');
  };

  const handleCopyCitation = () => {
    if (!reference) return;

    const formattedCitation = formatCitation(reference, citationStyle);
    navigator.clipboard.writeText(formattedCitation);

    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportReference = () => {
    if (!reference) return;

    try {
      const { content, filename, mimeType } = exportReference(
        reference,
        exportFormat
      );
      downloadFile(content, filename, mimeType);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to export reference:', err);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Section>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[180px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-4 flex">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="mr-2 h-10 w-24" />
              ))}
            </div>
            <div className="space-y-6 rounded-lg border p-6">
              <div className="space-y-2">
                <Skeleton className="h-7 w-[70%]" />
                <Skeleton className="h-4 w-[40%]" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-[60px]" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-[60px]" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  if (isError || !reference) {
    return (
      <Container>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Failed to load reference details'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push('/references')}>
            <ArrowLeft className="" />
            Back to References
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <div className="flex items-center justify-between">
          <SectionHeader>
            <SectionTitle>Reference Details</SectionTitle>
            <SectionDescription>
              View and manage your reference
            </SectionDescription>
          </SectionHeader>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/references">
                <ArrowLeft className="" />
                Back
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/references/${id}/edit`}>
                <Edit className="" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash className="" />
              Delete
            </Button>
          </div>
        </div>
        <SectionContent>
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="citation">Citation</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{reference.title}</CardTitle>
                  {reference.doi && (
                    <CardDescription>DOI: {reference.doi}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-semibold">Authors</h3>
                      <p>{reference.authors}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Journal</h3>
                      <p>{reference.journal}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div>
                      <h3 className="mb-2 font-semibold">Year</h3>
                      <p>{reference.year}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Volume</h3>
                      <p>{reference.volume || '—'}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Issue</h3>
                      <p>{reference.issue || '—'}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Pages</h3>
                      <p>{reference.pages || '—'}</p>
                    </div>
                  </div>

                  {reference.url && (
                    <div>
                      <h3 className="mb-2 font-semibold">URL</h3>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {reference.url}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-semibold">Created</h3>
                      <p>
                        {new Date(reference.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">Last Updated</h3>
                      <p>
                        {new Date(reference.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="citation">
              <Card>
                <CardHeader>
                  <CardTitle>Citation</CardTitle>
                  <CardDescription>
                    Generate a citation in your preferred format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div className="mb-2 flex w-full max-w-sm items-center space-x-2">
                        <Select
                          value={citationStyle}
                          onValueChange={(value) =>
                            setCitationStyle(value as CitationStyle)
                          }
                        >
                          <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select citation style" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCitationStyles().map((style) => (
                              <SelectItem key={style.id} value={style.id}>
                                {style.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyCitation}
                        >
                          <Copy className="" />
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <p className="whitespace-pre-wrap text-sm">
                        {formatCitation(reference, citationStyle)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card>
                <CardHeader>
                  <CardTitle>Export Reference</CardTitle>
                  <CardDescription>
                    Export this reference in your preferred format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-6">
                    <div>
                      <h3 className="mb-3 font-medium text-sm">
                        Export Format
                      </h3>
                      <RadioGroup
                        value={exportFormat}
                        onValueChange={(value) =>
                          setExportFormat(value as ExportFormat)
                        }
                        className="space-y-3"
                      >
                        {getExportFormats().map((format) => (
                          <div
                            key={format.id}
                            className="flex items-start space-x-2"
                          >
                            <RadioGroupItem value={format.id} id={format.id} />
                            <div className="grid gap-0.5 leading-none">
                              <Label
                                htmlFor={format.id}
                                className="font-medium"
                              >
                                {format.name}
                              </Label>
                              <p className="text-muted-foreground text-xs">
                                {format.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleExportReference}>
                        <Download className="" />
                        {exportSuccess
                          ? 'Downloaded!'
                          : `Download as ${exportFormat.toUpperCase()}`}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SectionContent>
      </Section>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reference</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reference? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className=" animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
