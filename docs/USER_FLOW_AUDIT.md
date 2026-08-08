# QYVORA — User-Flow Audit

Audit of every user-facing route, page, modal, and interactive element across the QYVORA platform (frontend `qyvora-frontend` + backend `qyvora-backend`). Audit-only — no code was changed.

**Date:** 2026-08-08

---

## 0. Route Backbone (how navigation works)

The complete client-side route map lives in `src/app/router.tsx` — it is the single source of truth. Page components are lazy-loaded; every route is wrapped in `Wrap` (ErrorBoundary + motion fade + `<Suspense>` with `PageLoader`).

**Layouts**

| Layout | Covers |
|---|---|
| `LandingLayout` (`shared/layouts/LandingLayout`) | All public/marketing routes incl. `/`, `/terms`, `/courses`, `/hpb*`, `/labs`, `/services*`, `/leaderboard`, `/zero-day-market`, `/anansi`, `/toha3ee`, `/blogs*`, `/team`, `/quiteroot` |
| `StudentLayout` (`features/student/layouts/StudentLayout`) | All `/dashboard*` routes (topbar + sidebar + global overlays) |
| `AdminLayout` (`features/admin/layouts/AdminLayout`) | The single admin route `/mr-robot/dashboard` |
| (none) | Auth routes, tool pages `/dashboard/tools/*`, `/:handle`, catch-all `*` |

**Route guards**

- `StudentOnly` — not logged in → `/login`; `user.isAdmin` → `/mr-robot/dashboard`. Applied to every `/dashboard` page.
- `AdminOnly` — not logged in → `/mr-robot`; not admin → `/dashboard`. Applied to the only admin page.
- Legacy redirects declared in router: `/learn`→`/hpb`, `/leaderboard/all`→`/leaderboard`, `/blogs/hacker-protocol-book`→`/blogs/hacker-protocol-bootcamp`, `/dashboard/bootcamps`→`/dashboard/bootcamps/bc_1775270338500`, `/bootcamps`→`/dashboard/bootcamps/bc_1775270338500`, `/marketplace`→`/dashboard/marketplace`, `/profile`→`/dashboard/profile`, `/notifications`→`/dashboard/notifications`, `/settings`→`/dashboard/settings`, `/courses/:courseId`→`/dashboard/courses/:courseId` (LegacyCourseRedirect).

**Global chrome mounted by `AppRouter`**

- `MotionCommunityPopup` — global community popup (priority queue, see Z-index/Popup tables in AGENTS.md).
- **Dobia** — persistent mascot, fixed bottom-right, `pointer-events-none`. Rotates through `DOBIA_TIPS` every 8s; expression changed by `dobia-expression` window event. Hidden on auth routes and admin (`hideDobia`).

**API client** (`src/core/services/api.ts`)

- Base URL `VITE_API_BASE_URL` or `/api` (dev proxy). Backend actually mounts routers under `/api` (its own header comment saying `/api/v1` is stale).
- Access token in-memory only; refresh token httpOnly cookie; CSRF double-submit (`qyvora_csrf_token` + `X-CSRF-Token`); `qyvora_auth_session_hint` skips `/auth/me` bootstrap for guests. Silent refresh on 401 via single shared in-flight refresh promise.

**Admin path** (`src/shared/utils/adminPath.ts`): `atob('L21yLXJvYm90')` = `/mr-robot`.

---

## 1. Public Site

All pages below render inside `LandingLayout` (scroll-snap styling, `PublicBottomNav` on mobile) unless noted. Public pages share `PublicHeroSection`, and most end with `LandingFinalCtaSection` (CTA → `/dashboard` if logged in, else `/register`) + `Footer`.

### 1.1 Landing — `/`

Full-viewport scroll-snap landing. Sections in order (components in `features/marketing/components/landing/`):

| Section | Interactive elements | Actions / endpoints |
|---|---|---|
| `LandingHeroSection` | Typewriter headline; primary CTA (enroll → `/hpb` or `/dashboard` if logged in); secondary CTA (→ `/register` or `/dashboard`); nav buttons | none |
| `LandingPillarsSection` | 4 pillar cards (`PILLARS_META`): labs→`/dashboard/labs`, courses→`/courses`, bootcamp→`/hpb` (featured), services→`/services` | none |
| `ActDividerSection` | decorative (used between sections) | none |
| `LandingLabsSection` | auto-cycling lab cards (groups of 3) from ids `[privesc, passwords, sqli, osint, killchain]`; "Explore Labs"→`/labs` | none |
| `LandingCoursesSection` | category filter chips (terminal/networking/programming/web-security/wireless/tools), search input, carousel (`ChevronLeft/Right`), course card "Enroll"/start → opens **CoursePurchaseModal** (only if logged in; guests see login CTA) | CoursePurchaseModal → `POST /cp/purchase-course` |
| `LandingBootcampSection` | phase carousel from `PHASES` (`marketing/data/learnData`); cards → `/hpb/{phaseId}` | none |
| `LandingTeamSection` | team member cards → `/@{member.handle}` | none |
| `LandingQuiteRootSection` | info; CTA → `/register` | none |
| `LandingOpenSourceToolsSection` | Anansi → `/anansi`, Toha3ee → `/toha3ee` | none |
| `LandingBlogsSection` | CTA → `/blogs` | none |
| `LandingMarketSection` | product cards (first 4 from API) + CTA → `/zero-day-market` | `GET /public/cp-products` |
| `LandingLeaderboardSection` | period filter (all/week/month), board rows → `/@handle` | `GET /public/leaderboard?period=` |
| `LandingServicesSection` | per-service "Request Assessment" → `openServiceRequestModal(tier)` | ServiceRequestModal → `POST /public/service-request` |
| `LandingFinalCtaSection` | CTA → `/dashboard` or `/register` | none |
| `Footer` | see 1.11 | — |

Errors in the market/leaderboard sections render `ErrorState` in place.

### 1.2 Navbar (`shared/components/layout/Navbar.tsx`, desktop)

