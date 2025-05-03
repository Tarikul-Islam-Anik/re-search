'use client';

import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
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
import { createReference } from './reference-action';

export function ManualEntryForm() {
  const reference = useReferenceStore((state) => state.reference);
  const resetReference = useReferenceStore((state) => state.resetReference);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      id: '',
      doi: '',
      title: '',
      authors: '',
      journal: '',
      year: '',
      volume: '',
      issue: '',
      pages: '',
      url: '',
    },
  });

  // Update form values when reference data changes in the store
  useEffect(() => {
    // Only update if we have actual data (at least a title)
    if (reference.title) {
      form.reset({
        // We don't include id since it's usually generated on the server
        id: reference.id || '',
        doi: reference.doi || '',
        title: reference.title || '',
        authors: reference.authors || '',
        journal: reference.journal || '',
        year: reference.year || '',
        volume: reference.volume || '',
        issue: reference.issue || '',
        pages: reference.pages || '',
        url: reference.url || '',
      });
    }
  }, [reference, form]);

  const onSubmit = async (data: ReferenceFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create a copy without modifying the original data
      // Add a temporary id which will be replaced by the server
      await createReference({
        ...data,
        id: data.id || 'temp-id', // Provide a temporary ID that will be replaced on the server
      });

      // Reset the form and the reference store
      form.reset();
      resetReference();

      // Navigate to references list
      router.push('/references');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create reference'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Manual Reference Entry</SectionTitle>
          <SectionDescription>
            Enter the reference details manually
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="doi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="doi">DOI (optional)</FormLabel>
                        <FormControl>
                          <Input
                            id="doi"
                            placeholder="10.1000/xyz123"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Digital Object Identifier, e.g.,
                          10.1038/s41586-021-03819-2
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="title">Title *</FormLabel>
                        <FormControl>
                          <Input
                            id="title"
                            placeholder="Article title"
                            {...field}
                          />
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
                        <FormLabel htmlFor="authors">Authors *</FormLabel>
                        <FormControl>
                          <Input
                            id="authors"
                            placeholder="Smith, J., Johnson, A."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of authors (Last name, First
                          initial)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="journal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="journal">Journal *</FormLabel>
                        <FormControl>
                          <Input
                            id="journal"
                            placeholder="Journal name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="year">Year *</FormLabel>
                          <FormControl>
                            <Input id="year" placeholder="2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="volume">Volume</FormLabel>
                          <FormControl>
                            <Input id="volume" placeholder="12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="issue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="issue">Issue</FormLabel>
                          <FormControl>
                            <Input id="issue" placeholder="3" {...field} />
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
                          <FormLabel htmlFor="pages">Pages</FormLabel>
                          <FormControl>
                            <Input
                              id="pages"
                              placeholder="123-145"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="url">URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            id="url"
                            placeholder="https://journal.com/article"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="mt-6 pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !form.formState.isDirty}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Reference'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SectionContent>
      </Section>
    </Container>
  );
}
