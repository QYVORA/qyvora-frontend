# QYVORA Frontend — Complete UI Design System Specification

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** ✅ Production Implementation  
**Source of Truth:** This document + `src/styles/index.css` + existing component implementations

---

## Purpose

This document is the **complete, measurable, implementation-aware specification** of the QYVORA frontend UI design system. It documents the actual implemented design system based on deep inspection of the codebase, not theoretical guidelines.

**Use this document to:**
- Build new QYVORA pages while maintaining visual consistency
- Understand exact values for colors, typography, spacing, shadows, and animations
- Know which components exist and when to use each variant
- Ensure new UI matches the existing product without guessing

---

## Design System Principles

### Source of Truth Hierarchy

1. **Actual rendered frontend behavior** (what users see)
2. **Actual source code implementation** (component files)
3. **Design tokens in `src/styles/index.css`** (CSS custom properties)
4. **This documentation** (specification derived from 1-3)

### Core Design Identity

**QYVORA is:**
- **Dark, terminal-born** — Near-black backgrounds (#000000), surfaces lift in tiny steps
- **Monospaced typography** — JetBrains Mono everywhere, Space Grotesk for headings only
- **Single green accent** — #06B66F exclusively, never another green
- **Minimal decoration** — No purple gradients, no emoji icons, no heavy drop shadows
- **Technical precision** — Exact measurements, consistent patterns, predictable behavior

**QYVORA is NOT:**
- A generic SaaS theme
- A light, airy, rounded-corners aesthetic
- Multi-color gradient heavy
- Using emoji as icons
- A narrow blog-width reading experience

---

## 1. Color System

### Surface Ladder (Dark Theme — Default)

```css
--color-bg:             #000000    /* Pure black — page background */
--color-canvas:         #0b0d0e    /* Charcoal — actual page background */
--color-bg-alt:         #080808    /* First lift */
--color-bg-card:        #050505    /* Standard card surface */
--color-bg-elevated:    #0b0b0b    /* Elevated panels, secondary buttons */
```

**Calm System Surfaces** (migrated dashboard/profile/admin):
```css
--color-canvas:         #0b0d0e    /* Page background (charcoal, not black) */
--color-surface:        #121617    /* Cards, form fields, static panels */
--color-surface-raised: #181d1e    /* Menus, sheets, active utility panels */
```

**Usage Rule:** Surfaces lift through the ladder. Start with `bg-canvas` (pages), lift to `bg-surface` (cards), then `bg-surface-raised` (menus/sheets). Never use raw hex blacks in components — use tokens.

### Accent Color

```css
--color-accent:         #06B66F    /* THE ONLY GREEN */
--color-accent-rgb:     6, 182, 111
--color-accent-dim:     rgba(6, 182, 111, 0.05)
--color-accent-glow:    rgba(6, 182, 111, 0.12)
--color-on-accent:      #000000    /* Text/icons ON accent surfaces */
```

**Tailwind Utilities:** `bg-accent`, `text-accent`, `border-accent`

**Critical Rule:** NEVER use `#66B870` or any other green. Brand components (`Logo`, `QyvoraMark`) resolve accent via `var(--color-accent)` in their default `color` prop — never pass raw `#06B66F`.

### Text Colors

```css
--color-text-primary:   #EEF0EE                      /* Headings, important text */
--color-text-secondary: rgba(238, 240, 238, 0.70)    /* Body copy */
--color-text-muted:     rgba(238, 240, 238, 0.40)    /* Labels, metadata */
--color-text-tertiary:  rgba(238, 240, 238, 0.55)    /* Calm system tertiary */
```

**Tailwind Utilities:** `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-tertiary`

### Border Colors

```css
--color-border:         rgba(171, 181, 192, 0.18)    /* Default borders */
--color-border-strong:  rgba(6, 182, 111, 0.26)      /* Strong/accent borders */
--color-border-subtle:  rgba(178, 193, 194, 0.13)    /* Calm system borders */
```

**Tailwind Utilities:** `border-border`, `border-border-strong`, `border-border-subtle`

**Usage by Context:**
- Default cards: `border-border/30`
- Subtle/landing: `border-border/20`
- Interactive/hover: `border-accent/30` → `border-accent/60`
- Active/selected: `border-accent/60`
- Elevated surfaces: `border-border/50`

### Semantic Status Colors

```css
--color-danger:         #f87171    /* red-400 — destructive actions, errors */
--color-warning:        #fbbf24    /* amber-400 — warnings */
--color-info:           #38bdf8    /* sky-400 — informational */
--color-success:        #06B66F    /* accent — success (same as accent) */
```

**Tailwind Utilities:** `text-danger`, `bg-danger`, `text-warning`, `bg-warning`, `text-info`, `bg-info`, `text-success`, `bg-success`

### Difficulty Badge Colors

```css
--color-difficulty-beginner:     #38bdf8    /* sky-400 */
--color-difficulty-intermediate: #fbbf24    /* amber-400 */
--color-difficulty-advanced:     #f87171    /* red-400 */
```

**CSS Utilities:** `.badge-beginner`, `.badge-intermediate`, `.badge-advanced`, `.badge-accent`

**Single Canonical Component:** `DifficultyBadge` in `src/shared/components/learning/LearningCard.tsx` (re-exported via `@/shared/components/ui`)

### Code Syntax Highlighting Colors

**Raw Hex Exception — Documented in AGENTS.md:**

```javascript
// CodeBlock.tsx syntax palette
const TOKEN_CLASSES = {
  comment: 'text-text-muted italic',
  string: 'text-[#e5c07b]',    // Yellow
  number: 'text-[#d19a66]',    // Orange
  keyword: 'text-[#c678dd]',   // Purple
  type: 'text-[#56b6c2]',      // Cyan
  builtin: 'text-[#61afef]',   // Blue
  func: 'text-accent',         // Green #06B66F
  cmd: 'text-accent',          // Green #06B66F
  flag: 'text-[#56b6c2]',      // Cyan
  op: 'text-text-muted',
  prompt: 'text-text-muted',
  plain: 'text-text-secondary',
};
```

### Light Theme Overrides

```css
[data-theme="light"] {
  --color-canvas:         #E9ECE4    /* Soft green-grey, not white */
  --color-bg-card:        #DFE3D8
  --color-bg-elevated:    #D3D9CB
  --color-bg-alt:         #C9CFBE
  --color-text-primary:   #161C15
  --color-text-secondary: rgba(22, 28, 21, 0.86)
  --color-text-muted:     rgba(22, 28, 21, 0.70)
  --color-border:         rgba(22, 28, 21, 0.16)
  /* Accent fills/borders stay #06B66F; text accent resolves to the deeper
     --color-accent-text (#0B6937) so text passes AA on light surfaces. */
}
```

**Critical:** Light mode is NOT "everything white". Soft green-grey surfaces with intentional contrast. Surfaces *deepen* as they lift (page is the lightest step, cards/sheets step darker — the mirror of the dark ramp). Code blocks, terminals, simulations, diagrams and cyber panels stay dark via `data-theme-persist="dark"`.

### Acceptable Raw Hex Exceptions

Per AGENTS.md, raw hex values are ONLY allowed in:
- `CodeBlock.tsx` — syntax highlighting colors (documented above)
- `Ide.tsx`, `IdeBlock.tsx` — VS Code simulation colors
- `topicMap.ts` — data layer course/topic category colors
- SVG logo/avatar glyph artwork
- `CourseBadge`, `LabBadge`, `HpbAvatars`, bootcamp icon glyphs
- Simulator & diagram palettes (`network/*`, `SimulatedTerminal`, `skillRegistry`, `labs.ts`, `bootcampStructure`, `devices.ts`, `trafficEngine`, `dottedMap`)
- Admin chart palettes
- Third-party brand colors (Go `#00ADD8`, LinkedIn `#0A66C2`, WhatsApp `#25D366`)
- `<meta name="theme-color">` value

Everywhere else: **USE TAILWIND UTILITIES**

---

## 2. Typography System

### Font Stack

```css
--font-mono:    'JetBrains Mono', monospace     /* Body text — applied globally */
--font-display: 'Space Grotesk', sans-serif     /* Headings — applied globally to h1-h6 */
```

**Critical Rules:**
- Body text is ALWAYS `font-mono` (JetBrains Mono)
- Headings are ALWAYS `font-display` (Space Grotesk) — applied automatically via base CSS
- **NEVER add `font-display` class manually** — it's already on all heading elements
- All headings are ALWAYS `font-black` (900 weight), NEVER `font-bold`

### Micro Type Scale (Tokens)

```css
--text-kicker:    10px    /* Replaces text-[10px] */
--text-tiny:      9px     /* Replaces text-[9px] */
--text-overline:  8px     /* Replaces text-[8px] */
--text-micro:     7px     /* Replaces text-[7px] */
```

**Tailwind Utilities:** `text-kicker`, `text-tiny`, `text-overline`, `text-micro`

**Usage:**
- Kickers/eyebrows: `text-kicker`
- Compact badges: `text-tiny`
- Small labels: `text-overline`
- Ultra-compact metadata: `text-micro`

### Heading Scale — Canonical Variants

All headings: `font-black` (900), `font-display` (Space Grotesk — automatic), never use `font-bold`

#### h1 (Page Titles)

| Context | Classes | Reference |
|---------|---------|-----------|
| Page hero | `text-4xl md:text-6xl` | `dashboard/PageHeader.tsx` |
| Split-screen hero | `text-4xl md:text-6xl lg:text-7xl` | `ToolDocHero` |
| Panel (constrained card/rail) | `text-3xl md:text-4xl lg:text-5xl` | `AuthForm`, `LearningWorkspaceShell` |
| Fluid marketing hero | Varies by breakpoint | `HeroBlock` title |

**Minimum size:** `text-3xl` (never smaller for h1)

#### h2 (Section Headings)

| Variant | Classes | Use Case |
|---------|---------|----------|
| Page / standard section | `text-3xl md:text-5xl` | Standard page sections |
| Split-screen | `text-3xl md:text-5xl lg:text-7xl` | `ServiceDetailPage`, `ToolSectionHeader` |
| Compact bento / carousel | `text-lg` | Title only, no description |

**Minimum sizes:** 
- Compact bento: `text-lg`
- Standard: `text-2xl`+

#### h3 (Cards / Panels / Sub-sections)

```css
text-2xl md:text-3xl lg:text-4xl
```

### Kickers / Eyebrows

**Canonical Pattern:**
```css
text-kicker font-black uppercase tracking-[0.3em] text-accent
```

Alternative (narrower 3-way label): `text-tiny` acceptable

**Never use a small heading (`h3`/`h4`) as a kicker**

### Body Text & Reading Copy

**Blog / Walkthrough Body:**
```css
text-sm md:text-base text-text-secondary font-mono 
leading-[2] md:leading-[2.2] mb-6 md:mb-8
```

**Critical:** Never `leading-relaxed` on walkthrough text — always `leading-[2] md:leading-[2.2]`

**Walkthrough Headings** (via `CodeBlockRenderer` markdown — must match blog heading components):
- **h2:** `text-2xl md:text-4xl font-black uppercase tracking-tight mb-6 md:mb-8 text-text-primary`
- **h3:** `text-xl md:text-2xl font-black uppercase tracking-tight mb-5 md:mb-6 text-accent`
- **h4:** `text-base md:text-lg font-black uppercase tracking-tight mb-4 mt-4 text-text-primary`

All: `font-black uppercase tracking-tight`, no `leading-snug`, no `max-w-none` on headings

### Code / Terminal Text

```css
font-mono text-xs sm:text-[13px] leading-relaxed
```

### Mobile Typography Overrides

```css
@media (max-width: 767px) {
  h1 { font-size: 2.25rem !important; }      /* 36px */
  h2 { font-size: 1.85rem !important; }      /* ~30px */
  h3 { font-size: 1.5rem !important; }       /* 24px */
  body { font-size: 17px; line-height: 1.6; }
  
  .text-[9px], .text-[10px] {
    font-size: 13px !important;
    line-height: 1.4 !important;
    letter-spacing: 0.03em !important;
  }
}
```

---

## 3. Spacing System

### Base Scale

Tailwind v4 default scale (4px base):
- `px-1` = 4px
- `px-2` = 8px
- `px-3` = 12px
- `px-4` = 16px
- `px-5` = 20px
- `px-6` = 24px
- `px-7` = 28px
- `px-8` = 32px

### Page Gutters (Container Padding)

**Everywhere:**
```css
px-3 md:px-4 lg:px-6
```

**Vertical Rhythm:**
- Section spacing: `space-y-8`
- Card grids: `gap-4 md:gap-6`
- Content blocks: `mb-6 md:mb-8`

### Navbar Clearance

| Context | Clearance |
|---------|-----------|
| Public pages (under `PublicNavigation`) | `pt-24 md:pt-28 lg:pt-32` |
| Dashboard/Admin (under topbar) | `pt-20 md:pt-24` (provided by shell) |
| Sidebar sections | `py-12 sm:py-10 md:py-16 lg:py-20` |

### Component Spacing

**Buttons:**
- `sm`: `px-4 py-2`
- `md`: `px-5 py-2.5` or `px-7 py-3` (CSS classes)
- `lg`: `px-6 py-3` or `px-8 py-3.5`

**Inputs:**
```css
py-2.5 px-4      /* Calm system */
py-3 px-4        /* Legacy */
```

**Cards:**
- Standard: `p-4 md:p-5`
- Compact stat: `p-5 md:p-4`
- Media body: `p-4`

**Badges:**
- `sm`: `px-2 py-0.5`
- `md`: `px-2.5 py-1`

**CodeBlock:**
- Header: `px-3 py-2`
- Content: `p-4`
- Compact command block: `px-3 py-1.5` header, `px-3 py-2` content, `space-y-1.5` gaps

### Mobile Section Spacing Overrides

```css
@media (max-width: 767px) {
  .py-32 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
  .py-24 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
  .py-20 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
  .py-16 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
}
```

---

## 4. Layout System

### Container Rules

**Critical:** NO `max-w-*` on page-level containers. Content fills viewport width.

**Standard Page Container:**
```tsx
<div className="min-h-full bg-canvas">
  <SEO {...meta} />
  <div className="w-full space-y-8 px-3 pb-16 md:px-4 md:pb-20 lg:px-6 lg:pb-24">
    <PageHeader kicker="..." title="..." description="..." />
    {/* sections */}
  </div>
</div>
```

### Layout Shells

| Shell | Route Domain | Clearance | Rail Padding |
|-------|-------------|-----------|--------------|
| `PublicShell` | Marketing, tool docs, public profile | None (pages clear own) | N/A |
| `AppShell` | `/dashboard/*` | `pt-20 md:pt-24` | `lg:pl-[76px]` / `lg:pl-[264px]` |
| `AdminLayout` | `/admin/*` | `pt-20 md:pt-24` | `lg:pl-[76px]` / `lg:pl-[264px]` |
| `AuthFormLayout` | Auth pages | 2-col grid | `max-w-lg` form only |

### Grid Patterns

**Card Grid:**
```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
```

**Profile Portfolio:**
```css
lg:grid-cols-12
/* Left: lg:col-span-4 (sticky identity) */
/* Right: lg:col-span-8 space-y-6 (main content) */
```

**Two-Column Split:**
```css
grid md:grid-cols-2 gap-*
/* Use items-center when left column is sparse */
```

### Full-Viewport Sections

**Critical Rule:** Always `min-h-dvh`, NEVER `h-dvh` on content sections

```tsx
<section className="relative w-full min-h-dvh flex flex-col px-3 md:px-4 lg:px-6 pt-24 pb-8 md:pt-28 lg:pt-32">
  <div className="w-full my-auto">
    {/* Content centers with my-auto, collapses to top on overflow */}
  </div>
</section>
```

### Split-Screen Pattern

Desktop sections with sparse left column (kicker + title only):
```css
grid lg:grid-cols-2 items-center gap-8
/* Left column: lg:justify-center */
```

Reference: `ServiceDetailPage.tsx`

**Never:**
- Use `lg:items-start` with sparse left columns
- Let content bleed into navbar clearance zone
- Let sections overflow into adjacent sections

### Width Constraint System

Use `wc-*` classes, NEVER ad-hoc `max-w-*`:

| Class | Max Width | Usage |
|-------|-----------|-------|
| `.wc-prose` | `64rem` | Narrative text (technical reading width) |
| `.wc-code` | `56rem` | Code blocks |
| `.wc-terminal` | `56rem` | Terminal displays |
| `.wc-diagram` | `52rem` | Flow diagrams |
| `.wc-table` | `56rem` | Tables |
| `.wc-media` | `40rem` | Images |
| `.wc-interactive` | `52rem` | Playgrounds, quizzes |

**Mobile:** All reset to `max-width: 100%` below 768px

**Walkthrough Exception:** `wc-prose` must NOT constrain walkthrough reading text (walkthroughs fill viewport like blog pages)

---

## 5. Border & Radius System

### Border Radius (Never Mix Scales)

| Element | Radius | Class |
|---------|--------|-------|
| Cards, modals, panels, modules | 16px | `rounded-2xl` |
| Buttons, inputs, controls, tiles | 12px | `rounded-xl` |
| Badges, pills, compact chips | 8px | `rounded-lg` |
| Progress bars, status dots | full | `rounded-full` |

**Critical:** NEVER mix radius scales within the same component

### Border Patterns

**Cards:**
```css
/* Default */
border border-border/30

/* Subtle (landing) */
border border-border/20

/* Interactive/hover */
border border-accent/30
hover:border-accent/60

/* Active/selected */
border border-accent/60

/* Elevated */
border border-border/50
```

---

## 6. Elevation & Shadow System

### Card Shimmer (Top Edge Light Line)

```css
--card-shimmer: inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

**Usage:** `boxShadow: 'var(--card-shimmer)'` (inline style on CardBase/CardMedia)

### Card Shadow

```css
--card-shadow: 0 12px 40px rgba(0, 0, 0, 0.30);
```

### Raised Overlay Elevation

```css
--elevation-raised: 0 8px 24px rgba(0, 0, 0, 0.45);
```

**Usage:** Menus, sheets, elevated panels in calm system

### Button 3D Shadow

**Primary:**
```css
shadow: 0 3px 0 var(--color-on-accent)
active: translate-y-[2px] shadow-[0_1px_0_var(--color-on-accent)]
```

**Secondary:**
```css
shadow: 0 3px 0 var(--color-border-strong)
active: translate-y-[2px] shadow-[0_1px_0_var(--color-border-strong)]
```

---

## 7. Motion System

### Duration Tokens

```css
--dur-fast:  160ms
--dur-base:  260ms
--dur-slow:  420ms
```

### Easing Tokens

```css
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1)    /* Standard smooth */
```

**Alternative Easings:**
- Reveal (landing): `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)
- Carousel: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Standard Transitions

