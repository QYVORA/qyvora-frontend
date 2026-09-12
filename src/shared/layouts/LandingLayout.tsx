/**
 * @file LandingLayout.tsx
 * @description Shell layout component used EXCLUSIVELY by the marketing landing page.
 *
 * The landing page uses natural document scrolling — no scroll snapping, no
 * section-to-section snapping behavior.
 *
 * ─── VISUAL STRUCTURE ────────────────────────────────────────────────────────
 *
 *  ┌──────────────────────────────────────────────┐  ← Fixed Navbar (always on top)
 *  │                  Navbar                       │
 *  ├──────────────────────────────────────────────┤
 *  │                                               │
 *  │   Landing Page Content  (<Outlet />)          │  ← Natural scrolling sections
 *  │   [Hero Section]                              │
 *  │   [Features/CTA sections]                     │
 *  │   [Footer Section]  ← embedded IN last page   │
 *  │                                               │
 *  └──────────────────────────────────────────────┘
 *
 * ─── WHY NO PADDING ON <main>? ───────────────────────────────────────────────
 *
 * Normally, because Navbar is `position: fixed`, you need top-padding on the
 * content below it so the navbar doesn't cover it. Here, that padding is
 * intentionally ABSENT from the layout level. Instead, the HeroSection component
 * (the first section) handles its own top offset internally (pt-16 md:pt-20).
 *
 * This is a deliberate design decision: it allows the hero background to extend
 * fully behind the navbar for a full-bleed visual effect, while the hero's TEXT
 * content still clears the navbar via its own internal padding.
 *
 * ─── ROUTING CONTEXT ─────────────────────────────────────────────────────────
 *
 * Used in React Router as a parent route element:
 *   <Route element={<LandingLayout />}>
 *     <Route index element={<LandingPage />} />   ← the only child
 *   </Route>
 */

import { Outlet } from 'react-router-dom';
// Shared marketing navigation bar — fixed at the top of the viewport.
import { Navbar } from '@/shared/components/layout';
// A modal component for the "Contact Us" form — rendered at layout level so it
// can be triggered from anywhere within the landing page.
import ContactModalHost from '@/features/marketing/components/ContactModal';
import ServiceRequestModalHost from '@/features/marketing/components/ServiceRequestModal';
import ToolInstallModalHost from '@/features/marketing/components/ToolInstallModal';

import ConsentBanner from '@/shared/components/ConsentBanner';

/**
 * LandingLayout Component
 *
 * A lightweight wrapper that provides:
 *  - The shared Navbar (fixed, always visible).
 *  - A plain <main> with no padding constraints (landing sections handle their own spacing).
 *  - The ContactModalHost so the contact modal can be opened from any section.
 *  - The ConsentBanner.
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
      `position: fixed` inside Navbar, floats above all content at the top.
      Used across all public/marketing pages (landing, contact, services, etc.).
      The landing page hero handles its own top offset so content clears this bar.
    */}
    <Navbar />

    {/*
      ── Content Area ───────────────────────────────────────────────────────
      `w-full` ensures the content spans the full viewport width.
      NO top padding here (unlike PublicLayout's pt-[72px]), see file-level
      comment for the reasoning. The HeroSection manages its own top clearance.
      <Outlet /> renders the matched child route.
    */}
    <main id="main-content" className="w-full min-h-dvh flex flex-col">
      <Outlet />
    </main>

    {/*
      ── Contact Modal Host ─────────────────────────────────────────────────────
      Renders the "Contact Us" modal overlay. It's placed at layout level (outside
      <main>) so it can visually escape any overflow or stacking context constraints
      that the page sections might create.

      The modal is likely hidden by default and shown via a shared state trigger
      (e.g., a Zustand store, React Context, or a URL param) when the user clicks
      a "Contact" button anywhere on the landing page.
    */}
    <ContactModalHost />
    <ServiceRequestModalHost />
    <ToolInstallModalHost />

    {/* Cookie Consent banner */}
    <ConsentBanner />
  </>
);

export default LandingLayout;