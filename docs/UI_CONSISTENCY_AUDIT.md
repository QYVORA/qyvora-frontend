# UI Consistency Audit — qyvora-frontend

**Scope:** entire `src/` (352 `.tsx` / 174 `.ts` components). Original read-only audit snapshot — no source files were modified *at audit time*. Fixes applied afterwards are tracked in **Resolution Status** below.

## Executive Summary

The design system is defined cleanly in `src/styles/index.css` (accent `#06B66F`, elevation steps, JetBrains Mono + Space Grotesk, duration/easing tokens), but actual usage diverges in three compounding ways. **(1) Semantic tokens are bypassed**: despite `--color-*` tokens, components use Tailwind palette classes (`text-red-400`, `bg-yellow-400`, `border-amber-500`…) and raw hex liberally — including inside canonical primitives (`Badge.tsx`, `Button.tsx`, `Input.tsx`, `ErrorState.tsx`, `.btn-danger`, `.badge-beginner`) and in 114 inline `rgb()/rgba()` strings. **(2) Component families are duplicated 2–8×**: buttons exist as `Button.tsx` (used in 8 files), CSS `.btn-*` classes (124 uses), and raw inline `<button>` styles (347 elements); badge styles exist as `ui/Badge`, `badge-*` CSS utilities, and per-card inline maps; card padding/radius drift across `CardBase`, `ScenarioCard`, `StudentBootcampCard`, `StatCard`, `RoomCard`, `LearningCard`. **(3) The type scale is out of band**: `text-[10px]` (495) and `text-[9px]` (382) lead all sizes, `leading-relaxed` (194) is used where the blog/walkthrough token is `leading-[2]`, and there is no single heading scale — page `h1/h2/h3` sizing is picked per file with no source of truth.

---

## Resolution Status

Tracked checklist for the consistency pass. The "before" counts below are the audit snapshot; the current enforcement state is `docs/UI_LINT_BASELINE.md`, driven by the local `eslint-plugin-qyvora-local` rules (`no-status-palette`, `no-arbitrary-color`, both `error` — `npm run lint` exits 1 on the remaining count).

| Commit | Phase | Scope | Result |
|---|---|---|---|
| `92acbd7b` | 0–1 | Context load; fixed 6 primitives to token/button standards (incl. `Button` danger → `bg-danger/10 text-danger`) | start of pass |
| `bd9add7f` | 2 | Local ESLint plugin + `docs/UI_LINT_BASELINE.md` | baseline 372 tokens / 76 files |
| `169f6c5f` | 3 | Type tokens `text-kicker/tiny/overline/micro` in `@theme`; `docs/TYPOGRAPHY.md`; ToolsCarousel `h3`→`h2`; PublicProfilePage h1; kicker migration | lint 372 unchanged |
| `b96d4295` | 4 | Radius/spacing: all 4 `rounded-3xl` eliminated; ScenarioCard/StudentBootcampCard `p-4 md:p-5` | lint 372 unchanged |
| `a103b66a` | 5 | `Button` gains `to/href/external` link rendering; EmptyState + Dialog CTAs on `<Button>` (destructive variant); ScenarioCard difficulty → `badge-*` classes; shared `Skeleton` fill → `bg-bg-elevated` | baseline 362 (334 + 28) |
| `b1cf68c4` | 6 | Removed `useNavInvert` hook + 16 `data-nav-invert` attrs; deleted dead `PublicBottomNav`/`GoCodeCarousel`; `PublicHeroSection` drops banned `lg:h-dvh` | lint 362; tests: 10 pre-existing failures / 186 pass |

**Still open (flagged; no churn without product QA):**
- Bulk migration of `text-[10px]`/`text-[9px]`/`text-[11px]`/`text-[8px]` to the new micro type tokens (§3, ~900+ sites).
- Remaining palette classes counted in the 362 baseline must be driven to 0 for a clean lint, incl. `ui/Badge.tsx`, `Input` error state, `ErrorState`, `PageHeader` danger, `.btn-danger`/`.input-error`/difficulty badges in `index.css`, and the data-layer maps (partial allowlist).
- `ui/Input` adoption: standard login/register fields already use it; terminal/console-style fields (`CodePlayground`, `ServiceRequestModal`, admin query boxes) stay raw surfaces by design.
- `Skeleton` adoption: shared primitive now shares the surface fill; `StudentSkeletons` local `S` delegation + ~24 inline `animate-pulse` sites deferred.
- Icon size token (§7, 10 distinct `size=` values) and arbitrary breakpoints §8 (`min-[400px]`×7, `min-[420px]`×2, `min-[380px]`×2, CSS `max-width: 360px`) — need visual QA before standardizing.
- `ScenarioCard`/`StudentBootcampCard` `aspect-square` vs AGENTS `aspect-[16/9]` — open decision.

