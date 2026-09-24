# QYVORA UI Pattern Inventory

Canonical reference for every recurring UI pattern in the codebase.
Source of truth: the code. Mirror existing implementations — never invent new patterns.

---

## 1. Card Surfaces

### 1a. CardBase (React component)

**Purpose**: Plain surface card for stats, steps, text content.

**Implementation**: `src/shared/components/ui/Card.tsx`

```tsx
<CardBase className="..." href="/optional" onClick={fn} active={bool} muted={bool}>
  {children}
</CardBase>
```

**Visual traits**:
- `terminal-card group relative flex flex-col overflow-hidden rounded-2xl border bg-bg-card`
- Border: `border-accent/30` (idle) → `border-accent/55` (hover/active)
- Shimmer: `boxShadow: var(--card-shimmer)` via inline style
- Transition: `transition-all duration-300`
- Muted state: `opacity-60 cursor-default`, no hover effect

**Variants**:
- `href` (internal): renders `<Link>`
- `href` + `external`: renders `<a>` with `target="_blank"`
- `onClick`: renders `<div role="button" tabIndex={0}>` with Enter+Space key handlers

### 1b. CardMedia (React component)

**Purpose**: Card with a top cover image. Used for bootcamps, products, services.

**Implementation**: `src/shared/components/ui/Card.tsx`

```tsx
<CardMedia image={src} imageAlt="..." imageAspect="aspect-[16/9]" imageBadges={<Badge />} imageProgress={75}>
  {body}
</CardMedia>
```

**Visual traits**:
- Image area: `relative overflow-hidden ${imageAspect}` with `object-cover`
- Image hover: `group-hover:scale-[1.03]` transition `duration-500`
- Body: `flex flex-1 flex-col p-4`
- Fallback on error: `hpbCoverImg` (static import)
- Progress bar: absolute bottom, `h-[3px] bg-accent`

**Rule**: Product cards use `aspect-[16/9]`. Never `aspect-square`.

### 1c. CardStat (React component)

**Purpose**: Compact horizontal stat card. Icon | value | optional label.

**Implementation**: `src/shared/components/ui/Card.tsx`

```tsx
<CardStat icon={<SomeIcon />} value="42" label="XP" accent={false} href="/link" />
```

**Visual traits**:
- `flex items-center gap-4 p-5 md:p-4`
- Icon container: `h-12 w-12 md:h-10 md:w-10 rounded-xl border`
- Accent icon: `border-accent/30 bg-accent-dim text-accent`
- Default icon: `border-border bg-bg text-text-muted`
- Value: `font-mono text-2xl md:text-xl font-black leading-none`
- Label: `text-[11px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted`

### 1d. CSS Card Classes

| Class | Look | Usage |
|-------|------|-------|
| `.card-qyvora` | `bg-transparent rounded-2xl` + dot-grid `::after`, `hover:scale(1.01)` | Dashboard cards, bento grids |
| `.card-accent` | `rounded-2xl border-accent/30`, hover `rgba(6,182,111,0.55)` | Interactive/selectable cards |
| `.terminal-card` | `rounded-2xl` + 1px top shimmer `::before` | All CardBase/CardMedia, modals, panels |

**Border opacity by context**: default `border-border/30`, subtle/landing `border-border/20`, interactive `border-accent/30`, elevated `border-border/50`.

---

## 2. Buttons

### 2a. CSS Button Classes

| Class | Appearance |
|-------|------------|
| `.btn-primary` | `bg-accent text-on-accent border-2 border-on-accent`, `hover:brightness-110 active:scale-95` |
| `.btn-secondary` | `bg-bg-elevated text-accent`, 1px `--color-border`, `hover:bg-bg-card` |
| `.btn-danger` | `bg-red-500/10 text-red-400 border-red-500/40`, `hover:bg-red-500/20` |

All: `font-black uppercase tracking-[0.08em] rounded-xl px-7 py-3`.

### 2b. Button Component

**Implementation**: `src/shared/components/ui/Button.tsx`

```tsx
<Button variant="primary" size="md" onClick={fn}>Label</Button>
```

Sizes: `sm` (`px-4 py-2 text-[10px]`), `md` (`px-7 py-3 text-[10px]`), `lg` (`px-8 py-3.5 text-xs`).

