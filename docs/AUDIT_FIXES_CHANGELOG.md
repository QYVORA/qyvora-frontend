# QYVORA — Audit Fixes Changelog

Implementation log for the `docs/USER_FLOW_AUDIT.md` fixes across `qyvora-frontend` and `qyvora-backend` (branch `fix/audit-findings`).

---

## Phase 1 — Dead code removal (frontend)

**What changed**
- Deleted `src/features/auth/components/LoginForm.tsx` (confirmed zero importers via grep; superseded by the unified `AuthForm`).
- Deleted `src/features/marketing/pages/BlogsPage/index.tsx` (unused duplicate — router imports `pages/public/BlogsPage` for `/blogs` and `BlogsPage/BlogPostPage` for `/blogs/:slug`; confirmed via router grep + no other importers).
- Deleted the orphaned chain-explorer tree: `admin/components/ChainExplorer.tsx` (wrapper), `admin/components/chain-explorer/ChainExplorer.tsx`, `BlockCard.tsx`, `types.ts`, and the now-empty `chain-explorer/` directory. Confirmed zero importers/routes/tabs referenced them; their endpoints (`/admin/chain`, `/student/chain-stats`, `/admin/chain/validate`) don't even exist on the backend.
- Removed the "Events" item from `PublicBottomNav` `MORE_ITEMS` (dead `/events` route → 404 via the `/:handle` catch-all). Also removed the now-unused `events` entry in `BOTTOM_NAV_KEYS` and unused `Calendar`, `Radar`, and `motion` imports in that file.

**Why** — dead code, dead nav, and an endpoint-less component all produce broken user flows (404s, silent no-ops) with no product decision behind them.

**Verified** — frontend `lint`, `typecheck`, `test` (172 tests) all pass.

---

## Phase 2 — Navigation correctness (frontend, no visual change)

