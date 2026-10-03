import { SITE_NAME, SITE_URL } from './schema';

/**
 * A trailing brand marker, in any of the separator styles used across the
 * marketing pages.
 */
const TRAILING_BRAND = /[\s]*[—–\-|][\s]*QYVORA$/i;

/**
 * Document-title formatting, shared by the static head (`src/prerender.tsx`) and
 * the client-side head (`SEO.tsx`) so a crawler and a navigating visitor never
 * see two different titles for the same route.
 *
 * Idempotent by design: many pages pass a pre-suffixed title (`"Hacker Protocol
 * Bootcamp | QYVORA"`) because the same string is reused for visible page
 * headings, where the brand *is* wanted. Re-appending the suffix there would
 * render `"Hacker Protocol Bootcamp | QYVORA | QYVORA"`, so an existing
 * trailing brand is stripped first.
 */
export const pageTitle = (title?: string): string => {
  if (!title) return `${SITE_NAME} | Africa's Offensive Security Platform`;

  const bare = title
    .replace(TRAILING_BRAND, '')
    // Drop any separator left dangling once the brand is removed ("QYVORA |").
    .replace(/[\s—–|-]+$/, '')
    .trim();
  // A title that is only the brand ("QYVORA") carries no page identity.
  if (!bare || bare.toLowerCase() === SITE_NAME.toLowerCase()) {
    return `${SITE_NAME} | Africa's Offensive Security Platform`;
  }

  return `${bare} | ${SITE_NAME}`;
};

/**
 * Absolute URL from a route path. Every canonical, Open Graph, Twitter and
 * JSON-LD URL is built here so the production domain lives in exactly one
 * place (`SITE_CONFIG.brand.siteUrl`).
 */
export const canonicalUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  // Routing is defined without trailing slashes; keep one canonical form.
  const trimmed = normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
  return `${SITE_URL}${trimmed}`;
};