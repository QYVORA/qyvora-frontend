# QYVORA UI/UX COMPREHENSIVE AUDIT

**Date:** August 2026
**Scope:** Full frontend — all student pages, shared components, learning architecture, skeletons, navigation, public pages, admin surfaces
**Method:** Code-level inspection of all component files, styles, routing, hooks, and responsive patterns

---

## 1. EXECUTIVE SUMMARY

The QYVORA frontend is a **mature, well-architected** application with a strong dark-theme design system, consistent accent color (`#06B66F`), comprehensive responsive design, and an emerging shared learning architecture. The codebase shows clear investment in component reuse (LearningNav, LearningToolbar, StepRenderer, LabPage) and loading states (react-loading-skeleton across 12 dedicated skeletons).

**Key strengths:**
- Single accent color discipline enforced site-wide
- Comprehensive responsive breakpoint coverage (sm/md/lg)
- Global overflow-x protection preventing horizontal scroll
- Consistent `px-3 md:px-4 lg:px-6` horizontal padding convention
- Strong z-index layering system
- Triple-layer reduced motion support (CSS + MotionConfig + hook)
- Complete i18n infrastructure (18 locales)
- Consistent `rounded-2xl` card treatment across surfaces

**Key weaknesses:**
- **Systemic i18n gaps:** ~50+ hardcoded English strings across student pages, learning components, topbar, footer, and 404 page
- **Touch target violations:** Multiple interactive elements below 44px minimum (StudentTopbar, RoomTopBar, LearningToolbar, CodePlayground, ProfileDropdown, BatchPagination)
- **Keyboard accessibility gaps:** Navbar desktop dropdowns are hover-only, LearningAccordion missing ARIA, InlineQuiz progress bar inaccessible
- **Skeleton accuracy mismatches:** Several skeletons misrepresent the actual loaded content structure (BootcampRoom missing sidebar/toolbar, LabListing showing fabricated filter/search, CourseLesson missing hero/quiz/code elements)
- **Component duplication:** Three stat card implementations, dual skeleton primitives, duplicated tool arrays in profile dropdowns
- **Inconsistent page patterns:** Varying root wrappers, FadeIn usage, bottom padding, card styling, and animation libraries across student pages

---

## 2. EXISTING ARCHITECTURE ASSESSMENT

### LearningNav
**Reuse:** Used by CourseLessonPage and BootcampRoomPage ✅
**API issues:**
- Redundant `nextLabel`/`nextLabelMobile` props force consumers to pass two values for one concept
- No desktop Prev button (`md:hidden` on Prev only) — asymmetric with always-visible Next
- Complete button renders before Next on non-last steps when `onComplete` is provided
- `flex-wrap` can cause unexpected layout height changes at intermediate breakpoints

### LearningToolbar
**Reuse:** Used by BootcampRoomPage ✅
**API issues:**
- Desktop sidebar buttons are `h-9 w-9` (36px) — below 44px minimum
- Desktop buttons use `title` but no `aria-label` — unreliable for screen readers
- z-index `z-[100]` collides with navbar (also `z-[100]`)
- Mobile expand/collapse animation lacks `prefers-reduced-motion` check
- Mobile panel at `bottom-20` can overlap LearningNav on short pages

### StepRenderer
**Reuse:** Used by StepCard (bootcamp), CourseLessonPage ✅
**API issues:**
- Cross-domain import of `courses/StepNotes` from within `shared/components/learning/`
- Footer margin (`mt-10 md:mt-14`) may double-gap with consumer-applied spacing
- Spacing contract between children → afterContent → notes → footer is undocumented

### LabPage
**Reuse:** Used by all 5 lab pages (SqlInjection, Privesc, Password, OSINT, KillChain) ✅
**API issues:**
- No keyboard shortcuts for scenario navigation (CourseLessonPage has ArrowLeft/ArrowRight)
- Bottom padding varies across consumer pages

### Cross-cutting concerns:
- BootcampRoomPage passes `leading` slot in LearningNav with jump-menu + fullscreen buttons, duplicating LearningToolbar functionality
- BootcampRoomPage renders dual desktop/mobile StepCard trees (same DOM duplication pattern as LearningAccordion)
- WalkthroughStep consumes StepNumberHeader directly, bypassing StepRenderer — labs never get StepNotes feature

---

## 3. GLOBAL DESIGN-SYSTEM FINDINGS

### DS-01 [MEDIUM] Dual skeleton primitives — one dead
**Category:** Component consistency
**File:** `shared/components/ui/Skeleton.tsx` vs `features/student/components/StudentSkeletons.tsx`
**Problem:** Two independent skeleton systems exist. `Skeleton.tsx` uses `animate-pulse bg-border/30` (custom CSS). `StudentSkeletons.tsx` uses `react-loading-skeleton` with CSS variable colors. The custom `Skeleton.tsx` is imported by zero feature files — it is dead code. Its variant system (text, card, icon, image, title, stat-value) adds maintenance burden with no usage.
**Scope:** Site-wide
**Recommended direction:** Delete `Skeleton.tsx` or migrate its consumers (admin/marketing DataTable/StatCard) to react-loading-skeleton.

### DS-02 [MEDIUM] Triple stat card pattern
**Category:** Component consistency
**Files:** `Card.tsx:173` (CardStat), `CardStat.tsx:13` (standalone CardStat), `StatCard.tsx:45` (dashboard StatCard)
**Problem:** Three components serve the same conceptual purpose (icon + label + value). `StatCard` is the most complete (loading skeleton, trend data, href/button/div polymorphism). `Card.CardStat` uses `React.cloneElement` for icons. Standalone `CardStat` uses `motion.div` for animation. `CardStat` is not re-exported from `ui/index.ts` — consumers importing from `@/shared/components/ui` get the `Card.CardStat` version, which may not be what they expect.
**Scope:** Component
**Recommended direction:** Consolidate into `StatCard` as the primary stat display component.

### DS-03 [HIGH] Button component sizes are too small
**Category:** Design system consistency
**File:** `shared/components/ui/Button.tsx:28-29`
**Problem:** `sm` size uses `text-[10px]` with `py-2`. `md` size (default) also uses `text-[10px]`. The font size is below any reasonable readability threshold on desktop and produces touch targets around 36px — below the 44px minimum.
**Scope:** Component
**Recommended direction:** Increase `sm` to `text-xs` and `md` to `text-sm`. Increase vertical padding to meet minimum touch targets.

### DS-04 [MEDIUM] StatCard uses hardcoded `text-emerald-400` violating accent-only rule
**Category:** Design system consistency
**File:** `shared/components/dashboard/StatCard.tsx:27,80`
**Problem:** Trend "up" direction uses `text-emerald-400`. AGENTS.md explicitly states: "Never `emerald-500`, never another green." Should use `text-accent`.
**Scope:** Component
**Recommended direction:** Replace `text-emerald-400` with `text-accent`.

### DS-05 [LOW] Badge sizes are extremely small
**Category:** Design system consistency
**File:** `shared/components/ui/Badge.tsx:22-23`
**Problem:** `sm` is `text-[9px]`, `md` is `text-[10px]`. Near minimum legibility limit at 1080p. The mobile CSS override in `index.css` bumps these to 13px, which mitigates on mobile but desktop readability is poor.
**Scope:** Component
**Recommended direction:** Increase to `text-[10px]` for `sm` and `text-xs` for `md`.

### DS-06 [MEDIUM] BatchPagination dot buttons fail touch target minimum
**Category:** Component consistency
**File:** `shared/components/ui/BatchPagination.tsx:37`
**Problem:** Dot pagination buttons are `h-2 rounded-full` (~8px). Five times below the 44px minimum for interactive elements.
**Scope:** Component
**Recommended direction:** Increase to at least `min-h-[44px] min-w-[44px]` with the visible dot centered inside.

### DS-07 [MEDIUM] FilterTabs missing tab semantics
**Category:** Component consistency
**File:** `shared/components/ui/FilterTabs.tsx:27-36`
**Problem:** Renders `<button>` elements without `role="tablist"`, `role="tab"`, or `aria-selected`. Screen readers cannot understand the tab relationship. Touch target at `sm` size is `px-4 py-2` (~28px), below 44px.
**Scope:** Component
**Recommended direction:** Add ARIA tab semantics. Increase touch target size.

