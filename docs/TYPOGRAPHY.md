# Typography — QYVORA (source of truth)

Single reference for type tokens, heading scale, and reading-text rules. Supersedes
page-by-page size decisions; pages pick a **named variant from the scale below** and
never invent sizes.

## Tokens

Defined in `src/styles/index.css` `@theme`. Use utilities, never raw values.

| Token | Utility | px | Replaces |
|---|---|---|---|
| `--text-kicker` | `text-kicker` | 10px | `text-[10px]` |
| `--text-tiny` | `text-tiny` | 9px | `text-[9px]` |
| `--text-overline` | `text-overline` | 8px | `text-[8px]` |
| `--text-micro` | `text-micro` | 7px | `text-[7px]` |

Above the micro scale use the standard Tailwind scale (`text-xs` 12px, `text-sm`
14px, `text-base` 16px, …).

## Heading scale (canonical variants)

All headings: `font-black` (900), never bold/`font-bold`. Heading font-family is
applied globally (Space Grotesk) — never add a `font-display` class.

| Heading | Variant | Classes | Reference |
|---|---|---|---|
| `h1` | page hero | `text-4xl md:text-6xl` | `dashboard/PageHeader.tsx` |
| `h1` | split-screen hero | `text-4xl md:text-6xl lg:text-7xl` | `ToolDocHero` |
| `h1` | panel (constrained card/rail) | `text-3xl md:text-4xl lg:text-5xl` | `AuthForm`, `RoomHeader` |
| `h1` | fluid marketing hero | current arbitrary/fluid tuning; normalize breakpoints in the breakpoint-sweep phase | `PublicHeroSection` title |
| `h2` | page / standard section | `text-3xl md:text-5xl` | — |
| `h2` | split-screen | `text-3xl md:text-5xl lg:text-7xl` | `ServiceDetailPage`, `ToolSectionHeader` |
| `h2` | compact bento / carousel rail | `text-lg` (title only, no description) | Carousel inline heads |
| `h3` | cards/kickers/panels | `text-2xl md:text-3xl lg:text-4xl` | — |

Minimum sizes (never smaller): `h1` `text-3xl`, `h2` `text-lg` (compact) /
`text-2xl`+ (standard), `h3` `text-2xl md:text-3xl lg:text-4xl`.

## Kickers / eyebrows

Canonical: `text-kicker font-black uppercase tracking-[0.3em] text-accent`.
`text-tiny` is acceptable for the narrower 3-way label variant. Never a small
heading (`h3`/`h4`) as a kicker.

## Reading text (blog / walkthrough)

- Body: `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8` — **never `leading-relaxed`** on narrative text.
- Walkthrough headings (via `CodeBlockRenderer` markdown) match blog heading classes exactly:
  - h2: `text-2xl md:text-4xl font-black uppercase tracking-tight mb-6 md:mb-8 text-text-primary`
  - h3: `text-xl md:text-2xl font-black uppercase tracking-tight mb-5 md:mb-6 text-accent`
  - h4: `text-base md:text-lg font-black uppercase tracking-tight mb-4 mt-4 text-text-primary`
  - all: `font-black uppercase tracking-tight`, no `leading-snug`, no `max-w-none` on headings.
- Walkthrough reading width: full viewport (like blog), **not** `wc-prose`.

## Migration status

- `text-[10px]` (495) → `text-kicker`, `text-[9px]` (382) → `text-tiny`,
  `text-[8px]` (57) → `text-overline`, `text-[7px]` (16) → `text-micro`:
  **ongoing.** Tokens are live as of this phase; files touched during the sweep
  already use the token utilities. Bulk sweep is a follow-up (spacing/radius phase).
  The size/space arbitrary-value ban is deliberately deferred until the sweep —
  `qyvora-local` currently enforces color only.
- `h2` used as section title with a heading element at the wrong level: fixed in
  `ToolsCarousel` (h3 → h2 on the slide title).