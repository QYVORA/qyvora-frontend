# UI Regression Fix Report — Phase 1

Phase 1 repairs from the botched UI rebuild, per `UI-REGRESSION-AUDIT.md` and the approved repair order. All findings were confirmed as regression artifacts of the rebuild (newly introduced APIs or broken wiring), not pre-existing design choices.

## Repairs applied

### 1 — Bootcamp room navigator restored (BLOCKER, now fixed)

The room navigator sidebar was unreachable at every breakpoint: `WalkthroughSidebar` only rendered a mobile drawer (backdrop + aside both carried `md:hidden`), and its opening was driven by a `bootcamp:openSidebar` window event that nothing ever dispatched.

- `src/shared/components/walkthrough/WalkthroughSidebar.tsx`
  - Desktop `<aside>` removed → drawer (`fixed left-0 … z-[70] w-[92vw] max-w-[360px]`) now opens on **all** breakpoints as an on-demand overlay. Mirrors the existing drawer pattern — no new desktop rail was invented.
- `src/features/student/pages/BootcampRoomPage/index.tsx`
  - Removed the dead `bootcamp:openSidebar` window listener.
  - Added a `room-navigator` action (icon: `PanelLeft`) to the page's existing `LearningToolbar` that calls `setSidebarOpen(true)`. The drawer is now reachable on desktop and mobile with one consistent control.

### 2 — Student desktop navigation de-duplicated (HIGH)

Desktop showed the same set of destinations three times: sidebar rail + topbar tabs + topbar hamburger. Per the approved decision, the **sidebar rail is the single source of truth on lg+**; the topbar tabs/hamburger become mobile-only.

- `src/features/student/components/layout/StudentTopbar/StudentTopbar.tsx`
  - Dashboard-mode tabs: `hidden lg:flex` → `hidden md:flex lg:hidden` (visible only on md..lg where there is no rail).
  - Desktop-hamburger span → `lg:hidden`. Right-aligned actions preserved with a `hidden lg:block flex-1` spacer.
  - Settings-mode hamburger → `lg:hidden`. Room-mode (course/bootcamp/lab) hamburgers kept — those pages have `useRail=false`.

### 3 — Dead walkthrough layout API removed (HIGH)

`WalkthroughLayout` still accepted `sidebar`, `toolbar`, and `navigation` props with open slots that no page provided.

- `src/shared/components/walkthrough/WalkthroughLayout.tsx`
  - Removed the dead `sidebar`/`sidebarOpen`/`onSidebarToggle` and `toolbar`/`navigation` props.
  - Labs (which pass `stepList`/`activeStepIndex`/`onStepSelect`) now get standard walkthrough chrome from the shared layout:
    - A `LearningToolbar` with a fullscreen toggle (`useRoomSession()`, `Minimize2`/`Maximize2`) — desktop rail + mobile floating panel.
    - A `LearningNav` (previous/next steps) below the steps, with a "Back" action surfaced when the walkthrough is complete.
  - `KillChainLab` keeps its own phase-based structure and gains the fullscreen toolbar automatically.

### 4 — Card and header consistency (MEDIUM)

- `src/features/student/pages/DashboardPage/index.tsx`
  - Removed the hand-rolled `LibraryTile`; course/lab/tool/marketplace rows now use the canonical `LearningCard` (`type="course"`/`"lab"`/`"resource"`/`"product"`) with proper `difficulty`, `cpReward`, `lessonsCount`, price/`isFree`, and action label.
- `src/features/student/pages/SettingsPage.tsx`
  - Replaced the self-styled page `<h1>` block with shared `ui/PageHeader` and the local `SectionHeader` shadow with shared `ui/SectionHeader`.
- `src/features/admin/pages/AdminDashboardPage.tsx`
  - Replaced the hand-rolled `<header>` card with shared `ui/PageHeader` (kicker/title/description/actions preserved).
- `src/shared/components/dashboard/PageHeader.tsx` — deleted (zero importers; all 26 `PageHeader` references use `ui/PageHeader`); barrel export removed from `dashboard/index.ts`.

