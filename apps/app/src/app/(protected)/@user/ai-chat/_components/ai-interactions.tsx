import { Container } from '@/components/container';
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from '@/components/section';
import { generateSummary } from '@/lib/ai-utils';
import { useDocumentStore } from '@/store/use-document-store';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { FileText, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ChatInterface from './chat-interface';
import SummaryViewer from './summary-viewer';

const AIInteractions = () => {
  const { isProcessing, setIsProcessing, getActiveFile, updateFileSummary } =
    useDocumentStore();

  const activeFile = getActiveFile();

  const handleGenerateSummary = async () => {
    if (!activeFile) {
      toast.info('No document selected', {
        description: 'Please upload a document first to generate a summary.',
      });
      return;
    }

    try {
      setIsProcessing(true);
      const generatedSummary = await generateSummary(activeFile.originalText);
      updateFileSummary(activeFile.id, generatedSummary);

      toast.success('Summary generated', {
        description: 'Your document summary has been generated successfully.',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary', {
        description:
          'There was an error generating the document summary. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No document selected</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="summary" className="w-full">
      <Container>
        <Section>
          <SectionHeader className="flex items-center justify-between space-y-0">
            <SectionTitle>Interact with A.I.</SectionTitle>
            <TabsList className="flex justify-start">
              <TabsTrigger value="summary">
                <FileText className="mr-2 size-4" />
                <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="mr-2 size-4" />
                <span>Chat</span>
              </TabsTrigger>
            </TabsList>
          </SectionHeader>
          <SectionContent>
            <TabsContent value="summary">
              {activeFile.summary ? (
                <SummaryViewer
                  summary={activeFile.summary}
                  isLoading={isProcessing}
                />
              ) : (
                <div className="flex h-full flex-col items-center space-y-4 py-32 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Sparkles className="size-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">No Summary Yet</h3>
                    <p className="text-muted-foreground">
                      Generate a summary for this document to view it here.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={isProcessing}
                  >
                    <Sparkles />
                    <span>Generate Summary</span>
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="chat">
              <ChatInterface documentText={activeFile.originalText} />
            </TabsContent>
          </SectionContent>
        </Section>
      </Container>
    </Tabs>
  );
};

AIInteractions.displayName = 'AIInteractions';

export default AIInteractions;
