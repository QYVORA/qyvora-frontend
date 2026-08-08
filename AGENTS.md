# QYVORA Frontend — Design Conventions

## Accent Color

The source of truth is the SVG logo: **`#06B66F`**.

- CSS variable: `--color-accent` in `src/styles/index.css`
- `manifest.webmanifest` `theme_color`: `#06B66F`
- Never use `#66B870` or any other green — always `#06B66F`
- Tailwind utility: `text-accent`, `bg-accent`, `border-accent`

## Text On Accent (on-accent)

Text/icons/borders rendered **on top of an accent surface** (accent buttons, active pills, badges, selection highlight) use the `on-accent` token — never `text-bg`.

- `--color-on-accent` resolves to near-black (`#000000`) in BOTH dark and light themes, because the accent stays green in both.
- Tailwind utilities: `text-on-accent`, `border-on-accent`
- `text-bg` is reserved strictly for "the page background color" and must NOT be used on accent surfaces (in light mode `--color-bg` is near-white, making accent-button text invisible).
- Covers: `.btn-primary` (CSS), `Button.tsx` primary variant, `selection:*`, and all `bg-accent text-*` call sites.

## Typography

Mono throughout — JetBrains Mono. No `font-sans` override exists.

## Border Radius

| Element | Radius |
|---------|--------|
| Cards / modals / panels | `rounded-2xl` |
| Buttons / inputs | `rounded-xl` |
| Badges / pills | `rounded-lg` or `rounded-full` |
| Small icon buttons | `rounded-lg` |
| Window controls / terminal chrome | `rounded-lg` |

Never mix radius scales within the same component.

## Button System

Three tiers defined in `src/styles/index.css`:

| Class | Usage |
|-------|-------|
| `btn-primary` | Primary CTA (accent bg) |
| `btn-secondary` | Secondary action (bordered) |
| `btn-danger` | Destructive action (red) |

All buttons: `!rounded-xl`, `text-[10px]`, `font-black`, `uppercase`, `tracking-widest`.

## Input Fields

Standard pattern:
```
bg-bg border border-border rounded-xl py-3 px-4 text-text-primary
focus:border-accent outline-none font-mono text-sm
```

- Border radius: always `rounded-xl`
- Focus ring: `focus:border-accent` (no extra `focus:ring-*`)
- Hover: `hover:border-border/80` is acceptable for enhanced feedback

## Disabled State

All disabled elements use `disabled:opacity-50` — no exceptions.

## Card Border Opacity

| Context | Opacity |
|---------|---------|
| Default card | `border-border/30` |
| Subtle / landing sections | `border-border/20` |
| Interactive hover state | `border-accent/30` |
| Elevated / highlighted | `border-border/50` |

## Badge Styles

Canonical pattern:
```
px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
```

- Font size: `text-[9px]` (standard) or `text-[10px]` (slightly larger)
- Border radius: `rounded-lg` (never `rounded-md` or `rounded-sm`)

## H1 Page Titles

| Context | Pattern |
|---------|---------|
| Marketing / landing hero (PublicHeroSection) | `font-black text-text-primary leading-[1.08] tracking-tight w-full relative` with `block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem]` |
| Student dashboard pages | `text-4xl md:text-6xl` |
| Admin / leaderboard pages | `text-4xl md:text-5xl lg:text-6xl` |
| Auth form headings | `text-3xl` |

Never go below `text-3xl` for an h1.

## Hero Sections (PublicHeroSection)

All public/marketing page heroes use the `PublicHeroSection` wrapper from `@/shared/components/PublicHeroSection`.

**Props:**
- `children` — badge, h1, description, CTAs
- `rightContent` — optional ReactNode for right-column image (renders on `lg:` screens)
- `mask` — `"right"` (default, globe pages) or `"none"` (single-column pages)
- `showGlobe` — defaults to `true`

**Layout handled by wrapper:**
- Full-viewport height: `min-h-dvh md:h-dvh`
- `GridBoxedBackground` with dark bg (`bg-bg`)
- Optional `HackerGlobe` (hidden on mobile via `hidden md:flex`)
- 2-column grid on `lg:`, single-column on mobile
- Left column padding: `px-3 md:px-4 lg:px-6 pt-20 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16`
- Inner text wrapper: `space-y-5 sm:space-y-6`
- **Desktop view must not be modified** — keep `lg:grid-cols-2`, `lg:items-center`, `md:h-dvh`
- **CTA buttons on mobile**: use `mt-auto` to push them to the bottom of the flex column

