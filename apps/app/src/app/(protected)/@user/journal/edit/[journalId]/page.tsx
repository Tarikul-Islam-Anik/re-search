'use client';

import { useJournal } from '@/hooks/query/journal/use-journal';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { Loader2, XCircle } from 'lucide-react';
import { use } from 'react';
import Editor from '../../write/_components/editor';
import JournalDetails from '../../write/_components/journal-details';
interface JournalEditPageProps {
  params: Promise<{
    journalId: string;
  }>;
}
const JournalEditPage = ({ params }: JournalEditPageProps) => {
  const { journalId } = use(params);
  const { isLoading, isError } = useJournal(journalId);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <XCircle className="size-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load the journal entry. Please try again later or check if
            the entry exists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show the editor with the loaded journal entry
  return (
    <div className="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <Editor
        placeholder="Edit your thoughts here..."
        editorClassName="p-4 sm:px-6 lg:px-8 min-h-[73.5vh]"
      />
      <JournalDetails isEditMode={true} />
    </div>
  );
};

JournalEditPage.displayName = 'JournalEditPage';

export default JournalEditPage;
