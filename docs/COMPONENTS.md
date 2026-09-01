# QYVORA UI — Component Documentation

**Purpose:** Single authoritative reference explaining every significant UI component in the QYVORA frontend — what it looks like, its props, and where/how it is used. This doc is written so that a human **or an AI agent** can immediately reconstruct any component's visual appearance and usage without reading the source.

**Source of truth:** the code. If this doc and the code disagree, the code wins. Read `src/styles/index.css` first — it defines every design token used below.

**Rules that apply to everything:**
- Dark terminal theme: bg `#000000` lifting through `bg-alt #080808 → bg-card #050505 → bg-elevated #0b0b0b`. Single accent `#06B66F`. Text `#EEF0EE` (70% = secondary, 40% = muted).
- Use design tokens as Tailwind utilities (`bg-bg-card`, `text-accent`, `border-border`). **Never raw hexes** except in flagged files (CodeBlock, Ide, topicMap).
- Cards `rounded-2xl`. Buttons/inputs/badges `rounded-xl`/`rounded-lg`. Never mix radius scales in one component.
- Buttons: always `<Button>`. Inputs: always `<Input>`. Skeletons: always `<Skeleton>`.
- All user-visible strings through i18n `useTranslation()`.
- All headings `font-black`; Space Grotesk applied globally (never add `font-display`). Body is JetBrains Mono.
- Reduced motion respected in 3 layers: CSS + `MotionConfig` + `useReducedMotion()`.

---

