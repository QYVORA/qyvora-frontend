# Responsive & Breakpoint Rules — QYVORA

Design matrix (see `docs/TOKENS.md`): 360 (mobile) · 768 (tablet) · 1024
(desktop) · 1440 (wide) · 1920 (ultra-wide). Markup uses Tailwind's default
breakpoints: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536.

## Containers

- **No `max-w-*` on page-level containers.** Content fills the viewport.
- Gutter: `px-3 md:px-4 lg:px-6` on every page container (both inside shells and
  on public pages).
- Width-constrained content uses `wc-*` classes (`wc-prose`, `wc-code`,
  `wc-terminal`, `wc-diagram`, `wc-table`, `wc-media`, `wc-interactive`), never
  ad-hoc `max-w-*`. Exception: `wc-prose` must NOT constrain walkthrough reading
  text (walkthrough fills the viewport like blog pages).

## Navbar clearance

| Context | Clearance |
|---|---|
| Under a fixed topbar (`AppShell` / `AdminLayout`) | topbar provides `pt-20 md:pt-24` — pages add none |
| Under `PublicNavigation` | sections `pt-24 md:pt-28 lg:pt-32` |
| Sidebar sections | `py-12 sm:py-10 md:py-16 lg:py-20` |

## Growing content

- Content sections are always `min-h-dvh`-anchored (never `h-dvh`). Center short
  content with an inner `my-auto` wrapper so it collapses to top-align on overflow.
- Navigation scroll targets use `scroll-mt-20 md:scroll-mt-24` to clear the topbar.

## Grids

- Card stacks: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Profile portfolio: single column on mobile, `lg:grid-cols-12` at desktop.
- Split-screen sections: `items-center` when a column is sparse — content must not
  bleed into the navbar zone or into the adjacent section (AGENTS.md).

## Full-bleed carousels

Wrap carousels in a breakout wrapper with `-mx-3 md:-mx-4 lg:-mx-6` so cards are
never clipped at the section edge on any breakpoint.

## Navigation chrome

- `StudentBottomNav` is the only dashboard navigation on mobile; the rail appears
  at `lg+` (`lg:pl-[76px]` / `lg:pl-[264px]`).
- Dialogs: `Dialog` (Radix) on desktop, `BottomSheet` on mobile.

## Touch targets

All interactive elements `min-h-[48px]` (44px acceptable on mobile, e.g. admin
table actions). See `docs/ACCESSIBILITY.md`.

## Testing

The breakpoint matrix above is the validation ladder — verify every new layout at
360, 768, 1024, 1440, and 1920 (DevTools), plus keyboard-only and
`prefers-reduced-motion` modes.