---

## 1. Color

### 1.1 Token definition (source of truth, `src/styles/index.css` `@theme`)

| Token | Value |
|---|---|
| `--color-bg` | `#000000` |
| `--color-bg-card` / `--color-bg-elevated` / `--color-bg-alt` | `#050505` / `#0b0b0b` / `#080808` |
| `--color-accent` / `--color-accent-rgb` | `#06B66F` / `6, 182, 111` |
| `--color-on-accent` | `#000000` |
| `--color-text-primary` | `#EEF0EE` |
| `--color-text-secondary` / `--color-text-muted` | `rgba(238,240,238,.70)` / `.40` |
| `--color-border` / `--color-border-strong` | `rgba(171,181,192,.18)` / `rgba(6,182,111,.26)` |
| semantic status tokens | `--color-success/warning/danger/info`, difficulty classes `badge-*` |

### 1.2 Forbidden color

`#66B870` — **absent from `src/`**. The "never `#66B870`, never another green" rule holds at the literal level, but adjacent greens ARE used via palette classes instead: `text-green-400` (22), `bg-green-400` (15), `text-emerald-*`, `#22c55e` (17 direct hex), `#10b981`, `border-green-400/*`.

### 1.3 Raw hex in `.tsx` (outside documented exceptions)

3269 hex matches; 3044 of those live in the 5 hpb avatar illustration files (`HpbAvatar.tsx` variants) — treated as data/graphics, not design tokens. Top non-exception hex:

| Hex | Count | Hex | Count |
|---|---|---|---|
| `#06b66f` | 37 | `#0ea5e9` | 9 |
| `#f59e0b` | 21 | `#fbbf24` | 8 |
| `#22c55e` | 17 | `#3b82f6` | 8 |
| `#999` | 13 | `#334155` | 8 |
| `#3c3c3c` | 13 | `#0c0c0c` | 8 |
| `#ccc` | 11 | `#333` | 7 |
| `#1e1e1e` | 10 | `#007acc` | 7 |
| `#ef4444` | 9 | `#e5c07b` `#dc2626` `#c678dd` | 6 each |

Plus ~50 one-offs. **`#ef4444` / `#dc2626` = the `--color-danger` hue, hard-coded instead of the token.**

### 1.4 Tailwind palette classes (bypassing semantic tokens)

| Class | n | Class | n |
|---|---|---|---|
| `text-red-400` | 103 | `border-red-400` | 26 |
| `bg-red-400` | 49 | `bg-red-500` | 26 |
| `text-yellow-400` | 41 | `text-green-400` | 22 |
| `bg-yellow-400` | 30 | `bg-blue-400` | 21 |
| `text-blue-400` | 29 | `text-amber-400` | 19 |
| `border-yellow-400` | 17 | `border-red-500` | 17 |
| `bg-green-400` | 15 | `border-amber-500` | 10 |
| `bg-amber-500` | 10 | `text-purple-400` | 9 |
| `border-blue-400` | 8 | `text-orange-400` | 6 |

Highest density files: `AchievementsSection.tsx` (15), `SettingsPage.tsx` (13), `HttpInspector.tsx` (12), `AchievementCard.tsx` (11), `KillChainDiagram.tsx` (11), `ApiExplorer.tsx` (11), `WalkthroughStep.tsx` (9), `PodiumCard.tsx` (9), `NetworksPage` (7), `BrowserSimulation` (7), `JabariPage` (7), `InlineQuiz` (6), `ToastContext` (5), `ui/Badge.tsx` (4).

Status semantics (`success/warning/danger/info`) are the most common palette substitution — these map 1:1 to existing `--color-*` tokens that are never referenced by components.

### 1.5 Token drift inside canonical primitives

| Component | Location | Value |
|---|---|---|
| `ui/Button.tsx` danger | `:28` | **RESOLVED** (Phase 1/5): `bg-danger/10 text-danger border-danger/40` |
| `ui/Input.tsx` error | `:22,31` | `border-red-500/60 focus:border-red-400` + `text-red-400` |
| `ui/Badge.tsx` | `:15-18` | success/warning/danger/info = `green-400/yellow-400/red-400/blue-400` |
| `ui/ErrorState.tsx` | `:30,33-34` | `border-red-400/30 bg-red-400/5`, `text-red-400`, `text-red-400/70` |
| `dashboard/PageHeader.tsx` | `:24` | danger variant `bg-red-500/10 text-red-400` |
| `index.css` `.btn-danger` | `:584` | **RESOLVED** (Phase 1): `bg-danger/10 text-danger border-danger/40` |
| `index.css` `.badge-beginner` | `:592` | **RESOLVED** (Phase 1): uses `--color-difficulty-*` tokens |
| `index.css` `.input-error` | `:562` | **RESOLVED** (Phase 1): `color-mix(in srgb, var(--color-danger) 70%, transparent)` |

