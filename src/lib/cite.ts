/**
 * APA and IEEE citation generator per §7.3.
 */

interface CitationSource {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  doi?: string;
  arxiv?: string;
}

export function formatApaCitation(pub: CitationSource): string {
  const authorStr = pub.authors.join(', ');
  const doiStr = pub.doi ? ` https://doi.org/${pub.doi}` : pub.arxiv ? ` arXiv:${pub.arxiv}` : '';
  return `${authorStr} (${pub.year}). ${pub.title}. ${pub.venue}.${doiStr}`;
}

export function formatIeeeCitation(pub: CitationSource): string {
  // Convert "Lastname, F." to "F. Lastname"
  const formattedAuthors = pub.authors.map((a) => {
    const parts = a.split(',').map((p) => p.trim());
    return parts.length === 2 ? `${parts[1]} ${parts[0]}` : a;
  });

  const authorStr = formattedAuthors.length > 1
    ? `${formattedAuthors.slice(0, -1).join(', ')} and ${formattedAuthors[formattedAuthors.length - 1]}`
    : formattedAuthors[0] || '';

  const doiStr = pub.doi ? `, doi: ${pub.doi}` : pub.arxiv ? `, arXiv:${pub.arxiv}` : '';
  return `${authorStr}, "${pub.title}," ${pub.venue}, ${pub.year}${doiStr}.`;
}
