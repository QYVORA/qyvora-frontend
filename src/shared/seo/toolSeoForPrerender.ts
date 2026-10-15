import { getTool } from '@/features/marketing/data/tools/registry';
import { buildToolSeo, type ToolSeoMeta } from './toolSeoCore';

export { buildSoftwareApplication, DEFAULT_OG_IMAGE } from './toolSeoCore';
export type { ToolSeoMeta } from './toolSeoCore';

/**
 * Build-time tool metadata lookup for `src/prerender.tsx`.
 *
 * The doc corpus (`data/tools`) is reached through a *dynamic* import on
 * purpose. `vite-prerender-plugin` registers `prerender.tsx` as a second
 * rollup entry, so everything it imports statically lands in a chunk that Vite
 * `modulepreload`s into every prerendered HTML page — i.e. shipped to every
 * visitor. Keeping the (large) doc corpus in a lazily-reached chunk means a
 * browser on a tool page downloads the route payload it needs and none of the
 * build-time prerender payload.
 *
 * The registry is imported statically: it is already part of the app bundle
 * (`SEO.tsx` and the tool doc components import it), so a dynamic import could
 * not isolate it and would only emit a duplicate-import warning.
 *
 * The resulting metadata is byte-identical to the client's, because both paths
 * call `buildToolSeo` on the same underlying sources.
 */
export async function loadToolSeo(slug: string): Promise<ToolSeoMeta | undefined> {
  const { getToolDoc } = await import('@/features/marketing/data/tools');

  const tool = getTool(slug);
  const doc = getToolDoc(slug);
  return tool && doc ? buildToolSeo(tool, doc) : undefined;
}

/** The prerenderer addresses pages by path rather than by slug. */
export async function loadToolSeoByPath(path: string): Promise<ToolSeoMeta | undefined> {
  const slug = path.replace(/^\/+|\/+$/g, '');
  return slug ? loadToolSeo(slug) : undefined;
}