Because the shared primitives themselves hard-code palette colors, the token set is effectively dead — consumers imitate the primitives rather than the tokens.

### 1.6 Inline `rgb()/rgba()/hsl()` in `.tsx`

114 matches (`rgb_tsx.txt`), e.g. `bg-[rgba(...)]`, `border-[...rgb...]`, `shadow-[0_..._rgba(0,0,0,0.2)]`, `rgb(255 0 0 / 0.1)`.

### 1.7 Documented / acceptable exceptions (used as intended)

- Avatar illustrations — `HpbAvatar.tsx` variants (3044 hex).
- Terminal / IDE mocks — `LandingSimulationsSection.tsx` (`#2a2a2a #0c0c0c #1a1a1a #d4d4d4 #569cd6 #00ff41`), `TerminalToolPage.tsx`, `CodePlayground.tsx`.
- Syntax highlighting — `CodeBlock.tsx` (`#e5c07b #d19a66 #c678dd #56b6c2 #61afef`), `Ide.tsx` / `IdeBlock.tsx` VS Code colors.
- Network / brand graphics — `ShareProfile.tsx` (`#0A66C2 #25D366`), GitHub language colors (`#f1e05a #e81123 #f7df1e #00ADD8`).
- Data-layer semantic color mapping — `student/constants/labs.ts`, `bootcampStructure.ts`, `KillChainDiagram.tsx`, `LinkStateIndicator.tsx`, `NetworkBuilder.tsx`, `CpAnalytics.tsx`.

---

## 2. Spacing

### 2.1 Arbitrary dimension classes (bypass the spacing scale)

| Value | Count |
|---|---|
| `w-/h-/min-h-[44px]` | 51 |
| `[420px]` | 11 |
| `[200px]` | 11 |
| `[360px]` | 10 |
| `[220px]` | 10 |
| `[280px]` | 9 |
| `[48px]` | 8 |
| `[120px]` | 8 |
| `[460px]` | 7 |
| `[80px]` `[320px]` | 6 |
| `[480px]` `[400px]` `[180px]` `[140px]` | 5 |
| `[9px]` `[640px]` `[240px]` | 4 |

Plus one-offs up to `[1400px]`. These substitute for missing grid/width tokens but cover a wide spread — the same "card width" is expressed as `max-w-[420px]`, `w-[420px]`, `w-[480px]`, `[360px]`, `[400px]` depending on file.

### 2.2 Card interior padding drift

| Card | Padding |
|---|---|
| `ui/Card.tsx` `CardBase` | `p-4` (+ shared `terminal-card`) |
| `LearningCard.tsx` | `p-4 md:p-5`, `min-h-[220px]` |
| `ScenarioCard.tsx` and `StudentBootcampCard.tsx` | `p-4 md:p-5` (**RESOLVED** Phase 4; was `p-3 md:p-5`) |
| `dashboard/StatCard.tsx` | `p-5` |
| `RoomCard.tsx` | custom canvas layout |
| `dashboard/PageHeader` CTA container | `gap-6` |

### 2.3 Radius scale

`rounded-xl` (408) is the most common, then `rounded-lg` (286), `rounded-2xl` (264), `rounded-full` (196), plus `rounded-sm` (8), `rounded-[4px]`. **Docs (`DESIGN_SYSTEM.md`) say: cards/modals `rounded-2xl`, buttons/inputs `rounded-xl`, badges `rounded-lg`/`rounded-full`. Audit-time violations:** `LearningCard` used `rounded-lg` (card surface — **RESOLVED**, now `rounded-2xl`); `rounded-3xl` appeared 4× (**RESOLVED** Phase 4, all → `rounded-2xl`); re-check of `WalkthroughLayout`/`NetworkBuilder` found their card-like wrappers already `rounded-2xl` (remaining `rounded-lg` are badges/pills/inputs — in scale).

Touch targets are compliant: dialog close `min-h-[44px] min-w-[44px]` (`Dialog.tsx:118`), mobile `btn-*` `min-height: 44px` (`index.css:676`).

---

## 3. Typography

### 3.1 Scale usage (counts)

Sizes: `text-sm` (413), `text-xs` (338), `text-base` (131), `text-lg` (81), `text-3xl` (52), `text-2xl` (51), `text-xl` (46), `text-5xl` (46), `text-4xl` (34), `text-6xl` (17), `text-7xl` (11).

