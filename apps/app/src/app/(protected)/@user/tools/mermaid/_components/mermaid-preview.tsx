'use client';

import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

interface MermaidPreviewProps {
  code: string;
}

export default function MermaidPreview({ code }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif',
    });

    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-diagram', code);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Failed to render Mermaid diagram:', error);
          containerRef.current.innerHTML = `
            <div class="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
              <p class="font-medium">Error rendering diagram</p>
              <p class="text-sm">${error instanceof Error ? error.message : String(error)}</p>
            </div>
          `;
        }
      }
    };

    renderDiagram();

    // Add fullscreen styling
    const handleFullscreenChange = () => {
      const previewElement = document.querySelector('.mermaid-preview');
      if (document.fullscreenElement === previewElement) {
        previewElement?.classList.add('bg-white', 'p-8');
      } else {
        previewElement?.classList.remove('bg-white', 'p-8');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [code]);

  return (
    <div className="mermaid-preview flex min-h-full w-full items-center justify-center overflow-auto">
      <div ref={containerRef} className="max-w-full" />
    </div>
  );
}