### DS-08 [LOW] Card stat value uses inverted responsive sizing
**Category:** Component consistency
**File:** `shared/components/ui/Card.tsx:191`
**Problem:** `text-2xl md:text-xl` — value is larger on mobile and smaller on desktop. Likely a copy-paste from mobile-first design.
**Scope:** Component
**Recommended direction:** Standardize to consistent sizing or intentional responsive scaling.

### DS-09 [LOW] Tooltip creates a new Provider per instance
**Category:** Component consistency
**File:** `shared/components/ui/Tooltip.tsx:57`
**Problem:** Each `<Tooltip>` renders its own `<RadixTooltip.Provider>`, defeating shared delay state. Should be a single provider at app root.
**Scope:** Component
**Recommended direction:** Move Provider to App.tsx root.

### DS-10 [LOW] DataTable search input doesn't use shared Input component
**Category:** Component consistency
**File:** `shared/components/dashboard/DataTable.tsx:92-98`
**Problem:** Has its own inline `<input>` with ad-hoc classes (`bg-bg border border-border/60 rounded-xl pl-9...`) instead of using the shared `Input` component. Border opacity (`border-border/60`) also differs from `Input.tsx` (`border-border`).
**Scope:** Component
**Recommended direction:** Refactor to use shared `Input` component.

### DS-11 [MEDIUM] EmptyState action link uses raw `<Link>` instead of `<Button>`
**Category:** Component consistency
**File:** `shared/components/dashboard/EmptyState.tsx:23-27`
**Problem:** Route action uses raw `<Link>` with inline class string instead of the project's `<Button>` component. AGENTS.md: "Buttons: always use `<Button>` component for CTAs." Meanwhile, the `onClick` action correctly uses `<Button>`.
**Scope:** Component
**Recommended direction:** Use `<Button>` component for both action types.

### DS-12 [LOW] Card media fallback is always bootcamp cover image
**Category:** Component consistency
**File:** `shared/components/ui/Card.tsx:14`
**Problem:** `import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp'` — every card on the site falls back to a bootcamp cover image on error, which is semantically wrong for non-bootcamp contexts.
**Scope:** Component
**Recommended direction:** Accept a `fallbackImage` prop or use a generic placeholder.

---

## 4. RESPONSIVE FINDINGS

### R-01 [PASS] Global horizontal overflow protection
**Viewport:** All
**File:** `styles/index.css:60,71`
**Pattern:** `overflow-x: hidden` on both `html` and `body`.
**Assessment:** ✅ Solid global safety net. All landing sections add `overflow-hidden` or `overflow-x-clip` on top. No risk of horizontal scroll from root.

### R-02 [PASS] Mobile snap section override
**Viewport:** Mobile (<768px)
**File:** `styles/index.css:715`
**Pattern:** `.snap-section { min-height: auto !important; height: auto !important; }`
**Assessment:** ✅ Critical and correct. Removes `min-h-dvh` constraint so sections can grow beyond viewport on mobile.

### R-03 [PASS] Mobile typography overrides
**Viewport:** Mobile (<768px)
**File:** `styles/index.css:290-324`
**Pattern:** Forces larger body text (17px), prevents tiny text from being too small (`.text-[9px]` and `.text-[10px]` overridden to 13px), caps heading sizes, forces full-width buttons on ultra-small screens.
**Assessment:** ✅ Excellent accessibility pattern. The `!important` overrides ensure fine print is readable on mobile.

### R-04 [MEDIUM] `min-h-[500px]` on LandingBlogsSection may overflow on small phones
**Viewport:** Mobile (<700px tall)
**File:** `marketing/components/landing/LandingBlogsSection.tsx:41`
**Problem:** `min-h-[500px] md:min-h-[380px]` — 500px minimum on mobile is larger than many phone viewports. No mobile override exists in `index.css`.
**Scope:** Local
**Recommended direction:** Add a mobile override or remove the fixed min-height in favor of content-based sizing.

### R-05 [LOW] Inconsistent root wrapper / min-h strategy across student pages
**Viewport:** All
**Problem:** Dashboard uses `<div>` (no min-h), Profile uses `<div>` (no min-h), Settings uses `min-h-screen`, MyCourses uses `min-h-screen`, Competitive uses `min-h-full`, Labs uses `min-h-full`. Three different strategies.
**Scope:** Feature
**Recommended direction:** Standardize to `min-h-full` everywhere, relying on layout parent stretching.

### R-06 [LOW] Redundant `overflow-x-clip overflow-hidden` pairing on landing sections
**Viewport:** All
**Files:** Multiple landing sections
**Problem:** `overflow-x-clip` is strictly stronger than `overflow-hidden`. Using both is redundant.
**Scope:** Local
**Recommended direction:** Simplify to just `overflow-x-clip`.

### R-07 [LOW] `no-scrollbar` on leaderboard hides scroll affordance on desktop
**Viewport:** Desktop
**File:** `LandingLeaderboardSection.tsx:132`
**Problem:** Hiding scrollbars on desktop makes it unclear content is scrollable.
**Scope:** Local
**Recommended direction:** Consider adding visible scroll indicator or removing `no-scrollbar` on `md:`+.

---

## 5. SKELETON ACCURACY FINDINGS

### SA-01 [MEDIUM] CourseLessonSkeleton missing hero section
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:463-499` vs `CourseLessonPage/index.tsx:235-245`
**Problem:** Skeleton renders no placeholder for `StudentHeroSection`, but the real page conditionally renders the hero when `currentLessonIdx === 0`. On first lesson load, user sees skeleton → sudden hero appearance = layout shift.
**Viewport:** All
**Recommended direction:** Add hero skeleton when `currentLessonIdx === 0` is expected.

### SA-02 [MEDIUM] CourseLessonSkeleton missing code playground and quiz placeholders
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:483-489` vs `CourseLessonPage/index.tsx:46-70`
**Problem:** Skeleton shows 5 text lines. Real page can contain `CodePlayground` (editor with toolbar), `InlineQuiz` (multiple choice cards), and code blocks. These are visually heavy elements with no skeleton representation, creating a jarring transition.
**Viewport:** All
**Recommended direction:** Add optional code editor skeleton and quiz skeleton blocks.

### SA-03 [HIGH] BootcampRoomSkeleton missing sidebar, toolbar, and bottom nav
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:403-433` vs `BootcampRoomPage/index.tsx:264-435`
**Problem:** Real page renders `RoomSidebar` (visible on desktop), `LearningToolbar` (floating sidebar), and `LearningNav` (bottom nav). None are represented in the skeleton. On desktop, the sidebar is visible alongside content — its absence means content occupies 100% width then snaps to ~75% when loaded, causing major layout shift.
**Viewport:** Desktop (sidebar), Mobile (toolbar, nav)
**Recommended direction:** Add sidebar skeleton for desktop. Add bottom nav skeleton block.

### SA-04 [HIGH] LabListingSkeleton shows fabricated filter/search that don't exist
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:503-543` vs `LabPage.tsx:58-66`
**Problem:** Skeleton shows a 3-tab filter strip and a search bar. The actual `LabPage` content is: hero → `LearningAccordion` items → `RelatedContent`. There is no filter strip or search input in the listing view. The skeleton misrepresents the real layout entirely.
**Viewport:** All
**Recommended direction:** Remove fabricated elements. Show hero skeleton + accordion item skeletons.

### SA-05 [MEDIUM] LabListingSkeleton missing StudentHeroSection
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:503-543` vs `LabPage.tsx:58-66`
**Problem:** `LabPage` always renders a `StudentHeroSection` before listing content. The hero (title, accentWord, description, optional villain avatar) is a large visual element with no skeleton representation.
**Viewport:** All
**Recommended direction:** Add hero skeleton block before accordion items.

### SA-06 [MEDIUM] LabListingSkeleton used for all 5 labs despite different structures
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:515` (hardcodes 4 accordion items)
**Problem:** One generic skeleton is reused for SQL Injection, Password, OSINT, Kill Chain, and Privesc labs — all with different content structures and item counts. A fixed 4 doesn't match any specific lab.
**Viewport:** All
**Recommended direction:** Accept a `count` prop or use a representative average.