Weights: `font-black` (901), `font-bold` (236), `font-semibold` (2), `font-extralight` (2), `font-medium` (1) — **bold is used as a secondary weight almost everywhere `font-black` should be** (docs: headings always 900; many UI labels are `font-bold`).

Arbitrary sizes: `text-[10px]` (495), `text-[9px]` (382), `text-[11px]` (94), `text-[8px]` (57), `text-[7px]` (16), `text-[13px]` (7), `text-[12px]` (3). **The two most-used text sizes in the app are arbitrary (10px, 9px)** — a strong candidate for explicit tokenization.

Leading: `leading-relaxed` (194) is the default body/metric string everywhere; the walkthrough/blog tokens `leading-[2]` (27) / `leading-[2.2]` (12) are used strictly inside walkthrough narrative. Tight headers use `leading-tight` (53), `leading-none` (40), `leading-snug` (39) plus arbitrary `[1.05]` (10), `[1.1]` (6), `[1.08]` (5), `[.95]` (2).

Tracking: `tracking-widest` (549), `tracking-wider` (78), `tracking-tight` (73), `tracking-tighter` (40), `tracking-[0.3em]` (31), `tracking-wide` (24), `tracking-[0.25em]` (22), `tracking-[0.2em]` (20).

### 3.2 Heading hierarchy has no single source of truth

`h1` (page titles):

| Component | Size |
|---|---|
| `AuthForm.tsx:94,157`, `LoginPage.tsx:141`, `ResetPasswordConfirmForm.tsx:27`, `ChangePasswordForm.tsx:28` | `text-3xl md:text-4xl lg:text-5xl` (uppercase, `tracking-tighter`) |
| `dashboard/PageHeader.tsx` | `text-4xl md:text-6xl` |
| `StudentHeroSection.tsx:40-41` `PUBLIC_HERO_TITLE_CLASS` | `text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.08]` |
| `LandingHeroSection.tsx:159`, `TermsHeroSection.tsx:10` | no size class at all (`leading-[1.08]`, inherits) |
| `RoomHeader.tsx:42` | `text-3xl sm:text-3xl md:text-4xl lg:text-5xl` |
| `ToolDocHero` | `text-4xl md:text-6xl lg:text-7xl leading-[0.95]` |
| `PublicProfilePage.tsx:108` | `text-4xl md:text-6xl` (**RESOLVED** Phase 3; was `text-3xl`) |

`h2` (section titles): `text-5xl` (31), `text-3xl` (28), `text-2xl` (18), `text-4xl` (11), `text-lg` (9 — carousel inline heads `LandingCoursesSection.tsx:72`, `LabsCarousel`, `ToolsCarousel`), `text-7xl` (9), `text-xl` (8), `text-6xl` (8), `text-sm` (1).

`h3` (cards/kickers): `text-sm` (55), `text-base` (36), `text-lg` (25), `text-xl` (18), `text-2xl` (12), `text-xs` (9), `text-3xl` (5), `text-4xl` (4), `text-6xl`/`text-5xl` (1). **`h3` used as the section title in `ToolsCarousel.tsx:126`** (`text-4xl md:text-5xl lg:text-6xl` — a card title at hero scale is a semantic inversion) — **RESOLVED** Phase 3: now an `h2`.

The `ToolSectionHeader.tsx:19` / `ServiceDetailPage.tsx:85` split-screen heading (`text-3xl md:text-5xl lg:text-7xl`) matches the documented pattern; everything else drifts.

### 3.3 Kickers/eyebrows (compliant)

`text-[10px] font-black uppercase tracking-[0.3em] text-accent` is the canonical kicker (`ServiceDetailPage`, `PhaseHeroSection.tsx:48`, `DashboardHero.tsx:41`). Some pages use `tracking-widest` (tool-doc section headers, `JabariPage.tsx:171`) or `text-[11px]/text-[9px]` — a narrower 3-way variant class. Phase 3 added token equivalents `text-kicker`/`text-tiny` (`@theme`), applied to AuthForm labels + RoomHeader back-link; bulk migration of remaining `text-[10px]/[9px]` kicker sites is an open sweep.

### 3.4 Walkthrough / blog rules — mixed compliance

- Walkthrough body uses `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]` — followed.
- Walkthrough headings **do not** use the documented blog heading classes everywhere: `CodeBlockRenderer`/`StepRenderer` headings drift from `text-2xl md:text-4xl ... uppercase font-black` toward inline `text-lg`/`text-xl`.
- `wc-prose` is **not** used for walkthrough reading text (only `wc-code`/`wc-terminal`/`wc-table`/`wc-media`/`wc-interactive`) — the "full-width text" rule is followed.