**Buttons & Cards:**
```css
transition-property: filter, transform, background-color, color, border-color, box-shadow;
transition-duration: var(--dur-base);
transition-timing-function: var(--ease-smooth);
```

**Image Hover:**
```css
transition: transform 500ms ease;
```

### Animations

**Feedback Animations:**
- `animate-shake-x` — Horizontal shake for wrong input (555ms)
- `pulse-error` — Border pulse for invalid fields
- `success-pop` — Scale pop for correct answers
- `glow-error` — Red glow for errors

**Page Loader:**
- `animate-athena-box-1/2/3` — Pulsing boxes (1.4s infinite, staggered)

**Marquee:**
- `.marquee-track` — Infinite horizontal scroll (42s linear)

**Border Effects:**
- `.border-beam` — Conic gradient rotation (4.8s infinite)
- `.nav-border-beam` — Linear sweep (3.8s)

**Dobia Mascot:**
- `.dobia-float` — Floating animation (6s)
- `.dobia-wave` — Wave animation (1.2s)

### Reduced Motion

**Three enforcement layers:**
1. CSS media query: `@media (prefers-reduced-motion: reduce)`
2. Motion React: `<MotionConfig reducedMotion="user">`
3. Hook check: `useReducedMotion()`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> **Scroll behavior**: there is **no global `scroll-behavior: smooth`** on `html`. It inherits into every scroll container (sidebar rail, panels, code blocks) and makes wheel/touch scrolling feel laggy. Programmatic scrolling requests smooth explicitly via `scrollIntoView({ behavior: 'smooth' })`; horizontal `.scroll-x` strips opt in to smooth themselves. The reduced-motion override above still forces `auto` everywhere as a safety net.

