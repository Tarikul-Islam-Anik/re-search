import * as pdfjs from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

// We need to initialize PDF.js only on the client side
// This function will be called only in browser environments
function initPdfJS() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Only initialize if we're in a browser environment
    if (!window.pdfjsLib) {
      // Set the worker source to empty to use the fake worker
      pdfjs.GlobalWorkerOptions.workerSrc = '';
    }
  } catch (error) {
    console.error('Error initializing PDF.js:', error);
  }
}

/**
 * Configuration options for PDF text extraction
 */
export interface PDFExtractionOptions {
  /**
   * Whether to preserve formatting information (experimental)
   */
  preserveFormatting?: boolean;

  /**
   * Maximum number of pages to process (0 = all pages)
   */
  maxPages?: number;

  /**
   * Whether to include page numbers in the extracted text
   */
  includePageNumbers?: boolean;
}

/**
 * Default options for PDF text extraction
 */
const DEFAULT_OPTIONS: PDFExtractionOptions = {
  preserveFormatting: true,
  maxPages: 0, // 0 means all pages
  includePageNumbers: true,
};

/**
 * Extracts text from a PDF file
 * @param file The PDF file to extract text from
 * @param options Configuration options for the extraction
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromPDF(
  file: File,
  options: PDFExtractionOptions = DEFAULT_OPTIONS
): Promise<string> {
  try {
    // Initialize PDF.js (only runs in browser)
    initPdfJS();

    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Get the total number of pages
    const numPages = pdf.numPages;
    const pagesToProcess =
      options.maxPages && options.maxPages > 0
        ? Math.min(numPages, options.maxPages)
        : numPages;

    console.log(
      `PDF loaded. Processing ${pagesToProcess} of ${numPages} pages.`
    );

    // Extract text from each page
    const textContent: string[] = [];

    for (let i = 1; i <= pagesToProcess; i++) {
      try {
        // Get the page
        const page = await pdf.getPage(i);

        // Extract text content
        const content = await page.getTextContent();

        // Process text items
        let lastY: number | null = null;
        let text = '';

        // Add page number if requested
        if (options.includePageNumbers) {
          textContent.push(`\n# Page ${i}\n`);
        }

        // Process text items
        for (const item of content.items) {
          const textItem = item as TextItem;

          // Check if this is a new line based on Y position
          if (lastY !== null && Math.abs(textItem.transform[5] - lastY) > 5) {
            text += '\n';
          }

          // Add the text
          text += textItem.str;

          // Update lastY
          lastY = textItem.transform[5];
        }

        // Add the processed text to the result
        textContent.push(text);

        // Clean up
        page.cleanup();
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        textContent.push(`\n[Error extracting content from page ${i}]\n`);
      }
    }

    // Join all pages with double newlines
    const result = textContent.join('\n\n');

    // Apply basic Markdown formatting if preserveFormatting is enabled
    if (options.preserveFormatting) {
      return formatAsMarkdown(result);
    }

    return result;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Applies basic Markdown formatting to the extracted text
 * @param text The raw extracted text
 * @returns Formatted Markdown text
 */
function formatAsMarkdown(text: string): string {
  // Split into lines
  const lines = text.split('\n');
  const formattedLines = [];

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedLines.push('');
      continue;
    }

    // Check if this might be a heading (short line, not ending with punctuation)
    if (line.length < 100 && !line.match(/[.,:;]$/)) {
      // Check if it's all caps or significantly different from surrounding text
      if (line === line.toUpperCase() && line.length > 3) {
        // Likely a heading
        formattedLines.push(`## ${line}`);
        continue;
      }

      // Check if it might be a subheading (shorter than surrounding text)
      if (i > 0 && i < lines.length - 1) {
        const prevLine = lines[i - 1].trim();
        const nextLine = lines[i + 1].trim();

        if (
          line.length < prevLine.length * 0.7 &&
          line.length < nextLine.length * 0.7
        ) {
          formattedLines.push(`### ${line}`);
          continue;
        }
      }
    }

    // Check for list items
    if (line.match(/^[\d]+\.\s/) || line.match(/^[•\-*]\s/)) {
      formattedLines.push(line);
      continue;
    }

    // Regular paragraph
    formattedLines.push(line);
  }

  return formattedLines.join('\n');
}

/**
 * Validates if a file is a valid PDF
 * @param file The file to validate
 * @returns A promise that resolves to true if the file is a valid PDF
 */
export async function validatePDF(file: File): Promise<boolean> {
  if (file.type !== 'application/pdf') {
    return false;
  }

  try {
    // Read the first few bytes to check for PDF signature
    const buffer = await file.slice(0, 5).arrayBuffer();
    const signature = new Uint8Array(buffer);
    const isPDF =
      signature[0] === 0x25 && // %
      signature[1] === 0x50 && // P
      signature[2] === 0x44 && // D
      signature[3] === 0x46 && // F
      signature[4] === 0x2d; // -

    return isPDF;
  } catch (error) {
    console.error('Error validating PDF:', error);
    return false;
  }
}
