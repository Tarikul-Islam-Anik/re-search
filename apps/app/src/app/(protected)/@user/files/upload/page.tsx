'use client';

import FileUploader from '@/components/file-uploader';
import { useCheckUserVaults } from '@/hooks/query/user/use-check-user-vaults';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const FileUploadPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data } = useCheckUserVaults();

  const router = useRouter();

  const vaultId = data?.vaultId;

  const handleFileUpload = async (file: File) => {
    try {
      if (!vaultId) {
        toast.error('No vault available', {
          description: 'Please create a vault first before uploading files.',
        });
        return;
      }

      setIsProcessing(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/vault/${vaultId}/file`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMessage = 'Failed to upload file';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      toast.success('File uploaded successfully', {
        description: `${file.name} has been uploaded to your vault.`,
      });

      router.push('/files/manage');
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload file';
      toast.error('Upload failed', {
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid h-[90vh] grid-cols-1 place-items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-3xl">Upload a Document</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Upload a PDF or TXT file to extract text. You can store and manage
          multiple files.
        </p>
        <div className="mt-6 w-full max-w-md">
          <FileUploader
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
