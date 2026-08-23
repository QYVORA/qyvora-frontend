# QYVORA UI Principles

Rules governing every UI decision in this codebase. These are enforced conventions, not suggestions.
Source of truth: the code. Before writing UI, read `src/styles/index.css` and existing components.

---

## 1. Design Identity

**Rule: This is not a generic SaaS theme.**

| Principle | Rule |
|-----------|------|
| Aesthetic | Dark, terminal-born, mono typography, single green accent, dot-grid textures, 1px beam borders |
| Background | Near-black `#000000`. Surfaces lift in tiny steps: `bg-bg` -> `bg-bg-alt` (`#080808`) -> `bg-bg-card` (`#050505`) -> `bg-bg-elevated` (`#0b0b0b`) |
| Text | Near-white `#EEF0EE` primary, 70% secondary, 40% muted. **Never invent new greys.** |
| Accent | `#06B66F` everywhere. **Never** `#66B870`, never another green. On accent surfaces: `on-accent` (`#000000`) |
| Typography | JetBrains Mono (body). Space Grotesk on headings (automatic via base layer). **Never add `font-display` class.** |
| No AI slop | **Do not add**: purple/indigo gradients, emoji as icons, drop-shadow-on-everything, `shadow-lg`-heavy cards, `max-w-*` page containers, arbitrary `@keyframes`, `backdrop-blur` panels (navbar/menu only), rounded-full gradient buttons, stock section copy |
| If not in codebase | If an effect isn't already in `index.css` or an existing component, **do not introduce it** |

---

## 2. Design Tokens

Defined in `src/styles/index.css` `@theme` block. **Use Tailwind utilities, never raw hexes in components.**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-bg-alt` | `#080808` | Alternating sections |
| `--color-bg-card` | `#050505` | Cards |
| `--color-bg-elevated` | `#0b0b0b` | Elevated surfaces, secondary buttons |
| `--color-accent` | `#06B66F` | The only green |
| `--color-on-accent` | `#000000` | Text/icons ON accent surfaces |
| `--color-text-primary` | `#EEF0EE` | Primary text |
| `--color-text-secondary` | rgba(EEF0EE, 0.70) | Body copy |
| `--color-text-muted` | rgba(EEF0EE, 0.40) | Labels, meta |
| `--color-border` | rgba(ABB5C0, 0.18) | Default borders |
| `--color-border-strong` | rgba(06B66F, 0.26) | Strong/accent borders |
| `--ease-smooth` | `cubic-bezier(0.22,1,0.36,1)` | CSS transitions |
| `--dur-fast/base/slow` | `160ms/260ms/420ms` | Transition durations |
| `--tap-target-min` | `48px` | Minimum touch target |

**Light theme**: `[data-theme="light"]`. **Admin forced-dark**: `[data-theme-persist="dark"]`.

### Acceptable Raw Hex Exceptions

- `CodeBlock.tsx` - IdeMock syntax colors
- `Ide.tsx`, `IdeBlock.tsx` - VS Code simulation
- `LandingSimulationsSection.tsx`, `SimulationsPage.tsx` - Terminal mocks
- `topicMap.ts` - Course/topic category colors (data layer)

---

## 3. Typography

**Rule: Headings are always `font-black` (900). Body is always `font-mono`.**

### h1 (Page titles)

| Context | Classes |
|---------|---------|
| Landing hero | `font-black text-text-primary leading-[1.08] tracking-tight` + inner `uppercase text-[2rem]...xl:text-[3rem]` |
| Student dashboard | `text-4xl md:text-6xl` |
| Phase hero | `text-3xl sm:text-4xl lg:text-5xl` |
| Auth form | `text-3xl` |

**Never go below `text-3xl` for an h1.** The hero inner span is `uppercase`.

### h2 (Section headings)

| Tier | Classes | Used by |
|------|---------|---------|
| Hero-adjacent | `text-3xl md:text-5xl lg:text-6xl` | Market, Blogs |
| Standard | `text-2xl md:text-4xl lg:text-5xl` | Team, QuiteRoot, Leaderboard, OpenSourceTools, ActDivider |
| Compact bento | `text-lg md:text-xl lg:text-2xl` | Courses, Labs, Bootcamp (shrink-0 header row) |

All h2: `font-black text-text-primary tracking-tighter leading-none`. Accent word inside h2:
`<span className="text-accent">`. Compact sections are **title only - no description**.

### h3 (Sub-headings)

`text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-3`.

### Meta text / Labels

- Badges: `px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest` (`text-[10px]` ok).
- Description copy: `text-xs md:text-sm text-text-muted leading-relaxed max-w-xl`.
- Hero description: `text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl font-mono` - ONE sentence.

