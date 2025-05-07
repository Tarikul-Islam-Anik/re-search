interface Reference {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  vaultId: string;
  createdAt: string;
  updatedAt: string;
}

export type ExportFormat = 'bibtex' | 'ris' | 'csv';

/**
 * Generate a BibTeX entry for a reference
 */
function generateBibTeX(reference: Reference): string {
  // Create a citekey (e.g., smith2023title)
  const firstAuthor = reference.authors.split(',')[0].trim().toLowerCase();
  const year = reference.year || 'unknown';
  const titleWords = reference.title.split(' ');
  const firstTitleWord =
    titleWords.length > 0
      ? titleWords[0].toLowerCase().replace(/[^\w]/g, '')
      : 'untitled';

  const citekey = `${firstAuthor}${year}${firstTitleWord}`;

  // Format authors for BibTeX (Last, First and Last, First)
  const authors = reference.authors
    .split(',')
    .map((author) => author.trim())
    .join(' and ');

  // Build the BibTeX entry
  let entry = '@article{' + citekey + ',\n';
  entry += '  title = {' + reference.title + '},\n';
  entry += '  author = {' + authors + '},\n';
  entry += '  journal = {' + reference.journal + '},\n';

  if (reference.year) entry += '  year = {' + reference.year + '},\n';
  if (reference.volume) entry += '  volume = {' + reference.volume + '},\n';
  if (reference.issue) entry += '  number = {' + reference.issue + '},\n';
  if (reference.pages) entry += '  pages = {' + reference.pages + '},\n';
  if (reference.doi) entry += '  doi = {' + reference.doi + '},\n';
  if (reference.url) entry += '  url = {' + reference.url + '},\n';

  entry += '}';

  return entry;
}

/**
 * Generate a RIS (Research Information Systems) entry for a reference
 */
function generateRIS(reference: Reference): string {
  let entry = 'TY  - JOUR\n'; // Type of reference (journal)

  // Split authors and add them individually
  const authorList = reference.authors.split(',');
  for (const author of authorList) {
    const trimmedAuthor = author.trim();
    if (trimmedAuthor) {
      entry += 'AU  - ' + trimmedAuthor + '\n';
    }
  }

  entry += 'TI  - ' + reference.title + '\n';
  entry += 'JO  - ' + reference.journal + '\n';

  if (reference.year) entry += 'PY  - ' + reference.year + '\n';
  if (reference.volume) entry += 'VL  - ' + reference.volume + '\n';
  if (reference.issue) entry += 'IS  - ' + reference.issue + '\n';
  if (reference.pages) entry += 'SP  - ' + reference.pages + '\n';
  if (reference.doi) entry += 'DO  - ' + reference.doi + '\n';
  if (reference.url) entry += 'UR  - ' + reference.url + '\n';

  entry += 'ER  - '; // End of reference

  return entry;
}

/**
 * Generate a CSV entry for a reference
 */
function generateCSV(reference: Reference): string {
  // Define CSV headers and escape values
  const escapeCsvValue = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  };

  const headers = [
    'Title',
    'Authors',
    'Journal',
    'Year',
    'Volume',
    'Issue',
    'Pages',
    'DOI',
    'URL',
  ];

  const values = [
    escapeCsvValue(reference.title),
    escapeCsvValue(reference.authors),
    escapeCsvValue(reference.journal),
    escapeCsvValue(reference.year || ''),
    escapeCsvValue(reference.volume || ''),
    escapeCsvValue(reference.issue || ''),
    escapeCsvValue(reference.pages || ''),
    escapeCsvValue(reference.doi || ''),
    escapeCsvValue(reference.url || ''),
  ];

  return headers.join(',') + '\n' + values.join(',');
}

/**
 * Export a reference in the specified format
 */
export function exportReference(
  reference: Reference,
  format: ExportFormat
): { content: string; filename: string; mimeType: string } {
  let content = '';
  let filename = 'reference_' + reference.id;
  let mimeType = 'text/plain';

  switch (format) {
    case 'bibtex':
      content = generateBibTeX(reference);
      filename += '.bib';
      mimeType = 'application/x-bibtex';
      break;
    case 'ris':
      content = generateRIS(reference);
      filename += '.ris';
      mimeType = 'application/x-research-info-systems';
      break;
    case 'csv':
      content = generateCSV(reference);
      filename += '.csv';
      mimeType = 'text/csv';
      break;
    default:
      throw new Error('Unsupported export format: ' + format);
  }

  return { content, filename, mimeType };
}

/**
 * Download content as a file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  // Create a blob with the content
  const blob = new Blob([content], { type: mimeType });

  // Create a temporary URL to the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append the link to the body, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the blob URL
  URL.revokeObjectURL(url);
}

/**
 * Get available export formats
 */
export function getExportFormats(): {
  id: ExportFormat;
  name: string;
  description: string;
}[] {
  return [
    {
      id: 'bibtex',
      name: 'BibTeX',
      description: 'BibTeX format for LaTeX documents',
    },
    {
      id: 'ris',
      name: 'RIS',
      description: 'Research Information Systems format',
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Comma-separated values for spreadsheets',
    },
  ];
}
