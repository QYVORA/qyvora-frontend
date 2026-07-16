# Design System

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

All buttons: `!rounded-xl`, `text-[10px]`, `font-black`, `uppercase`, `tracking-widest`.

## Input Fields

Standard pattern:
```
bg-bg border border-border rounded-xl py-3 px-4 text-text-primary
focus:border-accent outline-none font-mono text-sm
```

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
| Marketing hero | `text-[2rem]` to `text-[3rem]` (responsive) |
| Dashboard | `text-4xl md:text-6xl` |
| Admin | `text-4xl md:text-5xl lg:text-6xl` |
| Auth forms | `text-3xl` |

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
