# QYVORA Learning System Redesign — Implementation Report

**Date:** 2026-09-08
**Scope:** Bootcamp rooms, Courses, Labs walkthroughs + shared learning/mission components.
**Baseline:** `docs/LEARNING_SYSTEM_AUDIT.md` (read-only audit, completed prior).
**Design decision (confirmed):** Focused-step expansion — same route/page, all steps still on one page, only the current step fully expanded; completed/next steps collapse to compact status rows. Applied to Bootcamp rooms, Courses, and Labs.

---

## 1. Summary

The long-scroll, "everything expanded at once" learning pages were converted to a focused-step presentation. All existing learning content, routes, backend contracts, localStorage keys, progress systems, and terminal/simulation machinery are preserved. A new shared component (`FocusedStepList`) drives the collapse/expand behavior across all three learning families, keeping a consistent visual language (single component family, no second design system).

Validation: `tsc`, `eslint`, `vitest` (24 files / 226 tests), and `vite build` all pass after the changes.

---

## 2. What Changed

### 2.1 New shared component — `FocusedStepList`

`src/shared/components/learning/FocusedStepList.tsx` (+ `export { default as FocusedStepList }` in `src/shared/components/learning/index.ts`)

- Only the active item is fully expanded (rendered via `renderActive(index)`).
- Completed items collapse to compact "Done" rows; upcoming items to compact "Next"/"Locked" rows.
- Status is communicated as **text**, not color-only (`learning.focused.*` i18n keys), with `min-h-[48px]` rows, disabled when locked.
- The active item's container gets scroll-target `id="${idPrefix}-${number}"` with `scroll-mt-20 md:scroll-mt-24` (navbar clearance), so the existing `scrollIntoView` navigation keeps working on the same page.
- Collapsed rows are real `<button min-h-[48px]>` elements with `aria-label` and `aria-pressed`-compatible semantics; locked rows use `disabled`.

### 2.2 Bootcamp rooms — focused steps

`src/features/student/pages/BootcampRoomPage/index.tsx`

- Replaced the all-steps `space-y-8` block with `FocusedStepList idPrefix="step"` keyed off `currentStepIdx` / `viewedSteps`.
- `goToStep` scroll targeting unchanged (`step-${idx + 1}`), now with a bounded retry loop so the scroll lands after React commits the newly-expanded step (the old code assumed the target id always existed).
- `src/features/student/components/bootcamp-room/StepCard.tsx`: removed the duplicate `id={`step-${stepNum}`}` from the card root (StepCard is only used by BootcampRoomPage) to avoid duplicate DOM ids now that `FocusedStepList` owns the scroll-target id.

### 2.3 Courses — focused lessons

`src/features/student/pages/CourseLessonPage/index.tsx`

- Replaced the all-lessons `.space-y-4` block with `FocusedStepList idPrefix="lesson"` (active lesson expanded, completed/next lessons as compact rows).
- Scroll targets normalized to **1-based** `lesson-${n}` throughout (`scrollToLesson` + mount effect), matching the new focused id; the `?lesson=` search param (0-based, as stored in the URL) is unchanged.
- Fetches honors `prefers-reduced-motion` (`behavior: 'auto'` vs `'smooth'`) and uses `{ replace: true }` on the search param.
- Progress header (already present) now renders a real `role="progressbar"`.

### 2.4 Labs — focused steps via `WalkthroughLayout`

`src/shared/components/walkthrough/WalkthroughLayout.tsx`

- New opt-in props: `stepList`, `activeStepIndex`, `onStepSelect`, `stepIdPrefix`. When provided, `WalkthroughLayout` renders children through `FocusedStepList`; otherwise it renders exactly as before (backward compatible — `KillChainLab` and any non-step content unaffected).
- Progress presentation upgraded from text-only to a visual `role="progressbar"` bar (reduced-motion aware) with i18n labels.
- Lab pages wired up: `PrivescLab`, `PasswordLab`, `SqlInjectionLab`, `OsintLab`.
  - Each builds a `stepList` from `getStepState(i)` (briefing always done → first incomplete chapter active → debrief compile step).
  - Extra non-step children (SqlInjection/Osint "Target:" info box) get an explicit row entry rather than breaking the index mapping.
  - `viewStepIdx` local state lets learners re-open a completed step; cleared on successful flag submission / step completion so focus returns to the next active step.
  - `KillChainLab` left as-is — it already presents a phase-per-stage experience; documenting rather than forcing the collapse onto a different structure.

### 2.5 Accessibility fixes (audit findings)

- `src/features/student/components/bootcamp-room/QuizModal.tsx`: replacement of raw `green-500`/`red-500` answer colors with `accent`/`danger` tokens; `aria-pressed` on answer options; `aria-live="polite"`/`aria-atomic` on the result block.
- `src/features/student/components/bootcamp-room/ImageLightbox.tsx`: Escape-to-close, Tab focus trap on the dialog, `role="dialog"` + `aria-labelledby`, 44px touch targets, and `prefers-reduced-motion`-aware image zoom spring.
- `src/features/student/components/SimulatedTerminal/TerminalShell.tsx`: output region now `role="log"` + `aria-live="polite"` + `aria-label`.
- `src/shared/components/courses/InlineQuiz.tsx`: `aria-pressed` on options, `aria-live`/`aria-atomic` on results markup (complement to the survey log).

### 2.6 i18n — `learning.*` namespace

`src/i18n/locales/en.json`

