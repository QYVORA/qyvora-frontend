# Design System

> **Status:** ✅ IMPLEMENTED  
> **Source:** `src/styles/index.css` with Tailwind CSS v4  
> **Theme:** Dark mode only

## Accent Color

**Source of truth:** SVG logo `#06B66F`

- CSS variable: `--color-accent` in `src/styles/index.css`
- Tailwind utility: `text-accent`, `bg-accent`, `border-accent`
- Never use `#66B870` or any other green

## Typography

**Font:** JetBrains Mono (monospace throughout)

- No `font-sans` override exists
- Applied globally via `--font-mono` CSS variable

## Border Radius

| Element | Radius | Class |
|---------|--------|-------|
| Cards / modals / panels | 16px | `rounded-2xl` |
| Buttons / inputs | 12px | `rounded-xl` |
| Badges / pills | 8px / full | `rounded-lg` / `rounded-full` |
| Small icon buttons | 8px | `rounded-lg` |

Never mix radius scales within the same component.

## Button System

Three tiers defined in `src/styles/index.css`:

| Class | Usage | Style |
|-------|-------|-------|
| `btn-primary` | Primary CTA | Accent bg, dark text |
| `btn-secondary` | Secondary action | Bordered, transparent |
| `btn-danger` | Destructive action | Red bg |

All buttons: `!rounded-xl`, `font-black`, `uppercase`, `tracking-[0.08em]`.

## Shared Components

| Component | Location | Variants |
|-----------|----------|----------|
| `Button` | `src/shared/components/ui/Button.tsx` | primary, secondary, danger, ghost |
| `Input` | `src/shared/components/ui/Input.tsx` | with/without icon slot |
| `Badge` | `src/shared/components/ui/Badge.tsx` | default, accent, success, warning, danger, info |
| `Identicon` | `src/shared/components/Identicon.tsx` | jdenticon SVG with default border/bg |

## Identicon Defaults

The `Identicon` component (`src/shared/components/Identicon.tsx`) renders a jdenticon SVG that always fills its container.

**Base classes:** `aspect-square overflow-hidden bg-black` — no border, no radius.

- The identicon is always **square**; never place it in a non-square container (this distorts the shape).
- **Borders are owned by the caller.** Any border wrapping an identicon must wrap the *exact* identicon shape and size — never nest a second border inside the container, and never use a different radius than the clip.
- Recommended wrapper: `rounded-xl overflow-hidden bg-black border-2 border-accent` (or `border border-accent/40` for a lighter ring) with the identicon at `w-full h-full`.
- Circular avatars: wrap in a `rounded-full overflow-hidden` container and pass `rounded-full` to the identicon so the ring matches the circle.
- Profile pages (`/dashboard/profile` and `/:handle`) always render the identicon via `ProfileIdentityBlock` at `w-16 h-16 sm:w-20 sm:h-20`.

## Auth Form Layout

`AuthFormLayout` (`src/shared/components/layout/AuthFormLayout.tsx`):

- **Never place an opaque background over the decorative backdrop** (`GridBoxedBackground` / globe). The form column and form cards are translucent (`bg-bg/70` + `backdrop-blur`) so the backdrop shows through.
- **Mobile:** top-aligned (`justify-start`, no `my-auto`) — the form starts under the top padding instead of floating mid-screen. Full width (`px-3`, no max-width).
- **Desktop:** two-column grid — left `AuthHero` (globe), right form column at `max-w-lg`, vertically centered (`my-auto`).
- **No forced scroll.** Use `min-h-dvh` (natural page scroll) instead of `md:h-dvh md:overflow-y-auto`, so short forms never scroll and tall forms scroll only when needed.

## Skeleton Components

All skeletons must match the real component's size, scale, and structure:

- Avatar placeholders mirror the real avatar box (e.g. `ProfileSkeleton` uses `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl` to match the `ProfileIdentityBlock` identicon).
- Card skeletons use the same grid, padding, and aspect ratios as the live cards (e.g. `aspect-square` learning cards, `aspect-[16/9]` product covers, `w-9 h-9 md:w-10 md:h-10` leaderboard avatars).
- Icon chips, buttons, and stat cells use identical dimensions to their real counterparts.

## Scroll to Top

`ScrollToTop` (`src/shared/components/ScrollToTop.tsx`) is a fixed button:

- **Mobile:** `bottom-[calc(3.75rem+env(safe-area-inset-bottom))] left-4` — sits just above the fixed bottom nav, aligned with it, and clears the safe-area inset.
- **Desktop (sm+):** `bottom-6 left-8`.
- Z-index: `z-[9999]`.