### 5 — Tour anchor fix (kept functional alongside nav change)

- `src/features/student/components/layout/StudentSidebar.tsx` — added `tour-profile-sidebar` anchor on the Profile item.
- `src/features/student/components/StudentTour.tsx` — the md-branch profile target now falls back through the new sidebar anchor. Nav-tab targets already fall back to the still-visible topbar logo.

## Verification

| Gate | Result |
|------|--------|
| `npm run typecheck` | ✅ clean |
| `npm run lint` | ✅ 0 issues |
| `npx vitest run` | ✅ 24 files / 226 tests pass (unchanged count — `StudentTour.test.tsx` unaffected) |
| `npm run build` | ✅ built (pre-existing chunk-size warning only) |

## Follow-up responsive pass (audit item 5)

- `src/features/admin/components/dashboard/AuditLogTab.tsx` — the log row previously used fixed `grid-cols-[120px_100px_1fr_auto]` with truncation as the only squeeze release, a push risk at 320–375px. The row is now an explicit grid that collapses to two mobile columns (date/admin → action/ip) and restores the original 4-column layout on sm+; all tracks are `min-w-0`/`truncate`-hardened, so long timestamps can no longer push content.
- `DashboardPage` hero column — verified by inspection, no change: the fixed `340px` mission column contains a `line-clamp-2`-bounded brief next to a taller rich hero; the column geometry is stable and cannot cause a vertical jump.

## S2 — Student sidebar collapse affordance (missing feature, now shipped)

The only reported symptom the audit marked "missing feature (not a regression)". Per the directive to execute everything, the desktop rail now collapses to an icon rail.

- `src/features/student/components/layout/StudentSidebar.tsx`
  - New `collapsed`/`onToggleCollapse` props. Expanded `w-[264px]` → collapsed `w-[76px]` with a `transition-[width]` on the design tokens (`var(--dur-base)` / `var(--ease-smooth)`).
  - Collapsed state: section labels, item labels, CP balance, and the logout label hide; nav items center and gain `Tooltip` labels (`side="right"`); the utilities row stacks vertically; header swaps the wordmark `Logo` for `QyvoraMark`.
  - A collapse toggle (lucide `PanelLeftClose`/`PanelLeftOpen`) sits above logout with `aria-expanded` and i18n labels.
- `src/features/student/layouts/AppShell.tsx`
  - Owns the collapse state and persists it to `localStorage` (`qyvora:sidebar-collapsed`).
  - Main content padding switches `lg:pl-[264px]` ⇄ `lg:pl-[76px]` with a matching `padding-left` transition.

## Verification handoff — mandated interaction tests

