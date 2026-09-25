# Learning Walkthrough — UX Audit & Unified Refactor Design

Status: Implemented in phases (Phases 1–5). See commit history on `qyvora-frontend-version-two`.
Scope: labs, courses, bootcamp rooms, and the reading layer they share.

## 1. The Problem

The walkthrough experience has too many buttons, three different completion models, imposter
features, and surface-specific step chrome that don't match each other or the calm design system.
A student reading an attack lab, a course lesson, or a bootcamp room is met with an inconsistent
control inventory and several contradictory signals for "done".

## 2. Ranked UX Problems

1. **Different completion models per surface.** Labs complete only by flag; courses complete via a
   free `Complete` button (no requirement to touch the quiz/playground); bootcamp "progress" means
   "viewed", not "mastered", while completing needs a separate server exam.
2. **Too many controls on the reading surface.** Per step: bookmark, "Mark as Got It", Report
   Issue, inline quiz, My Notes, image expand, copy button, flag input. Desktop hides bookmark/actions
   behind `opacity-0 group-hover` (bad discoverability). Copy-button logic is written 5+ times, and
   every inline code span in narrative is itself a click-to-copy button (noise mid-reading).
3. **Imposter features.** Course lessons advertise a `TERM` badge (`CourseLessonPage/index.tsx`)
   where no terminal ever renders — the wiring event `qyvora:open-walkthrough-terminal` is never
   dispatched. The lab banner "Walkthrough complete! Claim your CP below." has no claim control.
4. **Ending spoilers / broken order.** Lab debrief steps are never locked, so "Mission Complete"
   narrative is reachable before the mission starts. `WalkthroughStep.isLocked` is destructured but
   never applied. KillChain is the outlier: no `FocusedStepList`, no `LearningNav`, locked steps
   render fully interactive flag inputs.
5. **Bootcamp completion gauntlet.** QuizGateModal → QuizModal → CelebrationModal triple-modal
   stack, plus a second per-step `InlineQuiz` from a different question bank with no linkage.
   "Take Quiz & Complete" collapses two actions into one button.
6. **Dead code and drift.** Dead curriculum drawer (never opened), `bootcamp-room/CopyButton.tsx`
   never imported, `WalkthroughLayout.difficultyColor` and `LabPage.villain` dead props, `prose-custom`
   no-op class, RoomCard doodle canvas, two parallel terminal wrappers, seven different start-verbs,
   ArrowLeft/Right course nav hijacking quiz-option focus, raw `text-yellow-300/80` hint colors,
   `max-w-2xl` inline constraint, custom inline lock SVG, `WalkthroughSidebar` z-index drift.

## 3. The Unified Walkthrough Model (the flow)

- **One spine**: `FocusedStepList` is the single step model for courses, bootcamps, and labs.
  One expanded active step; the rest collapse to Done / Next / Locked rows. All on one page.
- **Step content is content**: narrative (blog typography, full width) + at most one command block +
  at most one checkpoint (flag for labs, room quiz for bootcamp rooms). Courses keep an optional
  self-check quiz. A step has at most one gate.
- **One completion path**: `LearningNav` = Previous + Next. The final step shows a single primary
  `Complete`; where the step carries a checkpoint, completing passes it first. One CelebrationModal.
- **End**: debrief steps stay locked until all preceding steps complete.

## 4. UI Design Spec (calm tokens)

- Step container: `border-t border-border/10 first:border-t-0` section rule + `StepNumberHeader`, `py-12 md:py-16`.
- Body: `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]`, lowercase headings `font-black uppercase tracking-tight` (blog grammar in `courses/markdown/typography.tsx`).
- Command block: one shared primitive, compact padding (`px-3 py-1.5` header, `px-3 py-2` body), one copy button. Inline code = plain text spans.
- Checkpoint: flag = `rounded-xl border bg-bg px-4 py-3 font-mono` + `Submit`; quiz = existing `InlineQuiz` card.
- Nav: `btn-secondary Previous` + primary `Next Step`, one primary `Complete` at the end, `min-h-[44px]`, mobile counter.
- Per-page chrome only: one collapsible "My Notes" footer + a small Report-issue text link at page foot. Never per-step.
- Standard per-step interactive inventory: **≤ 2 controls** (a copy button + at most one checkpoint).

## 5. Removed Items

- Dead: bootcamp curriculum drawer, `bootcamp-room/CopyButton.tsx`, `WalkthroughLayout.difficultyColor`,
  `LabPage.villain`, `prose-custom`, RoomCard doodle, unused `qyvora:open-walkthrough-terminal` event,
  `WorkspaceProgress` export, dead walkthrough-barrel re-exports, `StepJumpMenu` mobile duplication.
- Per-step chrome removed from bootcamp steps: bookmark, "Mark as Got It", per-step inline quiz, per-step
  Report Issue button. Report Issue moved to page footer.
- Imposter TERM badge removed from course lessons (terminal commands render as command blocks instead).
- "Claim your CP below" banner removed (the celebration modal owns completion).
- Start verbs standardized to `Start`.

## 6. Validation

After each phase: `npm run typecheck`, `npm run lint`, `npm run build`. See `AGENTS.md` validation section.