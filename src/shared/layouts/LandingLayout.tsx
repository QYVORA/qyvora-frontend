/**
 * @file LandingLayout.tsx
 * @description Shell layout component used EXCLUSIVELY by the marketing landing page.
 *
 * This layout is intentionally different from PublicLayout and SnapPublicLayout.
 * The landing page is a "scroll-snap" experience — the viewport snaps from one
 * full-screen section to the next (like swiping slides), rather than scrolling
 * continuously. This layout is built to support that behaviour.
 *
 * ─── VISUAL STRUCTURE ────────────────────────────────────────────────────────
 *
 *  ┌──────────────────────────────────────────────┐  ← Fixed Navbar (always on top)
 *  │                  Navbar                       │
 *  ├──────────────────────────────────────────────┤
 *  │                                               │
 *  │   Landing Page Content  (<Outlet />)          │  ← Snap sections rendered here
 *  │   [Hero Section]                              │    Each section = 100vh tall
 *  │   [Features Section]                          │    Page scrolls snap-by-snap
 *  │   [CTA Section]                               │
 *  │   [Footer Section]  ← embedded IN last snap  │  ← NO separate Footer component here
 *  │                                               │
 *  └──────────────────────────────────────────────┘
 *  ┌──────────────────────────────────────────────┐  ← Fixed at screen bottom (mobile only)
 *  │             PublicBottomNav                   │
 *  └──────────────────────────────────────────────┘
 *
 * ─── WHY NO PADDING ON <main>? ───────────────────────────────────────────────
 *
 * Normally, because Navbar is `position: fixed`, you need top-padding on the
 * content below it so the navbar doesn't cover it. Here, that padding is
 * intentionally ABSENT from the layout level. Instead, the HeroSection component
 * (the first snap section) handles its own top offset internally (pt-16 md:pt-20).
 *
 * This is a deliberate design decision: it allows the hero background to extend
 * fully behind the navbar for a full-bleed visual effect, while the hero's TEXT
 * content still clears the navbar via its own internal padding.
 *
 * ─── WHY NO <Footer /> HERE? ─────────────────────────────────────────────────
 *
 * In a scroll-snap layout, a traditional footer appended after <main> would
 * break the snapping behaviour — the browser would try to snap past it in an
 * unexpected way. Instead, the landing page embeds its footer as the LAST snap
 * section directly inside the page component (rendered via <Outlet />).
 *
 * ─── WHY NO overflow-hidden ON <main>? ───────────────────────────────────────
 *
 * The snap scroll container (inside <Outlet />) manages its own `overflow`
 * internally. Adding `overflow-hidden` here at the layout level would clip
 * the snap container and break scrolling entirely.
 *
 * ─── ROUTING CONTEXT ─────────────────────────────────────────────────────────
 *
 * Used in React Router as a parent route element:
 *   <Route element={<LandingLayout />}>
 *     <Route index element={<LandingPage />} />   ← the only child
 *   </Route>
 *
 * ─── POTENTIAL ISSUE TO NOTE ─────────────────────────────────────────────────
 * PublicBottomNav is fixed at the bottom on mobile. Since there's no bottom
 * padding on <main> here (unlike PublicLayout), the last snap section's content
 * could be obscured by the mobile nav on small screens. Each snap section
 * should account for this internally if needed.
 */

import { Outlet } from 'react-router-dom';
// Shared marketing navigation bar — fixed at the top of the viewport.
import Navbar from '../../features/marketing/components/layout/Navbar';
// Mobile-only bottom navigation bar — fixed at the bottom of the viewport.
import PublicBottomNav from '../../features/marketing/components/layout/PublicBottomNav';
// A modal component for the "Contact Us" form — rendered at layout level so it
// can be triggered from anywhere within the landing page (any snap section).
import ContactModalHost from '../../features/marketing/components/ContactModal';

/**
 * LandingLayout Component
 *
 * A lightweight wrapper that provides:
 *  - The shared Navbar (fixed, always visible).
 *  - A plain <main> with no padding constraints (snap sections handle their own spacing).
 *  - The mobile bottom nav (PublicBottomNav).
 *  - The ContactModalHost so the contact modal can be opened from any section.
 *
 * This component has NO internal state and NO side effects.
 *
 * NOTE: React Fragments (<> </>) are used as the root instead of a <div> because
 * this layout doesn't need a wrapper element — the children are independently
 * positioned and no shared styling is needed on a container.
 */
const LandingLayout = () => (
  <>
    {/*
      ── Shared Marketing Navbar ────────────────────────────────────────────────
      `position: fixed` inside Navbar — floats above all content at the top.
      Used across all public/marketing pages (landing, contact, services, etc.).
      The landing page hero handles its own top offset so content clears this bar.
    */}
    <Navbar />

    {/*
      ── Snap Scroll Content Area ───────────────────────────────────────────────
      `w-full` ensures the content spans the full viewport width.

      NO top padding here (unlike PublicLayout's pt-[72px]) — see file-level
      comment for the reasoning. The HeroSection manages its own top clearance.

      NO overflow-hidden here — the snap container inside <Outlet /> manages
      its own scroll behaviour.

      <Outlet /> renders the matched child route — in practice, this is always
      LandingPage, which contains the snap scroll container and all snap sections.
    */}
    <main className="w-full">
      <Outlet />
    </main>

    {/*
      ── Mobile Bottom Navigation ───────────────────────────────────────────────
      A simplified nav bar shown ONLY on mobile (hidden on md+ via classes inside
      the component). It's `position: fixed` at the bottom of the screen.
      Provides quick-access navigation links for mobile users.
    */}
    <PublicBottomNav />

    {/*
      ── Contact Modal Host ─────────────────────────────────────────────────────
      Renders the "Contact Us" modal overlay. It's placed at layout level (outside
      <main>) so it can visually escape any overflow or stacking context constraints
      that the snap sections might create.

      The modal is likely hidden by default and shown via a shared state trigger
      (e.g., a Zustand store, React Context, or a URL param) when the user clicks
      a "Contact" button anywhere on the landing page.
    */}
    <ContactModalHost />
  </>
);

export default LandingLayout;