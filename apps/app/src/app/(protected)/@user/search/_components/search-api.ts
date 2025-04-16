import type {
  CrossrefResponse,
  CrossrefWork,
  Paper,
  PaperDetails,
  SearchFilters,
} from './search-filter-types';

// Helper to extract publication year from a Crossref work
const extractYear = (work: CrossrefWork): string => {
  if (work['published-print']?.['date-parts']?.[0]?.[0]) {
    return work['published-print']['date-parts'][0][0].toString();
  }
  return '';
};

// Helper to extract authors from a Crossref work
const extractAuthors = (work: CrossrefWork): string => {
  if (!work.author || work.author.length === 0) {
    return '';
  }

  return work.author
    .map((author) => {
      if (author.name) {
        return author.name;
      }
      if (author.family) {
        return author.given
          ? `${author.family}, ${author.given.charAt(0)}.`
          : author.family;
      }
      return '';
    })
    .filter(Boolean)
    .join(', ');
};

// Convert a Crossref work to our Paper format
export const mapWorkToPaper = (work: CrossrefWork): Paper => {
  const subjects = work.subject || [];

  return {
    id: work.DOI,
    title: work.title?.[0] || 'Untitled',
    authors: extractAuthors(work),
    journal: work['container-title']?.[0] || 'Unknown Journal',
    year: extractYear(work),
    abstract: work.abstract,
    keywords: subjects.slice(0, 5), // Take first 5 subjects as keywords
    doi: work.DOI,
    url: work.URL,
    publisher: work.publisher,
    status: 'unread', // Default status
  };
};

// Convert a Crossref work to our detailed Paper format
export const mapWorkToPaperDetails = (work: CrossrefWork): PaperDetails => {
  const paper = mapWorkToPaper(work);

  // Create the detailed version with additional properties
  const paperDetails: PaperDetails = {
    ...paper,
    abstract: work.abstract || 'No abstract available',
    fullAuthors:
      work.author?.map((author) => ({
        name:
          author.name || `${author.family || ''}, ${author.given || ''}`.trim(),
        affiliation: author.affiliation?.[0]?.name || '',
      })) || [],
    references:
      work.reference?.map((ref) => {
        const parts = [];
        if (ref.author) {
          parts.push(ref.author);
        }
        if (ref.year) {
          parts.push(`(${ref.year})`);
        }
        if (ref['article-title']) {
          parts.push(ref['article-title']);
        }
        if (ref.journal) {
          parts.push(`In ${ref.journal}`);
        }
        if (ref.volume) {
          parts.push(`Vol. ${ref.volume}`);
        }
        return parts.join('. ');
      }) || [],
    pdfUrl: work.URL,
  };

  return paperDetails;
};

// Search the Crossref API
export const searchPapers = async (
  query: string,
  filters?: Partial<SearchFilters>
): Promise<Paper[]> => {
  try {
    // Build the query parameters
    let searchQuery = query;

    // Add filters if provided
    if (filters) {
      // Add author filters
      if (filters.authors && filters.authors.length > 0) {
        searchQuery += ` ${filters.authors.map((author) => `query.author=${author}`).join('&')}`;
      }

      // Add journal filters
      if (filters.journals && filters.journals.length > 0) {
        searchQuery += ` ${filters.journals.map((journal) => `query.container-title=${journal}`).join('&')}`;
      }
    }

    // Make the request
    const response = await fetch(
      `https://api.crossref.org/works?query=${encodeURIComponent(searchQuery)}&rows=25`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Crossref API');
    }

    const data: CrossrefResponse = await response.json();

    // Map the works to our Paper format
    const papers = data.message.items.map(mapWorkToPaper);

    return papers;
  } catch (error) {
    console.error('Error searching papers:', error);
    throw error;
  }
};

// Get details of a specific paper by DOI
export const getPaperDetails = async (doi: string): Promise<PaperDetails> => {
  try {
    const response = await fetch(
      `https://api.crossref.org/works/${encodeURIComponent(doi)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch paper details');
    }

    const data = await response.json();
    const work = data.message as CrossrefWork;

    return mapWorkToPaperDetails(work);
  } catch (error) {
    console.error('Error fetching paper details:', error);
    throw error;
  }
};