**Rule**: Prefer `<Button>` over raw `<button>` for all CTAs. Raw `<button>` is allowed when it uses `.btn-primary` / `.btn-secondary` / `.btn-danger`, or lives inside a shared primitive (`FilterTabs`, `Toggle`, `Tooltip`, `LearningFilterStrip`, `LearningAccordion`, walkthrough/card internals), or falls into one of the **documented accessibility exceptions** below:

### 2b-i. Documented raw-button exceptions
1. **Learning/simulation interactives** — `bootcamp-room` (StepCard nav/cheat, Quiz(,)GateModal, ReportIssueModal), `walkthrough/*`, `courses/*` (InlineQuiz, CodePlayground, StepNotes), `tools/*` (Ide, NetworkBuilder, ToolChooserModal, SimulatedTerminal), `simulations/*` (all sim controls).
2. **Canvas/drag/menu controls** — `NetworkBuilder` ContextMenu/DeviceNode, `NetworkEdge`, lightbox/drag pan/wheel-zoom controls (step image/lightbox).
3. **Input adornment icons** — password eye, token copy, search affordances positioned inside `<input>` rows (`absolute right-3`), where 44px `IconButton` sizing would break the field layout; keep `aria-label` + `min-w-[44px]`-equivalent hit area where possible.
4. **Custom control roles** — `role="switch"` toggles (settings-row switch variant; shared `Toggle` ships a label-row wrapper so settings rows keep the control-only variant), segmented `aria-pressed` pairs (accent/theme Dark-Light).
5. **Row-level action links** — inline uppercase `tracking-widest` text actions inside list rows (revoke session, view details, `text-danger` clear/revoke-all), rendered as `<button type="button">` with explicit hit/padding, not `<Button size>` (which would add container chrome).
6. **Admin table action buttons** — `DataTable` row actions per AGENTS Admin rules (44px touch targets, tokens only).
7. **Nav/rail icon toggles** — fixed 44px+ icon buttons in nav rails/bars rendered with `flex-1` equal-width distribution (e.g. `StudentSidebar` terminal/ide/network/settings); `IconButton`'s fixed `h-11 w-11` square would break the flex-row layout, so they stay raw with `aria-label` + `focus-visible`.

The theme Dark/Light control is a segmented `aria-pressed` pair (exception 4), not `FilterTabs` (which is `role="tablist"`).

### 2c. Interactive Button Patterns

**Filter tabs** (`FilterTabs` component): `px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider`. Active: `bg-accent text-on-accent`. Idle: `bg-bg-card border border-border text-text-muted`.

**Nav buttons** (desktop): `px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border`. Active: `border-accent/40 text-accent bg-accent/5`. Idle: `border-border/30 text-text-primary/80`.

**Carousel arrows**: `w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300 shadow-lg`.

**Empty state CTA**: `bg-accent text-on-accent px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 inline-flex items-center gap-1.5`.

---

## 3. Form Elements

### 3a. Text Inputs

**Pattern**:
```
bg-bg border border-border rounded-xl py-3 px-4 text-text-primary
focus:border-accent outline-none font-mono text-sm
```

- Always `rounded-xl`.
- Focus: `focus:border-accent` only (no `focus:ring-*`).
- Error: `.input-error` class (red border + shake + glow, defined in `index.css`).
- Disabled: `disabled:opacity-50`.
- Tap targets: `min-h-[48px]` (global `--tap-target-min`).

### 3b. Textarea

Same pattern as text inputs but with `resize-none` and optional `min-h-*` for multi-line.

### 3c. Error States

`.input-error` in `index.css`: red border, `animate-shake-x`, red glow shadow. Apply via `className` externally.

---

## 4. Badges

**Implementation**: `src/shared/components/ui/Badge.tsx`

```tsx
<Badge variant="accent" size="md">Label</Badge>
```

| Variant | Colors |
|---------|--------|
| `default` | `bg-bg-elevated text-text-muted border border-border/40` |
| `accent` | `bg-accent/10 text-accent border border-accent/20` |
| `success` | `bg-green-400/10 text-green-400 border border-green-400/20` |
| `warning` | `bg-yellow-400/10 text-yellow-400 border border-yellow-400/20` |
| `danger` | `bg-red-400/10 text-red-400 border border-red-400/20` |
| `info` | `bg-blue-400/10 text-blue-400 border border-blue-400/20` |

