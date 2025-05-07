'use client';
import {
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { useReferences } from '@/hooks/query/reference/use-references';
import { useCheckUserVaults } from '@/hooks/query/user/use-check-user-vaults';
import {
  type ReferenceFormValues,
  referenceSchema,
} from '@/schemas/reference-schema';
import { useReferenceStore } from '@/store/use-reference-store';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export function ManualEntryForm() {
  const reference = useReferenceStore((state) => state.reference);
  const resetReference = useReferenceStore((state) => state.resetReference);
  const { data } = useCheckUserVaults();
  const { createReference, isCreating } = useReferences();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      vaultId: data?.vaultId || '',
    },
  });

  // Update form values when reference data changes in the store
  useEffect(() => {
    // Only update if we have actual data (at least a title)
    if (reference.title) {
      form.reset({
        // We don't include id since it's usually generated on the server
        doi: reference.doi || '',
        title: reference.title || '',
        authors: reference.authors || '',
        journal: reference.journal || '',
        year: reference.year || '',
        volume: reference.volume || '',
        issue: reference.issue || '',
        pages: reference.pages || '',
        url: reference.url || '',
        vaultId: data?.vaultId || '',
      });
      form.clearErrors(); // Clear any previous errors
    }
  }, [reference, form, data?.vaultId]);

  // Update vaultId when it changes
  useEffect(() => {
    if (data?.vaultId) {
      form.setValue('vaultId', data.vaultId);
    }
  }, [data?.vaultId, form]);

  const onSubmit = async (values: ReferenceFormValues) => {
    setError(null);

    try {
      await createReference(values);
      resetReference();
      form.reset();
      router.push('/references');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create reference'
      );
    }
  };

  return (
    <div className="p-6">
      <SectionHeader>
        <SectionTitle>Manual Entry</SectionTitle>
        <SectionDescription>
          Add a reference manually by filling out the form below
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!data?.hasVaults && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to create a vault first before adding references
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <Input placeholder="Digital Object Identifier" {...field} />
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
                onClick={() => {
                  resetReference();
                  form.reset();
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isCreating || !data?.hasVaults}>
                {isCreating && <Loader2 className=" animate-spin" />}
                Add Reference
              </Button>
            </div>
          </form>
        </Form>
      </SectionContent>
    </div>
  );
}
