export interface SearchFilters {
  keywords: string[];
  topics: string[];
  journals: string[];
  yearRange: [number, number];
  authors: string[];
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number | string;
  abstract?: string;
  keywords: string[];
  status?: 'read' | 'unread' | 'to-read' | 'favorite';
  doi?: string;
  url?: string;
  publisher?: string;
}

export interface PaperDetails extends Paper {
  fullAuthors?: Array<{ name: string; affiliation?: string }>;
  citations?: number;
  references?: string[];
  pdfUrl?: string;
  abstract: string;
}

export interface CrossrefWork {
  DOI: string;
  title: string[];
  author?: Array<{
    given?: string;
    family?: string;
    name?: string;
    affiliation?: Array<{ name: string }>;
  }>;
  'container-title'?: string[];
  'published-print'?: {
    'date-parts': number[][];
  };
  publisher?: string;
  abstract?: string;
  URL?: string;
  subject?: string[];
  reference?: Array<{
    key: string;
    doi?: string;
    'article-title'?: string;
    author?: string;
    volume?: string;
    year?: string;
    journal?: string;
  }>;
}

export interface CrossrefResponse {
  status: string;
  'message-type': string;
  'message-version': string;
  message: {
    items: CrossrefWork[];
    'total-results': number;
    'items-per-page': number;
    query: {
      'start-index': number;
      'search-terms': string;
    };
  };
}