Sizes: `sm` (`px-2 py-0.5 text-[9px]`), `md` (`px-2.5 py-1 text-[10px]`).

Base: `inline-flex items-center rounded-lg font-black uppercase tracking-widest`.

### Inline Badges (not using Badge component)

```
px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted
```

With accent icon: add `text-accent` on the icon span.

---

## 5. Dialogs & Sheets

### 5a. Dialog (Desktop)

**Implementation**: `src/shared/components/ui/Dialog.tsx` (Radix UI)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent title="Title" maxWidth="max-w-xl" description="Optional desc">
    {body}
  </DialogContent>
</Dialog>
```

**Visual traits**:
- Overlay: `fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm`
- Content: `fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2`, `terminal-card bg-bg-card border border-border rounded-2xl overflow-hidden`
- Header: `flex items-center justify-between px-5 py-4 border-b border-border bg-bg-card/50 backdrop-blur-md z-10`
- Title: `text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest`
- Close button: `p-1.5 rounded-lg text-text-muted hover:text-accent`
- Body: `p-5 sm:p-8`
- Scrollable: `flex-1 overflow-y-auto min-h-0 overscroll-contain`
- Max widths: `max-w-sm` through `max-w-7xl`

### 5b. ConfirmDialog

Destructive confirmation variant with cancel/confirm buttons.

### 5c. BottomSheet (Mobile)

**Implementation**: `src/shared/components/ui/BottomSheet.tsx` (Radix UI)

```tsx
<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetContent ariaLabel="Sheet title">
    {body}
  </BottomSheetContent>
</BottomSheet>
```

**Visual traits**:
- Overlay: `fixed inset-0 z-[120] md:hidden bg-black/70`
- Content: `fixed bottom-0 left-0 right-0 z-[130] md:hidden terminal-card bg-bg-card border-t border-border/30 rounded-t-2xl max-h-[82svh] overflow-y-auto`
- Slide animation: `slide-in-from-bottom` / `slide-out-to-bottom`
- Safe area: `paddingBottom: env(safe-area-inset-bottom)`

**Rule**: Use `BottomSheet` for mobile actions, `Dialog` for desktop.

---

## 6. Loading & Empty States

### 6a. Skeleton

**Implementation**: `src/shared/components/ui/Skeleton.tsx`

```tsx
<Skeleton variant="card" className="..." />
```

Variants: `text` (`h-3 w-full rounded`), `card` (`h-32 w-full rounded-2xl`), `icon` (`h-12 w-12 rounded-2xl`), `image` (`aspect-video w-full rounded-2xl`), `title` (`h-6 w-3/4 rounded-lg`), `stat-value` (`h-10 w-32 rounded-lg`).

All: `animate-pulse bg-border/30`, `aria-hidden="true"`.

### 6b. EmptyState

**Implementation**: `src/shared/components/dashboard/EmptyState.tsx`

```tsx
<EmptyState icon={<LucideIcon />} title="No items" description="..." action={{ label: "Create", to: "/create" }} />
```

**Visual traits**:
- Container: `rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent mx-1`
- Icon: defaults to `<Dobia expression="confused" size="lg" />`
- Title: `text-sm text-text-muted`
- CTA: `bg-accent text-on-accent px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest`

### 6c. ErrorBoundary

**Implementation**: `src/shared/components/ErrorBoundary.tsx`

Class component with `fallback` prop. Shows Dobia mascot (`expression="angry"`), "Try Again" button (forces full remount via key increment), "Refresh Page", "Dashboard" buttons. Scope label shown in error card.

### 6d. ErrorState

**Implementation**: `src/shared/components/ui/ErrorState.tsx` (exported from `ui/index.ts`)

Inline error display within pages/cards.

---

## 7. Navigation Patterns

### 7a. Public Navigation

**Implementation**: `src/shared/components/layout/PublicNavigation.tsx`

- `React.memo`, `fixed inset-x-0 top-0 z-[100] h-[80px]`
- Inner: `w-full px-3 md:px-4 lg:px-6 flex items-center justify-between`
- Logo/actions: `z-[110]`
- Mobile drawer: `z-[90]` overlay (scroll-locked, Escape closes, focus moves into panel)
- Five flat nav links (Learn, Tools, Research, Services, About) — **no borders on links**; borders stay on badges/status indicators only
- One contextual CTA + `LanguageSwitcher`
- Skip link: `#main-content`

