/**
 * @file StudentLayout.tsx
 * @description Shell layout for ALL authenticated student-facing pages inside
 *              the /dashboard route tree.
 *
 * This is the most complex layout in the application because it must handle
 * multiple distinct page types with different visual requirements — all while
 * sharing the same topbar. It uses React Router's `useMatch` hook to detect
 * which page the student is currently on, and adjusts the layout accordingly.
 *
 * ─── VISUAL STRUCTURE (STANDARD STUDENT PAGE) ────────────────────────────────
 *
 *  ┌──────────────────────────────────────────────────┐  ← Fixed StudentTopbar (always visible)
 *  │                 Student Topbar                    │    h-20 mobile / h-24 desktop
 *  ├──────────────────────────────────────────────┬───┤
 *  │                                              │   │
 *  │     Page Content  (<Outlet />)               │ R │  ← StudentRightRail (desktop sidebar)
 *  │                                              │ a │    hidden on certain pages (see logic)
 *  │                                              │ i │
 *  │                                              │ l │
 *  └──────────────────────────────────────────────┴───┘
 *  ┌──────────────────────────────────────────────────┐  ← Fixed at bottom (mobile only, inside Topbar)
 *  │              Mobile Bottom Nav                    │
 *  └──────────────────────────────────────────────────┘
 *
 * ─── VISUAL STRUCTURE (ROOM PAGE — SPECIAL CASE) ─────────────────────────────
 *
 *  ┌──────────────────────────────────────────────────┐  ← Fixed StudentTopbar
 *  ├──────────────────────────────────────────────────┤
 *  │  ┌─────────────────────┬────────────────────┐   │
 *  │  │  Left Pane          │  Right Pane         │   │  ← Split-pane layout managed INSIDE
 *  │  │  (e.g. video/code)  │  (e.g. chat/tasks)  │   │    the Room page component itself.
 *  │  │  (scrolls own area) │  (scrolls own area) │   │    No bottom padding added by layout.
 *  │  └─────────────────────┴────────────────────┘   │
 *  └──────────────────────────────────────────────────┘
 *    NO right rail on room pages. NO bottom padding.
 *
 * ─── THE ROUTE MATCHING LOGIC ────────────────────────────────────────────────
 *
 * `useMatch(pattern)` returns a match object if the current URL matches the
 * given pattern, or `null` if it doesn't. We use `Boolean(match)` to convert
 * this to a simple true/false.
 *
 * The layout uses this to make two decisions:
 *
 *  1. IS THIS A ROOM PAGE?  (isRoomPage)
 *     Room pages need a fixed-height, split-pane shell where each pane scrolls
 *     independently. Adding bottom padding here would break that layout.
 *     Two URL patterns are checked (new path and legacy path).
 *
 *  2. SHOULD THE RIGHT RAIL BE HIDDEN?  (hideRightRail)
 *     The right rail is hidden on:
 *       a. All bootcamp-related pages (room, course overview, bootcamp list)
 *          — these pages have complex full-width layouts that own their own sidebar.
 *       b. Marketplace, wallet, notifications, settings pages
 *          — these pages have their own page-level sidebar and don't need the rail.
 *     Again, both new and legacy URL paths are checked for each page type.
 *
 * ─── WHY ARE THERE LEGACY URL MATCHES? ──────────────────────────────────────
 *
 * The app appears to have gone through a URL restructure. Pages that once lived
 * at `/marketplace`, `/wallet`, `/settings` etc. now live at
 * `/dashboard/marketplace`, `/dashboard/wallet`, `/dashboard/settings`.
 * Both old and new paths are matched to support any bookmarks, external links,
 * or redirects that still use the old URLs during the transition period.
 *
 * ─── ROUTING CONTEXT ─────────────────────────────────────────────────────────
 *
 *   <Route path="/dashboard" element={<StudentLayout />}>
 *     <Route path="home"           element={<StudentHome />} />
 *     <Route path="bootcamps"      element={<BootcampList />} />
 *     <Route path="bootcamps/:id"  element={<BootcampCourse />} />
 *     <Route path="bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId"
 *                                  element={<RoomPage />} />
 *     <Route path="marketplace"    element={<Marketplace />} />
 *     <Route path="wallet"         element={<Wallet />} />
 *     ...
 *   </Route>
 *
 * ─── POTENTIAL ISSUE TO NOTE ─────────────────────────────────────────────────
 * The legacy URL matches (e.g. `useMatch('/marketplace')`) suggest old routes
 * may still be active in the router config. If these legacy routes have been
 * fully removed from the router, the corresponding `useMatch` calls and
 * `||` conditions here are dead code and can be cleaned up.
 */