---

## 8. Icon System

### Sizes

| Context | Size Class |
|---------|------------|
| Inline UI icons | `h-4 w-4` |
| Buttons / actions | `h-3.5 w-3.5` to `h-5 w-5` |
| Module header chips | `h-4 w-4` |
| Large feature icons | `w-8 h-8` to `w-12 h-12` |
| Course/lab SVG glyphs | `w-11 h-11` to `w-14 h-14` |

### Icon Library

**Lucide React** exclusively. Named imports only. No emoji as icons.

**Examples:**
```tsx
import { User, Check, Copy, Star, Loader2 } from 'lucide-react';
```

### Icon Chips

```css
w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 
flex items-center justify-center text-accent
```

Icon inside: `w-7 h-7` or `w-6 h-6`

---

## 9. Component Specifications

### Button System

#### Button Component (`src/shared/components/ui/Button.tsx`)

**Variants:**

**Primary:**
```tsx
<Button variant="primary">Label</Button>
```
```css
bg-accent text-on-accent border-2 border-on-accent
font-bold uppercase tracking-[0.08em] rounded-xl
min-h-[44px]
shadow-[0_3px_0_var(--color-on-accent)]
active:translate-y-[2px] active:shadow-[0_1px_0_var(--color-on-accent)]
hover:brightness-110
```