### 7b. Student Topbar

- `z-[110]`, `h-[64px]` (`TOPBAR_H = 'pt-20 md:pt-24'`)
- Split mobile/desktop into separate renderers

### 7c. Admin Topbar

- Same z/height as student
- `data-theme-persist="dark"` on layout root
- Mobile bottom nav: `pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6`

### 7d. Footer

**Implementation**: `src/shared/components/layout/PublicFooter.tsx`

- Outer: `px-3 py-10 md:px-4 md:py-20 lg:px-6` (no max-width)
- 4-column grid (Learning, Platform, Community, Company)
- Social links: X, LinkedIn, GitHub, YouTube, WhatsApp
- Logo + language switcher

---

## 8. Hero Patterns

### 8a. Landing Hero

**Implementation**: `src/features/marketing/components/landing/blocks/HeroBlock.tsx`

```tsx
<HeroBlock stats={stats} />
```

**Visual traits**:
- Container: `relative flex min-h-dvh w-full bg-canvas` with `data-theme-persist="dark"` (copy stays light-on-dark in both themes)
- Generated background art: desktop scene `hero-desktop.webp` (`hidden lg:block`) + portrait mobile scene `hero-mobile.webp` (`object-bottom`, `lg:hidden`), both as a decorative `absolute inset-0 object-cover` image and **never** dimmed with a scrim (see `docs/BACKGROUNDS.md`)
- Inner: `mx-auto flex w-full max-w-[1320px] flex-col justify-center px-3 py-24 pt-32 md:px-4 md:py-28 lg:px-6`
- Kicker (`type-label uppercase tracking-[0.12em] text-accent`) + `h1` (`type-display font-black uppercase tracking-tight`) with the accent line as a `block` span
- One primary CTA (`Button to="/register"`) + one ghost secondary link
- No canvas, no globe, no marquee — art + clean typography only

### 8b. Page Header (Public inner pages + dashboard)

**Implementation**: `src/shared/components/ui/PageHeader.tsx` and `src/shared/components/dashboard/PageHeader.tsx`

Shared title primitive used across public inner pages (Courses, Labs, Services, Bootcamp, Simulations) and the student dashboard. Replaced the former `StudentHeroSection`/`PublicHeroSection`.

---

## 9. Code Display

### 9a. CodeBlock

**Implementation**: `src/shared/components/CodeBlock.tsx`

```tsx
<CodeBlock code={snippet} lang="go" filename="main.go" badge="Go" copyable />
```

- Languages: `go`, `sh`, `text`
- Syntax palette: keywords `#c678dd`, strings `#e5c07b`, numbers `#d19a66`, types `#56b6c2`, builtins `#61afef`, funcs/commands `text-accent`
- Container: `data-theme-persist="dark"` `wc-code overflow-hidden rounded-xl border border-border/50 bg-bg`
- Header: `bg-bg-elevated px-3 py-2 border-b border-border/20` (dark-persisted)
- Copy button: `rounded-lg border border-border/20 bg-bg px-2 py-1 text-xs font-black uppercase tracking-widest`
- Code: `whitespace-pre overflow-x-auto overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:text-[13px]` with `role="region"` + `aria-label` and a focus ring (`focus-visible:ring-accent/50`) for intentional keyboard scroll (Phase D item 15)
- The whole surface is pinned dark via `data-theme-persist="dark"`, so code blocks stay dark technical in light mode (Phase G item 27)

### 9b. FlowDiagram

**Implementation**: `src/shared/components/diagrams/FlowDiagram.tsx`

Nodes + arrows, horizontal or vertical. Status colors: default, active, completed, danger, warning, success. Container: `wc-diagram`.

### 9c. KillChainDiagram

**Implementation**: `src/shared/components/diagrams/KillChainDiagram.tsx`

Sequential kill-chain visualization. Container: `wc-diagram`.

---

## 10. Carousels