## Table of contents
1. [Design tokens & base classes](#1-design-tokens--base-classes)
2. [Core UI primitives (`ui/`)](#2-core-ui-primitives)
3. [Dashboard primitives (`dashboard/`)](#3-dashboard-primitives)
4. [Learning primitives (`learning/`)](#4-learning-primitives)
5. [Collections & carousels](#5-collections--carousels)
6. [Overlay / popup components](#6-overlay--popup-components)
7. [Layout & shell components](#7-layout--shell-components)
8. [Profile components (`profile/`)](#8-profile-components)
9. [Leaderboard components](#9-leaderboard-components)
10. [Brand / badge / decorative components](#10-brand--badge--decorative-components)
11. [Marketing landing sections](#11-marketing-landing-sections)
12. [Full pages & page-level composite components](#12-full-pages--page-level-composite-components)
13. [Student experience components](#13-student-experience-components)
14. [Component matrix (who uses what)](#14-component-matrix-who-uses-what)
15. [Dead / unused components to avoid](#15-dead--unused-components-to-avoid)

---

## 1. Design tokens & base classes

**Config:** Tailwind v4, configured entirely in `src/styles/index.css` `@theme` (no `tailwind.config.*`). Breakpoints = defaults (sm 640, md 768, lg 1024, xl 1280, 2xl 1536). Import alias `@/` → `src`.

### 1a. Color tokens → Tailwind utilities

| Token | Dark value | Utility form | Used for |
|---|---|---|---|
| `--color-bg` | `#000000` | `bg-bg` | page background |
| `--color-bg-alt` | `#080808` | `bg-bg-alt` | alternating snap sections |
| `--color-bg-card` | `#050505` | `bg-bg-card` | cards, inputs, surfaces |
| `--color-bg-elevated` | `#0b0b0b` | `bg-bg-elevated` | btn-secondary, raised chips |
| `--color-accent` | `#06B66F` | `bg/text/border-accent` | the ONLY accent |
| `--color-on-accent` | `#000000` | `text/bg/border-on-accent` | text ON accent surfaces |
| `--color-accent-dim` | `rgba(6,182,111,.05)` | `bg-accent-dim` | hover tint |
| `--color-accent-glow` | `rgba(6,182,111,.12)` | `shadow-[0_0_12px_var(--color-accent-glow)]` | glow | 
| `--color-text-primary` | `#EEF0EE` | `text-text-primary` | headings/body |
| `--color-text-secondary` | `rgba(238,240,238,.70)` | `text-text-secondary` | body copy |
| `--color-text-muted` | `rgba(238,240,238,.40)` | `text-text-muted` | labels/meta |
| `--color-border` | `rgba(171,181,192,.18)` | `border-border` (+`/20/30/50`) | separators |
| `--color-border-strong` | `rgba(6,182,111,.26)` | `border-border-strong` | strong accent |
| `--color-danger` | `#f87171` | `text/bg-danger` (red-400) | errors/destructive |
| `--color-warning` | `#fbbf24` | `text-warning` (amber-400) | warnings |
| `--color-info` | `#38bdf8` | `text-info` (sky-400) | info |
| `--color-success` | `#06B66F` | `text-success` | success |
| `--color-difficulty-beginner` | `#38bdf8` | `text-difficulty-beginner` | beginner |
| `--color-difficulty-intermediate` | `#fbbf24` | `text-difficulty-intermediate` | intermediate |
| `--color-difficulty-advanced` | `#f87171` | `text-difficulty-advanced` | advanced |

Light theme lives in `[data-theme="light"]` (green-tinted greys, never pure white). Admin is forced dark via `[data-theme-persist="dark"]`.

### 1b. Motion / type tokens

| Token | Value | Notes |
|---|---|---|
| `--ease-smooth` | `cubic-bezier(0.22,1,0.36,1)` | canonical |
| `--dur-fast` | `160ms` | |
| `--dur-base` | `260ms` | |
| `--dur-slow` | `420ms` | |
| `--text-kicker` | 10px (`text-kicker`) | micro eyebrow |
| `--text-tiny` | 9px (`text-tiny`) | micro label |
| `--text-overline` | 8px (`text-overline`) | micro |
| `--text-micro` | 7px (`text-micro`) | micro |

Fonts: `--font-mono` JetBrains Mono (`font-mono`), `--font-display` Space Grotesk (`font-display` — discouraged, auto-applied to h1–h6).

### 1c. Reusable CSS classes (in `index.css`)

| Class | Purpose / looks |
|---|---|
| `.btn-primary` | `bg-accent text-on-accent font-black uppercase tracking-[0.08em] rounded-xl px-7 py-3 border-2 border-on-accent hover:brightness-110 active:scale-95` |
| `.btn-secondary` | `bg-bg-elevated text-accent font-black uppercase rounded-xl px-7 py-3 border border-border hover:bg-bg-card active:scale-95` |
| `.btn-danger` | `bg-danger/10 text-danger font-black uppercase rounded-xl px-7 py-3 border border-danger/40 hover:bg-danger/20 active:scale-95` |
| `.card-accent` | `rounded-2xl border border-accent/50` (hover `accent/55`) |
| `.card-qyvora` | `bg-transparent rounded-2xl overflow-hidden` + dot-grid `::after`, hover scale 1.01 |
| `.terminal-card` | `rounded-2xl overflow-hidden` + top 1px shimmer `::before`; used for dialog content, code blocks |
| `.badge-beginner/-intermediate/-advanced/-accent/-muted` | pill: `text / border-X/30 / bg-X/10`, `font-black uppercase tracking-widest` |
| `.dot-grid` | 24px radial accent dot texture |
| `.line-grid` | 40px repeating vertical lines |
| `.glass-effect` | `backdrop-blur-md` (navbar/menu only) |
| `.snap-section` | `scroll-snap-align:start` (desktop); content uses `min-h-dvh` |
| `.wc-prose` | `max-width:64rem` |
| `.wc-code` / `.wc-terminal` / `.wc-table` | `max-width:56rem` |
| `.wc-diagram` / `.wc-interactive` | `max-width:52rem` |
| `.wc-media` | `max-width:40rem` |

**Micro-typography convention:** kickers/labels = `text-kicker font-black uppercase tracking-[0.3em] text-accent` (or `text-tiny`). Body reading text = `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]` — **never `leading-relaxed`**. Micro labels frequently use `text-[9px]`/`text-[10px]` during migration.

**Z-index scale (authoritative):** dropdowns `z-[80]` · mobile nav `z-[90]` · navbar `z-[100]` · navbar logo `z-[110]` · BottomSheet overlay/content `z-[120]/[130]` · scroll-to-top `z-[9997]` · install banner `z-[140]` · consent `z-[150]` · tooltip `z-[300]` · dialog overlay/content `z-[200]/[201]` · stacked dialogs `z-[210]/[211]` · context menu `z-[220]` · toast `z-[500]` · page loader `z-[9999]` · spotlight tour `z-[600]`.

**Touch targets:** interactive elements `min-h-[48px]` (44px acceptable on mobile), enforced globally by CSS for buttons/inputs/selects/textarea/`role=button`.

**Icon system:** `lucide-react` named imports ONLY (no emoji icons). Custom glyphs live in `@/shared/components/icons` (`IconTerminal`, `IconCode`, `IconNetwork`, `IconArrowRight`, `IconX`, `IconCheck`, `IconMarketplace`, brand icons, etc.).

---

## 2. Core UI primitives

Location: `src/shared/components/ui/` (barrel `index.ts`).

### 2.1 `Button` — default export
`src/shared/components/ui/Button.tsx`

**Purpose:** The ONLY CTA/button primitive. All buttons must use it (or raw `.btn-primary`/`.btn-secondary`/`.btn-danger`).

**Props:**
```ts
{ variant?: 'primary'|'secondary'|'danger'|'ghost'; size?: 'sm'|'md'|'lg';
  icon?: ReactNode; loading?: boolean; to?: string; href?: string; external?: boolean;
  ...React.ButtonHTMLAttributes }
```
- `primary`: `bg-accent text-on-accent font-black border-2 border-on-accent hover:brightness-110 active:scale-95`
- `secondary`: `bg-bg-elevated text-accent font-black border border-border hover:bg-bg-card active:scale-95`
- `danger`: `bg-danger/10 text-danger font-black border border-danger/40 hover:bg-danger/20`
- `ghost`: transparent, `text-text-secondary`, hover `bg-bg-elevated`
- sizes: `sm px-4 py-2.5 text-xs` · `md px-7 py-3 text-sm` · `lg px-8 py-3.5 text-sm`
- **Shape:** `inline-flex items-center justify-center gap-2 rounded-xl uppercase tracking-[0.08em] font-black`, transition filter/transform/bg/color/shadow `--dur-base --ease-smooth`, `disabled:opacity-50`. `loading` shows a `Loader2 animate-spin` and sets `aria-busy`. Polymorphic: renders `<Link>` if `to`, `<a>` if `href` (external opens new tab), else `<button>`.

**Used in:** ContactModal, ServiceRequestModal, CoursePurchaseModal, EditModal, SettingsPage, EmptyState, ErrorBoundary, admin pages, and every CTA across the app.

### 2.2 `Input` — default export
`src/shared/components/ui/Input.tsx`

**Props:** `{ icon?: ReactNode; error?: string|boolean; ...React.InputHTMLAttributes }`

**Shape:** wrapper `relative w-full`; optional leading icon `absolute left-3.5 text-text-muted`; the input itself `w-full bg-bg-card border rounded-xl py-3 font-mono text-sm`, icon mode `pl-12`, `error` → `border-danger/60 focus:border-danger` + string error shows `role="alert" p text-xs text-danger`; else `border-border focus:border-accent`. `aria-invalid` set. No focus ring — focus is `border-accent` only.

**Used in:** all forms (auth, profile edit, settings, contact, etc.) via parent form components.

### 2.3 `CardBase` / `CardMedia` / `CardStat` — named exports
`src/shared/components/ui/Card.tsx`

**⚠️ Legacy:** exported and documented but NOT used anywhere outside `Card.tsx`. Superseded by `LearningCard`. Referenced for completeness only.

- `CardBase`: `terminal-card group relative flex flex-col overflow-hidden rounded-2xl border bg-bg-card` + `boxShadow var(--card-shimmer)`; `active` → `border-accent/60`, `muted` → dim; polymorphic Link/a/role-button.
- `CardMedia`: `CardBase` + top cover (`aspect-video` default, `group-hover:scale-[1.03]`), optional badges + 3px accent progress bar, body `p-4`.
- `CardStat`: `icon | value | label` row; icon in `rounded-xl border`, value `font-mono text-2xl font-black`, label `text-[11px] uppercase tracking-widest text-text-muted`.

### 2.4 `Dialog` / `DialogContent` / `ConfirmDialog` — named exports
`src/shared/components/ui/Dialog.tsx` (Radix)

**Props:**
```ts
DialogContent: extends Radix.DialogContent { title: string; description?: string; hideClose?: boolean; maxWidth?: string (default 'max-w-xl') }
ConfirmDialog: { open; onOpenChange; title; description; confirmLabel?; cancelLabel?; destructive?: boolean; onConfirm }
```

**Shape:** Portal → overlay `fixed inset-0 z-[200] bg-black/70` → content `z-[201] centered terminal-card bg-bg-card border border-border rounded-2xl`, max-width dynamic (`max-w-sm`…`max-w-7xl`), sticky header `px-5 py-4 border-b backdrop-blur-md` (only navbar/menu, so use carefully) with `RadixDialog.Title` + `IconX` close (`min-h-[44px] min-w-[44px]`), scrollable body, `aria-describedby="dialog-description"`, Radix slide/zoom animations.

**Used in:** ContactModal, ServiceRequestModal, ToolInstallModal, CoursePurchaseModal, QuizModal, QuizGateModal, ReportIssueModal, StepJumpMenu, EditModal, UsernameChangeModal, StudentOnboardingModal, ShareProfile, admin tabs (Broadcast, Inbox).

### 2.5 `BottomSheet` / `BottomSheetContent` — named exports
`src/shared/components/ui/BottomSheet.tsx` (Radix)

**Purpose:** Mobile-only dialog. **Props:** `BottomSheetContent = { ariaLabel: string }`.

**Shape:** overlay `fixed inset-0 z-[120] md:hidden bg-black/70`; content `fixed bottom-0 z-[130] md:hidden terminal-card bg-bg-card border-t rounded-t-2xl max-h-[82svh]`, slide-from-bottom, `sr-only` title = ariaLabel.

**Used in:** `MobileNotificationsSheet` (admin + student) only.

### 2.6 `Badge` — default export
`src/shared/components/ui/Badge.tsx`

**Props:** `{ variant?: 'default'|'accent'|'success'|'warning'|'danger'|'info'; size?: 'sm'|'md' }`

**Shape:** `inline-flex items-center rounded-lg font-black uppercase tracking-widest border`. Variants: `default` `bg-bg-elevated text-text-muted border-border/40`; `accent` `bg-accent/10 text-accent border-accent/20`; others `bg-X/10 text-X border-X/20`. Sizes: `sm px-2 py-0.5 text-[9px]` · `md px-2.5 py-1 text-[10px]`.

**Used in:** DailyMissionCard, WeeklyOperationCard, admin IncidentsTab.

### 2.7 `Skeleton` — default export
`src/shared/components/ui/Skeleton.tsx`

**Props:** `{ variant?: 'text'|'card'|'icon'|'image'|'title'|'stat-value'; className? }` — all `animate-pulse bg-bg-elevated`, `aria-hidden`.

**Variants:** `text h-3 w-full rounded` · `card h-32 w-full rounded-2xl` · `icon h-12 w-12 rounded-2xl` · `image aspect-video rounded-2xl` · `title h-6 w-3/4 rounded-lg` · `stat-value h-10 w-32 rounded-lg`. **Native only** — never `react-loading-skeleton`.

**Used in:** StatCard, DataTable, dashboard/landing sections, StudentSkeletons, bootcamp configs.

### 2.8 `Tooltip` / `TooltipProvider` — named exports
`src/shared/components/ui/Tooltip.tsx` (Radix)

**Props:** `{ content; children; side?; sideOffset?=6; delayDuration?=400; disabled?; className? }`

**Shape:** Provider at app root. Content `terminal-card z-[300] px-2.5 py-1.5 rounded-lg bg-bg-card border-border/50 shadow-lg text-[11px] font-bold uppercase tracking-widest font-mono` + `Arrow fill-border`. Trigger wrapped in `<span class="inline-flex">` so disabled buttons work. `disabled` renders children bare.

**Used in:** admin UsersTab; Provider mounted in `src/app/main.tsx`.

### 2.9 Other `ui/` primitives

- **`FadeIn`** (default): `motion.div` opacity fade-in (mount-time, skeleton→content swaps), respects reduced motion. Props `{children, className?, duration?=0.3}`. Used on all student pages.
- **`ErrorState`** (default): `flex items-start gap-3 p-4 rounded-2xl border border-danger/30 bg-danger/5` with `Dobia` mascot (angry/confused) + title/message in `text-danger`. Props `{message, title?, icon?, className?, severity?, bare?}`. `bare` = centered mascot only. Used across admin + student + marketing.
- **`FilterTabs`** (default): `role="tablist" flex gap-2 flex-wrap`; buttons `min-h-[44px] rounded-xl font-black uppercase tracking-wider`; active `bg-accent text-on-accent`, idle `bg-bg-card border-border text-text-muted`. Props `{tabs, activeKey, onChange, size?, className?}`. Used in Leaderboard period filter.
- **`AuthImage`** (named): fetches auth-gated `/uploads/bootcamps/` blobs through axios (Bearer + 401 refresh), fallback for guests, pulse placeholder. Props `extends ImgHTMLAttributes {src?, fallback?}`. Used in market/bootcamp imagery.
- **`StatCounter`** (default): count-up number. **DEAD — no usages.**
- **`DottedMapOverlay`** (default): `absolute inset-0 pointer-events-none` accent dotted world map. Props `{opacity?=.24, className?}`. Used in LandingLabs/Pillars/Services + ServiceDetailPage.
- **`SimpleHeading`** (default): `<h2>` split into accent+primary spans. Props `{text, align?, compact?, accentWords?, accentPlacement?, variant?}`; `compact text-3xl→5xl`, standard `text-4xl→7xl font-black tracking-tight`. Used in TermsContentSection.
- **`BatchPagination`** (default): centered prev/next + dot pagination, `min-h-[44px] min-w-[44px]`, returns null if `totalPages<=1`. Used in BlogsPage, LeaderboardPage, MarketPage.

---

## 3. Dashboard primitives

Location: `src/shared/components/dashboard/` (barrel `index.ts`).

### 3.1 `StatCard` + `StatCardSkeleton` — default + named
`src/shared/components/dashboard/StatCard.tsx`

**Props:**
```ts
{ icon?; label: string; value: ReactNode; trend?: {direction:'up'|'down'|'flat'; value; label?};
  accent?: boolean; loading?: boolean; onClick?; href?; ...HTMLAttributes }  // forwards data-* attributes
```

**Shape:** polymorphic `a`/`button`/`div` on `card-accent bg-bg-card p-5`. Icon in `w-10 h-10 rounded-xl bg-bg-elevated` (or `bg-accent/10` when `accent`); label `text-[10px] font-black uppercase tracking-[0.2em] text-text-muted`; value `font-mono text-2xl font-black tabular-nums` (accent when `accent`); trend icon `TrendingUp`(accent)/`TrendingDown`(danger)/`IconMinus`(muted). `StatCardSkeleton` = 3 skeleton blocks in `card-accent bg-bg-card p-5 space-y-4`.

**Used in:** student DashboardPage (Rank / CP / Streak / Rooms), admin Overview/Security/Users/cp-analytics.

### 3.2 `DataTable` + `Column` — default + type
`src/shared/components/dashboard/DataTable.tsx`

**Props:** `{ data: T[]; columns: Column<T>[]; keyExtractor; loading?; searchable?; searchPlaceholder?; searchFilter?; pageSize?=25; emptyIcon?; emptyTitle?; emptyAction?; mobileCard?; minWidth?='min-w-[640px]' }`. `Column<T> = { key; header; render; sortable?; hideOnMobile?; className?; headerClassName? }`.

**Shape:** loading → 8 skeleton rows (`h-14 rounded-xl bg-bg-card border`); search bar; desktop `<table>` uppercase sortable `<th>` + accent arrows, rows `hover:bg-accent-dim/5`; mobile falls back to `mobileCard` list; pagination with page-size select + prev/next `w-11 h-11`; dashed empty state.

**Used in:** admin Overview/Security/Users/ZeroDayMarket.

### 3.3 `EmptyState` — default
`.../dashboard/EmptyState.tsx`

**Props:** `{ icon?; title; description?; action?: {label; to?; href?; onClick?} }`

**Shape:** `relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center` + optional Dobia + `<Button variant="primary">`. Used in admin InboxTab.

### 3.4 `PageHeader`, `SyncIndicator`
- `PageHeader`: `ScrollReveal`-wrapped kicker (`text-xs ... text-accent`) + `h1 text-4xl md:text-6xl font-black` + subtitle + action buttons (primary/secondary/danger, spinner). Props `{pretitle?, title, subtitle?, actions?, loading?}`. **Defined but no app-page import found.**
- `SyncIndicator`: refresh icon + status text (`Last updated: X` / `No data yet`), error state in `text-danger`, retry button. Props `{lastSync, error?, onRetry?}`. Used in AdminDashboardPage.

---

## 4. Learning primitives

Location: `src/shared/components/learning/` (barrel `index.ts`).

### 4.1 `LearningCard` + `DifficultyBadge` — default + named
`src/shared/components/learning/LearningCard.tsx`

**THE canonical learning/course/lab/product card.** Rule: every learning item (labs, courses, bootcamp phases, lessons, products, resources) MUST use this.

**Props (broad):**
```ts
{ id?; type?: 'lab'|'course'|'bootcamp'|'lesson'|'product'|'resource'; title; description?; to?; href?; external?; onClick?;
  difficulty?; badge?; badgeText?; accentColor?; cpReward?; duration?; lessonsCount?; modulesCount?; progress?;
  image?; imageAlt?; icon?; tags?; actionLabel?; actionIcon?; isActionDisabled?; isActionLoading?; onActionClick?;
  owned?; isFree?; price?; view?: 'grid'|'expanded'; className?; muted?; active? }
```

**GRID view (default):** `rounded-2xl border bg-bg-card card-accent p-4 md:p-5 h-full min-h-[220px] justify-between`; `aspect-[16/9]` cover with `Owned`/`Free` chips + `group-hover/card:scale-105`; difficulty/owned/free/tags header; title `text-sm→lg font-black group-hover:text-accent`; description `line-clamp-3 font-mono`; accent progress bar; footer `border-t` with metadata (CP/duration/lessons/modules/price) + action pill (`bg-accent text-on-accent` + arrow/spinner or `price` CTA).

**EXPANDED (list) view:** `p-4 md:p-5`, horizontal header grid, `line-clamp-2` description, progress bar, same footer. Polymorphic Link/a/button/div.

**`DifficultyBadge {difficulty}`:** `inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border` + Star icon; classes `badge-beginner/-intermediate/-advanced` (fallback `badge-accent`).

**Used in:** CourseCard, LabCard, DashboardPage, labs LabCard, MyCoursesPage, RelatedContent.

### 4.2 `LearningNav`
`.../learning/LearningNav.tsx`

**Props:** `{ currentStep; totalSteps; isLastStep; isComplete?; completing?; onPrev?; onNext?; onComplete?; nextLabel?; nextLabelMobile?; completeLabel?; finishContent?; className?; leading? }`

**Shape:** prev/next/complete stepper row with `btn-secondary` (`min-h-[44px]`) / `btn-primary`, step counter `N / total`, `Loader2` spinner when `completing`, optional `finishContent`. **Used in:** BootcampRoomPage, CourseLessonPage.

### 4.3 `LearningToolbar`
`.../learning/LearningToolbar.tsx`

**Props:** `{ actions: {id; icon; label; onClick; active?; variant?}[]; className? }`

**Shape:** Desktop → fixed right sidebar `hidden lg:flex fixed right-6 z-[90]` with `h-11 w-11` icon buttons (accent-active). Mobile → floating FAB `fixed right-4 bottom-20 z-[100]` + expandable panel (AnimatePresence). Zero actions → null. **The fullscreen toggle lives here** (via `useRoomSession`), never inline. **Used in:** BootcampRoomPage, CourseLessonPage, LabPage.

### 4.4 `StepRenderer` / `StepNumberHeader`
- `StepRenderer` (default): wraps one step as `<section class="relative w-full border-t border-border/10 py-12 md:py-16">` composing `StepNumberHeader` + children + `afterContent` + optional `StepNotes` + footer. Props `{stepNumber, title, isActive?, isCompleted?, statusLabel?, badges?, backUrl?, backLabel?, onBack?, children, headerAction?, afterContent?, footer?, notesStorageKey?, className?}`. Used in StepCard, CourseLessonPage.
- `StepNumberHeader` (default): back link/button + step square `h-12 w-12 rounded-xl border font-mono text-lg font-black` — active `bg-accent text-on-accent`, completed `bg-accent-dim border-accent/20 text-accent` + `IconCheck`, else `bg-bg-elevated text-text-muted`; uppercase `tracking-[0.25em]` title + statusLabel.

### 4.5 `LearningAccordion`
`.../learning/LearningAccordion.tsx`

**Props:** `{ items: {id; title; subtitle?; description; difficulty?; meta?; body?; onStart?; startLabel?; locked?; cpCost?; onUnlock?}[]; className?; defaultOpen? }`

**Shape:** Desktop (md+) → horizontal expandable strip `rounded-xl border border-border/50 bg-bg-card` with numbered gutter (`01`), difficulty badge, lock icon, chevron, height animation; `StartButton`/`Unlock for N CP`. Mobile → stacked always-expanded `terminal-card` cards. **Used in:** all 5 lab pages.

### 4.6 `LabPage`
`.../learning/LabPage.tsx`

Generic lab page shell. **Props:** `{ title; accentWord; description?; villain?; activeScenario; listingContent; walkthroughContent; celebrationShow; celebrationTitle?; celebrationCp?; relatedContent?; noIndex? }`. **Shape:** SEO + LabCelebration + LearningToolbar(fullscreen when activeScenario) + `StudentHeroSection` (listing) else `walkthroughContent` on `bg-bg-alt`. **Used in:** KillChain/Osint/Password/Privesc/SqlInjection labs.

### 4.7 `TerminalWrapper`
`.../learning/TerminalWrapper.tsx`

**Props:** `{ open; onOpenChange; context?; initialCommands?; mode?: 'modal'|'inline'|'raw'; title? }`. Wraps `TerminalShell`. `modal` → Radix dialog (`z-[200]/[201]`, fullscreen `inset-2`); `inline` → `<div class="wc-terminal">`; `raw` → bare shell. **Used in:** SimulationPage, Ide, StudentLayout, NetworksPage, TerminalToolPage.

---

## 5. Collections & carousels

### 5.1 `CardCollection` + `ViewToggle` — `card-collection/`
- `CardCollection` (default): grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6` or expanded `flex flex-col gap-3 md:gap-4`; each item in `motion.div layout`. Props `{items, renderItem, keyOf, view, className?, gridClassName?, expandedClassName?}`. Used in BlogsPage, MarketPage.
- `ViewToggle` (default): `role="group" inline-flex rounded-xl border border-border/50 bg-bg-card p-1` with `LayoutGrid`/`Rows3` icon buttons `w-7 h-7 rounded-lg`, active `bg-accent text-on-accent`. Props `{value:'grid'|'expanded', onChange, className?, label?}`.

### 5.2 `Carousel` — `carousel/`
`src/shared/components/carousel/Carousel.tsx`

**Props:** `{ slides: T[] (T extends {id:string}); renderCard; className?; autoPlayInterval?=5000; showArrows? }`.

**Shape:** auto-advancing deck via `useAutoPlay` (off on reduced-motion/single slide), `useSwipeNav`, ArrowLeft/Right keyboard, `AnimatePresence mode="wait"` directional x-slide ease `[0.25,0.46,0.45,0.94]` .4s; container `overflow-hidden rounded-2xl border bg-accent-dim`; floating round arrows `w-9 h-9 rounded-full border bg-bg-card`. Returns null on empty. **Used in:** ActDivider, LandingBlogs, LandingServices, CoursesPage, CyberCoinPage, LabsPage.

### 5.3 `DragMarquee` — `carousel/` (not in barrel)
`src/shared/components/carousel/DragMarquee.tsx`

**Props:** `{ children; speed?=26; reverse?; className?; trackClassName? }`. Infinite rAF marquee, content doubled (`aria-hidden`/`inert`), pointer-drag with fling, pauses offscreen/tab-hidden, reduced-motion → static `overflow-x-auto no-scrollbar`. **Used in:** LandingCourses, LandingLabs, LandingOpenSourceTools, LandingSimulations, LandingTeam, CyberCoinPage.

---

## 6. Overlay / popup components

All popups coordinate through `usePopupManager` (priority queue; lower number = shown first). Priorities: onboarding `0` · consent-banner `1` · onboarding-tour `2` · community `3` · install `5`. Popups release their slot when they can't show.

| Component | File | Priority | Behavior / looks |
|---|---|---|---|
| `StudentOnboardingModal` | `features/student/components/StudentOnboardingModal.tsx` | `0` | 4-step Radix Dialog guiding to bootcamp; server-state authoritative; on dismiss triggers tour. |
| `StudentTour` (spotlight) | `features/student/components/StudentTour.tsx` | `2` | Post-onboarding guided tour; see §13.1. |
| `ConsentBanner` | `shared/components/ConsentBanner.tsx` | `1` | cookie consent popup. |
| `CommunityPopup` | `shared/components/CommunityPopup.tsx` | `3` | WhatsApp CTA, 30s delay, 4h dismissal. |
| `InstallBanner` | `features/student/components/layout/InstallBanner.tsx` | `5` | PWA install prompt. |
| `CelebrationModal` | `shared/components/CelebrationModal.tsx` | — | reward celebration dialog (CP/badge/CTA). Wrapped by `LabCelebration`. |
| `ErrorBoundary` | `shared/components/ErrorBoundary.tsx` | — | Dobia mascot + Try Again / Refresh / Dashboard. |
| `ScrollToTop` | `shared/components/ScrollToTop.tsx` | — | route-change scroll; `ArrowUp` button `bottom-4 left-4 z-[9997]` after 150px. |
| `PageLoader` | `shared/components/PageLoader.tsx` | — | full-screen `z-[9999]`, 180ms delay via `DelayedPageLoader`. |
| `Toast` | `core/contexts/ToastContext` | `z-[500]` | global toasts. |

---

## 7. Layout & shell components

Location: `src/shared/components/layout/`.

### 7.1 `Navbar` — default (`React.memo`)
`src/shared/components/layout/Navbar.tsx`

Public navigation. `fixed top-0 w-full z-[100] h-[80px]`; inner `w-full px-3 md:px-4 lg:px-6 flex justify-between`; logo/actions `z-[110]`; mobile overlay `fixed inset-0 z-[90] md:hidden bg-bg/95 backdrop-blur-xl` (scroll-locked); desktop nav `px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border` (active `border-accent/40 text-accent bg-accent/5`, idle `border-border/30 text-text-primary/80`); hover dropdowns with 150ms leave timeout. Data-driven from `SITE_CONFIG.nav`.

### 7.2 `Footer` — default
`src/shared/components/layout/Footer.tsx`

Outer `px-3 py-10 md:px-4 md:py-20 lg:px-6` (no max-width), 4-col grid (Learning/Platform/Community/Company), social links from `SITE_CONFIG.social`, logo + `LanguageSwitcher`. Last snap area on landing pages.

### 7.3 `RoomTopBar` — default
Bootcamp room top bar (back nav, breadcrumbs, actions). Props `RoomTopBarProps`, `BreadcrumbItem`, `RoomTopBarAction`.

### 7.4 Hero / section primitives (shared)
- **`PublicHeroSection`** (default): `min-h-dvh`, 2-col grid on `lg` (growable), `HackerGlobe` (Three.js) on `md+`, `px-3 md:px-4 lg:px-6 pt-20 pb-14`, `GridBoxedBackground` behind, `mask` variant. Child slots: `<Badge>`, `<h1>`/accent span, `<p>`, `<Button>`.
- **`StudentHeroSection`** (default; exports canonical `PUBLIC_HERO_TITLE_CLASS`): same visual scale; used for Courses/Labs/Services/Bootcamp/Sims + dashboard PageHeader. Props `{title, accentWord, description?, villain?, fullHeight?}`.
- **`PublicSnapLayout` / `PublicSnapSection`** (defaults, `src/shared/components/PublicSnapSection.tsx`): `PublicSnapSection` auto-applies `relative w-full min-h-dvh snap-section flex flex-col odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 lg:pt-32 scroll-mt-24` with inner `w-full my-auto`. `PublicSnapLayout` is the page-level snap container.
- **`ScrollReveal`** (default, canonical reveal): `useInView({once:true, amount:0.1})`, `scale:0.95`, skips on reduced-motion/mobile. Props `{direction, delay, amount, scale, staggerChildren}`.
- **`SEO`** (default): head meta/title/og per page.
- **`RelatedContent` / `RelatedContentSection`** (default): related-item list/grid (snap variant), built from data, uses LearningCard-style cards.
- **`CodeBlock`** (default): code display. Languages `go|sh|text`; syntax palette (keywords `#c678dd`, strings `#e5c07b`, numbers `#d19a66`, types `#56b6c2`, builtins `#61afef`, commands `text-accent`); container `wc-code overflow-hidden rounded-xl border border-border/30 bg-bg`; copy button.
- **`Dobia`** (default): mascot with expressions (`angry`, `confused`) + sizes.
- **`Identicon`** (default): jdenticon SVG avatar (`aspect-square overflow-hidden bg-black`; caller owns border, e.g. `rounded-xl border-2 border-accent`).
- **`LanguageSwitcher`** (default): i18n dropdown grouped by African region; sets `document.documentElement.lang/dir`.
- **`ShareProfile`**, **`HandleSuggestions`**, **`PreferencesApplier`**, **`AdaptiveMode`**, **`CourseIconBackground`**, **`ToolDocumentationSection`** — shared helpers/components (see §10 for the decorative ones).

---

## 8. Profile components

Location: `src/shared/components/profile/`. Used in `PublicProfilePage` + student `ProfilePage`.

Two are **frozen — never modify**: `ProfileMetricsStrip`, `ProfileIdentityBlock`.

| Component | Exports | Looks | Notes |
|---|---|---|---|
| `ModuleHeader` | default | standard section header: `px-5 py-4 border-b border-border/50`; icon `w-8 h-8 rounded-lg` (`bg-accent/10` default); title `text-xs font-black uppercase tracking-widest text-text-muted`; trailing slot. Props `{icon, iconClassName?, title, trailing?}`. | used inside all profile cards |
| `ProfileMetricsStrip` | default | `grid grid-cols-2 sm:3 lg:6 overflow-hidden rounded-2xl border border-border/50 bg-bg-card`; cells `min-h-18 border-b border-r border-border/20 px-4 py-4`; icon + `font-mono text-xl font-black tabular-nums` value. Props `{metrics}`. | FROZEN |
| `ProfileIdentityBlock` | default | 2-col: square `Identicon` (`aspect-square rounded-2xl border-2 border-accent bg-black`) + info card (`rounded-2xl border-border/50 bg-bg-card` with `h-1 bg-accent` bar); name + `@handle` + rank; bio `line-clamp-2`; meta; social buttons; XP bar (animated accent fill); actions + share. | FROZEN |
| `CoursesModule` / `LabsModule` / `TrophyCabinet` / `AchievementsSection` | default | each = `ModuleHeader` + grid of SVG-logo tiles (`rounded-xl border border-border/50 bg-bg-card p-4 hover:scale-[1.02]`) with rarity styles; uses SVG logos (HpbAvatar/BootcampBadge/CpLogo/CourseBadge/XO...) NOT lucide (per rules). | |
| `ActivityTimeline` | default | `rounded-2xl border bg-bg-card`; vertical line `left-[15px] w-px bg-border/30`; icon dots or SVG logos per event; relative timestamps; staggered motion. | |
| `ContributionCalendar` | default | GitHub-style SVG heatmap `52×7`, cells tinted `bg-accent/5→bg-accent`, today `stroke-accent`, tooltips, legend. Props `{activityDates, totalDays?=365}`. | |
| `AchievementCard` | types/constants only | file holds `Achievement` type + `RARITY_STYLES`, `TYPE_ICONS`, `TYPE_COLORS` (no component). | imported by AchievementsSection |

---

## 9. Leaderboard components

Location: `src/shared/components/leaderboard/` (barrel `index.ts`).

- **`LeaderboardRow`** (default): `<Link to={/@handle}>`, grid `grid-cols-[36px_1fr] md:[48px_1fr_140px_100px_80px]`; rank `Medal` with `TOP_THREE_COLORS` (top-3) or number; operator block = `Identicon` + handle + `BootcampBadge` + "You" chip; desktop rank badge / CP / streak; current-user row `border-accent/40 bg-accent-dim/10`.
- **`PodiumCard`** (default): vertical podium card `rounded-2xl border + glow + bg-bg-card p-6 md:p-8 h-full`; rank medal/crown; `Identicon`; handle + badge; org; CP. **⚠ Uses some raw color chips (text-gray-300, text-amber-600) — audit debt.**
- **`RankBadge`** (default): `<span class="text-[10px] font-black uppercase tracking-widest {RANK_COLORS[label]}">`. Used internally by LeaderboardRow.
- **`useLeaderboard`** (data hook): returns `{entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore, ...}`; fetches `/public/leaderboard`.

---

## 10. Brand / badge / decorative components

- **`Logo` / `QyvoraLogotype` / `QyvoraMark`** — `shared/components/brand/`: site logo/wordmark/mark. `Logo` has `size` ("xl" etc.) + `variant` ("mark") props.
- **`CpLogo`** — `shared/components/CpLogo.tsx`: CyberPoints coin SVG glyph. Used in CP badges, stat icons, market pricing, profile.
- **`ChainLogo`**, **`HpbAvatar`** (bootcamp phase avatar), **`BootcampBadge`** (completion badge `.webp` when completed), **`LabBadge`**, **`CourseBadge`** (category ring colors), **`StreakIcon`** (`getStreakLevel(days)`), **`AthenaBoxes`** (animated accent glyph), **`HpbAvatar`** sub-avatars (`AdyeiwaaAvatar`, `AwariAvatar`, `MawusiAvatar`, `NiiAvatar`, `TeteAvatar`).

**Course / lab icon map:** `src/shared/components/icons/course-icons/` (`BurpSuite101Icon`, `LinuxTerminal101Icon`, …, barrel `index.ts`), referenced via `COURSE_ICON_MAP`.

---

## 11. Marketing landing sections

Location: `src/features/marketing/components/landing/`. Each is a self-contained `PublicSnapSection` composition, ordered in `src/features/marketing/pages/LandingPage/index.tsx`.

| Section | File | Purpose / composition |
|---|---|---|
| `LandingHeroSection` | `LandingHeroSection.tsx` | full-viewport hero: `HackerGlobe` + `GridBoxedBackground` + Badge + giant h1 (accent span) + sub + CTA + mobile CTA `mt-auto`. `mask` variant. |
| `LandingCoursesSection` | `LandingCoursesSection.tsx` | full-section `Carousel`/`DragMarquee` of `CourseCard`s; `min-h-dvh my-auto overflow-x-clip line-clamp-*`. |
| `LandingLabsSection` | `LandingLabsSection.tsx` | drag marquee of `LabCard`s + `DottedMapOverlay`. |
| `LandingServicesSection` | `LandingServicesSection.tsx` | enterprise services cards + `DottedMapOverlay`. |
| `LandingPillarsSection` | `LandingPillarsSection.tsx` | platform pillars with dotted overlay. |
| `LandingSimulationsSection` | `LandingSimulationsSection.tsx` | terminal/IDE/network sim previews. |
| `LandingBootcampSection` | `LandingBootcampSection.tsx` | HPB bootcamp promo. |
| `LandingTeamSection` | `LandingTeamSection.tsx` | drag marquee of team members. |
| `LandingBlogsSection` | `LandingBlogsSection.tsx` | `Carousel` of blog cards. |
| `LandingMarketSection` | `LandingMarketSection.tsx` | zero-day market products (`AuthImage` covers). |
| `LandingLeaderboardSection` | `LandingLeaderboardSection.tsx` | `LeaderboardRow`s + `FilterTabs` + `ErrorState`. |
| `LandingFinalCtaSection` | `LandingFinalCtaSection.tsx` | closing CTA (last snap, no Footer). |
| `LandingOpenSourceToolsSection` | `LandingOpenSourceToolsSection.tsx` | drag marquee of open-source tools. |
| `LandingQuiteRootSection` | `LandingQuiteRootSection.tsx` | research collective promo. |
| `ActDividerSection` | `ActDividerSection.tsx` | `Carousel` act divider. |
| `HeroGridAnimation` | `HeroGridAnimation.tsx` | animated hero grid decoration (helpers in `helpers.ts`). |

Composition primitives also in `src/features/marketing/components/`: `CoursesCarousel`, `LabsCarousel`, `ToolsCarousel`, `HackerGlobe` (+`hacker-globe/` with `useFluidGlobe`, `countries.ts`), `ContactModal`, `ServiceRequestModal`, `ToolInstallModal` (exports `openToolInstall`), and tool-page chemistry (`ToolSourceSection`, `ToolSectionHeader` with `text-kicker` + `text-3xl md:text-5xl lg:text-7xl font-black` title, `ToolModulesSection`).

---

## 12. Full pages & page-level composite components

### Public pages (`src/features/marketing/pages/`)
- **`LandingPage`** (`.../LandingPage/index.tsx`): composes all landing sections.
- **`CoursesPage`**: `StudentHeroSection` + `CourseCollection` (filter strip + grid/carousel of `CourseCard`). `/courses`.
- **`LabsPage`**: hero + `LabCollection`/`LabCard`. `/labs`.
- **`MarketPage`**: hero + `ProductCard` grid (`CourseCollection` wrapper). `/zero-day-market`.
- **`CyberCoinPage`**: CP economy explainer. `/cp`.
- **`HpbPage` / `HpbPhasePage`**: bootcamp landing + per-phase. `/hpb`, `/hpb/phases/:phaseId`.
- **`TeamPage` / `ServicesPage` / `ServiceDetailPage` / `BasicPentestPage` / `EmployeeBootcampPage` / `StandardPentestPage`**: team + services.
- **`SimulationsPage` / `SimulationPage`**: sim demos (`/simulations/terminal|ide|network-visualizer`).
- **Open-source tool pages**: `AnansiPage`, `Toha3eePage`, `ShakaPage`, `NzingaPage`, `JabariPage`, `AksumPage` — composed from `ToolDoc*` + `Tool*Section` with data from `anansiData.ts` etc.
- **`PublicProfilePage`**: profile → `ProfileIdentityBlock` + `ProfileMetricsStrip` + modules + `ActivityTimeline` + `ContributionCalendar`.
- **`BlogsPage`** + `BlogPostPage` (+ 8 blog content components): blog listing (grid/expanded + `CardCollection`) and post rendering with blog-styled headings.
- **Pub cards:** `CourseCard`, `LabCard`, `ProductCard`, `BlogCard`, `RoomSection` (in `.../public/cards/`).

### Card wrapping (marketing)
- `CourseCard`: wraps `LearningCard` `type="course"` + `CourseBadge`, `to={/courses/${id}}`, duration `${min}min`, `cpReward={cpCost}`, action "Start Course".
- `LabCard`: wraps `LearningCard` `type="lab"`, `to={lab.route}`.
- `ProductCard`: market product; `AuthImage` cover, `CpLogo` price, "Intelligence Asset" tag; grid/expanded; logged-in vs login CTA.
- `BlogCard`: link card with tags/author/readTime, `Read ›` CTA.

---

## 13. Student experience components

Location: `src/features/student/`. Shell = `StudentLayout` (clearance `pt-20 md:pt-24`), `StudentTopbar` (auto-hides on scroll-down, reveals on scroll-up; layout reservation static — slides over content), `StudentNavPanel`.

### 13.1 `StudentTour` + `SpotlightTour` (the onboarding/tour pair)
- **`StudentTour`** (`features/student/components/StudentTour.tsx`): post-onboarding guided tour. Steps: welcome → nav → learning → cp → profile → done, each resolved via `[data-tour-id]` selectors on the live DOM. Auto-triggers via `usePopupManager('onboarding-tour', 2)` or the "Take a Tour" replay button (`qyvora:start-tutorial`). Completing calls `POST /profile/onboarding/complete` only for fresh users. `getTarget` maps responsive selectors (prefers on-screen elements among `tour-cp-desktop|tour-cp-dashboard|tour-cp-mobile`, etc.).
- **`SpotlightTour`** (`shared/components/tour/SpotlightTour.tsx`): the engine. Renders via portal to body at `z-[600]`. Highlights target with `border-2 border-accent rounded-2xl` + mask `boxShadow 0 0 0 9999px rgba(0,0,0,.72)` + accent glow; tour card `bg-bg-card border border-border/50 rounded-2xl p-5 shadow-2xl`, desktop auto-placed around target (with arrow), mobile bottom sheet with grab handle; Skip/Back/Next/Finish; Escape closes; fixed-element targets scroll to top; re-measures on scroll/resize; reduced-motion respected. No target → full `bg-black/70` dim overlay. Props `{open, steps, onClose, getTarget?, labels?, zIndex?=600}`.

### 13.2 Onboarding modal
`StudentOnboardingModal` — 4-step Radix Dialog (Welcome → First Mission → Why Start Here → Register for Bootcamp); `usePopupManager('onboarding', 0)`; server-state authoritative (`onboardingCompletedAt`/`onboardingSkippedAt`); completion navigates to bootcamp.

### 13.3 Student dashboard (`features/student/components/dashboard/`)
`DashboardHero` (mission-control hero), `DailyMissionCard`, `WeeklyOperationCard`, `WeekActivity`, `ActiveDeployments`, `CpEarnHint`, `ProgressionPanel`, `SkillMatrix` (+`SkillRadarChart`, `SkillStats`). Dashboard page composes: welcome hero (`data-tour-id="tour-hero"`) → nav `SectionButton`s (incl. `tour-learning` bootcamps button + replay) → stats `StatCard` row (incl. CP `tour-cp-dashboard`) → skill matrix → section content (conditional).

### 13.4 Bootcamp room & course (`features/student/components/bootcamp-*`, `learning`)
- **bootcamp-course/**: `PhaseHeroSection`, `PhaseSection`, `RoomCard` (supports canvas doodle annotation → localStorage `card_doodle_*`).
- **bootcamp-room/**: `RoomHeader`, `RoomProgress`, `RoomSidebar`, `StepCard` (keyboard nav Arrow/Enter/Space), `StepJumpMenu`, `StepImage`, `CopyButton`, `ImageLightbox` (portal + scroll-lock, wheel zoom 1–5x, drag pan), `QuizModal`, `QuizGateModal`, `ReportIssueModal` (`POST /student/report-issue`, type `bootcamp_room`), `RoomCompletionCelebration`.
- **learning/**: `LearningOverviewCard`, `LearningFilterStrip`.

### 13.5 Simulations (`features/student/components/simulations/`)
- **`SimulationContext`** exports 4 nested contexts: `SimulationProvider`, `useSimulation`, `useDiscovery` (persists `qyvora_discovered_ips`, listens `qyvora:ip-discovered`), `useNetworkProfile`, `useBrowserSim`.
- **`SimulationPanel`** `{simulations:[{type,content,breakout?}], defaultHeight?}`: tabbed panel, expandable `fixed inset-4 z-[200]`.
- Individual simulators (named): `BrowserSimulation`, `HttpInspector`, `EmailClient`, `PacketViewer`, `FileExplorer`, `LogViewer`, `SqlConsole`, `ApiExplorer`, `PasswordCracker`, `NetworkTopology`, `OsintDashboard`, `TimelineInvestigation`, `ProgressiveHints`. Data: `networkProfiles.ts`, `labSimulationContent.tsx`.

### 13.6 Tools (`features/student/components/tools/`)
- **`SimulatedTerminal`**: `TerminalShell` (named, export `clearTerminalStorage`), engine (`state`, `streaming`, `commands`), contexts (`bootcampContent`, `courseContent`, `labContent`), KALI palette consts (`#0c0c0c`, `#00ff41`); Tab completion, Ctrl+U/E/K/A/W/R, history, streaming, persistence `qyvora_terminal_lines`/`qyvora_terminal_state`, dispatches `qyvora:ip-discovered`.
- **`Ide`**: VS Code-style editor sim (`IdeBlock`, hex syntax colors).
- **`NetworkBuilder`** + **`network/`**: full network topology builder (`DeviceNode`, `NetworkEdge`, `packetEngine`, `trafficEngine`, `topologyStore`, `useSmartConnection`, `useTrafficSimulation`, `ContextMenu`, `DeviceLeds`, `DeviceHoverCard`, `ConnectionMediumModal`).
- **`ToolChooserModal`**: "Open in Panel" vs "Open Fullscreen".

---

## 14. Component matrix (who uses what)

| Area | Primary components used |
|---|---|
| **Student dashboard** | `StatCard`, `SectionButton` (local), `DashboardHero`, `DailyMissionCard`, `WeeklyOperationCard`, `WeekActivity`, `ActiveDeployments`, `CpEarnHint`, `ProgressionPanel`, `SkillMatrix`, `LearningCard`, `FadeIn`, `ErrorState`, `StudentOnboardingModal`, `StudentTour` |
| **Admin** | `StatCard`, `DataTable`, `Skeleton`, `ErrorState`, `Badge`, `Tooltip`, `Dialog`/`ConfirmDialog`, `SyncIndicator`, `AuthImage`, `BottomSheet` | 
| **Marketing landing** | `PublicSnapSection`, `ScrollReveal`, `HackerGlobe`, `Carousel`, `DragMarquee`, `DottedMapOverlay`, `LearningCard`/`CourseCard`/`LabCard`, `FilterTabs`, `LeaderboardRow`, `ErrorState`, `Skeleton` |
| **Public collections** | `CardCollection`, `ViewToggle`, `BatchPagination`, `Carousel`, `LearningCard` wrappers |
| **Courses/labs/bootcamp learning** | `LearningToolbar`, `LearningNav`, `StepRenderer`, `StepNumberHeader`, `LearningAccordion`, `LabPage`, `TerminalWrapper`, `LearningCard` |
| **Student profile** | `ProfileIdentityBlock`, `ProfileMetricsStrip`, `ModuleHeader`, `CoursesModule`, `LabsModule`, `TrophyCabinet`, `AchievementsSection`, `ActivityTimeline`, `ContributionCalendar` |
| **Public profile** | same profile set + `ShareProfile` |
| **Auth** | `AuthFormLayout`, `Input`, `Button`, `PasswordInput`, `AuthHero`, `AuthImage` |
| **Leaderboard** | `LeaderboardRow`, `PodiumCard`, `RankBadge`, `FilterTabs`, `BatchPagination`, `useLeaderboard` |

---

## 15. Dead / unused components to avoid

These exist but have **no active usage** — don't build on them, and prefer the canonical alternatives:

| Component | Status | Prefer instead |
|---|---|---|
| `CardBase` / `CardMedia` / `CardStat` | exported, unused outside `Card.tsx` | `LearningCard` |
| `StatCounter` | exported, zero usages | `useCountUp` directly or `StatCard` |
| `PageHeader` | defined, no app-page import | `StudentHeroSection` |
| `RankBadge` | only used internally by `LeaderboardRow` | — |
| `DragMarquee` | **not** re-exported from `carousel/index.ts` barrel (inconsistent) | import from its file |

**Audit debt to eventually fix:** `PodiumCard`, `AchievementCard`/`AchievementsSection`, `ActivityTimeline` use some raw Tailwind color names (`text-gray-300`, `text-amber-600`, `text-purple-400`); these should move to semantic tokens per the ESLint `qyvora-local/no-status-palette` + `no-arbitrary-color` rules. Also the `wc-*` widths in this doc come from live `index.css` (authoritative); some older docs list different values.

---

## How to use this document

1. **Choose a component** – find it in the Table of Contents or the matrix (§14). Read its section for the exact class string + props.
2. **Reuse, don't reinvent** – if a primitive exists (`Button`, `Input`, `Skeleton`, `Dialog`, `BottomSheet`, `Badge`, `LearningCard`, `ScrollReveal`, `Carousel`), use it. The AGENTS.md rules forbid introducing new patterns.
3. **Match the visual language** – cards `rounded-2xl`, buttons `btn-*`, accent-only green `#06B66F`, `font-black uppercase tracking` micro-labels, `min-h` touch targets, token utilities only.
4. **Mirror existing implementations** – when unsure, open the file this doc points to and copy its structure.
