'use client';

import katex from 'katex';
import { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { useLatexEditorStore } from '@/store/use-latex-editor-store';
import { useTheme } from 'next-themes';

export function LatexPreview() {
  const latex = useLatexEditorStore((state) => state.content);
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Process the LaTeX document to extract and render math expressions
    try {
      let processedHtml = latex
        // Replace document structure with HTML
        .replace(/\\documentclass\{.*?\}/g, '')
        .replace(/\\usepackage\{.*?\}/g, '')
        .replace(/\\title\{(.*?)\}/g, '<h1>$1</h1>')
        .replace(/\\author\{(.*?)\}/g, '<h2>$1</h2>')
        .replace(/\\date\{(.*?)\}/g, '<p>$1</p>')
        .replace(/\\begin\{document\}/g, '')
        .replace(/\\end\{document\}/g, '')
        .replace(/\\maketitle/g, '')
        .replace(/\\section\{(.*?)\}/g, '<h2>$1</h2>')
        .replace(/\\subsection\{(.*?)\}/g, '<h3>$1</h3>')
        .replace(
          /\\begin\{figure\}.*?\\end\{figure\}/gs,
          "<div class='figure'>[Figure placeholder]</div>"
        )
        .replace(
          /\\begin\{table\}.*?\\end\{table\}/gs,
          "<div class='table'>[Table placeholder]</div>"
        );

      // Process math environments
      processedHtml = processedHtml.replace(
        /\\begin\{align\}([\s\S]*?)\\end\{align\}/g,
        (match, content) => {
          try {
            // Replace \\ with newlines for align environment
            const alignContent = content.replace(/\\\\/g, '\\\\\\\\');
            return katex.renderToString(alignContent, {
              displayMode: true,
              throwOnError: false,
              fleqn: true,
            });
          } catch (e) {
            return `<div class="error">Error rendering math: ${e instanceof Error ? e.message : String(e)}</div>`;
          }
        }
      );

      // Process inline math $...$ and $$...$$
      processedHtml = processedHtml.replace(
        /\$\$(.*?)\$\$/g,
        (match, content) => {
          try {
            return katex.renderToString(content, {
              displayMode: true,
              throwOnError: false,
            });
          } catch (e) {
            return `<div class="error">Error rendering math: ${e instanceof Error ? e.message : String(e)}</div>`;
          }
        }
      );

      processedHtml = processedHtml.replace(/\$(.*?)\$/g, (match, content) => {
        try {
          return katex.renderToString(content, {
            displayMode: false,
            throwOnError: false,
          });
        } catch (e) {
          return `<div class="error">Error rendering math: ${e instanceof Error ? e.message : String(e)}</div>`;
        }
      });

      // Replace newlines with <br> tags
      processedHtml = processedHtml.replace(/\n\n/g, '<br><br>');

      setHtml(processedHtml);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [latex]);

  return (
    <div className="latex-preview min-h-[calc(100vh-10rem)] rounded-md bg-background p-6 shadow-sm">
      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-500 dark:border-red-800 dark:bg-red-950">
          {error}
        </div>
      ) : (
        <div
          className="prose dark:prose-invert max-w-none"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