### 10a. Generic Carousel

**Implementation**: `src/shared/components/carousel/Carousel.tsx`

```tsx
<Carousel slides={items} renderCard={(item) => <Card />} autoPlayInterval={5000} showArrows />
```

- Auto-play: `useAutoPlay` hook (respects `useReducedMotion`)
- Keyboard: ArrowLeft/ArrowRight (skips inputs)
- Animation: `AnimatePresence mode="wait"`, ease `[0.25, 0.46, 0.45, 0.94]`, duration 0.4s
- Container: `overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim`
- Arrows: absolute positioned, `w-9 h-9 rounded-full`

### 10b. Lesson carousels

Course lessons render via the shared `Carousel` (`src/shared/components/carousel/`) with `useAutoPlay` (respects reduced-motion), ArrowLeft/Right keyboard support, and `AnimatePresence mode="wait"`. The former bespoke `CoursesCarousel`/`LabsCarousel`/`ToolsCarousel` components and the inline `LandingCoursesSection` interval were removed during the landing redesign; public Courses/Labs pages now render a plain `LearningCard` grid.

---

## 11. Width Constraint System

Applied as className on component root or inner wrapper. Never ad-hoc `max-w-*` Tailwind utilities.

| Class | Max-width | Usage |
|-------|-----------|-------|
| `.wc-prose` | `42rem` | Narrative text, lesson body |
| `.wc-code` | `52rem` | Code blocks, fenced code |
| `.wc-terminal` | `56rem` | Terminal/CLI displays |
| `.wc-diagram` | `52rem` | Flow diagrams, kill-chain |
| `.wc-table` | `56rem` | Tables |
| `.wc-media` | `40rem` | Images, screenshots |
| `.wc-interactive` | `48rem` | Code playgrounds, quizzes, notes |

All reset to `max-width: 100%` on mobile (`@media (max-width: 767px)`).

---

## 12. Walkthrough & Education

### 12a. WalkthroughLayout (Labs)

**Implementation**: `src/shared/components/walkthrough/WalkthroughLayout.tsx`

Two-panel: left narrative + right simulation panel. Includes: title bar with icon/difficulty/time, progress bar, connection guide, simulation panel (browser/terminal/network). `wc-prose` on narrative.

### 12b. WalkthroughStep (Labs)

Individual step within WalkthroughLayout. Narrative text (`wc-prose`), code blocks (`wc-code`), images (`wc-media`), notes (`wc-interactive`), inline quizzes (`wc-interactive`).

### 12c. StepCard (Bootcamp)

**Implementation**: `src/features/student/components/bootcamp/StepCard.tsx`

Single-panel card for bootcamp phases. `wc-prose` on narrative, `wc-code` on code, `wc-diagram` on diagrams.

### 12d. LessonViewer (Courses)

**Implementation**: `src/features/student/components/courses/LessonViewer.tsx`

Lesson content renderer. `wc-prose` on body text, `wc-code` on code blocks, `wc-media` on images.

### 12e. FocusedStepList (all walkthroughs)

**Implementation**: `src/shared/components/learning/FocusedStepList.tsx`

Focused-step presentation for every walkthrough family. Only the CURRENT step renders fully expanded; completed steps collapse to compact "Done" rows and upcoming steps to "Next"/"Locked" rows — all on the same page (never a separate route). The active item carries id `${idPrefix}-${number}` with `scroll-mt-20 md:scroll-mt-24`.

- Bootcamp rooms: `idPrefix="step"` → `step-N` (`BootcampRoomPage`).
- Courses: `idPrefix="lesson"` → `lesson-N` (`CourseLessonPage`).
- Labs: `WalkthroughLayout` accepts opt-in props `stepList`, `activeStepIndex`, `onStepSelect`, `stepIdPrefix="ws-step"` → `ws-step-N`.

Navigation scrolls to the newly-activated id via `scrollIntoView`; because the focused id only exists for the active step, scroll calls retry after React commits the newly-expanded step.

**Interaction rule**: never attach a click/scroll/submit handler to a container that wraps interactive content (quizzes, flag inputs, copy buttons, links). Root `onClick`/`onKeyDown` on step containers must ignore events from interactive elements via `target.closest('button, a, input, textarea, select, [role="button"], label, [contenteditable="true"]')` so answering a quiz or pressing a button never scrolls the walkthrough back to the step top.

