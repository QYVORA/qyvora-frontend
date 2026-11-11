# UI System v2

Source of truth for **the whole site** — public marketing pages and the
signed-in app share one rule set, one palette and one set of primitives.

## Scope

The tokens live in `:root` in `src/styles/index.css`; there is no per-surface
scope hook. `AppShell`, `AdminLayout`, public marketing pages and profile pages
all resolve the same typography, radii, weights and layout rhythm. Legacy
terminal-only chrome is retired.

## Navigation

`SiteTopbar` is the single bar for public and app surfaces: `--app-topbar-h`
height, `bg-surface-raised`, 1px bottom border, logo left, icon-above-label
items, shared `NavDropdown` groups and hide-on-scroll. `StudentDesktopTopbar`
and `PublicNavigation` only supply items and the right cluster. `AvatarMenu`
owns signed-in account actions; `MobileMenu` is the one hamburger drawer. There
is no bottom navigation.

## Typography

| Role | Font | Rule |
|------|------|------|
| UI text | Ubuntu (`@fontsource/ubuntu`, 400/500/700) | Body, labels, buttons, headings |
| Code / identifiers | JetBrains Mono | Code blocks, paths, commands, IPs, tokens, terminal output |

- Headings are weight **700** (`font-medium` in app scope; `font-black`/`extrabold` resolve to 700).
- h1–h6 are **sentence case**; the app scope cancels legacy uppercase.
- Overlines/kickers may be uppercase only at **12px or smaller**.
- Never use `font-display`, `font-black`, or `tracking-widest`.

## Tokens

Accent is unchanged: `#06B66F` with `on-accent` `#000000`. The app uses a
near-black ladder, not the marketing surfaces:

| Token | Utility | Use |
|-------|---------|-----|
| canvas | `bg-canvas` | Page background |
| surface | `bg-surface` | Cards, panels, header |
| surface-raised | `bg-surface-raised` | Rows, chips, nested inputs |
| border-subtle | `border-border-subtle` | Default 1px border |

Never use raw hexes. Code/terminal/brand exceptions remain exactly as in
`AGENTS.md`.

### Radius

| Element | Class | Value |
|---------|-------|-------|
| Cards/panels | `rounded-2xl` | 8px |
| Inputs/buttons/rows | `rounded-md` | 6px |
| Pills/avatars | `rounded-full` | full |

Never mix in `rounded-xl` (12px) or `rounded-3xl`.

## Primitives

Use the shared primitives, not bespoke markup:

- `Button` — variants `primary`, `secondary`, `ghost`, `danger-solid`, `danger-outline`.
- `Card` (named export) — `variant="default" | "nested" | "raised"`, `selected`, and `tone="feature" | "hero" | "strip" | "header"`.
- `SectionCard`, `StatStrip`, `RuleHeading` — section-level composition.
- `Input`, `Textarea`, `Select`, `Field`, `FieldGrid` — forms.
- `Switch` (bare) and `Toggle` (label + switch) — boolean settings.
- `Badge` (`pill` for rounded), `Avatar`, `Menu`/`MenuItem` — identity and account chrome.
- `UnderlineTabs`, `SegmentedTabs`, `OptionTile`, `Breadcrumb`, `Progress` (`size="strip"` for a 4px bar).

All exports live in `src/shared/components/ui/index.ts`. The DEV reference page
is `/dashboard/ui-kit` (`UiKitPage.tsx`).

## Layout

- Content fills the viewport: `px-[var(--app-gutter,12px)]`, no page-level `max-w-*`.
- Vertical rhythm: `var(--app-gap,24px)` between page sections.
- Card padding: `var(--app-card-pad,16px)`.
- Clear the topbar with `pt-[calc(var(--app-topbar-h,80px)+env(safe-area-inset-top))]`.
- Sticky rails use `top-[calc(var(--app-topbar-offset,var(--app-topbar-h,80px))+24px)]`.
- Dashboard hero height: `var(--app-hero-h,220px)` minimum.

### Gutters and rhythm

One global block in `src/styles/index.css` owns the measuring line:

| Variable | <640 | 640–1023 | 1024–1279 | ≥1280 |
|----------|------|----------|-----------|-------|
| `--app-gutter` | 12px | 16px | 24px | 30px |
| `--app-card-pad` | 16px | 20px | 24px | 24px |
| `--app-topbar-h` | 64px | 64px | 80px | 80px |

