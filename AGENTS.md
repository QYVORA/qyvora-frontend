# QYVORA Frontend — Design Conventions

## Accent Color

The source of truth is the SVG logo: **`#06B66F`**.

- CSS variable: `--color-accent` in `src/styles/index.css`
- `manifest.webmanifest` `theme_color`: `#06B66F`
- Never use `#66B870` or any other green — always `#06B66F`
- Tailwind utility: `text-accent`, `bg-accent`, `border-accent`

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
| Marketing / landing hero (PublicHeroSection) | `font-black text-bg leading-[1.08] tracking-tight w-full relative` with `block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem]` |
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
- `GridBoxedBackground` with accent bg
- Optional `HackerGlobe` (hidden on mobile via `hidden md:flex`)
- 2-column grid on `lg:`, single-column on mobile
- Left column padding: `px-4 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-20 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16`
- Inner text wrapper: `space-y-5 sm:space-y-6`

**Description pattern:**
```
text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono
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

## Container Widths

| Context | Max Width |
|---------|-----------|
| Full page (marketing) | `max-w-[1600px]` |
| Dashboard / admin | `max-w-6xl` |
| Auth forms | `max-w-lg` |
| Modals | `max-w-xl` to `max-w-2xl` |

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
| Tooltip | `z-[300]` |
| Toast | `z-[500]` |
| Page loader / fullscreen overlay | `z-[9999]` |

## PWA

- `manifest.webmanifest` icons use `/favicon.png`
- `theme_color` must match accent: `#06B66F`
- Install prompt managed by `src/features/student/services/pwa.ts`
- Install banner uses `usePopupManager('install', 5)` (highest priority)

## Popup Priority (usePopupManager)

| Popup | Priority |
|-------|----------|
| Consent banner | 1 |
| Onboarding wizard | 2 |
| Community popup | 3 |
| Promotional system | 4 |
| Install banner | 5 |

## API Pattern

- Base URL: `VITE_API_BASE_URL` env var
- Auth: `Authorization: Bearer <token>` header
- CSRF: Double-submit cookie (`csrf_token` cookie + `X-CSRF-Token` header)
- All requests go through `src/core/services/api.ts` (Axios instance)