---

## 13. Background & Texture

See `docs/BACKGROUNDS.md` for the full background/texture system. Follow this
top-level map:

- **Base**: pages on `bg-canvas`; cards lift through the token surface ladder
  (`bg` → `bg-alt` → `bg-card` → `bg-elevated`), never raw hex blacks.
- **Bands**: alternating sections on `bg-surface` for rhythm.
- **Generated art**: a curated set of dark scenes in `src/assets/backgrounds/`
  backs the landing hero, featured-learning band, HPB/CP header bands, final
  CTA, and auth panel (webp-only in repo). Pattern: `relative overflow-hidden`
  root + decorative `absolute inset-0 object-cover` image + `relative` content +
  `data-theme-persist="dark"` on the root. **No scrim/opacity/blur over the art.**
  See `docs/BACKGROUNDS.md`.
- **Texture utilities** (available, verified before use): `.dot-grid` (24px
  accent dot), `.grid-fade` (faint column grid), `.border-beam` /
  `.nav-border-beam` (animated accent borders).
- **Dark persistence**: `data-theme-persist="dark"` forces dark tokens on a
  subtree in light mode (`PublicFooter`, `AdminLayout`, `AuthFormLayout`,
  `CodeBlock`, `NotFoundPage`, + every generated-art region).

> Note: `GridBoxedBackground` has been removed (Phase A item 3) — it no longer
> exists in the codebase and must not be reintroduced.

---

## 14. Motion Patterns

### 14a. Scroll Reveal

**Implementation**: `src/shared/components/ScrollReveal.tsx`

```tsx
<ScrollReveal direction="up" delay={0} amount={0.1} scale={0.95} staggerChildren={0}>
  {content}
</ScrollReveal>
```

Handles `staggerChildren`, `useInView({ once: true, amount: 0.1 })`, `scale: 0.95`, skips animation when `prefersReducedMotion || isMobile`.

### 14b. Hand-rolled Reveal (23 files)

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
/>
```

Prefer `ScrollReveal` over this pattern.

### 14c. Page Transitions

`AnimatePresence mode="wait"` keyed on `location.pathname`. Fade: `opacity 0 → 1`, duration 0.25s.

### 14d. Carousel Slides

`AnimatePresence mode="wait"`, x-slide `-300/0/300`, duration 0.4s, ease `[0.25, 0.46, 0.45, 0.94]`.

---

## 15. Z-Index Scale

| z-index | Element |
|---------|---------|
| `z-[60]` | Mobile drawer backdrop |
| `z-[70]` | Drawer content |
| `z-[80]` | Dropdowns |
| `z-[90]` | Mobile nav overlay |
| `z-[100]` | Navbar / bottom nav |
| `z-[110]` | Navbar logo/actions, student topbar |
| `z-[120]` | BottomSheet overlay |
| `z-[130]` | BottomSheet content |
| `z-[140]` | InstallBanner |
| `z-[145]` | CommunityPopup |
| `z-[150]` | ConsentBanner |
| `z-[200]` | Dialog overlay |
| `z-[201]` | Dialog content |
| `z-[210/211]` | Stacked dialogs |
| `z-[220]` | Context menu |
| `z-[300]` | Tooltip |
| `z-[500]` | Toast |
| `z-[9999]` | Page loader |

---

## 16. Layout Patterns

### 16a. Snap Section

```tsx
<section className="relative w-full min-h-dvh snap-section bg-bg">
  <div className="w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10">
    {content}
  </div>
</section>
```

Alternate `bg-bg` / `bg-bg-alt`. Footer is last snap section (no `min-h-dvh`; snaps to `end` via
`.snap-section:last-child`). Never a fixed `h-dvh`/`lg:h-dvh` on content sections — they must grow.

### 16b. Full-viewport section (snap)

```tsx
<section className="relative w-full min-h-dvh snap-section flex flex-col odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 scroll-mt-24 md:scroll-mt-28">
  <div className="w-full my-auto">{children}</div>
