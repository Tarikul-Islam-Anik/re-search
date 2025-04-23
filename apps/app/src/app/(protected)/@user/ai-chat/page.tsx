'use client';

import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { usePDFJS } from '@/hooks/use-parse-pdf';
import { useDocumentStore } from '@/store/use-document-store';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Download, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AIInteractions from './_components/ai-interactions';
import InitialUploader from './_components/initial-uploader';
import OriginalDocument from './_components/original-document';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export default function AIChatPage() {
  const [showInitialUploader, setShowInitialUploader] = useState(true);

  //  initialize worker
  usePDFJS(async () => {
    // console.log(pdfjs);
  });

  const { files, activeFileId, isProcessing, setActiveFileId, getActiveFile } =
    useDocumentStore();

  const activeFile = getActiveFile();

  useEffect(() => {
    // Hide initial uploader if we have files
    if (files.length > 0) {
      setShowInitialUploader(false);
    }
  }, [files]);

  const handleDownload = () => {
    if (!activeFile) {
      toast.info('No summary to download', {
        description: 'Please upload a document first to generate a summary.',
      });
      return;
    }

    if (!activeFile.summary) {
      toast.info('No summary available', {
        description: 'Please generate a summary first before downloading.',
      });
      return;
    }

    const blob = new Blob([activeFile.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeFile.name.split('.')[0]}-summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Summary downloaded', {
      description: 'Your summary has been downloaded successfully.',
    });
  };

  // Initial uploader view
  if (showInitialUploader) {
    return <InitialUploader />;
  }

  return (
    <Tabs value={activeFileId || ''} onValueChange={setActiveFileId}>
      <Container className="border-b">
        <Section>
          <SectionHeader>
            <SectionTitle>Document Parser &amp; Summarizer</SectionTitle>
            <SectionDescription>
              Upload a PDF or TXT file to extract text and generate a summary
            </SectionDescription>
          </SectionHeader>
          <SectionContent>
            <div className="flex flex-col items-center justify-between gap-y-4 xl:flex-row">
              <TabsList className="overflow-x-auto">
                {files.map((file) => (
                  <TabsTrigger key={file.id} value={file.id}>
                    {truncateText(file.name, 15)}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowInitialUploader(true)}
                >
                  <Plus />
                  <span>Upload Another File</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!activeFile || isProcessing || !activeFile?.summary}
                >
                  <Download />
                  <span>Download Summary</span>
                </Button>
              </div>
            </div>
          </SectionContent>
        </Section>
      </Container>
      <div className="grid grid-cols-1 divide-y xl:grid-cols-2 xl:divide-x xl:divide-y-0">
        <OriginalDocument />
        <AIInteractions />
      </div>
    </Tabs>
  );
}
