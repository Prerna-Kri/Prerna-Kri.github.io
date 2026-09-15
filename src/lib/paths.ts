/**
 * Normalizes an internal path with Astro's BASE_URL.
 * Handles trailing slashes, root prefixes, and sub-path deployment correctly.
 */
export function withBase(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('#')
  ) {
    return path;
  }
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return base ? `${base}/` : '/';
  }
  return `${base}${cleanPath}`;
}
