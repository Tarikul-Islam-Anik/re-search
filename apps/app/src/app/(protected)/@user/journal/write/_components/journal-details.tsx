'use client';

import { Container } from '@/components/container';
import { useJournalStore } from '@/store/use-journal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import MultipleSelector, {
  type Option,
} from '@repo/design-system/components/shared/multiselect';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { format } from 'date-fns';
import { PaperclipIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  attachmentType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const frameworks: Option[] = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
    disable: true,
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'angular',
    label: 'Angular',
  },
  {
    value: 'vue',
    label: 'Vue.js',
  },
  {
    value: 'react',
    label: 'React',
  },
  {
    value: 'ember',
    label: 'Ember.js',
  },
  {
    value: 'gatsby',
    label: 'Gatsby',
  },
  {
    value: 'eleventy',
    label: 'Eleventy',
    disable: true,
  },
  {
    value: 'solid',
    label: 'SolidJS',
  },
  {
    value: 'preact',
    label: 'Preact',
  },
  {
    value: 'qwik',
    label: 'Qwik',
  },
  {
    value: 'alpine',
    label: 'Alpine.js',
  },
  {
    value: 'lit',
    label: 'Lit',
  },
];
const JournalDetails = () => {
  const {
    getActiveEntry,
    activeEntryId,
    createEntry,
    updateEntry,
    removeAttachment,
  } = useJournalStore();

  // Create a new entry if there's no active entry on component mount
  useEffect(() => {
    if (!activeEntryId) {
      createEntry();
    }
  }, [activeEntryId, createEntry]);

  // Get the active journal entry
  const entry = getActiveEntry();

  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: entry?.title || '',
      attachmentType: 'document',
    },
  });

  // Update form values when entry changes
  useEffect(() => {
    if (entry) {
      form.reset({
        title: entry.title,
        attachmentType: form.getValues('attachmentType'),
      });
    }
  }, [entry, form]);

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (activeEntryId) {
      updateEntry(activeEntryId, { title: values.title });
    }
  };

  // Handle title changes to save immediately
  const handleTitleChange = (value: string) => {
    if (activeEntryId) {
      updateEntry(activeEntryId, { title: value });
    }
  };

  // Format dates for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return 'N/A';
    }
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  return (
    <Container className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Journal Entry Title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTitleChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attachments */}
          <div className="space-y-2">
            <div className="space-y-4">
              {/* Attachment Type Selector */}
              <FormField
                control={form.control}
                name="attachmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment Type</FormLabel>
                    <MultipleSelector options={frameworks} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Existing attachments */}
              {entry?.attachments && entry.attachments.length > 0 ? (
                <div className="space-y-2">
                  {entry.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {attachment.name}
                          <span className="ml-2 text-muted-foreground text-xs">
                            ({attachment.type})
                          </span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          activeEntryId &&
                          removeAttachment(activeEntryId, attachment.id)
                        }
                        type="button"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </Form>

      {/* Created & Updated timestamps */}
      <div className="space-y-2">
        <div className="space-y-1 text-muted-foreground text-xs">
          <p>Created: {formatDate(entry?.createdAt)}</p>
          <p>Updated: {formatDate(entry?.updatedAt)}</p>
        </div>
      </div>
    </Container>
  );
};

JournalDetails.displayName = 'JournalDetails';

export default JournalDetails;
