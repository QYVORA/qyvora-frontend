# Page Patterns — QYVORA

Reusable page structures and the canonical way to compose a page from existing
primitives. A new page should be assembled from these patterns — never invent a
new shell, header, or grid.

## Shells

| Shell | Route domain | Clearance provided | Notes |
|---|---|---|---|
| `PublicShell` | marketing, tool docs, public profile | none (hero clears own space) | Owns `PublicNavigation` + `PublicFooter` + `PublicBottomNav`. Tool docs clear the navbar themselves (`pt-24 md:pt-28 lg:pt-32`). |
| `AppShell` (`StudentTopbar` + rail) | `/dashboard/*` non-walkthrough | `pt-20 md:pt-24` on `#main-content` | Rail: `lg:pl-[76px]` collapsed / `lg:pl-[264px]` expanded. Root `bg-canvas min-h-dvh`. |
| `AdminLayout` | `/admin/*` | `pt-20 md:pt-24` | Root `bg-bg`, forced dark `data-theme-persist="dark"`. Secondary nav `z-[90]`. |
| `AuthFormLayout` | auth | n/a (2-col grid) | Form column `max-w-lg`. Never opaque over the globe backdrop. |

Since `AppShell`/`AdminLayout` already add top clearance, **student/admin pages must
not add their own `pt-*`** — add only horizontal (`px-3 md:px-4 lg:px-6`) and
bottom (`pb-16 md:pb-20 lg:pb-24`) padding.

## Page container recipe

```
<div className="min-h-full bg-canvas">            // or bg-bg for admin
  <SEO … />
  <div className="w-full space-y-8 px-3 pb-16 md:px-4 md:pb-20 lg:px-6 lg:pb-24">
    <PageHeader kicker title description metadata? />
    …sections…
  </div>
</div>
```

Reference: `MarketplacePage.tsx`, `NotificationsPage.tsx`, admin tab pages.

## Headers

- **Page header** → `PageHeader` (`src/shared/components/ui/PageHeader.tsx`) with
  `kicker`, `title`, `description`, optional `metadata` node.
- **Section header** → `SectionHeader` (`src/shared/components/ui/SectionHeader.tsx`).
- **Module header** (profile/dashboard cards) → `ModuleHeader`
  (`src/shared/components/profile/ModuleHeader.tsx`) — muted section heading with
  a small leading icon (`QyvoraMark` on profile).

## Boundary between sections

All page content lives in the shell's padded area. `space-y-8` on the container
is the standard vertical rhythm; individual sections are balanced compositions
(header + substantive content), never lone sparse cards — see "No strip-like
sections" in AGENTS.md.

## Content grids

| Pattern | Classes | Use |
|---|---|---|
| Card grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6` | learning/product card stacks |
| Profile portfolio | `lg:grid-cols-12` (`lg:col-span-4` sticky identity + `lg:col-span-8 space-y-6`) | both profile pages |
| Two-col split | `grid md:grid-cols-2 gap-*` (`items-center` for sparse left column) | feature/split sections |
| One-col stack | `space-y-6` | admin tabs, settings, lists |

## Empty / error / loading states

- **Loading skeleton** → `Skeleton` primitives (`src/shared/components/ui/Skeleton.tsx`),
  page-level skeletons in `StudentSkeletons.tsx` / admin skeletons. Pulse animation
  via the shared component.
- **Error** → `ErrorState` (`src/shared/components/ui/ErrorState.tsx`).
- **Empty** → `EmptyState` (`src/shared/components/ui/EmptyState.tsx`) — the single
  canonical empty state (dashed `border-border-subtle` panel, optional icon box,
  optional action node). Do not build another one.
- See `docs/COMPONENT_STATES.md`.

## Difficulty badge

Single canonical `DifficultyBadge` in `src/shared/components/learning/LearningCard.tsx`
(re-exported via `@/shared/components/ui`). Always use it; never re-derive
difficulty colors locally (colors live in the `badge-*` utilities).

## Walkthrough pages

Walkthroughs (courses, labs, bootcamp rooms) use `AppShell` with the sidebar; all
step cards render on a single page with `scrollIntoView` navigation and
`FocusedStepList`. See AGENTS.md "Walkthrough" rules.

## Misc

- Product cards: `aspect-[16/9]` covers, `ProductCard` variant of `LearningCard`.
- Carousels: shared `Carousel` / `DragMarquee`, full-bleed via `-mx-3 md:-mx-4 lg:-mx-6`,
  stable viewport heights (AGENTS.md "Layout Stability").