/**
 * @file SnapPublicLayout.tsx
 * @description Shell layout for public pages that use viewport-locked snap scrolling
 *              on tablet/desktop, but fall back to normal scrolling on mobile.
 *
 * "Snap scroll" means the page doesn't scroll freely — it locks (snaps) to the
 * start of the next full-screen section, similar to swiping through PowerPoint
 * slides or TikTok videos. Each section fills the full visible screen height.
 *
 * ─── RESPONSIVE BEHAVIOUR (THE CORE CONCEPT) ─────────────────────────────────
 *
 *  MOBILE (< 768px / below Tailwind's `md` breakpoint):
 *    • Normal, free-scrolling page.
 *    • `pt-[72px]` clears the fixed navbar.
 *    • `pb-[calc(60px+...)]` clears the fixed mobile bottom nav.
 *    • Footer renders normally at the bottom via the `<div className="md:hidden">` block.
 *    • Content stacks vertically as usual.
 *
 *  TABLET / DESKTOP (768px+ / Tailwind `md` and above):
 *    • Snap-scroll mode activates.
 *    • The inner container becomes `h-[calc(100dvh-72px)]` — exactly the viewport
 *      height minus the navbar, so it fills the remaining screen perfectly.
 *    • Each child section within <Outlet /> fills this container (h-full).
 *    • The browser snaps between sections.
 *    • Footer is NOT rendered by this layout on desktop — each page's LAST snap
 *      section embeds its own footer content.
 *    • Bottom padding is removed (md:pb-0) since there's no mobile bottom nav.
 *
 * ─── VISUAL STRUCTURE ────────────────────────────────────────────────────────
 *
 *  MOBILE:
 *  ┌──────────────────────────────────────────────┐  ← Fixed Navbar (72px)
 *  ├──────────────────────────────────────────────┤
 *  │  Section 1 content (natural height)          │
 *  │  Section 2 content (natural height)          │  ← Normal free scroll
 *  │  ...                                         │
 *  ├──────────────────────────────────────────────┤
 *  │  Footer                                      │  ← Rendered by md:hidden div
 *  └──────────────────────────────────────────────┘
 *  ┌──────────────────────────────────────────────┐  ← Fixed bottom (mobile nav)
 *
 *  DESKTOP:
 *  ┌──────────────────────────────────────────────┐  ← Fixed Navbar (72px)
 *  ├──────────────────────────────────────────────┤
 *  │  ┌────────────────────────────────────────┐  │
 *  │  │  Snap Container (100dvh - 72px tall)   │  │
 *  │  │  ┌──────────────────────────────────┐  │  │
 *  │  │  │  Section 1  (snaps to this)      │  │  │  ← User sees ONE section at a time
 *  │  │  ├──────────────────────────────────┤  │  │
 *  │  │  │  Section 2  (snaps to this)      │  │  │
 *  │  │  ├──────────────────────────────────┤  │  │
 *  │  │  │  Last Section + Embedded Footer  │  │  │  ← Footer lives inside last section
 *  │  │  └──────────────────────────────────┘  │  │
 *  │  └────────────────────────────────────────┘  │
 *  └──────────────────────────────────────────────┘
 *
 * ─── WHY `100dvh` INSTEAD OF `100vh`? ────────────────────────────────────────
 *
 * `dvh` = "dynamic viewport height". On mobile browsers, `100vh` can be
 * unreliable because the browser's own UI (address bar, toolbar) changes height
 * as the user scrolls, causing layout jumps. `100dvh` accounts for this and
 * always equals the ACTUAL visible height. On desktop, `dvh` and `vh` behave
 * identically.
 *
 * ─── ROUTING CONTEXT ─────────────────────────────────────────────────────────
 *
 *   <Route element={<SnapPublicLayout />}>
 *     <Route path="features" element={<FeaturesPage />} />
 *     <Route path="pricing"  element={<PricingPage />} />
 *   </Route>
 *
 * ─── DIFFERENCE FROM LandingLayout ───────────────────────────────────────────
 *
 * LandingLayout is ALSO for snap-scroll pages, but is used exclusively for the
 * marketing landing/home page (which has unique requirements like no top padding
 * for a full-bleed hero). SnapPublicLayout is the general-purpose version for
 * other public snap pages that need the standard navbar clearance.
 *
 * ─── POTENTIAL ISSUE TO NOTE ─────────────────────────────────────────────────
 * The `<main>` has `style={{ height: undefined }}`. This is an explicit no-op —
 * it was likely added to override or cancel a previously set inline `height` style,
 * or to prevent a parent style from bleeding in. It has no functional effect as
 * written. Consider removing it to keep the code clean, unless it is deliberately
 * overriding a global style rule.
 */

