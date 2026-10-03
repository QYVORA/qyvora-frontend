import type { ToolEntry } from '@/features/marketing/data/tools/registry';
import type { ToolDoc } from '@/features/marketing/data/tools/types';
import { canonicalUrl, pageTitle } from './metadata';
import { buildOrganization, toAbsoluteUrl } from './schema';

/**
 * Shared tool-page metadata assembly.
 *
 * This module deliberately imports only *types* from the tool data (erased at
 * compile time) plus the small SEO primitives, so it stays tiny in every bundle
 * that uses it. It holds no tool data of its own — that lives in
 * `data/tools/registry.ts` (identity) and `data/tools/<slug>.ts` (prose), which
 * is what makes "described exactly once" true.
 *
 * A tool page's title, description, canonical URL, social image and JSON-LD are
 * all computed from those two sources, so the static head a crawler reads
 * (`src/prerender.tsx`) and the head a visitor sees (`SEO.tsx` via
 * `ToolDocView`) can never drift apart.
 *
 * Tool logos are NOT used as social preview images: they ship as WebP, which
 * Facebook, LinkedIn and WhatsApp refuse to render. Every tool page therefore
 * uses the shared QYVORA preview image and gets its distinctiveness from the
 * tool-specific title, description and URL.
 */
export const DEFAULT_OG_IMAGE = '/og-image.png';

export interface ToolSeoMeta {
  /** Brand-free page title; pass to `<SEO title>` so both heads stay identical. */
  title: string;
  /** Full document title including the `| QYVORA` suffix. */
  fullTitle: string;
  description: string;
  canonical: string;
  image: string;
  schema: object;
}

/** SPDX ids that genuinely grant free use, so `isAccessibleForFree` is honest. */
const OPEN_LICENSES = new Set(['MIT', 'Apache-2.0']);

/**
 * `SoftwareApplication` for a tool page.
 *
 * Only claims the repository actually supports are emitted: no ratings, no
 * prices, no awards. Tools whose `LICENSE` file is empty get no `license` and
 * no `isAccessibleForFree`, because asserting free use would be a claim the
 * repository does not back.
 */
export function buildSoftwareApplication(tool: ToolEntry, doc: ToolDoc) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.displayName,
    alternateName: tool.name,
    description: doc.summary,
    url: toAbsoluteUrl(tool.path),
    applicationCategory: 'SecurityApplication',
    codeRepository: tool.github,
    author: {
      '@type': 'Organization',
      name: buildOrganization().name,
      url: toAbsoluteUrl('/'),
    },
  };

  if (tool.license) schema.license = tool.license;
  if (tool.license && OPEN_LICENSES.has(tool.license)) {
    schema.isAccessibleForFree = true;
  }

  return schema;
}

/** Assembles one tool's complete head payload. */
export function buildToolSeo(tool: ToolEntry, doc: ToolDoc): ToolSeoMeta {
  return {
    title: doc.seoTitle,
    fullTitle: pageTitle(doc.seoTitle),
    description: doc.seoDescription,
    canonical: canonicalUrl(tool.path),
    image: DEFAULT_OG_IMAGE,
    schema: buildSoftwareApplication(tool, doc),
  };
}