### SA-07 [MEDIUM] BootcampRoomSkeleton hardcoded 2 steps vs dynamic count
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:426`
**Problem:** Renders exactly `Array.from({ length: 2 })` step cards. Real rooms have variable step counts from `BOOTCAMP_CONFIG`. A room with 8 steps will have a dramatically different loaded height than the 2-step skeleton suggests.
**Viewport:** All
**Recommended direction:** Accept a `stepCount` prop.

### SA-08 [MEDIUM] BootcampRoomSkeleton step cards lack detail elements
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:427-432`
**Problem:** Real `StepCard` components have bookmark toggles, "Got It" checkboxes, report-issue buttons, active/viewed state indicators, and phase-colored accents. Skeleton shows generic bordered boxes with 3 text lines — none of these interactive elements are represented.
**Viewport:** All
**Recommended direction:** Add bookmark indicator, checkbox placeholder, and action button placeholders.

### SA-09 [LOW] CourseLessonSkeleton nav skeleton simplified — missing complete button state
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:493-497`
**Problem:** Shows 2 navigation blocks. Real `LearningNav` can render up to 3 buttons (prev, complete, next) plus a "Back to Courses" link on the last lesson.
**Viewport:** All

### SA-10 [LOW] SettingsSkeleton hardcodes 3 sections × 4 toggles
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:270-285`
**Problem:** Real settings may have different section and toggle counts.
**Viewport:** All

### SA-11 [MEDIUM] Skeleton `S` wrapper `borderRadius` conflicts with className overrides
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:9`
**Problem:** Sets `borderRadius="0.5rem"` (inline style). Individual skeletons override via className with `rounded-xl`, `rounded-2xl`, `rounded-full`. react-loading-skeleton applies `borderRadius` as inline style, which may override Tailwind's class-based radius due to specificity.
**Viewport:** All
**Recommended direction:** Remove the default `borderRadius` from the `S` wrapper and let each skeleton specify its own.

### SA-12 [MEDIUM] No skeleton for walkthrough mode in labs
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:503-543` vs `LabPage.tsx:54`
**Problem:** When `activeScenario` is set, `LabPage` switches to rendering `walkthroughContent` (a `WalkthroughLayout`). The `LabListingSkeleton` only represents the listing view. If a user navigates to a lab with an active scenario, the skeleton shown is for the wrong view.
**Viewport:** All

### SA-13 [LOW] BootcampRoomSkeleton missing RoomHeader time/completion details
**Category:** Skeleton accuracy
**File:** `StudentSkeletons.tsx:408-415` vs `RoomHeader.tsx`
**Problem:** Real `RoomHeader` includes time spent display and completion status badge. These are absent from the skeleton.
**Viewport:** All

---

## 6. VISUAL DESIGN FINDINGS

### V-01 [MEDIUM] SettingsPage h1 breaks typography scale
**Category:** Typography
**File:** `SettingsPage.tsx:264`
**Problem:** `text-4xl md:text-5xl` — no other page uses `text-5xl`. Per AGENTS.md, h1 should be `text-3xl` (never smaller). This is two sizes larger than documented max.
**Scope:** Local
**Recommended direction:** Reduce to `text-3xl`.

### V-02 [MEDIUM] SettingsPage uses unique background pattern
**Category:** Visual consistency
**File:** `SettingsPage.tsx:259`
**Problem:** Uses `bg-bg min-h-screen` with `bg-bg-card` cards — no `bg-bg-alt` sections. Every other content page alternates `bg-bg` / `bg-bg-alt` for visual rhythm.
**Scope:** Local
**Recommended direction:** Add `bg-bg-alt` sections to match the established rhythm.

### V-03 [MEDIUM] Double-nested padding on NotificationsPage
**Category:** Spacing
**File:** `NotificationsPage.tsx:116-118`
**Problem:** Applies outer `px-3 md:px-4 lg:px-6` AND inner `px-2 sm:px-6 md:px-8 lg:px-8`. No other page does this. On desktop, notification content is inset ~40px more than every other page, and the inner breakpoints (`sm:px-6 md:px-8`) don't align with the standard `md:px-4 lg:px-6`.
**Scope:** Local
**Recommended direction:** Remove the inner padding wrapper or align to standard breakpoints.

### V-04 [LOW] SettingsPage bottom padding mismatch
**Category:** Spacing
**File:** `SettingsPage.tsx:259`
**Problem:** `pb-16 md:pb-20`. Every other page uses `pb-20 lg:pb-24`. Less bottom clearance means content sits closer to the bottom navigation on mobile.
**Scope:** Local

### V-05 [LOW] Dashboard page missing bottom padding when rank section is hidden
**Category:** Spacing
**File:** `DashboardPage/index.tsx:638`
**Problem:** `pb-20 lg:pb-24` is only on the rank progress section. If `nextRank` is falsy, that section is hidden and there's no bottom padding — content will be clipped under the bottom nav.
**Scope:** Local

### V-06 [MEDIUM] Inconsistent card styling — `card-accent` vs manual border
**Category:** Visual consistency
**Files:** Dashboard/Marketplace use `card-accent bg-bg-card`. MyCourses/Competitive/Notifications use manual `rounded-2xl border border-border/50 bg-bg-card`.
**Problem:** Some cards get the accent border hover effect and others don't, creating visual inconsistency.
**Scope:** Feature
**Recommended direction:** Standardize on `card-accent` or document the intentional distinction.

### V-07 [MEDIUM] Inconsistent FadeIn wrapper usage
**Category:** Visual consistency
**Problem:** Dashboard, Profile, Notifications, Settings, Marketplace use `<FadeIn>`. CompetitivePage, MyCoursesPage, LabsPage, BootcampRoomPage, and all lab pages do not. Three pages missing the entrance animation wrapper.
**Scope:** Feature
**Recommended direction:** Add `<FadeIn>` to all student pages for consistent entrance animation.

### V-08 [MEDIUM] Mixed animation libraries
**Category:** Motion
**Problem:** Dashboard uses GSAP (`useGsapReveal`/`useGsapHover`). Marketplace uses `motion/react` (`<motion.div>`). LabsPage and CompetitivePage use `<ScrollReveal>`. Three different animation approaches across student pages.
**Scope:** Feature

### V-09 [LOW] `aspect-square` on course/lab cards vs AGENTS.md rule
**Category:** Visual consistency
**Files:** `DashboardPage/index.tsx:505`, `MyCoursesPage/index.tsx:191`, `DashboardPage/index.tsx:93`
**Problem:** AGENTS.md states "Product cards: `aspect-[16/9]`, never `aspect-square`". Dashboard course cards and MyCourses cards use `aspect-square`. Only marketplace product cards correctly use `aspect-[16/9]`.
**Scope:** Feature
**Recommended direction:** Document the intentional distinction (content cards vs product cards) or standardize.

### V-10 [MEDIUM] `shadow-lg` on Dashboard section buttons violates AGENTS.md
**Category:** Design system consistency
**File:** `DashboardPage/index.tsx:123-126`
**Problem:** Active section buttons apply `shadow-lg shadow-accent/10`. AGENTS.md: "Never add: … `shadow-lg`-heavy cards."
**Scope:** Local
**Recommended direction:** Use a subtler elevation or border-based active state.

### V-11 [MEDIUM] `shadow-lg` on Marketplace tabs same violation
**Category:** Design system consistency
**File:** `MarketplacePage.tsx:155-158`
**Problem:** Active tab applies `shadow-lg shadow-accent/20`.
**Scope:** Local

### V-12 [LOW] Inconsistent "Load More" button styles across pages
**Category:** Component consistency
**Files:** Notifications, Marketplace, Competitive — three completely different button treatments for the same pattern (different padding, border-radius, font weight, tracking).
**Scope:** Feature

### V-13 [LOW] CompetitivePage tabs use `text-xs` vs other tabs' `text-[10px]`
**Category:** Typography consistency
**File:** `CompetitivePage/index.tsx:67`
**Problem:** Period tab buttons use `text-xs font-black uppercase tracking-wider`. Marketplace uses `text-[10px] font-black uppercase tracking-widest`. Dashboard uses `text-[10px]`. Three different text sizes and tracking values.
**Scope:** Feature

---

## 7. TYPOGRAPHY FINDINGS

### T-01 [PASS] Heading hierarchy is consistent
All pages use `text-3xl` for h1 (except SettingsPage per V-01). h2 uses `text-lg` (compact bento) or `text-2xl`+ (standard). Headings always `font-black` with Space Grotesk via `--font-display`.

### T-02 [PASS] Kicker/eyebrow text is consistent
`text-[10px] tracking-[0.3em] uppercase` pattern used consistently for kickers across dashboard, courses, labs.

