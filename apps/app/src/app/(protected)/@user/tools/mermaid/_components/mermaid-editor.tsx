'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Copy, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CodeEditor from './code-editor';
import { defaultMermaidCode } from './constants';
import MermaidPreview from './mermaid-preview';

export default function MermaidEditor() {
  const [code, setCode] = useState(defaultMermaidCode);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast('Copied to clipboard', {
      description: 'The Mermaid code has been copied to your clipboard.',
    });
  };

  const handleDownloadSVG = () => {
    const svgElement = document.querySelector('.mermaid-preview svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'mermaid-diagram.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };

  const toggleFullscreen = () => {
    const previewElement = document.querySelector('.mermaid-preview');

    if (!document.fullscreenElement && previewElement) {
      previewElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card className="flex h-[calc(100vh-120px)] flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-medium text-lg">Mermaid.js Editor</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadSVG}>
            <Download className="" />
            Download SVG
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="" />
            ) : (
              <Maximize2 className="" />
            )}
            {isFullscreen ? 'Exit Fullscreen' : 'Preview Fullscreen'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="split" className="h-full">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <TabsList>
              <TabsTrigger value="split">Split View</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="split" className="m-0 h-[calc(100%-48px)] p-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full p-4">
                  <CodeEditor value={code} onChange={handleCodeChange} />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full overflow-auto p-4">
                  <MermaidPreview code={code} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="code" className="m-0 h-[calc(100%-48px)] p-4">
            <CodeEditor value={code} onChange={handleCodeChange} />
          </TabsContent>

          <TabsContent
            value="preview"
            className="m-0 h-[calc(100%-48px)] overflow-auto p-4"
          >
            <MermaidPreview code={code} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
