'use client';

import { Container } from '@/components/container';
import { useJournalOperations } from '@/hooks/query/journal/use-journal-operations';
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
import { Loader2Icon, PaperclipIcon, SaveIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  attachmentType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to get file type from URL or name
function getFileType(file: { url: string; name: string }) {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Map common extensions to general types
  const typeMap: Record<string, string> = {
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    txt: 'document',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    mp4: 'video',
    mov: 'video',
    mp3: 'audio',
    wav: 'audio',
  };

  return extension ? typeMap[extension] || 'document' : 'document';
}

interface JournalDetailsProps {
  isEditMode?: boolean;
}

const JournalDetails = ({ isEditMode = false }: JournalDetailsProps) => {
  const router = useRouter();
  const {
    getActiveEntry,
    activeEntryId,
    createEntry,
    updateEntry,
    removeAttachment,
    clearActiveEntry,
  } = useJournalStore();

  const { saveCurrentEntry, isLoading, availableFiles } =
    useJournalOperations();

  // Create a new entry if there's no active entry on component mount
  // but only if we're not in edit mode (where entry is loaded from API)
  useEffect(() => {
    if (!activeEntryId && !isEditMode) {
      createEntry();
    }
  }, [activeEntryId, createEntry, isEditMode]);

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
  const onSubmit = async (values: FormValues) => {
    if (activeEntryId) {
      updateEntry(activeEntryId, { title: values.title });
      try {
        await saveCurrentEntry();
        toast.success('Journal entry saved successfully');
        // Clear active entry and redirect to timeline
        clearActiveEntry();
        router.push('/journal/timeline');
      } catch (error) {
        toast.error('Failed to save journal entry');
      }
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

  // Convert available files to options for MultipleSelector
  const fileOptions: Option[] =
    availableFiles?.map((file) => ({
      label: file.name,
      value: file.id,
    })) || [];

  // Get currently selected file IDs
  const selectedFileIds = entry?.attachments.map((a) => a.id) || [];

  return (
    <Container className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-end gap-x-2">
            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
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

            {/* Save Button */}
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <SaveIcon />
              )}
            </Button>
          </div>
          {/* Attachments */}
          <div className="space-y-2">
            <div className="space-y-4">
              {/* Attachment Type Selector */}
              <FormField
                control={form.control}
                name="attachmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <MultipleSelector
                      options={fileOptions}
                      value={fileOptions.filter((opt) =>
                        selectedFileIds.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        if (activeEntryId && availableFiles) {
                          const selectedFiles = availableFiles.filter((f) =>
                            selected.some((s) => s.value === f.id)
                          );
                          updateEntry(activeEntryId, {
                            attachments: selectedFiles.map((f) => ({
                              id: f.id,
                              name: f.name,
                              url: f.url,
                              type: getFileType(f),
                            })),
                          });
                        }
                      }}
                    />
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
