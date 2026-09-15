import { site } from '../config/site';

/**
 * Checks if a value is set and not an unresolved placeholder token.
 * Per §1: any string still containing "{{" is treated as unset.
 */
export function isSet(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return false;
    return !trimmed.includes('{{');
  }
  if (Array.isArray(value)) {
    return value.length > 0 && value.some((item) => isSet(item));
  }
  return true;
}

export interface ActiveSocial {
  key: keyof typeof site.socials;
  label: string;
  url: string;
}

const SOCIAL_LABELS: Record<keyof typeof site.socials, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  scholar: 'Google Scholar',
  orcid: 'ORCID',
  x: 'X',
  bluesky: 'Bluesky',
  kaggle: 'Kaggle',
  huggingface: 'Hugging Face',
};

/**
 * Returns an array of active configured socials, filtering out unset placeholders.
 */
export function getActiveSocials(): ActiveSocial[] {
  const entries = Object.entries(site.socials) as [keyof typeof site.socials, string][];
  return entries
    .filter(([_, url]) => isSet(url))
    .map(([key, url]) => ({
      key,
      label: SOCIAL_LABELS[key] ?? key,
      url,
    }));
}