**What changed**
- `ContactModal.tsx` `ContactTrigger type="link"`: `href="/contact"` → `href="#"` (dead URL that 404'd via the `/:handle` catch-all; click was already fully handled by `preventDefault` + modal-open event). Click behavior identical — same `onClick`, same focus/keyboard semantics as before (`<a href="#">` remains focusable and Enter-activatable). Callers of `type="link"` (currently only `TermsContentSection`) unaffected; `type="button"` callers (Navbar, Footer, PublicBottomNav) untouched.
- `StudentTopbar`: `onOpenNotifications` in all 4 modes (dashboard/course/bootcamp-room/lab) changed from `window.location.href = '/dashboard/notifications'` (full page reload) to SPA `navigate('/dashboard/notifications')`. Verified `AuthContext` bootstraps once at app mount (session hint + `/auth/me`) and `NotificationsPage` fetches its own data on mount — no state is lost by removing the reload. `MobileProfileSheet` already used `<Link>` (SPA) for the same destination, so desktop and mobile are now consistent.
- Blog CTAs: `shared.tsx` `CTA` component now renders `<Link>` for internal `href` (starts with `/`) and keeps `<a target="_blank" rel="noopener noreferrer">` for external URLs — fixes the 3 blogs using the shared CTA (AfricaCybersecurityEcosystemBlog, FutureCybersecurityAfricaBlog, AfricaNeedsCybersecurityProfessionalsBlog). Direct internal anchors converted to `<Link>`: HackerProtocolBootcampBlog (`/hpb`), Hpb2026CaseStudy (`/hpb`), AnansiCliBlog (`/anansi`). External GitHub links left as anchors (correct). Grepped all of `src` for `href="/` and dynamic `href={`/` — no other internal raw anchors exist.

**Verified** — `lint`, `typecheck`, `test` (172) pass.

---

## Phase 3 — My Courses data path (frontend)

**Decision (option a)** — after reading backend `GET /student/course` (studentCourse.controller.ts + student.utils.ts) and `MyCoursesPage`: the "My Courses" domain is entirely client-owned. `MyCoursesPage` builds the list from the static `COURSES` catalog + `GET /cp/transactions?limit=100` (purchase records) + `localStorage` lesson progress. The backend `GET /student/course` serves the **bootcamp** course (modules/rooms, keyed by `bootcampId`, resolved from `req.query.bootcampId` or `req.user.bootcampId` via `resolveBootcampId`) — a different data model with no relationship to the catalog. Option (b) (adding a real `GET /student/courses`) was rejected: it would duplicate data the frontend already owns (static catalog) and add a round-trip for nothing. Chosen: Sidebar `CoursesListPanel` mirrors `MyCoursesPage` exactly, so sidebar and page can never disagree.

**What changed** — `Sidebar.tsx` `CoursesListPanel`: replaced the nonexistent `GET /student/courses` (404 → always-empty panel) with the same data path as `MyCoursesPage` — `GET /cp/transactions?limit=100` → purchased set (match by `metadata.slug || metadata.courseId || String(productId)`, same key resolution as the page), then filter `COURSES` catalog → enrolled; progress % per course from `localStorage` `qyvora_course_progress_<id>` (`completedLessons` / total). Panel now shows real Enrolled + In-Progress counts and the enrolled course list (linking to `/dashboard/courses/:id`). Loading state shows `…` until transactions resolve; failure degrades to empty list with a console warn (no crash), matching page behavior.

**Note** — `LessonNavPanel` (the other broken sidebar call, `GET /student/course?courseId=`) is left for Phase 5: its data source and its links are inseparable from URL-driven lesson navigation, and landing it now would leave dead `/lessons/:slug` links in place.

**Verified** — `lint`, `typecheck`, `test` (172) pass.

---

## Phase 4 — Notifications filter (frontend)

**Decision** — client-side filtering. Verified backend `GET /notifications` (notifications.routes.ts) accepts **no** filter/type/read query param — it returns the 100 latest for the user. Adding server-side filtering would be a new backend feature, not a fix; the list is already fully client-owned in `NotificationsPage`. So the URL `?filter=` drives a pure client-side filter. `unread` does not fight "mark all read": after marking all, the unread view simply empties (shows the existing "No unread notifications" empty state) — consistent, not a conflict.

**What changed** — `NotificationsPage.tsx`:
- Now reads `?filter=` via `useSearchParams` (`all` default; unknown values fall back to `all`) instead of an internal `useState` the page never exposed to the URL. The sidebar `NotificationsFilterPanel` already links `/dashboard/notifications?filter={all|unread|system|achievement}` — those links now actually change the list (previously they only lit up the rail item).
- Filter taxonomy defined once in the page: `all`, `unread` (`!read`), `achievement` (earning types: `cp_earned`, `rank_change`, `room_completed`, `room_complete`, `quiz_result`, `landing_reward`), `system` (complement of `achievement` — robust to unknown/new types). Documented in code.
- Removed dead `typeCounts`/`topTypes` computation (computed but never rendered).

**Verified** — `lint`, `typecheck`, `test` (172) pass.

---

## Phase 5 — URL-driven lesson navigation (frontend)

**What changed** — lesson position is now part of the URL: `/dashboard/courses/:courseId?lesson=<idx>`, matching the existing `?lesson=` links `MyCoursesPage` already emitted (Continue button + course cards). Those links were previously inert — the page never read the param.

- `CourseLessonPage` (`index.tsx`): `currentLessonIdx` is now **derived from `?lesson=`** via `useSearchParams` (single source of truth). Valid integer in range wins; otherwise it falls back to `localStorage` `lastLesson` (the resume behavior, still saved on progress change via `saveProgress`), clamped. Prev/Next, the `WalkthroughSidebar` lesson list, and the keyboard handler all call `goToLesson(idx)` which writes the param with `{ replace: true }` (no history spam) and scrolls to top. The `course:updateMeta` event (topbar counter + TERM/CODE/QUIZ badges + progress bar) now reflects the URL-derived index. Deep-linking/bookmarking/sharing a lesson URL works; invalid `?lesson=` values fall back to resume index instead of erroring. Removed dead `useNavigate` import (was unused).
- `Sidebar` `LessonNavPanel`: dropped the nonexistent `GET /student/course?courseId=` call (backend supports only `bootcampId`, and this panel is for catalog courses, not bootcamps) — lessons now come from the same static `COURSES` catalog (`getCourseById(...).lessons`) the rest of the app uses. Links changed from `/dashboard/courses/:id/lessons/:slug` (a **route that does not exist** → 404 via catch-all) to `/dashboard/courses/:id?lesson=<idx>`. Active-highlight reads the `?lesson=` param. Panel renders nothing for an unknown course id (was empty-spinner).
- Verified all three navigators now route to the same URL convention: MyCoursesPage (`?lesson=` links, pre-existing), Sidebar `LessonNavPanel` (new), topbar mobile sidebar / WalkthroughSidebar (in-page, via `goToLesson`). Grepped `src` for any remaining `/lessons/` link targets — none.

**Bonus Phase 2 completion** — found and fixed 3 leftover `window.location.href = '/dashboard/notifications'` in `StudentTopbar` (bootcamp-room, lab, and dashboard modes) that the Phase 2 sweep missed; all 4 modes now use SPA `navigate`. Re-grepped: no internal `window.location.href` reloads remain except intentional ones (`ErrorBoundary` reset, `SettingsPage` logout, `ReportIssueModal` URL capture).

**Verified** — `lint`, `typecheck`, `test` (172) pass.

---

## Phase 6 — Onboarding endpoint mismatch (frontend)

**What changed** — `StudentTour.tsx` `completeTour`: replaced `PUT /profile { onboardingCompletedAt: <now> }` with the dedicated `POST /profile/onboarding/complete`. Verified on the backend: `profile.routes.ts` mounts `POST /onboarding/complete` → `completeOnboarding` (`profile.controller.ts`), which sets `onboardingCompletedAt` on the `User` with `new Date()` server-side — the intended write path. The old call went through the generic profile update, which only validates `name/organization/hackerHandle/bio` and was never designed to carry onboarding state (worked only by accident via `.unknown(true)`). `refreshMe()` still re-pulls the user so `onboardingCompletedAt` in `AuthContext` reflects the server value. Grepped for other `onboardingCompletedAt` writers in the frontend — none besides this.

**Verified** — `lint`, `typecheck`, `test` (172) pass.

---

## Phase 7 — Leaderboard pagination (frontend + backend verified)

**Backend verified** — `GET /public/leaderboard` (public.controller.ts `getLeaderboard`) already honors `offset` and `limit`: `limit = clamp(Number(req.query.limit) || 50, 1, 200)`, `offset = max(Number(req.query.offset) || 0, 0)`, `User.find().sort({ cpPoints: -1 }).skip(offset).limit(limit)`, and each entry's `rank` is computed as `offset + idx + 1`. No backend change needed.

**Frontend fix** — the pages fetched a fixed window and never sent `offset`, so no user past rank 50/100 was reachable.
- `useLeaderboard.ts` (shared hook): now performs real server-side pagination. `fetchLeaderboard(period)` resets to the initial offset and replaces the list; new `loadMore(period)` appends the next page at the current offset; the hook tracks `offset` internally (ref), sets `hasMore` (fetched a full batch AND current position < `total`), and exposes `loadingMore`. Response shape unchanged; existing consumers of `entries/loading/error/total/fetchLeaderboard` still work.
- Public `LeaderboardPage`: replaced the client-side slice (`PAGE_SIZE`/`visibleCount` over one fixed 100-row fetch) with `loadMore` + `hasMore`. "Show more" now requests the next `offset` page (limit lowered to 50 — still well above the old cap of 100 cumulative via pages, and the button shows live `total − loaded` remaining). Podium + rest rendering untouched.
- Student `CompetitivePage`: was limit=50, offset always 0, no pagination UI. Added a "Show more" button driven by `hasMore`/`loadMore` so students can browse past the first 50. New i18n keys `student.competitive.showMore` / `loadingMore` added to `en.json` (the i18n setup already falls back to `en`, so all locales render correctly).

**Verified** — frontend `lint`, `typecheck`, `test` (172) pass.

---

## Phase 8 — Landing visual batch (frontend)

**What changed**

- **Landing Courses bottom spacing** — `LandingCoursesSection.tsx` root was `lg:h-dvh overflow-hidden` with a small bottom padding that clipped content on desktop (content ended too close to / against the viewport bottom). Root is now `relative overflow-hidden min-h-dvh flex flex-col`; the content wrapper uses `pt-20 md:pt-24 lg:pt-28 pb-16 md:pb-24 lg:pb-36`. Verified via lint/typecheck/test after the edit.
- **Story sections (ActDivider) rework** — `ActDividerSection.tsx` no longer renders the "ACT II / ACT III" eyebrow or the giant faint roman-numeral watermark (the `II`/`III` background elements). It keeps the headline + accent word + tagline description + globe and now renders a 3-item highlight-cards row (bento style) under the description. `LandingPage` passes the row content: Act II → Labs (`/labs`) / Courses (`/courses`) / Bootcamp (`/hpb`) using existing `nav.labs` / `nav.courses` / `nav.bootcamp` i18n keys; Act III → Community (`/quiteroot`, `components.community.title`) / Leaderboard (`/leaderboard`, `nav.leaderboard`) / Market (`/zero-day-market`, `nav.market`). The two `ActDividerSection` usages dropped the old `number` and `tagline` props.
- **Globe — no disappearing animation** — removed the entire scroll-exit system from `HackerGlobe.tsx` (deleted `useScroll`/`useTransform`/`useReducedMotion` imports and usage, the `exitScale`/`exitOpacity` transforms, and the `scrollExit` prop; the mount `<motion.div>` no longer carries `scale`/`opacity` styles). The globe is permanently anchored — it never scales out or disappears on any screen (fluid offset/scale still applies). Cleaned the now-unused `scrollExit={false}` prop off the `AuthFormLayout` host.
- **Dotted map — fill + uniform rollout** — `DottedMapOverlay` `backgroundSize` changed `contain` → `cover` so the single map fills the whole card (no floating-in-the-middle). Standardized all inline `getDottedMapBg` usages onto the shared overlay: `LandingPillarsSection` (4 cards), `LandingServicesSection` (3 cards), `ServiceDetailPage` (2 overlays). Rolled the overlay out to the remaining plain-background content-card grids — landing `LandingLabsSection` (featured + supporting) and `LandingBootcampSection` (featured + supporting + mobile list), and public `LabsPage`, `CoursesPage`, `BlogsPage`, `TeamPage`, `QuiteRootPage`, `HpbPage` (phase cards), `HpbPhasePage` (room cards). All use `<DottedMapOverlay className="rounded-2xl" />` with content above the overlay. Deliberately NOT applied to: athene `GridBoxedBackground` sections (Courses/Blogs/Leaderboard/QuiteRoot/FinalCta/hero), image-cover cards (landing Team/QuiteRoot), accent-tinted or image-showcase cards (Toha3ee/Anansi product pages, services included-tiles), auth pages, and all dashboard/authenticated surfaces.
- **Zero Day Market wrong image** — deleted `src/assets/sections/stats/cp-earned-bg.webp` (was used as a bogus fallback under DB/admin product images) and the empty `stats/` dir. Removed the `productFallbackImg` import + `fallback={...}` prop from all 5 consumers: `LandingMarketSection`, `MarketPage`, `MarketplacePage`, `DashboardPage`, `ZeroDayMarketTab`. `AuthImage` now returns `null` when there's no usable `src` (no broken `<img>`), so a product with no cover renders nothing instead of a broken frame. Updated the product-card rule in `AGENTS.md`: never pass `fallback`; product images come only from DB/admin uploads.
- **Student dashboard empty bottom space** — `DashboardPage` had two always-rendered strips that were empty by default: the "Section Content" strip (now gated by `activeSection !== null`) and the "Next Rank Progress" strip (now gated by `nextRank` — `getRankInfo` returns `next = null` at Vanguard, CP ≥ 1500, which previously left an empty `bg-bg-alt` strip + empty card at the bottom). Both preserve `pb-20 lg:pb-24` bottom-nav clearance when rendered.

**Verified** — frontend `lint`, `typecheck`, `test` (172) pass.

---

## Phase 9 — Open Source tool pages + navigation (frontend)

**What changed**

- **Navbar resources dropdown bug** — `src/features/marketing/content/siteConfig.ts` had a DUPLICATE `toha3ee` entry in the `resources` nav group (`anansi`, `toha3ee`, `toha3ee`, `leaderboard`, `blogs`). React keyed-list rendering collapses the duplicate key, so the `anansi` item was hidden from the desktop dropdown AND the mobile hamburger menu. Removed the duplicate; the group is now `anansi`, `toha3ee`, `leaderboard`, `blogs` (both tools visible in every nav surface).
- **Toha3ee data accuracy** — `toha3eeData.ts` `MODULES` expanded from 7 to 10 categories matching the repo's module reference (73 modules total): added `osint` (12 modules), `enum` (6), `web` (1); expanded `auth` (8: `default.creds`, `ntlm.relay`, `smb.signing`, `smb.kerberoast`, `auth.spray`, `auth.brute`, `auth.userenum`, `auth.asrep`) and `recon` (15: net/service/web/cve sweeps). Added `Search`, `ListChecks`, `Globe` lucide imports.
- **Anansi data accuracy** — `anansiData.ts` rewritten to match the `qyvora-anansi-cli` repo (tag `v1.0.0`): `PHASES` now 9 typographic phases (DISCOVERY, PROBE, TLS, HEADERS, PATHS, TECH-STACK, TAKEOVER, OSINT, CHAIN) with repo-accurate descriptions; phase images removed (redesign no longer uses image slides). `RELEASES` = 5 real binaries with actual sizes from `releases/` (linux-amd64 ~10.0 MB, linux-arm64 ~9.3 MB, macos-amd64 ~10.2 MB, macos-arm64 ~9.6 MB, windows-amd64.exe ~10.3 MB). Added `ONE_LINER` (`curl -fsSL .../qyvora-anansi-cli/main/install.sh | bash`), rebuilt `BUILD_FROM_SOURCE` (Go 1.22+, clone → `./install.sh`, checksum-verified, `~/.local/bin`), moved `USAGE_EXAMPLES` + `SCAN_OUTPUT` (8 rows incl. `tech` + `chain`) into the data file.
- **`AnansiPage.tsx` redesigned** — simple section layout (no generic card stack): `StudentHeroSection` hero (logo right, stats Modules/Platform, Install Now → `#install`) → "Nine Phases" typographic `Carousel` (`autoPlayInterval={6000}`, icon + category numeral + name + description slides) → `#install` section (One-Line Installer card with `ONE_LINER` + bullet checks, Build From Source card with 3 steps, Direct Download grid of the 5 `RELEASES` rows linked to `github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/<file>`) → "Quick Start" (terminal mock with window chrome + `anansi target.com --deep` + `SCAN_OUTPUT`, plus Usage command list + warning). Keeps `LandingFinalCtaSection` + `Footer`.
- **`Toha3eePage.tsx` redesigned** — same simple section pattern: hero (`StudentHeroSection`, globe, stats Categories=10/Modules=73, Install Now) → authorised-use warning strip (amber) → "Ten Categories" module `Carousel` (autoPlay, icon + name + description + module-name chips, one slide per category) → `#install` section (One-Line Installer card with all 3 `INSTALLERS`, Build From Source card with `BUILD_FROM_SOURCE` steps + GitHub link) → "Quick Start" (terminal mock replaying `CONSOLE_SESSION` + `QUICK_START` command list). Keeps `LandingFinalCtaSection` + `Footer`.
- **Snap/layout consistency** — both tool pages are built from `PublicSnapSection` blocks (matching Services/Blogs styling): `pt-24 md:pt-28 lg:pt-32` navbar clearance, `my-auto` content centering, standard `px-3 md:px-4 lg:px-6` side padding — sections neither clip nor enter the fixed navbar, and the snap rhythm is preserved on mobile and desktop.

**Verified** — frontend `lint`, `typecheck`, `test` (172) pass.

---

## Phase 10 — Hero socials, footer cleanup, skills sizing, onboarding (frontend)

**What changed**

- **Hero logo glow removed** — dropped the `drop-shadow-[0_0_50px_rgba(6,182,111,0.35)]` from the hero logo images on the public pages (`AnansiPage`, `Toha3eePage`, `QuiteRootPage`). Logos render flat with no green glow. (The much subtler landing open-source-tools glow and the network-tool SVG glows are unrelated and left as-is.)
- **Footer cleaned up** — removed the desktop QYVORA logotype banner block (the `hidden lg:block` bottom strip with the `radial-gradient(… rgba(6,182,111,0.10)…)` background and the giant 12%-opacity logotype). The footer is now a normal content footer — no color gradient, no glow, no banner. Removed the now-unused `QyvoraLogotype` import. `SOCIAL_LINKS` is now exported for reuse.
- **Landing hero social buttons** — added a row of the 5 brand icon buttons (X / LinkedIn / GitHub / YouTube / WhatsApp) to the landing main hero (`LandingHeroSection`), placed ABOVE the CTA buttons with no label, reusing the exported `SOCIAL_LINKS` from the footer. Same hover/accent styling as the footer icons.
- **Dashboard skills sizing** — the SkillMatrix grid previously let the SVG radar card define the row height, so on desktop the two cards stretched to ~900px tall (bars ridiculously spread) while the layout broke when scaled down. Fixes:
  - `SkillMatrix`: grid now `lg:h-[460px]` (mobile cards `min-h-[360px]`), radar chart centered in a capped box, stats list fills the fixed height.
  - `SkillRadarChart`: wrapper changed from `w-full h-full` to `w-full max-w-[320px] md:max-w-[340px] aspect-square` so the SVG can no longer blow up to fill arbitrary height.
  - `SkillStats`: label/dot grouped in a fixed-width `shrink-0` column, `justify-between` over the fixed-height card, slimmer bars (`h-1.5 md:h-2 lg:h-2.5`) — rows are evenly spaced and aligned regardless of screen size.
  - `DashboardSkeleton` skill-matrix placeholder updated to mirror the new sizes.
- **Onboarding for existing users** — `StudentTour` no longer gates purely on the per-device `qyvora_onboarding_tour_seen` flag. It now shows when the account has NOT completed onboarding server-side (`user.onboardingCompletedAt` null) OR the device has not seen it yet (recomputed reactively on user change). Every signed-in user therefore gets the tour once — existing accounts that never finished onboarding see the flow on their next login. Completing it still writes the local flag + `POST /profile/onboarding/complete`, so after completion it never reappears.

**Verified** — frontend `lint`, `typecheck`, `test` (172) pass.

---

## Phase 11 — Story section heading scale (frontend)

**What changed** — `ActDividerSection.tsx` (the "The Work" / "The World" story dividers on the landing page) had an oversized heading (`text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05]`) that dwarfed every other section header and used different typography. Aligned it to the shared large-section heading pattern: `text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none` — identical to the Team / QuiteRoot / Leaderboard section headers.

**Verified** — frontend `lint`, `typecheck` pass.

---

## Phase 12 — Landing Courses section desktop overflow (frontend)

**What changed** — `LandingCoursesSection` overflowed its snap section on desktop: the root lacked `lg:h-dvh` (so it grew taller than the 100dvh snap viewport and bled the card bottoms into the Hacker Protocol Bootcamp section below) and the `aspect-square` cards scaled with column width, making each card huge on wide screens while the generous padding (`pt-28 pb-36`) wasted space at the top. Fixed to match the Labs/Bootcamp pattern:
- Root now `min-h-dvh lg:h-dvh flex flex-col` — the section is exactly viewport height, so the snap rhythm is preserved and nothing bleeds into the next section.
- Padding reduced to `pt-20 md:pt-24 lg:pt-24 pb-6 md:pb-8 lg:pb-10` — content moves up (still clears the 80px navbar) and the bottom no longer wastes ~104px.
- Card grid becomes `flex-1 min-h-0 lg:auto-rows-fr` and cards `aspect-square lg:aspect-auto lg:h-full` — on desktop the row fills the remaining section height (adapting to any viewport) instead of forcing a fixed aspect ratio that overflows; mobile/small screens keep the original square cards (no regression).

**Verified** — frontend `lint`, `typecheck` pass.

---

## Deferred (out of scope, flagged only)

*(populated at the end)*

---

## New findings (not in original audit)

*(populated at the end)*
