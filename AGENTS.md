# QYVORA Frontend — Conventions

Source of truth: the code. Before writing UI, read `src/styles/index.css` and look at existing
sections (landing page, student dashboard, admin). Mirror what is already there — do not invent
new patterns, tokens, or effects.

## Design Identity (read first)

- **Aesthetic**: dark, terminal-born, mono typography, a single green accent, dot-grid textures,
  subtle 1px "beam" borders. Not a generic SaaS light theme, not a purple/blue gradient mesh.
- **Background**: near-black (`--color-bg: #000000`). Surfaces lift in tiny steps:
  `bg-bg` → `bg-bg-alt` (`#080808`) → `bg-bg-card` (`#050505`) → `bg-bg-elevated` (`#0b0b0b`).
- **Text**: near-white (`--color-text-primary: #EEF0EE`), with `text-secondary` (70%) and
  `text-muted` (40%) tiers. Never invent new greys.
- **Accent**: `#06B66F` everywhere. Never `#66B870`, never another green. On accent surfaces use
  `on-accent` (`#000000`).
- **Mono throughout**: JetBrains Mono. Space Grotesk is applied to headings automatically by the
  base layer — do NOT add a `font-display` class in JSX.
- **"No AI slop" — do not add**: purple/indigo gradients, emoji as icons, drop-shadow-on-everything,
  generic `shadow-lg`-heavy cards, `max-w-*` content containers, arbitrary new `@keyframes`, glassy
  `backdrop-blur` panels, rounded-full gradient buttons, or stock "Features / About / Contact"
  section copy. If an effect isn't already in `index.css` or an existing component, don't introduce it.

## Design Tokens

Defined in `src/styles/index.css` `@theme`. Use Tailwind utilities (`bg-bg`, `text-text-primary`,
`border-border`, `text-accent`, ...), never raw hexes in components.

| Token | Value (dark) | Usage |
|-------|--------------|-------|
| `--color-bg` | `#000000` | page background |
| `--color-bg-alt` | `#080808` | alternating sections |
| `--color-bg-card` | `#050505` | cards |
| `--color-bg-elevated` | `#0b0b0b` | elevated surfaces, secondary buttons |
| `--color-accent` | `#06B66F` | the only green. Source: SVG logo |
| `--color-on-accent` | `#000000` | text/icons ON accent surfaces |
| `--color-text-primary` | `#EEF0EE` | primary text |
| `--color-text-secondary` | 70% primary | body copy on dark bg |
| `--color-text-muted` | 40% primary | labels, meta |
| `--color-border` | white 18% | default borders |
| `--color-border-strong` | accent 26% | strong borders |
| `--ease-smooth` | `cubic-bezier(0.22,1,0.36,1)` | CSS transition easing |
| `--dur-fast` / `--dur-base` / `--dur-slow` | `160ms` / `260ms` / `420ms` | transition durations |
| `--tap-target-min` | `48px` | min interactive height (global) |

Light theme (`[data-theme="light"]`) and admin forced-dark (`[data-theme-persist="dark"]`) overrides
exist in the same file. Use tokens — both themes resolve automatically.

## Typography

- Body: `font-mono` (JetBrains Mono). Set globally on `body` — do not override.
- Headings `h1`–`h6` inherit Space Grotesk + `text-text-primary` from the base layer. No `font-display`
  utility class exists and none should be added.
- Headings are always `font-black` (900). Use `tracking-tight`/`tracking-tighter` + `leading-none`/`leading-[1.08]`.

### h1 (page titles)

| Context | Pattern |
|---------|---------|
| Marketing / landing hero | `font-black text-text-primary leading-[1.08] tracking-tight w-full relative` with inner `<span className="block whitespace-normal lg:whitespace-nowrap uppercase text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05]">` |
| Student dashboard (`PageHeader`) | `text-4xl md:text-6xl` |
| Phase hero | `text-3xl sm:text-4xl lg:text-5xl` |
| Auth form | `text-3xl` |

Never go below `text-3xl` for an h1. The hero inner span is `uppercase`.

### h2 (section headings)

