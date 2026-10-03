import { Plugin, type OutputBundle, type OutputChunk } from 'vite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Injects the build output into the service worker.
 *
 * A hand-written worker cannot know the hashed filenames Vite emits, so without
 * this step the very first page load fetches its JS/CSS *before* the worker
 * takes control and those chunks never reach the cache — the app then fails to
 * boot offline until every route has been visited.
 *
 * Two placeholders in `public/sw.js` are rewritten on `dist/sw.js`:
 *   const CACHE_VERSION = '<build id>'   → new caches per build, old ones pruned
 *   const BUILD_ASSETS = [...]           → the boot graph, precached on install
 *
 * Only the *static* import graph of the entry chunks is precached (entry,
 * vendor, CSS). Route chunks are dynamic imports — precaching them would push
 * the whole app (three.js included) down every student's first visit, so they
 * stay runtime-cached on demand instead.
 */
export default function swPrecache(): Plugin {
  let bundle: OutputBundle | null = null;
  let outDir = 'dist';

  return {
    name: 'qyvora-sw-precache',
    apply: 'build',

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },

    generateBundle(_options, outputBundle) {
      bundle = outputBundle;
    },

    closeBundle() {
      const swFile = path.join(outDir, 'sw.js');
      if (!bundle || !fs.existsSync(swFile)) return;

      const assets = collectBootAssets(bundle);
      const buildId =
        'v' + crypto.createHash('sha256').update(assets.join('|')).digest('hex').slice(0, 8);

      const source = fs
        .readFileSync(swFile, 'utf8')
        .replace(/^const CACHE_VERSION = .*$/m, `const CACHE_VERSION = '${buildId}';`)
        .replace(/^const BUILD_ASSETS = .*$/m, `const BUILD_ASSETS = ${JSON.stringify(assets)};`);

      fs.writeFileSync(swFile, source);
      console.log(`[sw] precaching ${assets.length} boot assets — ${buildId}`);
    },
  };
}

/** Walks static imports from every entry chunk, collecting JS + CSS files. */
function collectBootAssets(bundle: OutputBundle): string[] {
  const entries = Object.values(bundle).filter(
    (chunk): chunk is OutputChunk => chunk.type === 'chunk' && chunk.isEntry
  );

  const seen = new Set<string>();
  const css = new Set<string>();

  const visit = (fileName: string) => {
    if (seen.has(fileName)) return;
    seen.add(fileName);

    const chunk = bundle[fileName];
    if (chunk?.type !== 'chunk') return;

    for (const imported of chunk.imports) visit(imported);
    for (const file of chunk.viteMetadata?.importedCss ?? []) css.add(file);
  };

  for (const entry of entries) {
    visit(entry.fileName);
    for (const file of entry.viteMetadata?.importedCss ?? []) css.add(file);
  }

  return [...seen, ...css].sort().map((fileName) => `/${fileName}`);
}