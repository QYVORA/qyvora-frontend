# Component States — QYVORA

State matrix for the canonical primitives. Every interactive component must
implement all applicable states below; every non-interactive component should be
covered by its skeleton, empty, and error counterparts.

## Buttons (`Button`, `btn-*` classes)

| State | Behavior |
|---|---|
| default | `btn-primary` accent fill / `btn-secondary` bordered / `btn-danger` destructive |
| hover | brightness up (`hover:brightness-110`) or background shift; never ad-hoc glow |
| active / pressed | `active:scale-95` |
| disabled | `opacity-50 pointer-events-none` (or `disabled:…`); never removes focus styling |
| focus-visible | global accent outline — never suppress it (`focus-visible:outline` stays) |
| loading | spinner (`Loader2 animate-spin`) replacing label; block repeat clicks |

## Inputs (`Input`, form fields)

| State | Classes |
|---|---|
| default | `bg-bg-card border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm` |
| focus | `focus:border-accent outline-none` |
| placeholder | `placeholder:text-text-muted` |
| error | red border + message via `aria-describedby` (see `FormField`) |
| disabled | `opacity-60 cursor-not-allowed` |

## Cards

| State | Behavior |
|---|---|
| default | `rounded-2xl border` (`card-accent`, calm `border-border-subtle`, or legacy `border-border/30`) |
| hover | `hover:border-accent/80` + `shadow-[var(--card-shimmer)]` (learning cards); never jumpy layout |
| active | `active:scale-95` (where the whole card is a control) |
| selected | `border-accent` + `shadow-[0_0_16px_var(--color-accent-dim)]` |
| muted / locked | `opacity-60 cursor-default`, no hover accent |
| loading | matching `Skeleton` layout (same grid/padding/aspect) |

## Dialogs & sheets

- `DialogContent` (desktop) handles overlay `z-[200]`, content `z-[201]`,
  `aria-labelledby`, focus trap, Escape. `BottomSheet` handles mobile
  `z-[120]` / `z-[130]`.
- Always pass `title` and `aria-describedby`. Loading inside a dialog uses
  `role="status"` / `aria-live="polite"`.

## List / table rows

- Hover: border/text accent shift only — never full accidental selection.
- Selected row: accent border/indicator.
- Row-level actions: `Button`-style links, `min-h-[44px]`.

## Accordion (strips)

- Header button: `aria-expanded`, `aria-controls="<panel-id>"`, panel `role="region"`.
- Only the header toggles; interactive body content (forms, commands) never
  triggers scroll/toggle — guard container handlers (AGENTS.md).

## Data loading pattern (all pages)

1. Skeleton (`role="status"`) → 2. Error (`ErrorState`) → 3. Empty (`EmptyState`)
   → 4. Data.

## Accessibility baseline

- `min-h-[48px]` targets (44px mobile); `role="button"` divs need `aria-label` +
  Enter/Space handling; labels via `htmlFor`/`id`; motion respects
  `prefers-reduced-motion`. Full rules: `docs/ACCESSIBILITY.md`.