| Tier | Pattern | Used by |
|------|---------|---------|
| Hero-adjacent | `text-3xl md:text-5xl lg:text-6xl` | Market, Blogs |
| Standard | `text-2xl md:text-4xl lg:text-5xl` | Team, QuiteRoot, Leaderboard, OpenSourceTools, ActDivider |
| Compact bento | `text-lg md:text-xl lg:text-2xl` | Courses, Labs, Bootcamp (shrink-0 header row) |

All h2: `font-black text-text-primary tracking-tighter leading-none`. Accent word inside h2:
`<span className="text-accent">`. Compact sections are **title only — no description**.

### h3 (sub-headings)

`text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-3`.

### Meta text / labels

- Badges: `px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest` (`text-[10px]` ok).
- Description copy: `text-xs md:text-sm text-text-muted leading-relaxed max-w-xl`.
- Hero description: `text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl font-mono` — ONE sentence.

## Border Radius

| Element | Radius |
|---------|--------|
| Cards / modals / panels | `rounded-2xl` |
| Buttons / inputs | `rounded-xl` |
| Badges / pills | `rounded-lg` or `rounded-full` |
| Small icon buttons / terminal chrome | `rounded-lg` |

Never mix radius scales within one component. Never use `rounded-md`/`rounded-sm` for badges.

## Buttons

Three tiers in `src/styles/index.css` (`@layer components`):

| Class | Look |
|-------|------|
| `.btn-primary` | `bg-accent text-on-accent border-2 border-on-accent`, `hover:brightness-110 active:scale-95` |
| `.btn-secondary` | `bg-bg-elevated text-accent`, 1px `--color-border`, `hover:bg-bg-card` |
| `.btn-danger` | `bg-red-500/10 text-red-400 border-red-500/40`, `hover:bg-red-500/20` |

All: `font-black uppercase tracking-[0.08em] rounded-xl px-7 py-3`. The `Button` component
(`src/shared/components/ui/Button.tsx`) wraps this with sizes sm `px-4 py-2 text-[10px]`, md
`px-7 py-3 text-[10px]`, lg `px-8 py-3.5 text-xs`. Prefer `Button` over raw `<button>` for CTAs.

## Inputs & Forms

Standard pattern:
```
bg-bg border border-border rounded-xl py-3 px-4 text-text-primary
focus:border-accent outline-none font-mono text-sm
```
- Always `rounded-xl`, focus is `focus:border-accent` only (no `focus:ring-*`).
- Error state: `.input-error` class (red border + shake + glow, defined in `index.css`).
- Disabled: `disabled:opacity-50`. Tap targets ≥ `--tap-target-min` (48px), applied globally.

## Cards

| Class / component | Purpose |
|-------------------|---------|
| `.card-qyvora` | `bg-transparent rounded-2xl` + faint dot-grid overlay (`::after`), `hover:scale(1.01)` |
| `.card-accent` | `rounded-2xl border-accent/30`, hover border → `rgba(6,182,111,0.55)` |
| `.terminal-card` | `rounded-2xl` + 1px top-edge shimmer line (`::before`; skipped when `.border-beam`) |
| `CardBase` (`ui/Card.tsx`) | `terminal-card group relative flex flex-col overflow-hidden rounded-2xl border bg-bg-card`, hover `hover:border-accent/55` |
| `CardStat` | stat value/label display |
| `CardMedia` | cover image area |

Card border opacity by context: default `border-border/30`, subtle/landing `border-border/20`,
interactive hover `border-accent/30`, elevated `border-border/50`.

Product cards (marketplace/dashboard): `aspect-[16/9]` cover with `AuthImage` + gradient
`bg-gradient-to-t from-bg-card via-transparent to-transparent`, `group-hover:scale-105`.
**Never `aspect-square`**, never a `fallback` on `AuthImage`.

## Layout System

**Unified stretched layout** — NO `max-w-*` constraints on page-level containers. Content fills the
viewport with consistent side padding: `px-3 md:px-4 lg:px-6`. The student dashboard is the reference.

**Navbar space rule (critical):** the navbar is `fixed top-0 h-[80px]`. Every full-page/snap section
must clear it. Exact clearance depends on context:

