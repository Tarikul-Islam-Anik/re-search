import {
  type PDFExtractionOptions,
  extractTextFromPDF,
  validatePDF,
} from './pdf-extractor';

/**
 * Extracts text from a PDF or TXT file
 * @param file The file to extract text from
 * @param options Optional configuration for PDF extraction
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromFile(
  file: File,
  options?: PDFExtractionOptions
): Promise<string> {
  try {
    if (file.type === 'text/plain') {
      return extractTextFromTxt(file);
    }
    if (file.type === 'application/pdf') {
      // Validate the PDF before attempting to extract text
      const isValidPDF = await validatePDF(file);
      if (!isValidPDF) {
        throw new Error(
          'The file appears to be corrupted or is not a valid PDF.'
        );
      }

      // For PDF files, we need to dynamically import the PDF.js library
      // This ensures it only loads on the client side
      if (typeof window !== 'undefined') {
        return extractTextFromPDF(file, options);
      }
      throw new Error(
        'PDF processing is only available in browser environments.'
      );
    }
    throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
  } catch (error) {
    // Rethrow with a more user-friendly message
    if (error instanceof Error) {
      throw new Error(`Error extracting text: ${error.message}`);
    }
    throw new Error(
      'An unknown error occurred while extracting text from the file.'
    );
  }
}

/**
 * Extracts text from a TXT file
 * @param file The TXT file to extract text from
 * @returns A promise that resolves to the extracted text
 */
async function extractTextFromTxt(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read the text file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the text file.'));
    };

    reader.readAsText(file);
  });
}