---

## 4. Components

### Buttons

**Rule: Always use `<Button>` for CTAs. Never raw `<button>` without the design system classes.**

| Class | Look |
|-------|------|
| `.btn-primary` | `bg-accent text-on-accent border-2 border-on-accent`, `hover:brightness-110 active:scale-95` |
| `.btn-secondary` | `bg-bg-elevated text-accent`, 1px border, `hover:bg-bg-card` |
| `.btn-danger` | `bg-red-500/10 text-red-400 border-red-500/40`, `hover:bg-red-500/20` |

All: `font-black uppercase tracking-[0.08em] rounded-xl px-7 py-3`.
Sizes: `sm` (`px-4 py-2 text-[10px]`), `md` (`px-7 py-3 text-[10px]`), `lg` (`px-8 py-3.5 text-xs`).

### Cards

**Rule: Every card uses `rounded-2xl`. Never mix radius scales within one component.**

| Class / Component | Purpose |
|-------------------|---------|
| `.card-qyvora` | `bg-transparent rounded-2xl` + dot-grid overlay, `hover:scale(1.01)` |
| `.card-accent` | `rounded-2xl border-accent/30`, hover border stronger |
| `.terminal-card` | `rounded-2xl` + 1px top shimmer |
| `CardBase` | `terminal-card` + border hover + keyboard accessible |
| `CardMedia` | CardBase + cover image (`aspect-[16/9]`, never `aspect-square`) |
| `CardStat` | Compact stat: icon + value + label |

Border opacity: default `border-border/30`, interactive `border-accent/30`, elevated `border-border/50`.

### Inputs and Forms

```
bg-bg border border-border rounded-xl py-3 px-4 text-text-primary
focus:border-accent outline-none font-mono text-sm
```

Always `rounded-xl`. Focus: `focus:border-accent` only (no `focus:ring-*`).
Error: `.input-error` class. Disabled: `disabled:opacity-50`.

### Badges

`inline-flex items-center rounded-lg font-black uppercase tracking-widest`. Variants: default, accent, success, warning, danger, info. Sizes: `sm` (`text-[9px]`), `md` (`text-[10px]`).

### Dialogs

Use `DialogContent` (Radix) for desktop. `BottomSheet` (Radix) for mobile. Always pass `title`. Always have `aria-describedby`. Focus trap + Escape key.

---

## 5. Layout

**Rule: Unified stretched layout - NO `max-w-*` constraints on page-level containers.**

Content fills the viewport with consistent padding: `px-3 md:px-4 lg:px-6`.

### Navbar Clearance

| Context | Clearance |
|---------|-----------|
| Snap sections | `pt-24 md:pt-28 lg:pt-32`, bottom `pb-6 md:pb-8 lg:pb-10` |
| PublicSnapSection | `pt-24 md:pt-28 lg:pt-32` + `scroll-mt-24 md:scroll-mt-28` |
| Student/admin topbar | `pt-20 md:pt-24` |
| Sidebar sections | `py-12 sm:py-10 md:py-16 lg:py-20` |

### Snap Scrolling

Every snap section: `relative w-full min-h-dvh snap-section` - **never a fixed `h-dvh`/`lg:h-dvh` on
content sections**; sections must grow when content exceeds the viewport so nothing clips under the
navbar. Alternate `bg-bg`/`bg-bg-alt`. Footer is last snap section (no `min-h-dvh`; it snaps to `end`
via `.snap-section:last-child { scroll-snap-align: end; }`).
Snap container: `.snap-container { scroll-snap-type: y mandatory }` on md+ — one scroll gesture,
one section.
Mobile: snap is off, `section[id]` has `scroll-margin-top: 80px`.

### PublicSnapSection

```tsx
<section className="relative w-full min-h-dvh snap-section flex flex-col odd:bg-bg even:bg-bg-alt px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 scroll-mt-24 md:scroll-mt-28">
  <div className="w-full my-auto">
    {children}
  </div>
</section>
```

