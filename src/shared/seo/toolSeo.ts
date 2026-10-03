import { getTool } from '@/features/marketing/data/tools/registry';
import { getToolDoc } from '@/features/marketing/data/tools';
import { buildToolSeo, type ToolSeoMeta } from './toolSeoCore';

export { buildSoftwareApplication, DEFAULT_OG_IMAGE } from './toolSeoCore';
export type { ToolSeoMeta } from './toolSeoCore';

/**
 * Synchronous tool metadata lookup for the client bundle.
 *
 * Only imported by components that already render a tool page, so the registry
 * and the requested doc are already being downloaded for that route.
 */
export function getToolSeo(slug: string): ToolSeoMeta | undefined {
  const tool = getTool(slug);
  const doc = getToolDoc(slug);
  return tool && doc ? buildToolSeo(tool, doc) : undefined;
}