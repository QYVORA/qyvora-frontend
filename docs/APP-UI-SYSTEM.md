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
- `Card` (named export) — `variant="default" | "nested" | "raised"`, `selected`.
- `SectionCard`, `StatStrip`, `RuleHeading` — section-level composition.
- `Input`, `Textarea`, `Select`, `Field`, `FieldGrid` — forms.
- `Switch` (bare) and `Toggle` (label + switch) — boolean settings.
- `Badge` (`pill` for rounded), `Avatar`, `Menu`/`MenuItem` — identity and account chrome.
- `UnderlineTabs`, `SegmentedTabs`, `OptionTile`, `Breadcrumb`, `Progress` (`size="strip"` for a 4px bar).

All exports live in `src/shared/components/ui/index.ts`. The DEV reference page
is `/dashboard/ui-kit` (`UiKitPage.tsx`).

## Layout

- Content fills the viewport: `px-[var(--app-gutter,12px)]`, no page-level `max-w-*`.
- Vertical rhythm: `var(--app-gap,32px)` between page sections.
- Card padding: `var(--app-card-pad,20px)` (24px on desktop).
- Clear the topbar with `pt-[calc(var(--app-topbar-h,80px)+env(safe-area-inset-top))]`.
- Sticky rails use `top-[calc(var(--app-topbar-h,80px)+24px)]`.
- Hero height: `var(--app-hero-h,220px)` minimum on dashboard.

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