import { Outlet, useMatch } from 'react-router-dom';
// The student-specific fixed topbar (includes mobile bottom nav internally).
import StudentTopbar from '../../features/student/components/layout/StudentTopbar';
// The student-specific right rail sidebar (desktop only).
import StudentRightRail from '../../features/student/components/layout/StudentRightRail';

// ─── Spacing Tokens ───────────────────────────────────────────────────────────
//
// Defined as constants so height values are in one place.
// ⚠️ KEEP IN SYNC with StudentTopbar's height classes (h-20 mobile / h-24 desktop).
//   h-20 = 80px  → pt-20 clears the topbar on mobile.
//   h-24 = 96px  → md:pt-24 clears the topbar on desktop (768px+).
const TOPBAR_H = 'pt-20 md:pt-24';

// On mobile, StudentTopbar renders a fixed bottom nav bar.
// We add bottom padding to all non-room pages so content never hides beneath it.
//
// Breakdown:
//   68px                          → mobile bottom nav min-height (min-h-[68px])
//   env(safe-area-inset-bottom)   → iPhone home bar / notch safe area
//   ,0px                          → fallback for browsers without env() support
//   md:pb-6                       → desktop: no bottom nav, just 24px breathing room
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

/**
 * StudentLayout Component
 *
 * Renders the persistent student shell (topbar, optional right rail) and
 * adapts its padding/rail visibility based on the current URL.
 *
 * This component uses React hooks (`useMatch`) so it CANNOT be written as a
 * simple arrow function returning JSX with no logic — hence the explicit
 * `const StudentLayout = () => { ... return (...) }` form with a function body.
 */