</section>
```

Auto-applies: `relative w-full min-h-dvh snap-section flex flex-col odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 scroll-mt-24 md:scroll-mt-28`. Inner wrapper: `w-full my-auto`.

### 16c. Sidebar Layout (Team, QuiteRoot, Anansi, etc.)

Outer: `py-12 sm:py-10 md:py-16 lg:py-20`. Content fills viewport width with `px-3 md:px-4 lg:px-6`.

### 16d. Auth Form Layout

Two-column on `md`: left hero (`AuthHero`), right form (`max-w-lg`). Mobile: stacked, translucent backdrop, globe pinned bottom-right.

### 16e. Student/Admin Topbar Layout

`pt-20 md:pt-24` clearance. Sidebar + main content area.

---

## 17. Icons

`lucide-react` only. Named imports: `import { ArrowUp, ChevronLeft } from 'lucide-react'`.

No emoji as icons. No custom SVG icon system (except brand logo, HackerGlobe canvas, and the `icons/` barrel exports for branded social icons).

Empty states: icons at `w-10 h-10` or `w-12 h-12`.

---

## 18. Layout Stability

### Stable Section Dimensions

Major layout containers must have stable, intentional dimensions. Dynamic content adapts within the established layout rather than redefining the layout geometry.

### Carousel Viewport Stability

Full-section carousels (Courses, Labs) use:
- `relative w-full min-h-dvh flex flex-col` on the section (growable, never fixed `lg:h-dvh`)
- `my-auto` on the padded wrapper (short slides center, tall slides grow the section)
- `overflow-x-clip` around the AnimatePresence slide region
- `line-clamp-*` on variable-length text where slides must not change section height
- Dedicated visual region with stable aspect ratio

### Content Slot Stability

Where content varies between slides:
- Fixed media ratios (`aspect-square`, `aspect-[4/3]`)
- Controlled description regions (`line-clamp-3`)
- Consistent CTA positioning (pinned to bottom of content column)
- Stable metadata areas (flex-wrap with gap)

### Snap Section Stability

Snap sections use `min-h-dvh` and grow when content exceeds the viewport — content must never clip
under the fixed navbar or get cut at the section bottom. Vertical centering comes from an inner
`my-auto` wrapper, which collapses to top-alignment on overflow.

---

## 19. Tooltips

**Implementation**: `src/shared/components/ui/Tooltip.tsx`

Radix UI Tooltip. `TooltipProvider` at app root, `Tooltip` + `TooltipTrigger` + `TooltipContent` on elements. `z-[300]`.

---

## 20. Admin Dashboard Patterns

### Admin Layout

**Implementation**: `src/features/admin/layouts/AdminLayout.tsx`

- Forces dark theme: `data-theme-persist="dark"`
- Topbar clearance: `pt-20 md:pt-24`
- Mobile bottom nav padding: `pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6`
- No sidebar — tab-based navigation via `?tab=` URL parameter

### Admin Topbar

**Implementation**: `src/features/admin/components/layout/AdminTopbar/AdminTopbar.tsx`

- Fixed top: `z-[100]` (matches public navbar spec)
- Height: `h-20 md:h-24`
- Dropdown navigation with 4 groups (Manage, Content, Communications, Monitor)
- Mobile bottom nav with 4 primary items + "More" button
- Skip-to-content link: `<a href="#main-content">`

### Admin Navigation Groups

**Implementation**: `src/features/admin/components/layout/AdminTopbar/navGroups.ts`

| Group | Items |
|-------|-------|
| Manage | Overview, Users, Bootcamps |
| Content | Market, Points |
| Communications | Inbox, Broadcast |
| Monitor | Audit, Security |

Mobile primary: Overview, Users, Bootcamps, Points
Mobile more: Market, Inbox, Broadcast, Audit, Security

### Admin Tabs

| Tab | Component | Primary Pattern |
|-----|-----------|-----------------|
| overview | `OverviewTab` | StatCard grid + DataTable |
| users | `UsersTab` | StatCard grid + DataTable with mobile cards |
| bootcamps | `BootcampAccessPanel` | StatCard grid + toggle + phase list |
| zero_day | `ZeroDayMarketTab` | Form card + DataTable (desktop) / card grid (mobile) |
| cp | `CpAnalytics` | StatCard grid + BarChart + PointsControl + TransactionLedger |
| inbox | `InboxTab` | Filter buttons + list + Dialog |
| broadcast | `BroadcastTab` | Form card + ConfirmDialog |
| audit | `AuditLogTab` | Filter dropdown + date range + custom list |
| security | `SecurityTab` | StatCard grid + DataTable |

### Admin StatCard Usage

Admin tabs use the shared `StatCard` component from `@/shared/components/dashboard`:

```tsx
<StatCard
  icon={<Users className="w-5 h-5 text-text-muted" />}
  label={t('admin.overview.totalUsers')}
  value={data?.users.total ?? 0}
  accent={false}
  loading={loading}