- The `learning.*` namespace was **missing entirely** (verified before the change), so `t('learning.nav.*')`, `t('learning.progress.title')`, etc. rendered as raw keys. Added:
  - `learning.nav.prev|next|nextStep|complete|processing|quizAndComplete|completeRoom`
  - `learning.toolbar.label|toggle`
  - `learning.progress.title|steps|stepsComplete`
  - `learning.focused.done|locked|upcoming`
- The 17 African-language locale files are still missing the namespace (they use English fallback). Filled for `en` only; **documented gap**.

---

## 3. What Was Deliberately NOT Changed (documented, per spec)

Out of scope / left as-is; recorded here instead of "fixed":
- Bootcamp config duplication (`bootcampConfig.ts` vs server data + frontend constants).
- `QuizQuestion`/quiz type duplication.
- `skillRegistry`, TTL cache, course-access duplication, `StudentLayout` global tools, localStorage-only course progress persistence.
- Public landing-page snap-scroll work (explicitly excluded).
- Three learning families deliberately **not** forced into one data model — consistent learner experience on top of appropriate underlying architectures (server progress for bootcamp, localStorage-only for courses, server flag-verify + local completion for labs).
- `KillChainLab`'s custom phase flow (already stage-focused).
- All 17 non-English locales for `learning.*` strings.

## 4. Invariants Preserved (verified)

- Backend contracts untouched: `/student/modules/:phaseNum/rooms/:num/complete`, `403 quiz_required` gating, `/student/labs/verify-flag`, engagement/overview/course/CP/XP/streak/leaderboard services — no service file modified.
- localStorage keys untouched: `qyvora_course_progress_${courseId}`, `qyvora_lab_progress`, `gotit_${phaseId}_${roomId}`, `hpb_bookmarks_${bootcampId}`, `step_notes_*`, `qyvora_discovered_ips`, `qyvora_terminal_*`.
- Routes preserved (incl. legacy `/modules/:moduleId/rooms/:roomId`, `/courses/:id`, `/learn`); `?step=` / `?lesson=` deep links still drive the focused item.
- All steps remain on ONE route/page; `FocusedStepList` only changes which item is expanded. Navbar clearance (`pt-20 md:pt-24`, `scroll-mt-20 md:scroll-mt-24`) honored on all new scroll targets.
- No second design system: `FocusedStepList` reuses the existing token system (`bg-bg-card`, `text-accent`, `rounded-2xl`, JetBrains Mono, etc.) and composes `StepCard`/`LessonViewer`/`WalkthroughStep` unchanged.

## 5. Validation & Regression

- `npx tsc --noEmit` — passes.
- `npx eslint .` — passes (repo-wide).
- `npx vitest run` — 24 files / 226 tests pass.
- `npx vite build` — builds clean, exit 0.
- Regression scans confirmed:
  - Only `BootcampRoomPage`/`CourseLessonPage` produce `step-N`/`lesson-N` ids (via `FocusedStepList`); no duplicate ids remain.
  - `goToStep`/`scrollToLesson` scroll targeting corrected for the new focused-id timing (bounded retry).
  - No dead references to the removed `StepCard` id; no orphaned imports (lint clean).

## 6. Known Remaining Items (future work)

- Localize `learning.*` (and the labs' hardcoded English walkthrough strings) for the 17 non-English locales.
- Decide on focused-step collapse for `KillChainLab` if the phase-stage structure is ever converted to a flat step list.
- Consider expanded-state persistence (restoring which step is open on reload) as a follow-up enhancement.

## 7. Follow-up Fixes (2026-09-08)

### 7.1 Content interaction no longer scrolls the walkthrough

**Bug:** In bootcamp rooms, the `StepCard` root `<div onClick={onClick}>` wrapped the entire step content — including `InlineQuiz`, flag inputs, copy buttons and markdown links. Clicks on those controls bubbled up to `onClick` → `goToStep(i)` → `scrollIntoView('#step-N')`, yanking the page to the top of the step whenever the learner answered a quiz or pressed any button. On mobile this discarded their scroll position mid-interaction.

**Fix (`StepCard.tsx`):** the root `onClick`/`onKeyDown` now ignore events that originate from interactive elements via `target.closest('button, a, input, textarea, select, [role="button"], label, [contenteditable="true"]')`, so only clicks on non-interactive card chrome trigger the scroll/navigation handler.

**Rule added to `AGENTS.md`:** "No scroll on content interaction" — no click/scroll/submit handler may be attached to a container wrapping interactive walkthrough content.

### 7.2 Community popup — timing, login gating, styling

`CommunityPopup.tsx` was mounted at the router root and appeared on every page — including the logged-in dashboard — 30s after load, floating over active learning work.

- **Login gating:** the popup is now disabled the moment a user is signed in (`usePopupManager('community', 3, !authed)`); it releases its slot and never shows inside the student app — "disappears at login". It remains a public-visitor lead-gen popup.
- **Timing:** appearance delay reduced 30s → 8s.
- **Styling:** removed off-system `backdrop-blur-xl`, `shadow-2xl`, and glow drop-shadows on the CTA / icon badge to match the design system (solid `bg-bg-card`, border/`text-accent` tokens, no button glows per AGENTS.md).

### 7.3 AGENTS.md cleanup — removed dead snap-scroll rules

The public-page snap-scroll system was removed earlier; the following "Do Not Reintroduce" rules referenced code that no longer exists anywhere in `src` (verified via `rg`) and were deleted:
- `.snap-container-proximity` CSS class
- Scroll-snap (`scroll-snap-type`, `snap-section` class) on landing/public pages
- `useSnapWheelNav` hook