---

## 4. Component Duplication

### 4.1 Buttons — three parallel systems

| System | Usage count |
|---|---|
| `ui/Button.tsx` component (variants primary/secondary/danger/ghost) | **8 files** (`SettingsPage`, `ServiceRequestModal`, `ContactModal`, `EditModal`, `ErrorBoundary`, `CoursePurchaseModal`, `EmptyState`, own file) |
| CSS `.btn-primary` / `.btn-secondary` / `.btn-danger` (`index.css:563-583`) | 124 class usages |
| Raw `<button>` with inline styles | 347 elements |

The CSS `.btn-*` classes are byte-for-byte the same as `Button.tsx` variants — two implementations of one button. Mixed usage inside one component was `EmptyState.tsx` (`<Button>` line 30 *and* `className="btn-primary"` line 24) and `Dialog.tsx:175,184` (raw `btn-secondary` + inline destructive classes instead of `<Button variant="danger">`) — **RESOLVED** Phase 5: `Button` now accepts `to/href/external` (renders router `Link`/anchor), EmptyState and Dialog CTAs are all on `<Button>`, and the Dialog destructive variant maps to `variant="danger"`. `.btn-*` CSS classes remain sanctioned for raw CTAs. Custom local button styles still exist (`StudentBootcampCard` `BtnBase`, `StepCard`, `RoomCard`, `CopyButton`, plus `hover:scale` variants).

### 4.2 Badges — four parallel systems

| System | Notes |
|---|---|
| `ui/Badge.tsx` (6 variants, sizes sm/md) | uses palette colors, tiny type `text-[9px]/[10px]` |
| `.badge-beginner/-intermediate/-advanced/-accent/-muted` CSS | `index.css:586-600`; difficulty + status |
| `ScenarioCard.tsx` `DIFFICULTY_STYLES` | inline `green-400/yellow-400/red-400` static map — **RESOLVED** Phase 5: maps to `badge-beginner/-intermediate/-advanced`, fallback `badge-accent` |
| `LearningCard.tsx` `DifficultyBadge`, `LabBadge`, `CourseBadge`, `WalkthroughStep` inline | per-component difficulty markup |

### 4.3 Cards — extended family with drift

`CardBase`/`CardMedia`/`CardStat` (`ui/Card.tsx`, `terminal-card`), `LearningCard` (`p-4 md:p-5`, `rounded-lg`), `ScenarioCard` (`aspect-square`, `card-accent`), `StudentBootcampCard` (`p-3 md:p-5`, `aspect-square`), `StatCard` (`p-5`), `RoomCard` (custom canvas), `ProductCard`/`BlogCard` (`hover:scale-105`, used in carousels), plus inline homepage cards. `CoursesCarousel`/`LabsCarousel` use `max-w-[420px]`; `LabsCarousel`/`ToolsCarousel` slide heights rely on `line-clamp-*` (`line-clamp-2` ×33, `line-clamp-3` ×14).

### 4.4 Headers/Hero units

`PageHeader`, `SimpleHeading`, `StudentHeroSection`/`PublicHeroSection`, `LandingHeroSection`, `ToolDocHero`, `PhaseHeroSection`, `DashboardHero`, `AuthHero` + `AuthFormLayout`, `TermsHeroSection`, `ToolDocTopbar`. Pagination/periods different → the h1 size table in §3.2. `SimpleHeading` (accentWords / accentPlacement) and `PageHeader` (title + back/nav + CTAs) overlap.

### 4.5 Modals/Dialogs

Radix `DialogContent` + `BottomSheet` exist. **Inline / non-Shared implementations:** `ToolChooserModal.tsx`, `ConnectionMediumModal.tsx`, `QuizGateModal.tsx` / `QuizModal.tsx` / `ReportIssueModal.tsx`, `ToolInstallModal.tsx`, `ServiceRequestModal.tsx`, `ContactModal.tsx`, `CelebrationModal.tsx`, `ImageLightbox.tsx`, `SpotlightTour.tsx`, `MobileNotificationsSheet`/`MobileProfileSheet` (use `BottomSheet` — good), admin `MobileMoreSheet`. `Dialog` is imported in 15 files. `DialogContent` header/title uses `text-xs sm:text-sm ... tracking-widest` + description `text-sm text-text-muted` — that pattern is not replicated by inline modals.

### 4.6 Inputs

`ui/Input.tsx` (icon slot, error `aria-invalid`, `role="alert"`) vs many raw `<input className="w-full bg-bg-card border border-border rounded-xl py-3 px-4 ...">` re-implementations (login/register form fields, search bars, `CodePlayground`). Raw variants also add focus styles manually and often skip `<label htmlFor>`.