- Fixed, hides on scroll-down / shows on scroll-up (window or `.snap-container`). Height `80px`. Inverted on `data-nav-invert` hero sections.
- Left: logo → `/`.
- Center dropdowns: **Platform** (services `/services`, courses `/courses`, bootcamp `/hpb`, labs `/labs`) and **Resources** (anansi `/anansi`, toha3ee `/toha3ee`, leaderboard `/leaderboard`, blogs `/blogs`, team `/team`, contact → ContactTrigger modal).
- Right (auth-aware): guest → "Log In" `/login`, "Register" `/register`; logged in → profile link `/dashboard/profile` + dashboard button `/dashboard`; admin → `ADMIN_PATH` console link.
- Mobile: hamburger → full-screen drawer (scroll-locked), same items.

### 1.3 Footer (`shared/components/layout/Footer.tsx`)

- Platform col: `/hpb`, `/anansi`, `/toha3ee`, `/blogs`, `/zero-day-market`, `/leaderboard`, `/services`.
- Company col: `/team`. Account col: `/register`, `/login`.
- Socials: X, LinkedIn, YouTube, GitHub, WhatsApp (external).
- `LanguageSwitcher` (i18n). ContactTrigger (modal). Terms link.

### 1.4 PublicBottomNav (`shared/components/layout/PublicBottomNav.tsx`, mobile)

- Primary tabs: Home `/`, Leaderboard `/leaderboard`, Contact (ContactTrigger **modal**, not a route), **More** (opens BottomSheet).
- More sheet: **Events `/events`** ⚠️ (dead route, see Findings), Market `/zero-day-market`.
- More sheet footer (auth-aware): admin → Admin Console `/mr-robot/dashboard`; logged in → Dashboard `/dashboard`; guest → Log In `/login` + Register `/register`.

### 1.5 ContactModal + ServiceRequestModal (modal surfaces)

- `ContactModal.tsx` — listens for window event `qyvora:open-contact-modal`. `ContactTrigger` renders a `<button>`, or `<a href="/contact">` in link mode that `preventDefault`s and opens the modal (so `/contact` is never actually navigated to). Form: name, email, subject, message → `POST /public/contact` (matches backend `/api/public/contact`). Success toast.
- `ServiceRequestModal.tsx` — listens for `qyvora:open-service-request-modal` with `detail.packageTier`. Fields: name, email, company, phone, package tier (basic/standard/bootcamp), message → `POST /public/service-request` (matches backend `/api/public/service-request`).

### 1.6 CoursesPage — `/courses`

- Static. `PublicHeroSection` + category chips + 12 course cards from `student/data/courses`.
- Cards are `<Link to="/dashboard/courses/:courseId">` — **no purchase CTA on this page**; guests get bounced to `/login` at the destination (StudentOnly). CoursePurchaseModal is only wired on the landing section and `MyCoursesPage`.

### 1.7 HPB (Hacker Protocol Bootcamp) — `/hpb`, `/hpb/:phaseId`

- `HpbPage`: hero "Enroll Now" → `/hpb/phase1`; phase cards → `/hpb/{phase.id}` (ids `01`–`05`, `phaseId.replace('phase','')` normalization; invalid → `<Navigate to="/hpb">`).
- `HpbPhasePage`: per-phase detail; "Enroll Now" and room "Start Phase" → `/register` (guests) — the dashboard-side bootcamp flow takes over after login. **No enroll API on the public side** (enrollment happens server-side at registration: `bootcampStatus: active`, `bootcampId: bc_1775270338500`).

### 1.8 Public Labs — `/labs`

- Static LABS array; "Start Training" → `/register`; lab cards → `/dashboard/labs/{id}` (privesc/passwords/sql-injection/osint/kill-chain; StudentOnly).

### 1.9 Services — `/services` + 3 detail pages

- `ServicesPage` + `services/{BasicPentestPage,StandardPentestPage,EmployeeBootcampPage}`: hero + tiers; "Request an Assessment" → `openServiceRequestModal(service.title)` → ServiceRequestModal → `POST /public/service-request`. No login gate.

### 1.10 Leaderboard — `/leaderboard`

- Own page (uses shared `useLeaderboard`, `PodiumCard`, `LeaderboardRow`).
- Period pills all/week/month sync `?period=`. Fetch `GET /public/leaderboard?period=&limit=100&offset=0` — top 100 hardcoded; "Load more" only reveals more of that 100 (10/page).
- Top-3 podium + rows are `<Link to="/@{hackerHandle}">` → PublicProfilePage. Own row highlighted when logged in (`userId === user.uid`).

### 1.11 Market — `/zero-day-market`

- Hero + search + product grid. `GET /public/cp-products`; search is client-side.
- Buy: logged-in card "Buy" → `/dashboard/marketplace` (real purchase is student-side `POST /cp/purchase`); guest card "Log In to Purchase" → `/login`; hero "Join to Purchase" → `/register`. **No modal on this page.**
- Guest-safe images: `AuthImage` skips protected `/uploads/cp-products/` when no session hint (avoids 401 noise).

### 1.12 Anansi / Toha3ee / Team / QuiteRoot / Terms

- `/anansi`: static; "Download" → GitHub releases (external), "Build from Source" → GitHub repo (external).
- `/toha3ee`: static; installers + `GITHUB_URL` (external).
- `/team`: static `teamData`; cards → `/@handle` + external socials.
- `/quiteroot`: static; "Join the Network" → `/register`.
- `/terms`: `TermsHeroSection` + `TermsContentSection` — desktop horizontal accordion strips, mobile stacked cards (always expanded). No forms/API.

### 1.13 Blogs — `/blogs`, `/blogs/:slug`

