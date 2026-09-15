/**
 * BibTeX string formatters and utilities.
 */

export interface PublicationData {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  type: string;
  doi?: string;
  arxiv?: string;
}

export function generateBibtexKey(item: PublicationData): string {
  const firstAuthor = (item.authors[0] || 'Author').split(',')[0]?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'author';
  const firstWord = item.title.split(' ')[0]?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'paper';
  return `${firstAuthor}${item.year}${firstWord}`;
}

export function cleanBibtex(rawBibtex: string): string {
  return rawBibtex.trim();
}
