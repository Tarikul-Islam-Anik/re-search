'use client';

import {
  AlertCircleIcon,
  Loader2Icon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';

import { Button } from '@repo/design-system/components/ui/button';
import {
  formatBytes,
  useFileUpload,
} from '@repo/design-system/hooks/use-file-upload';
import { useEffect } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
}

export default function FileUploader({
  onFileUpload,
  isProcessing,
}: FileUploaderProps) {
  const maxSize = 5 * 1024 * 1024; // 5MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    maxFiles: 1,
  });

  const file = files[0];

  const handleUpload = async () => {
    if (file && !isProcessing && file.file instanceof File) {
      await onFileUpload(file.file);
    }
  };

  // Call onFileUpload when a file is added
  // This effect runs whenever files change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (file && !isProcessing) {
      handleUpload();
    }
  }, [file?.id]); // Only depend on the file id to prevent unnecessary calls

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      {/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      {/* biome-ignore lint/a11y/useSemanticElements: <explanation> <explanation> */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className={`flex min-h-40 flex-col items-center justify-center rounded-xl border border-input border-dashed p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
          disabled={Boolean(file) || isProcessing}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            aria-hidden="true"
          >
            {isProcessing ? (
              <Loader2Icon className="size-4 animate-spin opacity-60" />
            ) : (
              <UploadIcon className="size-4 opacity-60" />
            )}
          </div>
          <p className="mb-1.5 font-medium text-sm">
            {isProcessing ? 'Processing...' : 'Upload file'}
          </p>
          <p className="text-muted-foreground text-xs">
            {isProcessing
              ? 'Please wait while we process your file'
              : `Drag & drop or click to browse (max. ${formatBytes(maxSize)})`}
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {file && (
        <div className="space-y-2">
          <div
            key={file.id}
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon
                className="size-4 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-[13px]">
                  {file.file.name}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove file"
              disabled={isProcessing}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
