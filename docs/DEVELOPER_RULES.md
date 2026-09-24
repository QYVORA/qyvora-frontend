# QYVORA UI Development Rules

The development-facing checklist distilled from the platform audit. Read this
(and AGENTS.md) before writing or modifying any UI.

## Before you write UI

1. Read `src/styles/index.css` tokens and component classes (see `docs/TOKENS.md`).
2. Check `docs/UI-PATTERN-INVENTORY.md` for existing pattern implementations.
3. Check `docs/UI-PRINCIPLES.md` for enforced rules.
4. Look at existing similar components before creating new ones.
5. If a primitive exists in `src/shared/components/ui/`, use it — do not fork it.

## The rules

### Tokens
- Use Tailwind utilities (`bg-*`, `text-*`, `border-*`) mapped from tokens. No raw
  hex/rgba in components unless it is an AGENTS.md-listed exception (sim/diagram
  palettes, SVG glyphs, third-party brand colors, CodeBlock/IDE colors).
- Micro text: `text-kicker` / `text-tiny` / `text-overline` / `text-micro` tokens —
  arbitrary `text-[9px]`/`text-[10px]` are migration-only.
- No ad-hoc durations/easings: use `duration-[var(--dur-*)]` +
  `ease-[var(--ease-smooth)]` (or the named easings in `docs/TOKENS.md`).
- Radius scale: `rounded-2xl` cards/modals, `rounded-xl` controls, `rounded-lg`
  badges/pills, `rounded-full` for pills/progress. Never mix within a component,
  never arbitrary radii.
- Shades/elevation: `--card-shimmer`, `--card-shadow`, `--elevation-raised` only.
  No new drop-shadow-heavy looks.

### Single accent
- One accent: `#06B66F` via `text-accent`/`bg-accent`. Never another green.
- Semantic colors restricted to their role: `danger` destructive, `warning`,
  `info`, `success` (= accent). Admin: `text-accent` + `text-red-400` only.
- Difficulty: `badge-beginner` / `badge-intermediate` / `badge-advanced` /
  `badge-accent` via the canonical `DifficultyBadge`.

### Components
- Cards: canonical primitives (`CardBase`, `CardMedia`, `CardStat`, `LearningCard`).
  Learning content always `LearningCard`; product covers `aspect-[16/9]`.
- Buttons: `<Button>` or `btn-*` classes. Raw buttons need a documented exception.
- Inputs: `<Input>` component. Dialogs: `DialogContent`/`BottomSheet` + title +
  `aria-describedby`. Skeletons: shared `Skeleton`, never `react-loading-skeleton`.
- Icons: `lucide-react` named imports + `Icon*` aliases and `Brand*`/course SVG
  assets from `@/shared/components/icons`. Brand/logo/achievement glyphs use their
  dedicated SVG components — never lucide stand-ins (see AGENTS.md Profile rules).
- Empty/error/loading: `EmptyState` (single canonical), `ErrorState`, matching
  skeletons. Never re-create empty states.

### Layout
- No `max-w-*` page containers; `px-3 md:px-4 lg:px-6`; `wc-*` for content width.
- Clearance: pages under a topbar add NO `pt-*` (shell provides it); public
  sections `pt-24 md:pt-28 lg:pt-32`.
- Grow with `min-h-dvh`, never `h-dvh`. No strip-like sections — every section is
  a composed block (see AGENTS.md "Layout Rules").
- No content bleed into navbar or adjacent sections (`items-center` on sparse
  split-screen rows).

### Motion
- Prefer `ScrollReveal`; canonical easing lists; three-layer reduced-motion.
- Carousels: `useAutoPlay`, `useReducedMotion()`, arrow keys, `AnimatePresence
  mode="wait"`, stable viewport heights.

### Content & state
- Include skeleton → error → empty → data for any async view.
- All interactive states per `docs/COMPONENT_STATES.md`; a11y target
  `min-h-[48px]`, focus never suppressed.

### What NOT to do
- Do not reintroduce anything in AGENTS.md "Do Not Reintroduce" (legacy layouts,
  `react-loading-skeleton`, dual walkthrough toolbars, second overlay manager,
  `font-display`, `h-dvh` sections, settings topbar variant, etc.).
- Do not add `zustand`/`@tanstack/react-query`, `NavCard`, or fork shared
  primitives into a feature folder.
- No emoji as icons; no purple/indigo gradients; no random new tokens.

## Definition of done

- Composes existing patterns (no new primitives where a shared one exists).
- Typecheck, lint, and build pass: `npm run typecheck && npm run lint && npm run build`.
- Responds at 360 / 768 / 1024 / 1440 / 1920 and with reduced motion + keyboard.