### T-03 [MEDIUM] `text-[10px]` used extensively for interactive elements
**Category:** Typography
**Files:** Button component, LearningNav, LearningToolbar, LearningAccordion, StepCard
**Problem:** `text-[10px]` is the default button text size (via `Button` component `md` size). This is extremely small for interactive elements. The mobile CSS override bumps to 13px, but desktop users see 10px text.
**Scope:** Component
**Recommended direction:** Increase base button text to at least `text-xs` (12px).

### T-04 [LOW] Inconsistent tracking values across tab/button patterns
**Category:** Typography
**Files:** `tracking-wider` (CompetitivePage), `tracking-widest` (Marketplace, LearningNav), `tracking-[0.08em]` (btn-primary/btn-secondary), `tracking-[0.2em]` (RoomProgress label)
**Problem:** Four different letter-spacing values for the same conceptual "uppercase label" pattern.
**Scope:** Feature

### T-05 [PASS] Mobile typography overrides work well
The `!important` overrides in `index.css` that bump `.text-[9px]` and `.text-[10px]` to 13px on mobile ensure fine print remains readable.

---

## 8. CONTRAST FINDINGS

### C-01 [MEDIUM] ErrorState has conflicting color classes
**Category:** Color & contrast
**File:** `shared/components/ui/ErrorState.tsx:34`
**Problem:** Message `<p>` gets `text-sm text-red-400 text-text-secondary mt-1`. Both `text-red-400` and `text-text-secondary` are applied. Due to Tailwind class order, the result is unpredictable.
**Scope:** Component
**Recommended direction:** Use one or the other, or use `text-red-400/70` for dimmer red.

### C-02 [PASS] Primary text on dark backgrounds meets contrast requirements
`--color-text-primary: #EEF0EE` on `--color-bg: #000000` = contrast ratio ~18.8:1 (passes AAA).
`--color-text-secondary` at 70% opacity = ~13.2:1 (passes AAA).
`--color-text-muted` at 40% opacity = ~7.5:1 (passes AA).

### C-03 [PASS] Accent on dark backgrounds meets contrast requirements
`#06B66F` on `#000000` = contrast ratio ~5.9:1 (passes AA for normal text, AAA for large text).

### C-04 [LOW] Light theme accent-on-surface contrast is lower
`#06B66F` on `#E4E7E3` = contrast ratio ~2.3:1 (fails AA). However, accent is primarily used for interactive elements (buttons, links) where the on-accent color is black, so this is less critical.

---

## 9. HIERARCHY FINDINGS

### H-01 [PASS] Dashboard hierarchy is clear
Hero section → section navigation → achievement stats → skill matrix → section content → rank progress. Clear top-to-bottom flow with alternating `bg-bg` / `bg-bg-alt` creating visual separation.

### H-02 [PASS] Course lesson hierarchy is clear
Hero (first lesson only) → progress bar → lesson content → navigation. Step number and title are prominent.

### H-03 [PASS] Lab listing hierarchy is clear
Hero → accordion items → related content. Each accordion item has title, difficulty, CP reward, and action button.

### H-04 [LOW] Bootcamp course page has no clear "where am I" indicator beyond breadcrumb
**File:** `BootcampCoursePage/index.tsx`
**Problem:** The recommended-next banner and module list provide content, but there's no phase/progress indicator showing overall bootcamp position.
**Scope:** Local

### H-05 [LOW] Profile page sections use `id` attributes but no `role="region"` or `aria-labelledby`
**File:** `ProfilePage.tsx:72,101,113,128,142,153,162`
**Problem:** Sections use `id="profile-section-*"` but screen readers won't announce these as regions unless the user navigates by ID.
**Scope:** Local

---

## 10. ALIGNMENT FINDINGS

### A-01 [MEDIUM] Inconsistent horizontal padding across topbar modes
**Category:** Alignment
**Files:** `StudentTopbar.tsx`
**Problem:** Dashboard mode uses `px-3 md:px-4 lg:px-6`. Course/Room/Lab/Settings modes use `px-4 md:px-6`. RoomTopBar uses `px-3 md:px-4 lg:px-6`. The left edge of topbar content shifts depending on which page the user is on.
**Scope:** Feature
**Recommended direction:** Standardize to `px-3 md:px-4 lg:px-6` across all modes.

### A-02 [PASS] Page content padding is consistent
`px-3 md:px-4 lg:px-6` used consistently across Dashboard, Profile, Notifications, Settings, Marketplace, Labs, Courses, and Bootcamp pages.

