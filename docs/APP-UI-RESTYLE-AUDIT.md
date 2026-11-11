# App UI System v2 — Phase 0 Audit

Scope: the signed-in student application (`AppShell`, dashboard, profile, learning
pages, settings) plus the shared primitives they consume. The public marketing
site keeps its existing rules. This audit records what the prompt changes, what
the code actually does today, and how the conflict is resolved.

Baseline at `618b8032` (master):

- `npm run typecheck` — pass
- `npm run lint` — pass (0 warnings)
- `npm test` — 79 files / 547 passed, 1 skipped
- `npm run build` — pass

---

## 1. Rule conflicts

### 1.1 `AGENTS.md`

| Line | Quote (abridged) | Conflict | Resolution |
|---|---|---|---|
| 14 | "surfaces lift in steps (bg -> bg-alt -> bg-card -> bg-elevated)" | The app uses the calm ladder (`canvas → surface → surface-raised`); the legacy ladder is public-site only. | Keep for public site; app rules moved to `docs/APP-UI-SYSTEM.md`. |
| 16 | "JetBrains Mono body (global), Space Grotesk headings … Never add `font-display`. Headings always `font-black` (900)" | App uses Ubuntu 400/500/700; headings 700. | Public rule stays; app rule replaced. `font-display` class still banned (the scope maps `--font-display`). |
| 17 | "`max-w-*` page containers" ban | Still true for both. | Keep. |
| 36, 45 | "Kickers/eyebrows: tiny uppercase accent text … legacy `text-[10px]`/`text-[9px]`" | App minimum visible text is 12px; uppercase only for ≤12px overlines. | App: use overline token (12px); public keeps legacy allowance. |
| 40, 44 | "No `max-w-*` on page-level containers" | Still true; learning shell currently violates it (`max-w-[1240px]`). | Keep rule; code fixed in Phase 5. |
| 51 | "Cards: always `rounded-2xl`. Never mix radius scales." | App cards 8px, controls 6px, pills full. | Public keeps `rounded-2xl`; app documents radius scale in `APP-UI-SYSTEM.md`. |
| 60–64 | "walkthrough text … `font-mono leading-[2] md:leading-[2.2]` … headings `font-black uppercase`" | App learning body is Ubuntu 16/1.7, sentence case, headings 700. | Replace for app; public blog keeps mono/`leading-[2]`. |
| 67 | "every learning page renders exactly ONE `CardDeckSurface` … Never render step lists … `FocusedStepList`/`LearningNav` are legacy" | Code actually renders `LearningTaskAccordion` in `WalkthroughLayout`, `BootcampRoomPage`, `CourseLessonPage`; `CardDeckSurface` is used only within learning blocks. | Rewrite rule to describe the real accordion + deck-blocks structure. |
| 70 | "Walkthrough content must NOT use `wc-prose` … full viewport width" | Still true; keep and enforce in hero/shell. | Keep. |
| 113–124 | "Do Not Reintroduce" list | Partly obsolete. | Prune in Phase 7. |
| 146 | Split-screen pattern references `font-black uppercase text-[10px]` | Public-only landing pattern. | Keep under public rules. |
| 153 | "Profile content … consistent `rounded-2xl` cards" | Profile now uses the same 8px app cards and section cards. | Replace for app; public profile matches student profile. |
| — | Profile "protected/frozen cards, never modify" (docs, not AGENTS) | Contradicts this prompt. | Removed/rewritten in Phase 7. |

### 1.2 `docs/*.md`

