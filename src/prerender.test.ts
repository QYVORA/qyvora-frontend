import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prerender } from './prerender';

describe('prerender — /nzinga', () => {
  it('emits prerendered body and head for the Nzinga tool route', async () => {
    const result = await prerender({
      ssr: true,
      url: '/nzinga',
      route: { url: '/nzinga' },
    });

    expect(typeof result).toBe('object');
    if (typeof result === 'string') throw new Error('expected a PrerenderResult object');

    expect(result.html).toContain('nzinga');
    expect(result.html).toContain('data-prerender="true"');

    const elements = Array.from(result.head?.elements ?? []);
    const title = result.head?.title ?? '';
    expect(title.toLowerCase()).toContain('nzinga');

    const description = elements.find(
      (el) => el.type === 'meta' && el.props.name === 'description',
    );
    expect(description?.props.content).toBeTruthy();

    const canonical = elements.find((el) => el.type === 'link' && el.props.rel === 'canonical');
    expect(canonical?.props.href).toContain('/nzinga');
  });

  it('lists /nzinga in the build prerender route set', () => {
    const config = readFileSync(resolve(process.cwd(), 'vite.config.ts'), 'utf8');
    expect(config).toContain("'/nzinga'");
  });
});