- `BlogsPage` (public/BlogsPage.tsx): tag filter + client-side search; cards → `/blogs/{slug}`.
- Registered slugs (8): `hacker-protocol-bootcamp`, `anansi-cli`, `africa-cybersecurity-ecosystem`, `attackers-discover-companies`, `africa-needs-cybersecurity-professionals`, `mapping-attack-surfaces`, `future-cybersecurity-africa`, `hpb-2026-cohort-case-study`.
- `BlogPostPage`: lazy-loads per-slug component; "Read more" → next post; "Back to blogs" → `/blogs`.
- Blog CTAs: `/hpb`-bound CTAs use raw `<a href>` (full page reload); Anansi/Attackers/Mapping posts link externally to the qyvora-anansi-cli GitHub repo.
- ⚠️ `BlogsPage/index.tsx` is an unused duplicate (router uses `public/BlogsPage.tsx`).

### 1.14 PublicProfilePage — `/:handle` (top-level catch-all)

- **Renders its own `<Navbar/> + <Footer/>`**, not `LandingLayout`.
- Requires `@` prefix on the handle, else renders shared `NotFoundPage`.
- Valid → `GET /public/users/:handle` + `GET /public/users/:handle/activity-calendar?days=365`. API failure → custom "Operator Not Found" + "Return Home".
- ⚠️ Because it is the catch-all, any unknown single-segment URL (e.g. `/events`, direct `/contact`) lands here → 404.

---

## 2. Auth Flow

Auth pages are OUTSIDE any layout and hide Dobia. `AuthContext` (`core/contexts/AuthContext.tsx`) owns login/logout/refresh-me; `MustChangePasswordError` is thrown by `login()` with `data.passwordChangeToken` and the caller must route to the password-change flow.

### 2.1 LoginPage — `/login` and `/mr-robot` (admin login)

- Unified page: `AuthForm` with login/register toggle. `authMode` from `location.state` (RegisterPage redirects here with `state.authMode='register'`).
- `HandleSuggestions` (→ `POST /auth/suggest-handles`) offered after registration.
- Admin variant when `location.pathname === ADMIN_PATH` ("Workspace Access"); on success → `/mr-robot/dashboard`.
- Errors: email-not-verified 403 → routes to `/verify-email`; `mustChangePassword` → routes to `/change-password` with token.
- **`LoginForm.tsx`** exists as a standalone component but nothing imports it (grep shows only self-reference) — suspected orphan.

### 2.2 RegisterPage — `/register`

- Stub: `<Navigate to="/login" replace />` with `state.authMode='register'`. All registration happens through the login page's `AuthForm`.
- Backend: `POST /auth/register` auto-enrolls in bootcamp (`bootcampStatus: active`, `bootcampId: bc_1775270338500`), grants `SIGNUP_POINTS` (2000 CP), issues recovery token.

### 2.3 ForgotPasswordPage — `/forgot-password` and `/reset-password`

- Both routes render the same component. Mode from URL: `forgot` → `ForgotPasswordForm` (`POST /auth/password-reset/request`); `reset-confirm` → `ResetPasswordConfirmForm` (`POST /auth/password-reset/confirm`).

### 2.4 ChangePasswordPage — `/change-password`

- `ChangePasswordForm`: token from URL query or `change_token` input. `POST /auth/change-password` with `{ passwordChangeToken, newPassword }`. Used by the must-change-password flow.

### 2.5 VerifyEmailPage — `/verify-email`

- `VerifyEmailForm`: `token`/`email` from URL query; "Resend" → `POST /auth/verify-email/request`. Confirm → `POST /auth/verify-email/confirm`.

### 2.6 Post-login bootstrapping

- `/auth/me` fetched by AuthContext only when `qyvora_auth_session_hint` is set. Response includes `csrfToken` and chain-resolved `cpPoints`.

---

## 3. Student Dashboard

### 3.1 Layout chrome (`features/student/layouts/StudentLayout.tsx`)

Mounts, once, for every `/dashboard` route:
- `StudentTopbar` (below), `Sidebar` (desktop right rail + mobile drawer), `InstallBanner` (PWA, popup priority 5), `UsernameChangeModal`, `ConsentBanner` (priority 1), `TerminalWrapper` (global simulated terminal via `qyvora:open-terminal`), `Ide` (via `qyvora:open-ide`), `NetworkBuilder` (via `qyvora:open-network-visualizer`), `SimulationProvider`.
- Auto-runs `initPWA()` and `tryAutoSubscribePush()`.
- Route-matched states: bootcamp room routes (`phases` + legacy `modules`), course routes.

### 3.2 StudentTopbar (`.../StudentTopbar.tsx`)

Five modes keyed off the URL:

| Mode | Trigger | Elements |
|---|---|---|
| Course | `/dashboard/courses/:courseId` | Back → `/dashboard/courses`; mobile lessons button + menu → `course:openSidebar` event; breadcrumb Courses/`title`; lesson `x/y` counter, `TERM`/`CODE`/`QUIZ` badges, progress bar (driven by `course:updateMeta` event from CourseLessonPage); ProfileDropdown + mobile profile sheet |
| Bootcamp room | `phases` or `modules` room routes | Back → `/dashboard/bootcamps/{bootcampId}`; menu → `bootcamp:openSidebar`; breadcrumb Curriculum/`phase.codename`/`room.title`; ProfileDropdown |
| Lab | `/dashboard/labs/:labType` | Back → `/dashboard/labs`; breadcrumb Labs/`labType`; ProfileDropdown |
| Dashboard | anything else | Logo → `/dashboard`; mobile hamburger → `qyvora:open-main-sidebar`; desktop nav: My Courses `/dashboard/courses`, Bootcamp `/dashboard/bootcamps`, Labs `/dashboard/labs`, Marketplace `/dashboard/marketplace`; CP badge (from `/student/overview`); ProfileDropdown; mobile identicon → MobileProfileSheet |

- Unread notification badge fetched from `GET /notifications` (30s throttle), shown in ProfileDropdown / MobileProfileSheet.
- **Logout**: `logout()` + toast + `navigate('/login')`.
- **Notifications in dropdown**: `onOpenNotifications` uses `window.location.href = '/dashboard/notifications'` (full page reload — inconsistent with SPA navigation used elsewhere).