| File | Conflict | Resolution |
|---|---|---|
| `UI-PRINCIPLES.md` | Encodes mono body / 900 headings / filled pill tabs as universal. | Banner + pointer to app system; app-specific rules corrected. |
| `UI-PATTERN-INVENTORY.md` | Documents `FilterTabs` pills, uppercase badges, `rounded-2xl` cards as the only patterns. | Banner; add underline tabs, section cards, app primitives. |
| `DESIGN_SYSTEM.md` | Space Grotesk + JetBrains Mono + shimmer/shadow cards. | Banner; app tokens documented separately. |
| `COMPLETE_UI_DESIGN_SYSTEM.md` | Large legacy spec including glow/beam/shimmer and `font-black`. | Banner; mark legacy/public. |
| `TOKENS.md` | Lists only legacy surface ladder. | Banner; add calm/app ladder reference. |
| `TYPOGRAPHY.md` | Heading scale assumes Space Grotesk 900. | Banner; app Ubuntu 700 scale added. |
| `PROFILE_PAGE_UI.md` | Calls profile cards "protected/never modify". | Remove protection language; profile is a design-system consumer. |
| `COMPONENTS.md`, `COMPONENT_STATES.md` | Button/badge/card states reflect legacy look. | Banner; app states in `APP-UI-SYSTEM.md`. |
| `PAGE_PATTERNS.md` | Page header patterns uppercase. | Banner; app recipes documented. |
| `LEARNING_BLOCKS_UI_REFERENCE.md` | Says one-deck-card-only and mono prose. | Banner; correct accordion vs deck facts. |
| `LEARNING-WALKTHROUGH-REFACTOR.md` | Same one-deck-card assumption. | Banner; correct. |
| `DASHBOARD_UI_AUDIT_AND_REDESIGN_PLAN.md` | Earlier layout plan (5-card grid, uppercase titles). | Banner; superseded by Phase 3. |
| `RESPONSIVE.md` | References old topbar heights. | Banner; update to `--app-topbar-h`. |

---

## 2. Radius / typography census (app code)

Counts are raw token occurrences (not files). Directories per the prompt.

| Directory | rounded-2xl | rounded-xl | rounded-lg | font-black | uppercase | text-[9px] | text-[10px] | text-[11px] | font-mono | border-2 |
|---|---|---|---|---|---|---|---|---|---|---|
| `src/features/student` | 59 | 97 | 71 | 186 | 173 | 0 | 21 | 10 | 164 | 5 |
| `src/features/qose` | 0 | 6 | 1 | 7 | 5 | 0 | 0 | 0 | 6 | 0 |
| `src/shared/components/dashboard` | 3 | 4 | 3 | 4 | 2 | 0 | 0 | 0 | 4 | 1 |
| `src/shared/components/profile` | 17 | 17 | 15 | 34 | 46 | 0 | 21 | 7 | 77 | 1 |
| `src/shared/components/learning` | 9 | 13 | 15 | 36 | 30 | 0 | 2 | 1 | 24 | 0 |
| `src/shared/components/walkthrough` | 0 | 5 | 4 | 13 | 13 | 0 | 8 | 0 | 7 | 0 |
| `src/shared/components/ui` | 8 | 13 | 11 | 12 | 16 | 0 | 0 | 0 | 8 | 1 |
| `src/shared/learning` | 9 | 20 | 11 | 63 | 59 | 0 | 43 | 0 | 44 | 7 |

These are reduced primarily by the scoped token overrides (`--radius-*`,
`--font-weight-*`) plus primitive migration, not by hand-editing every utility.

---

## 3. Fixed-height coupling (topbar)

Places that assume the current `h-16` / `h-[72px]` topbar or `top-24` sticky offset:

- `src/features/student/layouts/AppShell.tsx:85-86` — comment + `topbarPadding`
  (`pt-[calc(4rem…)] md:pt-[calc(4.5rem…)]`). Phase 2 replaces with
  `pt-[calc(var(--app-topbar-h)+env(safe-area-inset-top))]`.
