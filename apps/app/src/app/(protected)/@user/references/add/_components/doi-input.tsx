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
  type DoiInputFormValues,
  doiInputSchema,
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
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchReferenceByDoi } from './reference-action';

// Define a type for the API response
type ReferenceApiResponse = {
  id?: string;
  doi?: string;
  title?: string;
  authors?: string;
  journal?: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  [key: string]: unknown;
};

export function DoiInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setReference = useReferenceStore((state) => state.setReference);
  const resetReference = useReferenceStore((state) => state.resetReference);

  const form = useForm<DoiInputFormValues>({
    resolver: zodResolver(doiInputSchema),
    defaultValues: {
      doi: '',
    },
  });

  // Format reference data with proper typing
  const formatReferenceData = (data: ReferenceApiResponse) => {
    return {
      doi: data.doi || '',
      title: data.title || '',
      authors: data.authors || '',
      journal: data.journal || '',
      year: data.year || '',
      volume: data.volume || '',
      issue: data.issue || '',
      pages: data.pages || '',
      url: data.url || '',
      ...(data.id ? { id: data.id } : {}),
    };
  };

  const handleSubmit = async (values: DoiInputFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Extract reference data from API call
      const referenceData = await fetchReferenceByDoi(values.doi);

      // Format and update the reference store
      setReference(formatReferenceData(referenceData));

      // Reset form
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch reference data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    resetReference();
    setError(null);
  };

  return (
    <Container>
      <Section>
        <SectionHeader>
          <SectionTitle>Automatic entry</SectionTitle>
          <SectionDescription>
            Enter a DOI (Digital Object Identifier) to automatically fetch
            reference data
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="10.1038/s41586-021-03819-2"
                          {...field}
                          disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Lookup'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleReset}
                          disabled={isLoading}
                        >
                          Reset
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter a Digital Object Identifier (DOI) to automatically
                      fill the reference form
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </SectionContent>
      </Section>
    </Container>
  );
}