### A-03 [PASS] Card grid alignment is consistent
Cards use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` or `lg:grid-cols-4` consistently. Gap values are `gap-4 md:gap-6` throughout.

---

## 11. INTERACTION FEEDBACK FINDINGS

### I-01 [MEDIUM] Consistent card hover feedback is missing
**Category:** Interaction feedback
**Problem:** `card-accent` class provides `hover:border-accent/80` on some cards. Other cards (MyCourses, Competitive, Notifications) use manual `border-border/50` with no hover effect. Some cards scale on hover (`group-hover:scale-[1.03]`), others don't.
**Scope:** Feature

### I-02 [MEDIUM] CodePlayground copy/reset buttons have no error feedback
**Category:** Interaction feedback
**File:** `courses/CodePlayground.tsx:100,103`
**Problem:** `navigator.clipboard.writeText` can fail in insecure contexts or when permissions are denied. No `.catch()` handler — silent failure. User gets no feedback that copy failed.
**Scope:** Component
**Recommended direction:** Add `.catch()` with error toast.

### I-03 [PASS] Button hover/active states are consistent
`btn-primary` and `btn-secondary` both have `hover:brightness-110` and `active:scale-95`. Clear press feedback.

### I-04 [PASS] Form validation feedback is present
Auth forms use `aria-live="polite"` for form messages. Shake animation on error. Toast notifications for server errors.

### I-05 [LOW] InlineQuiz two-step submit flow on last question is confusing
**Category:** Interaction design
**File:** `courses/InlineQuiz.tsx`
**Problem:** On the last question, clicking Next sets `submitted=true`, then a separate Submit button appears. User must click Next then Submit — two steps where one would suffice.
**Scope:** Component

---

## 12. SPACING / WHITE SPACE FINDINGS

### S-01 [PASS] Section spacing is consistent
Most pages use `space-y-8` for major section spacing. `py-10` for alternating sections. `py-20 lg:py-24` for landing snap sections.

### S-02 [PASS] Card padding is consistent
Cards use `p-4 md:p-5 lg:p-6` or `p-5 md:p-6` consistently. Landing cards use `p-6 sm:p-10 lg:p-14` for hero treatment.

### S-03 [LOW] StepRenderer footer spacing contract is undocumented
**File:** `StepRenderer.tsx:66`
**Problem:** Footer gets `mt-10 md:mt-14`. Consumers may also apply margin to children. The spacing contract between children → afterContent → notes → footer is undocumented.
**Scope:** Component

### S-04 [LOW] NotificationsPage double-padding creates excess horizontal space
(See V-03)

---

## 13. ACCESSIBILITY FINDINGS

### AC-01 [HIGH] Multiple touch targets below 44px minimum
**Category:** Accessibility
**Files:**
- `StudentTopbar.tsx:248,323,380,458,539` — Mobile profile trigger: `w-10 h-10` (40px)
- `RoomTopBar.tsx:157,173` — Action buttons: `w-9 h-9` (36px)
- `RoomTopBar.tsx:81,89` — Back button: `h-10 w-10` (40px)
- `ProfileDropdown.tsx:151,185` — Menu items: `py-2.5` (~40px)
- `NotificationsDropdown.tsx:43` — Mark all read: bare text, ~20px
- `MobileNotificationsSheet.tsx:42` — Mark all read: bare text, ~20px
- `LearningToolbar.tsx:39` — Desktop sidebar buttons: `h-9 w-9` (36px)
- `Dialog.tsx:118` — Close button: ~38px
- `CodePlayground.tsx:100,103,124` — Copy/Reset/Hint: `p-1` (~24px)
- `BatchPagination.tsx:37` — Dot buttons: `h-2` (~8px)

**Scope:** Site-wide
**Recommended direction:** Increase all to `min-h-[44px] min-w-[44px]`.

### AC-02 [HIGH] Navbar desktop dropdowns are keyboard-inaccessible
**Category:** Accessibility
**File:** `layout/Navbar.tsx:108-109`
**Problem:** Dropdown groups use `onMouseEnter`/`onMouseLeave` only. No `onFocus`/`onBlur` handlers. Keyboard users cannot open or navigate desktop dropdown menus. Group buttons have no click/keyboard handler to toggle.
**Scope:** Component
**Recommended direction:** Add keyboard handlers (Enter/Space to open, Escape to close, Arrow keys to navigate).

### AC-03 [HIGH] LearningAccordion missing ARIA attributes
**Category:** Accessibility
**File:** `learning/LearningAccordion.tsx:91-124`
**Problem:** Desktop accordion `<button>` headers lack `aria-expanded`, `aria-controls`, or any `id`/`role="region"` linkage to the expandable content. Screen readers cannot determine expanded/collapsed state.
**Scope:** Component
**Recommended direction:** Add `aria-expanded`, `aria-controls`, and `id`/`role="region"` on content panels.

### AC-04 [HIGH] InlineQuiz progress bar inaccessible
**Category:** Accessibility
**File:** `courses/InlineQuiz.tsx:124-126`
**Problem:** Progress bar (`h-1`) has no `role="progressbar"`, no `aria-valuenow`, no `aria-label`. Screen readers get no information about quiz progress.
**Scope:** Component
**Recommended direction:** Add full ARIA progressbar attributes.

### AC-05 [HIGH] BootcampRoomPage icon-only mobile buttons missing aria-label
**Category:** Accessibility
**File:** `BootcampRoomPage/index.tsx:411-422`
**Problem:** Jump-menu and fullscreen buttons contain only icons, with no `aria-label`. Screen readers cannot identify these buttons.
**Scope:** Local
**Recommended direction:** Add `aria-label={t('...')}` to both buttons.

### AC-06 [MEDIUM] StudentTopbar uses `z-40` instead of `z-[100]`
**Category:** Accessibility / Layout
**Files:** `StudentTopbar.tsx:196`, `RoomTopBar.tsx:75`
**Problem:** Both use `z-40` instead of the documented `z-[100]` for topbars. This means other z-indexed elements (e.g., `z-[90]` mobile nav overlay) could cover them.
**Scope:** Component
**Recommended direction:** Change to `z-[100]`.

### AC-07 [MEDIUM] ErrorBoundary fallback has no `role="alert"`
**Category:** Accessibility
**File:** `shared/components/ErrorBoundary.tsx:80`
**Problem:** When the error boundary catches a crash, the fallback UI has no `role="alert"` or `aria-live="assertive"`. Screen readers won't announce the error.
**Scope:** Component
**Recommended direction:** Add `role="alert"` to the error card container.

### AC-08 [MEDIUM] PageLoader missing `role="status"`
**Category:** Accessibility
**File:** `shared/components/PageLoader.tsx:5`
**Problem:** Renders a `div` with no accessibility attributes. AGENTS.md requires `role="status"` or `aria-live="polite"` for loading states.
**Scope:** Component

### AC-09 [MEDIUM] LearningToolbar desktop buttons missing aria-label
**Category:** Accessibility
**File:** `learning/LearningToolbar.tsx:37-47`
**Problem:** Desktop buttons only have `title` but no `aria-label`. `title` is not reliably announced by screen readers. Mobile buttons correctly have both.
**Scope:** Component

### AC-10 [MEDIUM] Multiple hardcoded English strings escape i18n
**Category:** i18n / Accessibility
**Files (partial list):**
- `LearningAccordion.tsx:51,143` — "Unlock for {cpCost} CP", "Start"
- `StepNumberHeader.tsx:87` — "Done"
- `StudentTopbar.tsx:414,417` — "Settings", "CONFIGURE"
- `RoomTopBar.tsx:72,82,90,101` — "Skip to main content", "Go back", "Toggle sidebar"
- `NotFoundPage.tsx:27-33` — All 404 text
- `Footer.tsx:179` — "QYVORA - GHANA, TAMALE"
- `PasswordInput.tsx:48` — "Hide password", "Show password"
- `ConsentBanner.tsx:92` — "Dismiss"
- `MyCoursesPage/index.tsx:131,139-141,260,287` — "My Courses", "Enrolled", "In Progress", etc.
- `BootcampCoursePage/index.tsx:156,179,186` — "Continue Training", "Recommended Next"
- `CodePlayground.tsx:100,103` — "Copy code", "Reset"
- `BootcampRoomPage/index.tsx:413,419` — Button labels

**Scope:** Site-wide
**Recommended direction:** Systematic pass to wrap all strings in `t()`.

### AC-11 [MEDIUM] Dialog overlay has `backdrop-blur-sm` violating design rules
**Category:** Design system consistency
**File:** `shared/components/ui/Dialog.tsx:43`
**Problem:** AGENTS.md states "Never add `backdrop-blur` panels (navbar/menu only)." The dialog overlay adds `backdrop-blur-sm`.
**Scope:** Component

### AC-12 [MEDIUM] ConsentBanner animation lacks reduced-motion check
**Category:** Motion
**File:** `shared/components/ConsentBanner.tsx:70-73`
**Problem:** Uses `AnimatePresence` + `motion.div` with slide-in animation but does NOT check `useReducedMotion()`. The banner animates for all users regardless of preference.
**Scope:** Component

### AC-13 [MEDIUM] LearningToolbar mobile expand/collapse animation lacks reduced-motion check
**Category:** Motion
**File:** `learning/LearningToolbar.tsx:53-80`
**Problem:** Uses `AnimatePresence` with `initial/animate/exit` but no reduced-motion check.
**Scope:** Component

### AC-14 [MEDIUM] AuthForm tab-switching animation lacks reduced-motion check
**Category:** Motion
**File:** `auth/components/AuthForm.tsx:85-88,149-152`
**Problem:** Form tab-switching animations do not check reduced motion.
**Scope:** Component

### AC-15 [LOW] StudentTopbar scroll-hide behavior reintroduces deprecated pattern
**Category:** Design system consistency
**File:** `StudentTopbar.tsx:67-94`
**Problem:** AGENTS.md lists "Navbar scroll-hide/invert behavior" under "Do Not Reintroduce". The student topbar implements scroll-hide for walkthrough pages.
**Scope:** Feature

### AC-16 [LOW] No bottom navigation for student dashboard on mobile
**Category:** Mobile UX
**Problem:** Student dashboard has no persistent bottom navigation on mobile. Access requires opening the MobileProfileSheet via avatar button. The public site has `PublicBottomNav`.
**Scope:** Feature

### AC-17 [LOW] PublicBottomNav listed in "Do Not Reintroduce" but actively used
**Category:** Documentation
**File:** `AGENTS.md` vs `shared/components/layout/PublicBottomNav.tsx`
**Problem:** AGENTS.md says `PublicBottomNav` should not be reintroduced, but it's an active component.
**Scope:** Documentation

### AC-18 [LOW] LabsPage search input has no label
**Category:** Accessibility
**File:** `pages/labs/LabsPage/index.tsx:100-105`
**Problem:** Search input has no `<label>` and no `aria-label`. Completely unlabeled.
**Scope:** Local

### AC-19 [LOW] DataTable sort headers lack keyboard support
**Category:** Accessibility
**File:** `shared/components/dashboard/DataTable.tsx:133-134`
**Problem:** Sortable `<th>` uses `onClick` only. No `onKeyDown`, no `role="button"`, no `tabIndex`. Keyboard users cannot sort columns.
**Scope:** Component

### AC-20 [LOW] StudentBootcampCard onKeyDown only handles Enter, not Space
**Category:** Accessibility
**File:** `student/components/StudentBootcampCard.tsx:154`
**Problem:** `role="button"` divs must handle both Enter and Space per ARIA spec.
**Scope:** Component

### AC-21 [PASS] Skip links exist
`Navbar.tsx:84` and `StudentTopbar.tsx:192` both target `#main-content`. Correct pattern.

### AC-22 [PASS] Form labels are generally correct
Auth forms use proper `htmlFor`/`id` pairs. `aria-live="polite"` on form messages. `PasswordInput` uses `aria-pressed` on toggle.

### AC-23 [PASS] All `tabIndex` values are 0 or -1
No anti-pattern of `tabIndex > 0` detected across the entire codebase.

---

## 14. NAVIGATION FINDINGS

### N-01 [MEDIUM] LearningNav has no desktop Prev button
**Category:** Navigation
**File:** `learning/LearningNav.tsx:52`
**Problem:** Prev button has `md:hidden`, so it disappears on desktop entirely. Users on desktop cannot go back except via the back link in `StepNumberHeader`. Asymmetric with Next which is always visible.
**Scope:** Component
**Recommended direction:** Add a desktop Prev button or document the intentional asymmetry.