## Input Fields

Standard pattern:
```
bg-bg-card border border-border rounded-xl py-3 px-4 text-text-primary
placeholder:text-text-muted focus:border-accent outline-none font-mono text-sm
```

With icon: `pl-12 pr-4` (handled by shared `Input` component via `icon` prop).

## Badge Styles

Canonical pattern:
```
px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
```

## Card Styles

| Context | Border |
|---------|--------|
| Default | `border-border/30` |
| Subtle | `border-border/20` |
| Hover | `border-accent/30` |
| Elevated | `border-border/50` |

## Learning Card Rule

All learning cards — courses, labs, bootcamp phases and rooms (public pages **and** student dashboard) — must follow the same pattern. Reference: `CoursesPage`, `LabsPage`, `DashboardPage`.

**Card shell:**
```
group/card relative aspect-square rounded-2xl border border-border/30 bg-bg-card
p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col text-left
```

**Slots (top → bottom):**

| Slot | Classes |
|------|---------|
| Icon chip | `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20` + `w-4 h-4 text-accent` icon |
| Badge pill | `px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20` |
| Title | `text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1` |
| Description | `text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 break-words flex-1 mb-2` |
| Meta + CTA row | `flex items-center justify-between mt-auto` — meta left, accent pill (`px-3 py-1.5 rounded-lg ... bg-accent text-on-accent group-hover/card:brightness-110 group-active:scale-95`) right |

**Grid wrapper:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`

**Media variant (bootcamp phases):** a centered `HpbAvatar` fills the `flex-1` area instead of an icon chip (`HpbPage`).

## Public Hero Right Column (Avatars)

`StudentHeroSection` renders `rightContent` as a grid column. On mobile the avatar/image must remain visible — use `md:hidden lg:flex` on the wrapper (never `hidden lg:flex`) so it shows below the hero text on phones and on the right column from `lg` up. Keep the image bounded on mobile (e.g. `max-w-[220px] sm:max-w-[260px] lg:max-w-[80%]`).

## Z-Index Scale

| Layer | Z-Index |
|-------|---------|
| Dropdowns | `z-[80]` |
| Mobile nav | `z-[90]` |
| Navbar | `z-[100]` |
| BottomSheet | `z-[120]` |
| Install banner | `z-[140]` |
| Consent | `z-[150]` |
| Dialog | `z-[200]` |
| Tooltip | `z-[300]` |
| Toast | `z-[500]` |
| Page loader | `z-[9999]` |

## H1 Page Titles

| Context | Size |
|---------|------|
| Marketing hero | `text-[2rem]` to `text-[3rem]` (responsive via PublicHeroSection). Use `text-text-primary` for main text, `text-accent` for highlighted words. |
| Dashboard | `text-4xl md:text-5xl` |
| Admin | `text-4xl md:text-5xl lg:text-6xl` |
| Auth forms | `text-3xl md:text-4xl lg:text-5xl` |
| Not found | `text-4xl md:text-6xl` |

**Important:** Hero sections use `bg-bg` (black) backgrounds. All hero children must use dark-theme text colors (`text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-accent`). Never use `text-bg` on dark backgrounds — it is invisible.

## Container Widths

The entire site uses a **unified stretched layout** — no `max-w-*` constraints on page containers (see AGENTS.md).

| Context | Max Width | Side Padding |
|---------|-----------|--------------|
| All pages (landing, public, auth, dashboard) | **None** (full width) | `px-3 md:px-4 lg:px-6` |
| Auth form wrapper (desktop) | `max-w-lg` (form only) | Inherited from parent |
| Modals | `max-w-xl` to `max-w-2xl` | Modal handles own padding |

## Color Palette

Defined in `src/styles/index.css` via `@theme`:

```css
--color-bg:           #000000;
--color-bg-card:      #050505;
--color-bg-elevated:  #0b0b0b;
--color-accent:       #06B66F;
--color-text-primary: #EEF0EE;
--color-text-secondary: rgba(238, 240, 238, 0.70);
--color-text-muted:   rgba(238, 240, 238, 0.40);
--color-border:       rgba(171, 181, 192, 0.12);
```

## Animation

- **Duration:** `--dur-fast: 160ms`, `--dur-base: 260ms`, `--dur-slow: 420ms`
- **Easing:** `--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1)`
- **Reduced motion:** Respected via `MotionConfig reducedMotion="user"`