- `src/features/student/components/layout/StudentDesktopTopbar.tsx:129` — `h-16 … md:h-[72px]`.
- `src/features/student/pages/ProfilePage.tsx:125` — `lg:sticky lg:top-24`.
- `src/features/marketing/pages/PublicProfilePage.tsx:152` — `lg:sticky lg:top-24`.
- `src/features/student/components/StudentSkeletons.tsx:145` — `lg:sticky lg:top-24` (profile skeleton).
- `src/shared/components/learning/LearningTaskAccordion.tsx:113` — `scroll-mt-24`.
- `src/shared/components/walkthrough/__tests__/WalkthroughLayout.test.tsx:108` — asserts `scroll-mt-24`.
- `src/shared/learning/renderer/LearningBlockRenderer.tsx:49` — `scroll-mt-20 md:scroll-mt-24`.
- `src/shared/components/learning/FocusedStepList.tsx:122` — `scroll-mt-20 md:scroll-mt-24`.
- `src/features/student/components/bootcamp-room/QuizModal.tsx:218` — `scroll-mt-20 … md:scroll-mt-24`.
- `src/features/student/components/layout/StudentBottomNav.tsx:209` and
  `src/shared/components/layout/PublicBottomNav.tsx:42` — `h-16` spacer (not the topbar; leave).
- `src/shared/components/learning/LearningWorkspaceShell.tsx` — uses top padding
  `pt-6 md:pt-8` under the shell; no topbar constant.
- `src/shared/components/learning/LearningTaskAccordion.tsx:185` — `pl-[4.5rem]` lock message indent (cosmetic).

Rule adopted: only `--app-topbar-h` and `--app-gutter` are magic-free sources.

---

## 4. Test inventory (files in the change surface)

Behaviour tests that must keep passing:

- `src/features/student/components/layout/__tests__/StudentDesktopTopbar.test.tsx`
  — asserts five nav destinations, absence of a logo link, fullscreen, streak,
  notifications, search, profile link, Develop menu open/close. Phase 2 updates
  the logo assertion and moves fullscreen into the avatar menu.
- `src/shared/components/walkthrough/__tests__/WalkthroughLayout.test.tsx` —
  asserts accordion sections and `scroll-mt-24`; keep behaviour, update class
  assertion if the scroll margin class changes.
- `src/shared/components/learning/__tests__/LearningTaskAccordion.test.tsx` —
  open/close, active id, locked content.
- `src/shared/components/learning/__tests__/LearningAccordion.test.tsx`.
- `src/features/student/pages/__tests__/SettingsPage.test.tsx` — form behaviour,
  toggles, password change.
- `src/features/student/components/dashboard/MyLearningCard.test.tsx`,
  `WeeklyMissionCard.test.tsx`.
- `src/shared/components/profile/__tests__/*` — AchievementsSection,
  RankInsignia, AchievementBadge, CertificatesModule, SocialLinks,
  ProfileCPBalance, GithubConnectionCard, PortfolioLink.
- `src/shared/components/card-collection/__tests__/card-collection.test.tsx`.
- `src/features/student/pages/labs/__tests__/LabCard.test.tsx` — asserts badge
  and card structure.

Class/DOM assertions live in `RankInsignia`, `AchievementBadge`, `ScenarioCard`,
`card-collection`, `WalkthroughLayout`, `LabCard`. Only update where the DOM
order/class genuinely changes; keep behaviour assertions.

---

## 5. Accordion vs card deck (ground truth)

- `LearningTaskAccordion` is rendered by:
  - `src/shared/components/walkthrough/WalkthroughLayout.tsx`
  - `src/features/student/pages/BootcampRoomPage/index.tsx`
  - `src/features/student/pages/CourseLessonPage/index.tsx`
- `CardDeckSurface` is rendered **only** inside learning content blocks
  (`src/shared/learning/**`), not as the page-level step list.
- `FocusedStepList` / `LearningNav` exist and `WalkthroughLayout` renders
  `LearningNav` when `stepList` + `activeStepIndex` + `onStepSelect` are passed.

Therefore the Phase 5/7 rules describe: hero → progress strip → task accordion,
with `CardDeckSurface` as an in-task game surface. The docs claiming "one deck
card at a time, never a step list" are wrong and are corrected.

