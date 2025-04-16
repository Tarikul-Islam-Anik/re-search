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

export function DoiInput() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setReference = useReferenceStore((state) => state.setReference);

  const form = useForm<DoiInputFormValues>({
    resolver: zodResolver(doiInputSchema),
    defaultValues: {
      doi: '',
    },
  });

  const handleSubmit = async (values: DoiInputFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const reference = await fetchReferenceByDoi(values.doi);
      setReference(reference);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch reference data'
      );
      setIsLoading(false);
    }
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
                    <FormLabel htmlFor="doi">DOI</FormLabel>
                    <FormControl>
                      <Input
                        id="doi"
                        placeholder="Enter DOI (e.g., 10.1038/s41586-021-03819-2)"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can also paste a DOI URL (e.g.,
                      https://doi.org/10.1038/s41586-021-03819-2)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isLoading || !form.formState.isValid}
                className="mt-4 w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'get Reference'
                )}
              </Button>
            </form>
          </Form>
        </SectionContent>
      </Section>
    </Container>
  );
}
