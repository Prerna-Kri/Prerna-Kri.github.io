import { getCollection } from 'astro:content';

/**
 * Returns true if the collection exists and has at least one entry.
 * Implements the empty-collection rule specified in §8.
 */
export async function hasEntries(
  collectionName:
    | 'now'
    | 'directions'
    | 'projects'
    | 'writing'
    | 'publications'
    | 'talks'
    | 'teaching'
    | 'awards'
    | 'experience'
    | 'education'
    | 'skills'
): Promise<boolean> {
  try {
    const entries = await getCollection(collectionName as any);
    return Array.isArray(entries) && entries.length > 0;
  } catch {
    return false;
  }
}
