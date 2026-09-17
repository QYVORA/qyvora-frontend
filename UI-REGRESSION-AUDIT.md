# UI Regression Audit — QYVORA Frontend (post AI rebuild)

Phase 0 deliverable. Read-only diagnostic — **no code was changed** to produce this audit.
Scope: 8 reported layout/regression symptoms from the botched AI-driven UI rebuild.
Method: evidence from current source only (no assumptions about "what it used to look like"),
each finding cites `file:line` and the correct pattern that already exists elsewhere in the codebase.

Baseline (verified before inspection):
`typecheck` ✅  ·  `lint` ✅ (0 issues)  ·  tests ✅ (24 files / 226)  ·  `build` ✅

Severity scale: **BLOCKER-VISUAL** · **HIGH** · **MEDIUM** · **LOW-POLISH**

---

## Correct-pattern references (used throughout)

- Shared layout shells: `PublicShell`, `ToolDocLayout`, `AppShell`, `AdminLayout` (`src/app/router.tsx`)
- Student nav: `StudentTopbar`, `StudentSidebar` (desktop rail), `StudentBottomNav` (mobile), `StudentNavPanel` (drawer)
- Admin nav: `AdminTopbar`, `AdminNavPanel`
- Headers: `ui/PageHeader`, `ui/SectionHeader` (type-token based: `type-label`, `type-h1/2/3`, `type-body`)
- Cards: `Card` (calm), `CardBase/Media/Stat`, `LearningCard` (`ui/Card.tsx`)
- Walkthrough text: blog styling `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]`, headings `font-black uppercase tracking-tight`

---

## S1 — Duplicate and legacy navigation

| Surface | Observed | File:Line | Expected | Severity |
|---|---|---|---|---|
| Bootcamp room — desktop | **No navigator renders at all on md+** | `WalkthroughSidebar.tsx:124,132` — both overlay and drawer are `md:hidden`; there is no desktop `<aside>` | Persistent room/phase navigator rail on desktop (mirrors sidebar rail) | **BLOCKER-VISUAL** |
| Bootcamp room — mobile | Navigator drawer **can never open**: gated by `mobileOpen` ← `sidebarOpen` state set only by the `bootcamp:openSidebar` window event | `BootcampRoomPage/index.tsx:184,186` (listener) — **event is never dispatched anywhere in `src/`** | Toggle button dispatches `bootcamp:openSidebar` | **BLOCKER-VISUAL** |
| Bootcamp room render wiring | `RoomSidebar` receives `mobileOpen={sidebarOpen}` where `sidebarOpen` only reaches `true` via the dead event | `BootcampRoomPage/index.tsx:97,426` | Sidebar opened by a visible trigger | **BLOCKER-VISUAL** |
| Walkthrough API | `WalkthroughLayoutProps.sidebar / sidebarOpen / onSidebarToggle` exist (`WalkthroughLayout.tsx:32-34`), `sidebar` is destructured (line 67) but **never rendered in the JSX body**; `sidebarOpen`/`onSidebarToggle` are not even destructured | `WalkthroughLayout.tsx:32-34,67,106-279` | Either render the sidebar or drop the dead API | **HIGH** |
| Student desktop nav | **Three nav affordances render simultaneously on lg+**: (1) fixed `StudentSidebar` rail `StudentSidebar.tsx:112`, (2) topbar desktop tabs `StudentTopbar.tsx:437-455`, (3) topbar hamburger `NavMenuTrigger` `StudentTopbar.tsx:468-469` → full-screen `StudentNavPanel` `StudentTopbar.tsx:486-496`. Sidebar `NAV_SECTIONS` (home/courses/bootcamp/labs/marketplace/…, `StudentSidebar.tsx:36-62`) duplicate topbar `DESKTOP_NAV_ITEMS` (courses/bootcamp/labs/marketplace, `StudentTopbar.tsx:37-42`), and both render a logo (`StudentSidebar.tsx:114`, `StudentTopbar.tsx:433`) | `StudentSidebar.tsx:36-62,112` + `StudentTopbar.tsx:37-42,437-455,468-469` | One primary nav per desktop surface (rail **or** topbar tabs); hamburger reserved for mobile/settings truth | **HIGH** |
| Admin | `AdminTopbar` nav is correct — quick tabs lg+ + single hamburger drawer, **no** sidebar | `src/features/admin/components/layout/AdminTopbar/AdminTopbar.tsx` | (no change) | ✅ |
| Public | `PublicNavigation` single responsive nav + drawer-on-demand only | `src/shared/components/layout/PublicNavigation.tsx` | (no change) | ✅ |
| Tool docs | `ToolDocPage` renders `ToolDocTopbar` + TOC, no secondary nav | `src/shared/components/tools/ToolDocPage.tsx` | (no change) | ✅ |