### 4.7 Feedback states

`ui/ErrorState.tsx` (severity/bare, hard-coded red) and `dashboard/EmptyState.tsx` (uses `Button` + `btn-primary`), but inline empty/error divs appear across `MarketplacePage`, `NetworksPage`, `LabsPage`, `BootcampRoomPage`, `CompetitivePage`.

### 4.8 Skeletons — shared primitive unused

`ui/Skeleton.tsx` exists (variants text/card/icon/image/title/stat-value, `animate-pulse bg-bg-elevated` — **RESOLVED** Phase 5, was `bg-border/30`, now matches the shared surface token) but **adoption is low**: only `StatCard` consumes it from the barrel; actual loading UIs come from `StudentSkeletons.tsx` (12 custom components) plus ~24 files with ad-hoc inline `animate-pulse`. `StatCardSkeleton` is embedded in `StatCard.tsx:35-43`. Cross-component consolidation of `StudentSkeletons` onto the shared primitive is an open sweep.

### 4.9 Carousels / pagination

Shared `carousel/Carousel.tsx` + `DragMarquee` + legacy `CoursesCarousel`/`LabsCarousel`/`ToolsCarousel` (full-section, `max-w-[420px]`) + `GoCodeCarousel` (present but unmounted). `useAutoPlay`, `useReducedMotion`, ArrowLeft/Right handled in shared carousels.

---

## 5. Motion

### 5.1 Durations

CSS: `duration-300` (76), `duration-200` (42), `duration-500` (18), `duration-700` (12), `duration-150` (10), `duration-100` (2). The `--dur-*` tokens (160/260/420 ms) are only referenced by `Button.tsx:42` (`duration-[var(--dur-base)]`). framer-motion: 0.5 (34), 0.4 (15), 0.2 (15), 0.6 (7), 0.15 (7), 0.35 (5), 0.25 (5), 0.8 (4), 0.42 (2).

### 5.2 Easings

Canonical `[0.22, 1, 0.36, 1]` (smooth) in 6+ files; expo-out `[0.16, 1, 0.3, 1]` in 11 files (landing + Navbar `ease-[cubic-bezier(0.16,1,0.3,1)]`); `--ease-smooth` token referenced only by `Button.tsx:42`. Carousel easing `[0.25, 0.46, 0.45, 0.94]` in shared carousels only.

### 5.3 Transition properties

`transition-colors` (283) dominates; `transition-all` (226), `transition-transform` (45), `transition-opacity` (6), `transition-[filter]` (6), `transition-[background-color]` (4), `transition-[border-color]` (1). Docs prefer scoped transitions; `transition-all` is common on interactive tiles (accepted convention in cards).

### 5.4 Micro-interactions

`active:scale-95` in `Button.tsx:24`, `StudentTopbar`, `LearningToolbar`, `ConsentBanner`, `Footer`, `PublicBottomNav`; `hover:scale-105` in `RelatedContentSection`, `ProductCard`, `BlogCard`, `ToolDocTopbar`, `Navbar`, `CommunityPopup`.

### 5.5 Reduced motion — layered correctly

`MotionConfig` in `App.tsx` + `useReducedMotion` in 31 files + 3 `@media (prefers-reduced-motion: reduce)` blocks in CSS. `ScrollReveal` (preferred) used across landing/public pages; hand-rolled `motion.div` reveals elsewhere (interior public pages).

---

## 6. Layout

### 6.1 Layout shells

| Layout | Structure | Notes |
|---|---|---|
| `LandingLayout.tsx` | scroll-snap, no padding shell | Public marketing + terms; mobile `PublicBottomNav` referenced only in comments (unmounted) |
| `ToolDocLayout.tsx` | tool docs (no public navbar) | |
| `StudentLayout.tsx` | `pt-20 md:pt-24` topbar shell | `:16` — terminal/IDE/network modal hosts; walkthrough handled via `InternalTerminal` |
| `AdminLayout.tsx` | `pt-20 md:pt-24` + bottom-nav clearance | forced dark `data-theme-persist="dark"` |
| `AuthFormLayout.tsx` | 2-col grid, globe pinned bottom-right | standalone, `min-h-dvh` |

Public pages all run under `LandingLayout` (scroll-snap). `PublicSnapSection.tsx` uses the canonical `min-h-dvh snap-section ... my-auto` wrapper (`:31-33`) — compliant. **Violation:** `PublicHeroSection.tsx:25` default branch used `min-h-dvh lg:h-dvh overflow-hidden` (the AGENTS rule bans fixed `h-dvh` on content sections; only the `scrollable` variant is `min-h-dvh`) — **RESOLVED** Phase 6: default branch is now `min-h-dvh overflow-hidden`.