**Secondary:**
```tsx
<Button variant="secondary">Label</Button>
```
```css
bg-bg-elevated text-accent border border-border
hover:bg-bg-card
shadow-[0_3px_0_var(--color-border-strong)]
```

**Danger:**
```tsx
<Button variant="danger">Label</Button>
```
```css
bg-danger/10 text-danger border border-danger/40
hover:bg-danger/20
```

**Ghost:**
```tsx
<Button variant="ghost">Label</Button>
```
```css
bg-transparent text-text-secondary border-transparent
hover:bg-bg-elevated hover:text-text-primary
```

**Sizes:**
- `sm`: `px-4 py-2 text-sm`
- `md`: `px-5 py-2.5 text-sm` (default)
- `lg`: `px-6 py-3 text-sm`

**Props:**
- `icon` — Leading icon
- `trailingIcon` — Trailing icon
- `loading` — Shows spinner, disables button
- `to` — Renders as router `<Link>`
- `href` — Renders as anchor
- `external` — Opens href in new tab
- `ariaLabel` — Accessible label for icon-only

#### CSS Button Classes (Direct Use)

```css
.btn-primary {
  @apply bg-accent text-on-accent font-black uppercase tracking-[0.08em] 
         rounded-xl px-7 py-3 border-2 border-on-accent 
         hover:brightness-110 active:scale-95;
}

.btn-secondary {
  @apply bg-bg-elevated text-accent font-black uppercase tracking-[0.08em] 
         rounded-xl px-7 py-3 border border-border 
         hover:bg-bg-card active:scale-95;
}

.btn-danger {
  @apply bg-danger/10 text-danger font-black uppercase tracking-[0.08em] 
         rounded-xl px-7 py-3 border border-danger/40 
         hover:bg-danger/20 active:scale-95;
}
```

**Note:** CSS classes use `font-black`, component uses `font-bold`

---

### Card System

#### CardBase (`src/shared/components/ui/Card.tsx`)

Plain surface card for stats, steps, text content.

```tsx
<CardBase href="/link" onClick={fn} active={bool} muted={bool}>
  {children}
</CardBase>
```

**Base Classes:**
```css
terminal-card group relative flex flex-col overflow-hidden 
rounded-2xl border bg-bg-card
```

**Border:**
- Idle: `border-accent/50`
- Hover/active: `border-accent/60`
- Muted: `opacity-60 cursor-default`

