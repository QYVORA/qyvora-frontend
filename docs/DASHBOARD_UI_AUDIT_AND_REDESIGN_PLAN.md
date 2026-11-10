# QYVORA Dashboard UI Audit & Redesign Plan

**Status:** Audit and implementation plan only — no UI or backend implementation is included.

## Executive summary

The student dashboard at `/dashboard` is already composed from real learning, engagement, community, session-planning, leaderboard and profile data. Its main problem is not a lack of widgets; it is the way those widgets compete for attention. The page caps its content at 1360px, splits it into equal-width columns, puts several long widgets in independent stacks, and then places the Skill Matrix below both columns. Meanwhile, multiple cards repeat CP, rank and streak, several widgets add bordered inset rows inside a bordered card, and the learning overview mixes real current learning with browser-local history and recommendations.

The recommended direction is a predictable, fluid dashboard rather than masonry: a wide primary learning column and a narrower supporting column at wide desktop sizes, with a single-column reading order at tablet/mobile widths. Keep one calm surface per major widget, use dividers and compact rows inside it, consolidate the existing statistics into one authoritative card, and make “Current / Recent / Saved” reflect their actual data rather than falling back to recommendations labeled as recent. Do not show an earned-badge count or global league position until an authoritative source is confirmed.

The proposed plan preserves QYVORA's existing dark terminal-born identity and uses its existing tokens, badges, icons, cards and motion conventions. It borrows the reference's stated layout efficiency and information hierarchy, not TryHackMe's branding. The reference screenshots were not available as repository assets during this audit, so the comparison below is against the structural and visual principles described in the request rather than a pixel-by-pixel screenshot review.

## 1. Current architecture

### Route and shell

- The route is `/dashboard`, declared in `src/app/router.tsx` and protected by `StudentOnly`. It lazily loads `features/student/pages/DashboardPage`.
- The route is rendered inside `AppShell` (`src/features/student/layouts/AppShell.tsx`). At desktop sizes the shell uses a horizontal student topbar; below `lg` the topbar opens a full-screen overlay sidebar. The shell sets the main-content top padding and owns global student utilities; dashboard content should not recreate this navigation.
- The page uses the shared `PageBody` (`src/shared/components/layout/PageBody.tsx`) for responsive gutters and vertical rhythm.

### Component/data flow

```text
router.tsx (/dashboard)
└─ StudentOnly
   └─ AppShell
      └─ DashboardPage / Dashboard
         ├─ useAuth + useToast
         ├─ useStudentOverview ── GET /student/overview
         ├─ useEngagement ─────── GET /student/engagement
         ├─ DashboardSkeleton (while page-level requests load)
         └─ PageBody
            ├─ ErrorState (conditional)
            ├─ CertificateClaimBanner
            ├─ constrained two-column grid (max-width 1360px)
            │  ├─ left stack: DashboardHero, QoseDashboardCard,
            │  │  CommunityCard, MyLearningCard, LeagueCard
            │  └─ right stack: WeeklyMissionCard / fallback,
            │     YourStatsCard, SessionPlannerCard, TopOperatorsCard,
            │     NewLabsCard, WeekActivity (conditional), CpEarnHint
            └─ SkillMatrix (full width, after both stacks)
```

`DashboardPage/index.tsx` also derives the hero objective, bootcamp progress, CP balance, rank name, completed-room totals and local content-Lab progress. `MyLearningCard` owns the `Current`, `Recent` and `Saved` UI and its `LearningRow`/`BookmarkButton` helpers. `YourStatsCard` owns a local `StatTile`. `SkillMatrix` composes `SkillRadarChart` and `SkillStats`.

### Active dashboard sections and data sources

| Section/component | Current purpose and source |
|---|---|
| `DashboardHero` | Personalized welcome and continue/explore CTA; objective and path are derived from `/student/overview` plus local fallback copy. |
| `QoseDashboardCard` | Conditional QOSE registration/payment status from the QOSE service; hides itself if the request fails. |
| `CommunityCard` | `/student/community`: activity feed, suggested operators and follow relationships; also links to the WhatsApp community. This is not an invitation inbox. |
| `MyLearningCard` | Enrolled bootcamps intersected with `/student/overview`; content-Lab catalog from `CONTENT_LABS`; browser-local recent/saved IDs and lesson progress. |
| `WeeklyMissionCard` | `/student/engagement`: weekly-operation steps/reward and today's mission/status in one widget. |
| `YourStatsCard` | User identity and `/student/overview` values: CP balance, streak and bootcamp room counts/rank tier. |
| `LeagueCard` | Same CP balance, rank tier and streak as `YourStatsCard`, with progression-to-next-rank and a competitive-page link. |
| `SessionPlannerCard` | `/student/session-plans` read/create/delete operations; upcoming study plans. |
| `TopOperatorsCard` | `/public/leaderboard?period=week&limit=5`; weekly top-five standings. |
| `NewLabsCard` | Recommendations and “new” Labs derived from the frontend `UNIFIED_LABS`/catalog matrix, not a personalized recommendation API. |
| `WeekActivity` | `visitDates` and `visitDurations` from `/student/overview`'s `xpSummary`; when a visit date has no duration, it displays a one-minute fallback. |
| `CpEarnHint` | A second CTA derived from the same daily/weekly engagement response shown by `WeeklyMissionCard`. |
| `CertificateClaimBanner` | Conditional credential lookup for legacy HPB completers; shown only when a claim is needed. |
| `SkillMatrix` | Bootcamp module counts plus browser-local course/Lab progress, transformed by the local skill registry. |

