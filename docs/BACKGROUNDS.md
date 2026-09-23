# QYVORA Background & Texture

How surfaces, bands, and textures are composed. The system is flat
terminal-born: page backgrounds come from the token surface ladder and calm
gradient fades. A small set of **purpose-generated dark background images** backs
the key marketing regions (landing hero, featured-learning band, page header
bands, final CTA, auth, 404) — the only place raster art is used.

## Surface ladder (tokens)

Pages sit on `bg-canvas`. Components lift through the ladder — never use raw
hex blacks:

- `bg` → `bg-alt` → `bg-card` → `bg-elevated` (dark: `#000000` → `#080808` →
  `#050505` → `#0b0b0b`; light theme has intentional green-grey counters,
  not pure white)
- `bg-bg-card` = the default card surface; `surface`/`surface-raised` CSS
  classes compose the same tokens with `border-border-subtle`
- `bg-accent-dim` / `bg-accent/10` for accent-tinted panels and icon tiles
  (always paired with an `accent`/`border-accent/*` foreground)
- Separator bands: alternate a flat section on `bg-surface` for rhythm
  (landing Path/Proof blocks)

## Generated background art

A curated set of generated dark scenes lives in `src/assets/backgrounds/` and
backs high-emphasis marketing regions:

| Region | Component | Files in `src/assets/backgrounds` |
|---|---|---|
| Landing hero (desktop + mobile scene) | `HeroBlock` | `hero-desktop` (left-aligned scene, `hidden lg:block`), `hero-mobile` (portrait, `object-bottom`) |
| Featured-learning band | `FeaturedLearningBlock` | `featured-learning-band` (subtle squad patrol) |
| HPB page header band | `HpbPage` | `hpb-header` |
| CP page header band | `CyberCoinPage` | `cp-header` |
| Final CTA card (Dobia signs off) | `FinalCtaBlock` | `final-cta-dobia` |
| Auth hero panel | `AuthHero` | `auth-dobia` (Dobia keeps watch) |
| 404 page | `NotFoundPage` | `notfound-dobia` (Dobia is lost) |

**Delivery**: one `.webp` (quality 80) per image is committed; the large `.png`
sources are gitignored (`src/assets/backgrounds/*.png`) and kept outside the
repo. `vite-plugin-webp-conversion` has nothing left to convert in dev, so the
committed `.webp` are the source of truth.

**Implementation pattern** (all of these, every time):

1. Region root: `relative overflow-hidden` (+ the region's surface token).
2. Decorative image first child:
   `<img src={…} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" />`.
   Hero desktop/mobile swap via `hidden lg:block` / `block lg:hidden`; the
   mobile scene uses `object-bottom` so the squad stays visible on tall phones.
3. Content sits in a `relative` sibling above the image.
4. Region root carries `data-theme-persist="dark"` so copy keeps dark-theme
   tokens (light-on-dark) even in light mode — the images are dark scenes.
5. **Never** put an opacity/scrim/blur overlay over the art — colors stay full.
   Readability comes from the dark art + forced-light text, not from dimming.

The old `bg-gradient-to-* from-canvas via-canvas/85 to-transparent` hero and
carousel edge fades were removed when this art landed — no canvas-fade masks
remain.

## Available CSS texture utilities

`src/styles/index.css`:

- `.dot-grid` — 24px radial accent-dot texture (`--dot-color`).
- `.grid-fade` — faint column grid with a fade-to-transparent backdrop.
- `.border-beam` / `.nav-border-beam` — animated 1px conic/linear accent
  borders (`@property --beam-angle` or the nav sweep). Inner content needs
  `relative z-[2]`.
- Dark-persistence: `data-theme-persist="dark"` forces dark tokens on a subtree
  even in light mode. Used by `PublicFooter`, `AdminLayout`, `AuthFormLayout`,
  `CodeBlock`, `NotFoundPage`, and every generated-art region listed above.
  This is how dark terminal/code blocks (and copy over dark art) survive the
  light theme.

Some utilities are currently unreatched (kept as system utilities) — verify
they are needed for a feature before using; do not stack them.

## Light theme behavior (Phase G.27)

- Light mode is not "everything white": `[data-theme="light"]` overrides in
  `index.css` set soft green-grey counters (`#D9DED5` canvas) with intentional
  shadows and stronger borders.
- Terminals and code blocks stay dark technical in light mode: `CodeBlock`
  carries `data-theme-persist="dark"`, and `SimulatedTerminal` is hardcoded
  dark (`#0c0c0c`) with the accent-green cursor/exec palette.
- Regions backed by the generated dark art keep dark tokens via
  `data-theme-persist="dark"` (the same mechanism), so they read correctly in
  both themes.
- `--color-hero-*` variables exist for the dark and light hero glow; use the
  token, not a hardcoded light/dark value.

## Rules

- Raster background art is used **only** on the seven regions listed above;
  everything else stays on flat token surfaces.
- No `drop-shadow` on every card; only the one raised-overlay shadow
  (`--elevation-raised`) and accent glows on high-emphasis elements.
- In dark mode keep pure black (`#000000`) for the canvas; in light mode use the
  green-grey counter, never sterile white.
- No opacity/blur/scrim over the generated art — images keep full color.
- Texture (dots/border beam) belongs on a handful of high-emphasis elements,
  never scattered across whole pages.