**Text color convention on dark hero backgrounds:**

All hero sections use `bg-bg` (black). Children must use dark-theme text colors — never `text-bg` (which is black and invisible on black).

| Element | Class |
|---------|-------|
| h1 heading | `text-text-primary` |
| Highlighted word in h1 | `text-accent` |
| Description paragraph | `text-text-secondary` |
| Badge / label | `text-text-muted` |
| Icon in badge | `text-accent` |
| Stat cards border | `border-border/30` |
| Stat cards bg | `bg-bg-card` |
| Stat values | `text-text-primary` |
| Stat labels | `text-text-muted` |

**Description pattern:**
```
text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono
```
Always ONE sentence.

**CTA pattern:**
```
flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2
```

**Image right column (rightContent):**
```tsx
<div className="relative hidden lg:flex items-center justify-center w-full h-full">
  <div className="relative z-10 w-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
    <img src={...} alt="..." className="w-full h-auto object-contain" />
  </div>
</div>
```

**Single-column pages** (Services, Contact): Use `mask="none"`, no `rightContent`, no globe.

**Navbar inversion:** Hero sections use `data-nav-invert` attribute to signal the navbar to invert its colors for contrast over the hero.

## Container Widths

The entire site uses a **unified stretched layout** — no max-width constraints on page containers. Content fills the viewport width with consistent side padding.

| Context | Max Width | Side Padding |
|---------|-----------|--------------|
| All pages (landing, public, auth, dashboard) | **None** (full width) | `px-3 md:px-4 lg:px-6` |
| Auth form wrappers | `max-w-lg` / `max-w-md` (form only) | Inherited from parent |
| Modals | `max-w-xl` to `max-w-2xl` | Modal handles own padding |

**Rule: Never add `max-w-[1600px]`, `max-w-6xl`, or similar constraints to page-level containers.** Content should stretch edge-to-edge with only the standard `px-3 md:px-4 lg:px-6` side padding. The student dashboard is the reference — all pages follow its pattern.

## Empty State Icons

Pass icons at `w-10 h-10` or `w-12 h-12` to the shared `EmptyState` component.

## Dialogs / Modals

- Use the shared `DialogContent` wrapper from `@/shared/components/ui/Dialog`
- Always pass a `title` prop (rendered as `RadixDialog.Title`)
- The wrapper auto-injects `aria-describedby` for accessibility
- For raw `RadixDialog.Content` (e.g. SimulatedTerminal), always include a `RadixDialog.Title` element

## Z-Index Scale

| Layer | Z-Index |
|-------|---------|
| Mobile drawer backdrop | `z-[60]` |
| Mobile drawer content | `z-[70]` |
| Dropdowns (notifications) | `z-[80]` |
| Mobile nav overlay | `z-[90]` |
| Navbar / bottom nav | `z-[100]` |
| Navbar logo / actions | `z-[110]` |
| BottomSheet overlay | `z-[120]` |
| BottomSheet content | `z-[130]` |
| InstallBanner | `z-[140]` |
| CommunityPopup | `z-[145]` |
| ConsentBanner | `z-[150]` |
| Dialog overlay | `z-[200]` |
| Dialog content | `z-[201]` |
| Stacked dialog overlay | `z-[210]` |
| Stacked dialog content | `z-[211]` |
| Context menu (network tool) | `z-[220]` |
| Tooltip | `z-[300]` |
| Toast | `z-[500]` |
| Page loader / fullscreen overlay | `z-[9999]` |

## PWA

- `manifest.webmanifest` icons use `/favicon.webp`
- `theme_color` must match accent: `#06B66F`
- Install prompt managed by `src/features/student/services/pwa.ts`
- Install banner uses `usePopupManager('install', 5)` (highest priority)

## Popup Priority (usePopupManager)

| Popup | Priority |
|-------|----------|
| Consent banner | 1 |
| Onboarding tour (spotlight) | 2 |
| Community popup | 3 |
| Promotional system | 4 |
| Install banner | 5 |

## API Pattern

- Base URL: `VITE_API_BASE_URL` env var
- Auth: `Authorization: Bearer <token>` header
- CSRF: Double-submit cookie (`csrf_token` cookie + `X-CSRF-Token` header)
- All requests go through `src/core/services/api.ts` (Axios instance)

