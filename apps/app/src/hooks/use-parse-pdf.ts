'use client';
import type * as PDFJS from 'pdfjs-dist/types/src/pdf';
import { useEffect, useState } from 'react';

export const usePDFJS = (
  onLoad: (pdfjs: typeof PDFJS) => Promise<void>,
  deps: (string | number | boolean | undefined | null)[] = []
) => {
  const [pdfjs, setPDFJS] = useState<typeof PDFJS | null>(null);

  // load the library once on mount (the webpack import automatically sets-up the worker)
  useEffect(() => {
    // Only load PDF.js on the client side
    if (typeof window !== 'undefined') {
      // Dynamically import pdfjs-dist
      import('pdfjs-dist').then((importedPdfjs) => {
        // Configure the worker
        const pdfjsLib = importedPdfjs;
        // Use blank worker to avoid dependency on worker file
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
        setPDFJS(pdfjsLib);
      });
    }
  }, []);

  // execute the callback function whenever PDFJS loads (or a custom dependency-array updates)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!pdfjs) {
      return;
    }
    (async () => {
      await onLoad(pdfjs);
    })();
  }, [pdfjs, ...deps]);
};
