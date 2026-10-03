import { buildToolSeo, type ToolSeoMeta } from './toolSeoCore';

export { buildSoftwareApplication, DEFAULT_OG_IMAGE } from './toolSeoCore';
export type { ToolSeoMeta } from './toolSeoCore';

/**
 * Build-time tool metadata lookup for `src/prerender.tsx`.
 *
 * The registry and the doc corpus are reached through *dynamic* imports on
 * purpose. `vite-prerender-plugin` registers `prerender.tsx` as a second
 * rollup entry, so everything it imports statically lands in a chunk that Vite
 * `modulepreload`s into every prerendered HTML page — i.e. shipped to every
 * visitor. Keeping the tool data in a lazily-reached chunk means a browser on a
 * tool page downloads the route payload it needs and none of the build-time
 * prerender payload.
 *
 * The resulting metadata is byte-identical to the client's, because both paths
 * call `buildToolSeo` on the same underlying sources.
 */
export async function loadToolSeo(slug: string): Promise<ToolSeoMeta | undefined> {
  const [{ getTool }, { getToolDoc }] = await Promise.all([
    import('@/features/marketing/data/tools/registry'),
    import('@/features/marketing/data/tools'),
  ]);

  const tool = getTool(slug);
  const doc = getToolDoc(slug);
  return tool && doc ? buildToolSeo(tool, doc) : undefined;
}

/** The prerenderer addresses pages by path rather than by slug. */
export async function loadToolSeoByPath(path: string): Promise<ToolSeoMeta | undefined> {
  const slug = path.replace(/^\/+|\/+$/g, '');
  return slug ? loadToolSeo(slug) : undefined;
}