import { Outlet } from 'react-router-dom';
// Shared marketing navigation bar — fixed at top of viewport.
import Navbar from '../../features/marketing/components/layout/Navbar';
// Shared marketing footer — shown ONLY on mobile via the md:hidden wrapper below.
import Footer from '../../features/marketing/components/layout/Footer';
// Mobile-only bottom navigation — fixed at screen bottom, hidden on desktop.
import PublicBottomNav from '../../features/marketing/components/layout/PublicBottomNav';

/**
 * SnapPublicLayout Component
 *
 * A dual-behaviour layout:
 *  • Mobile  → standard scrolling page with Navbar, content, Footer, mobile nav.
 *  • Desktop → snap-scroll experience where the content container locks to
 *              the viewport height and each section snaps into view.
 *
 * This component has NO internal state and NO side effects.
 */
const SnapPublicLayout = () => (
  // React Fragment — no wrapper div needed.
  <>
    {/*
      ── Shared Marketing Navbar ────────────────────────────────────────────────
      Fixed at the top of the viewport. 72px tall on all screen sizes.
      The `pt-[72px]` on <main> below compensates for this fixed positioning.
    */}
    <Navbar />

    {/*
      ── Main Content Wrapper ───────────────────────────────────────────────────
      This <main> tag does different jobs on mobile vs desktop:

      SHARED:
        w-full       → fills the full viewport width.
        pt-[72px]    → clears the 72px fixed Navbar on ALL screen sizes.
                       (Same value used twice: `pt-[72px] md:pt-[72px]` — the
                       md: prefix is redundant here since both values are identical.
                       ⚠️ The `md:pt-[72px]` can be safely removed.)

      MOBILE ONLY:
        pb-[calc(60px+env(safe-area-inset-bottom,0px))]
          → Bottom padding to ensure content isn't hidden under the fixed
            PublicBottomNav. 60px = nav height. env() adds iPhone home bar clearance.

      DESKTOP (md+):
        md:pb-0  → removes mobile bottom padding (no bottom nav on desktop).

      style={{ height: undefined }}
        → Explicitly sets no inline height. This is a no-op and likely a
          leftover from debugging. Safe to remove. ⚠️
    */}
    <main
      className="w-full pt-[72px] md:pt-[72px] pb-[calc(60px+env(safe-area-inset-bottom,0px))] md:pb-0"
      style={{ height: undefined }}
    >
      {/*
        ── Snap Container Host ──────────────────────────────────────────────────
        This inner div behaves differently by screen size:

        MOBILE:
          `w-full` only — no height constraint. Content flows naturally.
          The snap behaviour inside <Outlet /> is disabled/ignored on mobile.

        DESKTOP (md+):
          `md:h-[calc(100dvh-72px)]`
            → Sets the container to exactly the remaining viewport height after
               accounting for the 72px navbar.
            → `100dvh` = full dynamic viewport height (see file-level note on dvh).
            → This makes the container the scroll root for snap scrolling.
               Child sections fill `h-full` of this container and snap into view.

        <Outlet /> is replaced at runtime by the matched child route (e.g.,
        <FeaturesPage />), which internally sets up the snap scroll sections.
      */}
      <div className="w-full md:h-[calc(100dvh-72px)]">
        <Outlet />
      </div>
    </main>

    {/*
      ── Mobile-Only Footer ─────────────────────────────────────────────────────
      `md:hidden` means this div (and the Footer inside it) is ONLY visible
      on screens narrower than 768px (mobile).

      On desktop, each snap-scroll page embeds its footer as the LAST snap
      section — appending a separate Footer here would break the snap layout.

      On mobile, the normal scroll means a standard Footer at the end of the
      page is appropriate and expected.
    */}
    <div className="md:hidden">
      <Footer />
    </div>

    {/*
      ── Mobile Bottom Navigation ───────────────────────────────────────────────
      Fixed at the bottom of the screen on mobile only. Hidden on desktop.
      Provides quick-access links for mobile users browsing public pages.
    */}
    <PublicBottomNav />
  </>
);

export default SnapPublicLayout;