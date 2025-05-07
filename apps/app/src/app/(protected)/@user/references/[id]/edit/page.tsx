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
  type ReferenceFormValues,
  referenceSchema,
} from '@/schemas/reference-schema';
import { referenceService } from '@/services/reference-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function ReferenceEditPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { updateReference, isUpdating } = useReferences();
  const [error, setError] = useState<string | null>(null);

  // Fetch reference data
  const {
    data: reference,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ['reference', id],
    queryFn: () => referenceService.getReference(id),
  });

  const form = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      doi: '',
      title: '',
      authors: '',
      journal: '',
      year: '',
      volume: '',
      issue: '',
      pages: '',
      url: '',
      vaultId: '',
    },
  });

  // Update form when reference data is fetched
  useEffect(() => {
    if (reference) {
      form.reset({
        doi: reference.doi || '',
        title: reference.title,
        authors: reference.authors,
        journal: reference.journal,
        year: reference.year || '',
        volume: reference.volume || '',
        issue: reference.issue || '',
        pages: reference.pages || '',
        url: reference.url || '',
        vaultId: reference.vaultId,
      });
    }
  }, [reference, form]);

  const onSubmit = async (data: ReferenceFormValues) => {
    setError(null);
    try {
      await updateReference({
        id,
        data,
      });
      router.push(`/references/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update reference'
      );
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Section>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <SectionContent>
            <div className="space-y-6">
              <FormItem>
                <Skeleton className="mb-2 h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </FormItem>

              <FormItem>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="mt-1 h-4 w-48" />
              </FormItem>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormItem>
                  <Skeleton className="mb-2 h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </FormItem>
                <FormItem>
                  <Skeleton className="mb-2 h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <FormItem key={i}>
                    <Skeleton className="mb-2 h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </FormItem>
                ))}
              </div>

              <FormItem>
                <Skeleton className="mb-2 h-4 w-10" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="mt-1 h-4 w-36" />
              </FormItem>

              <FormItem>
                <Skeleton className="mb-2 h-4 w-10" />
                <Skeleton className="h-10 w-full" />
              </FormItem>

              <div className="flex justify-end space-x-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </SectionContent>
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
            {fetchError instanceof Error
              ? fetchError.message
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
            <SectionTitle>Edit Reference</SectionTitle>
            <SectionDescription>
              Update the details of your reference
            </SectionDescription>
          </SectionHeader>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="" />
            Back
          </Button>
        </div>
        <SectionContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Publication title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authors *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Author names (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Format: Smith, J., Johnson, A.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="journal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Journal *</FormLabel>
                      <FormControl>
                        <Input placeholder="Journal name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <FormControl>
                        <Input placeholder="Publication year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume</FormLabel>
                      <FormControl>
                        <Input placeholder="Volume" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue</FormLabel>
                      <FormControl>
                        <Input placeholder="Issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pages</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123-145" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digital Object Identifier"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Format: 10.xxxx/xxxxx</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="URL to the publication" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <input type="hidden" {...form.register('vaultId')} />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className=" animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </SectionContent>
      </Section>
    </Container>
  );
}