### N-02 [MEDIUM] LearningToolbar z-index collides with navbar
**Category:** Navigation
**File:** `learning/LearningToolbar.tsx:30`
**Problem:** Fixed sidebar uses `z-[100]`, same as navbar. On narrower `lg` viewports, toolbar buttons could overlap or sit behind navbar elements.
**Scope:** Component
**Recommended direction:** Use `z-[90]` or `z-[110]` depending on layering intent.

### N-03 [MEDIUM] Three overlapping navigation mechanisms on desktop bootcamp room
**Category:** Navigation
**Files:** `BootcampRoomPage/index.tsx`
**Problem:** Desktop users see: (1) LearningToolbar sidebar, (2) scrollable step list (`hidden md:block`), (3) LearningNav bottom bar. Three overlapping navigation mechanisms for the same content.
**Scope:** Feature

### N-04 [LOW] Student topbar back button context is not always clear
**Category:** Navigation
**File:** `StudentTopbar.tsx:275`
**Problem:** On room pages, the back button navigates to `/dashboard/bootcamps/${roomBootcampId}`, but there's no way to go back to the bootcamp list or dashboard root from the topbar.
**Scope:** Feature

### N-05 [LOW] Course progress bar in topbar disappears on scroll-hide pages
**Category:** Navigation
**File:** `StudentTopbar.tsx:265-269`
**Problem:** The course progress bar sits at the bottom of the topbar. On scroll-hide pages, this bar disappears with the topbar, removing progress visibility.
**Scope:** Feature

### N-06 [PASS] Main navigation structure is clear
Dashboard nav tabs show active state with accent underline. Breadcrumb-style back links are present on learning pages.

---

## 15. EMPTY STATE FINDINGS

### E-01 [MEDIUM] EmptyState component exists but is never used in student pages
**Category:** Empty states
**File:** `shared/components/dashboard/EmptyState.tsx`
**Problem:** Zero imports in `features/student/`. No student page handles empty states (empty course list, no notifications, no marketplace results, no lab data, no bootcamp progress).
**Scope:** Feature
**Recommended direction:** Add empty states to: MyCoursesPage (no courses), NotificationsPage (no notifications), MarketplacePage (no results), CompetitivePage (no data).

### E-02 [LOW] BootcampCoursePage has no empty state when modules array is empty
**Category:** Empty states
**File:** `BootcampCoursePage/index.tsx`
**Problem:** If `course?.modules` is empty, `filteredModules` is `[]`. The phase filters + module list render with nothing. Should show "No modules available" fallback.
**Scope:** Local

### E-03 [LOW] StepJumpMenu has no empty state when steps array is empty
**Category:** Empty states
**File:** `bootcamp-room/StepJumpMenu.tsx`
**Problem:** Renders an empty scrollable area with just the "Select step" header.
**Scope:** Local

---

## 16. ERROR STATE FINDINGS

### ER-01 [MEDIUM] Only DashboardPage uses ErrorState component
**Category:** Error states
**File:** `shared/components/ui/ErrorState.tsx`
**Problem:** Only `DashboardPage/index.tsx:325` imports and uses `ErrorState`. No other student page (CourseLesson, BootcampRoom, labs, Profile, Notifications, Settings, Marketplace) uses it. These pages either show raw error text, `PageLoader` forever, or silently fail.
**Scope:** Feature
**Recommended direction:** Add `ErrorState` to all pages that fetch data.

### ER-02 [MEDIUM] InlineQuiz crashes on empty questions array
**Category:** Error states
**File:** `courses/InlineQuiz.tsx`
**Problem:** No handling for empty `questions` array — would crash at `questions[currentQ]` (undefined access).
**Scope:** Component
**Recommended direction:** Add guard: if `questions.length === 0`, show empty state.

### ER-03 [LOW] ErrorBoundary has no focus restoration after crash
**Category:** Error states
**File:** `shared/components/ErrorBoundary.tsx`
**Problem:** When fallback UI renders, focus stays wherever it was. Should auto-focus the "Try Again" button.
**Scope:** Component

### ER-04 [LOW] BootcampRoomCompletionCelebration empty roomTitle produces awkward text
**Category:** Error states
**File:** `bootcamp-room/RoomCompletionCelebration.tsx`
**Problem:** If `roomTitle` is empty string, the description interpolates as "Complete the '' room...".
**Scope:** Component

---

## 17. MOBILE UX FINDINGS

### M-01 [HIGH] No persistent bottom navigation for student dashboard
**Category:** Mobile UX
**Problem:** Student dashboard has no bottom navigation on mobile. Access to different sections requires opening the MobileProfileSheet via avatar button — a hidden menu pattern. The public site has `PublicBottomNav`. This is a significant discoverability and navigation gap.
**Scope:** Feature
**Recommended direction:** Consider adding a student-specific bottom nav similar to `PublicBottomNav`.

### M-02 [MEDIUM] Multiple 36-40px touch targets in topbar and toolbar
(See AC-01 for complete list)
**Scope:** Feature

### M-03 [MEDIUM] LearningToolbar mobile panel can overlap LearningNav
**File:** `learning/LearningToolbar.tsx:51`
**Problem:** Mobile floating trigger is at `bottom-20` (80px). On short pages, the expandable panel can overlap with the nav buttons.
**Scope:** Component

### M-04 [PASS] Horizontal overflow is well-protected
Global `overflow-x: hidden` on html/body, plus `overflow-x-clip` on carousels and landing sections. No horizontal scroll issues detected.