## Layout System (Unified Stretched Layout)

All pages across the site use the same stretched layout pattern, matching the student dashboard. This ensures a uniform UI with minimal side spacing.

**Standard side padding (applied everywhere):**
```
px-3 md:px-4 lg:px-6
```

**Reference: Student Dashboard** — `px-3 md:px-4 lg:px-6` with no max-width. All other pages follow this.

### Navbar

- File: `src/shared/components/layout/Navbar.tsx`
- Padding: `px-3 md:px-4 lg:px-6` (matches dashboard)
- **Scroll hide/show behavior**: Works on ALL screen sizes (mobile + desktop)
  - Hides on scroll down, reappears on scroll up
  - Attached to `.snap-container` if present, otherwise `window`
- Height: `h-[80px]`

### Footer

- File: `src/shared/components/layout/Footer.tsx`
- Outer padding: `px-3 py-10 md:px-4 md:py-20 lg:px-6`
- No max-width constraint on inner container

### Landing Page Sections

All snap sections (`min-h-dvh md:h-dvh`) use:
- Side padding: `px-3 md:px-4 lg:px-6`
- No `max-w-6xl` or `max-w-[1600px]` on inner containers

**Sections with bento grids (Labs, Bootcamp, Courses, Pillars, Services):**
- Top padding: `pt-24 md:pt-28 lg:pt-32` (clears 80px fixed navbar)
- Bottom padding: `pb-6 md:pb-8 lg:pb-10`
- Compact section headers: `text-lg md:text-xl lg:text-2xl font-black` with `mb-2 md:mb-3`
- No section descriptions — title only

**Sections with sidebar layouts (Team, QuiteRoot, Anansi, Blogs, Market, Leaderboard):**
- Padding: `py-12 sm:py-10 md:py-16 lg:py-20`

### Auth Pages

- `AuthFormLayout`: form column uses `px-3 md:px-4 lg:px-6 py-12 md:py-16`
- `LoginPage` desktop: form overlay uses `px-3 md:px-4 lg:px-6`
- `LoginPage` mobile: uses `px-3`
- Auth form wrappers keep `max-w-lg` / `max-w-md` for the form itself

### Public Pages

- `PublicProfilePage`: `px-3 md:px-4 lg:px-6` (no max-width)
- `BlogPostPage`: all containers use `px-3 md:px-4 lg:px-6`
- `BlogsPage`: `px-3 md:px-4 lg:px-6`
- `TermsContentSection`: `px-3 md:px-4 lg:px-6`

## Product Cards (Marketplace / Dashboard)

Product cards use a consistent pattern across the site:

**Card structure:**
```
border border-border/30 bg-bg-card rounded-2xl overflow-hidden
  ├── Cover image area: aspect-[16/9] with AuthImage + gradient overlay
  └── Content area: p-4 with title, description, price, actions
```

**Key rules:**
- **Never use `aspect-square`** on product cards — use `aspect-[16/9]` for the cover image
- Use `AuthImage` component (from `@/shared/components/ui`) for product images — they are behind auth (`/uploads/cp-products/`, `/uploads/bootcamps/`)
- Product images come ONLY from the DB/admin uploads — do NOT pass a `fallback` prop (and never reference the deleted `@/assets/sections/stats/cp-earned-bg.webp`). `AuthImage` renders nothing when there's no usable src.
- Cover image gradient: `bg-gradient-to-t from-bg-card via-transparent to-transparent`
- Hover effect: `group-hover:scale-105` on the image with `transition-transform duration-500`

**Files:**
- Marketplace: `src/features/student/pages/MarketplacePage.tsx`
- Dashboard: `src/features/student/pages/DashboardPage/index.tsx` (`DashboardProductCard`)

## Terms Page Layout

- Desktop: horizontal accordion strips (expand/collapse on click)
- Mobile: stacked terminal-style cards (always expanded)
- Uses `AnimatePresence` from `motion/react` for expand/collapse animation
- Each strip has: section number (`text-accent/60`), title, chevron indicator
- Content padding: `px-5 pb-5 pl-15` inside expanded strips

## Removed Components

- **CardGrid** (`src/shared/components/card-grid/`) — removed, was unused. Never add it back.