`DailyMissionCard`, `WeeklyOperationCard` and `ActiveDeployments` are exported from the dashboard barrel but are not rendered by the current dashboard page. `WeeklyMissionCard` combines the daily and weekly views. They are candidates for a separate stale-export/consumer check, not current visible sections.

## 2. Problems identified

### A. Card surfaces and information hierarchy

- Most widgets use `CardBase` ([`Card.tsx`](../src/shared/components/ui/Card.tsx)), whose surface is `bg-bg-card` with a persistent accent border (`border-accent/50`), top shimmer and hover-border change. Other widgets use the calmer `Card` primitive, which is `bg-surface` with a subtle neutral border. The same dashboard therefore mixes two surface families and makes ordinary content widgets look interactive/accented.
- There are repeated inset surfaces that can be simple content rows:
  - [`MyLearningCard.tsx`](../src/features/student/components/dashboard/MyLearningCard.tsx) wraps each bootcamp in a rounded bordered surface while the Labs already use divider rows; the no-current and no-saved messages also get separate dashed boxes.
  - [`YourStatsCard.tsx`](../src/features/student/components/dashboard/YourStatsCard.tsx) puts each `StatTile` in its own bordered `bg-surface-raised/40` tile.
  - [`LeagueCard.tsx`](../src/features/student/components/dashboard/LeagueCard.tsx) puts CP/rank/streak in another bordered rounded panel.
  - [`NewLabsCard.tsx`](../src/features/student/components/dashboard/NewLabsCard.tsx) and [`TopOperatorsCard.tsx`](../src/features/student/components/dashboard/TopOperatorsCard.tsx) each put every list item in a bordered, raised row.
- `YourStatsCard` and `LeagueCard` duplicate CP balance, rank tier and streak. The duplication is especially visible because both are separate cards in different columns.
- `SkillMatrix` has a section heading and two more full bordered surfaces, each with a 420px minimum height and a 480px desktop grid height. This creates a large, visually separate dashboard ending after the main widgets.
- `CardBase` should not be changed globally for this redesign: it is a shared primitive. Prefer the existing calm `Card` surface for dashboard containers and reserve accent borders for active/interactive states.

### B. Layout and space utilisation

- [`DashboardPage/index.tsx`](../src/features/student/pages/DashboardPage/index.tsx) sets `mx-auto w-full max-w-[1360px]`, then uses `lg:grid-cols-2`. This both caps the page on wide displays and gives learning and supporting content equal widths. The frontend layout guidance in [`RESPONSIVE.md`](RESPONSIVE.md) and [`UI-PRINCIPLES.md`](UI-PRINCIPLES.md) calls for full-width page content with responsive gutters, not a page-level `max-w-*` cap.
- Each grid cell is an independent vertical flex stack. This is predictable, but the left stack contains learning plus community/league while the right stack contains several utilities and a long weekly mission. The two stacks end at different heights; the full-width Skill Matrix cannot begin until the taller stack ends, leaving unused space under the shorter one.
- There are 5 widgets in the left stack and up to 7 in the right stack. Community precedes My Learning on the left, while discovery appears below several secondary items on the right. The primary learning task is therefore not the first substantial content surface after the hero.
- The page uses a good consistent outer gutter (`PageBody`: `px-3 md:px-4 lg:px-6`) and broadly consistent inter-card gaps (`gap-5`, then `lg:gap-6`/`xl:gap-7`); keep that rhythm rather than adding new spacing scales. `PageBody spacing="sections"` adds 32px vertical spacing between top-level blocks.
- `WeeklyMissionCard` combines the full weekly objective list and today's mission in one tall widget. `CpEarnHint` then repeats a CTA derived from that same mission data.
- The dashboard skeleton in [`StudentSkeletons.tsx`](../src/features/student/components/StudentSkeletons.tsx) describes an older page: a `1fr_340px` hero row, separate “Today”, metric, learning-catalog, Skill Matrix and progression sections. It does not mirror the current equal-column widget stacks, so loading can present a different hierarchy and geometry from the populated page.

### C. My Learning and learning data

- The three requested tabs already exist in [`MyLearningCard.tsx`](../src/features/student/components/dashboard/MyLearningCard.tsx), but their completeness differs:
  - **Current:** bootcamps are matched from public bootcamp catalog data to overview progress; in-progress content Labs are filtered from `CONTENT_LABS`.
  - **Recent:** IDs are read from `qyvora_recent_labs` in local storage. The only `markLabRecent` call found is in `NewLabsCard`; opening an item from `MyLearningCard` does not record it. If there are no recent IDs, `recentLabs` becomes the first three recommended content Labs and displays them under “Recent”.
  - **Saved:** IDs are read from `qyvora_saved_labs` in local storage. `MyLearningCard` receives `CONTENT_LABS`, so saved/recent lists in this card cannot resolve practical Labs from `UNIFIED_LABS`. The bookmark control is only rendered on these content-Lab rows; `NewLabsCard` has no save action.
