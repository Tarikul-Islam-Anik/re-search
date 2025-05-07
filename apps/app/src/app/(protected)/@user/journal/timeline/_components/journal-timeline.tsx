'use client';

import { useJournals } from '@/hooks/query/journal/use-journals';
import { generateJournalReflection } from '@/lib/ai-utils';
import type { Journal } from '@/services/journal-service';
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
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { format, isSameDay } from 'date-fns';
import {
  Loader2Icon,
  PaperclipIcon,
  PencilIcon,
  SparklesIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// Group journals by date
interface GroupedJournals {
  date: Date;
  entries: Journal[];
}

// TipTap JSON structure types
interface TipTapTextNode {
  type: 'text';
  text: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

interface TipTapDoc {
  type: 'doc';
  content: TipTapNode[];
}

const JournalTimeline = () => {
  const router = useRouter();
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);
  const [journalForReflection, setJournalForReflection] =
    useState<Journal | null>(null);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isReflectionLoading, setIsReflectionLoading] = useState(false);

  const { journals, isLoading, isError, deleteJournal, isDeleting } =
    useJournals();

  // Group journals by date
  const groupedJournals: GroupedJournals[] = journals
    ? journals
        .reduce((groups: GroupedJournals[], journal) => {
          const journalDate = new Date(journal.createdAt);

          // Check if we already have a group for this date
          const existingGroup = groups.find((group) =>
            isSameDay(group.date, journalDate)
          );

          if (existingGroup) {
            existingGroup.entries.push(journal);
          } else {
            groups.push({
              date: journalDate,
              entries: [journal],
            });
          }

          return groups;
        }, [])
        // Sort groups by date (newest first)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    : [];

  const handleEditEntry = (journalId: string) => {
    router.push(`/journal/edit/${journalId}`);
  };

  const handleDeleteEntry = (journalId: string) => {
    setJournalToDelete(journalId);
  };

  const confirmDelete = () => {
    if (journalToDelete) {
      deleteJournal(journalToDelete);
      setJournalToDelete(null);
    }
  };

  const cancelDelete = () => {
    setJournalToDelete(null);
  };

  const handleAiReflection = async (journalId: string) => {
    const journalEntry = journals?.find((j) => j.id === journalId);

    if (!journalEntry) {
      toast.error('Journal entry not found');
      return;
    }

    setJournalForReflection(journalEntry);
    setIsReflectionLoading(true);
    setAiReflection(null);

    try {
      // Extract content from the journal entry
      let journalContent: string;
      try {
        // Try to parse as JSON (from rich text editor)
        const parsedContent = JSON.parse(journalEntry.content);
        // For now, use a simple placeholder since we don't know the exact format
        journalContent = `Title: ${journalEntry.title || 'Untitled Entry'}\n\nContent: Rich text format`;
      } catch {
        // If not JSON, use the content directly
        journalContent = `Title: ${journalEntry.title || 'Untitled Entry'}\n\n${journalEntry.content}`;
      }

      // Generate AI reflection using the specialized journal reflection function
      const reflection = await generateJournalReflection(journalContent);
      setAiReflection(reflection);
    } catch (error) {
      console.error('Error generating AI reflection:', error);
      toast.error('Failed to generate AI reflection. Please try again later.');
      setAiReflection('Failed to generate reflection. Please try again.');
    } finally {
      setIsReflectionLoading(false);
    }
  };

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  if (isError) {
    return (
      <div className="container">
        <h1 className="mb-10 text-center font-bold text-3xl text-foreground tracking-tighter lg:text-6xl">
          Timeline
        </h1>
        <div className="text-center text-red-500">
          Failed to load journal entries. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        data-orientation="vertical"
        data-slot="separator-root"
        className="absolute top-4 left-2 shrink-0 bg-muted data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
      />

      {groupedJournals.length > 0 ? (
        groupedJournals.map((group) => (
          <DateGroup
            key={group.date.toISOString()}
            date={group.date}
            entries={group.entries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
            onAiReflection={handleAiReflection}
          />
        ))
      ) : (
        <div className="flex flex-col gap-y-4 py-10 text-center">
          <p className="text-muted-foreground">
            No journal entries yet. Create your first entry!
          </p>
          <Link href="/journal/write">
            <Button>
              <PencilIcon />
              Create Entry
            </Button>
          </Link>
        </div>
      )}
      <AlertDialog
        open={!!journalToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              journal entry and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Reflection Dialog */}
      <Dialog
        open={!!journalForReflection}
        onOpenChange={(open) => !open && setJournalForReflection(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-lg overflow-auto">
          <DialogHeader>
            <DialogTitle>
              AI Reflection: {journalForReflection?.title || 'Untitled Entry'}
            </DialogTitle>
            <DialogDescription>
              AI-generated insights based on your journal entry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isReflectionLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-center text-muted-foreground">
                  Analyzing your journal entry...
                </p>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {aiReflection ? (
                  <div className="whitespace-pre-wrap">{aiReflection}</div>
                ) : (
                  <p>No reflection available. Please try again.</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Date group component
interface DateGroupProps {
  date: Date;
  entries: Journal[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAiReflection: (id: string) => void;
}

const DateGroup = ({
  date,
  entries,
  onEdit,
  onDelete,
  onAiReflection,
}: DateGroupProps) => {
  const formattedDate = format(date, 'MMMM d, yyyy');

  return (
    <div className="relative mb-10 pl-8">
      <div className="absolute top-2 left-0 flex size-5 items-center justify-center rounded-full bg-primary">
        <div className="size-3 rounded-full bg-white" />
      </div>
      <span
        data-slot="badge"
        className="mb-4 inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-xl border border-transparent bg-secondary px-3 py-2 font-medium text-secondary-foreground text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;>svg]:pointer-events-none [&amp;>svg]:size-3 [a&amp;]:hover:bg-secondary/90"
      >
        {formattedDate}
      </span>

      {/* Display all entries for this date */}
      <div className="space-y-4">
        {entries.map((journal) => (
          <JournalEntryItem
            key={journal.id}
            journal={journal}
            onEdit={onEdit}
            onDelete={onDelete}
            onAiReflection={onAiReflection}
          />
        ))}
      </div>
    </div>
  );
};

// Individual journal entry component
interface JournalEntryItemProps {
  journal: Journal;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAiReflection: (id: string) => void;
}

const JournalEntryItem = ({
  journal,
  onEdit,
  onDelete,
  onAiReflection,
}: JournalEntryItemProps) => {
  // Helper function to get content preview
  const getContentPreview = (content: string): string[] => {
    try {
      // Try to parse as JSON, as stored by the editor
      const parsedContent = JSON.parse(content) as
        | TipTapDoc
        | { text: string }[];

      // Handle TipTap JSON content
      if ('type' in parsedContent && parsedContent.type === 'doc') {
        // Extract text content from TipTap JSON structure
        const extractText = (node: TipTapNode): string => {
          if (node.type === 'text') {
            return node.text || '';
          }
          if (node.content) {
            return node.content.map(extractText).join('');
          }
          return '';
        };

        // Get the first few paragraphs
        const paragraphs = parsedContent.content
          ?.filter((node: TipTapNode) => node.type === 'paragraph')
          .slice(0, 3)
          .map((node: TipTapNode) => extractText(node))
          .filter(Boolean);

        return paragraphs.length > 0 ? paragraphs : ['No content available'];
      }

      // Fallback for other JSON formats
      return Array.isArray(parsedContent)
        ? parsedContent.map((item) => item.text)
        : ['No content available'];
    } catch {
      // If not JSON, split into bullet points by new lines
      const lines = content.split('\n').filter((line) => line.trim());
      return lines.length > 0 ? lines.slice(0, 3) : ['No content available'];
    }
  };

  const contentItems = getContentPreview(journal.content);

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{journal.title || 'Untitled Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {contentItems.map((item, i) => (
            <div
              key={i}
              className="prose dark:prose-invert max-w-none"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: item.replaceAll('\n', '<br />').replaceAll('"', ''),
              }}
            />
          ))}
        </div>
      </CardContent>
      <div className=" absolute top-4 right-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onAiReflection(journal.id)}
                >
                  <SparklesIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Reflection</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(journal.id)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Entry</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onDelete(journal.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Entry</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {journal.files && journal.files.length > 0 && (
        <CardFooter className="border-t pt-6">
          <h4 className="mb-2 font-medium text-sm">Attachments:</h4>
          <div className="flex flex-wrap gap-2">
            {journal.files.map((file) => (
              <Badge
                key={file.id}
                variant="secondary"
                className="flex items-center"
              >
                <PaperclipIcon className="mr-1 h-3 w-3" />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {file.name}
                </a>
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Skeleton loader for the timeline
const TimelineSkeleton = () => (
  <div className="relative">
    <div
      data-orientation="vertical"
      data-slot="separator-root"
      className="absolute top-4 left-2 shrink-0 bg-muted data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
    />
    {[1, 2].map((n) => (
      <div key={n} className="relative mb-10 pl-8">
        <div className="absolute top-2 left-0 flex size-5 items-center justify-center rounded-full bg-muted">
          <div className="size-3 rounded-full bg-muted-foreground/40" />
        </div>
        <Skeleton className="mb-4 h-8 w-32" />
        <div className="space-y-4">
          {[1, 2].map((j) => (
            <div
              key={j}
              className="flex flex-col gap-4 rounded-xl border bg-card px-4 py-6 text-card-foreground"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default JournalTimeline;
