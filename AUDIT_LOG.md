# QYVORA Mobile UX/UI Audit Log

**Audit Date:** 2026-07-24
**Scope:** Full frontend (`qyvora-frontend/src/`) — mobile-first, touch-device focused
**Methodology:** Static grep sweep + page-by-page code review across all routes

---

## Summary of Fixes Applied

### BLOCKER — Fixed (5 items)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `features/student/components/SimulatedTerminal/SimulatedTerminal.tsx:71,83` | `h-screen` in fullscreen mode causes iOS Safari address bar overlap | Changed `h-screen` → `h-dvh` (2 locations) |
| 2 | `features/student/pages/tools/TerminalToolPage.tsx:12` | `h-screen w-screen` on standalone terminal page | Changed `h-screen` → `h-dvh` |
| 3 | `features/student/components/tools/Ide.tsx:591` | `h-screen w-screen` in standalone mode | Changed `h-screen` → `h-dvh` |
| 4 | `features/student/components/tools/NetworkBuilder.tsx:426` | `h-screen w-screen` in standalone mode | Changed `h-screen` → `h-dvh` |

### HIGH — Fixed (6 items)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 5 | `features/student/components/layout/StudentTopbar/StudentTopbar.tsx:133` | Fixed `top-0` header missing `safe-area-inset-top` — content obscured behind Dynamic Island/notch on modern iPhones | Added `pt-[env(safe-area-inset-top)]` to header |
| 6 | `features/admin/components/layout/AdminTopbar/AdminTopbar.tsx:110` | Same issue as #5 on admin topbar | Added `pt-[env(safe-area-inset-top)]` to header |
| 7 | `shared/components/layout/RoomTopBar.tsx:75` | Same issue as #5 on room topbar | Added `pt-[env(safe-area-inset-top)]` to header |
| 8 | `features/marketing/components/hacker-globe/HackerGlobe.tsx:385` | Globe mount container lacks `overflow-hidden` — absolutely-positioned labels with negative transforms can escape the container, causing horizontal scroll on mobile | Added `overflow-hidden` to mount container |
| 9 | `features/student/components/layout/InstallBanner.tsx:41` | Fixed-position banner missing `safe-area-inset-bottom` — may overlap home indicator on devices without bottom nav | Added `pb-[env(safe-area-inset-bottom,0px)]` |
| 10 | `core/contexts/ToastContext.tsx:110` | Toast container lacks `overflow-hidden` — many stacked toasts could overflow viewport bottom | Added `overflow-hidden` to toast container |

### MEDIUM — Fixed (active states — 40+ elements)

Added `active:` feedback states to interactive elements across 18 files:

| File | Elements Fixed |
|------|---------------|
| `features/auth/components/LoginForm.tsx` | Forgot password button, create account link |
| `features/auth/components/ForgotPasswordForm.tsx` | Back button, enter token link |
| `features/auth/components/VerifyEmailForm.tsx` | Back button, resend token link |
| `features/auth/components/ResetPasswordConfirmForm.tsx` | Back button |
| `features/auth/pages/LoginPage.tsx` | Admin login submit button |
| `features/student/components/layout/StudentTopbar/StudentTopbar.tsx` | 7 back/menu buttons, 3 breadcrumb links, desktop nav items |
| `features/student/components/layout/StudentTopbar/NotificationsDropdown.tsx` | Mark all read button, view all link |
| `features/student/components/layout/StudentTopbar/ToolsDropdown.tsx` | Desktop trigger, mobile trigger |
| `features/student/components/bootcamp-room/DesktopToolbar.tsx` | Jump menu, fullscreen, next/complete buttons |
| `features/student/components/bootcamp-room/CopyButton.tsx` | Copy button |
| `features/student/components/tools/ToolChooserModal.tsx` | Close button, panel option, fullscreen option |
| `features/student/pages/SettingsPage.tsx` | Copy token, regenerate, cancel, confirm, revoke all, revoke session, cancel delete |
| `features/student/pages/CourseLessonPage/index.tsx` | Prev/next buttons, mark complete |
| `features/admin/components/layout/AdminTopbar/AdminTopbar.tsx` | Operator nav link |
| `shared/components/ui/CodeBlock.tsx` | Both copy buttons |
| `shared/components/courses/CodePlayground.tsx` | Copy, reset, hint toggle |
| `shared/components/courses/StepNotes.tsx` | Notes toggle |
| `shared/components/carousel/Carousel.tsx` | Prev/next navigation |
| `shared/components/ScenarioCard.tsx` | Card container |
| `shared/components/ErrorBoundary.tsx` | Dashboard button |
| `shared/components/layout/Footer.tsx` | Social links, nav links |

### LOW — Updated Documentation

| # | File | Issue | Fix |
|---|------|-------|-----|
| 11 | `AGENTS.md` | Z-index scale missing mobile drawer tiers (z-[60]/z-[70]) and stacked dialog tiers (z-[210]/z-[211]) | Updated z-index documentation table with all 19 layers |

---

## Issues Found but Deferred

### `min-h-screen` → `min-h-dvh` (19 locations)

**Severity:** Low (functional but suboptimal)
**Files:** `StudentLayout.tsx`, `AdminLayout.tsx`, `router.tsx`, `LandingLayout.tsx`, `BlogsLayout.tsx`, `NotFoundPage.tsx`, `PublicProfilePage.tsx`, `BlogPostPage.tsx`, `TermsPage.tsx`, `LoginPage.tsx`, `StudentSkeletons.tsx`, `CourseLessonPage/index.tsx`, `MyCoursesPage/index.tsx`, `AuthFormLayout.tsx`