**Shimmer:** `boxShadow: var(--card-shimmer)` (inline style)

**Interactive Variants:**
- `href` (internal) → `<Link>`
- `href` + `external` → `<a target="_blank">`
- `onClick` → `<div role="button" tabIndex={0}>` with Enter/Space handlers

#### CardMedia (`src/shared/components/ui/Card.tsx`)

Card with top cover image. Used for bootcamps, products, services.

```tsx
<CardMedia 
  image={src} 
  imageAlt="..." 
  imageAspect="aspect-[16/9]"
  imageBadges={<Badge />}
  imageProgress={75}
>
  {body}
</CardMedia>
```

**Image Area:**
```css
relative overflow-hidden ${imageAspect}
```

**Image:**
```css
w-full h-full object-cover
transition: transform 500ms
group-hover:scale-[1.03]
```

**Body:**
```css
flex flex-1 flex-col p-4
```

**Progress Bar:**
```css
absolute bottom-0 left-0 right-0 h-[3px] bg-accent
```

**Product Card Rule:** ALWAYS `aspect-[16/9]`, NEVER `aspect-square`

#### CardStat (`src/shared/components/ui/Card.tsx`)

Compact horizontal stat card.

```tsx
<CardStat icon={<Icon />} value="42" label="XP" accent={false} href="/link" />
```

**Layout:**
```css
flex items-center gap-4 p-5 md:p-4
```

**Icon Container:**
```css
h-12 w-12 md:h-10 md:w-10 rounded-xl border shrink-0

/* Accent variant */
border-accent/30 bg-accent-dim text-accent

/* Default variant */
border-border bg-bg text-text-muted
```

**Value:**
```css
font-mono text-2xl md:text-xl font-black leading-none
```

**Label:**
```css
text-xs font-bold uppercase tracking-widest text-text-muted truncate
```

#### LearningCard (`src/shared/components/learning/LearningCard.tsx`)

**Canonical card for ALL learning content** (labs, courses, bootcamp phases, lessons, related items).

```tsx
<LearningCard
  type="lab"
  title="Title"
  description="..."
  to="/link"
  difficulty="beginner"
  cpReward="100"
  duration="30 min"
  badge={<LabBadge />}
  progress={75}
  view="grid"
/>
```

**Base Classes:**
```css
group/card relative rounded-2xl border border-border-subtle bg-surface
transition-[border-color,box-shadow,background-color] 
duration-[var(--dur-base)] ease-[var(--ease-smooth)]
```

**Grid View (Default):**
```css
h-full min-h-[220px] p-4 md:p-5 justify-between flex flex-col
```

**Expanded View (List):**
```css
p-4 md:p-5 gap-2 flex flex-col
```

**Icon Chip:**
```css
w-14 h-14 rounded-xl bg-accent/10 border border-accent/20
flex items-center justify-center text-accent shrink-0
```

**Title:**
```css
text-sm sm:text-base md:text-lg font-black text-text-primary
group-hover/card:text-accent transition-colors leading-snug
```

**Description:**
```css
text-xs sm:text-sm text-text-muted leading-relaxed 
line-clamp-3 font-mono
```

**Progress Bar:**
```css
w-full bg-surface-raised h-1.5 rounded-full overflow-hidden
/* Fill */
bg-accent h-full rounded-full 
transition-[width] duration-[var(--dur-slow)]
```

**Action Button:**
```css
px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest
bg-accent text-on-accent
group-hover/card:brightness-110 group-active:scale-95
```

#### CSS Card Classes

```css
.card-qyvora {
  @apply bg-transparent rounded-2xl;
  /* + dot-grid ::after */
  hover: transform: scale(1.01);
}

.card-accent {
  @apply rounded-2xl border border-accent/50;
  hover: border-color: rgba(6, 182, 111, 0.55);
}

.terminal-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 1rem;
  background: transparent;
  /* + dot-grid ::after + 1px top shimmer ::before */
}
```

---

### Badge System

#### Badge Component (`src/shared/components/ui/Badge.tsx`)

```tsx
<Badge variant="accent" size="md">Label</Badge>
```

**Variants:**
- `default`: `bg-bg-elevated text-text-muted border border-border/40`
- `accent`: `bg-accent/10 text-accent border border-accent/20`
- `success`: `bg-success/10 text-success border border-success/20`
- `warning`: `bg-warning/10 text-warning border border-warning/20`
- `danger`: `bg-danger/10 text-danger border border-danger/20`
- `info`: `bg-info/10 text-info border border-info/20`

**Sizes:**
- `sm`: `px-2 py-0.5 text-xs`
- `md`: `px-2.5 py-1 text-xs` (default)

**Base:**
```css
inline-flex items-center rounded-lg font-black uppercase tracking-widest
```

#### DifficultyBadge

Single canonical difficulty badge:

```tsx
import { DifficultyBadge } from '@/shared/components/ui';

<DifficultyBadge difficulty="beginner" />
```

**Classes:**
```css
.badge-beginner    /* sky-400 #38bdf8 */
.badge-intermediate /* amber-400 #fbbf24 */
.badge-advanced    /* red-400 #f87171 */
.badge-accent      /* accent fallback */
```

Pattern:
```css
text-{color} border-{color}/30 bg-{color}/10
```

---

### Input System

#### Input Component (`src/shared/components/ui/Input.tsx`)

```tsx
<Input 
  icon={<Icon />} 
  error="Error message" 
  placeholder="..." 
  {...props} 
/>
```

**Base Classes:**
```css
w-full min-h-[44px] bg-surface border rounded-lg 
py-2.5 px-4 text-body-sm text-text-primary
placeholder:text-text-tertiary outline-none
transition-[border-color,box-shadow]
```

**States:**
- Focus: `focus:border-accent`
- Error: `border-semantic-danger`
- Disabled: `disabled:opacity-50`

**With Icon:**
- Icon position: `absolute left-3.5 top-1/2 -translate-y-1/2`
- Input padding shifts to: `pl-11 pr-4`

**Error Display:**
```tsx
{typeof error === 'string' && (
  <p className="mt-1.5 type-meta text-semantic-danger" role="alert">
    {error}
  </p>
)}
```

