/**
 * generate-og-image.mjs
 *
 * Renders the social preview set from the committed brand artwork
 * (`public/og-image.svg` — the QYVORA mark alone on the brand black canvas).
 *
 * Rules this script exists to satisfy:
 * - Linked previews (WhatsApp, LinkedIn, X, Slack …) cannot render SVG, and the
 *   only universally accepted raster format is PNG, so `og-image.png`
 *   (1200x630) is the file every SEO surface points at.
 * - `og-image.webp` is a smaller twin kept for surfaces that do accept WebP.
 * - Both are derived, never hand-edited. Edit the SVG, then re-run this script.
 *
 * Run with: npm run og:image
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public', 'og-image.svg');

/** Open Graph's canonical preview canvas. */
const WIDTH = 1200;
const HEIGHT = 630;

const svg = await readFile(source);

const raster = await sharp(svg, { density: 96 })
  .resize(WIDTH, HEIGHT, { fit: 'fill' })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

await sharp(raster).toFile(path.join(root, 'public', 'og-image.png'));
console.log(`og: wrote public/og-image.png (${WIDTH}x${HEIGHT})`);

await sharp(raster)
  .webp({ quality: 90, effort: 6 })
  .toFile(path.join(root, 'public', 'og-image.webp'));
console.log('og: wrote public/og-image.webp');