Padding: public sections `px-3 md:px-4 lg:px-6` (`PublicSnapSection.tsx:31`); topbar clearance `pt-20 md:pt-24`; snap sections `pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12`.

### 6.2 Width constraints — `wc-*` vs arbitrary `max-w-*`

`wc-*` utilities used sparingly (`wc-terminal`×3, `wc-diagram`×3, `wc-interactive`×3, `wc-code`×2, `wc-table`, `wc-media`). Arbitrary/standard max-widths appear widely, incl. page content: `max-w-xl` (28), `max-w-lg` (20), `max-w-2xl` (17), `max-w-md` (12), `max-w-sm` (6), `max-w-[420px]` (5), plus `[200px]`–`[720px]`/`[1400px]` one-offs. The "no `max-w-*` on page-level containers / no ad-hoc max widths" rule is not enforced consistently.

### 6.3 Snap behavior

`snap-section` → 18 files, `snap-container` → 4 files. Public pages use one snap section per viewport with `line-clamp-*` and `my-auto` where required.

### 6.4 Reintroduced patterns (AGENTS "Do Not Reintroduce")

- **`useNavInvert` + `data-nav-invert`** — **RESOLVED** Phase 6: hook + test deleted, all 16 attributes removed (13 files). Was: hook file + 13 files with the attribute (incl. 3 in `DashboardHero.tsx`, plus `AuthFormLayout`, `NotFoundPage`, 9 landing sections, `LearningOverviewCard`).
- `PublicBottomNav.tsx` — **RESOLVED** Phase 6: file deleted + barrel export removed (was unmounted, comments only). `GoCodeCarousel.tsx` — **already gone** at `src/shared/components/` (unmounted, deleted Phase 6; audit path `landing/` was stale).
- `WalkthroughToolbar.tsx` — exists, not mounted in `StudentLayout` (rule held: no dual toolbar).

---

## 7. Icons

- `lucide-react`: **171 files**; custom `@/shared/components/icons`: **121 files**; no other icon libs. Both systems are mixed inside single components (e.g. `PhaseHeroSection.tsx` imports lucide `ListChecks` *and* custom `IconCheck`/`IconLock`).
- `size=` prop distribution: 14 (103), 12 (77), 20 (74), 16 (57), 10 (28), 18 (14), 13 (12), 24 (10), 11 (10), 32 (7), 36 (6), 22 (5), 15 (4), 44 (3), 400 (2 — `Dobia`), 40 (2), 28 (2), 9 (1), 64 (1).
- Dimension classes: `w-4 h-4` / `w-5 h-5` / `w-3.5 h-3.5` / `w-6 h-6`… with the same size used both ways (`w-4 h-4` in `NetworksPage`, `size={16}` in `WalkthroughStep` icon examples). `StatCard.tsx` uses `size={12}` with `w-3 h-3` trends; `ToolDocTopbar` uses `!w-7 !h-7` overrides.
- No unified icon-size token: sizes are chosen per feature (~10 distinct sizes).

---

## 8. Breakpoints

- Standard prefixes are used consistently: `md` is the dominant split (`StudentSkeletons` 71, `DashboardPage` 36 md, `StudentTopbar` 36, `CyberCoinPage` 32 md), then `sm`, `lg`, `xl`, `2xl`.
- **Arbitrary breakpoints:** `min-[400px]` (7, in 4 files — incl. `PUBLIC_HERO_TITLE_CLASS` at `StudentHeroSection.tsx:40`), `min-[420px]` (2), `min-[380px]` (2). `App` router additionally branches Dobia at `min-[420px]`.
- CSS media queries in `index.css` use non-standard boundaries: `min-width: 768px` (`:199`) and especially `max-width: 767px` (×4) + `max-width: 360px` (`:338`) — these wallop in with the `md` breakpoint regime rather than Tailwind's `sm/md` (640/768).

---

## 9. Documentation Cross-Check

### 9.1 `DESIGN_SYSTEM.md`

| Rule (docs) | Verdict | Evidence |
|---|---|---|
| Accent `#06B66F` only, never `#66B870`/other green | **Partial** | `#66B870` absent, but `#22c55e`, `green-400`, `emerald-*` used for "success" everywhere instead of `--color-success` |
| Radius: cards `rounded-2xl`, buttons/inputs `rounded-xl`, badges `rounded-lg`/`full` | **Partial** | `LearningCard`/`WalkthroughLayout`/`NetworkBuilder` cards use `rounded-lg`; `rounded-3xl` ×4 |
| Buttons `btn-primary/secondary/danger` | **Partial** | CSS classes exist but are duplicated by `Button.tsx`; both used interchangeably |
| Semantic status/difficulty tokens | **Violated** | `--color-success/warning/danger/info` unused; palette classes hard-coded, incl. inside `Badge.tsx` |
| Tokens only, no raw hex in components | **Violated** | §1.3 (all non-exception hex) + §1.5 |

