# QYVORA Trophy & Achievement System

Audit of the achievement/trophy layer (Phase F.26) plus the artwork pipeline.

## Architecture

- **Derivation**: `src/shared/utils/profileDerivations.ts` — `deriveTrophies(profile)`
  turns a student profile into earned `Trophy[]` items keyed by `id`, each with
  title, description, and a tier (`TIER_STYLES` from `src/shared/types/profile`).
  Every trophy maps to one of three families: bootcamp (HPB), course, or
  rank/progression.
- **Publication**: `src/shared/components/profile/TrophyCabinet.tsx` renders the
  earned trophies on student `/dashboard/profile` and public `@/:username`.
  Mount order is staggered (50ms) with `useReducedMotion` respected.
- **Artwork resolution**: `TrophyCabinet` eagerly globs
  `/src/assets/trophies/*.webp`. A real file wins; named fallbacks kick in:
  - `hpb-graduate` → `BootcampBadge completed`
  - `rank-*` → `CpLogo` (also `rank.webp` shared asset when present)
  - `scholar` / `course-graduate` / `first-course` → `CourseBadge` of the
    student's first completed course
  - everything else → `QyvoraMark`
- **Empty state**: an un-earned state shows the cabinet shell with no artificial
  "locked" placeholders — no decorative filler, just the empty message.

## Current trophy ids

| Family | ids |
|--------|-----|
| HPB | `hpb-graduate` |
| Course | `scholar`, `course-graduate`, `first-course` |
| Rank | `rank-<tierId>` (resolves to `rank.webp`) |

## Artwork pipeline

See `docs/TROPHY-SPECS.md` for the full spec. Contract summary:

- 512×512 WebP, transparent background, no text/letters/numbers.
- Palette: near-black `#000000`/`#0b0b0b` depth greys, single accent `#06B66F`,
  off-white `#EEF0EE` highlights. No purple/indigo, no non-accent gradients.
- Flat, crisp vector terminal-born iconography; 1.5–2px strokes; ≤4px radius;
  must read at 24px and 96px.
- Prompt template is in `TROPHY-SPECS.md`; each file line has its concept.

**Status**: source-of-truth webp assets for the higher tiers belong in
`src/assets/trophies/`. Until a file exists, the SVG fallbacks above keep the
cabinet on-brand. Do not introduce decoy/locked trophy placeholders elsewhere —
a trophy either exists as an earned achievement or it does not render.

## Rules

- A trophy is only ever earned, never shown as a pending placeholder.
- Profile pages never use `lucide-react` for the achievement artwork itself.
  Module chrome (the `ModuleHeader` icon) is fine; the achievement visual is
  the webp/SVG mark.
- Tier styling comes from `TIER_STYLES` only — no ad-hoc color classes.
- Keep the cabinet compact (`rounded-2xl`, `p-5`, `grid` of ~3 columns) — no
  sprawling card stacks.