The redesign migration prompt requires interaction-test coverage for flag/quiz feedback and destructive admin actions. Coverage was a gap; three focused suites were added (all pass under the repo's existing vitest + RTL + jsdom setup, no new deps):

- `src/shared/components/walkthrough/WalkthroughStep.test.tsx` — flag feedback: correct flag triggers `onComplete(stepId)` + completion state; incorrect flag shows `Incorrect flag. Try again.` without completing; failed submission surfaces `Submission failed.`; Enter-key submit; `skipFlag`/`isCompleted` hide the flag input. Rendering coverage for mission/objectives/narrative/evidence/reflection and both hint reveal modes (single + progressive one-level-at-a-time).
- `src/shared/components/courses/InlineQuiz.test.tsx` — quiz feedback: pass/fail scoring with reviewed correct answers, `onComplete(passed, score)` wiring, no submit until all answered, retry reset, empty state.
- `src/shared/components/ui/__tests__/ConfirmDialog.test.tsx` — destructive admin confirmation: confirm fires `onConfirm` + closes; cancel / Escape close without firing.

Coverage vs. the prompt's mandated cases: **flag/quiz feedback ✅** (new), **destructive admin actions ✅** (new, at the shared primitive that `UsersTab`/`AdminDashboardPage` gate deletes through), **overlay priority ✅** (existing `usePopupManager.test.tsx` — single overlay system; `OverlayManager` correctly still absent per AGENTS), **form errors ✅** (existing), **navigation ✅** (existing `StudentTour.test.tsx`), **entitlement / resume-or-step-progress** — not yet covered (data-layer gating + step-progress persistence; noted for follow-up).

Sweep for the prompt's "no deprecated duplicate pattern remains" gate: `useNavInvert`, `data-nav-invert`, `PublicBottomNav`, `GoCodeCarousel`, `CardGrid`, `react-loading-skeleton`, `zustand`, `@tanstack/react-query`, and the `font-display` utility class were grepped across 673 source files — **no active-UI hits** (only legitimate `@font-face` `font-display: swap` and the `--font-display` CSS variable). Manual visual QA (collapsed-rail tooltips, bootcamp drawer on desktop) still requires a browser and is the remaining verification item alongside visual-regression infrastructure, which the project (no Playwright/Cypress, no e2e dir) does not yet have.

## Out of scope (not regressions)

- Manual browser visual QA and screenshot-based visual-regression coverage (no e2e/visual infra in the repo — flagged for a separate infrastructure effort).
- `entitlement` and `resume/step-progress` interaction tests (data-layer behavior, separate from this UI pass).
- Pre-existing working-tree files `UI_revamp_continue_AI.sh` and `tree.txt` were not touched.
## Addendum — site-wide UI conflict audit (landing, public, all pages)

Re-ran the same conflict lens (background/surface mixing, header-vs-page behavior, i18n leaks, styling mistakes) across the landing page, public pages, and the remaining shells.

Recon findings (cleared — not bugs):
- Public chrome is already calm: `PublicNavigation` transparent (hero clears own space) with `bg-surface` menu panel; `PublicFooter` on `bg-canvas`; all public subpages (`/<page>` wrappers) use `bg-canvas` with the documented `pt-24 md:pt-28 lg:pt-32` navbar clearance.
- Landing `HeroBlock → FeaturedLearning → Path → Proof → ToolsResearch → FinalCta` alternates `canvas/surface` deliberately (documented section rhythm); no stray bands.
- Auth (`AuthFormLayout`/`LoginPage`), student bottom-nav sheet (`bg-surface`), and `WalkthroughLayout` are internally calm-consistent. Admin stays forced-dark legacy-black (internally consistent). Blog case-study cards keep near-black surfaces — intentional pairing with the terminal/code blocks in that storytelling area. Public cards use the AGENTS-canonical `CardBase`/`CardMedia`; the calm `Card` (12px radius) coexists for migrated surfaces — noted, not changed.
- i18n: 0/1137 used keys missing after the earlier merge; audit re-verified no raw keys render.

Fixes applied (same classes as the dashboard report):
- `src/shared/layouts/ToolDocLayout.tsx` — wrapper `bg-bg` → `bg-canvas` (black rim behind canvas doc pages, mirror of the AppShell fix).
- `src/shared/components/tools/ToolDocTopbar.tsx` — fixed header `bg-bg/95`/`bg-bg/80` → `bg-canvas/95`/`bg-canvas/80`; mobile doc-sections bar `bg-bg-card/90` → `bg-surface/90`; inactive chip `bg-bg-elevated/40` → `bg-surface-raised/40`; mobile menu overlay `bg-bg/95` → `bg-canvas/95` (same near-black-topbar-over-canvas issue as the student topbar).
- `src/shared/components/tools/ToolDocHero.tsx` — doc hero band `bg-bg` → `bg-surface` (stray black band inside an otherwise canvas page).
- Drawer tool names were the last hardcoded UI strings: `src/features/student/constants/tools.ts` now carries `labelKey`/`descKey` (`student.tools.{terminal,ide,networkVisualizer}[Desc]` — all present in `en.json`), and `StudentNavPanel` renders `t(tool.labelKey)` in the drawer and passes the translated label to `ToolChooserModal`.

Validation: `npm run typecheck` ✅, `npm run lint` ✅ 0 issues, 27 test files / 243 tests ✅, nightly build unchanged.