**Root cause:** the rebuild wired the walkthrough sidebar to a window-event contract that no longer has a
dispatcher (nothing listens for/emits `bootcamp:openSidebar` anywhere else), and it never mounted a desktop
variant of the sidebar. Separately, the student topbar tabs were added without removing the sidebar rail they
duplicate.

---

## S2 — Sidebar collapse / expand

No shared sidebar collapse affordance exists anywhere in the codebase.

| Surface | Collapse affordance | Location | Correct pattern available? |
|---|---|---|---|
| Student sidebar (desktop rail) | **None** — always expanded, no toggle, fixed `w-[264px]` | `StudentSidebar.tsx:112` | No shared pattern exists |
| Admin | N/A — no sidebar, nav is a drawer that opens/closes | `AdminNavPanel.tsx` | ✅ drawer itself is the collapse |
| Tool-doc TOC | None — sticky `DocToc` aside, always visible | `ToolDocPage.tsx:60-69` | N/A (secondary TOC, not nav) |
| Walkthrough sidebar | Drawer opens/closes on demand (once wired) | `WalkthroughSidebar.tsx:114-153` | ✅ drawer |
| IDE (non-nav) | Has a local collapse (`setSidebarExpanded(false)`) for its file tree only | `src/features/student/components/tools/Ide.tsx:394` | Not a nav pattern |

**Severity: LOW-POLISH / missing-feature, not a regression.** The task asked to report which sidebars have a
collapse: none of the navigation surfaces do, and no shared collapse primitive exists to reuse. Introducing one
would be **new UI**, out of scope for "make consistent with existing patterns", unless the old design had one
you want restored.

---

## S3 — Mobile bottom nav / sidebar mounting per surface

| Surface | Mobile bottom nav | Sidebar forced on mobile? | Verdict |
|---|---|---|---|
| Student (non-walkthrough) | ✅ `StudentBottomNav`, `md:hidden`, plus bottom-nav mounted only when `useRail` | No — `StudentSidebar` is `hidden lg:flex` only | ✅ |
| Student walkthrough (bootcamp/course/lab) | Bootcamp room + course: `LearningToolbar` floating panel (`BootcampRoomPage/index.tsx:26,379`; `CourseLessonPage/index.tsx:13,272,303`). **Labs: none** — lab pages pass neither `toolbar` nor `navigation` to `WalkthroughLayout` (`OsintLab/index.tsx:117-131`), and `WalkthroughLayout` renders `{navigation}` only if provided (`WalkthroughLayout.tsx:268-273`) | No | Labs missing bottom nav + floating toolbar (inconsistent with course/bootcamp) — **MEDIUM** |
| Admin | None — mobile relies on topbar hamburger drawer | No | Intended (admin = topbar-only) ✅ |
| Tool docs | ✅ mobile "On this page" bottom sheet + sticky context bar | No | ✅ |

**Finding (S3):** no sidebar is forced on mobile anywhere, and student/admin/doc surfaces each have a correct
mobile pattern — except **lab walkthroughs have no mobile navigation and no `LearningToolbar`** (no fullscreen
toggle, no floating step panel), unlike bootcamp rooms and course lessons.

---

## S4 — Raw text vs. card surfaces

| Location | Observed | Expected | Severity |
|---|---|---|---|
| `DashboardPage/index.tsx:73-87` | Local `LibraryTile` component hand-rolls a learning card (`Card to interactive flex min-h-[168px]…`) for courses/labs/tools/marketplace rows, `index.tsx:326-411` | Per AGENTS rules, learning items must use canonical `LearningCard` (used correctly in `MyCoursesPage`, `labs/LabsPage/LabCard.tsx`, `shared/components/learning/LearningCatalogue.tsx`) | **MEDIUM** |
| `SettingsPage.tsx:20-25` | Local shadow `SectionHeader` (hand-rolled `text-2xl font-black … mb-2` heading) | Shared `ui/SectionHeader` | **LOW-POLISH** |
| Admin dashboard | Uses canonical `StatCard`/`DataTable`/`EmptyState` throughout | (no change) | ✅ |
| Marketing | `CourseCard`/`LabCard` use `LearningCard`; `LabsCarousel` uses calm cards | (no change) | ✅ |

