import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

// Helper function to extract DOI from URL or raw DOI
function extractDoi(doiString: string): string {
  // Check if the DOI is a URL
  if (doiString.startsWith('http')) {
    const match = doiString.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
    return match ? match[0] : doiString;
  }

  // Already a DOI
  return doiString;
}

// Normalize author string
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function normalizeAuthors(authors: any[]): string {
  if (!authors || !Array.isArray(authors)) return '';

  return authors
    .map((author) => {
      const family = author.family || '';
      const given = author.given || '';
      return family && given
        ? `${family}, ${given.charAt(0)}`
        : family || given;
    })
    .join(', ');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { doi: string } }
) {
  try {
    // The DOI parameter will be URL-encoded from the client
    const encodedDoi = params.doi;
    // Make sure to fully decode the DOI which may have been doubly encoded
    // to preserve URL characters like slashes
    const doi = decodeURIComponent(encodedDoi);
    const cleanDoi = extractDoi(doi);

    // Use CrossRef API to fetch reference data
    const response = await axios.get(
      `https://api.crossref.org/works/${cleanDoi}`
    );

    const data = response.data.message;

    if (!data) {
      return NextResponse.json(
        { error: 'No data found for the provided DOI' },
        { status: 404 }
      );
    }

    // Map the response to our reference structure
    const reference = {
      doi: cleanDoi,
      title: data.title ? data.title[0] : '',
      authors: data.author ? normalizeAuthors(data.author) : '',
      journal: data['container-title'] ? data['container-title'][0] : '',
      year: data.published
        ? data.published['date-parts'][0][0]?.toString()
        : '',
      volume: data.volume || '',
      issue: data.issue || '',
      pages: data.page || '',
      url: data.URL || `https://doi.org/${cleanDoi}`,
    };

    return NextResponse.json(reference);
  } catch (error) {
    console.error('Error fetching DOI data:', error);

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ error: 'DOI not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch reference data from DOI' },
      { status: 500 }
    );
  }
}