/>
```

### Admin DataTable Usage

Admin tables use the shared `DataTable` component from `@/shared/components/dashboard`:

```tsx
<DataTable
  data={users}
  columns={columns}
  keyExtractor={(u) => u.id}
  searchable
  searchPlaceholder={t('admin.users.searchPlaceholder')}
  searchFilter={searchFilter}
  mobileCard={mobileCard}
  emptyTitle={t('admin.users.empty')}
/>
```

### Admin Form Patterns

Admin forms use standard input styling:

```tsx
// Standard input
<input className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted" />

// Or using INPUT_CLS constant
<input className={INPUT_CLS} />
```

### Admin Dialog Patterns

Admin dialogs use shared `Dialog`, `DialogContent`, and `ConfirmDialog`:

```tsx
<ConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title={t('admin.users.authorizeTermination')}
  description={t('admin.users.deleteConfirm')}
  confirmLabel={t('admin.users.terminate')}
  cancelLabel={t('admin.users.abort')}
  destructive
  onConfirm={handleConfirm}
/>
```

---

## 21. Reconciliation additions

### 21a. ToolQuickStart (tool docs, Phase D)

**Implementation**: `src/shared/components/tools/ToolQuickStart.tsx`

The reader-first quickstart used on every `/anansi /toha3ee /sekhmet ...` tool
page (replaced the fake-terminal + usage-card pairs):

```tsx
<ToolQuickStart
  command="sekhmet fuzz --target sim --runs 100000"
  commandNote="Simulated, deterministic, offline."
  output={[{ label: 'baseline', text: 'simulation target profiled' }, /* … */]}
  session={['shaka> assess', 'shaka> exit']}
  usage={['sekhmet install', 'sekhmet docs']}
  footer="Fuzz only software you own or have explicit written permission to test."
/>
```

- `command` is required; `commandNote` sits under it when the run is simulated.
- Either `output` (flat `[label] text` lines) or `session` (REPL lines shown
  verbatim), not both.
- Built on `CodeBlock` — so it is dark-persisted in light mode.

### 21b. PageLoader boot lifecycle (Phase G)

**Implementation**: `src/shared/components/PageLoader.tsx` (exports `PageLoader`,
`DelayedPageLoader`).

Types `qyvora@core:~$ boot`, then a `boot complete` line, holds, and fades the
whole overlay out (typing → completion → hold → fade). Timings: 55ms/char,
260ms to the completion line, 700ms hold, 400ms fade. Reduced-motion: the full
line renders immediately, no fade, and uses the accessibility-safe caret.
Rendered at `z-[9999]`; used by the router for auth boot and route suspense.

### 21c. Leaderboard color ladder (Phase F)

**Implementation**: `src/shared/components/leaderboard/{types,PodiumCard}.ts`

- Top-three colors: `text-accent`, `text-accent/80`, `text-accent/50`.
- Podium tiers: #1 `border-accent/70` + `shadow-accent/30` glow + crown (scaled
  up), #2 `border-accent/30` + `shadow-accent/15`, #3 neutral
  `border-border/50` with no glow.
- `RANK_COLORS`: Vanguard/Strategist/Master Operator `text-accent`, Agent/
  Architect `text-warning`, Specialist/Contributor/Operator `text-info`,
  Candidate/Seeker `text-text-muted`. No material purple/zinc/amber.

### 21d. Per-phase HPB avatars (Phase F)

`HpbPhasePage` related-phase cards render the phase's own `HpbAvatar`
(variant `phase1`..`phase5` from `@/shared/components/HpbAvatar.tsx`) in a
bordered tile, matching the landing per-phase-avatar language. See
`docs/AVATARS.md`.