| Context | Clearance |
|---------|-----------|
| Snap bento sections (Labs, Bootcamp, Courses, Pillars, Services) | `pt-24 md:pt-28 lg:pt-32`, bottom `pb-6 md:pb-8 lg:pb-10` |
| `PublicSnapSection` (natural flow) | `py-16 md:py-20 lg:py-24`; `section[id]` also `scroll-mt-24 md:scroll-mt-28` |
| Student / admin topbar layouts | `pt-20 md:pt-24` (their `TOPBAR_H` constant) |
| Sidebar-layout sections (Team, QuiteRoot, Anansi, Blogs, Market, Leaderboard) | `py-12 sm:py-10 md:py-16 lg:py-20` |

- Mobile: `section[id]` gets `scroll-margin-top: 80px` globally — keep `id` on sections.
- Footer is a normal page footer with outer padding `px-3 py-10 md:px-4 md:py-20 lg:px-6`, no max-width.
- Never wrap page content in `max-w-[1600px]`, `max-w-6xl`, etc.

## Public Inner Pages (non-landing)

Public pages rendered through `PublicSnapLayout` (Courses, Labs, Services, Blogs, Team, QuiteRoot,
Leaderboard, Hpb, Market, Simulations, Anansi, Toha3ee, Jabari, ...) use **natural flow — no
scroll-snap, no full-viewport strips**:

- `PublicSnapLayout` (`src/shared/components/PublicSnapLayout.tsx`) is a **plain wrapper by default**:
  `<div className="relative w-full bg-bg">{children}</div>`. No snap container, no alternating
  `bg-bg`/`bg-bg-alt` injection, no `GridBoxedBackground` injection. Optional `snap` prop renders
  `snap-container no-scrollbar` for full-viewport snap pages (HPB only — see HPB Snap Pages below).
  The `fitViewport` prop was removed from `PublicSnapSection` — do not reintroduce it.
- `PublicSnapSection` (`src/shared/components/PublicSnapSection.tsx`) is a natural-flow section:
  `<section className="relative w-full px-3 md:px-4 lg:px-6 py-16 md:py-20 lg:py-24 scroll-mt-24 md:scroll-mt-28">`.
  Sections grow with their content; never force `min-h-dvh`/`h-dvh` on them.
- The snap pages are the landing page (`LandingPage/index.tsx`) and the HPB pages
  (`/hpb`, `/hpb/:phaseId`) — see Snap Scrolling and HPB Snap Pages below. Other public inner pages
  are natural flow. `StudentHeroSection` and `LandingFinalCtaSection` keep their own `min-h-dvh` heights.

## HPB Snap Pages (`/hpb`, `/hpb/:phaseId`)

The Hacker Protocol Bootcamp pages opt into full-viewport **scroll-snap** sections (like the landing
page), via `<PublicSnapLayout snap>`:

- `/hpb` — hero, then **one full-viewport section per phase** (not a card grid), then CTA, then footer.
- `/hpb/:phaseId` — phase hero, then **one full-viewport section per room** (`RoomSection` in
  `src/features/marketing/pages/public/cards/RoomSection.tsx`), then CTA, then footer.
- Section pattern: `relative w-full min-h-dvh snap-section flex items-center` + alternating
  `bg-bg`/`bg-bg-alt`. Hero/CTA use `min-h-dvh lg:h-dvh`; room/phase sections use `min-h-dvh` only
  (they grow if their content exceeds the viewport). Footer is the last snap section:
  `w-full bg-bg pt-10 md:pt-0 snap-section`.
- Navbar clearance: `px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10` on the
  inner content wrapper. `section[id]` keeps its `scroll-mt` for the fixed 80px navbar.
- Do NOT add the landing page's scroll-spy here; HPB pages snap without hash-driven nav.

## Open-Source Tool Pages (Anansi / Toha3ee / Jabari)

- `ToolModulesSection` (`src/features/marketing/components/tools/ToolModulesSection.tsx`) groups every
  module/category/stage into **one** card-grid section (3 cols on `xl`). Never one full-height strip per module.
- `ToolSourceSection` (`src/features/marketing/components/tools/ToolSourceSection.tsx`) renders real Go
  from the tool repos (`SOURCE_EXAMPLES` in the `*Data.ts` files) as a non-carousel 2-col grid. The
  carousel was removed from tool pages — do not reintroduce `GoCodeCarousel` there.
- `CodeBlock` (`src/shared/components/CodeBlock.tsx`) is the only syntax highlighter (no prism/shiki).
  `lang="go" | "sh" | "text"`, palette matches the IdeMock colors (`#c678dd` keywords, `#e5c07b`
  strings, `#d19a66` numbers, `#56b6c2` types/flags, `#61afef` builtins, accent for funcs/commands).
  Use it for every code/command display on these pages; `copyable` shows a header copy button.