- Lesson progress is computed in [`savedLabs.ts`](../src/features/student/utils/savedLabs.ts) from `qyvora_course_progress_<id>` written by [`CourseLessonPage`](../src/features/student/pages/CourseLessonPage/index.tsx); it is browser-local and derives a percentage from completed lesson count. It is not in `/student/overview` and is not cross-device. Bootcamp progress is derived from the overview. The dashboard does not supply practical-Lab progress to `MyLearningCard`.
- Learning rows currently use a generic `BookOpen` icon for all Labs and `GraduationCap` for bootcamps. By contrast, `NewLabsCard` already uses the official `LabBadge`; existing `CourseBadge` and badge asset mappings are available. The desired official item identity can be reused rather than introducing new artwork.
- A progress bar and number render only when `progress > 0`; unknown progress and a known 0% are indistinguishable. The icon never transitions into a percentage indicator. Lab description, format label, action label and bookmark control make each row relatively tall.
- Current empty behavior recommends content Labs inside the “Current” panel. That is a useful start CTA, but it should be explicitly an empty-state recommendation, not represented as current learning. “Recent” must have a true empty state rather than a recommendation fallback.

### D. Your Stats and source-of-truth limits

- `/student/overview` is the dashboard's authoritative aggregate ([`student-course.controller.ts`](../../qyvora-backend/src/modules/student/controllers/student-course.controller.ts)). `getOverview` builds `xpSummary` and bootcamp modules and returns progress metadata; it does not return a dashboard-wide list of all Lab progress or earned badge records.
- `xpSummary.streakDays` is computed by the backend from activity dates ([`student-utils.ts`](../../qyvora-backend/src/modules/student/controllers/student-utils.ts)). The rank shown is a progression/rank **tier**, not necessarily a leaderboard place.
- The displayed CP value is the resolved CP balance (`xpSummary.totalXp`/the current user value). The backend resolves CP from the chain with a MongoDB fallback. The rank thresholds subtract the signup bonus; the current dashboard does not expose a distinct lifetime “CP earned” total. Label the existing value as CP/balance unless a separate earned-points source is confirmed.
- `roomsCompleted` and `roomsTotal` are summed from `overview.modules`, which describe the student's bootcamp modules. Do not relabel this as all completed Labs.
- `TopOperatorsCard` only fetches the top five weekly entries. It does not establish a general league position for the current student.
- The backend `/student/skill-achievements` route ([`skill-achievement.controller.ts`](../../qyvora-backend/src/modules/student/controllers/skill-achievement.controller.ts)) returns per-skill distinct scenario counts and a rarity classification based on those counts. It is not an aggregate count of awarded badges. Weekly-operation badge names and completion credentials are separate data and should not be combined into a badge total without a product/data contract.

### E. Supporting widgets and state behavior

- Community suggestions/follow counts and the weekly top-five leaderboard are genuinely different data and can both remain if the dashboard has room. There is no current dashboard announcement feed or invitation inbox; `CommunityCard` shows activity and suggested users.
- `NewLabsCard` is catalogue-driven and not personalized. It overlaps with the first-three recommended content Labs used in `MyLearningCard`'s empty Current state and the false Recent fallback.
- `SessionPlannerCard` has real API-backed CRUD and useful empty/error states. It is a utility, not a primary learning task; its creation form makes it taller than a compact upcoming-session preview.
- [`useEngagement.ts`](../src/features/student/hooks/useEngagement.ts) converts request failure to `null` without exposing an error. The page renders a “No weekly mission is active” fallback when `engagement` is null, including while its request is still loading, so a failed/unresolved request can look like a genuine empty state; the `WeeklyMissionCard` loading branch is bypassed in this path.
- [`useStudentOverview.ts`](../src/features/student/hooks/useStudentOverview.ts) exposes an `error`, but [`DashboardPage/index.tsx`](../src/features/student/pages/DashboardPage/index.tsx) does not read it. The page's `syncError` is separate; the bootcamp request catches its own failure and returns `null`, so that failure does not reach the outer error handler. Distinguish loading, empty and failed states in the redesign rather than showing zero/default metrics as if they were populated.
- `CommunityCard` has no explicit initial skeleton; while data is null it can show zero relationship counts and an otherwise empty feed area. `TopOperatorsCard` has loading, empty and error states; `SessionPlannerCard` has empty/error states; `QoseDashboardCard` and the certificate banner intentionally hide on request failure.
- No mock learning records were found in the dashboard path: the course/Lab catalogs are bundled product content. There are, however, fallback copy and values (`Candidate`, zero counts/CP, generic descriptions, and the Recent-to-recommendation fallback) that must remain visibly distinct from real populated data.

### F. Skill Matrix dependency check

[`SkillMatrix.tsx`](../src/features/student/components/dashboard/SkillMatrix.tsx) is rendered only by `DashboardPage`; its nested `SkillRadarChart`, `SkillStats` and the associated [`skillRegistry.ts`](../src/features/student/utils/skillRegistry.ts) are part of that feature path. The registry combines bootcamp room counts, course completion from local storage and Lab scenario completion from local storage. The backend overview supplies only room counts, so the registry approximates the first N rooms as completed rather than receiving exact completed room IDs. The matrix is therefore not a source for the five proposed profile statistics and its percentages mix data sources with different persistence/accuracy.