**Finding (S4):** broadly consistent. Two shadow components (`LibraryTile`, local `SettingsPage` SectionHeader)
duplicate canonical card/header primitives instead of reusing them.

---

## S5 — Header inconsistencies / dead headers

| Location | Observed | Expected | Severity |
|---|---|---|---|
| `src/shared/components/dashboard/PageHeader.tsx` (+ `dashboard/index.ts:4-5`) | **Dead file** — zero importers anywhere; only re-exported through the dashboard barrel (its interface is a different, older `Props`/`pretitle` shape) | Delete or route imports to canonical `ui/PageHeader` | **LOW-POLISH** |
| `AdminDashboardPage.tsx:251-259` | Hand-rolled page header inside a card: kicker `text-xs font-black uppercase tracking-[0.3em] text-accent`, `<h1 className="text-xl md:text-2xl font-black …">`, manual description | Canonical `ui/PageHeader` (`type-h1`, `type-label` kicker) | **MEDIUM** (scale + kicker diverge) |
| `SettingsPage.tsx:274` | Hand-rolled `<h1 className="text-3xl … md:text-4xl lg:text-5xl">` + manual `type-meta` kicker `SettingsPage.tsx:271-272` | `ui/PageHeader` | **LOW-POLISH** |
| `ToolDocSection.tsx:36-41`, `ToolDocHero.tsx:33-35` | Self-consistent doc-surface headers (`text-xs … tracking-[0.3em]` kicker, `text-2xl md:text-4xl`/`text-3xl md:text-5xl` titles) — matches blog-style doc headings | Internal-consistent docs surface (like walkthrough blog styling) | LOW / documented exception |
| Student dashboard sections | ✅ Correct — `type-label` kickers + `type-h2` titles (`DashboardPage/index.tsx:214-219,291-297`) | (no change) | ✅ |

**Finding (S5):** the canonical `ui/PageHeader`/`ui/SectionHeader` are used on most surfaces
(MarketplacePage, NetworksPage, NotificationsPage, public marketing pages). Admin dashboard, Settings, and the
dead `dashboard/PageHeader` are the stragglers; kicker spellings differ (`text-[0.3em]` legacy vs `type-label`).

---

## S6 — Push / overflow from grid–flex conflicts

| Location | Observed | Status |
|---|---|---|
| `LabsCarousel.tsx:102-129` | Full-section carousel follows the stable-viewport pattern (`relative w-full min-h-dvh flex flex-col` + `my-auto` wrapper + `overflow-x-clip` + `line-clamp-3`) | ✅ correct reference |
| `CodeBlockRenderer.tsx:141-154,373-374` | Code blocks + tables wrap in `overflow-x-auto` (`min-w-[520px]` table inside scroll wrapper) | ✅ |
| `StepCard.tsx:92`, `CourseLessonPage/index.tsx:59`, `StepParts.tsx:33` | Walkthrough text full-width + `overflow-x-auto` for command/table content | ✅ |
| `TerminalShell.tsx:571`, `TransactionLedger.tsx:110`, `SecurityTab.tsx:50` | Terminals and wide rows scroll horizontally | ✅ |
| `AuditLogTab.tsx:112` | Row grid `grid-cols-[120px_100px_1fr_auto]` (no breakpoint prefix) on mobile — fixed columns rely on `truncate` / `min-w-0` to avoid push; no overflow wrapper at the row level | OK-ish (truncation handles it); verify at 320-375px width |
| `DashboardPage/index.tsx:195` | `lg:grid-cols-[1fr_340px]` right column is fixed-width; fine, but hero column height depends on content — verify no vertical jump on longer daily missions | LOW-POLISH check |

**Finding (S6):** carousel + overflow discipline is largely correct; the only risk spots are truncation-reliant
fixed grid columns on many rows (`AuditLogTab`) — no confirmed hard overflow without a runtime viewport check.

---

## S7 — Stale old-UI content / dead props

| Location | Observed | Severity |
|---|---|---|
| `WalkthroughLayout.tsx:32-34,67` | Dead `sidebar`/`sidebarOpen`/`onSidebarToggle` props in the walkthrough API — remnants of the old scaffold, `sidebar` never rendered | **HIGH** (ties to S1) |
| `BootcampRoomPage/index.tsx:184-186` | Dead `bootcamp:openSidebar` event listener with **no dispatcher anywhere in `src/`** | **HIGH** (ties to S1) |
| `src/shared/components/dashboard/PageHeader.tsx` | Dead component (see S5) | LOW-POLISH |
| Public/student/tool pages | Grep sweep for `lorem`, `TODO`, `FIXME`, `placeholder text`, gradient/`font-display`/legacy hexes: **no hits** | ✅ clean |