### M-05 [PASS] Cards adapt well to mobile
Cards consistently use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` and scale padding with breakpoints.

### M-06 [PASS] BottomSheet component works well for mobile menus
`BottomSheet.tsx` uses Radix Dialog with `max-h-[82svh]`, proper close controls, and accessible focus management.

### M-07 [LOW] MobileProfileSheet tool buttons undersized
**File:** `StudentTopbar/MobileProfileSheet.tsx:190`
**Problem:** Tool buttons use `px-3 py-2.5` (~40px height).
**Scope:** Component

---

## 18. DESKTOP UX FINDINGS

### D-01 [LOW] Large monitors see very wide content areas
**Category:** Desktop UX
**Problem:** No maximum width constraint on the main content area (per AGENTS.md rule: "No `max-w-*` on page-level containers"). Content fills the full viewport width. On 2560px+ monitors, content spans very wide.
**Scope:** Site-wide
**Assessment:** This is intentional per AGENTS.md design rules. Content uses `wc-*` width constraints for specific content types (prose, code, terminal, etc.).

### D-02 [PASS] Sidebar navigation on bootcamp room is well-implemented
`RoomSidebar` provides phase/room navigation with completion indicators and lock states. Responsive drawer on mobile.

### D-03 [PASS] Floating toolbar provides useful quick actions
`LearningToolbar` desktop sidebar provides jump-menu, fullscreen, and next/complete actions without leaving the content area.

---

## 19. LEARNING EXPERIENCE FINDINGS

### LE-01 [MEDIUM] Lab pages have no keyboard shortcuts for scenario navigation
**Category:** Learning UX
**File:** `learning/LabPage.tsx`
**Problem:** Unlike `CourseLessonPage` (which adds ArrowLeft/ArrowRight keyboard handlers), `LabPage` provides no keyboard shortcuts for navigating between scenarios. Parity gap between course and lab experiences.
**Scope:** Component

### LE-02 [MEDIUM] WalkthroughStep bypasses StepRenderer — labs never get StepNotes
**Category:** Learning UX
**Files:** `walkthrough/WalkthroughStep.tsx:57` directly uses `StepNumberHeader`
**Problem:** Labs using `WalkthroughStep` never get the `notesStorageKey` feature that courses/bootcamps get through `StepRenderer`. Inconsistent feature availability.
**Scope:** Feature

### LE-03 [MEDIUM] LearningAccordion start labels are all hardcoded English in consumers
**Category:** i18n / Learning UX
**Files:** All 5 lab pages pass English `startLabel` values.
**Problem:** `'Start Operation'`, `'Start Attack'`, etc. not wrapped in `t()`.
**Scope:** Feature

### LE-04 [LOW] LearningAccordion titles truncate with no tooltip
**File:** `learning/LearningAccordion.tsx:101,166`
**Problem:** Both desktop and mobile card titles truncate long strings with no `title` attribute or tooltip.
**Scope:** Component

### LE-05 [LOW] StepNumberHeader active/completed title styling is identical
**File:** `learning/StepNumberHeader.tsx:72-74`
**Problem:** Both states render `text-accent text-xs`. No visual distinction between "active" and "completed" in the title text. Only the number box differs (accent bg vs accent-dim).
**Scope:** Component

### LE-06 [PASS] Progress tracking is accessible
`RoomProgress.tsx` has exemplary ARIA: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.

### LE-07 [PASS] LearningNav provides clear step indication
Step counter (`currentStep / totalSteps`) is visible and clear.

---

## 20. COMPONENT CONSISTENCY FINDINGS

### CC-01 [MEDIUM] Three stat card implementations
(See DS-02)

### CC-02 [MEDIUM] Dual skeleton primitives
(See DS-01)

### CC-03 [MEDIUM] Inconsistent card styling across pages
(See V-06)

### CC-04 [MEDIUM] Inconsistent "Load More" button styles
(See V-12)

### CC-05 [MEDIUM] Inconsistent tab/button text sizes
(See V-13)

### CC-06 [MEDIUM] StudentTopbar is a 565-line monolith with massive code duplication
**File:** `StudentTopbar/StudentTopbar.tsx:198-557`
**Problem:** Five entirely different topbar layouts handled in one component via nested ternaries. MobileProfileSheet + mobile trigger button block repeated 5 times identically.
**Scope:** Component
**Recommended direction:** Split into separate components (CourseTopbar, RoomTopbar, LabTopbar, SettingsTopbar, DashboardTopbar).

### CC-07 [LOW] TOOLS array duplicated between ProfileDropdown and MobileProfileSheet
**Files:** `ProfileDropdown.tsx:25-29` and `MobileProfileSheet.tsx:27-31`
**Problem:** Identical tool definitions and handler maps.
**Scope:** Component

### CC-08 [LOW] Dashboard hardcodes LABS array that duplicates LabsPage data
**Files:** `DashboardPage/index.tsx:46-52` and `LabsPage/index.tsx:12-18`
**Problem:** Any lab addition requires changes in two files.
**Scope:** Feature

### CC-09 [LOW] DataTable sort indicators use Unicode arrows instead of lucide icons
**File:** `dashboard/DataTable.tsx:138`
**Problem:** `▲` / `▼` characters instead of `lucide-react` icons. Visually inconsistent.
**Scope:** Component

---

## 21. REUSABILITY OPPORTUNITIES

### RU-01 Dashboard LABS array → shared constant
`DashboardPage/index.tsx:46-52` and `LabsPage/index.tsx:12-18` define identical LABS arrays. Extract to a shared constant.

### RU-02 TOOLS array → shared constant
`ProfileDropdown.tsx:25-29` and `MobileProfileSheet.tsx:27-31` define identical TOOLS arrays. Extract to a shared constant.

### RU-03 panelHandlers → shared utility
`ProfileDropdown.tsx:48-52` and `MobileProfileSheet.tsx:49-53` define identical handler maps. Extract to shared utility.

### RU-04 "Load More" button → shared component
Three different implementations across Notifications, Marketplace, and Competitive pages.

### RU-05 Search input pattern → consistent usage
LabsPage uses unlabeled input. MyCoursesPage uses `aria-label`. MarketplacePage uses `<label htmlFor>`. Standardize on the MarketplacePage pattern.

### RU-06 Empty state pattern → extend to all student pages
EmptyState component exists but is unused. All data-fetching pages should use it.

### RU-07 ErrorState pattern → extend to all student pages
Only DashboardPage uses ErrorState. All data-fetching pages should use it.

---

## 22. CROSS-SITE CONSISTENCY FINDINGS

### CS-01 [MEDIUM] Inconsistent root wrapper min-h strategy
(See R-05)

### CS-02 [MEDIUM] Inconsistent FadeIn wrapper usage
(See V-07)

### CS-03 [MEDIUM] Inconsistent topbar horizontal padding
(See A-01)

### CS-04 [MEDIUM] Inconsistent card styling (card-accent vs manual)
(See V-06)

### CS-05 [MEDIUM] SettingsPage is a visual outlier
(See V-01, V-02, V-04)

### CS-06 [LOW] NotificationsPage has unique double-padding pattern
(See V-03)

### CS-07 [LOW] Inconsistent bottom padding across pages
Some pages use `pb-20 lg:pb-24`, Settings uses `pb-16 md:pb-20`, BootcampRoomPage uses no explicit bottom padding.

---

## 23. MOTION FINDINGS

### MO-01 [PASS] Reduced motion is well-supported in most places
`FadeIn`, `ScrollReveal`, and CSS animations all check `useReducedMotion()`. `prefers-reduced-motion: reduce` media query in `index.css` disables all CSS animations.

### MO-02 [MEDIUM] Three animations lack reduced-motion checks
(See AC-12, AC-13, AC-14 — ConsentBanner, LearningToolbar, AuthForm)

### MO-03 [MEDIUM] Three different animation approaches across student pages
(See V-08 — GSAP, Motion, ScrollReveal)

### MO-04 [LOW] FadeIn doesn't support skeleton→content cross-fade
**File:** `shared/components/ui/FadeIn.tsx`
**Problem:** When a skeleton is replaced by real content, the skeleton disappears instantly and the content fades in from opacity 0. There's no cross-fade. Brief flash of empty space occurs.
**Scope:** Component

### MO-05 [PASS] Carousel animations use consistent easing
`useAutoPlay` hook and carousel components use `[0.25, 0.46, 0.45, 0.94]` easing consistently.

---

## 24. PERCEIVED PERFORMANCE FINDINGS

### PP-01 [PASS] Skeleton loading states are comprehensive
12 dedicated skeletons covering all major student pages. Lab pages have loading guards that show skeletons while purchase status is being verified.

### PP-02 [MEDIUM] FadeIn creates perceived delay on fast connections
**Problem:** All pages use `<FadeIn>` with default 0.3s duration. On fast connections where data loads instantly, the user sees nothing for 300ms then content fades in. This can feel slower than an instant appearance.
**Scope:** Feature

### PP-03 [LOW] PageLoader delay is hardcoded at 180ms for all routes
**File:** `shared/components/PageLoader.tsx:19`
**Problem:** Heavy routes (Dashboard with multiple API calls) may need a longer delay, while light routes may benefit from shorter.
**Scope:** Component

### PP-04 [PASS] Lazy loading is used for route chunks
Router uses `React.lazy()` for all page components. Good code splitting.

### PP-05 [PASS] Images use WebP format
Bootcamp and brand images use `.webp` format for better compression.

---

## 25. EDGE CASE FINDINGS

### EC-01 [MEDIUM] InlineQuiz crashes on empty questions array
(See ER-02)

### EC-02 [MEDIUM] BootcampCoursePage empty modules array shows nothing
(See E-02)

### EC-03 [LOW] StepJumpMenu empty steps array shows empty scrollable area
(See E-03)

### EC-04 [LOW] RoomCompletionCelebration empty roomTitle produces awkward text
(See ER-04)

### EC-05 [PASS] Long titles are handled with `truncate` and `break-words`
86 instances of `truncate` across cards, topbars, labels. `break-words` on room headers and step titles.

### EC-06 [PASS] Missing images have fallbacks
Card media falls back to bootcamp cover. Dobia mascot expressions used for error/loading states.

### EC-07 [LOW] CodePlayground clipboard API can fail silently
(See I-02)

### EC-08 [LOW] BootcampCoursePage paper over undefined lookup with path filtering
**File:** `BootcampCoursePage/index.tsx:171`
**Problem:** `nextRoomLabel` conditionally excludes paths containing `'undefined'`. This is a runtime hack to avoid broken links from `BOOTCAMP_CONFIG` lookup failures.
**Scope:** Local

---

## 26. PASSING AREAS

The following areas are well-implemented and should be preserved:

1. **Single accent color discipline** — `#06B66F` used consistently site-wide. No stray greens in UI components (except the `text-emerald-400` in StatCard and difficulty badges).
2. **Global horizontal overflow protection** — `overflow-x: hidden` on html/body prevents all horizontal scroll.
3. **Mobile snap section override** — Correctly removes `min-h-dvh` on mobile so content can grow.
4. **Mobile typography overrides** — `text-[9px]` and `text-[10px]` bumped to 13px on mobile for readability.
5. **Consistent page padding** — `px-3 md:px-4 lg:px-6` used almost everywhere.
6. **Card grid patterns** — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `gap-4 md:gap-6` is consistent.
7. **Z-index layering system** — Well-documented and consistently applied.
8. **Skip links** — Present in both Navbar and StudentTopbar.
9. **Form accessibility** — Auth forms use proper labels, `aria-live`, autoComplete, inputMode.
10. **RoomProgress ARIA** — Exemplary progressbar implementation with full ARIA attributes.
11. **Reduced motion in core components** — FadeIn, ScrollReveal, and CSS animations all respect preferences.
12. **react-loading-skeleton integration** — Clean migration with theme-aware CSS variable colors.
13. **LabPage container pattern** — Unified hero, listing/walkthrough switching, and celebration handling.
14. **BottomSheet component** — Well-implemented Radix Dialog with proper focus management.
15. **Consent banner toggle semantics** — `role="switch"` with `aria-checked` and keyboard handlers.