Recommendation: remove the **Skill Matrix section from the dashboard composition** to reduce dashboard length and distraction, but do not delete the component, chart, registry or skill-achievement API as part of this redesign plan. First decide whether the matrix belongs on the profile/learning-progress destination and whether its approximate/local data should be corrected there.

### G. Existing design system and interactions

- **Background/surfaces:** the app page uses `bg-canvas` (dark canvas `#0b0d0e`); the dark palette also defines `bg-bg` `#000000`, `bg-bg-alt` `#080808`, `bg-bg-card` `#050505`, and `bg-bg-elevated` `#0b0b0b`. The calmer dashboard `Card` surface is `bg-surface` `#121617`, with `bg-surface-raised` `#181d1e` for inset/supporting content. The single brand accent is `#06B66F`; text is near-white `#EEF0EE`, with secondary/muted opacity variants. The design tokens also define light-theme values; this audit's dark values describe the current default palette, not a request to remove theme support.
- **Borders/radius/padding:** major cards follow `rounded-2xl` (16px). `CardBase` uses a stronger accent border and top shimmer; the calmer `Card` uses `border-border-subtle`. Internal list items use rounded 12px surfaces and separate borders in several widgets. Most cards use `p-5 md:p-6` (20/24px); current rows use 12px vertical padding or 10–12px inset padding. Prefer the calm surface and existing padding scale with dividers in place of extra card borders.
- **Typography/icons:** body text is JetBrains Mono and headings use Space Grotesk via the global heading rules. Dashboard headings/labels use existing `type-h2`, `type-body-sm`, `type-meta` and related utility classes; keep that hierarchy rather than adding a second scale. Icons are named `lucide-react` icons, typically 16–20px inside 40–44px icon containers. Learning identity already has official `LabBadge`/`CourseBadge` assets that should replace the generic `BookOpen` for catalog rows.
- **Hover/focus/motion:** card surfaces transition border/shadow/background; links generally change title/border/icon color on hover and several learning/list links supply an accent `focus-visible` outline. `FilterTabs` has a selected state and color/background transition; bookmark controls have hover styling but a 36px box. Progress bars animate width using the existing slow duration/smooth easing. Dashboard cards are individually wrapped with `ScrollReveal` and the page with `FadeIn`; retain or simplify those only after checking reduced-motion behavior. Reuse the existing 120/160/260/420ms motion tokens and global focus-visible treatment; do not add decorative glow or new animation effects.
- **Responsive behavior:** `AppShell` keeps horizontal navigation at desktop and switches to the mobile overlay below `lg` (1024px). `PageBody` provides `px-3 md:px-4 lg:px-6`. The dashboard itself changes to equal columns at `lg`, while each card is full width below it. The current Skill Matrix becomes a two-card grid at `lg` and keeps 420px minimum card heights below that breakpoint. The proposed responsive behavior is specified in §4.
- **Reference boundary:** borrow the reference's stated wider/narrower content relationship, compact rows and content-weighted widget sizing. Keep QYVORA's palette, mono/Space Grotesk typography, icons, radius, card primitives and motion; do not imitate TryHackMe's brand treatment.

## 3. Proposed dashboard architecture

Keep the existing route, shell and shared `PageBody`. Refactor the current page composition and existing widgets rather than introducing a parallel dashboard system:

```text
AppShell + existing student navigation
└─ PageBody
   ├─ CertificateClaimBanner (only when eligible)
   ├─ optional, contextual QOSE status/promo
   └─ responsive dashboard composition
      ├─ Primary learning column
      │  ├─ DashboardHero (compact continue objective)
      │  ├─ MyLearningCard (Current / Recent / Saved; primary surface)
      │  └─ Discover Labs (small, non-duplicative discovery list)
      └─ Supporting column
         ├─ YourStatsCard (identity + one compact metric arrangement)
         ├─ WeeklyMissionCard (current operation and daily mission, concise)
         ├─ CommunityCard (activity/suggestions)
         ├─ WeekActivity or TopOperatorsCard (compact, based on priority)
         └─ SessionPlannerCard (upcoming plans first; scheduling affordance)
```

The exact order of the lower-priority supporting widgets can be tuned after content-length review, but keep one explicit reading order; do not use masonry or height-based placement. The QOSE status can remain conditional and should not displace My Learning when irrelevant. Keep the certificate claim near the top because it is a time/action-specific notice.

Use one outer surface for each major widget. Inside surfaces, use headings, aligned metadata, divider-separated rows and compact metrics. A row is not a card: avoid its own background/border unless it is an independently selectable object. Use the existing `Card` calm surface for dashboard panels; retain `CardBase` for other features that rely on its current appearance.

## 4. Proposed layout and responsive behavior

### Desktop (wide desktop, approximately 1280px and above)

- Use the full content width with the existing responsive page gutters; remove the dashboard-only `max-w-[1360px]` constraint in the later implementation.
- Use a 12-column or equivalent fluid grid: approximately 8/12 primary and 4/12 supporting. The narrower column should still have a practical minimum width and the layout should not start before it can accommodate it.
- Put the hero and My Learning first in the primary column. Keep natural content heights; do not force equal-height cards. Place compact supporting widgets independently in the rail.
- Do not stretch cards to align with a taller neighbor. Let each widget size to content, with shared top alignment and consistent inter-widget gaps.
- Keep any broad discovery section low in the primary flow or spanning the full grid only if it has enough content to justify that width.

