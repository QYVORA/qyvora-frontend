# QYVORA Avatar System

Inventory and usage recommendations for the QYVORA avatar/identity system.
Enforced on profile pages by AGENTS.md: **never** use `lucide-react` icons (or
custom `Icon*` glyphs) to represent achievements, completed rooms, bootcamp
phases, labs, or courses — use the dedicated SVG assets below.

## Components

| Asset | Source | Purpose |
|-------|--------|---------|
| `Identicon` | `src/shared/components/Identicon.tsx` | Deterministic jdenticon SVG of the user ID. Profile identity cards (256px source, CSS-scaled), leaderboard tiles, public profile. `dompurify`-sanitized. |
| `HpbAvatar` | `src/shared/components/HpbAvatar.tsx` | Five HPB phase avatars (`Tete`, `Adyeiwaa`, `Nii`, `Mawusi`, `Awari`). Prop `variant`: `phase1`..`phase5`; `size`: `xs` 48 / `sm` 80 / `md` 128 / `lg` 176 or a pixel number; `animated` adds `dobia-float`. |
| `BootcampBadge` | `src/shared/components/BootcampBadge.tsx` | HPB completion mark (incl. a `completed` prop). Recent-activity feed (`ActivityTimeline`), `AchievementsSection`, trophy fallback. |
| `CpLogo` | `src/shared/components/CpLogo.tsx` | Cyber Points token mark. Topbar, sidebar, marketplace, CP analytics, admin tabs, profile, `CelebrationModal`, token-metadata blocks, trophy fallback for rank/progression. |
| `CourseBadge` / `LabBadge` | `src/shared/components/CourseBadge.tsx` / `LabBadge.tsx` | Per-course and per-lab identity visuals. `CourseBadge courseId={id}` wraps `COURSE_ICON_MAP`. |
| `COURSE_ICON_MAP` / `getCourseIconConfig` | `src/features/student/data/courses/courseIcons.tsx` | Course avatar glyphs (SVG artwork, resolves `var(--color-accent)`). Used by `AchievementsSection`, `LearnPage`, `CoursesPage`. |
| `StreakIcon` / `getStreakLevel` | `src/shared/components/StreakIcon.tsx` | Streak level mark + level derivation helper (dashboard skill/metrics). |

All branded SVGs resolve accent through `var(--color-accent)` in their default
`color` prop — never pass a raw `#06B66F` to `Logo`/`QyvoraMark`/glyph components.

## Where each surface must use the SVG system

- **Profile pages** (student `/dashboard/profile`, public `@/:username`):
  `AchievementsSection` and `ActivityTimeline` render unlocked rooms/phases/
  labs/courses with the SVG assets above only. `TrophyCabinet` prefers real
  webp artwork and falls back to `BootcampBadge`/`CpLogo`/`CourseBadge`/
  `QyvoraMark`.
- **Learning cards**: `StudentBootcampCard` (phase avatar tile),
  `LearningCard`, `ScenarioCard` — course/lab visuals are first-class section
  visuals, never card decoration toggled on state.
- **Bootcamp pages**: `HpbPage` phase summary cards show the per-phase
  avatar (phase card and related-phase list). On the landing page the hero and
  featured-learning band are backed by generated background art (the squad is
  rendered into the art itself), while the landing path blocks and the
  featured-learning cards still render the avatar components directly.
- **Team page**: founding/core team cards use circular cropped photos; public/
  community faces use the avatar system — two distinct treatments, never mixed.

## Usage recommendations (Phase F.25 findings)

Add avatars where identity adds signal, not as decoration:

1. **Empty states** — when a student has no data in a module (no achievements,
   empty cabinet, no completed labs), keep the branded SVG mark (e.g. the
   `QyvoraMark`/course glyph) rather than a generic icon. The `EmptyState`
   component accepts any `icon` node, so pass an SVG asset where one is
   semantically correct.
2. **Achievements/trophies** — the `TrophyCabinet` webp pipeline is the source
   of truth once artwork lands (see `docs/TROPHY-SPECS.md`); SVG fallbacks are
   already wired.
3. **Onboarding / unlock flows** — `CelebrationModal` already celebrates with
   `CpLogo`; keep unlock moments on-brand by reusing the relevant SVG mark.
4. **Docs** — tool pages key identity off the tool topic avatar/glyph in
   headers; keep line-art SVGs (not photos) for tool/OSINT faces.

Do not sprinkle avatars on dense data views (tables, ledgers, admin lists) —
they compete with the terminal-born monochrome language. Reserve them for
identity, achievement, and learning-content moments.