- Install CTAs open `ToolInstallModal` (`src/features/marketing/components/ToolInstallModal.tsx`) via
  `openToolInstall('anansi' | 'jabari' | 'toha3ee')`. It auto-detects OS/arch, auto-downloads the
  prebuilt binary (assets in `src/features/marketing/data/toolInstallConfig.ts`), and shows a
  copyable terminal command. Host is mounted once in `LandingLayout` (like `ServiceRequestModal`).
- Section headers use `ToolSectionHeader` (`src/features/marketing/components/tools/ToolSectionHeader.tsx`).
- `ToolDocumentationSection` keeps the architecture chapters; its `code` prop renders via `CodeBlock lang="sh"`.

## Snap Scrolling

Defined in `src/styles/index.css` (desktop only, `min-width: 768px`):
`.snap-container` (`y mandatory`), `.snap-section` (`align start`, `stop always`). Snap is disabled
on mobile — `.snap-container-proximity` exists but is **unused**; don't use it.

Landing page (`src/features/marketing/pages/LandingPage/index.tsx`) is the canonical snap page:

```tsx
<div className="relative w-full bg-bg snap-container no-scrollbar">
  <section id="hero" className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">...</section>
  ...
  <section id="footer" className="w-full bg-bg pt-10 md:pt-0 snap-section"><Footer /></section>
</div>
```

Rules:
- Every section: `relative w-full min-h-dvh lg:h-dvh snap-section` (note `lg:h-dvh`, not `md:h-dvh`).
- Alternate backgrounds `bg-bg` / `bg-bg-alt` per section; footer is the last snap section (no `min-h-dvh`).
- Desktop scroll-spy: listener at `scrollY + viewportHeight * 0.3` → `navigate('#id', { replace: true })`,
  throttled ~100ms, skipped during programmatic scroll.
- Hash deep-links: `scrollIntoView({ behavior: 'smooth' })` after a small delay, desktop only.
- `PublicSnapLayout` does **NOT** snap by default — only the landing page and the HPB pages
  (`/hpb`, `/hpb/:phaseId`) use `snap-container` (see Public Inner Pages and HPB Snap Pages above).

## Navbar

`src/shared/components/layout/Navbar.tsx` — **static** (no scroll-hide, no invert switching; removed in
commit `7d178a38`). `React.memo`, `fixed top-0 w-full z-[100] h-[80px]`, inner container
`w-full px-3 md:px-4 lg:px-6 flex items-center justify-between`.

- Logo/actions `z-[110]`; mobile overlay `fixed inset-0 z-[90] md:hidden bg-bg/95 backdrop-blur-xl`
  (body scroll locked via `useScrollLock`).
- Desktop nav: center group buttons `flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase
  tracking-widest rounded-xl border`; active `border-accent/40 text-accent bg-accent/5`, idle
  `border-border/30 text-text-primary/80 hover:border-accent/40 hover:text-accent`. Hover-open
  dropdowns with 150ms leave timeout.
- Menu data-driven: `SITE_CONFIG.nav.groups` (`src/features/marketing/content/siteConfig`) + i18n keys.
- Do NOT reintroduce scroll-hide or `data-nav-invert` handling. `useNavInvert` is dead code.

## Layouts

