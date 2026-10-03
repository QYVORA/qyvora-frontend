/**
 * generate-pwa-icons.mjs
 *
 * Renders the PWA icon set from the committed brand artwork
 * (`public/favicon.webp` — the QyvoraMark) onto the brand near-black canvas.
 *
 * Installability rules this script exists to satisfy:
 * - Chromium wants a square PNG icon >= 144px with purpose "any" and a
 *   "maskable" variant >= 192px. WebP icons are not universally supported for
 *   manifest icons, so every entry is a real PNG.
 * - Maskable icons are cropped by the launcher, so the mark must sit inside the
 *   inner 80% safe zone (a centred circle covering ~80% of the canvas) with the
 *   background bleeding to every edge.
 *
 * Run with: npm run icons:pwa
 */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public', 'favicon.webp');
const outDir = path.join(root, 'public', 'icons');

/** Brand near-black canvas (--color-bg). */
const BACKGROUND = '#000000';

/**
 * Each entry describes one output file.
 * `scale` is the fraction of the canvas the artwork occupies.
 */
const targets = [
  { file: 'icon-192.png', size: 192, scale: 0.76 },
  { file: 'icon-512.png', size: 512, scale: 0.76 },
  { file: 'icon-maskable-192.png', size: 192, scale: 0.52 },
  { file: 'icon-maskable-512.png', size: 512, scale: 0.52 },
  { file: 'apple-touch-icon.png', size: 180, scale: 0.72 },
];

async function render({ file, size, scale }) {
  const inner = Math.round(size * scale);

  const mark = await sharp(source)
    .resize(inner, inner, { fit: 'contain', background: BACKGROUND })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUND,
    },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, file));
}

await mkdir(outDir, { recursive: true });
for (const target of targets) {
  await render(target);
  console.log(`icons: wrote public/icons/${target.file}`);
}