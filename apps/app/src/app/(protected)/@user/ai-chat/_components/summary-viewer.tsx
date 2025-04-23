import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Typography } from './typography';

interface SummaryViewerProps {
  summary: string;
  isLoading: boolean;
}

export default function SummaryViewer({
  summary,
  isLoading,
}: SummaryViewerProps) {
  return (
    <ScrollArea className="h-[55vh]">
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      )}
      {!isLoading && summary && (
        <Typography variant="prose" className="max-w-none">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </Typography>
      )}
      {!isLoading && !summary && (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Upload a document to generate a summary
        </div>
      )}
    </ScrollArea>
  );
}
