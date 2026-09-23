# QYVORA Background & Texture

How surfaces, bands, and textures are composed. The system is flat
terminal-born: backgrounds come from the token surface ladder and calm
gradient fades, never heavy images or `drop-shadow`-everywhere effects.

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
  (landing Path/Proof/FinalCta blocks)

## Site-wide masks

- **Hero edge fades**: `bg-gradient-to-r from-canvas via-canvas/85 to-transparent`
  over the avatar composition (mobile adds
  `bg-gradient-to-t from-canvas to-transparent`). The canvas fades blend the
  avatar art into the page without hard seams.
- Used the same way over carousels (`FeaturedLearningBlock`) so visuals melt
  into the background.

## Available CSS texture utilities

`src/styles/index.css`:

- `.dot-grid` — 24px radial accent-dot texture (`--dot-color`).
- `.grid-fade` — faint column grid with a fade-to-transparent backdrop.
- `.border-beam` / `.nav-border-beam` — animated 1px conic/linear accent
  borders (`@property --beam-angle` or the nav sweep). Inner content needs
  `relative z-[2]`.
- Dark-persistence: `data-theme-persist="dark"` forces dark tokens on a subtree
  even in light mode (used by `PublicFooter`, `AdminLayout`, `CodeBlock`).
  This is how dark terminal/code blocks survive the light theme.

Some utilities are currently unreatched (kept as system utilities) — verify
they are needed for a feature before using; do not stack them.

## Light theme behavior (Phase G.27)

- Light mode is not "everything white": `[data-theme="light"]` overrides in
  `index.css` set soft green-grey counters (`#D9DED5` canvas) with intentional
  shadows and stronger borders.
- Terminals and code blocks stay dark technical in light mode: `CodeBlock`
  carries `data-theme-persist="dark"`, and `SimulatedTerminal` is hardcoded
  dark (`#0c0c0c`) with the accent-green cursor/exec palette.
- `--color-hero-*` variables exist for the dark and light hero glow; use the
  token, not a hardcoded light/dark value.

## Rules

- No giant background images in page content; visuals are avatar compositions
  or flat token surfaces.
- No `drop-shadow` on every card; only the one raised-overlay shadow
  (`--elevation-raised`) and accent glows on high-emphasis elements.
- In dark mode keep pure black (`#000000`) for the canvas; in light mode use the
  green-grey counter, never sterile white.
- Texture (dots/border beam) belongs on a handful of high-emphasis elements,
  never scattered across whole pages.