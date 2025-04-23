import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { useDocumentStore } from '@/store/use-document-store';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Eye, FileCode } from 'lucide-react';
import { useState } from 'react';
import DocumentViewer from './document-viewer';

const OriginalDocument = () => {
  const [documentViewMode, setDocumentViewMode] = useState<'raw' | 'preview'>(
    'preview'
  );
  const {
    isProcessing,

    getActiveFile,
  } = useDocumentStore();

  const activeFile = getActiveFile();

  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No document selected</p>
      </div>
    );
  }
  return (
    <Tabs
      value={documentViewMode}
      onValueChange={(value) => setDocumentViewMode(value as 'raw' | 'preview')}
      className="w-full"
    >
      <Container>
        <Section>
          <SectionHeader className="flex items-center justify-between space-y-0">
            <SectionTitle>Original Document</SectionTitle>
            <TabsList className="flex justify-start">
              <TabsTrigger value="raw">
                <FileCode className="mr-2 size-4" />
                Markdown
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="mr-2 size-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </SectionHeader>
          <SectionContent>
            <DocumentViewer
              text={activeFile.originalText}
              isLoading={isProcessing}
              viewMode={documentViewMode}
            />
          </SectionContent>
        </Section>
      </Container>
    </Tabs>
  );
};

OriginalDocument.displayName = 'OriginalDocument';

export default OriginalDocument;
