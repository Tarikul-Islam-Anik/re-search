'use client';
// @ts-ignore
import renderMathInElement from 'katex/contrib/auto-render/auto-render';
import { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { useLatexEditorStore } from '@/store/use-latex-editor-store';

export function LatexPreview() {
  const latex = useLatexEditorStore((state) => state.content);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // 1. Strip out preamble and structural commands
      const content = latex
        .replace(/\\documentclass\{.*?\}/g, '')
        .replace(/\\usepackage\{.*?\}/g, '')
        .replace(
          /\\title\{(.*?)\}/g,
          '<h1 class="text-2xl font-bold mb-4">$1</h1>'
        )
        .replace(/\\author\{(.*?)\}/g, '<h2 class="text-xl mb-2">$1</h2>')
        .replace(/\\date\{(.*?)\}/g, '<p class="mb-4">$1</p>')
        .replace(/\\begin\{document\}/g, '')
        .replace(/\\end\{document\}/g, '')
        .replace(/\\maketitle/g, '')
        .replace(
          /\\section\{(.*?)\}/g,
          '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>'
        )
        .replace(
          /\\subsection\{(.*?)\}/g,
          '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>'
        )
        .replace(
          /\\subsubsection\{(.*?)\}/g,
          '<h4 class="text-base font-bold mt-3 mb-2">$1</h4>'
        )
        .replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>')
        .replace(/\\textit\{(.*?)\}/g, '<em>$1</em>')
        .replace(/\\underline\{(.*?)\}/g, '<u>$1</u>')
        // Lists
        .replace(
          /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
          (_m, c) =>
            `<ul class="list-disc pl-5 my-3">${c.replace(/\\item\s+(.*?)(?=\\item|$)/g, '<li>$1</li>')}</ul>`
        )
        .replace(
          /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
          (_m, c) =>
            `<ol class="list-decimal pl-5 my-3">${c.replace(/\\item\s+(.*?)(?=\\item|$)/g, '<li>$1</li>')}</ol>`
        )
        // Figures and tables placeholders
        .replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, (_m, c) => {
          const cap = c.match(/\\caption\{(.*?)\}/)?.[1];
          return `<div class="figure mb-4"><div>[Figure]</div>${cap ? `<div class="text-sm italic text-center mt-2">${cap}</div>` : ''}</div>`;
        })
        .replace(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g, (_m, c) => {
          const cap = c.match(/\\caption\{(.*?)\}/)?.[1];
          return `<div class="table mb-4"><div>[Table]</div>${cap ? `<div class="text-sm italic text-center mt-2">${cap}</div>` : ''}</div>`;
        });

      // 2. Wrap text blocks into paragraphs, splitting on blank lines (handles CRLF)
      const paragraphs = content
        .split(/(?:\r?\n){2,}/)
        .map((blk) => blk.trim())
        .filter(Boolean)
        .map((blk) => `<p>${blk}</p>`)
        .join('');

      // 3. Inject into DOM
      containerRef.current.innerHTML = paragraphs;
      setError(null);

      // 4. Render math using KaTeX auto-render
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
        trust: () => true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [latex]);

  return (
    <div
      id="latex-preview-container"
      ref={containerRef}
      className="latex-preview prose dark:prose-invert min-h-[calc(100vh-10rem)] max-w-none rounded-md bg-background p-6 shadow-sm"
    >
      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-500 dark:border-red-800 dark:bg-red-950">
          {error}
        </div>
      )}
    </div>
  );
}
