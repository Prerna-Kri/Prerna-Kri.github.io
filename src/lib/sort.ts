/**
 * Sorting utilities for collections.
 */

export function sortByDateDesc<T extends { data: { date: Date | string } }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });
}

export function sortProjects<T extends { data: { featured: boolean; year: number } }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return b.data.year - a.data.year;
  });
}

export function sortPublicationsByYear<T extends { data: { year: number; date: Date | string } }>(
  items: T[],
  order: 'newest' | 'oldest' = 'newest',
): T[] {
  return [...items].sort((a, b) => {
    if (a.data.year !== b.data.year) {
      return order === 'newest' ? b.data.year - a.data.year : a.data.year - b.data.year;
    }
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
}