#### Legacy Input Pattern

```css
bg-bg border border-border rounded-xl py-3 px-4 
text-text-primary placeholder:text-text-muted
focus:border-accent outline-none font-mono text-sm
```

**Error Class:**
```css
.input-error {
  border-color: color-mix(in srgb, var(--color-danger) 70%, transparent);
  animation: shake-x 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both,
             glow-error 0.6s ease-in-out 2;
}
```

---

### Dialog & Modal System

#### Dialog (Desktop)

**Implementation:** `src/shared/components/ui/Dialog.tsx` (Radix UI)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent title="Title" maxWidth="max-w-xl" description="...">
    {body}
  </DialogContent>
</Dialog>
```

**Overlay:**
```css
fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm
```

**Content:**
```css
fixed left-1/2 top-1/2 z-[201] 
-translate-x-1/2 -translate-y-1/2
terminal-card bg-bg-card border border-border rounded-2xl
overflow-hidden
```

**Header:**
```css
flex items-center justify-between 
px-5 py-4 border-b border-border 
bg-bg-card/50 backdrop-blur-md z-10
```

**Title:**
```css
text-xs sm:text-sm font-black text-text-primary 
uppercase tracking-widest
```

**Body:**
```css
p-5 sm:p-8
```

**Scrollable:**
```css
flex-1 overflow-y-auto min-h-0 overscroll-contain
```

**Max Widths:** `max-w-sm` through `max-w-7xl`

#### BottomSheet (Mobile)

**Implementation:** `src/shared/components/ui/BottomSheet.tsx` (Radix UI)

```tsx
<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetContent ariaLabel="Sheet title">
    {body}
  </BottomSheetContent>
</BottomSheet>
```

**Overlay:**
```css
fixed inset-0 z-[120] md:hidden bg-black/70
```

**Content:**
```css
fixed bottom-0 left-0 right-0 z-[130] md:hidden
terminal-card bg-bg-card border-t border-border/30
rounded-t-2xl max-h-[82svh] overflow-y-auto
```

**Safe Area:**
```javascript
style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
```

**Animation:**
- Enter: `slide-in-from-bottom`
- Exit: `slide-out-to-bottom`

**Rule:** Use `BottomSheet` for mobile, `Dialog` for desktop

---

### Loading & Empty States

#### Skeleton (`src/shared/components/ui/Skeleton.tsx`)

```tsx
<Skeleton variant="card" className="..." />
```

**Variants:**
- `text`: `h-3 w-full rounded`
- `card`: `h-32 w-full rounded-2xl`
- `icon`: `h-12 w-12 rounded-2xl`
- `image`: `aspect-video w-full rounded-2xl`
- `title`: `h-6 w-3/4 rounded-lg`
- `stat-value`: `h-10 w-32 rounded-lg`

**Base:**
```css
animate-pulse bg-border/30 aria-hidden="true"
```

**Rule:** Skeletons must match real component dimensions exactly

#### EmptyState (`src/shared/components/ui/EmptyState.tsx`)

```tsx
<EmptyState 
  icon={<Icon />} 
  title="No items" 
  description="..." 
  action={{ label: "Create", to: "/create" }} 
/>
```

**Container:**
```css
rounded-2xl border-2 border-dashed border-border/20
py-12 text-center h-full min-h-[220px]
flex flex-col items-center justify-center bg-transparent
```

**Icon:** Defaults to `<Dobia expression="confused" size="lg" />`

**Title:**
```css
text-sm text-text-muted
```

**CTA:**
```css
bg-accent text-on-accent px-6 py-2.5 rounded-xl 
text-[10px] font-black uppercase tracking-widest
```

---

### CodeBlock System

#### CodeBlock Component (`src/shared/components/CodeBlock.tsx`)

```tsx
<CodeBlock 
  code={snippet} 
  lang="go" 
  filename="main.go" 
  badge="Go" 
  copyable 
  maxHeight="max-h-[600px]"