### Tablet (768px to the wide-desktop breakpoint)

- Prefer one predictable vertical content order rather than squeezing the learning panel and the long weekly-mission widget into equal columns.
- Keep hero and My Learning full width. Where useful, arrange only short supporting widgets (for example stats/activity or community/leaderboard) in a two-column subgrid; long mission/session content stays full width.
- Preserve visible section labels, avoid horizontal page overflow and do not require hover to reveal information.

### Mobile (below 768px)

- Single-column order: hero, My Learning, essential stats/mission, then contextual/supporting widgets. Keep the student topbar and its existing full-screen sidebar behavior unchanged.
- Make tabs wrap or scroll within their own control area without forcing the page wider. Learning rows should keep the official icon, title and primary action visible; clamp optional description text.
- Ensure bookmark and row-level controls meet the existing 44–48px touch-target guidance. Avoid placing a separate tiny action beside a full-row link.
- Render progress information by default or on both pointer hover and keyboard focus; on touch there is no hover state. Keep keyboard focus, screen-reader text and reduced-motion behavior equivalent to pointer interaction.

### Spacing and surfaces

- Retain the `PageBody` gutters and use a consistent 16–24px widget gap, adjusted only at existing breakpoints.
- Use the shared `rounded-2xl` major-card convention, neutral subtle borders and existing dark surface tokens. Keep accent for active tabs, links, progress and meaningful status.
- Prefer one outer panel, with internal padding aligned to existing `p-5 md:p-6` patterns. Use dividers for learning and leaderboard rows; use a small metric grid with dividers rather than a grid of nested cards.
- Avoid fixed/minimum heights unless a chart or skeleton geometry requires them. The dashboard should expand with content, not leave chart-sized empty regions.

## 5. Component-level changes

| Existing component | Recommended action | Reason |
|---|---|---|
| `DashboardPage` | Refactor | Replace the equal-width stacks and page-level width cap with the primary/supporting responsive composition; centralize data-state distinctions and stop placing Skill Matrix after the full dashboard. |
| `PageBody` | Keep | It already supplies canonical full-width gutters and dashboard vertical rhythm. |
| `DashboardHero` | Refactor | Keep the current objective and CTA, but compact it so My Learning follows immediately and it does not dominate the first screen. |
| `MyLearningCard` | Refactor | Make it the primary learning surface; unify item types, correct Recent/Saved semantics, use true empty states and expose only known progress. |
| `LearningRow` / `BookmarkButton` | Refactor | Use existing official item badge/icon, compact content, avoid nested row cards, meet touch-target/focus requirements and add the purposeful progress-icon interaction. |
| `YourStatsCard` / `StatTile` | Refactor / Merge | Make this the single profile-and-statistics card; replace nested tiles with one aligned compact metric arrangement. Do not display unsupported badge/position numbers. |
| `LeagueCard` | Merge | Merge its progression/rank link into `YourStatsCard` or retain only a small leaderboard link; remove repeated CP/rank/streak surfaces. |
| `WeeklyMissionCard` | Refactor | Keep its real engagement data but reduce height and clarify loading/error/empty states; do not add another mission CTA surface. |
| `CpEarnHint` | Merge | Fold its contextual CTA into the mission widget or remove it from this page after checking whether another route imports it. It repeats the same engagement payload. |
| `CommunityCard` | Keep / Refactor | Keep real feed and follow functionality as a secondary widget; compact its header and make initial loading distinct from zero counts. Do not describe it as invitations. |
| `SessionPlannerCard` | Keep / Refactor | Preserve API-backed scheduling, but show upcoming plans compactly and make creation a clear secondary action so the form does not dominate the support column. |
| `TopOperatorsCard` | Keep / Refactor | Retain the public top-five preview if it remains useful; keep it distinct from the current user's progression tier and do not imply it is the user's league position. |
| `NewLabsCard` | Refactor | Keep catalog discovery as a lightweight list; avoid duplicating My Learning's recommended empty state and “Recent” fallback. |
| `WeekActivity` | Keep | It is a compact optional activity summary from overview visits; keep it only if it adds information not already present in the streak metric. |
| `QoseDashboardCard` | Keep | Its state is context-specific and API-backed; keep conditional, but position it so it does not interrupt the primary learning flow. |
| `CertificateClaimBanner` | Keep | It is an eligibility-gated action notice, not a general dashboard card. |
| `SkillMatrix` | Remove from dashboard composition; retain component | It is tall, downstream of the main grid and uses approximate/mixed-source data. Decide on a better destination before any deletion or data-model change. |
| `SkillStats` / `SkillRadarChart` / `skillRegistry` | Keep pending destination decision | These are currently coupled to Skill Matrix and have no other discovered dashboard consumer; preserve them until the matrix's future home/data contract is decided. |
| `DashboardSkeleton` | Refactor | Make loading geometry match the redesigned page and preserve the same column/order transitions without old sections that are no longer rendered. |
| `DailyMissionCard`, `WeeklyOperationCard`, `ActiveDeployments` | Keep for now; verify consumers before cleanup | They are exported but not mounted by this dashboard. They should not be added alongside the current combined mission/catalog widgets. |
| `Card` / `CardBase` shared primitives | Keep | Reuse existing primitives; do not change global surface behavior for a dashboard-only redesign. Prefer the calmer `Card` for dashboard surfaces. |
| `FilterTabs` | Keep; audit semantics when refactoring tabs | It already provides the established visual pattern and selected state. Ensure the My Learning tab panel has complete keyboard and assistive-technology behavior without causing regressions to other consumers. |
| `StudentDesktopTopbar` / `StudentSidebarRedesigned` | Keep | Existing responsive student navigation is owned by `AppShell`, not the dashboard page. |