`--app-gap` is 24px. `--app-topbar-offset` is published on `<html>` by
`useScrollDirection`: `0px` while the bar is hidden, `var(--app-topbar-h)`
while visible.

### TwoColumn

`TwoColumn` (`src/shared/components/layout/TwoColumn.tsx`) is the only page
split. It is single-column below `lg` (1024px) and emits literal grid templates
so Tailwind always generates them:

| Split | Template | Use |
|-------|----------|-----|
| `dash` | `minmax(0,2fr) minmax(0,1fr)` | dashboard main + rail (~67/33) |
| `profile` | `minmax(0,4fr) minmax(0,7fr)` | profile identity + content (~36/64) |
| `rail` | `306px minmax(0,1fr)` | settings section rail |

Children must carry `min-w-0` and stack in DOM order. Do not add page-level
`xl:grid-cols-12` splits.

## Gradient surfaces

Four quiet accent mixes are the only sanctioned gradients. They are defined as
tokens and as explicit component utilities:

| Token | Utility | Use |
|-------|---------|-----|
| `--gradient-feature` | `.bg-gradient-feature` | Featured cards, rank/identity cards |
| `--gradient-hero` | `.bg-gradient-hero` | Page hero bands, auth split panel |
| `--gradient-strip` | `.bg-gradient-strip` | Stat strips and slim bands |
| `--gradient-header` | `.bg-gradient-header` | Section-card header bands |

Accent mix is capped at 22% (`--gradient-hero`), with no glow, blur or
animation. Apply via `Card tone="feature" | "hero" | "strip" | "header"` or the
utility class; never hand-roll a gradient.

## Learning hero

`LearningHero` (`src/shared/components/learning/LearningHero.tsx`) is the
shared lab/course/bootcamp header rendered by `LearningWorkspaceShell`:

- Full-bleed band touching the topbar; no gap above it.
- Height 292px at ≥1024, 240px at 640–1023, auto with 220px minimum on mobile.
- `overflow: hidden`, `position: relative`, `background-image: var(--gradient-hero)`.
- Optional `.line-grid` overlay at ≤5% opacity.
- Slanted badge art: `getLabBadgeAsset(id)` or bootcamp asset, absolutely
  positioned `right:-4%`, `top:50%`, ≈150% hero height,
  `translateY(-50%) rotate(-12deg) scale(1.25)`, `object-fit:contain`,
  opacity 0.22–0.3, `pointer-events:none`, left-edge mask
  (`linear-gradient(to left,#000 20%,transparent 78%)`).
- Mobile art sits bottom-right at ≈110% height and 0.18 opacity.
- `.learning-hero-shade` adds the left-to-right title-contrast overlay.

CSS classes live in `src/styles/index.css` (`learning-hero-band`,
`learning-hero-art`, `learning-hero-shade`).

## Scroll-hide topbar

`useScrollDirection` (`src/shared/hooks/useScrollDirection.ts`) hides the shared
`SiteTopbar` on scroll down and reveals it on scroll up. It:

- listens passively with `requestAnimationFrame`;
- accepts `threshold`, `delta`, `disabled`, `forceVisible` and `resetKey`;
- stays visible while a menu, dialog or focused control is inside the bar;
- resets on route change;
- publishes `--app-topbar-offset` on `<html>` for sticky rails.

The bar transitions with `motion-reduce:duration-0`; never reintroduce
navbar scroll-invert behaviour.

## Motion and effects

Flat by default. No glow, gradient beams, dot-grid washes, hover scale, heavy
`shadow-lg`/`shadow-2xl`, or `backdrop-blur` panels. State changes are 1px
border/background/colour transitions; accent tints (`bg-accent/10`) mark the
selected item. Respect `prefers-reduced-motion`.

## Accessibility

Unchanged and mandatory: 44px minimum touch targets, focus-visible accent
outline, labelled inputs/errors, dialog labelling, skip link, `role="status"`
for async feedback.

## Lint guard

`qyvora-local/no-legacy-app-style` fails migrated files that reintroduce
`font-display`, `font-black`, `tracking-widest`, `shadow-lg`, `shadow-2xl`, or
`rounded-3xl`. The migrated-file allowlist lives in
`eslint-plugins/qyvora-local/rules/no-legacy-app-style.cjs`; add each newly
migrated file there so the guard grows with the sweep.

`qyvora-local/no-arbitrary-color` and `no-status-palette` still apply.
