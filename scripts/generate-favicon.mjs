/**
 * generate-favicon.mjs
 *
 * Renders the site favicon — `public/favicon.png` — from the official
 * QyvoraMark vector (the same glyph as `src/shared/components/brand/QyvoraMark`).
 *
 * Why this exists: the favicon must be a crisp, square PNG on a transparent
 * canvas. A non-square oversized source (as shipped previously) renders as a
 * tiny smudge in the tab and, when the browser falls back to the black PWA
 * icons, reads as a black square. The mark here is the single source of truth;
 * `generate-pwa-icons.mjs` then composites this same PNG onto the brand canvas
 * for the installable icon set.
 *
 * Run with: npm run icons:favicon
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'favicon.png');

/** Square favicon canvas. */
const SIZE = 512;
/** Fraction of the canvas the mark occupies (leaves a small breathing margin). */
const MARK_SCALE = 0.9;

/** Brand accent (--color-accent). */
const ACCENT = '#06B66F';

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 699 510"><g transform="translate(0,510) scale(0.1,-0.1)" fill="${ACCENT}" stroke="none"><path d="M2380 4529 c-130 -14 -256 -37 -355 -66 -546 -158 -958 -539 -1125 -1042 -77 -231 -75 -205 -75 -966 0 -615 2 -689 18 -773 56 -288 181 -515 407 -743 249 -250 548 -410 912 -486 l133 -28 1315 -3 1315 -3 -30 30 c-16 16 -84 78 -150 137 -200 181 -773 703 -868 792 l-88 82 -560 0 c-471 0 -572 3 -636 16 -266 55 -457 221 -540 469 l-27 80 -4 435 c-2 280 0 456 7 496 27 152 80 252 192 365 61 61 95 86 170 123 160 79 138 77 1003 74 849 -4 793 1 941 -76 102 -53 230 -183 278 -282 66 -136 69 -166 73 -625 1 -225 3 -413 3 -416 1 -6 958 -692 1023 -734 l28 -17 21 48 c35 81 77 209 96 296 16 76 18 141 18 733 0 588 -2 659 -18 740 -75 372 -238 681 -484 916 -265 254 -587 395 -978 428 -146 13 -1891 12 -2015 0z"/><path d="M3062 2311 c2 -5 44 -47 95 -92 50 -46 304 -280 565 -520 260 -239 529 -487 598 -549 226 -206 343 -313 480 -440 205 -189 541 -494 578 -525 30 -25 36 -26 60 -16 62 28 928 496 949 513 8 7 -93 88 -350 281 -1296 970 -1555 1165 -1669 1256 l-127 101 -591 0 c-345 0 -590 -4 -588 -9z"/></g></svg>`;

const inner = Math.round(SIZE * MARK_SCALE);

// The mark's viewBox carries empty padding, so render big, trim the transparent
// border, then fit the tight glyph to the canvas. Without the trim the mark
// would render noticeably small inside its square.
const rendered = await sharp(Buffer.from(mark), { density: 384 })
  .resize(1024, 1024, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const glyph = await sharp(rendered)
  .trim()
  .resize(inner, inner, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: glyph, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`favicon: wrote public/favicon.png (${SIZE}x${SIZE}, transparent)`);