const StudentLayout = () => {

  // ── Route Detection ─────────────────────────────────────────────────────────
  //
  // `useMatch` checks if the current browser URL matches a given path pattern.
  // Patterns like `:bootcampId` are dynamic segments — they match any value.
  // Returns a match object (truthy) on match, or null (falsy) on no match.

  // ── Room Page Detection ────────────────────────────────────────────────────
  // New URL structure: /dashboard/bootcamps/{id}/phases/{id}/rooms/{id}
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  // Legacy URL structure: /dashboard/bootcamps/{id}/modules/{id}/rooms/{id}
  // ("phases" was previously called "modules" — both are supported during migration)
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  // True if the student is on ANY room page (old or new URL format).
  const isRoomPage = Boolean(roomMatch || roomMatchLegacy);

  // ── Bootcamp Course Page Detection ────────────────────────────────────────
  // The "course overview" page for a specific bootcamp (curriculum/phase list).
  // URL: /dashboard/bootcamps/{bootcampId}
  const bootcampCourseMatch = useMatch('/dashboard/bootcamps/:bootcampId');

  // ── Bootcamp List Page Detection ───────────────────────────────────────────
  // The page listing all available bootcamps for the student.
  // URL: /dashboard/bootcamps
  const bootcampListMatch = useMatch('/dashboard/bootcamps');

  // True if the student is on ANY bootcamp-related page.
  // The right rail is hidden on all of these — bootcamp pages manage their own layout.
  const isBootcampPage = Boolean(isRoomPage || bootcampCourseMatch || bootcampListMatch);

  // ── Pages With Their Own Sidebar (Right Rail Hidden) ───────────────────────
  // These pages implement their own page-level sidebar/rail, so the shared
  // StudentRightRail would create a duplicate/conflicting sidebar.

  // Marketplace page (new and legacy URLs)
  const marketplaceMatch = useMatch('/dashboard/marketplace');
  const marketplaceLegacyMatch = useMatch('/marketplace');

  // Wallet page (new and legacy URLs)
  const walletMatch = useMatch('/dashboard/wallet');
  const walletLegacyMatch = useMatch('/wallet');

  // Notifications page (new and legacy URLs)
  const notificationsMatch = useMatch('/dashboard/notifications');
  const notificationsLegacyMatch = useMatch('/notifications');

  // Settings page (new and legacy URLs)
  const settingsMatch = useMatch('/dashboard/settings');
  const settingsLegacyMatch = useMatch('/settings');

  // True if the current page has its own sidebar and should suppress the shared rail.
  const hasPageOwnedSidebar = Boolean(
    marketplaceMatch
    || marketplaceLegacyMatch
    || walletMatch
    || walletLegacyMatch
    || notificationsMatch
    || notificationsLegacyMatch
    || settingsMatch
    || settingsLegacyMatch,
  );

  // Final decision: hide the right rail if EITHER condition is true.
  //   isBootcampPage     → room/course/list pages have their own layout
  //   hasPageOwnedSidebar → marketplace/wallet/notifications/settings have own sidebar
  const hideRightRail = isBootcampPage || hasPageOwnedSidebar;

  return (
    /**
     * Page wrapper.
     * `bg-bg`       → background color from the design system / Tailwind theme token.
     * `min-h-screen` → fills at least the full viewport height so bg color is consistent.
     */
    <div className="bg-bg min-h-screen">

      {/*
        ── Fixed Student Topbar ───────────────────────────────────────────────
        Always rendered on every student page — it's the primary navigation.
        Internally renders:
          • A top navigation bar (fixed, always visible).
          • A mobile bottom navigation bar (fixed at screen bottom, mobile only).
        Both are `position: fixed` and don't affect document flow.
      */}
      <StudentTopbar />

      {/*
        ── Content Wrapper ────────────────────────────────────────────────────
        Provides spacing to prevent content from being hidden behind the fixed
        topbar (top) and mobile bottom nav (bottom).

        Top padding (TOPBAR_H = pt-20 md:pt-24):
          Always applied — every page needs to clear the topbar.

        Bottom padding (MOBILE_NAV_PB or nothing):
          ROOM PAGES:  no bottom padding applied (`''` empty string).
                       Room pages manage their own fixed-height split-pane layout.
                       Adding padding here would create a gap that breaks the layout.
          OTHER PAGES: MOBILE_NAV_PB is applied to clear the mobile bottom nav.

        Ternary breakdown: `isRoomPage ? '' : MOBILE_NAV_PB`
          If it IS a room page → use empty string (no bottom padding class).
          If it is NOT a room page → use the mobile nav padding class.

        <Outlet /> renders the matched child route component at the current URL.
      */}
      <div className={`${TOPBAR_H} ${isRoomPage ? '' : MOBILE_NAV_PB}`}>
        <Outlet />
      </div>

      {/*
        ── Student Right Rail (Conditional Desktop Sidebar) ───────────────────
        Rendered ONLY when `hideRightRail` is false (i.e. on standard student
        pages like the dashboard home, profile, etc.).

        The `{!hideRightRail && <StudentRightRail />}` pattern is a common React
        idiom for conditional rendering:
          • If hideRightRail is true  → `!hideRightRail` is false → nothing renders.
          • If hideRightRail is false → `!hideRightRail` is true  → <StudentRightRail /> renders.

        StudentRightRail handles its own desktop-only visibility internally
        (it's hidden on mobile via CSS classes inside the component).
        It is positioned independently of the content wrapper (likely `position: fixed`
        or `position: sticky` internally).
      */}
      {!hideRightRail && <StudentRightRail />}
    </div>
  );
};

export default StudentLayout;