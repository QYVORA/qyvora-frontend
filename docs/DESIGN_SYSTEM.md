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

The `Identicon` component renders jdenticon SVGs with built-in styling via `cn()` merging:

**Default classes:** `bg-black border-accent/30 rounded-xl`

- **Dark backgrounds:** Default works — black bg + accent border
- **Accent backgrounds:** Override with `border-black` for contrast
- **Special cases (e.g. top-3 leaderboard):** Override with `border-0` to suppress
- Consumer `className` overrides defaults via tailwind-merge

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
| Marketing hero | `text-[2rem]` to `text-[3rem]` (responsive via PublicHeroSection) |
| Dashboard | `text-4xl md:text-5xl` |
| Admin | `text-4xl md:text-5xl lg:text-6xl` |
| Auth forms | `text-3xl md:text-4xl lg:text-5xl` |
| Not found | `text-4xl md:text-6xl` |

## Container Widths

| Context | Max Width |
|---------|-----------|
| Marketing | `max-w-[1600px]` |
| Dashboard | `max-w-6xl` |
| Auth forms | `max-w-lg` |
| Modals | `max-w-xl` to `max-w-2xl` |

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
