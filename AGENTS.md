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

- Cards / modals / panels: `rounded-2xl`
- Buttons / inputs: `rounded-xl`
- Badges / pills: `rounded-lg` or `rounded-full`
- Never mix radius scales within the same component

## Button System

Three tiers defined in `src/styles/index.css`:

| Class | Usage |
|-------|-------|
| `btn-primary` | Primary CTA (accent bg) |
| `btn-secondary` | Secondary action (bordered) |
| `btn-danger` | Destructive action (red) |

All buttons: `!rounded-xl`, `text-[10px]`, `font-black`, `uppercase`, `tracking-widest`.

## Disabled State

All disabled elements use `disabled:opacity-50` — no exceptions.

## Dialogs / Modals

- Use the shared `DialogContent` wrapper from `@/shared/components/ui/Dialog`
- Always pass a `title` prop (rendered as `RadixDialog.Title`)
- The wrapper auto-injects `aria-describedby` for accessibility
- For raw `RadixDialog.Content` (e.g. SimulatedTerminal), always include a `RadixDialog.Title` element

## Z-Index Scale

| Layer | Z-Index |
|-------|---------|
| Sidebar mobile overlay | `z-60` |
| Sidebar mobile drawer | `z-70` |
| InstallBanner / PromotionalSystem | `z-[140]` |
| CommunityPopup | `z-[145]` |
| ConsentBanner | `z-[150]` |
| Dialog overlay | `z-[200]` |
| Dialog content | `z-[201]` |

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
