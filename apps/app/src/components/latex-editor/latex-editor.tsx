'use client';
import './latex-editor.css';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Separator } from '@repo/design-system/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';

import { useIsMobile } from '@repo/design-system/hooks/use-mobile';
import { useEffect } from 'react';
import { useLatexEditorStore } from '../../store/use-latex-editor-store';
import { CodeEditor } from './code-editor';
import { LatexPreview } from './latex-preview';
import { LatexToolbar } from './latex-toolbar';

export default function LatexEditor() {
  const isMobile = useIsMobile();
  const setContent = useLatexEditorStore((state) => state.setContent);

  // Initialize the store with any saved content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('latex-content');
    if (savedContent) {
      setContent(savedContent);
    }
  }, [setContent]);

  return (
    <div className="flex flex-1 flex-col">
      <LatexToolbar />

      <Separator />

      {isMobile ? (
        <Tabs defaultValue="editor" className="flex-1">
          <div className="flex justify-center bg-muted/20 p-2">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="editor" className="m-0 flex-1 p-0">
            <CodeEditor />
          </TabsContent>
          <TabsContent value="preview" className="m-0 flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-4">
                <LatexPreview />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={50} minSize={30}>
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-4">
                <LatexPreview />
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