**Reason deferred:** `min-h-screen` (min-height: 100vh) is generally safe because it sets a minimum, not an exact height. Content grows beyond the viewport. The visual impact is a possible 1-2px gap at the bottom on mobile Safari, which is far less severe than the `h-screen` issue. Could be batch-updated in a future pass.

### `h-[88vh]` and `h-[85vh]` in modal dialogs

**Severity:** Low
**Files:** `Ide.tsx:601` (h-[88vh]), `NetworkBuilder.tsx:438` (h-[85vh])
**Reason deferred:** These are modal dialogs, not fullscreen pages. They already use `calc()` or `vh` values that are relative to the viewport, so the address bar issue is less impactful since the dialog doesn't extend to the viewport edge. Leaving as-is.

### Sub-12px text sizes (795+ instances)

**Severity:** Low (by design)
**Finding:** `text-[8px]` (49 instances), `text-[9px]` (248 instances), `text-[10px]` (423+ instances)
**Reason deferred:** These are intentional design choices for the cyberpunk/monospace aesthetic — badges, labels, status indicators, and data-dense simulation panels. Most are uppercase `font-black` with generous `tracking-widest`, which compensates for the small size. The `text-[8px]` in `KillChainDiagram` phase descriptions and `SkillMatrix` axis labels are borderline but serve as supplementary/label text, not primary content.

### Missing `active:` on landing page card containers

**Severity:** Low
**Files:** `LandingPillarsSection.tsx`, `LandingServicesSection.tsx`, `LandingLabsSection.tsx`, `LandingBootcampSection.tsx`, `LandingTeamSection.tsx` (33 card divs total)
**Reason deferred:** These are non-interactive decorative cards with hover effects for desktop. They are not `<button>` or `<Link>` elements — they're `<div>` containers with `hover:border-accent/30`. The "sticky hover" effect on touch is cosmetic only and doesn't block functionality. Could be batch-fixed with `active:scale-[0.98]` in a future pass.

### Missing `active:` on remaining buttons (48 buttons)

**Severity:** Low
**Finding:** Many secondary buttons across the app still lack `active:` states
**Reason deferred:** The most high-traffic interactive elements have been fixed (auth forms, topbar, settings, tool chooser, course navigation). The remaining buttons are in less-frequently-visited admin panels, simulation toolbars, and secondary UI elements. A comprehensive batch fix could be done but would require careful review to avoid unintended scale effects on small icon buttons.

### `z-[210]/z-[211]` stacked dialog (ConnectionMediumModal)

**Severity:** Low
**File:** `features/student/components/tools/network/ConnectionMediumModal.tsx`
**Reason deferred:** This is an intentional stacked dialog pattern (dialog within a dialog). The z-index is correctly 10 units above the base dialog tier. Now documented in AGENTS.md.

### `z-[220]` context menu (network tool)

**Severity:** Low
**File:** `features/student/components/tools/network/ContextMenu.tsx`
**Reason deferred:** Right-click context menu for the network visualization tool. Intentionally above dialog level. Now documented in AGENTS.md.

### `TermsContentSection.tsx` decorative number overflow

**Severity:** Low
**File:** `features/marketing/pages/TermsPage/TermsContentSection.tsx:40`
**Finding:** Large decorative number positioned `absolute top-0 right-0` without overflow-hidden ancestor
**Reason deferred:** On very narrow screens (<320px), the `text-3xl`/`text-4xl` number could theoretically overflow. In practice, the parent has `max-w-[1600px]` padding that provides sufficient clearance. Monitor if reported.

### `Ide.tsx` hardcoded color values

**Severity:** Low (cosmetic)
**File:** `features/student/components/tools/Ide.tsx`
**Finding:** Multiple hardcoded colors (`#3c3c3c`, `#007acc`, `#252526`, etc.) bypass the Tailwind design system
**Reason deferred:** These are VS Code theme colors for the IDE chrome. Changing them to design system tokens would alter the IDE's visual identity, which is outside scope.

---

## Files Modified (Complete List)

1. `features/student/components/SimulatedTerminal/SimulatedTerminal.tsx`
2. `features/student/pages/tools/TerminalToolPage.tsx`
3. `features/student/components/tools/Ide.tsx`
4. `features/student/components/tools/NetworkBuilder.tsx`
5. `features/student/components/layout/StudentTopbar/StudentTopbar.tsx`
6. `features/admin/components/layout/AdminTopbar/AdminTopbar.tsx`
7. `shared/components/layout/RoomTopBar.tsx`
8. `features/marketing/components/hacker-globe/HackerGlobe.tsx`
9. `features/student/components/layout/InstallBanner.tsx`
10. `core/contexts/ToastContext.tsx`
11. `features/auth/components/LoginForm.tsx`
12. `features/auth/components/ForgotPasswordForm.tsx`
13. `features/auth/components/VerifyEmailForm.tsx`
14. `features/auth/components/ResetPasswordConfirmForm.tsx`
15. `features/auth/pages/LoginPage.tsx`
16. `features/student/components/layout/StudentTopbar/NotificationsDropdown.tsx`
17. `features/student/components/layout/StudentTopbar/ToolsDropdown.tsx`
18. `features/student/components/bootcamp-room/DesktopToolbar.tsx`
19. `features/student/components/bootcamp-room/CopyButton.tsx`
20. `features/student/components/tools/ToolChooserModal.tsx`
21. `features/student/pages/SettingsPage.tsx`
22. `features/student/pages/CourseLessonPage/index.tsx`
23. `shared/components/ui/CodeBlock.tsx`
24. `shared/components/courses/CodePlayground.tsx`
25. `shared/components/courses/StepNotes.tsx`
26. `shared/components/carousel/Carousel.tsx`
27. `shared/components/ScenarioCard.tsx`
28. `shared/components/ErrorBoundary.tsx`
29. `shared/components/layout/Footer.tsx`
30. `AGENTS.md`
