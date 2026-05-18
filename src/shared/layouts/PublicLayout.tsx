/**
 * @file PublicLayout.tsx
 * @description Shell layout for standard, normally-scrolling public-facing pages.
 *
 * This is the "default" public layout. It wraps pages like Contact, Services,
 * CyberPoints, and any other marketing page that uses conventional top-to-bottom
 * scrolling (as opposed to snap-scroll, which uses SnapPublicLayout).
 *
 * ─── VISUAL STRUCTURE ────────────────────────────────────────────────────────
 *
 *  ┌──────────────────────────────────────────────┐  ← Fixed Navbar (always on top)
 *  │                  Navbar                       │    72px tall → pt-[72px] on main
 *  ├──────────────────────────────────────────────┤
 *  │                                               │
 *  │         Page Content  (<Outlet />)            │  ← Normal continuous scroll
 *  │                                               │
 *  ├──────────────────────────────────────────────┤
 *  │                  Footer                       │  ← Rendered by this layout
 *  └──────────────────────────────────────────────┘
 *  ┌──────────────────────────────────────────────┐  ← Fixed at screen bottom (mobile only)
 *  │             PublicBottomNav                   │
 *  └──────────────────────────────────────────────┘
 *
 * ─── HOW FIXED ELEMENTS AFFECT SPACING ───────────────────────────────────────
 *
 * Both Navbar and PublicBottomNav use `position: fixed` — they are "lifted"
 * out of the normal document flow and sit on top of page content. This means
 * the browser doesn't automatically make room for them. We handle this manually:
 *
 *   TOP:    Navbar is ~72px tall. We add `pt-[72px]` (inline Tailwind arbitrary
 *           value) to <main> so content starts below the navbar, not behind it.
 *           NOTE: This is hardcoded. If Navbar's height ever changes, this value
 *           must be updated manually here. ⚠️ Consider making this a shared token.
 *
 *   BOTTOM: PublicBottomNav floats at the bottom on mobile. We add a calculated
 *           bottom padding to <main> so the last content / Footer isn't covered:
 *             `pb-[calc(60px+env(safe-area-inset-bottom,0px))]`
 *             60px → mobile bottom nav height
 *             env(safe-area-inset-bottom) → iPhone home indicator / notch clearance
 *             ,0px → fallback for unsupported browsers
 *           On desktop (md+), `md:pb-0` removes the bottom padding because
 *           PublicBottomNav is hidden on desktop.
 *
 * ─── ROUTING CONTEXT ─────────────────────────────────────────────────────────
 *
 *   <Route element={<PublicLayout />}>
 *     <Route path="contact"     element={<ContactPage />} />
 *     <Route path="services"    element={<ServicesPage />} />
 *     <Route path="cyberpoints" element={<CyberPointsPage />} />
 *     ...
 *   </Route>
 *
 * ─── DIFFERENCE FROM OTHER LAYOUTS ───────────────────────────────────────────
 *
 *  vs LandingLayout:     Has explicit top/bottom padding & a Footer. LandingLayout
 *                        has no padding and no Footer (it's inside the snap page).
 *
 *  vs SnapPublicLayout:  This layout is for NORMAL scroll pages. SnapPublicLayout
 *                        is for viewport-locked snap-scroll pages on desktop.
 *
 *  vs AdminLayout:       AdminLayout wraps admin pages and has a right rail.
 *                        This layout wraps public marketing pages.
 *
 *  vs StudentLayout:     StudentLayout wraps authenticated student pages and
 *                        handles complex route-based sidebar logic.
 */

import { Outlet } from 'react-router-dom';
// Shared marketing navigation bar — fixed at top, used across all public pages.
import Navbar from '../../features/marketing/components/layout/Navbar';
// Shared marketing footer — rendered BELOW the page content, above the mobile nav.
import Footer from '../../features/marketing/components/layout/Footer';
// Mobile-only bottom navigation — fixed at the screen bottom, hidden on desktop.
import PublicBottomNav from '../../features/marketing/components/layout/PublicBottomNav';
// "Contact Us" modal host — sits outside <main> to escape scroll/overflow contexts.
import ContactModalHost from '../../features/marketing/components/ContactModal';

/**
 * PublicLayout Component
 *
 * Provides the persistent chrome (Navbar, Footer, mobile nav, contact modal)
 * around any standard public-facing page. The actual page content is injected
 * via React Router's <Outlet />.
 *
 * This component has NO internal state and NO side effects.
 */
const PublicLayout = () => (
  // React Fragment — no wrapper div needed since children are independently laid out.
  <>
    {/*
      ── Shared Marketing Navbar ────────────────────────────────────────────────
      Rendered first so it's at the top of the DOM (good for accessibility / tab order).
      Internally uses `position: fixed` so it always stays at the top while
      the user scrolls through the page content.
    */}
    <Navbar />

    {/*
      ── Main Page Content Area ─────────────────────────────────────────────────
      This is the scrollable content region between the Navbar and Footer.

      Classes explained:
        w-full
          → spans the full available width of the viewport.

        pb-[calc(60px+env(safe-area-inset-bottom,0px))]
          → MOBILE: bottom padding to prevent content from being hidden under
            the fixed PublicBottomNav. The 60px is the nav bar's height.
            `env(safe-area-inset-bottom)` adds extra space for devices with
            a home indicator (e.g., iPhones without a physical home button).
            `,0px` is the fallback if the browser doesn't support env().

        md:pb-0
          → DESKTOP (768px+): removes the bottom padding because PublicBottomNav
            is hidden on desktop screens.

      NOTE: There is no explicit `pt-[72px]` here even though the Navbar is fixed
      and 72px tall. Looking at the file-level docblock comment — this SHOULD be
      here to prevent content overlapping with the navbar. Each child page likely
      has its own top padding/margin, but this is worth verifying across all pages
      that use PublicLayout. ⚠️ Consider adding pt-[72px] here for consistency
      (see SnapPublicLayout which DOES explicitly add pt-[72px]).

      <Outlet /> is replaced at runtime by React Router with the currently
      matched child route component (e.g., <ContactPage />, <ServicesPage />).
    */}
    <main className="w-full pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <Outlet />
    </main>

    {/*
      ── Site Footer ────────────────────────────────────────────────────────────
      Standard footer with links, copyright, etc. Rendered AFTER <main> so it
      appears below the page content in the normal document flow.

      On mobile, the fixed PublicBottomNav sits on top of this Footer visually.
      The `pb-[calc(60px+...)]` on <main> ensures the Footer itself is not
      hidden — but verify Footer's own bottom padding is sufficient on mobile.
    */}
    <Footer />

    {/*
      ── Mobile Bottom Navigation ───────────────────────────────────────────────
      Fixed at the bottom of the screen on mobile only. Hidden on desktop via
      internal CSS classes inside PublicBottomNav. Provides quick-access links
      (e.g., Home, Services, Contact) for mobile users.
    */}
    <PublicBottomNav />

    {/*
      ── Contact Modal Host ─────────────────────────────────────────────────────
      Renders the "Contact Us" modal overlay. Placed outside <main> and Footer
      so it can render above all page content without being clipped by any
      parent overflow or stacking context.
    */}
    <ContactModalHost />
  </>
);

export default PublicLayout;