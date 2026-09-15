/**
 * Computes reading time from text content.
 * Standard rate: 200 words per minute.
 */
export function calculateReadingTime(content: string): string {
  const clean = content.replace(/<\/?[^>]+(>|$)/g, '');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
