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
}

export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard';

/**
 * Format author names in different citation styles
 */
function formatAuthors(authors: string, style: CitationStyle): string {
  // Split authors by commas, assuming format like "Smith, J., Johnson, A."
  const authorList = authors
    .split(',')
    .reduce<string[]>((acc, current, index, array) => {
      // If the current item doesn't have a period, it's likely a last name
      // and the next item is the initial, so combine them
      if (
        !current.includes('.') &&
        index + 1 < array.length &&
        array[index + 1].trim().includes('.')
      ) {
        acc.push(`${current.trim()},${array[index + 1].trim()}`);
        // Skip the next item as we've already used it
        array[index + 1] = '';
      } else if (current !== '') {
        acc.push(current.trim());
      }
      return acc;
    }, []);

  switch (style) {
    case 'apa': {
      // APA: Smith, J. B., Johnson, A. R., & Lee, M.
      if (authorList.length === 1) return authorList[0];
      const lastAuthor = authorList.pop();
      return `${authorList.join(', ')}${authorList.length > 0 ? ', & ' : ''}${lastAuthor}`;
    }

    case 'mla': {
      // MLA: Smith, John B., et al.
      if (authorList.length === 1) return authorList[0];
      if (authorList.length === 2)
        return `${authorList[0]} and ${authorList[1]}`;
      return `${authorList[0]}, et al.`;
    }

    case 'chicago': {
      // Chicago: Smith, John B., Anna R. Johnson, and Mark Lee
      if (authorList.length === 1) return authorList[0];
      if (authorList.length === 2)
        return `${authorList[0]} and ${authorList[1]}`;
      const chicagoLast = authorList.pop();
      return `${authorList.join(', ')}, and ${chicagoLast}`;
    }

    case 'harvard': {
      // Harvard: Smith, J. B., Johnson, A. R. and Lee, M.
      if (authorList.length === 1) return authorList[0];
      const harvardLast = authorList.pop();
      return `${authorList.join(', ')} and ${harvardLast}`;
    }

    default:
      return authors;
  }
}

/**
 * Format a reference in APA style
 */
function formatAPA(reference: Reference): string {
  const authors = formatAuthors(reference.authors, 'apa');
  const year = reference.year ? `(${reference.year})` : '';
  const title = reference.title ? `${reference.title}.` : '';
  const journal = reference.journal ? `${reference.journal}` : '';
  const volume = reference.volume ? `, ${reference.volume}` : '';
  const issue = reference.issue ? `(${reference.issue})` : '';
  const pages = reference.pages ? `, ${reference.pages}` : '';
  const doi = reference.doi ? ` https://doi.org/${reference.doi}` : '';

  return `${authors}. ${year}. ${title} ${journal}${volume}${issue}${pages}.${doi}`;
}

/**
 * Format a reference in MLA style
 */
function formatMLA(reference: Reference): string {
  const authors = formatAuthors(reference.authors, 'mla');
  const title = reference.title ? `"${reference.title}."` : '';
  const journal = reference.journal ? `${reference.journal}` : '';
  const volume = reference.volume ? `, vol. ${reference.volume}` : '';
  const issue = reference.issue ? `, no. ${reference.issue}` : '';
  const year = reference.year ? `, ${reference.year}` : '';
  const pages = reference.pages ? `, pp. ${reference.pages}` : '';
  const doi = reference.doi ? ` DOI: ${reference.doi}` : '';

  return `${authors}. ${title} ${journal}${volume}${issue}${year}${pages}.${doi}`;
}

/**
 * Format a reference in Chicago style
 */
function formatChicago(reference: Reference): string {
  const authors = formatAuthors(reference.authors, 'chicago');
  const title = reference.title ? `"${reference.title}."` : '';
  const journal = reference.journal ? `${reference.journal}` : '';
  const volume = reference.volume ? ` ${reference.volume}` : '';
  const issue = reference.issue ? `, no. ${reference.issue}` : '';
  const year = reference.year ? ` (${reference.year})` : '';
  const pages = reference.pages ? `: ${reference.pages}` : '';
  const doi = reference.doi ? ` https://doi.org/${reference.doi}` : '';

  return `${authors}. ${title} ${journal}${volume}${issue}${year}${pages}.${doi}`;
}

/**
 * Format a reference in Harvard style
 */
function formatHarvard(reference: Reference): string {
  const authors = formatAuthors(reference.authors, 'harvard');
  const year = reference.year ? `(${reference.year})` : '';
  const title = reference.title ? `'${reference.title}'` : '';
  const journal = reference.journal ? `${reference.journal}` : '';
  const volume = reference.volume ? `, ${reference.volume}` : '';
  const issue = reference.issue ? `(${reference.issue})` : '';
  const pages = reference.pages ? `, pp. ${reference.pages}` : '';
  const doi = reference.doi ? ` doi: ${reference.doi}` : '';

  return `${authors} ${year}, ${title}, ${journal}${volume}${issue}${pages}.${doi}`;
}

/**
 * Format a reference citation in the specified style
 */
export function formatCitation(
  reference: Reference,
  style: CitationStyle = 'apa'
): string {
  switch (style) {
    case 'apa':
      return formatAPA(reference);
    case 'mla':
      return formatMLA(reference);
    case 'chicago':
      return formatChicago(reference);
    case 'harvard':
      return formatHarvard(reference);
    default:
      return formatAPA(reference);
  }
}

/**
 * Get all available citation styles
 */
export function getCitationStyles(): { id: CitationStyle; name: string }[] {
  return [
    { id: 'apa', name: 'APA (American Psychological Association)' },
    { id: 'mla', name: 'MLA (Modern Language Association)' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'harvard', name: 'Harvard' },
  ];
}