## 6. Data and backend requirements

### Confirmed existing capabilities

| Need | Existing source | Limits to preserve |
|---|---|---|
| Profile identity | Auth user in `AuthContext`; `ProfileAvatar` already used by `YourStatsCard` | Current card falls back to `operator` when username is absent. |
| Streak | `/student/overview` → `xpSummary.streakDays`, computed server-side from activity dates | Do not derive a separate streak from the chart or browser state. |
| Rank tier | `/student/overview` → `xpSummary.progression.rank` | This is progression tier/label, not global leaderboard place. |
| CP balance | `/student/overview` → `xpSummary.totalXp`, resolved chain-first with DB fallback; user CP is also available | No distinct total-earned field is used by this card; preserve the distinction between balance and earned amount. |
| Bootcamp progress/rooms | `/student/overview` → `modules`, `learningPath`, `progressMeta` | Room sums cover the bootcamp overview, not all platform Labs. |
| Weekly/daily objective | `/student/engagement` | The current client hides request errors behind `null`; fix state reporting before interpreting null as “no mission.” |
| Recent community/social relationships | `/student/community`, `/student/community/following`, `/student/community/followers` | Data is feed/suggestions/following, not invitations or announcements. |
| Session plans | `/student/session-plans` GET/POST/PATCH/DELETE | Dashboard currently uses GET/POST/DELETE. |
| Weekly leaderboard preview | `/public/leaderboard?period=week&limit=5` | Top five only; does not provide a guaranteed position for the signed-in user. |
| Lab/course catalog and official icons | Frontend `UNIFIED_LABS`, `CONTENT_LABS`, `LabBadge`, `CourseBadge`, badge asset registry | Catalog metadata is bundled frontend data; it is not a per-user recommendation feed. |
| Content-Lab lesson completion | `CourseLessonPage` local storage key `qyvora_course_progress_<id>` | Browser-local only; no dashboard-wide backend progress in `/student/overview`. |
| Saved/recent preferences | `qyvora_saved_labs` and `qyvora_recent_labs` in `savedLabs.ts` | Browser-local only; current recording coverage and catalog resolution are incomplete. |
| Practical-Lab completion writes | Existing student completion path/model (`LabCompletion`) | `getOverview` does not aggregate these into its dashboard payload. |
| Skill-related achievements | `/student/skill-achievements` | Returns per-skill distinct scenario counts/rarity, not a generic earned-badge total. |
| QOSE and credential prompts | Existing QOSE registration service and credential lookup | QOSE is a contextual product card; credentials are not automatically a badge-count source. |

### Missing or unresolved

1. **Earned badge count:** No aggregate earned-badge count is present in the dashboard payload. Confirm the product definition and authoritative record/model before adding this metric. Do not use skill-achievement rows, weekly-operation badge labels or certificate credentials as a proxy.
2. **User's global/league position:** The dashboard has a tier name and a top-five weekly list, not a reliable current-user place. Confirm whether the desired number is a weekly ranking, all-time ranking or progression tier. If it is a place, use an existing authoritative leaderboard response if available; otherwise plan a backend read endpoint rather than calculating from the top-five preview.
3. **Points earned vs balance:** Confirm whether “earned points” means current CP balance or net CP earned. Current dashboard data supports the balance; the rank calculation's signup-bonus subtraction shows that those concepts can differ.
4. **Practical-Lab progress and completed items:** The backend completion write exists, but the overview does not return a per-item dashboard summary. If My Learning should show progress/completion beyond current content lessons and bootcamp counts, add an authoritative aggregate/read contract only after defining the needed statuses and percentages.
5. **Current/recent/saved persistence:** Decide whether browser-local behavior is the intended product scope. Server persistence is only necessary if saved/recent lists must follow the learner across devices; do not add an API merely to restyle the existing local behavior.
6. **Recommendation/announcement/invitation content:** No personalized recommendation endpoint, announcement feed or invitation inbox is wired into the current dashboard. Keep current catalog discovery accurately labeled and do not fabricate these datasets.

## 7. Interaction specifications

### Current / Recent / Saved

- **Current:** Show only truly active items: in-progress bootcamp/Lab work and its next destination. Keep the count aligned with visible, valid items. If there is no active item, show a clear empty state and a browse/start action; recommendations may appear below it but must be labeled as recommendations.
- **Recent:** Show items recorded as opened, in most-recent-first order, resolving all supported learning types from the unified catalog. An empty list gets a “nothing opened yet” state and browse action. Never substitute recommended items under a Recent label.
- **Saved:** Show explicitly bookmarked items across supported types. The bookmark action must be available anywhere an item can be saved, and unsave updates this list immediately. Keep local-only persistence clearly intentional unless a cross-device requirement is approved.
- Maintain stable tabs and scroll position when changing state. Keep selected-state indication, count, focus visibility and associated panel semantics. On mobile, controls remain operable without horizontal page overflow.