---

## 27. PRIORITY MATRIX

### CRITICAL (Must fix — broken UX or accessibility)

| ID | Finding | Impact |
|----|---------|--------|
| AC-01 | Multiple touch targets below 44px | Users with motor impairments cannot interact with buttons |
| AC-02 | Navbar desktop dropdowns keyboard-inaccessible | Keyboard-only users cannot navigate the main site |
| AC-04 | InlineQuiz progress bar inaccessible | Screen readers get no quiz progress information |
| SA-03 | BootcampRoomSkeleton missing sidebar/toolbar/nav | Major layout shift on every bootcamp room load |
| SA-04 | LabListingSkeleton shows fabricated filter/search | Skeleton doesn't match any real lab page content |

### HIGH (Significant UX impact)

| ID | Finding | Impact |
|----|---------|--------|
| DS-03 | Button component sizes too small | All buttons across site have tiny text |
| AC-03 | LearningAccordion missing ARIA | Screen readers can't determine accordion state |
| AC-05 | Bootcamp icon-only buttons missing aria-label | Screen readers can't identify toolbar actions |
| AC-06 | StudentTopbar z-index wrong | Topbar can be covered by other elements |
| AC-10 | ~50+ hardcoded English strings | i18n incomplete across student pages |
| M-01 | No student mobile bottom nav | Major navigation gap on mobile |
| V-01 | SettingsPage h1 breaks typography scale | Inconsistent heading hierarchy |
| V-03 | NotificationsPage double-padding | Content visually misaligned with other pages |
| SA-01/02 | CourseLessonSkeleton missing hero/quiz/code | Layout shift on course lesson load |
| ER-01 | ErrorState only used on Dashboard | No error feedback on most pages |

### MEDIUM (Visual inconsistency or moderate UX impact)

| ID | Finding |
|----|---------|
| DS-01 | Dual skeleton primitives (one dead) |
| DS-02 | Triple stat card pattern |
| DS-04 | StatCard emerald-400 violates accent rule |
| DS-06 | BatchPagination dots too small |
| DS-07 | FilterTabs missing tab semantics |
| V-02 | SettingsPage unique background pattern |
| V-06 | Inconsistent card styling |
| V-07 | Inconsistent FadeIn usage |
| V-08 | Mixed animation libraries |
| V-10/11 | shadow-lg violations |
| A-01 | Inconsistent topbar padding |
| N-01 | No desktop Prev button in LearningNav |
| N-02 | LearningToolbar z-index collision |
| N-03 | Three overlapping nav mechanisms on desktop |
| AC-09 | LearningToolbar desktop buttons missing aria-label |
| AC-11 | Dialog backdrop-blur-sm |
| AC-12/13/14 | Missing reduced-motion checks |
| CC-06 | StudentTopbar 565-line monolith |
| SA-05/06/07/08/12 | Various skeleton accuracy issues |
| LE-01/02/03 | Learning experience parity gaps |
| E-01 | EmptyState unused in student pages |
| ER-02 | InlineQuiz crashes on empty array |
| PP-02 | FadeIn perceived delay |

### LOW (Minor polish or code quality)

| ID | Finding |
|----|---------|
| R-05 | Inconsistent root wrapper min-h |
| R-06/07 | Minor responsive patterns |
| V-04/05 | Bottom padding mismatches |
| V-09 | aspect-square vs aspect-[16/9] |
| V-12/13 | Inconsistent button/tab styles |
| T-04 | Inconsistent tracking values |
| SA-09/10/11/13 | Minor skeleton issues |
| Various | i18n defaults, documentation, code duplication |

---

## 28. RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Critical Accessibility & Layout Fixes (Week 1)

1. **Fix touch targets** (AC-01) — Increase all undersized interactive elements to `min-h-[44px] min-w-[44px]`. Affects: StudentTopbar, RoomTopBar, LearningToolbar, ProfileDropdown, NotificationsDropdown, CodePlayground, BatchPagination, Dialog close.

2. **Fix navbar keyboard accessibility** (AC-02) — Add keyboard handlers to Navbar desktop dropdowns.

3. **Fix LearningAccordion ARIA** (AC-03) — Add `aria-expanded`, `aria-controls`, `id`/`role="region"`.

4. **Fix InlineQuiz progress bar** (AC-04) — Add `role="progressbar"`, `aria-valuenow`, `aria-label`.

5. **Fix icon-only button labels** (AC-05) — Add `aria-label` to BootcampRoomPage mobile buttons.

6. **Fix StudentTopbar z-index** (AC-06) — Change from `z-40` to `z-[100]`.

7. **Fix BootcampRoomSkeleton** (SA-03) — Add sidebar, toolbar, and nav skeleton blocks.

8. **Fix LabListingSkeleton** (SA-04) — Remove fabricated filter/search. Add hero skeleton.

### Phase 2: Design System Consolidation (Week 2)

9. **Fix Button component sizes** (DS-03) — Increase `sm` to `text-xs`, `md` to `text-sm`.

10. **Delete unused Skeleton.tsx** (DS-01) — Remove dead code.

11. **Consolidate stat cards** (DS-02) — Standardize on `StatCard`.

12. **Fix StatCard emerald** (DS-04) — Replace with `text-accent`.

13. **Fix BatchPagination** (DS-06) — Increase dot button size.

14. **Fix FilterTabs** (DS-07) — Add ARIA tab semantics.

15. **Fix ErrorState colors** (C-01) — Resolve conflicting color classes.

16. **Fix Dialog backdrop-blur** (AC-11) — Remove or replace.

17. **Fix shadow-lg violations** (V-10/11) — Replace with border-based active states.

### Phase 3: i18n & Content Quality (Week 3)

18. **Systematic i18n pass** (AC-10) — Wrap all hardcoded English strings in `t()`. Priority areas: LearningAccordion, StepNumberHeader, StudentTopbar, RoomTopBar, NotFoundPage, Footer, BootcampCoursePage, CodePlayground.

19. **Add empty states** (E-01) — Add EmptyState to MyCoursesPage, NotificationsPage, MarketplacePage, CompetitivePage, BootcampCoursePage.

20. **Add ErrorState to all data-fetching pages** (ER-01).

### Phase 4: Consistency & Polish (Week 4)

21. **Standardize root wrapper min-h** (R-05) — Use `min-h-full` everywhere.

22. **Add FadeIn to all student pages** (V-07).

23. **Standardize topbar padding** (A-01) — Use `px-3 md:px-4 lg:px-6` everywhere.

24. **Consolidate card styling** (V-06) — Choose `card-accent` or document distinction.

25. **Fix CourseLessonSkeleton** (SA-01/02) — Add hero, quiz, and code editor placeholders.

26. **Add skeleton→content cross-fade** (MO-04).

27. **Extract shared constants** (RU-01/02/03) — LABS, TOOLS, panelHandlers.

28. **Split StudentTopbar** (CC-06) — Into separate mode-specific components.

### Phase 5: Advanced Improvements (Ongoing)

29. **Add student mobile bottom nav** (M-01) — Consider a student-specific bottom navigation.

30. **Add lab keyboard shortcuts** (LE-01) — ArrowLeft/ArrowRight for scenario navigation.

31. **Consolidate animation libraries** (V-08) — Standardize on one approach.

32. **Fix reduced-motion gaps** (AC-12/13/14) — Add checks to ConsentBanner, LearningToolbar, AuthForm.

33. **Improve LearningNav desktop** (N-01) — Add Prev button or document asymmetry.

---

*End of audit. This document contains findings from inspection of 100+ component files, the complete CSS design system, routing configuration, all student pages, shared components, learning architecture, skeletons, navigation, and accessibility patterns.*