### 9.2 `COMPONENT_ARCHITECTURE.md`

Shared primitives listed there (Button, Input, Badge, Card/CardBase/CardMedia/CardStat, Skeleton, EmptyState, ErrorState, PageHeader, Dialog, BottomSheet) — all exist, but **adoption is low**: `Button` 8 files, `Skeleton` 1 real consumer, `Dialog` 15 files; categories still have heavy inline implementations (see §4).

### 9.3 `AGENTS.md`

| Rule | Verdict |
|---|---|
| `useNavInvert`/`data-nav-invert` not reintroduced | **Held** (removed Phase 6) |
| No `PublicBottomNav`, `GoCodeCarousel` | **Held** (both deleted Phase 6) |
| `react-loading-skeleton` import ban | Held (not found) |
| No dual walkthrough toolbar | Held |
| No `snap-container-proximity` / `CardGrid` | Held (absent) |
| No `font-display` utility class | Held (class never used; var + `@font-face` descriptor only) |
| Snap sections `min-h-dvh`, never `h-dvh` | **Held** (fixed `PublicHeroSection.tsx` Phase 6) |
| Walkthrough steps all on one page, no route navigation per step | Held (next-step uses `scrollIntoView`) |
| Fullscreen toggle only in `LearningToolbar`, never inline | Held (toolbar has it) |

---

## Recommended Token Set

Derived from actual dominance in the codebase, with `index.css @theme` as single source of truth:

**Color**
- `--color-accent: #06B66F` (keep), `--color-on-accent: #000000` (keep)
- Keep elevation steps `bg / bg-card / bg-elevated / bg-alt`
- New substantiated tokens (replace the palette-class drift):
  - `--color-danger: #EF4444` (used 100+× as red-400/red-500)
  - `--color-success: #22C55E` (green-400/#22c55e pattern)
  - `--color-warning: #F59E0B` (amber-500/yellow-400 mix)
  - `--color-info: #0EA5E9` (sky-400/blue-400)
  - `--color-difficulty-*` from `.badge-*` (sky/amber/red or aligned to status tokens)
  - map `green-400→success`, `red-400→danger`, `yellow-400/amber-400→warning`, `blue-400/sky-400→info` in `Badge`, `ErrorState`, `Input.error`, `Button.danger`, and the 4 `.btn-*`/`.badge-*` CSS classes.

**Type scale** (as tokens/classes, since `text-[10px]`=495, `text-[9px]`=382 lead usage)
- `--text-kicker: 10px` `--text-tiny: 9px` `--text-overline: 8px` `--text-micro: 7px`; then the standard `xs/sm/base/lg` progression above.
- Headings: `h1 = text-4xl md:text-6xl` (auth/PageHeader precedent), `h2 = text-3xl md:text-5xl` (majority 31×5xl/28×3xl), `h3 = text-2xl md:text-3xl lg:text-4xl` (docs), with the `text-3xl md:text-5xl lg:text-7xl` split-screen headline as the explicit `h2--split`.
- Kicker canonical: `text-[10px] font-black uppercase tracking-[0.3em] text-accent`.

**Spacing**
- Card padding: `p-4` (`CardBase`), `md:p-5` step accepted; radius `rounded-2xl` for all card surfaces, `rounded-xl` interactive, `rounded-lg`/`full` badges.
- Width tokens replacing `[420px]/[360px]/[460px]/[480px]` (card rails) and `[200px]/[220px]` (sidebars).

**Motion**
- `--dur-fast: 160ms` / `--dur-base: 260ms` / `--dur-slow: 420ms` (keep; apply to components replacing `duration-*`), `--ease-smooth: cubic-bezier(0.22,1,0.36,1)` (keep; replace 0.5/0.4 framer literals when feasible), `--ease-expo: cubic-bezier(0.16,1,0.3,1)` (new; currently duplicated in 11 files).
- Icon defaults: `size=16/20` for body icons, `w-5 h-5` class equivalents; retire the 10+ arbitrary sizes.

Source data staged at `/tmp/opencode/audit/` (`hex_tsx.txt`, `hex_tsx_nav.txt`, `hex_ts.txt`, `hex_css.txt`, `arb_color_tsx.txt`, `rgb_tsx.txt`, `arb_spacing.txt`, `headings.txt`).