### Learning rows and progress hover/focus

- The row's main link opens the item's existing route. Keep the bookmark action a separate, labeled control so toggling a bookmark does not navigate.
- Identity uses the existing type-specific badge/icon (for example `LabBadge`/`CourseBadge`; preserve a distinct bootcamp identity). Title is primary, description is optional and clamped, type is secondary metadata, and the action/progress is subordinate.
- Show percentage only when a valid progress value exists. Keep known 0% distinct from unavailable progress. Do not infer completion from an item name, catalog ordering or badge color.
- On pointer hover **and keyboard focus**, the icon area may smoothly reveal a compact “NN%” status using existing transition tokens/easing. The icon/percentage swap must not move the row or steal pointer events. On touch, expose the progress without requiring hover. Provide a screen-reader label such as “NN percent complete”; respect reduced-motion preferences.
- Prefer an always-visible small progress bar/percentage if the icon transition would hide important state or be inaccessible. Treat the hover reveal as supplementary, not the only progress affordance.

### Statistics

- One card starts with profile identity and the authoritative progression tier/status, then shows compact, aligned labels and numeric values.
- The intended metric set is streak, rank/league, CP, completed rooms and earned badges. Use the existing progression tier in the rank slot unless an authoritative place is available; label the existing points value as CP balance unless an earned-points total is confirmed; scope room completion to bootcamp rooms; and leave the badge metric out until its source is confirmed rather than filling it with a proxy. Arrange the values compactly below identity, using existing metric/icon patterns instead of five independent cards.
- Use a single CP metric with a label that matches its data contract. Show completed bootcamp rooms only if explicitly labeled as bootcamp rooms.
- Show a leaderboard place only when the data identifies the ranking period/scope and returns the signed-in user's actual row/place. Show an earned-badge total only after a badge source is confirmed; otherwise omit the metric rather than substituting another count.
- Consolidate next-rank progress in this card if useful; do not repeat it in a second Competitive/League card.

### Supporting widgets, responsive use and motion

- Weekly/daily missions share one real-data widget with clear loading, empty and error states. The CTA points to the exact existing destination; it should not be repeated in a separate CP hint.
- Community, leaderboard, sessions, QOSE and credential prompts keep their current actions and API ownership. Use distinct widget heights based on content rather than forcing identical card dimensions.
- Hover/focus styles communicate an action or reveal meaningful status; no decorative motion is required. Use existing QYVORA motion tokens and preserve reduced-motion support. Keep the mobile topbar/overlay navigation unchanged.

## 8. Implementation roadmap

This sequence is planning only; each phase is independently verifiable. Do not start backend work until the data questions in §6 are resolved.

### Phase 1 — Confirm metric and learning-data contracts

- **Files/components:** `DashboardPage/index.tsx`, `useStudentOverview.ts`, `useEngagement.ts`, `savedLabs.ts`, backend `student-course.controller.ts`, `student.routes.ts`, `student-utils.ts`, leaderboard and credential/achievement data sources as needed.
- **Outcome:** A written mapping for each displayed metric and each learning item type, including known/unknown progress and whether saved/recent are intentionally browser-local.
- **Dependencies:** Product decision on rank scope, points terminology, badge definition and cross-device behavior.
- **Acceptance criteria:** Every planned displayed value maps to a real response/property or is explicitly omitted; no placeholder or inferred metric is presented as authoritative; request failure is distinguishable from a valid empty result.
- **Regression risks:** Changing cached overview/engagement contracts can affect the topbar, sidebar, bootcamp pages and other dashboard consumers. Keep existing API fields backward compatible and audit all hook consumers before changing their shapes.

### Phase 2 — Refactor the dashboard composition and loading geometry

- **Files/components:** `DashboardPage/index.tsx`, `StudentSkeletons.tsx`, existing `DashboardHero`, `QoseDashboardCard`, `CertificateClaimBanner`, shared `PageBody` usage.
- **Outcome:** Full-width, predictable primary/supporting composition and a matching responsive skeleton; Skill Matrix is no longer in the dashboard composition, but its files/data remain intact.
- **Dependencies:** Phase 1 data-state decisions; no backend dependency for layout-only work.
- **Acceptance criteria:** Wide layout uses a wider learning area and narrower support rail; smaller breakpoints stack in the same logical order; no page-level width cap or fixed widget height; skeleton and populated page have matching order/geometry; no unrelated shell/navigation changes.
- **Regression risks:** Page height/order changes, conditional QOSE/certificate notices moving content, and topbar clearance if page padding is duplicated. Keep `PageBody` and `AppShell` as the layout owners.

### Phase 3 — Unify My Learning rows and states

