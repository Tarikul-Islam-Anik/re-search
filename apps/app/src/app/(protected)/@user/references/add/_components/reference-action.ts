'use server';

import { doiPattern, referenceSchema } from '@/schemas/reference-schema';

export interface Reference {
  doi: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
  url: string;
}

export async function fetchReferenceByDoi(doi: string): Promise<Reference> {
  try {
    // Clean the DOI
    const cleanDoi = doi.trim().replace(doiPattern, '');

    // Fetch from CrossRef API
    const response = await fetch(`https://api.crossref.org/works/${cleanDoi}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch DOI data: ${response.statusText}`);
    }

    const data = await response.json();
    const item = data.message;

    if (!item) {
      throw new Error('No data found for this DOI');
    }

    // Extract authors
    const authors = item.author
      ? item.author
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          .map((author: any) => {
            if (author.family && author.given) {
              return `${author.family}, ${author.given.charAt(0)}.`;
            }
            return author.name || '';
          })
          .join(', ')
      : '';

    // Extract journal info
    const journal = item['container-title'] ? item['container-title'][0] : '';

    // Extract volume, issue, pages
    const volume = item.volume || '';
    const issue = item.issue || '';
    const pages = item.page || '';

    // Extract URL
    const url = item.URL || '';

    // Extract year
    let year = '';
    if (item.published?.['date-parts']) {
      year = item.published['date-parts'][0][0].toString();
    }

    const reference = {
      doi: cleanDoi,
      title: item.title ? item.title[0] : '',
      authors,
      journal,
      year,
      volume,
      issue,
      pages,
      url,
    };

    // Validate the reference data
    try {
      referenceSchema.parse(reference);
    } catch (validationError) {
      console.error('Validation error for fetched reference:', validationError);
      // We still return the reference even if validation fails
      // The review form will show validation errors
    }

    return reference;
  } catch (error) {
    console.error('Error fetching DOI:', error);
    throw new Error(
      'Failed to fetch reference data. Please check the DOI and try again.'
    );
  }
}