---

## 6. Tailwind v4 check

Built once and inspected the emitted CSS:

- `.rounded-2xl{border-radius:var(--radius-2xl)}` present.
- `.font-black{--tw-font-weight:var(--font-weight-black);font-weight:var(--font-weight-black)}` present.
- Theme declares `--radius-2xl:1rem` and `--font-weight-black:900`.

Conclusion: theme-variable overrides inside `:root[data-ui="app"]` will flip
existing utilities. The §4.2 fallback (per-utility overrides) is **not** needed.

---

## 7. Pre-existing issues

None. Baseline typecheck/lint/test/build are green. Remaining legacy-style lint
warnings introduced by the new guard rule are counted in Phase 7.

---

## 8. Layout stacking bug (Phase A audit)

**Root cause.** The dashboard split used `xl:grid-cols-12` with `xl:col-span-8/4`
children. `xl` is 1280px, so at the common 1024–1279 desktop range the page
stacked into one column. `PageBody` itself is a plain `div` (not flex/block
locked), so it was not the culprit; the breakpoint was.

**Findings per surface:**

- `DashboardPage/index.tsx:229` — `grid-cols-1 … xl:grid-cols-12`, children
  `xl:col-span-8` / `xl:col-span-4`. Confirmed mismatch with the intended
  `lg` (1024px) split. Replaced with `TwoColumn split="dash"`.
- `ProfilePage.tsx:123` — `grid gap-6 lg:grid-cols-12` + `lg:col-span-4/8`.
  Correct breakpoint but ad-hoc; replaced with `TwoColumn split="profile"`
  (4fr/7fr ≈ 36/64).
- `PublicProfilePage.tsx:152` — same `lg:grid-cols-12`; replaced with the
  shared `ProfileLayout`.
- `SettingsPage.tsx` — no split at all (single stack, section via route
  param). Added a 306px in-page section rail via `TwoColumn split="rail"`.
- `LearningWorkspaceShell.tsx` — no page split; it is a single content column
  by design. It had no `max-w` cap on the outer shell (only the hero text used
  `max-w-2xl`), so no stacking bug there.
- `PageBody.tsx` — gutter came from `--app-gutter`; the variable was only
  defined inside `:root[data-ui="app"]`, so any surface rendered outside that
  scope collapsed the padding to the 12px fallback. The variable is now defined
  globally with the 12/16/24/30px breakpoints.
- Tailwind v4 scanning — the new splits use literal grid templates in
  `TwoColumn.tsx` (`lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`, etc.), so they
  are scanned and emitted. Verified in the built CSS.

**Mobile width.** The gutter is now 12px at <640px (was 16px), cards are
`w-full`, and card padding is 16px at <640 / 20px 640–1023 / 24px ≥1024 via
`--app-card-pad`.


## 9. Navigation audit (Phase H)

Before Phase H the site had two separate bars: `PublicNavigation` (uppercase
10px icon labels, transparent/blurred scroll state, fullscreen button, inline
Dashboard/auth buttons, its own account drawer) and `StudentDesktopTopbar`
(breadcrumb, 14px labels, Practice/Develop dropdowns, search + account menu).
Public pages also rendered `PublicBottomNav`; the student tree shipped an unused
`StudentBottomNav`; admin and docs still render their own bottom bars.

After Phase H:

- `SiteTopbar` owns fixed positioning, height, border, logo, item rendering,
  dropdown surface, hide-on-scroll and `--app-topbar-offset`.
- `NavDropdown` is the shared group menu; `AvatarMenu` is the shared account
  menu; `MobileMenu` is the shared drawer.
- `PublicNavigation` and `StudentDesktopTopbar` are thin wrappers.
- `PublicBottomNav` and `StudentBottomNav` are deleted; public pages have no
  bottom navigation.
- Remaining: `AdminBottomNav` and `DocsBottomNav` still exist because their
  mobile navigation has not yet been converted to the shared hamburger drawer.
