'use client';

import { extractTextFromFile } from '@/lib/file-parser';
import { useDocumentStore } from '@/store/use-document-store';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import FileUploader from './file-uploader';

const InitialUploader = () => {
  const [error, setError] = useState<string | null>(null);
  const { addFile, isProcessing, setIsProcessing } = useDocumentStore();

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Extract text from the file
      const text = await extractTextFromFile(file, {
        preserveFormatting: true,
        includePageNumbers: true,
      });

      // Add file to store without summary
      const newFile = {
        id: uuidv4(),
        name: file.name,
        originalText: text,
        summary: '', // Empty summary, to be generated later
      };

      addFile(newFile);

      toast.success('File uploaded successfully', {
        description: `Text extracted from ${file.name}. Use the "Generate Summary" button to create a summary.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error('Error processing file', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid h-[90vh] grid-cols-1 place-items-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-3xl">Upload a Document</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Upload a PDF or TXT file to extract text. After uploading, you can
            generate a summary.
          </p>
          <div className="mt-6 w-full max-w-md">
            <FileUploader
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

InitialUploader.displayName = 'InitialUploader';

export default InitialUploader;
