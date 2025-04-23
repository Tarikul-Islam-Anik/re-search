'use client';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from './typography';

interface DocumentViewerProps {
  text: string;
  isLoading: boolean;
  viewMode: 'raw' | 'preview';
}

export default function DocumentViewer({
  text,
  isLoading,
  viewMode,
}: DocumentViewerProps) {
  const [markdownText, setMarkdownText] = useState(text);

  useEffect(() => {
    // If the text doesn't look like markdown, try to convert it to markdown
    // This is a simple heuristic and might need improvement for real-world use
    if (
      text &&
      !text.includes('#') &&
      !text.includes('*') &&
      !text.includes('_')
    ) {
      // Convert plain text to markdown by adding some basic formatting
      // This is a very simple conversion and would need to be more sophisticated in a real app
      const lines = text.split('\n');
      const formattedLines = lines.map((line) => {
        // Try to detect headings by length and position
        if (line.length < 50 && line.trim() && !line.endsWith('.')) {
          return `## ${line}`;
        }
        return line;
      });
      setMarkdownText(formattedLines.join('\n'));
    } else {
      setMarkdownText(text);
    }
  }, [text]);

  return (
    <ScrollArea className="h-[55vh]">
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      )}
      {!isLoading && !markdownText && (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Upload a document to see the content here
        </div>
      )}
      {!isLoading && markdownText && viewMode === 'raw' && (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
          {markdownText}
        </pre>
      )}
      {!isLoading && markdownText && viewMode === 'preview' && (
        <Typography variant="prose" className="max-w-none">
          <ReactMarkdown>{markdownText}</ReactMarkdown>
        </Typography>
      )}
    </ScrollArea>
  );
}