- **Files/components:** `MyLearningCard.tsx`, its `LearningRow`/`BookmarkButton`, `savedLabs.ts`, `UNIFIED_LABS`/catalog mapping, existing `LabBadge`, `CourseBadge`, `FilterTabs`.
- **Outcome:** A single compact learning surface with accurate Current/Recent/Saved panels and type-specific identity/progress.
- **Dependencies:** Phase 1 progress/persistence contract; Phase 2 composition.
- **Acceptance criteria:** Current only shows active items; Recent only shows recorded items and has a true empty state; Saved resolves every supported saved type; no recommendation is labeled Recent; each row opens the correct existing destination; progress is labeled only when known; badge/bookmark/link controls are keyboard and touch accessible.
- **Regression risks:** Existing local-storage keys must remain readable; event synchronization must continue; shared `FilterTabs` changes can affect other consumers; course and bootcamp destinations must remain unchanged.

### Phase 4 — Consolidate stats and supporting widgets

- **Files/components:** `YourStatsCard.tsx`, `LeagueCard.tsx`, `WeeklyMissionCard.tsx`, `CpEarnHint.tsx`, `CommunityCard.tsx`, `SessionPlannerCard.tsx`, `TopOperatorsCard.tsx`, `NewLabsCard.tsx`, `WeekActivity.tsx`.
- **Outcome:** One coherent identity/stats card, one non-duplicative mission widget, and appropriately compact supporting widgets.
- **Dependencies:** Confirmed metrics from Phase 1; Phase 2 placements. A badge-count or user-rank backend field is conditional, not a prerequisite to layout completion.
- **Acceptance criteria:** CP/rank/streak are not repeated across separate cards; the stats labels match the data contract; no unsupported badges or league positions appear; no separate CP hint repeats mission CTA; widget empty/error states remain honest; discovery is not duplicated as Current/Recent content.
- **Regression risks:** Removing a widget from the page must not remove its existing route/API functionality; do not fold distinct community/leaderboard data into an incorrect single metric.

### Phase 5 — Responsive, accessibility and state verification

- **Files/components:** Dashboard page, all retained dashboard widgets, `DashboardSkeleton`, shared tab/button primitives only if needed.
- **Outcome:** Verified desktop/tablet/mobile layouts and all loading, empty, error and populated states.
- **Dependencies:** Phases 2–4.
- **Acceptance criteria:** Review 360, 768, 1024, 1440 and 1920px widths; test keyboard-only tabs/links/bookmarks and screen-reader labels; verify 44–48px interactive targets, focus-visible states, no horizontal overflow, reduced-motion behavior, loading/error/empty states, and no data loss across the existing local-storage keys.
- **Regression risks:** Breakpoint changes may affect row wrapping and tab width; hover-only progress may be unavailable on touch; adding data to overview can affect its cache and all existing consumers.

## 9. Visual quality checklist

- [ ] The primary learning task is visible immediately after the hero/eligible notice.
- [ ] At wide desktop widths, the learning column is visibly wider than the supporting rail.
- [ ] The layout has a clear top-aligned order and no masonry-driven reordering.
- [ ] The page uses the full available content width with the established responsive gutters.
- [ ] Major widgets use one calm QYVORA surface; list items are generally rows separated by spacing/dividers, not mini-cards.
- [ ] CP, rank tier, streak and progress are not repeated in separate widgets.
- [ ] There is no false “Recent” content and no fabricated metric or mock recommendation.
- [ ] Learning rows use existing official type-specific badges/icons, concise text and the correct route.
- [ ] Progress is displayed only when its source is known; hover/focus is smooth, stable, keyboard-accessible and not required on touch.
- [ ] Empty, loading and error states are visually distinct and do not masquerade as zero-valued populated data.
- [ ] Card padding, row alignment, radius and spacing follow existing QYVORA tokens/patterns.
- [ ] Accent color is reserved for meaningful active/progress/action states; no TryHackMe branding, colors, type or imagery is copied.
- [ ] No major panel is forced to a fixed height solely to align with another widget.
- [ ] Tablet and mobile orders prioritize learning and remain usable without horizontal page scroll.
- [ ] Navigation continues to come from the existing responsive `AppShell`.
- [ ] Reduced-motion, focus-visible and touch-target requirements are preserved.

## Source references reviewed

- Frontend route/shell/page: `src/app/router.tsx`, `src/features/student/layouts/AppShell.tsx`, `src/features/student/pages/DashboardPage/index.tsx`.
- Dashboard components/data: `src/features/student/components/dashboard/`, `src/features/student/components/StudentSkeletons.tsx`, `src/features/student/hooks/useStudentOverview.ts`, `src/features/student/hooks/useEngagement.ts`, `src/features/student/utils/savedLabs.ts`, `src/features/student/utils/skillRegistry.ts`, `src/features/student/data/labs/`.
- Shared UI/design conventions: `src/shared/components/ui/Card.tsx`, `src/shared/components/ui/FilterTabs.tsx`, `src/shared/components/layout/PageBody.tsx`, `src/shared/components/LabBadge.tsx`, `src/shared/components/CourseBadge.tsx`, `src/styles/index.css`, `docs/TOKENS.md`, `docs/RESPONSIVE.md`, `docs/UI-PRINCIPLES.md`, `docs/UI-PATTERN-INVENTORY.md`.
- Backend contracts inspected read-only: `../../qyvora-backend/src/modules/student/routes/student.routes.ts`, `controllers/student-course.controller.ts`, `controllers/student-utils.ts`, `controllers/daily-mission.controller.ts`, `controllers/community.controller.ts`, `controllers/skill-achievement.controller.ts`, and `models/StudentOverview.ts`.