| Layout | File | Notes |
|--------|------|-------|
| `LandingLayout` | `src/shared/layouts/LandingLayout.tsx` | `<Navbar />` + `<main id="main-content" className="w-full min-h-screen flex flex-col">` with `<Outlet />`, then modal hosts + `<ConsentBanner />`. **No top padding** (hero clears its own space), **no `<Footer />`** (it's the last snap section), **no `overflow-hidden`**. Covers landing + all public marketing pages. |
| `StudentLayout` | `src/features/student/layouts/StudentLayout.tsx` | `TOPBAR_H = 'pt-20 md:pt-24'`; topbar + sidebar + InstallBanner + TerminalWrapper |
| `AdminLayout` | `src/features/admin/layouts/AdminLayout.tsx` | Forced dark (`data-theme-persist="dark"`), `pt-20 md:pt-24`, mobile nav bottom padding `pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6` |
| `AuthFormLayout` | `src/shared/components/layout/AuthFormLayout.tsx` | Mobile bg backdrop + `GridBoxedBackground`, lazy `HackerGlobe` pinned bottom-right, 2-col grid on `md`, form column `px-3 md:px-4 lg:px-6 py-12 md:py-16`, form wrapper `w-full max-w-lg relative z-10 my-auto` |

Layouts are lazy-loaded in `src/app/router.tsx`. Page transitions: `Wrap` wrapper (`motion.div`
opacity fade `duration: 0.25`) inside `AnimatePresence mode="wait"` keyed on `location.pathname`.

## Heroes

Use `PublicHeroSection` (`src/shared/components/PublicHeroSection.tsx`) for public page heroes:
- Props: `children`, `rightContent?` (lg-only right column), `mask` (`"right"` default | `"none"`),
  `showGlobe` (default true).
- Layout: `min-h-dvh md:h-dvh`, `bg-bg`, optional `HackerGlobe` (`hidden md:flex`), 2-col grid on
  `lg` (`lg:grid-cols-2 lg:items-center`). Do not modify the desktop view.
- Left column padding: `px-3 md:px-4 lg:px-6 pt-20 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16`; inner
  text `space-y-5 sm:space-y-6`.
- Mobile CTA: push to bottom with `mt-auto`.
- Hero text colors (on `bg-bg`, always dark-theme): h1 `text-text-primary`, accent word
  `text-accent`, description `text-text-secondary`, badge `text-text-muted` with `text-accent` icon.
  Never `text-bg` on dark hero backgrounds.
- Single-column pages (Services, Contact): `mask="none"`, no `rightContent`, no globe.

Note: landing-page snap sections render their own hero as a `snap-section` with `min-h-dvh lg:h-dvh`
(see Snap Scrolling); `PublicHeroSection` is for non-snap public pages.

## Backgrounds & Texture

- `GridBoxedBackground` (`src/shared/components/backgrounds/`) — the ONLY background component.
  Props: `className?`, `opacity` (0.6), `blur` (2), `reduced`, `mask` (`right`|`left`|`center`|`none`).
  Renders `absolute inset-0 z-0 overflow-hidden pointer-events-none` + canvas `HeroGrid`
  (accent `[6,182,111]`). Typical: `<GridBoxedBackground blur={0} mask="right" />`.
- `.dot-grid` — 24px radial dot texture via `--dot-color` (`rgba(6,182,111,0.05)`).
- `.border-beam` — animated 1px conic border (`@property --beam-angle`, 4.8s loop). Inner content
  needs `relative z-[2]`.
- `.nav-border-beam` — animated 1px bottom accent line (3.8s).
- `.glass-effect` — `backdrop-blur-md` + 5% tint + 10% border. Use sparingly (navbar/menu only).

## Motion & Animation

### Canonical easing
- Reveals/transitions: `ease: [0.16, 1, 0.3, 1]` (expo-out). Canonical block:
  `transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}` (95 usages).
- `ScrollReveal`: `duration: 0.6, ease: [0.22, 1, 0.36, 1]`.
- CSS transitions: `duration-[var(--dur-base)] ease-[var(--ease-smooth)]`.

### Reveal idiom (23 files)
```tsx
<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
```
`ScrollReveal` (`src/shared/components/ScrollReveal.tsx`): use it instead of hand-rolled reveals —
it handles `staggerChildren`, `useInView({ once: true, amount: 0.1 })`, `scale: 0.95`, and
**skips animation when `prefersReducedMotion || isMobile`**.

### AnimatePresence
Use `mode="wait"` for page/auth/carousel transitions, height animation for accordions, `popLayout`
for lists. Carousel slide ease `[0.25, 0.46, 0.45, 0.94]`.

### Reduced motion / performance (mandatory)
- `MotionConfig reducedMotion="user"` is global in `App.tsx`. Respect `useReducedMotion` —
  gate auto-advance (carousels), heavy transforms, and decorative motion.
- `useAdaptiveUi()` returns `{ isMobile, isLg, saveData, lowMemory, reduceMotionPreference, constrainedDevice }`.
  `constrainedDevice = saveData || lowMemory || reduceMotionPreference` (NOT isMobile — modern phones are capable).
- `AdaptiveMode` sets `body[data-performance-mode='constrained']`, which the CSS uses to strip
  blur/scanline filters and card hover transforms. Respect it in canvas-heavy components
  (HackerGlobe renders every-other-frame when simplified).
- `[data-saver="true"]` (Settings) disables all CSS animation/transition durations globally.

### CSS animation utilities (in `index.css`, use over new keyframes)
`animate-fade-in`, `animate-shake-x`, `animate-slide-in-right`, `.marquee-track` (42s, pauses on
hover), `.dobia-float` / `.dobia-wave`, `.animate-athena-box-1/2/3` (page loader), `.input-error`,
`.border-beam`, `.nav-border-beam`. All respect `prefers-reduced-motion`.

## Mobile Rules

- Snap is off below 768px; sections scroll normally, `section[id]` has `scroll-margin-top: 80px`.
- Mobile overrides are global in `index.css` (don't fight them): h1 2.25rem, h2 1.85rem, h3 1.5rem;
  `text-[9px]`/`text-[10px]` → 13px; vertical rhythm `py-32→3rem`, `py-24/py-20→2.5rem`, `py-16→2rem`;
  margins `mb-10/12→1.25rem`, `mb-14→1.5rem`, `mb-16→1.75rem`.
- `<360px`: h1 2rem, buttons full-width 46px, `.card-qyvora` radius 1rem.
- Tap targets ≥ 48px (global). Buttons `min-h-44px` on mobile.
- Mobile pattern: horizontal slide animations are discouraged (cross-fade/scale preferred) —
  see `LandingCoursesSection` (mobile: `scale 0.95` fade at 0.3s; desktop: x-slide 0.35s).
- Use `BottomSheet` for mobile actions (content `rounded-t-2xl`, `max-h-[82svh]`), `Dialog` for desktop.

## Icons

`lucide-react` only. Import named icons (`import { ArrowUp, ChevronLeft } from 'lucide-react'`).
No emoji as icons, no custom SVG icon system (except the brand logo / `HackerGlobe` canvas).
Empty states: pass icons at `w-10 h-10` or `w-12 h-12`.

## Accessibility & Interaction

- Focus-visible: global accent outline (2px + 2px offset) — don't suppress it.
- Skip-link: `<a href="#main-content">` in Navbar; `main` has `id="main-content"`.
- Dialogs: use `DialogContent` wrapper (auto `aria-describedby`), always pass `title`.
- `touch-action: manipulation` on interactive elements (global).

## Z-Index Scale

`z-[60]` mobile drawer backdrop · `z-[70]` drawer content · `z-[80]` dropdowns · `z-[90]` mobile
nav overlay · `z-[100]` navbar/bottom nav · `z-[110]` navbar logo/actions · `z-[120]` BottomSheet
overlay · `z-[130]` BottomSheet content · `z-[140]` InstallBanner · `z-[145]` CommunityPopup ·
`z-[150]` ConsentBanner · `z-[200]` Dialog overlay · `z-[201]` dialog content · `z-[210/211]` stacked
dialogs · `z-[220]` context menu · `z-[300]` tooltip · `z-[500]` toast · `z-[9999]` page loader.

## Component Conventions

- Icons via `lucide-react`; class merging via `cn()` from `src/shared/utils/cn.ts`.
- `React.memo` on heavy/presentational components. Lazy-load layouts and below-the-fold canvas
  components (`HackerGlobe`, backgrounds).
- All user-facing strings go through `useTranslation()` (`react-i18next`). Menu structure via
  `SITE_CONFIG` + i18n keys.
- `data-theme-persist="dark"` isolates admin. Theming via `[data-theme]` attribute, not classes.
- API: `VITE_API_BASE_URL`, `Authorization: Bearer`, CSRF double-submit cookie
  (`csrf_token` + `X-CSRF-Token`), all through `src/core/services/api.ts`.

## Removed / Dead — Do Not Reintroduce

- `CardGrid` (`src/shared/components/card-grid/`) — removed, was unused.
- `PublicBottomNav` — not rendered anywhere.
- `.snap-container-proximity` — defined in CSS, unused.
- Navbar scroll-hide/invert (`useNavInvert`, `data-nav-invert`) — removed; navbar is static.
- `font-display` utility class — headings inherit Space Grotesk from the base layer.
