/**
 * @file AdminLayout.tsx
 * @description Shell layout component for ALL admin-facing pages.
 *
 * This component acts as the visual "frame" that wraps every admin page.
 * It is never used directly as a page — React Router's <Outlet /> renders
 * the actual page content inside it (see explanation below).
 *
 * ─── VISUAL STRUCTURE ────────────────────────────────────────────────────────
 *
 *  ┌──────────────────────────────────────────────┐  ← Fixed topbar (AdminTopbar)
 *  │              Admin Top Navigation             │    always visible, scrolls with nothing
 *  ├──────────────────────────────────────────────┤
 *  │                                  ┌──────────┐│
 *  │         Page Content             │  Right   ││
 *  │         (<Outlet />)             │  Rail    ││  ← desktop only sidebar (AdminRightRail)
 *  │                                  │          ││
 *  │                                  └──────────┘│
 *  ├──────────────────────────────────────────────┤
 *  │         Mobile Bottom Nav (inside Topbar)    │  ← fixed at screen bottom on phones
 *  └──────────────────────────────────────────────┘
 *
 * ─── ROUTING CONTEXT ─────────────────────────────────────────────────────────
 *
 * In React Router v6, layouts work via nesting:
 *   <Route element={<AdminLayout />}>
 *     <Route path="dashboard" element={<AdminDashboard />} />  ← renders inside <Outlet />
 *     <Route path="users"     element={<AdminUsers />} />
 *   </Route>
 *
 * AdminLayout renders once; only the inner page swaps when the URL changes.
 *
 * ─── SPACING STRATEGY ────────────────────────────────────────────────────────
 *
 * Both the topbar and the mobile bottom nav are CSS `position: fixed`, meaning
 * they float above the page and don't push content down naturally.
 * We compensate with padding on the content wrapper:
 *   • Top padding  → clears the topbar so content isn't hidden behind it.
 *   • Bottom padding → clears the mobile bottom nav so content isn't cut off.
 *
 * ─── POTENTIAL ISSUE TO NOTE ─────────────────────────────────────────────────
 * AdminRightRail is rendered here at the layout level but its internal
 * positioning (fixed/absolute/sticky) is handled inside AdminRightRail itself.
 * If a page inside <Outlet /> uses `position: relative` containers at full
 * height, verify the rail doesn't overlap critical content on mid-size screens.
 */

import { Outlet } from 'react-router-dom';
import AdminTopbar from '../../features/admin/components/layout/AdminTopbar';
import AdminRightRail from '../../features/admin/components/layout/AdminRightRail';

// ─── Spacing Tokens ───────────────────────────────────────────────────────────
//
// These CSS class strings are defined as constants so that if the topbar height
// ever changes, you only need to update it in ONE place here (and in AdminTopbar).
//
// AdminTopbar uses Tailwind class `h-20` on mobile and `h-24` on desktop:
//   h-20 = 80px  → pt-20 pushes content 80px down on mobile
//   h-24 = 96px  → md:pt-24 pushes content 96px down on desktop (md = 768px+)
//
// ⚠️  KEEP IN SYNC: If AdminTopbar's height classes change, update this constant.
const TOPBAR_H = 'pt-20 md:pt-24';

// AdminTopbar renders a bottom navigation bar on mobile devices.
// That bar is `position: fixed` at the bottom of the screen, so it floats
// over page content. We add bottom padding to the content wrapper so the
// last piece of content is never hidden underneath it.
//
// Breakdown of `pb-[calc(68px+env(safe-area-inset-bottom,0px))]`:
//   68px                          → the mobile bottom nav's minimum height (min-h-[68px])
//   env(safe-area-inset-bottom)   → extra space for iPhone "notch" / home indicator area
//   ,0px                          → fallback value for browsers that don't support env()
//   md:pb-6                       → on desktop (768px+) no bottom nav exists, so just 24px breathing room
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

/**
 * AdminLayout Component
 *
 * Renders the persistent chrome (topbar, right rail) around whichever
 * admin page React Router has matched. The matched page renders via <Outlet />.
 *
 * This component has NO internal state and NO side effects — it is a pure
 * structural shell.
 */
const AdminLayout = () => (
  /**
   * Outermost page wrapper.
   *
   * `bg-bg`       → uses a CSS custom property / Tailwind token for the site's
   *                  background color. Centralised so theming is easy.
   * `min-h-screen` → ensures the background color fills the full viewport height
   *                  even on short pages (prevents a white strip at the bottom).
   */
  <div className="bg-bg min-h-screen">

    {/*
      ── Fixed Topbar + Mobile Bottom Nav ──────────────────────────────────────
      AdminTopbar renders TWO navigation elements internally:
        1. The top bar   — fixed to the top of the viewport on all screen sizes.
        2. A bottom nav  — fixed to the bottom of the viewport on mobile only
                           (hidden on md+ screens with Tailwind responsive classes).

      Because both are `position: fixed`, they don't affect document flow — hence
      why we handle spacing via padding on the content wrapper below, not here.
    */}
    <AdminTopbar />

    {/*
      ── Main Content Wrapper ───────────────────────────────────────────────────
      This div does two things via its Tailwind classes:

      1. TOPBAR CLEARANCE (TOPBAR_H = pt-20 md:pt-24):
         Pushes content down so it starts BELOW the fixed topbar.
         Without this, the topbar would overlap the top of every page.

      2. BOTTOM NAV CLEARANCE (MOBILE_NAV_PB):
         Adds bottom padding on mobile so the last content element is
         never hidden underneath the fixed mobile bottom nav.
         On desktop (md+) it's just a small 24px (pb-6) gap.

      <Outlet /> is a React Router placeholder — it renders whatever child
      route component matches the current URL. For example, if the user is
      on /admin/users, React Router replaces <Outlet /> with <AdminUsers />.
    */}
    <div className={`${TOPBAR_H} ${MOBILE_NAV_PB}`}>
      <Outlet />
    </div>

    {/*
      ── Right Rail (Desktop Sidebar) ───────────────────────────────────────────
      AdminRightRail is an auxiliary sidebar shown only on desktop screens.
      Its visibility toggling (hidden on mobile) is handled via CSS classes
      INSIDE the AdminRightRail component itself, not here.

      It is rendered at the layout level (outside the content wrapper) so it
      can be positioned independently of the scrolling content area — typically
      via `position: fixed` or `position: sticky` inside AdminRightRail.
    */}
    <AdminRightRail />
  </div>
);

export default AdminLayout;