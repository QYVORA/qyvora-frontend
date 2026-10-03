import { describe, it, expect } from 'vitest';
import type { ToolEntry } from '@/features/marketing/data/tools/registry';
import type { ToolDoc } from '@/features/marketing/data/tools/types';
import { buildSoftwareApplication, buildToolSeo, DEFAULT_OG_IMAGE } from '../toolSeoCore';
import { SITE_URL } from '../schema';

const tool = (over: Partial<ToolEntry> = {}): ToolEntry =>
  ({
    slug: 'anansi',
    name: 'anansi',
    displayName: 'ANANSI',
    path: '/anansi',
    summary: 'Attack surface intelligence engine.',
    category: 'recon',
    tags: [],
    github: 'https://github.com/QYVORA/qyvora-anansi',
    repo: 'qyvora-anansi',
    license: 'MIT',
    ...over,
  }) as ToolEntry;

const doc = (over: Partial<ToolDoc> = {}): ToolDoc =>
  ({
    slug: 'anansi',
    seoTitle: 'ANANSI — Attack surface intelligence engine',
    seoDescription: 'ANANSI is a terminal-first attack surface intelligence engine.',
    summary: 'A nine-phase recon pipeline from subdomain discovery to exploit-chain analysis.',
    ...over,
  }) as ToolDoc;

describe('buildSoftwareApplication', () => {
  it('emits only claims the repository supports', () => {
    const schema = buildSoftwareApplication(tool(), doc()) as Record<string, unknown>;

    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema.name).toBe('ANANSI');
    expect(schema.alternateName).toBe('anansi');
    expect(schema.applicationCategory).toBe('SecurityApplication');
    expect(schema.url).toBe(`${SITE_URL}/anansi`);
    expect(schema.codeRepository).toBe('https://github.com/QYVORA/qyvora-anansi');
  });

  it('omits ratings, prices and awards — none of which the repo backs', () => {
    const schema = buildSoftwareApplication(tool(), doc()) as Record<string, unknown>;
    for (const key of ['aggregateRating', 'offers', 'price', 'review', 'award']) {
      expect(schema).not.toHaveProperty(key);
    }
  });

  it('claims free use only for licences that actually grant it', () => {
    expect(buildSoftwareApplication(tool({ license: 'MIT' }), doc())).toHaveProperty(
      'isAccessibleForFree',
      true,
    );
    expect(buildSoftwareApplication(tool({ license: 'Apache-2.0' }), doc())).toHaveProperty(
      'isAccessibleForFree',
      true,
    );
  });

  it('makes no licence claim when the repo has no licence text', () => {
    // Several tools ship a 0-byte LICENSE, so asserting a licence or free use
    // would be a claim the repository does not support.
    const schema = buildSoftwareApplication(tool({ license: null }), doc()) as Record<string, unknown>;
    expect(schema).not.toHaveProperty('license');
    expect(schema).not.toHaveProperty('isAccessibleForFree');
  });

  it('does not treat an unknown licence identifier as an open-source grant', () => {
    const schema = buildSoftwareApplication(tool({ license: 'SEE LICENSE IN LICENSE' }), doc()) as Record<string, unknown>;
    expect(schema).toHaveProperty('license', 'SEE LICENSE IN LICENSE');
    expect(schema).not.toHaveProperty('isAccessibleForFree');
  });
});

describe('buildToolSeo', () => {
  it('derives the whole head payload from the registry and the doc', () => {
    const seo = buildToolSeo(tool(), doc());

    expect(seo.title).toBe('ANANSI — Attack surface intelligence engine');
    expect(seo.fullTitle).toBe(`ANANSI — Attack surface intelligence engine | QYVORA`);
    expect(seo.description).toBe(doc().seoDescription);
    expect(seo.canonical).toBe(`${SITE_URL}/anansi`);
  });

  it('uses the shared QYVORA preview image rather than the WebP tool logo', () => {
    // Tool logos ship as WebP, which Facebook/LinkedIn/WhatsApp will not render.
    expect(buildToolSeo(tool(), doc()).image).toBe(DEFAULT_OG_IMAGE);
    expect(DEFAULT_OG_IMAGE).toMatch(/\.png$/);
  });

  it('gives the static and client heads an identical document title', () => {
    const seo = buildToolSeo(tool(), doc());
    expect(seo.fullTitle).toBe(`${seo.title} | QYVORA`);
  });
});