Sections grow if content exceeds viewport - **never `h-dvh`, always `min-h-dvh`**. The inner
`my-auto` wrapper vertically centers short content and collapses to top-alignment when content
overflows, so overflow can never bleed under the fixed navbar (that was the "eyebrow enters navbar /
snipped content" bug).

---

## 6. Width Constraint System

**Rule: Use `wc-*` classes, never ad-hoc `max-w-*` Tailwind utilities.**

| Class | Max-width | Usage |
|-------|-----------|-------|
| `.wc-prose` | `42rem` | Narrative text, lesson body |
| `.wc-code` | `52rem` | Code blocks, fenced code |
| `.wc-terminal` | `56rem` | Terminal/CLI displays |
| `.wc-diagram` | `52rem` | Flow diagrams, kill-chain |
| `.wc-table` | `56rem` | Tables |
| `.wc-media` | `40rem` | Images, screenshots |
| `.wc-interactive` | `48rem` | Code playgrounds, quizzes, notes |

All reset to `max-width: 100%` on mobile. Apply as className on component root or inner wrapper.

---

## 7. Motion and Animation

### Canonical Easings

| Easing | Value | Context |
|--------|-------|---------|
| smooth | `[0.22, 1, 0.36, 1]` | Global MotionConfig, ScrollReveal, CSS `--ease-smooth` |
| expo-out | `[0.16, 1, 0.3, 1]` | Landing section reveals |
| carousel-slide | `[0.25, 0.46, 0.45, 0.94]` | Carousel slide transitions |

### Standard Reveal Pattern

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
/>
```

**Prefer `ScrollReveal` over hand-rolled reveals.** It handles stagger, mobile detection, and reduced-motion.

### Reduced Motion (Mandatory - Three Layers)

1. **CSS**: `@media (prefers-reduced-motion: reduce)` kills all durations globally
2. **Motion**: `MotionConfig reducedMotion="user"` in `App.tsx`
3. **Component**: `useReducedMotion()` checks gate auto-play, heavy transforms, decorative motion

### Animation Durations by Context

| Duration | Context |
|----------|---------|
| `0.2s` | Route transitions, nav overlays |
| `0.25s` | Accordion, toasts |
| `0.3-0.35s` | Carousel slides, card collections |
| `0.5s` | Landing section reveals |
| `0.6s` | ScrollReveal |
| `0.8s` | XP bars, hero counters |

### CSS Animation Utilities (in index.css, use over new keyframes)

`animate-fade-in`, `animate-shake-x`, `animate-slide-in-right`, `.marquee-track` (42s, pauses on hover), `.dobia-float` / `.dobia-wave`, `.animate-athena-box-1/2/3` (page loader), `.input-error`, `.border-beam`, `.nav-border-beam`. All respect `prefers-reduced-motion`.

---

## 8. Accessibility

### Mandatory Patterns

- All interactive elements: `min-h-[48px]` (or `min-h-44px` on mobile)
- Focus-visible: `outline: 2px solid var(--color-accent); outline-offset: 2px` (global CSS)
- Skip links in every layout: `<a href="#main-content" className="sr-only focus:not-sr-only ...">`
- Dialogs: use `DialogContent` wrapper (Radix) with `aria-labelledby`, focus trap
- `role="button"` on divs: must have `aria-label` AND handle both Enter and Space keys
- Form inputs: always have associated `<label>` via `htmlFor/id`
- Error messages: linked via `aria-describedby`
- Loading states: `role="status"` or `aria-live="polite"`
- Animations: respect `prefers-reduced-motion` at all three layers

---

## 9. Component Architecture

### File Organization

```
src/
  core/           # Contexts, hooks, services (auth, api, theme)
  shared/         # Reusable components, hooks, utils
    components/   # ui/, layout/, backgrounds/, walkthrough/, ...
    hooks/        # useReducedMotion, useCelebrationTrigger, ...
    utils/        # cn(), formatNumber, walkthroughImages
  features/
    marketing/    # Landing page, public pages, tools
    student/      # Dashboard, bootcamp, labs, courses, tools
    admin/        # Admin dashboard, analytics
    auth/         # Login, register, forgot password
```

### Dependency Direction

`core` -> `shared` -> `features` (never reverse)

### Import Convention

Use `@/` alias everywhere. Never use relative imports beyond one level.

### Icons

`lucide-react` only. Named imports. No emoji as icons. No custom SVG icon system (except brand logo / HackerGlobe).

### i18n

All user-facing strings go through `useTranslation()`. Menu structure via `SITE_CONFIG` + i18n keys.

---

## 10. Layout Stability

**Rule: Major QYVORA layout containers must have stable, intentional dimensions.**

Changes in child content must not cause unexpected resizing or movement of surrounding content.
Dynamic content adapts within the established layout rather than redefining the layout geometry.

### Carousel Viewport Stability

Carousels and full-section carousels must maintain a stable viewport while slides change.
Different slide content lengths must not cause the page or surrounding sections to jump.

- Full-section carousels: `relative w-full min-h-dvh flex flex-col` on the section (growable, never a
  fixed `lg:h-dvh`), `overflow-x-clip` around the AnimatePresence slide region, and a `my-auto` padded
  wrapper so short slides center while tall slides push the section taller instead of clipping
- Content columns: avoid fixed heights; constrain variable text with `line-clamp-*` where slides must
  not change section height
- Variable-length text: `line-clamp-*` to constrain description growth
- Course/lab visuals: dedicated visual region with stable aspect ratio (`aspect-square` or `aspect-[4/3]`)

### Section Height Stability

Snap sections must not unexpectedly grow or shrink because internal content changes.
The section establishes stable geometry; content adapts inside it.

### Content Slot Stability

Where content varies between slides/views, use stable internal regions:
- Fixed media ratios
- Controlled description regions (`line-clamp-*`)
- Consistent CTA positioning
- Stable metadata areas

---

## 11. Known Dead Code (Do Not Reintroduce)

- `useNavInvert` hook + `data-nav-invert` attributes
- `PublicBottomNav` component
- `GoCodeCarousel` component
- `.snap-container-proximity` CSS class
- `font-display` utility class
- `CardGrid` component
- Navbar scroll-hide/invert behavior
- `zustand` and `@tanstack/react-query` npm dependencies (installed but unused)

---

## 11. Known Technical Debt

### P2 - Should Fix

- 38+ raw hex colors in `topicMap.ts` (data layer, low visual impact)
- `aspect-square` on 14+ dashboard/student product cards (should be `aspect-[16/9]`)
- Touch target inconsistency: CSS 48px vs mobile override 44px
- `useGsap*` hooks bypass reduced-motion checks
- `Input.tsx` lacks built-in error state
- Missing barrel exports in `dobia/`, `hpb/`, `profile/`, `courses/`
- Duplicate `useReducedMotion` hooks (custom vs motion/react)
- No granular ErrorBoundary per route

### P3 - Informational

- Two easing curves used intentionally: smooth (`0.22`) for general, expo-out (`0.16`) for landing reveals
- VS Code simulation hex colors are intentional (separate visual system)
- `transition-all` used on 100+ elements (broad but acceptable)
- Test coverage ~4.3% file-level

---

## 13. Admin Dashboard Design Principles

**Rule: The Admin Dashboard is part of QYVORA. It must use the same design language as the Student Dashboard and public site.**

### Intentional Admin-Specific Differences

| Difference | Reason |
|------------|--------|
| `data-theme-persist="dark"` | Admin always uses dark theme regardless of user preference |
| `z-[100]` on AdminTopbar | Matches public navbar z-index spec |
| Tab-based navigation (no sidebar) | Admin uses `?tab=` URL parameter for single-page navigation |
| Form-heavy workflows | Admin manages users, products, bootcamp — forms are primary interaction |
| DataTable for data management | Admin tables use shared `DataTable` component for consistency |

### Admin Design Rules

- **Use shared components**: `StatCard`, `DataTable`, `Button`, `Badge`, `Dialog`, `ConfirmDialog` — never create custom versions
- **Color tokens only**: Use `text-accent`, `text-red-400` (destructive), `text-text-muted` — never `emerald-500`, `blue-400`, `zinc-400`, `amber-400`
- **Touch targets**: All interactive elements `min-h-[44px]` — pagination buttons, icon buttons, table action buttons
- **i18n**: All user-facing strings through `useTranslation()` — no hardcoded English
- **Form inputs**: Standard `INPUT_CLS` constant or equivalent Tailwind classes
- **Cards**: `rounded-2xl border border-border/30 bg-bg-card` — no `shadow-lg`, no `backdrop-blur` (navbar/menu only)
- **Z-index**: `z-[100]` topbar, `z-[90]` secondary navigation, `z-[200]` dialog overlays

### Admin Component Hierarchy

```
AdminLayout
├── AdminTopbar (z-[100], fixed top)
├── Content area (pt-20 md:pt-24)
│   ├── LearningOverviewCard (hero banner)
│   ├── Tab content (one of 9 tabs)
│   │   ├── OverviewTab → StatCard + DataTable
│   │   ├── UsersTab → StatCard + DataTable
│   │   ├── BootcampAccessPanel → StatCard + toggle + phase list
│   │   ├── ZeroDayMarketTab → form + DataTable
│   │   ├── CpAnalytics → StatCard + BarChart + PointsControl + TransactionLedger
│   │   ├── InboxTab → list + Dialog
│   │   ├── BroadcastTab → form + ConfirmDialog
│   │   ├── AuditLogTab → filter + custom list
│   │   └── SecurityTab → StatCard + DataTable
│   └── SyncIndicator
└── ConfirmDialog instances (user/product deletion)
```