**Finding (S7):** the "stale old-UI content" is concentrated in the walkthrough scaffold — the rebuilder left
sidebar plumbing (`WalkthroughLayout` props + `bootcamp:openSidebar` listener/never-dispatch) behind but never
mounted the sidebars themselves. That dead API is the direct source of the S1 BLOCKER.

---

## S8 — Mobile responsiveness gaps

| Area | Observed | Severity |
|---|---|---|
| Bootcamp room navigator (mobile) | Cannot open (dead event, S1) — mobile learners have **no** way to jump between rooms/phases | **BLOCKER-VISUAL** |
| Bootcamp room step-jump | ✅ `StepJumpMenu` + `btn-secondary md:hidden` trigger exist (`BootcampRoomPage/index.tsx:363,515-521`) | ✅ |
| Course lesson mobile | ✅ `LearningToolbar` floating panel + `FocusedStepList` with `idPrefix="lesson"` (`CourseLessonPage/index.tsx:272,303-304`) | ✅ |
| Lab walkthrough mobile | No bottom nav / no floating toolbar (S3 finding) | **MEDIUM** |
| Doc pages mobile | ✅ sticky context bar + bottom sheet (`ToolDocPage.tsx:73-92,100-112`) | ✅ |
| `WalkthroughSidebar` drawer | Slide-in drawer is `md:hidden` (`WalkthroughSidebar.tsx:124,132`) — fine once the open-trigger is fixed; it is **not** a desktop rail | n/a |

**Finding (S8):** the dominant mobile defect is the same S1 bootcamp-room navigator. Remaining gaps are the lab
walkthrough chrome and truncation checks on admin rows.

---

## Summary

| Severity | Count | Items |
|---|---|---|
| BLOCKER-VISUAL | 1 (3 rows) | Bootcamp room navigator unreachable (desktop + mobile) — dead `bootcamp:openSidebar`, no desktop rail |
| HIGH | 2 | Dead walkthrough sidebar API/`WalkthroughLayout` dead props; duplicate student nav (rail + topbar tabs + hamburger) |
| MEDIUM | 4 | Labs missing bottom nav + `LearningToolbar`; `LibraryTile` ≠ `LearningCard`; admin/settings hand-rolled headers; dead `dashboard/PageHeader` |
| LOW-POLISH | 3 | No collapse affordance (missing feature, not a bug); `AuditLogTab` truncation-reliant grid; dashboard hero fixed 340px column |
| ✅ clean | — | Public nav, admin nav, tool-doc chrome, carousels, overflow handling, marketing cards, no stale lorem/TODO content |

**Proposed Phase 1 repair order** (NOT yet executed — awaiting approval; each item below is the
minimal-consistency fix, no redesign):

1. **Restore walkthrough sidebar**: (a) add a dispatch of `bootcamp:openSidebar` from a visible trigger in the
   bootcamp room (the existing `btn-secondary md:hidden` … no — use the existing `LearningNav` leading area and/or a
   desktop trigger), or (b) wire `sidebarOpen`/desktop rail into `RoomSidebar`/`WalkthroughSidebar` with a desktop
   `<aside>`; remove the dead `WalkthroughLayout.sidebar` API if left unused.
2. **De-duplicate student desktop nav**: keep `StudentSidebar` rail on lg+ and remove the duplicated topbar
   `DESKTOP_NAV_ITEMS` tabs + desktop hamburger on lg+, OR drop the rail — pick the single source of truth (ask).
3. **Labs chrome**: give lab walkthroughs the same `LearningToolbar` + bottom navigation used by course/bootcamp.
4. **Card/header consistency**: replace `LibraryTile` with `LearningCard`; swap Settings/Admin headers to
   `ui/PageHeader`/`ui/SectionHeader`; delete the dead `dashboard/PageHeader.tsx` + barrel export.
5. **Housekeeping**: `WalletDetailPage` … n/a — address the `AuditLogTab` mobile row + dashboard hero column as a
   follow-up responsive pass.

**Open questions (need your call before Phase 1):**
- Desktop student nav source of truth: sidebar rail (keep topbar tabs mobile-only) — or topbar tabs (drop the
  rail)? (I recommend **sidebar rail**; it already carries full nav + logo + account section.)
- Do you want a **sidebar collapse** affordance added, or is "no collapse" the intended design to keep?