**ProfileDropdown / MobileProfileSheet** tools: Terminal (Ctrl+`) → `qyvora:open-terminal` overlay; IDE (Ctrl+Shift+I) → `qyvora:open-ide` overlay; Network Visualizer (Ctrl+Shift+N) → `qyvora:open-network-visualizer` overlay. Tool overlays vs full-page tool routes (`/dashboard/tools/*`) — two entry paths to the same tools.

### 3.3 Sidebar (`.../Sidebar.tsx`)

Desktop right rail + mobile drawer (slides from right, backdrop `z-60`/content `z-70`, scroll-locked; opened by `qyvora:open-main-sidebar`).

**Nav items:**

| Group | Item | Path |
|---|---|---|
| Primary (desktop rail) | Dashboard | `/dashboard` |
| | My Courses | `/dashboard/courses` |
| | Bootcamp | `/dashboard/bootcamps` |
| | Labs | `/dashboard/labs` |
| | Competitive | `/dashboard/competitive` |
| | Network Lab | `/dashboard/networks` |
| | My Progress | `/dashboard/profile` |
| Secondary | Marketplace | `/dashboard/marketplace` |
| | Notifications | `/dashboard/notifications` |
| | Settings | `/dashboard/settings` |
| Mobile drawer (ALL_NAV) | Dashboard, My Courses, Bootcamp, Labs, Marketplace, Competitive, Network Lab, Notifications, Settings + profile card → `/dashboard/profile` + Logout | — |

**Contextual panels** (`RightRailSection`, shown by path):

| Page match | Panel | API |
|---|---|---|
| `/dashboard` | `DashboardOverviewPanel` (rank, rooms, CP, streak) | `GET /student/overview` |
| `/dashboard/competitive` | `LeaderboardFiltersPanel` (all/week/month → `?period=`) | — |
| `/dashboard/bootcamps/:id` (exact) | `CourseProgressPanel` (phase progress) | `GET /student/overview`, `GET /student/course?bootcampId=` |
| `/dashboard/courses` | `CoursesListPanel` (enrolled/in-progress) | ⚠️ `GET /student/courses` (plural — **does not exist on backend**, see Findings) |
| `/dashboard/courses/:id` | `LessonNavPanel` (lesson links → `/dashboard/courses/:id/lessons/:slug`) | `GET /student/course?courseId=` (⚠️ param not supported by backend) |
| `/dashboard/marketplace` | `MarketBalancePanel` | `GET /cp/balance` |
| `/dashboard/notifications` | `NotificationsFilterPanel` (all/unread/system/achievement → `?filter=`) | — |
| `/dashboard/*/rooms/*` | `RoomCurriculumPanel` (bootcamp phase/room tree with lock/complete states) | `GET /student/overview`, `GET /student/course?bootcampId=` |

**⚠️ Dead sidebar flows (see Findings 5.2, 5.3):** CoursesListPanel endpoint 404s; LessonNavPanel links 404 at the router (no `lessons/:slug` route and CourseLessonPage never reads pathname); NotificationsFilterPanel writes `?filter=` that NotificationsPage never reads.

### 3.4 Dashboard — `/dashboard` (`pages/DashboardPage/index.tsx`)

Loading skeleton mirrors final layout. Loads `GET /student/overview`, `GET /public/bootcamps`, `GET /public/cp-products` in parallel.

1. **Hero** (`DashboardHero`): three states — not enrolled ("Start Training" → continuePath), enrolled ("Continue" → next room via `resolveNextRoomPath`), all complete ("Review Curriculum"). Dobia mascot per state.
2. **Section buttons** (toggle reveal below): Courses / Bootcamps / Labs / Marketplace (2×2 on mobile, 4-across desktop). Tour anchor `tour-learning` on Bootcamps.
3. **PWA install banner** — shown when `isInstallable()` (2s polling), `showInstallPrompt()`.
4. **Stats**: Rank, CP, Streak (days), Rooms done.
5. **SkillMatrix** (radar + bars, always visible).
6. **Section content** (when toggled): Courses grid (static `COURSES`, first 6 → `/dashboard/courses/:id`); Bootcamps grid (`StudentBootcampCard`, enrolled ≤4, from `/public/bootcamps` ∩ overview progress); Labs grid (`LabCard`, routes in `LABS` const: `/dashboard/labs/privesc|passwords|sql-injection|osint|kill-chain`); Marketplace grid (`DashboardProductCard` → `/dashboard/marketplace`).
7. **Next rank progress** bar (IntersectionObserver animates width).
- `StudentTour` spotlight mounts only when `qyvora_onboarding_tour_seen !== '1'`; on completion writes localStorage + `PUT /profile {onboardingCompletedAt}` + `refreshMe()`. Popup priority 2. (⚠️ Backend has a dedicated `POST /profile/onboarding/complete`; the frontend uses `PUT /profile` instead.)

### 3.5 MyCoursesPage — `/dashboard/courses`

- Hero stats (enrolled/in-progress/completed) + Continue; filter strip (all/in-progress/completed); search.
- Course cards → `/dashboard/courses/{id}?lesson={lastLesson}` (progress from localStorage `qyvora_course_progress_{courseId}`).
- Locked cards "View Details" → **CoursePurchaseModal** → `POST /cp/purchase-course` (checks `GET /cp/transactions` to derive owned set); success → "Start Learning" → `/dashboard/courses/{id}`.

### 3.6 CourseLessonPage — `/dashboard/courses/:courseId`

- **No per-lesson routes.** Current lesson = internal state (`currentLessonIdx`, seeded from localStorage lastLesson). Sidebar navigator (`WalkthroughSidebar`) uses `onClick` callbacks; Prev/Next + keyboard arrows (`←`/`→`); "Complete" writes localStorage only; "Back to Courses".
- Access check: `GET /cp/transactions` — not purchased → full-page "Course Not Unlocked" → "Unlock Course" → `/dashboard/marketplace`.
- Lesson types: `TerminalWrapper` (inline), `CodePlayground`, `InlineQuiz` — all client-side simulations. Lesson meta pushed to topbar via `course:updateMeta`.
- Emits `course:openSidebar` for the topbar/mobile sidebar.

### 3.7 BootcampCoursePage — `/dashboard/bootcamps/:bootcampId`

- Curriculum overview: hero, `LearningFilterStrip` (All Phases + per-module), "Recommended Next" banner (via `resolveNextRoomPath`), `PhaseSection` list of `RoomCard` grids.
- Rooms launch via `phases`-format: `/dashboard/bootcamps/{id}/phases/{phaseId}/rooms/{roomId}`. Locked phases/rooms render non-link cards ("Phase locked — your instructor will unlock this").
- **No enroll/buy CTA here** — enrollment is server-side at registration; unenrolled users reach here and see locked curriculum (the redirect to /dashboard/bootcamps happens at the room page level).
- Data: `GET /student/overview`, `GET /student/course?bootcampId=`. Reloads on `visibilitychange`.

### 3.8 BootcampRoomPage — `/dashboard/bootcamps/:bootcampId/{phases/:phaseId|modules/:moduleId}/rooms/:roomId`

- Content walkthrough surface (not a live-lab surface). Desktop right toolbar + `RoomSidebar` curriculum nav + `RoomHeader` (step 0) + `RoomProgress` + `StepCard`s + `RelatedContent` + `RoomNavigation`.
- Modals: `QuizGateModal`, `QuizModal`, `StepJumpMenu`, `ReportIssueModal`, `RoomCompletionCelebration` (CP reward from response).
- Step widgets: `CodeBlockRenderer`, `StepImage`, "Got It" toggle, `StepNotes` (localStorage), bookmark, report-issue.
- Endpoints:
  - `POST /student/modules/{phaseNum}/rooms/{roomId}/complete` (backend id = phaseNum×100+roomNum) → CP reward.
  - `POST /student/quiz {moduleId, roomId, courseId, answers}` (pass ≥70% → room completion CP).
  - `POST /student/report-issue {type:'bootcamp_room', …}`.
  - `POST /student/modules/{phaseNum}/rooms/{roomId}/session-open` once enrolled.
- Enrollment guard: `bootcampStatus==='not_enrolled'` → `navigate('/dashboard/bootcamps')`. Locked room → static lock screen. Next-room flow on celebration close (skip locked → back to overview).

### 3.9 Labs — `/dashboard/labs` + 5 lab pages

- `LabsPage`: hero ("Start First Lab" → `/dashboard/labs/privesc`), difficulty filter (all/beginner/intermediate/advanced), search, `LabCard` grid (static; cards are Links to their routes).
- Lab pages (`PrivescLab`, `PasswordLab`, `SqlInjectionLab`, `OsintLab`, `KillChainLab`): scenario selection → `WalkthroughLayout` with `SimulationPanel`, gated `WalkthroughStep`s, flag inputs, optional diagrams, success banners.
- Backend interaction:
  - `POST /student/labs/verify-flag {labId, scenarioId, flag}` (via `lab.service.ts`) → on `correct` marks localStorage.
  - **LabConnectButton / WalkthroughLayout** use `useLabConnection` → `GET /student/labs/connections`, `POST /student/labs/connect`, `POST /student/labs/disconnect`, `PUT /student/labs/progress` (fake VM IP, 2h expiry).
- Simulations are client-side; CP reward displayed is the static configured value.

### 3.10 MarketplacePage — `/dashboard/marketplace`

- Hero + CP balance stat; search; tabs **All** (products) / **Market** (transaction history).
- Products: `GET /public/cp-products` (cached localStorage `qyvora_marketplace_cache_v2`). Purchase inline (no modal): `POST /cp/purchase {productId}`; free/owned → direct **Download** via `GET /cp/products/{id}/download` (Blob). Balance: `GET /cp/balance`. History: `GET /cp/transactions?limit=100`, "Load more" (+10).

### 3.11 CompetitivePage — `/dashboard/competitive`

- Hero ("View Public Board" → `/leaderboard`); period tabs all/week/month sync `?period=`; `LeaderboardRow` list from `GET /public/leaderboard?period=&limit=50&offset=0`; rows → `/@{handle}` (public profile); own row highlighted; chain-verification footer.

### 3.12 NetworksPage — `/dashboard/networks`

- **Fully client-side.** Hero + "Open Terminal" (→ `TerminalWrapper` modal, `context={{type:'dashboard'}}`), 4 InfoCards (subnet/gateway/DNS/netmask), "Your Machine (Kali)" card, discovery legend, discovered-device table, tip box.
- Uses `useSimulation()` — discovered IPs persisted to localStorage `qyvora_discovered_ips`, `qyvora:ip-discovered` events. **No server persistence.** Does NOT mount `NetworkBuilder` (that's the standalone tool).

### 3.13 NotificationsPage — `/dashboard/notifications`

- Hero (unread stat + "Mark all read"); notification cards (type-colored); "Load more" (client-side, 15/page).
- Endpoints: `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all`.
- ⚠️ **`?filter=` is dead** — the page never reads the query param; sidebar `NotificationsFilterPanel` links are inert (see Findings).

### 3.14 ProfilePage — `/dashboard/profile` and `/dashboard/profile/:username`

- `isOwnProfile = !paramUsername || paramUsername === user.username`. Own: `GET /profile` + `GET /profile/activity-calendar?days=365`; other: `GET /public/users/{username}` (read-only, no edit/email/activity).
- Sections: `ProfileIdentityBlock`, 6 `ProfileStatCard`s (CP, rank, labs, courses, streak, XP level), `ContributionCalendar` + `ActivityTimeline`, `AchievementsSection`, `LabsModule`, `CoursesModule`, `TrophyCabinet`.
- Own profile: "Edit" → `EditModal` → `PUT /profile` (name/hackerHandle/bio/organization); "Show public view" → `/@{username}`; share button.

### 3.15 SettingsPage — `/dashboard/settings`

Left tab rail: `appearance | notifications | learning | codeEditor | data | security | account`.

| Section | Controls | Endpoints |
|---|---|---|
| Appearance | theme dark/light, compact mode, animations, font size, language | `PUT /profile/preferences` (+ `i18n.changeLanguage` + full reload on language change) |
| Notifications | 8 toggles | `PUT /profile/preferences` |
| Learning | difficulty, weekly goal hours, hints/autoplay/code-examples | `PUT /profile/preferences` |
| Code editor | font size/family, line numbers, minimap | `PUT /profile/preferences` |
| Data | Data-saver toggle | localStorage only |
| Security | 2FA toggle; change password (`current_password/new_password/confirm_password`); recovery token (reveal/copy/regenerate); sessions list (revoke one/all) | `POST /auth/2fa/enable`/`disable`; `PUT /profile/password`; `GET/POST /profile/recovery-token[/ack|/regenerate]`; `GET /profile/sessions`; `POST /profile/sessions/{id}/revoke`; `POST /profile/sessions/revoke-all` |
| Account | Delete account (inline confirm) | `DELETE /profile/account` → `window.location.href='/'` |

⚠️ 2FA is a **stub** server-side (no TOTP secret; verify accepts backup codes or `000000`).

### 3.16 Tool pages (outside StudentLayout) — `/dashboard/tools/{ide|terminal|network-visualizer}`

Standalone full-screen, no dashboard chrome, `StudentOnly`:
- `IdeToolPage`: `<Ide standalone open>` with 3 starter files (main.py/app.js/script.sh); `onOpenChange` → `window.close()`.
- `TerminalToolPage`: full-screen `TerminalWrapper mode="raw"`.
- `NetworkVizToolPage`: standalone `<NetworkBuilder>`.
- All wrapped in `SimulationProvider`; **no backend/WS** — pure in-browser simulation.

---

## 4. Admin Dashboard

### 4.1 Entry & guard

- **Admin login** at `/mr-robot` (base64 `L21yLXJvYm90`): shared `LoginPage` in admin mode ("Workspace Access"), backend `POST /auth/login` with `isAdminRoute: true`. On success → `/mr-robot/dashboard`.
- **Guard `AdminOnly`**: not logged in → `/mr-robot`; not admin → `/dashboard`. This is the ONLY admin route — everything else is driven by the `?tab=` query param inside `AdminDashboardPage`.

### 4.2 AdminLayout + AdminTopbar

- `AdminLayout` = fixed `AdminTopbar` + `<Outlet/>` + `AdminRightRail`.
- `AdminTopbar` (implementation in `AdminTopbar/AdminTopbar.tsx`; `components/layout/AdminTopbar.tsx` is a re-export):
  - Desktop left: Logo → `/mr-robot/dashboard`; **Operator** link → `/dashboard`; dropdown groups (`navGroups.ts`):
    - **Manage**: Overview, Users, Bootcamps
    - **Content**: Market, Points
    - **Communications**: Inbox, Broadcast
    - **Monitor**: Audit, Security
    - (all targets `/mr-robot/dashboard?tab=<key>`)
  - Desktop right: notification bell (unread badge, `GET /notifications`) → `NotificationsDropdown` (desktop) / `MobileNotificationsSheet` (mobile); avatar chip; logout → `/mr-robot`.
  - Mobile: bottom nav `MOBILE_PRIMARY` = Overview, Users, Bootcamps, Points; **More** → `MobileMoreSheet` (`MOBILE_MORE` = Market, Inbox, Broadcast, Audit, Security) + logout.
- `AdminRightRail` (desktop `lg:`): 9 icon links (Overview, Users, Bootcamps, Market, Points, Inbox, Broadcast, Audit, Security) → `?tab=`; active state from `?tab`.

### 4.3 AdminDashboardPage (tab host)

- Active tab from `?tab=` (default `overview`); switching = `navigate(...?tab=X, {replace})`.
- `loadAll` on mount: `GET /admin/overview`, `GET /admin/users`, `GET /admin/cp-products`, `GET /admin/security/summary`, `GET /admin/security/events?limit=50` (each `.catch(()=>null)`).
- Shared helpers: `patchUser` → `PATCH /admin/users/:id`; block toggle → `PATCH /admin/users/:id/block`; product CRUD (image upload `POST /admin/uploads/cp-product-images`, PDF upload `POST /admin/uploads/cp-products`, create/update/delete); two `ConfirmDialog`s for destructive actions.

**Tab → component → key controls:**

| `?tab=` | Label | Component | Controls → endpoints |
|---|---|---|---|
| `overview` (default) | Overview | `OverviewTab` | 6 stat cards + Recent Signups table; search/pagination (DataTable). `GET /admin/overview`, `GET /admin/users` |
| `users` | Users | `UsersTab` | bootcamp-access toggle → `PATCH /admin/users/:id {bootcampAccessRevoked}`; copy recovery token; block/unblock → `PATCH /admin/users/:id/block`; **delete user** (ConfirmDialog "Authorize User Termination") → `DELETE /admin/users/:id`; search |
| `bootcamps` | Bootcamps | `BootcampAccessPanel` | Live/Paused switch → `PATCH /admin/bootcamp/access {started}`; "Unlock Next Phase" (disabled until live) → `PATCH /admin/bootcamp/access {unlockNext:true}`; control panel data `GET /admin/bootcamp/control-panel?bootcampId=bc_1775270338500` |
| `zero_day` | Market | `ZeroDayMarketTab` | Product form (title, description, cpPrice, sortOrder, type, isActive/isFree, cover image + PDF uploads); Save → create/update; Purge/Abort; per-row Modify + Delete (ConfirmDialog) → `DELETE /admin/cp-products/:id` |
| `cp` | Points | `CpAnalytics` (via `components/CpAnalytics.tsx` re-export) | range toggle (7d/30d/90d); refresh; KPI cards; "By Type" bar chart; `PointsControl` (user select, grant/deduct/set, points, reason, Execute) → `POST /admin/cp/grant|deduct|set`; `TransactionLedger` (search, type filter, pagination) → `GET /admin/cp/transactions` |
| `inbox` | Inbox | `InboxTab` | filter buttons (All/Contact/Service); search; row → detail Dialog; status buttons (contact: new/in_progress/resolved/archived; service: new/contacted/qualified/closed/archived) → `PATCH /admin/{contact-messages|service-requests}/:id`; Delete (ConfirmDialog) → `DELETE /admin/{contact-messages|service-requests}/:id` |
| `broadcast` | Broadcast | `BroadcastTab` | title (≤200), message (≤5000), audience toggle (All users / Bootcamp enrolled / By role) + role select; live preview; Send → ConfirmDialog → `POST /admin/announcements` → `sentCount` toast |
| `audit` | Audit | `AuditLogTab` | action `<select>`, dateFrom/dateTo, Filter, pagination → `GET /admin/audit-log` |
| `security` | Security | `SecurityTab` | read-only event log (3 StatCards + DataTable); **no interactive elements** |

**Role gating:** only route-level `AdminOnly`; no `isAdmin` checks inside admin components (backend `requireAdmin` enforces).

**⚠️ Orphaned admin code:** `components/ChainExplorer.tsx` + `chain-explorer/ChainExplorer.tsx` + `chain-explorer/BlockCard.tsx` + `chain-explorer/types.ts` are entirely unreferenced (no tab, no route, no importer). If ever wired, they'd call `GET /admin/chain`, `GET /student/chain-stats`, `POST /admin/chain/validate` — the latter two do **not** exist on the backend.

---

## 5. Cross-Cutting Findings

### 5.1 Broken / dead routes (user-visible)

1. **Events is a dead link.** `PublicBottomNav` More sheet has "Events" → `/events`. No route exists; `/events` falls to the `/:handle` catch-all → `PublicProfilePage` requires `@` → renders **404 NotFoundPage**. Either add `/events` or remove/repurpose the nav item.
2. **No `/contact` route.** All in-UI contact entry points are ContactTrigger modals, so navigation is fine — but direct URL entry (`/contact`) hits `/:handle` → 404. Also `ContactTrigger type="link"` still renders `href="/contact"`.
3. **Sidebar lesson links 404.** `Sidebar.LessonNavPanel` builds `/dashboard/courses/:courseId/lessons/:slug`, but no such route exists and `CourseLessonPage` never reads pathname (internal state only). These links resolve to the catch-all `*` → `NotFoundPage` (outside StudentLayout, so no chrome/back). Two parallel lesson navigators exist (topbar `course:openSidebar` + sidebar) but only the topbar one is wired to the page.
4. **Legacy `/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId`** route exists in the router and is normalized, but all in-app links now use `phases/…`. The modules variant is only reachable by stale deep links.

### 5.2 Frontend → backend endpoint mismatches

1. **`GET /student/courses` (plural) does not exist** — Sidebar `CoursesListPanel` calls it and silently 404s; the "My Courses" rail panel is always empty.
2. **`GET /student/course?courseId=` not supported** — the backend `/student/course` accepts `bootcampId` only. Sidebar `LessonNavPanel` passes `courseId`; the lessons rail is dead anyway (see 5.1.3).
3. **`GET /student/chain-stats` + `POST /admin/chain/validate` don't exist** — referenced only by the orphaned ChainExplorer.
4. **Onboarding write-back mismatch** — `StudentTour` writes `PUT /profile {onboardingCompletedAt}`; backend also exposes `POST /profile/onboarding/complete` which the frontend never uses.
5. **Stale doc claim** — backend `index.ts` says base `/api/v1`; the real prefix is `/api` (no version). Backend also has no `/dashboards/…` or `/cp/transfer` endpoints (stale `coverage/` docs reference `events`/`news` modules that don't exist).

### 5.3 Dead / inert UI controls

1. **Notifications filters inert.** Sidebar `NotificationsFilterPanel` renders links to `/dashboard/notifications?filter=all|unread|system|achievement`, but `NotificationsPage` never reads `useSearchParams`/`useLocation` — filters have no effect (system/achievement filtering doesn't exist in code).
2. **`LoginForm.tsx`** is imported by nothing (only self-reference) — likely orphaned component (AuthForm supersedes it).
3. **`BlogsPage/index.tsx`** unused duplicate (router uses `public/BlogsPage.tsx`).
4. **`?lesson=` query param** on `/dashboard/courses/{id}?lesson=…` (from MyCoursesPage Continue) — CourseLessonPage seeds from localStorage; verify whether the URL param is honored (may be silently ignored).

### 5.4 Duplicated / inconsistent patterns

1. **Tools have two entry points** — full-page routes `/dashboard/tools/{ide,terminal,network-visualizer}` AND global overlay events `qyvora:open-terminal|open-ide|open-network-visualizer`. Overlays render inside StudentLayout; routes render standalone.
2. **Notifications navigation uses full reload** — `ProfileDropdown.onOpenNotifications` does `window.location.href='/dashboard/notifications'` instead of SPA `Link`/`navigate`.
3. **Blog CTAs use raw `<a href>`** for internal targets (`/hpb`) → full page reload instead of SPA navigation.
4. **Hardcoded bootcamp ID `bc_1775270338500`** appears in: router redirect, topbar? (no), mobile StudentTopbar? (no), `DashboardRoomCard`, `BootcampAccessPanel`, dashboard cover map, backend control-panel. The bootcamp ID is a single hardcoded value duplicated across frontend + backend — any new bootcamp requires touching both.
5. **Dual modal systems for contact/service** — Contact + ServiceRequest use window-event + modal; marketing services page and landing services section both trigger the same ServiceRequestModal but from different call sites.
6. **Two `CpAnalytics.tsx` + two `ChainExplorer.tsx`** files each (wrapper re-export + implementation). CpAnalytics pair is used; ChainExplorer pair is fully orphaned.

### 5.5 Backend concerns surfaced by the audit

1. **2FA is a stub** — enable/disable flip a flag only (no TOTP secret/QR); verify accepts backup codes or `000000`.
2. **`GET /uploads/bootcamps/:filename` requires auth** while bootcamp cover images are also used on the public `/hpb` pages — public pages rely on `AuthImage` fallback when a session hint is absent.
3. **Leaderboard is capped** — public page fetches `limit=100` and "Load more" only pages through that; the student `CompetitivePage` fetches `limit=50`. Users below rank 50/100 are unreachable in-app (offset is never used).
4. **Labs VM endpoints exist but the "connection" is fake** — `/student/labs/connect` returns a fake IP with 2h expiry; the actual lab UIs are client-side simulations.
5. **No WebSocket/SSE anywhere** — "realtime" is Web Push (`/api/push`) + REST polling.

### 5.6 Things that work well (for reference)

- Guard contract (StudentOnly/AdminOnly + route-level isAdmin) is consistent and enforced at the router for every protected route.
- Every non-GET `/api/*` request goes through CSRF double-submit with proper exemption list for the public auth endpoints.
- Public market/leaderboard/profile reads match backend endpoints 1:1; `AuthImage` avoids guest 401 noise on protected uploads.
- Bootcamp room completion/reward + quiz pass thresholds are server-authoritative; localStorage is used only for notes/bookmarks/progress convenience.
- The unified stretched layout (no max-width page containers) is consistently applied per AGENTS.md.

---

## Appendix — Complete route inventory

| Path | Component | Layout | Guard |
|---|---|---|---|
| `/` | LandingPage | Landing | — |
| `/terms` | TermsPage | Landing | — |
| `/courses` | CoursesPage | Landing | — |
| `/hpb` | HpbPage | Landing | — |
| `/hpb/:phaseId` | HpbPhasePage | Landing | — |
| `/learn` | → `/hpb` | — | — |
| `/labs` | PublicLabsPage | Landing | — |
| `/services` | ServicesPage | Landing | — |
| `/services/basic-web-application-pentest` | BasicPentestPage | Landing | — |
| `/services/standard-web-application-pentest` | StandardPentestPage | Landing | — |
| `/services/employee-cybersecurity-bootcamp` | EmployeeBootcampPage | Landing | — |
| `/leaderboard` | LeaderboardPage | Landing | — |
| `/leaderboard/all` | → `/leaderboard` | — | — |
| `/zero-day-market` | MarketPage | Landing | — |
| `/anansi` | AnansiPage | Landing | — |
| `/toha3ee` | Toha3eePage | Landing | — |
| `/blogs` | BlogsPage | Landing | — |
| `/blogs/:slug` | BlogPostPage | Landing | — |
| `/blogs/hacker-protocol-book` | → `/blogs/hacker-protocol-bootcamp` | — | — |
| `/team` | TeamPage | Landing | — |
| `/quiteroot` | QuiteRootPage | Landing | — |
| `/login` | LoginPage | — | — |
| `/register` | RegisterPage (→ login) | — | — |
| `/forgot-password` | ForgotPasswordPage | — | — |
| `/reset-password` | ForgotPasswordPage | — | — |
| `/verify-email` | VerifyEmailPage | — | — |
| `/change-password` | ChangePasswordPage | — | — |
| `/mr-robot` | LoginPage (admin) | — | — |
| `/dashboard` | DashboardPage | Student | StudentOnly |
| `/dashboard/bootcamps` | → `.../bc_1775270338500` | Student | — |
| `/dashboard/bootcamps/:bootcampId` | BootcampCoursePage | Student | StudentOnly |
| `/dashboard/bootcamps/:id/phases/:p/rooms/:r` | BootcampRoomPage | Student | StudentOnly |
| `/dashboard/bootcamps/:id/modules/:m/rooms/:r` | BootcampRoomPage | Student | StudentOnly |
| `/dashboard/courses` | MyCoursesPage | Student | StudentOnly |
| `/dashboard/courses/:courseId` | CourseLessonPage | Student | StudentOnly |
| `/dashboard/marketplace` | MarketplacePage | Student | StudentOnly |
| `/dashboard/profile` | ProfilePage | Student | StudentOnly |
| `/dashboard/profile/:username` | ProfilePage | Student | StudentOnly |
| `/dashboard/notifications` | NotificationsPage | Student | StudentOnly |
| `/dashboard/settings` | SettingsPage | Student | StudentOnly |
| `/dashboard/competitive` | CompetitivePage | Student | StudentOnly |
| `/dashboard/networks` | NetworksPage | Student | StudentOnly |
| `/dashboard/labs` | LabsPage | Student | StudentOnly |
| `/dashboard/labs/privesc` | PrivescLab | Student | StudentOnly |
| `/dashboard/labs/passwords` | PasswordLab | Student | StudentOnly |
| `/dashboard/labs/sql-injection` | SqlInjectionLab | Student | StudentOnly |
| `/dashboard/labs/osint` | OsintLab | Student | StudentOnly |
| `/dashboard/labs/kill-chain` | KillChainLab | Student | StudentOnly |
| `/dashboard/tools/ide` | IdeToolPage | — | StudentOnly |
| `/dashboard/tools/terminal` | TerminalToolPage | — | StudentOnly |
| `/dashboard/tools/network-visualizer` | NetworkVizToolPage | — | StudentOnly |
| `/bootcamps` | → `/dashboard/bootcamps/…` | Student | — |
| `/marketplace`, `/profile`, `/notifications`, `/settings` | → `/dashboard/*` | Student | — |
| `/courses/:courseId` | → `/dashboard/courses/:courseId` | Student | — |
| `/mr-robot/dashboard` | AdminDashboardPage | Admin | AdminOnly |
| `/:handle` | PublicProfilePage (validates `@`) | own Navbar+Footer | — |
| `*` | NotFoundPage | — | — |
