# Design Tokens — QYVORA (single source of truth)

Canonical reference for every design token. All values below live in
`src/styles/index.css` (Tailwind CSS v4 `@theme` blocks). **Use the Tailwind
utility, never a raw value** — the only raw-hex exceptions are listed in
AGENTS.md (sim/diagram palettes, SVG glyph artwork, third-party brand colors,
CodeBlock syntax colors).

## Surfaces (dark theme, default)

| Token | Utility | Value |
|---|---|---|
| `--color-bg` | `bg-bg` | `#000000` (page) |
| `--color-bg-alt` | `bg-bg-alt` | `#080808` |
| `--color-bg-card` | `bg-bg-card` | `#050505` |
| `--color-bg-elevated` | `bg-bg-elevated` | `#0b0b0b` |

### Calm surface family (migrated UI — dashboard, profile, admin)

| Token | Utility | Value (dark) |
|---|---|---|
| `--color-canvas` | `bg-canvas` | `#0b0d0e` |
| `--color-surface` | `bg-surface` | `#121617` (cards, fields, panels) |
| `--color-surface-raised` | `bg-surface-raised` | `#181d1e` (menus, sheets) |
| `--color-border-subtle` | `border-border-subtle` | `rgba(178, 193, 194, 0.13)` |
| `--color-text-tertiary` | `text-text-tertiary` | `rgba(238, 240, 238, 0.55)` |

Light-theme variants of the calm family exist under `.light`/`dark` variants
(`#D9DED5` canvas etc.) — dark is the shipped default.

## Accent

| Token | Utility | Value |
|---|---|---|
| `--color-accent` | `text-accent` / `bg-accent` | `#06B66F` |
| `--color-accent-dim` | `bg-accent-dim` | `rgba(6, 182, 111, 0.05)` |
| `--color-accent-glow` | `bg-accent-glow` | `rgba(6, 182, 111, 0.12)` |
| `--color-on-accent` | `text-on-accent` | `#000000` (text on accent fills) |

Never use another green (`#66B870` etc.). Brand components resolve accent via
`var(--color-accent)` in their default `color` prop — never pass raw `#06B66F`.

## Text

| Token | Utility | Value |
|---|---|---|
| `--color-text-primary` | `text-text-primary` | `#EEF0EE` |
| `--color-text-secondary` | `text-text-secondary` | `rgba(238, 240, 238, 0.70)` (body copy) |
| `--color-text-muted` | `text-text-muted` | `rgba(238, 240, 238, 0.40)` (metadata) |

## Borders

| Token | Utility | Value |
|---|---|---|
| `--color-border` | `border-border` | `rgba(171, 181, 192, 0.18)` |
| `--color-border-strong` | `border-border-strong` | `rgba(6, 182, 111, 0.26)` |
| `--color-border-subtle` | `border-border-subtle` | calm family `rgba(178, 193, 194, 0.13)` |

## Semantic status colors

| Token | Utility | Value | Use |
|---|---|---|---|
| `--color-danger` | `text-danger` / `bg-danger` | `#f87171` (red-400) | destructive |
| `--color-warning` | `text-warning` / `bg-warning` | `#fbbf24` (amber-400) | warnings |
| `--color-info` | `text-info` / `bg-info` | `#38bdf8` (sky-400) | info |
| `--color-success` | `text-success` / `bg-success` | `#06B66F` (accent) | success — same green as accent |

## Difficulty (badge system)

| Token | Utility | Value |
|---|---|---|
| `--color-difficulty-beginner` | `badge-beginner` | `#38bdf8` (sky-400) |
| `--color-difficulty-intermediate` | `badge-intermediate` | `#fbbf24` (amber-400) |
| `--color-difficulty-advanced` | `badge-advanced` | `#f87171` (red-400) |
| fallback | `badge-accent` | accent |

Difficulty badges live in `DifficultyBadge` (`src/shared/components/learning/LearningCard.tsx`)
with the `badge-*` utilities — the single canonical difficulty badge for the whole
app (learning cards, accordions, pages).

## Typography

- **Fonts**: `--font-mono: 'JetBrains Mono'` (body), `--font-display: 'Space Grotesk'`
  (headings, applied globally — never add `font-display` manually).
- **Micro scale** (see `docs/TYPOGRAPHY.md` for the full heading scale):

| Token | Utility | px | Replaces |
|---|---|---|---|
| `--text-kicker` | `text-kicker` | 10px | `text-[10px]` |
| `--text-tiny` | `text-tiny` | 9px | `text-[9px]` |
| `--text-overline` | `text-overline` | 8px | `text-[8px]` |
| `--text-micro` | `text-micro` | 7px | `text-[7px]` |

- **Component type classes**: `type-display`, `type-h1`, `type-h2`, `type-h3`,
  `type-body`, `type-body-sm`, `type-label`, `type-meta`, `type-code` (defined in
  the `@layer components` block of `index.css`).

## Spacing

- Tailwind v4 default scale (`px-1`…`px-8`, `gap-*`, `space-y-*`) is the system —
  the 4px base maps to `--sp-1`…`--sp-8` in `:root`.
- **Page gutters** (container padding): `px-3 md:px-4 lg:px-6` everywhere.

## Radius (never mix scales in one component)

| Context | Radius | Class |
|---|---|---|
| Cards, modals, panels, module blocks | 16px | `rounded-2xl` |
| Buttons, inputs, controls, page tiles | 12px | `rounded-xl` |
| Badges, pills, compact chips | 8px | `rounded-lg` |
| Progress bars, small status dots | full | `rounded-full` |

## Elevation & shadows

| Token | Utility | Value |
|---|---|---|
| `--card-shimmer` | `shadow-[var(--card-shimmer)]` | `inset 0 1px 0 rgba(255, 255, 255, 0.05)` (top light line) |
| `--card-shadow` | `shadow-[var(--card-shadow)]` | `0 12px 40px rgba(0, 0, 0, 0.30)` |
| `--elevation-raised` | `shadow-[var(--elevation-raised)]` | `0 8px 24px rgba(0, 0, 0, 0.45)` (raised overlay) |

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | 160ms |
| `--dur-base` | 260ms |
| `--dur-slow` | 420ms |
| `--ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| reveal (landing) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| carousel | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |

Reduced motion: CSS media query + `MotionConfig` + `useReducedMotion()`, all three.

## Breakpoints

Design matrix (`:root`): 360 (mobile) · 768 (tablet) · 1024 (desktop) · 1440
(wide) · 1920 (ultra-wide). Tailwind breakpoints used in markup are the defaults
(`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536); layout rules in
`docs/RESPONSIVE.md`.

## Z-index scale

Use the values from AGENTS.md / `docs/DESIGN_SYSTEM.md` (nav `z-[100]`, sheet
`z-[130]`, consent `z-[150]`, dialog `z-[200]`/`z-[201]`, tooltip `z-[300]`,
toast `z-[500]`, page loader `z-[9999]`, mobile overlay `z-[90]`). Corresponding
`:root` tokens `--z-nav` etc. mirror these.

## Icon sizes

| Context | Size |
|---|---|
| Inline UI icons (lucide) | `h-4 w-4` |
| Buttons / inline actions | `h-3.5 w-3.5` – `h-5 w-5` |
| Module header chips (profile) | `h-4 w-4` |
| Large feature icons | `w-8 h-8` – `w-12 h-12` |
| Course/lab SVG glyphs | `w-11 h-11` – `w-14 h-14` |

## Component interaction sizing

- Interactive elements: `min-h-[48px]` (44px acceptable on mobile), see
  `docs/ACCESSIBILITY.md`.