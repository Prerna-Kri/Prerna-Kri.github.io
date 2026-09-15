import { site } from '../config/site';

/**
 * Checks if a string value is still an unresolved template placeholder.
 */
export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  return value.trim().startsWith('{{') && value.trim().endsWith('}}');
}

export interface ActiveSocial {
  key: keyof typeof site.socials;
  label: string;
  url: string;
}

const SOCIAL_LABELS: Record<keyof typeof site.socials, string> = {
  scholar: 'Google Scholar',
  orcid: 'ORCID',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  bluesky: 'Bluesky',
  semanticScholar: 'Semantic Scholar',
};

/**
 * Returns an array of configured socials, filtering out any unresolved placeholders.
 */
export function getActiveSocials(): ActiveSocial[] {
  const entries = Object.entries(site.socials) as [keyof typeof site.socials, string][];
  return entries
    .filter(([_, url]) => !isPlaceholder(url))
    .map(([key, url]) => ({
      key,
      label: SOCIAL_LABELS[key] ?? key,
      url,
    }));
}