/>
```

**Supported Languages:**
- `go` — Go with keyword/type/builtin detection
- `sh` — Shell with command/flag/prompt detection
- `json` — JSON with key/value highlighting
- `text` — Plain text (no highlighting)

**Container:**
```css
data-theme-persist="dark"
wc-code min-w-0 max-w-full overflow-hidden 
rounded-xl border border-border/50 bg-bg
```

**Header (if filename/badge/copyable):**
```css
flex items-center justify-between gap-2 
border-b border-border/20 bg-bg-elevated px-3 py-2
```

**Filename:**
```css
font-mono text-xs text-text-muted truncate
```

**Badge:**
```css
text-xs font-black uppercase tracking-widest text-accent
```

**Copy Button:**
```css
rounded-lg border border-border/20 bg-bg px-2 py-1 
text-xs font-black uppercase tracking-widest text-text-muted
hover:border-accent/40 hover:text-accent
```

**Code Pre:**
```css
role="region" 
aria-label="Code block — scroll to view full content"
tabIndex={0}
whitespace-pre overflow-x-auto overflow-y-auto overscroll-contain
p-4 font-mono text-xs leading-relaxed sm:text-[13px]
focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50
```

**Syntax Colors:** See Section 1 (Color System) for token classes

**Dark Persistence:** Code blocks stay dark in light mode via `data-theme-persist="dark"`

---

## 10. Z-Index Scale

```
z-[60]  — Mobile drawer backdrop
z-[70]  — Drawer content
z-[80]  — Dropdowns
z-[90]  — Mobile nav overlay
z-[100] — Navbar / PublicNavigation / bottom nav
z-[110] — Navbar logo/actions, StudentTopbar, AdminTopbar
z-[120] — BottomSheet overlay
z-[130] — BottomSheet content
z-[140] — InstallBanner
z-[145] — CommunityPopup
z-[150] — ConsentBanner
z-[200] — Dialog overlay
z-[201] — Dialog content
z-[220] — Context menu
z-[300] — Tooltip
z-[500] — Toast
z-[9999] — Page loader (Athena boxes)
```

---

## 11. Responsive System

### Breakpoints (Tailwind Default)

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Design validation matrix:** 360 (mobile) · 768 (tablet) · 1024 (desktop) · 1440 (wide) · 1920 (ultra-wide)

### Touch Targets

```css
--tap-target-min: 48px
```

- Desktop: `min-h-[48px]`
- Mobile acceptable: `min-h-[44px]`
- Buttons: enforced via component
- Global: `button, input, select, textarea { min-height: var(--tap-target-min); }`

### Mobile Optimizations

```css
@media (max-width: 767px) {
  body { 
    font-size: 17px; 
    line-height: 1.6; 
  }
  
  .btn-primary, .btn-secondary {
    min-height: 44px;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    font-size: 0.8125rem;
    letter-spacing: 0.06em;
  }
  
  .card-qyvora { 
    transform: none !important; 
  }
  
  .card-qyvora:hover {
    box-shadow: var(--card-shimmer), 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
```

### Navigation Chrome

**Desktop (lg+):**
- Persistent sidebar rail
- Collapsed: `lg:pl-[76px]`
- Expanded: `lg:pl-[264px]`

**Mobile (<lg):**
- Bottom navigation (5 icons)
- Page padding: `pb-[calc(68px+env(safe-area-inset-bottom))]`

---

## 12. Page Categories & Visual Patterns

### Public Marketing Pages

**Characteristics:**
- Full viewport width layouts
- Dark hero backgrounds with generated art (`data-theme-persist="dark"`)
- Accent-heavy CTAs
- `PublicNavigation` (80px) + `PublicFooter` + `PublicBottomNav`
- Clearance: `pt-24 md:pt-28 lg:pt-32`

**Generated Background Art:**
Used ONLY on 7 regions (WebP in `src/assets/backgrounds/`):
1. Landing hero: `hero-desktop.webp` + `hero-mobile.webp`
2. Featured learning band: `featured-learning-band.webp`
3. HPB header: `hpb-header.webp`
4. CP header: `cp-header.webp`
5. Final CTA: `final-cta-dobia.webp`
6. Auth hero: `auth-dobia.webp`
7. 404 page

Pattern:
```tsx
<div data-theme-persist="dark" className="relative overflow-hidden bg-{token}">
  <img 
    src={bg} 
    alt="" 
    aria-hidden="true" 
    className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" 
  />
  <div className="relative">{content}</div>
</div>
```

**NO opacity/scrim/blur overlays** — art stays full color

### Tool Documentation Pages

**Characteristics:**
- `DocsShell` layout
- Two-column: left TOC + right content
- Code-heavy with `CodeBlock` components
- `ToolQuickStart` pattern: Run it · Sample output · Interactive session · Usage

### Student Dashboard

**Characteristics:**
- `AppShell` layout (topbar + rail + bottom nav)
- Calm charcoal `bg-canvas` (#0b0d0e)
- Green accent for progress/actions only
- Card grids and list views
- Profile portfolio: 2-column (sticky identity + main content)

### Admin Dashboard

**Characteristics:**
- `AdminLayout` with forced dark: `data-theme-persist="dark"`
- Table-heavy layouts
- Same component library as student dashboard
- Same token system and spacing

### Auth Pages

**Characteristics:**
- `AuthFormLayout` (2-column desktop: globe + form)
- Translucent panels: `bg-bg/70 backdrop-blur`
- Globe backdrop shows through
- Mobile: single column, top-aligned
- Forms: `max-w-lg`

### Walkthrough Pages

**Characteristics:**
- Bootcamp rooms, courses, labs all use `AppShell` with sidebar
- `FocusedStepList` pattern: only current step expanded, others collapsed
- All steps on one page with `scrollIntoView` navigation
- Reading text fills viewport (NOT `wc-prose` constrained)
- Compact command blocks: `px-3 py-1.5` header

---

## 13. Component Usage Matrix

| Component | Landing | Public | Docs | Dashboard | Admin | Labs/Courses |
|-----------|:-------:|:------:|:----:|:---------:|:-----:|:------------:|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Badge | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | | ✓ | | ✓ | ✓ | ✓ |
| LearningCard | ✓ | ✓ | | ✓ | | ✓ |
| CardBase | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CardMedia | ✓ | ✓ | | ✓ | | |
| CardStat | | | | ✓ | ✓ | |
| CodeBlock | | ✓ | ✓ | ✓ | | ✓ |
| Dialog | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| BottomSheet | ✓ | ✓ | | ✓ | ✓ | ✓ |
| EmptyState | | | | ✓ | ✓ | |
| Skeleton | | | | ✓ | ✓ | |
| DifficultyBadge | ✓ | ✓ | | ✓ | | ✓ |

---

## 14. Intentional Design Differences

### Purposeful Variations

| Difference | Reason |
|------------|--------|
| Public pages vs Dashboard | Public: marketing-focused, full-width heroes, art backgrounds. Dashboard: data-focused, calm surfaces, compact spacing |
| Dark code blocks in light mode | Code/terminals stay dark technical for readability via `data-theme-persist="dark"` |
| Admin forced dark | Admin always dark theme for consistent professional tooling experience |
| Auth translucent panels | Globe backdrop shows through to maintain visual interest without opacity over art |
| Button font weight | CSS classes use `font-black`, component uses `font-bold` — both valid |

### Consistent Across All Contexts

- Border radius scale (16px/12px/8px)
- Accent color (#06B66F)
- Typography scale and weights
- Spacing system
- Touch target minimums
- Z-index scale
- Motion timing and easing

---

## 15. Potential Inconsistencies (Audit Findings)

### Minor Variations Discovered

1. **Button font weight discrepancy**
   - CSS classes (`.btn-primary`): `font-black`
   - Button component: `font-bold`
   - Status: Both acceptable, document as-is

2. **Text token migration in progress**
   - `text-[10px]` (495 occurrences) → `text-kicker`
   - `text-[9px]` (382 occurrences) → `text-tiny`
   - Status: Tokens live, bulk migration deferred to spacing phase

3. **Card border opacity varies by context**
   - Default: `/30`, Subtle: `/20`, Interactive: `/30`, Elevated: `/50`
   - Status: Intentional based on visual hierarchy

4. **Heading h2 size variance**
   - Compact bento: `text-lg`
   - Standard: `text-2xl`+
   - Split-screen: up to `text-7xl`
   - Status: Intentional based on space/emphasis

### No Action Required

These variations are either intentional design decisions or in-progress migrations with documented token replacements.

---

## 16. Future Development Rules

### Before Creating New UI

1. **Read `src/styles/index.css`** — Check if tokens/classes exist
2. **Read `docs/UI-PATTERN-INVENTORY.md`** — Check if pattern exists
3. **Search existing components** — Reuse before creating
4. **Check AGENTS.md** — Follow enforced rules

### Component Creation Checklist

- [ ] Reused existing component variants?
- [ ] Used design tokens (no raw hex except documented exceptions)?
- [ ] Followed radius scale (16px/12px/8px)?
- [ ] Min touch target 44-48px?
- [ ] Keyboard accessible (Enter/Space)?
- [ ] Focus visible (accent outline)?
- [ ] Reduced motion support?
- [ ] Mobile responsive?
- [ ] Matches existing component spacing?
- [ ] Uses semantic HTML?
- [ ] ARIA labels where needed?

### Adding New Design Patterns

If genuinely new pattern needed:

1. **Document the use case** — Why existing patterns don't work
2. **Define exact specifications** — All measurements, colors, states
3. **Update this documentation** — Add to appropriate section
4. **Update AGENTS.md** — Add to pattern rules
5. **Create reusable component** — Don't one-off inline

### Color Usage Rules

- **Green accent**: Actions, progress, success, interactive states
- **Red danger**: Destructive actions, errors
- **Yellow warning**: Warnings, intermediate difficulty
- **Blue info**: Beginner difficulty, informational
- **Muted text**: Metadata, labels, secondary info
- **Never**: Purple/indigo gradients, emoji, arbitrary colors

### Typography Rules

- **Headings**: Always `font-black` (900), Space Grotesk automatic
- **Body**: Always `font-mono` (JetBrains Mono)
- **Never**: Add `font-display` class manually
- **Minimum sizes**: h1 `text-3xl`, h2 standard `text-2xl`, h2 compact `text-lg`
- **Kickers**: `text-kicker font-black uppercase tracking-[0.3em] text-accent`

### Layout Rules

- **No** `max-w-*` on page containers
- **Use** `wc-*` classes for content width
- **Always** `min-h-dvh`, never `h-dvh` on content
- **Always** consistent gutters: `px-3 md:px-4 lg:px-6`
- **Always** clear navbar properly

### Accessibility Requirements

- Touch targets ≥44px
- Focus visible (2px accent outline, 2px offset)
- Keyboard navigation (Enter/Space on role="button")
- ARIA labels on icon-only buttons
- Semantic HTML where possible
- Color never sole indicator
- Reduced motion support (3 layers)

---

## 17. Audit Summary

### Documentation Files Created/Updated

This comprehensive specification consolidates:
- `docs/TOKENS.md` (color, spacing, motion tokens)
- `docs/TYPOGRAPHY.md` (complete type scale)
- `docs/DESIGN_SYSTEM.md` (high-level system)
- `docs/UI-PATTERN-INVENTORY.md` (component patterns)
- `docs/UI-PRINCIPLES.md` (enforced rules)
- `docs/RESPONSIVE.md` (breakpoints, mobile)
- `docs/BACKGROUNDS.md` (surface system, art)
- `docs/PAGE_PATTERNS.md` (layout recipes)
- `AGENTS.md` (operational rules)

### Major Design System Areas Documented

✅ Color System (surfaces, accent, text, borders, semantic, code syntax)  
✅ Typography (fonts, scales, headings, body, code)  
✅ Spacing (base scale, gutters, component spacing)  
✅ Layout (containers, grids, shells, clearance)  
✅ Border & Radius (scale, patterns, usage)  
✅ Elevation & Shadows (shimmer, card shadow, button 3D)  
✅ Motion (durations, easing, animations, reduced motion)  
✅ Icons (sizes, library, chips)  
✅ Components (buttons, cards, badges, inputs, dialogs, code blocks)  
✅ Z-Index (complete scale)  
✅ Responsive (breakpoints, touch targets, mobile)  
✅ Page Categories (visual distinctions, shell usage)  
✅ Background System (tokens, generated art)

### Statistics

- **Page Categories Identified:** 6 (Public Marketing, Tool Docs, Student Dashboard, Admin Dashboard, Auth, Walkthrough)
- **Reusable Component Patterns:** 25+ (Button, Badge, Input, CardBase, CardMedia, CardStat, LearningCard, Dialog, BottomSheet, EmptyState, Skeleton, CodeBlock, etc.)
- **Typography Levels:** 15+ (h1 variants, h2 variants, h3, kickers, body, code, etc.)
- **Color Tokens:** 35+ (surfaces, text, borders, semantic, difficulty, code)
- **Spacing/Layout Patterns:** 20+ (gutters, clearance, grids, width constraints)
- **Responsive Breakpoints:** 5 (sm, md, lg, xl, 2xl)

### Potential Inconsistencies Discovered

1. Button font weight (CSS: black, Component: bold) — **Both acceptable**
2. Text token migration in progress — **Documented, ongoing**
3. Card border opacity variance — **Intentional**
4. h2 size variance — **Intentional**

**Total inconsistencies requiring action:** 0 (all variations are intentional or documented migrations)

### Areas Reliably Determined

All major visual rules have been extracted from actual implementation with exact measurements. No significant gaps or undetermined areas remain.

---

## Conclusion

This document represents a **complete, implementation-aware specification** of the QYVORA frontend UI design system. Every value, pattern, and rule documented here is derived from actual code inspection, not theoretical design principles.

**Use this as:**
- The single source of truth for UI decisions
- A reference when building new pages
- A specification for AI coding agents
- A contract for future frontend development

**Update this document when:**
- New system-level patterns are introduced
- Design tokens change
- Major component refactors occur
- Responsive breakpoints shift

**Maintenance responsibility:**
- Keep synchronized with `src/styles/index.css`
- Update after component library changes
- Reflect actual implementation, not aspirations

---

**Document Version:** 1.0  
**Last Audit:** 2024  
**Next Review:** After major design system changes

