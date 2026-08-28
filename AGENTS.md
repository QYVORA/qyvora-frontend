# QYVORA Frontend — Agent Instructions

Operational rules for AI coding agents. Before writing any UI, read `src/styles/index.css` and look at existing implementations. Mirror what is already there — do not invent new patterns, tokens, or effects.

## Before You Start

1. Read `src/styles/index.css` tokens and component classes
2. Check `docs/UI-PATTERN-INVENTORY.md` for existing pattern implementations
3. Check `docs/UI-PRINCIPLES.md` for enforced rules
4. Look at existing similar components before creating new ones

## Design Rules

- **Dark theme, terminal-born**: near-black bg (#000000), surfaces lift in steps (bg -> bg-alt #080808 -> bg-card #050505 -> bg-elevated #0b0b0b)
- **Single accent**: `#06B66F` only. Never `#66B870`, never another green. On accent surfaces use `on-accent` (#000000)
- **Typography**: JetBrains Mono body (global), Space Grotesk headings (automatic). Never add `font-display`. Headings always `font-black` (900)
- **Never add**: purple/indigo gradients, emoji as icons, drop-shadow-on-everything, `shadow-lg`-heavy cards, `max-w-*` page containers, `backdrop-blur` panels (navbar/menu only), rounded-full gradient buttons
- **If not in codebase**: if an effect isn't in `index.css` or existing components, don't introduce it

## Token Usage

Use Tailwind utilities (`bg-bg`, `text-text-primary`, `border-border`, `text-accent`), never raw hexes. Acceptable hex exceptions: `CodeBlock.tsx` syntax colors, `Ide.tsx`/`IdeBlock.tsx` VS Code simulation, `topicMap.ts` data layer colors.

## Typography Sizing

Heading scale source of truth: **`docs/TYPOGRAPHY.md`** (canonical variants + rules). Canonical practice below.

| Element | Min Size |
|---------|----------|
| h1 | `text-3xl` (never smaller) |
| h2 | `text-lg` (compact bento) or `text-2xl`+ (standard), `text-3xl md:text-5xl lg:text-7xl` (split-screen sections) |
| h3 | `text-2xl md:text-3xl lg:text-4xl` |

h2 compact bento sections: **title only, no description**.

- **Kickers/eyebrows**: tiny uppercase accent text — use the type tokens (`text-kicker` / `text-tiny`, see `docs/TYPOGRAPHY.md`); legacy `text-[10px]`/`text-[9px]` accepted during migration. Never small headings (`h3`/`h4`).

## Layout Rules

- **No `max-w-*` on page-level containers**. Content fills viewport: `px-3 md:px-4 lg:px-6`
- **Navbar clearance**: snap sections `pt-24 md:pt-28 lg:pt-32`; topbar layouts `pt-20 md:pt-24`; sidebar sections `py-12 sm:py-10 md:py-16 lg:py-20`
- **Snap sections**: `relative w-full min-h-dvh snap-section` — never a fixed `h-dvh`/`lg:h-dvh` on content sections; sections grow when content exceeds the viewport so nothing clips under the navbar
- **Content grows**: never `h-dvh` on content sections, always `min-h-dvh`. Center short content with an inner `my-auto` wrapper (collapses to top-align on overflow)
- **No strip-like sections**: every snap section is a filled composition — header paired with substantive content (split layout, grid, or panel stack). Never ship a lone small card/banner centered in an otherwise empty viewport; if a section would be sparse, merge its content into an adjacent section or pair it with a complementary card
- **Snap sections must fit the viewport**: content should not exceed one viewport at common laptop sizes (~1366×768). If it does, SPLIT into additional snap sections (see Layout Stability) — an oversized snap area breaks strict `y mandatory` scrolling
- **Width constraints**: use `wc-*` classes (`wc-prose`, `wc-code`, `wc-terminal`, `wc-diagram`, `wc-table`, `wc-media`, `wc-interactive`), never ad-hoc `max-w-*`
- **Kickers/eyebrows**: tiny uppercase accent text — use the type tokens (`text-kicker` / `text-tiny`, see `docs/TYPOGRAPHY.md`); legacy `text-[10px]`/`text-[9px]` accepted during migration. Never small headings (`h3`/`h4`).
- **No content into navbar**: split-screen sections on desktop must not let content bleed upward into the navbar clearance zone. If the left column has sparse content (e.g. kicker + title only), use `items-center` on the grid row so content vertically centers rather than stretching thin at the top with empty space above. This applies to all desktop split-screen sections — never `lg:items-start` when one column has sparse content
- **No content into adjacent sections**: each snap section's content must stay strictly within its own viewport boundaries. On desktop, a split-screen section must not overflow downward into the next snap area. If content is tall, split into multiple snap sections rather than letting one section grow past the viewport

## Component Rules

- **Cards**: always `rounded-2xl`. Never mix radius scales. Product cards: `aspect-[16/9]`, never `aspect-square`. Use canonical card primitives: `CardBase`, `CardMedia`, `CardStat`, `LearningCard` (`@/shared/components/ui/Card` or `@/shared/components/learning/LearningCard`).
- **Learning Cards**: all learning items (labs, courses, bootcamp phases, lessons, related items) MUST use the canonical `LearningCard` component derived from the preferred Lab Card visual reference.
- **Buttons**: always use `<Button>` component for CTAs. Raw buttons need `.btn-primary`/`.btn-secondary`/`.btn-danger` classes. Never add ad-hoc glow drop-shadows to buttons.
- **Inputs**: always use `<Input>` component (`@/shared/components/ui/Input`). Standard style: `bg-bg-card border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm`.
- **Skeletons**: always use native `@/shared/components/ui/Skeleton.tsx` with pulse animation. Never import third-party `react-loading-skeleton` or its CSS.
- **Dialogs**: desktop use `DialogContent` (Radix), mobile use `BottomSheet`. Always pass `title`, always have `aria-describedby`
- **Icons**: `lucide-react` only. Named imports. No emoji as icons
- **i18n**: all user-facing strings through `useTranslation()`
- **LearningToolbar**: all walkthrough pages (labs, courses, bootcamp rooms) must include `LearningToolbar` with a fullscreen toggle using `useRoomSession()`. Never place the fullscreen button inline in page content — it belongs exclusively in the toolbar (desktop fixed sidebar + mobile floating panel). Use `<Minimize2>`/`<Maximize2>` icons from lucide-react. If the page already has a `LearningToolbar`, add the fullscreen action to its existing `actions` array. Never mount `WalkthroughToolbar` in `StudentLayout`.
- **Walkthrough text styling**: all walkthrough/learning page text must match the blog page text styling. Body text: `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8`. The walkthrough is inspired by the blog styling — clean, bold, well-spaced monospaced text. Never use `leading-relaxed` on walkthrough text — always `leading-[2] md:leading-[2.2]`. **Headings in walkthrough narrative text** (via `CodeBlockRenderer` markdown) must match blog heading components exactly:
  - h2 (blog `Heading`): `text-2xl md:text-4xl font-black uppercase tracking-tight mb-6 md:mb-8 text-text-primary`
  - h3 (blog `SubHeading`): `text-xl md:text-2xl font-black uppercase tracking-tight mb-5 md:mb-6 text-accent`
  - h4: `text-base md:text-lg font-black uppercase tracking-tight mb-4 mt-4 text-text-primary`
  - All walkthrough headings: `font-black uppercase tracking-tight`, no `leading-snug`, no `max-w-none` on headings
- **Walkthrough steps on one page**: all walkthrough pages (courses, labs, bootcamp rooms) must render ALL step cards on a single page. Never navigate to a different page/route for the next step. The Next/Continue button scrolls to the next step card on the same page (`scrollIntoView`). Each step card gets an `id` attribute for scroll targeting. This avoids unnecessary page reloads and keeps the student in context
- **Walkthrough full-width text**: walkthrough content must NOT use `wc-prose` (max-width: 64rem) width constraints. Text should fill the full viewport width like blog pages (`max-w-none`). The `wc-prose` class is only for code blocks and terminals, not for reading text
- **CommandBlock compact**: walkthrough command blocks must use compact padding: `px-3 py-1.5` header, `px-3 py-2` content, `space-y-1.5` gaps. Never use `p-4` padding on command block content — it wastes vertical space when multiple blocks are stacked

## Accessibility (Mandatory)

- Interactive elements: `min-h-[48px]` (44px acceptable on mobile)
- `role="button"` on divs: must have `aria-label` AND handle Enter + Space
- Form inputs: `<label>` via `htmlFor/id`, errors via `aria-describedby`
- Dialogs: `DialogContent` with `aria-labelledby`, focus trap, Escape key
- Loading states: `role="status"` or `aria-live="polite"`
- Animations: respect `prefers-reduced-motion` (CSS + MotionConfig + component check)
- Focus-visible: global accent outline — don't suppress it
- Skip link: `<a href="#main-content">` in layouts

## Motion Rules

- **Reveal**: prefer `ScrollReveal` over hand-rolled `motion.div` reveals
- **Canonical easing**: `[0.22, 1, 0.36, 1]` (smooth) or `[0.16, 1, 0.3, 1]` (expo-out for landing reveals)
- **Carousel easing**: `[0.25, 0.46, 0.45, 0.94]`
- **Reduced motion**: three layers — CSS media query + `MotionConfig` + `useReducedMotion()` checks
- **New carousels**: use `useAutoPlay` hook, check `useReducedMotion()`, ArrowLeft/Right keyboard, `AnimatePresence mode="wait"`

## Architecture

- **Import alias**: `@/` everywhere. Avoid relative imports beyond one level
- **Dependency direction**: `core` -> `shared` -> `features` (never reverse)
- **React.memo**: use on heavy/presentational components. Lazy-load below-the-fold canvas
- **Z-index scale**: navbar `z-[100]`, dialog overlay `z-[200]`, dialog content `z-[201]`, toast `z-[500]`, page loader `z-[9999]`

## Z-Index Quick Reference

`z-[90]` mobile nav overlay / `z-[100]` navbar / `z-[110]` navbar logo / `z-[120]` BottomSheet overlay / `z-[130]` BottomSheet content / `z-[150]` ConsentBanner / `z-[200]` Dialog overlay / `z-[201]` dialog content / `z-[300]` tooltip / `z-[500]` toast / `z-[9999]` page loader

## Do Not Reintroduce

- `useNavInvert` hook + `data-nav-invert` attributes
- `PublicBottomNav`, `GoCodeCarousel`, `CardGrid` components
- `react-loading-skeleton` package imports
- Dual walkthrough toolbars (`WalkthroughToolbar` in `StudentLayout`)
- `.snap-container-proximity` CSS class
- `font-display` utility class
- Fixed `lg:h-dvh` or `h-dvh` on content snap sections (always use `min-h-dvh`)
- Navbar scroll-hide/invert behavior
- `zustand` or `@tanstack/react-query` (installed but unused)
- Inline fullscreen buttons on walkthrough pages (use `LearningToolbar` instead)
- Navbar link buttons with borders (borders only on badges and status indicators)

## Layouts Reference

| Layout | Clearance | Notes |
|--------|-----------|-------|
| `LandingLayout` | None (hero clears own space) | No `<Footer />` (last snap section) |
| `StudentLayout` | `pt-20 md:pt-24` | Topbar only |
| `AdminLayout` | `pt-20 md:pt-24` | Forced dark, `data-theme-persist="dark"` |
| `AuthFormLayout` | 2-col grid, `max-w-lg` form | Globe pinned bottom-right |

## Layout Stability

**Rule: Major layout containers must have stable, intentional dimensions.** Changes in child content must not cause unexpected resizing or movement of surrounding content. Dynamic content adapts within the established layout rather than redefining the layout geometry.

- **Carousels**: must maintain a stable viewport while slides change. Different slide content lengths must not cause the page or surrounding sections to jump. Use `relative w-full min-h-dvh flex flex-col` on carousel sections.
- **Full-section carousels** (Courses, Labs): `my-auto` on the padded wrapper, `overflow-x-clip` around the AnimatePresence slide region, and `line-clamp-*` on variable-length text where slides must not change section height.
- **Snap sections**: use `min-h-dvh` and grow when content exceeds the viewport — content must never clip under the fixed navbar or get cut at the section bottom (that was the "eyebrow enters navbar / snipped content" bug). On desktop, each snap section = one viewport. Content must not exceed one viewport at ~1366×768. When a composition grows past that, split into multiple leaner snap sections.
- **Snap sections under `y mandatory` must not exceed ~one viewport** (at 1366×768): a snap area taller than the screen makes one wheel tick skip past its end, so users land mid-section and snapping fights them. When a composition grows past that (e.g. install pages stacking header + banner + two option cards ≈ 1000px), split it into multiple leaner snap sections instead of letting it grow. Precedent: tool install sections are split into "Install" (header + auto-install banner + installer card) and "Build from source" (full-width build card).
- **Course/lab visuals**: treat SVG/course icons as first-class section visuals, not card content. They must have their own dedicated visual region with sufficient scale, preserved aspect ratio, and stable responsive geometry.
- **Split-screen heading pattern**: on desktop split-screen sections where the left column has sparse content (kicker + title + optional short description), use `items-center` on the grid row and `lg:justify-center` on the content column so the heading vertically centers against the right column. Reference: `ServiceDetailPage.tsx` — kicker as `<span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">`, title as `<h2 className="text-3xl md:text-5xl lg:text-7xl font-black ...">`, description as `<p className="text-base sm:text-lg ...">`. Never use `lg:items-start` with sparse left columns — it wastes vertical space and breaks visual balance.
- **Snap viewport rule**: one vertical scroll on desktop = one viewport. Each snap section must fit within one viewport at ~1366×768. Users should have to make multiple scrolls to get to the next viewport. If content exceeds one viewport, split into additional snap sections. This is enforced on all public pages and landing sections.
- **Carousel full-bleed**: DragMarquee carousels inside padded sections must break out of parent padding using negative margins (`-mx-3 md:-mx-4 lg:-mx-6`) on a wrapper div. Never let carousel cards get clipped at section edges. Landing section carousels already follow this pattern — public page carousels must match.
- **Section carousel pattern**: when replacing a `CoursesCarousel` or similar built carousel with a shared `Carousel` + inline card, use the blog-carousel card pattern: `Link` wrapping a card with `flex flex-col md:flex-row`, text left, visual right, `min-h-[340px] md:min-h-[280px]` for stable height, `line-clamp-*` on variable text. This keeps the section height predictable across different content lengths.

## Profile Pages

- **SVG logos, not icon packs**: on the profile pages (student `/dashboard/profile`, public `@/:username`) never use `lucide-react` icons (or custom `Icon*` glyphs) to represent achievements or completed rooms/bootcamp phases/labs/courses — use their dedicated SVG logo assets: `HpbAvatar` (bootcamp phases), `BootcampBadge` (bootcamp), `CpLogo` (CP), and the course icons from `COURSE_ICON_MAP`. The recent-activity feed (`ActivityTimeline`) must reuse those same SVGs
- **Compact, organised cards**: profile content and cards must stay compact and well organised — consistent `rounded-2xl` cards, tight `gap`s, aligned module headers, `line-clamp`/truncate on variable text. No oversized or sprawling card stacks
- **Protected cards — never modify**: the stats/overview strip (`ProfileMetricsStrip`) and the identicon/identity card (`ProfileIdentityBlock`) are frozen. Do not restyle, resize, or restructure them

## Admin Dashboard Rules

- **Same design language**: Admin uses the same tokens, components, and patterns as Student Dashboard and public site
- **Forced dark**: `data-theme-persist="dark"` on AdminLayout
- **Shared components**: Use `StatCard`, `DataTable`, `Button`, `Badge`, `Dialog`, `ConfirmDialog` — never create custom versions
- **Color tokens only**: Use `text-accent`, `text-red-400` (destructive), `text-text-muted` — never `emerald-500`, `blue-400`, `zinc-400`, `amber-400`
- **Touch targets**: All interactive elements `min-h-[44px]` — pagination buttons, icon buttons, table action buttons
- **i18n**: All user-facing strings through `useTranslation()` — no hardcoded English
- **Z-index**: `z-[100]` topbar, `z-[90]` secondary navigation, `z-[200]` dialog overlays

## Validation

After changes, run: `npm run typecheck`, `npm run lint`, `npm run build`
