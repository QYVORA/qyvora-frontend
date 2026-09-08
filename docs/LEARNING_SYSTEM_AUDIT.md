# QYVORA Learning System — Frontend Audit

**Date:** 2026-09-08
**Scope:** `qyvora-frontend` — read-only forensic analysis of the learner-facing frontend.
**Mode:** Audit only. No source files were modified. All findings cite `file:line` evidence from the repository.

---

## Executive Summary

QYVORA's current learning architecture is a **single-page, long-scroll walkthrough model** built on a shared set of react components, backed by a **mixed client/server progress authority** that varies by learning surface.

**Overall architecture.** There is no dedicated LMS abstraction layer. Instead, learning is spread across three parallel "families" — **Bootcamps (HPB)**, **Courses**, and **Attack Labs** — plus a **gamification layer** (CyberPoints, Xp/rank progression, skills, achievements, streaks) and a **SimulatedTerminal** engine. The three families share the *presentation* layer (`StepRenderer`, `EducationalMarkdownRenderer`, `LearningNav`, `LearningToolbar`, `WalkthroughScrollControls`, `useRoomSession`) but diverge completely in their *data* and *progress* layers.

**Main learning systems.**

1. **Hacker Protocol Bootcamp (HPB)** — hierarchical `phase → room → step`, content hardcoded in `bootcampConfig.ts`, progress tracked **server-side** with a graded quiz gate. This is the richest learning system.
2. **Courses** — flat `course → lesson`, content hardcoded in `courses/*.ts`, progress tracked **client-side in localStorage only**, no completion gate, no backend record.
3. **Attack Labs** — `lab → scenario → walkthrough steps`, content hardcoded in `simulations/*.ts`, flag correctness verified **server-side**, completion record kept **client-side in localStorage**.
4. **Gamification** — CyberPoints (earn/spend), server Xp/progression ranks, client-computed skill matrix, server achievements, server streaks, CP-based leaderboard.
5. **SimulatedTerminal** — an in-browser virtual filesystem + ~100 fake command handlers used to dress up lab/room/course content as a "hacking" experience; fully simulated, no real command execution.

**Major strengths.**
- A single shared Markdown renderer (`EducationalMarkdownRenderer` = `CodeBlockRenderer`) with strong sanitisation, used consistently across bootcamp steps, course lessons, and lab steps.
- A coherent, well-defined shared learning `StepRenderer`/`LearningNav`/`LearningToolbar`/`WalkthroughScrollControls` component family (AGENTS.md mandates one page, all steps mounted).
- A genuinely impressive, well-tested in-browser `SimulatedTerminal` engine (parser, filesystem, handlers all unit-tested).
- A principled gamification layer: ranks are server-authoritative (`profile.ts` forbids hardcoding rank names), skills/achievements are computed, and the leaderboard is backend-driven.
- Server-side quiz gating for bootcamp room completion (both client and server enforce it).

**Major weaknesses.**
- **No unified learning model.** Bootcamp/Course/Lab each define their own content types and their own progress/completion systems, so the same concept (progress, completion, step) behaves differently across surfaces.
- **Uneven persistence.** Bootcamp rooms are server-persisted; course lessons are localStorage-only; lab flags are server-verified but completion is localStorage-only. There is no single source of truth for "what the learner has done."
- **The "long-scroll documentation" feel** is a direct architectural consequence: every step/lesson/scenario is mounted simultaneously in a vertical stack with scroll-based navigation, so a room reads like a very long page rather than a discrete learning viewport.
- **Course completion is not real** — it is a cosmetic, client-only tally (no backend record, no gate, no reward), inconsistent with bootcamps.
- **Eight learning/progress concepts overlap** without a shared vocabulary (step viewed, step completed, room completed, lesson completed, lab completed, mission completed, skill progress, course completed).
- **Course access logic copy-pasted 4+ times**; `QuizQuestion` type duplicated 3 ways (plus a divergent 4th shape).
- Extremely thin test coverage of the actual interactive learner experience (see §Testing).

**Major architectural risks.**
- Duplicate/divergent data types for the same learning primitives make cross-surface changes fragile (`QuizQuestion`, `Course` vs `BootcampPhase`, three terminal-content injectors).
- localStorage-only course progress has no server backup and survives logout (per-user data on shared machines is risky).
- The `SkillMatrix` is a client-side projection that mixes server and localStorage data with an approximation (first-N-rooms heuristic in `skillRegistry.ts`), so the "skills" display can drift from reality.

**Major UX problems.**
- Excessive vertical scrolling with weak hierarchy and no sticky progress on long rooms.
- No discrete step transitions; concepts are reached by natural scrolling rather than deliberate forward motion.
- No swipe navigation in learning (only marketing carousels use `useSwipeNav`).
- Mobile sidebar is the only chapter nav and is hidden behind a hamburger; desktop has no persistent chapter sidebar at all (only a floating toolbar + jump menu).
- Quiz state conveyed by colour only (no `aria-pressed`/`aria-checked`), which hurts accessibility and comprehension.

**Existing systems that MUST be preserved.**
Missions (server-driven daily weekly), room completion (server quiz-gated), CyberPoints, Xp/rank progression, skills, achievements, streaks, leaderboard, SimulatedTerminal/VFS, flag verification, the shared `EducationalMarkdownRenderer`, the `StepRenderer`/`LearningNav`/`LearningToolbar` family, bookmarks, "Got It", per-step notes, `RelatedContent` cross-linking, and the existing routes/APIs.

---

## 1. Learning Architecture

Actual architecture discovered:

```text
Student Dashboard (/dashboard)
   │  useStudentOverview() GET /student/overview  (bootcamp status, xp, streak)
   │  useEngagement()      GET /student/engagement (daily mission, weekly op)
   │
   ├── Hacker Protocol Bootcamp
   │     (server-enrolled via /student/overview + /student/course)
   │     └── Phase  (bootcampConfig.phases[])
   │           └── Room  (route .../rooms/:roomId) — server session + quiz-gated completion
   │                 └── Steps  (StepCard[] mounted ALL at once on one page)
   │                       ├── Content (markdown → EducationalMarkdownRenderer)
   │                       ├── Images (StepImage)
   │                       ├── Inline quiz (formative, not graded)
   │                       ├── Grade quiz (room-level QuizModal — server-gated)
   │                       ├── Notes (StepNotes → localStorage)
   │                       ├── Bookmarks / "Got It" / Report Issue
   │                       └── Room completion (POST /student/modules/.../complete)
   │
   ├── Courses  (static frontend)
   │     └── Course  (courseData.ts COURSES[])
   │           └── Lessons  (all mounted on ONE page /dashboard/courses/:courseId)
   │                 ├── Content (markdown → EducationalMarkdownRenderer)
   │                 ├── CodePlayground (fake runners)
   │                 ├── Inline quiz (formative)
   │                 └── Completion = localStorage tally ONLY (no backend)
   │
   ├── Attack Labs  (static scenarios + server flag verify)
   │     └── Lab → Scenario → WalkthroughStep[] (all mounted)
   │           ├── Content markdown, objectives, hints, reflection
   │           ├── Flag input → POST /student/labs/verify-flag (server confirms)
   │           ├── SimulationPanel / InternalTerminal (simulated)
   │           └── Completion = localStorage + connection progress (server)
   │
   └── Gamification (cross-cutting)
         CyberPoints, Xp/rank (server), Skills (client projection), Achievements,
         Streaks (server), Leaderboard (CP-based, server)
```

Key architectural fact: **Bootcamp, Course, and Lab are three independent vertical systems** that reuse shared *presentation* components but have **no shared data or progress model**.

---

## 2. Content Rendering Architecture

**There is exactly ONE educational Markdown renderer**: `EducationalMarkdownRenderer` is an alias for `CodeBlockRenderer` (`src/shared/components/courses/CodeBlockRenderer.tsx:428`). It is the only file importing `react-markdown`/`remark-gfm`/`rehype-sanitize` in the learning path.

**Consumers (exhaustive):**
- `src/features/student/components/bootcamp-room/StepCard.tsx:78` (bootcamp step instruction)
- `src/features/student/pages/CourseLessonPage/index.tsx:57` (course lesson instruction)
- `src/shared/components/walkthrough/WalkthroughStep.tsx:106` (lab step narrative)
- Its own test file.

**Rendering path (same for all three):**

```
Content source (static TS: bootcampConfig.ts / courses/*.ts / simulations/*.ts)
   → Lesson/Room/Scenario .instruction (markdown string)
   → Parent (BootcampRoomPage | CourseLessonPage | LabPage)
   → Step wrapper (StepCard | LessonViewer | WalkthroughStep)
   → EducationalMarkdownRenderer (CodeBlockRenderer)
       • ReactMarkdown + remarkGfm + rehypeSanitize(tightened schema) + isSafeUrl
       • normalizeProse(): Valkyrie:"..." → blockquote, "**Label:**" → heading
       • bash FencedCodeBlock (tokenized, copy) + click-to-copy InlineCode
       • headings/lists/tables/hr/links/images with full components map
   → Final UI (styled prose; PARA_CLASS text-sm md:text-base font-mono text-text-secondary leading-[2])
```

**Content formats supported:** markdown with GFM (headings, bold, italic, lists, tables, blockquotes, horizontal rules, fenced/inline code, images, links). **No dedicated note/example/admonition syntax** — blockquotes serve as callouts. Raw HTML is escaped and stripped. There is **no rich-text editor or CMS**; all content is authored as TypeScript template-literal strings.

**Interactive blocks are NOT markdown** — they are React components toggled by flags:
- `CodePlayground` (course, fake in-browser runners `CodePlayground.tsx:14-36` — regex extraction, no interpreter)
- `InlineQuiz` (formative quiz)
- `CommandBlock`/`FlagInput`/progressive hints (labs, `WalkthroughStep`/`StepParts`)
- `SimulationPanel`/`InternalTerminal` (simulated environments)

**Blog renderers** (`shared/components/blog/{Terminal,IdeBlock,OutputBlock}.tsx`, `BlogsPage/shared.tsx`) are **discrete JSX components**, not markdown processors — no functional overlap with `EducationalMarkdownRenderer`. There are **three independent hand-rolled syntax highlighters** (`FencedCodeBlock` bash, `CodeBlock` Go/shell, `IdeBlock`) — visual duplication only.

---

## 3. Walkthrough Architecture

**Definition:** A "walkthrough" is any learner surface that renders multiple **steps** on a single page (bootcamp room, course lesson, or lab scenario). There is no discrete per-step route; all steps are rendered simultaneously and navigation scrolls between them.

**Step representation & content source.**
- Bootcamp: `BootcampStep { title, instruction, image, quiz? }` (`bootcampStructure.ts:22-29`). Populated content lives in `bootcampConfig.ts` (the duplicate in `bootcampStructure.ts` has empty `steps` and is only used for metadata lookups by `PhaseSection.tsx`).
- Course: `Lesson { id, title, instruction, image, hasQuiz?, quiz?, hasTerminal? ... }` (`courses/types.ts:9-23`).
- Lab: scenario-specific step shapes (`PrivescScenario` chapters, `SQL_INJECTION_TARGETS.steps`, `OSINT_CHALLENGES.steps`, `PASSWORD_EXERCISES.steps`, `KillChainScenario.phases[].commands[]`).

**Step state model (bootcamp room — the clearest example).** `BootcampRoomPage/index.tsx`:
- `currentStepIdx: number` — focused step; initialized from `?step=` URL param (`:79-82`), reset when phase/room changes (`:176-182`).
- `viewedSteps: Set<number>` — steps the user has scrolled to; starts `Set([0])` (`:83`), added on `goToStep` (`:254`) and all added on Complete (`:267`). **Not persisted** (in-memory only; resets on refresh).
- `gotItSteps: Set<number>` — "Got It" acknowledgements; persisted to localStorage key `gotit_${phaseId}_${roomId}` (`:224-235`). **Purely visual/self-tracking** — does NOT affect completion or progression.
- `bookmarkedSteps: Set<string>` — `"phase:room:stepIdx"` keys; persisted to `hpb_bookmarks_${bootcampId}` (`:218-244`).
- `quizPassed: boolean` — whether the room-level graded quiz has been passed (`:87`).
- `isRoomComplete` — derived from `completedRooms` set built by matching API `apiCourse.modules[].rooms[].completed` against config titles (`:184-200,208`).

**"Got It" behavior** (`StepCard.tsx`, `BootcampRoomPage.handleGotIt:228-235`): toggles a green indicator and writes the step number to localStorage. It is a **personal progress marker with zero progression effect**.

**Navigation / jump / scrolling.**
- `goToStep(idx)` (`:248-263`): sets state, updates `?step=` URL param, adds to viewed, then `window.scrollTo(0)` (step 0) or `document.getElementById('step-N').scrollIntoView({behavior})` for others. Uses reduced-motion-aware smooth/auto.
- All steps have `id="step-N"` (`StepCard.tsx:57`) and `scroll-mt-20 md:scroll-mt-24` for navbar clearance (`StepCard.tsx:63`).
- `StepJumpMenu` — modal jumping to any step by title; highlights current, checkmarks viewed (`StepJumpMenu.tsx`).
- `LearningNav` — bottom Prev/Next/Complete bar; mobile shows `current+1 / total` pill.
- `WalkthroughScrollControls` — floating Scroll-to-top / scroll-down-by-viewport buttons (appear after `scrollY > 240`).
- `LearningToolbar` — desktop fixed right side / mobile floating panel with jump-menu, fullscreen, next/complete actions.
- Keyboard: **courses** support ArrowLeft/Right at page level (`CourseLessonPage:173-181`); **bootcamp rooms** support arrows only when the active step card has DOM focus (`StepCard:41-53`); **labs** have no arrow navigation. No swipe navigation in learning.

**Completion flow (bootcamp room)** `handleComplete:264-271`:
1. Mark all steps viewed.
2. If `!quizPassed && quizModuleId` → open `QuizGateModal` → `QuizModal`.
3. On quiz pass → `markRoomComplete` (`POST /student/modules/:phaseNum/rooms/:backendRoomId/complete`).
4. Server rejects with `403 {code:'quiz_required'}` if no graded pass → re-open gate (`:126-129`). So **the graded quiz is a hard gate**, enforced server-side.
5. On success: CP reward from response, celebration overlay, course data reloaded; next room navigated or bootcamp overview returned.

**Next room / phase unlock:** after completion, `RoomCompletionCelebration onClose` navigates to the next room (`:300-306`) unless locked (`lockedRooms`). Phase/room unlock state comes from `apiCourse` (`mod.locked`, `apiRoom.locked`). Routing supports both new `phases/:phaseId/rooms` and legacy `modules/:moduleId/rooms` + redirects.

**Notes:** each step renders `StepNotes` when `notesStorageKey` is given (`StepRenderer.tsx:59-63`); text stored in localStorage key `step_notes_${...}` (`StepNotes.tsx:17,24`).

**Issue reporting:** `ReportIssueModal` posts to `/student/report-issue`.

**Terminal/simulation vs steps:** Bootcamp **room pages do not render a terminal or simulation** — they are purely reading/quiz. Terminals appear only in **labs** via `WalkthroughLayout`/`InternalTerminal`, and the **global** `InternalTerminal` is mounted on every walkthrough page (`StudentLayout.tsx:93-99`) with a context (`{type:'bootcamp'|'course'|'lab', ids}`) that injects a fake VFS. The terminal is decorative/simulated and **not wired to step completion**.

---

## 4. Courses (`/dashboard/courses/:courseId`)

**Source of truth: static frontend only.** `COURSES` array (`courseData.ts:49-62`) imports 12 course objects from `courses/*.ts`. No content API. The only backend calls are CP purchase/balance (`/cp/transactions`, `/cp/balance`, `/cp/purchase-course`).

**Structure:** flat `Course { id, ..., lessons: Lesson[], learningObjectives, skillLevel, cpCost }` (`courses/types.ts:41-55`). No modules. 12 courses, 8–12 lessons each. `prerequisites` exists but is **not enforced**. `UserCourseProgress` type exists but is unused (raw localStorage JSON is used instead).

**Lesson page:** single long scroll; all lessons rendered in one `.space-y-4` stack (`CourseLessonPage:305-320`), each wrapped in `StepRenderer` with `id="lesson-N"`. Navigation (`?lesson=` param, `LearningNav`, arrow keys, `scrollToLesson`) **scrolls the page**, never routes.

**Progress / completion:** entirely **client-side localStorage** key `qyvora_course_progress_${courseId}` storing `{ completedLessons: string[], lastLesson }` (`CourseLessonPage:100-163`). Clicking "Complete Lesson" adds the lesson id. `progress = completedCount/totalLessons`. `allComplete` triggers a cosmetic `CelebrationModal` (`useCelebrationTrigger(allComplete)`, `:131-132`). **No backend record, no CP reward, no certificate, no gate.**

**Access:** locked unless the course id appears in `/cp/transactions` purchases. This check is copy-pasted in `CourseLessonPage:110-118`, `MyCoursesPage:37-43`, `CoursesCarousel:52-58`, `CoursePurchaseModal:57-63`.

**Quizzes:** inline `InlineQuiz` (client-graded, pass≥70, unlimited retry) — **no `onComplete` wiring**, so no effect on progress (`CourseLessonPage:75-82`, `InlineQuiz.tsx:67`). **No graded gate for courses** (contrast bootcamps).

**Shared primitives:** same `StepRenderer`/`LearningNav`/`LearningToolbar`/`WalkthroughScrollControls`/`useRoomSession`/`EducationalMarkdownRenderer` as bootcamps/labs — only the data + progress layers differ.

---

## 5. Bootcamp (`/dashboard/bootcamps/:bootcampId` + `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId`)

- **Config location:** `bootcampConfig.ts` (full populated `BOOTCAMP_CONFIG`) + `bootcampStructure.ts` (types + a metadata-only config with empty steps). Both re-export types. The light `bootcampStructure` is used by nav/listing components (`PhaseSection.tsx`); `BootcampRoomPage` uses the populated `bootcampConfig`.
- **Phases are hardcoded** (5 phases). **Rooms are hardcoded** (4+5+4+5+3 = 21 rooms). **Step content is static** markdown + images + inline quizzes in the config.
- **Backend overrides:** the backend does NOT override step *content*, but it DOES override **progress/enrollment/lock state** via `GET /student/course?bootcampId=` (returns `modules[].rooms[].{completed,locked}`) and `GET /student/overview`.
- **Room progress retrieval:** `useStudentOverview` → `/student/overview` (`modules[].roomsCompleted`), plus `GET /student/course` for per-room locks/completions.
- **Room completion recording:** `POST /student/modules/:phaseNum/rooms/:backendRoomId/complete`. Room id maps to `phaseNum*100 + roomNum` (e.g. phase2/room3 → 203) — `BootcampRoomPage:118`.
- **Phase/bootcamp progress:** from overview `modules[].progress`, `roomsCompleted`, `roomsTotal` (`bootcamp-course/PhaseSection.tsx`, `BootcampCoursePage/index.tsx`). Approximated client-side if only counts are available (`skillRegistry.ts:251-253`).
- **Completion semantics:** room = quiz passed + server mark. Phase = all its rooms completed. Bootcamp = `overview.bootcampStatus` (server).
- **Prerequisites:** linear — `lockedRooms` derived from `mod.locked`; bootcamp overview groups rooms per phase. Revisiting completed content is allowed (steps re-render; "Got It"/viewed state is per-session).

---

## 6. Rooms

A bootcamp **room** is a route-scoped page rendering one room's steps. Covered in detail in §3. Key points: all steps mounted at once; single long scroll; `?step=` param drives the active step; room header replaces the step cards only at step 0 (`BootcampRoomPage:383-384`); progress bar = `viewed/size`; server session opened on mount (`session-open`); completion server quiz-gated.

---

## 7. Labs and Missions

### Labs
- **Definition:** route-scoped attack labs (`/dashboard/labs/{privesc,passwords,sql-injection,osint,kill-chain}`), defined in `constants/labs.ts`. Each has multiple scenarios (static frontend data in `simulations/*.ts`).
- **Entry:** `LabsPage` listing → `LabCard` (shows completed via localStorage) → scenario → `LearningAccordion` listing or `WalkthroughLayout` walkthrough.
- **Rendering:** `LabPage` shell → `WalkthroughLayout` → `WalkthroughStep[]` (all mounted). `SimulationPanel`/`InternalTerminal` for the simulated environment.
- **Input/success:** `FlagInput` → `POST /student/labs/verify-flag` (`lab.service.ts:35`) — **flags never ship in the bundle; server verifies**.
- **Completion:** `markLabCompleted(scenarioId)` → localStorage `qyvora_lab_progress` (`labProgress.ts`), keyed by scenario id with `{completed, completedAt, hintsUsed}`.
- **Progress:** dual — server verifies flags and tracks connection progress (`useLabConnection` → `/student/labs/connections|connect|disconnect|progress`), client localStorage records completion for UI.
- **CP:** labs award CP (per-scenario `cpReward`), some advanced scenarios cost CP to unlock (`useLabAccess` → `/cp/purchase-lab`, `labAccess.ts ADVANCED_LAB_COSTS`).
- **Independence:** labs are **not** connected to room/course progress or mission verification client-side (only loosely via mission `actionType: 'lab_flag'` routing to `/dashboard/labs`).
- **Simulated Terminal:** fully in-browser VFS + ~100 fake command handlers (`engine/commands.ts`, `engine/state.ts`). `injectLabContent`/`injectCourseContent`/`injectBootcampContent` populate VFS per context. IP discovery via `qyvora:ip-discovered` events feeds the simulation layer.

### Missions
- **Definition:** daily mission + weekly operation, **entirely server-driven** from `GET /student/engagement` (`useEngagement.ts`), typed in `data/missions/types.ts` (`MissionTemplate actionType: 'lab_flag'|'course_quiz'|'standalone_check'`, `WeeklyOperation` with per-step CP rewards).
- **Not local data models** — the server decides which mission a user gets; frontend only renders `DailyMissionCard`/`WeeklyOperationCard`.
- **Progress/completion:** server-side only (status `not_started|in_progress|completed`, `cpAwarded`, `weeklyProgress`). No localStorage.
- **Rewards:** CP (`cpReward`, `cpAwarded`, per-step weekly CP).
- **Integration:** `actionType` routes the "Start" button to `/dashboard/labs` or `/dashboard/courses`. No frontend cross-check of mission↔lab/course completion (server logic).

---

## 8. Quizzes and Assessments

Two distinct quiz implementations, plus supporting gates:

1. **`InlineQuiz`** (`shared/components/courses/InlineQuiz.tsx`) — shared formative quiz:
   - Used by bootcamp steps (`StepCard`), course lessons (`CourseLessonPage`), and lab walkthroughs (`WalkthroughStep`).
   - One question at a time; client-graded; `passThreshold` default **70** (never overridden); unlimited retry.
   - `onComplete?.(passed, score)` is **never wired** anywhere — purely formative, no persistence, no gating, no reward.
   - Accessibility: option selection conveyed by colour only.

2. **`QuizModal`** (`bootcamp-room/QuizModal.tsx`) — the **room-grade graded quiz**:
   - Loads `ROOM_QUIZ_BANK[key=moduleId:roomId]` from `data/quizzes.ts` (fallback `FALLBACK_QUESTIONS`).
   - Posts answers to `POST /student/quiz` → `{ score, passed, reward }` — **server-graded**.
   - Pass → CP reward + `onPassed` → `markRoomComplete`. Fail → review + "Try Again".
   - Gated by `QuizGateModal` and by server `403 quiz_required`.
   - **Quiz data shape here is divergent**: `bootcamp-room/types.ts:24-29` uses `text` (no `explanation`), unlike the `question`+`explanation` shape in `courses/types.ts`, `InlineQuiz.tsx`, and `simulations/types.ts`.

**Assessment-related gating:**
- Bootcamp rooms: graded quiz gate (server-enforced). ✅
- Courses: **no gate** — inline quiz is formative only.
- Labs: no quiz gate; flag verification gates scenario completion.
- `CodePlayground` (course): fake runner expected-output check, **not wired to completion**.

**Quiz data duplication:** `QuizQuestion` defined 3× identically (`InlineQuiz.tsx:6`, `courses/types.ts:1`, `simulations/types.ts:3`) + a divergent 4th in `bootcamp-room/types.ts:24`.

---

## 9. Progress and Completion — Complete Map

| # | Concept | Source of truth | Stored | Updated | Read | Server/Client | Trigger | Depends on |
|---|---------|-----------------|--------|---------|------|---------------|---------|-----------|
| 1 | Bootcamp step **viewed** | React state | in-memory `viewedSteps` | `goToStep`, Complete | StepCard/RoomProgress | Client | scroll/jump/complete | — |
| 2 | Bootcamp step **"Got It"** | localStorage | `gotit_${phase}_${room}` | `handleGotIt` | StepCard | Client | button | — |
| 3 | Bootcamp room **completed** | Backend | DB (via `/student/.../complete`) | `markRoomComplete` | overview, /student/course, sidebar | **Server** | quiz passed + complete | graded quiz |
| 4 | Bootcamp phase/bootcamp progress | Backend | DB (overview) | server | PhaseSection, dashboard | **Server** | room completes | room completion |
| 5 | Course **lesson** completed | localStorage | `qyvora_course_progress_${course}` | `markComplete` (click) | CourseLessonPage, MyCourses, skillRegistry | Client | "Complete Lesson" | — |
| 6 | Course completed | derived (local) | — | — | CourseLessonPage celebration | Client | all lessons | lesson completes |
| 7 | Lab scenario completed | localStorage + server flag | `qyvora_lab_progress` + server | `markLabCompleted` | LabCard, skillRegistry | Client+Server | correct flag | flag verify |
| 8 | Mission/Weekly completed | Backend | DB (engagement) | server | DailyMissionCard, WeeklyOperationCard | **Server** | server | — |
| 9 | CyberPoints balance | Backend | DB | server (earn) / `/cp/purchase-*` | dashboard, cards, modals | **Server** | room/lab/mission/quiz | — |
| 10 | Xp/rank progression | Backend | DB | server | ProgressionPanel, dashboard | **Server** | server | — |
| 11 | Skills matrix | client projection | computed | on data change | SkillMatrix/Radar/Stats | Client | bootcamp/course/lab completion | bootcamp(server)+course/local+lab/local |
| 12 | Achievements | Backend (skill) + derivations | DB + computed | server | AchievementsSection, TrophyCabinet | Both | server/computed | completion |
| 13 | Streak | Backend | DB | server | dashboard, StreakIcon | **Server** | server | — |
| 14 | Leaderboard ranking | Backend (CP) | DB | server | leaderboard | **Server** | server | CP |
| 15 | Room session time | React state | in-memory `useRoomSession` | interval | RoomProgress/RoomHeader | Client | mount | — |
| 16 | Discovered IPs | localStorage | `qyvora_discovered_ips` | SimulationContext | sim layers | Client | terminal events | — |

**Overlapping representations:** "Step completed" (bootcamp, via viewed/all) vs "Got It" (separate) vs "Lesson completed" (course, click) vs "Lab completed" (flag) vs "Room completed" (server) vs "Mission completed" (server) vs "Course completed" (local) vs "Skill progress" (computed) — **eight distinct notions of "done" with no shared model.**

**Sources of truth are inconsistent:** bootcamps server-authoritative; courses localStorage-only; labs split (server flag + local record).

---

## 10. State and Persistence

**State management strategy** (no Zustand/Redux/React-Query — both installed but unused; AGENTS.md prohibits them):
- **React Context:** `AuthContext` (global user), `ThemeContext`, `ToastContext`, `SimulationContext` (lab simulation panels + IP discovery).
- **Module-level shared TTL caches:** `useStudentOverview` (20s), `useEngagement` (60s) — module-scoped `let sharedData/sharedTimestamp` to dedupe fetches.
- **Per-page `useState`:** most learning progress.
- **localStorage:** course progress, lab progress, terminal state, bookmarks, "Got It", notes, theme, language, CSRF/session hint, discovery, tour ack, data-saver, landing cache, community/popup.

**Complete learning localStorage keys:**
- `qyvora_course_progress_${courseId}` — course lesson progress (persists refresh/logout).
- `qyvora_lab_progress` — lab scenario completions (persists).
- `qyvora_terminal_lines` / `qyvora_terminal_state` — terminal session (cleared on logout).
- `gotit_${phase}_${room}` — step acknowledgements (persists).
- `hpb_bookmarks_${bootcampId}` — step bookmarks (persists).
- `step_notes_${...}` — per-step notes (persists).
- `qyvora_${courseId}_doodle` — RoomCard doodle (persists).
- `qyvora_discovered_ips` — sim discovery (persists).

**Refresh behavior:** auth restored via `/auth/me` (session hint); course/lab/bookmark/notes persisted; bootcamp room state re-fetched; viewed steps reset; terminal restored (walkthrough) but cleared on logout (`clearTerminalStorage`).

**Logout:** clears access/CSRF/session-hint and terminal storage; **course progress, lab progress, bookmarks, notes, theme, language persist across logout** (per-user localStorage not cleared).

---

## 11. Shared Learning Components

| Component | Purpose | Used By | Inputs | State | Reusable | Duplicated? |
|---|---|---|---|---|---|---|
| `StepRenderer` | Section shell (header + children + notes + footer) | Bootcamp StepCard, Course lesson | stepNumber,title,children,notesKey,... | none | Yes | No |
| `StepNumberHeader` | Step badge/title/status/back | StepRenderer, RoomStep | number,title,isActive,isCompleted | none | Yes | No |
| `LearningNav` | Bottom Prev/Next/Complete | BootcampRoomPage, CourseLessonPage, WalkthroughLayout | currentStep,totalSteps,... | local | Yes | — |
| `LearningToolbar` | Fixed right / mobile float actions | BootcampRoomPage, CourseLessonPage, LabPage | actions[] | fullscreen/local | Yes | — |
| `WalkthroughScrollControls` | Scroll-up / scroll-down-viewport | BootcampRoomPage, WalkthroughLayout | — | scrollY | Yes | — |
| `WalkthroughSidebar` | Mobile-only chapter sidebar (spring) | RoomSidebar | sections,active/completed/locked | mobileOpen | Yes | No |
| `RoomSidebar` | Adapter: phases→sections | BootcampRoomPage | phases, rooms | local | No (bootcamp) | — |
| `InternalTerminal` | Compact terminal (dock/sheet) | StudentLayout | open,context | local | Yes | — |
| `TerminalWrapper` | Full terminal modal | StudentLayout | open,context,mode | local | Yes | — |
| `EducationalMarkdownRenderer` | Markdown→UI (sanitized) | StepCard, CourseLesson, WalkthroughStep, test | text | none | Yes | No (sole renderer) |
| `InlineQuiz` | Formative MCQ | StepCard, CourseLesson, WalkthroughStep | questions,onComplete | local | Yes | — |
| `StepNotes` | Collapsible per-step notes | StepRenderer | storageKey | localStorage | Yes | No |
| `CodePlayground` | Fake code runner | CourseLesson | initial,expected | local | limited | — |
| `LabPage` | Lab shell (listing/walkthrough) | lab pages | hero,listing,walkthrough | activeScenario | hybrid | — |
| `WalkthroughLayout` | Lab full layout (connection+sim+steps) | lab pages | header,steps,simulations | connection | Yes | — |
| `WalkthroughStep` | Lab step (objectives/hints/flag/reflection) | lab pages | mission,objectives,narrative,flag,quiz | local | lab-only | — |
| `LearningAccordion` | Expandable listing | lab pages | items | local | Yes | — |
| `LearningCard` | Card for lab/room listing | listing pages | data | none | Yes | — |
| `StepCard` | Bootcamp step + image + quiz + got-it/bookmark | BootcampRoomPage | step,stepNum,state,cbs | local | bootcamp | — |
| `SimulationPanel` | Tabbed simulation UI | WalkthroughLayout | simulations[] | local | Yes | — |
| `useRoomSession` | Timer + fullscreen | room/course/lab | — | local | Yes | — |

**Hidden design system:** the `shared/components/learning/*` + `walkthrough/*` families ARE a de-facto learning design system, but **`StepCard` is bootcamp-specific** and `WalkthroughStep` is lab-specific; courses use a bespoke `LessonViewer`. So the "system" is ~80% shared but each surface still has bespoke step wrapper + completion logic.

---

## 12. Content Renderer Inventory

| Renderer | File | Used for | Notes |
|---|---|---|---|
| `CodeBlockRenderer`/`EducationalMarkdownRenderer` | `courses/CodeBlockRenderer.tsx` | bootcamp/course/lab markdown | sole markdown renderer; sanitized; `normalizeProse` |
| `FencedCodeBlock` (bash tokenizer) | `CodeBlockRenderer.tsx` | code fences | hand-rolled tokenizer |
| `InlineCode` (copy chip) | `CodeBlockRenderer.tsx` | inline code | click-to-copy |
| `CodeBlock` | `shared/components/CodeBlock.tsx` | marketing/tool pages (Go/shell) | separate highlighter |
| `IdeBlock` | `shared/components/blog/IdeBlock.tsx` | blogs | simulated IDE panel |
| `OutputBlock` / `Terminal` | `shared/components/blog/` | blogs | decorative |
| `CodePlayground` | `courses/CodePlayground.tsx` | course lessons | fake runners |
| `SimulatedTerminal`/`TerminalShell` | `SimulatedTerminal/` | global + labs | VFS + fake commands |
| `SqlConsole`/`PasswordCracker` | `simulations/` | labs | fake interactive consoles |

**Sanitisation:** `EducationalMarkdownRenderer` uses tightened `rehypeSanitize` schema + `isSafeUrl`; no `dangerouslySetInnerHTML`. Only `BrowserSimulation` and `Identicon` use DOMPurify.

---

## 13. Routing (Learning)

| Route | Page | Learning components | Data | Progress |
|---|---|---|---|---|
| `/dashboard/bootcamps` | redirect → bc id | — | — | — |
| `/dashboard/bootcamps/:bootcampId` | `BootcampCoursePage` | PhaseSection, RoomCard, PhaseHero | BOOTCAMP_CONFIG + overview | server |
| `/dashboard/bootcamps/:id/phases/:phaseId/rooms/:roomId` | `BootcampRoomPage` | StepCard[], LearningNav/Toolbar, QuizModal, RoomSidebar | bootcampConfig + /student/course | server (quiz-gated) |
| `/dashboard/bootcamps/:id/modules/:moduleId/rooms/:roomId` | `BootcampRoomPage` (legacy) | same | same | server |
| `/dashboard/courses` | `MyCoursesPage` | LearningCard list | COURSES + localStorage | local |
| `/dashboard/courses/:courseId` | `CourseLessonPage` | LessonViewer[], InlineQuiz, CodePlayground | COURSES | localStorage |
| `/dashboard/labs` | `LabsPage` | LabCard, LearningAccordion | LABS + labProgress | local |
| `/dashboard/labs/:labType` | Privesc/Password/Sql/Osint/KillChain | WalkthroughLayout, WalkthroughStep[], SimulationPanel | simulations/*.ts | flag(local) |
| `/dashboard/marketplace` | `MarketplacePage` | — | /cp/products | server |
| `/dashboard/networks` | `NetworksPage` | NetworkBuilder | — | — |
| `/dashboard/tools/*` | Ide/Terminal/NetworkViz | full-screen tools | — | — |
| `/dashboard/competitive`, `/dashboard/profile`, `/dashboard/settings`, etc. | gamification/profile | — | overview/profile | server |

**Duplicates/overlaps:** two bootcamp room route shapes (phases vs modules) both resolve to `BootcampRoomPage`; `/bootcamps`, `/courses/:id` legacy redirects; `/learn`→`/hpb`; `/leaderboard/all`→`/leaderboard`.

---

## 14. Data Sources (Source of Truth)

| Entity | Source | Where |
|---|---|---|
| Course structure/content | **Static frontend TS** | `data/courses/courses/*.ts`, `courseData.ts` |
| Course access | Backend CP transactions | `/cp/transactions` |
| Course progress | **localStorage** | `qyvora_course_progress_*` |
| Bootcamp structure/content | **Static frontend TS** | `constants/bootcampConfig.ts` |
| Bootcamp enrollment/lock/completion | Backend | `/student/overview`, `/student/course`, `/student/modules/.../complete` |
| Lab scenarios/content | **Static frontend TS** | `data/simulations/*.ts` |
| Lab flag correctness | Backend | `/student/labs/verify-flag` |
| Lab completion record | **localStorage** | `qyvora_lab_progress` |
| Daily mission / weekly op | Backend | `/student/engagement` |
| CP balance / rewards | Backend | overview, profile, /cp/* |
| Xp / rank / streak / leaderboard | Backend | overview, profile, /public/leaderboard |
| Skills matrix | **Client projection** | `skillRegistry.ts` (server + localStorage) |
| Discovered IPs | localStorage | `qyvora_discovered_ips` |
| Reviews/issue reports | Backend | `/student/report-issue` |

---

## 15. Duplication

Accidental/structural duplication (not refactored — documented):
1. **Two `BOOTCAMP_CONFIG` exports** — `bootcampStructure.ts` (empty steps, metadata) and `bootcampConfig.ts` (full). Intentional split (lightweight nav imports) but a footgun; both must stay in sync.
2. **`QuizQuestion` type** defined 3× identically + a divergent 4th shape.
3. **Three terminal-content injectors** (`bootcampContent.ts`, `courseContent.ts`, `labContent.ts`) writing similar VFS structures.
4. **Course access-check logic copy-pasted** in 4 components.
5. **Three hand-rolled syntax highlighters** (bash `FencedCodeBlock`, `CodeBlock` Go/shell, `IdeBlock`).
6. **Two toolbar-like components** — `LearningToolbar` (used) vs `WalkthroughToolbar` (dead, never imported; prohibited by AGENTS.md).
7. **Two quiz banks for bootcamp** — per-step inline quiz in `bootcampConfig.ts` vs room-grade `ROOM_QUIZ_BANK` (different shapes) — overlap of assessment purpose.
8. **Two completion models** across surfaces: server (bootcamp) vs localStorage (course) vs hybrid (lab).
9. **Blog renderers** are a separate but parallel prose stack to the learning renderer.

Most appears **accidental** (organic growth) rather than deliberate.

---

## 16. Coupling and Risk

- **`EducationalMarkdownRenderer`** — changed here affects bootcamp steps, course lessons, lab narratives simultaneously. Highest-leverage, highest-risk content component.
- **`StepRenderer` / `StepNumberHeader` / `LearningNav` / `LearningToolbar` / `WalkthroughScrollControls`** — consumed by all three surfaces; signature changes break all.
- **`bootcampConfig.ts` + `bootcampStructure.ts`** — duplicated configs must stay consistent or room lookup/rendering silently diverges.
- **`useStudentOverview` (module TTL cache)** — many components rely on it; changing its shape breaks bootcamp/dashboard/profile/skills.
- **`StudentLayout`** — globally mounts terminal/IDE/network tools and `InternalTerminal` on every walkthrough page; central to the "simulated" experience.
- **`skillRegistry.ts`** — couples bootcamp(server)+course(local)+lab(local) into one computed matrix; fragile if any data source changes.
- **`labProgress.ts` / `lab.service.ts`** — dual-track completion; changing one without the other breaks lab UI state vs server.
- **`profileDerivations.ts` / `AchievementsSection` / `TrophyCabinet`** — derive gamification visuals from profile; changes ripple to profile page, dashboard.

---

## 17. UX Audit (from the code)

### Before learning
- **Bootcamp:** dashboard → bootcamp overview (`BootcampCoursePage`) shows phases + room cards with lock/done state; room card → room page.
- **Course:** `MyCoursesPage` cards show progress + purchase lock; bought course → lesson page.
- **Lab:** `LabsPage` listing → `LearningAccordion` scenario list → pick a scenario → walkthrough.

### During learning
All surfaces are **single-page long scroll**: every step/lesson/scenario mounted; active step highlighted by colour; `LearningNav` shows `current+1/total` (mobile) and Prev/Next/Complete; jump menu/toolbar for non-adjacent jumps.

### After an activity
- Bootcamp room: quiz gate → complete → CP reward overlay → next room or overview.
- Course: click Complete per lesson → celebration modal on all complete; nothing persisted server-side.
- Lab: correct flag → step complete badge → scenario complete → CP reward overlay.

### Per-surface summary
| Surface | Before | During | After |
|---|---|---|---|
| Course | cards + purchase | long single-page lessons | celebration (local only) |
| Bootcamp | phase/room cards (lock state) | long single-page room, graded quiz | CP reward, next room, server record |
| Room | phase→room | single-page steps, quiz gate | next room / overview |
| Lab | scenario list | single-page walkthrough + sim | flag→CP reward, local record |
| Mission | daily/weekly cards | routed to labs/courses | server CP award |
| Simulation | within lab | terminal/sim panels | within-step |

---

## 18. Scrolling Analysis — Why it feels like reading documentation

The **long-scroll documentation feel is a direct consequence of architecture**, not styling:

1. **All steps mounted simultaneously.** `BootcampRoomPage/index.tsx:395` renders every `room.steps` in one `.space-y-8` vertical stack; `CourseLessonPage:305-320` renders every lesson in `.space-y-4`; lab pages mount all `WalkthroughStep`s. There is no per-step mount lifecycle, so the page length scales with content.

2. **Scroll is the navigation mechanism.** `goToStep` (`BootcampRoomPage:248-263`) and `scrollToLesson` (`CourseLessonPage:135-147`) perform `scrollIntoView` on a `step-N` / `lesson-N` id. Adjacent-step navigation scrolls rather than swaps view. `WalkthroughScrollControls` even implements "scroll down one viewport" (`window.scrollBy({top: window.innerHeight})`), reinforcing the "read down a document" model.

3. **Browser scroll position acts as implicit state.** The active step is only a highlight; the actual "current position" lives in the window scroll position plus the `?step=` / `?lesson=` param. There is no discrete content viewport that resets between steps.

4. **Progress is a function of scroll/viewing, not interaction.** `viewedSteps` is added on `goToStep`/scroll targets (`:254`); room progress bar = `viewed / total` (`RoomProgress`). "Got It" is a self-tag, not a comprehension gate. So completion is tracked by scrolling past steps, and the perception is "read these N sections."

5. **AGENTS.md codifies it:** "all walkthrough pages must render ALL step cards on a single page... The Next/Continue button scrolls to the next step card on the same page." This rule is the root architectural cause of the document-scrolling UX.

6. **A second scroll model existed** (section snap) that was removed for the landing/public pages but never re-introduced into learning pages — learning pages remain plain document scroll.

---

## 19. Mobile Learning Experience

- **Single long page** with all steps stacked (per the one-page rule); navigation by scroll + jump menu + `LearningNav`.
- **Sidebar is mobile-only** (`WalkthroughSidebar` is `md:hidden`; there is NO desktop chapter sidebar — desktop uses the toolbar + jump menu instead).
- **Terminal:** desktop = right dock; mobile = bottom sheet (`InternalTerminal`).
- **Toolbar:** desktop = fixed right; mobile = floating expandable panel.
- **Quiz:** centered Radix dialog on BOTH (no bottom-sheet), can be cramped on phones but usable.
- **Image lightbox:** mobile uses pinch/double-tap; desktop uses wheel/zoom buttons (buttons are 32px — under the 44px target).
- **Bottom-of-screen crowding:** `LearningToolbar` (bottom-right, `bottom-20`), `WalkthroughScrollControls` (bottom-left, `bottom-20`), terminal launcher (bottom-left, `bottom-4`), Dobia toggle (bottom-right) can overlap on short screens.
- **Long-scroll usability:** no sticky progress; `RoomProgress` only at the top.
- **Reduced motion** (see §A11y): several mobile animations not gated.

---

## 20. Accessibility

**Strengths:** skip link present (`StudentTopbar:203`, `Navbar:171`, `AdminTopbar:136`, `RoomTopBar:71`); `role="progressbar"` correct on 3 surfaces (CourseLessonPage, InlineQuiz, RoomProgress); Radix `Dialog`/`DialogContent` provide focus trap + Escape + `aria-describedby` across `QuizModal`/`QuizGateModal`/`StepJumpMenu`; `CelebrationModal` has custom focus trap + Escape + `aria-modal`; step images have verbose alt + dimensions + lazy loading; touch targets ≥44px on core step/toolbar controls.

**Weaknesses:**
- `ImageLightbox` (hand-rolled): **no focus trap, no Escape-to-close**, background not inert (`ImageLightbox.tsx:14-171`).
- Quiz option selection conveyed **by colour only** — no `aria-pressed`/`aria-checked`; quiz result not `aria-live` (`QuizModal:106,218`, `InlineQuiz:147`).
- Terminal output not `role="log"`/`aria-live` (`TerminalShell:576-609`).
- **Hardcoded English ARIA labels** (not i18n): `StepImage:62`, `ImageLightbox:97,105,116,136`, `WalkthroughSidebar:142`, `TerminalShell:550,558,633`, `CourseLessonPage:299`.
- **Low contrast:** code comments `text-text-muted` @40% on near-black (`CodeBlockRenderer:99` + `index.css:40`) ~2.4:1; code line numbers at 30% opacity.
- `QuizModal` correct/wrong colours use raw `green-500`/`red-500` (design-token mismatch per AGENTS.md).
- **Reduced-motion gaps:** `CourseLessonPage` smooth scroll always smooth; `CelebrationModal` spring/BURST not gated; `WalkthroughSidebar`/`ImageLightbox`/`InternalTerminal`/Dialog CSS animations not gated.
- Below-44px touch targets: ImageLightbox controls (32px), WalkthroughSidebar close (32px) & nav items (~36px), StepJumpMenu items (~40px), small quiz buttons.

---

## 21. Testing

**24 test files exist** across the repo. **Learning-relevant coverage:**
- `EducationalMarkdownRenderer.test.tsx` — content rendering + sanitisation (only course/lesson content test).
- `SimulatedTerminal/engine/` — parser, filesystem, handlers (well covered).
- `simulations/*/__tests__` — scenario **data shape** (privesc/password/osint/kill-chain/sqli).
- `labs/__tests__/LabsPage.test.tsx`, `LabCard.test.tsx` — lab listing/card UI.
- `ScenarioCard.test.tsx` — lab scenario card.
- Onboarding/tour/popup/toast/error-boundary/empty-state/security/schema/cn — supporting UI.

**Gaps (no tests):** Bootcamp room progression (`goToStep`, viewed/current, query-param sync, `Next/Prev/Complete`), Course lesson progression + persistence + resume, **both quiz systems** (bank fetch, pass/fail, reward, `quiz_required` gate), room completion/celebration/focus-trap/Escape, bookmarks/"Got It"/notes persistence, `LearningNav`/`LearningToolbar`/`WalkthroughScrollControls`, mobile sidebar/toolbar/terminal switching, reduced-motion branches, keyboard/focus/a11y, simulation integration, `useRoomSession`/`useLabScenario`/`useLabConnection`/`useStudentOverview` hooks.

**Bottom line:** the content **renderer** and terminal **engine** are tested; the **interactive learner experience is essentially untested.**

---

## WHAT WE SHOULD PRESERVE

(Every system below was discovered in the repo and must survive a redesign.)

1. **Shared Markdown pipeline** — `EducationalMarkdownRenderer`/`CodeBlockRenderer` + `normalizeProse` + sanitisation.
2. **Shared learning primitives** — `StepRenderer`, `StepNumberHeader`, `LearningNav`, `LearningToolbar`, `WalkthroughScrollControls`, `useRoomSession`.
3. **Bootcamp server-side progress + graded quiz gate** (`/student/modules/.../complete`, 403 `quiz_required`) — the strongest, most correct progress model.
4. **CyberPoints system** (earn via rooms/labs/missions/weekly, spend on labs/marketplace) and all its endpoints.
5. **Xp/rank progression** (server-authoritative, `profile.ts` forbids hardcoding ranks).
6. **Skill matrix + achievements + trophies** (computed visuals).
7. **Streaks + leaderboard** (backend-driven).
8. **Daily mission / weekly operation** (server-driven `EngagementResponse`).
9. **Lab flag verification** (server-side, flags never in bundle) + `useLabConnection` connection model.
10. **SimulatedTerminal/VFS engine** (in-browser, well-tested) + injectors.
11. **Bookmarks, "Got It", per-step notes** (localStorage).
12. **`RelatedContent`/`topicMap`** cross-linking (courses↔labs↔HPB rooms).
13. **Legacy route compat** (phases/modules room forms, `/courses/:id`, `/learn`, etc.).
14. **Course purchase/access** via `/cp/transactions`.

---

## WHAT WE SHOULD NOT TOUCH YET

- **`bootcampConfig.ts` ↔ `bootcampStructure.ts` coupling** — duplicated configs; changing one without the other silently breaks room rendering/lookup. Needs a consolidation decision first.
- **`skillRegistry.ts`** — bespoke 3-source projection with a first-N approximation heuristic; brittle.
- **`QuizQuestion` divergence** — different shapes across quiz surfaces; unify before touching quiz logic.
- **`useStudentOverview` module TTL cache** — many consumers; reshape with care.
- **Course access-check duplication** — copy-pasted in 4 places; refactor only with clear contract.
- **`StudentLayout` global tool mounting** — terminal/IDE/network globally mounted; any change affects every student page.
- **localStorage-only course progress** — no server backup; migrating requires a new endpoint + dual-write strategy.

---

## WHAT THE FUTURE REDESIGN NEEDS TO SOLVE

(Problems supported by the audit — no solution proposed here.)

1. **Excessive vertical scrolling** — every step mounted on one page; long rooms read as documents (`BootcampRoomPage:395`, `CourseLessonPage:307-320`).
2. **Weak content hierarchy** — active step is only a colour highlight; no strong signal of "where I am".
3. **Disconnected step transitions** — moving between concepts is natural scroll, not deliberate forward motion; no per-step viewport reset.
4. **Progress-as-scroll** — `viewedSteps` = scrolled-to; room progress = viewed/total; "Got It" is a non-deliberate self-tag.
5. **Fragmented completion models** — server (bootcamp) vs localStorage (course) vs hybrid (lab); a learner's "total learned" has no single truth.
6. **Inconsistent assessment gating** — bootcamps gate on graded quiz, courses gate on nothing (inline quiz unwired), labs gate on flag.
7. **Mobile learning** — long pages, sidebar behind hamburger, no swipe nav, bottom-screen control crowding, no sticky progress.
8. **Accessibility gaps** — colour-only quiz state, `ImageLightbox` no trap/Escape, low-contrast code comments, several reduced-motion gaps, hardcoded-English aria labels.
9. **Weak between-section transitions & interaction** — concepts are linearly listed with little connective interaction; `RelatedContent` exists but is at page bottom.
10. **Course completion credibility** — cosmetic-only; a redesign should reconcile with the serious bootcamp model.

---

## EXISTING SYSTEMS THAT A FUTURE DESIGN MUST INTEGRATE WITH

| Existing System | Current Implementation | Future Design Dependency | Risk |
|---|---|---|---|
| Bootcamp server progress + quiz gate | `/student/modules/.../complete`, overview, `/student/course` | Cannot decouple steps from this API | High — server contract |
| EducationalMarkdownRenderer | sole markdown renderer | Any new step layout must keep rendering | High — 3 consumers |
| LearningNav/Toolbar/ScrollControls/StepRenderer | shared walkthrough family | Re-use or replace uniformly | Med |
| useRoomSession | timer+fullscreen | keep if steps stay in one page | Low |
| SimulatedTerminal engine + injectors | VFS + fake commands | rebind terminal to new step layout | Med |
| Lab flag verification + connection model | `/student/labs/verify-flag`, connect/progress | keep server verification | High |
| CyberPoints earn/spend | overview, /cp/* | keep reward wiring | Med |
| Xp/rank/streak/leaderboard | server overview/profile/leaderboard | keep displays | Low |
| Missions (daily/weekly) | `/student/engagement` | keep routing to labs/courses | Med |
| Skill matrix/achievements/trophies | skillRegistry + derivations | keep computed visuals, fix projection | Med |
| Bookmarks / Got It / notes | localStorage keys | keep, possibly persist later | Low |
| topicMap/RelatedContent | cross-linking helpers | keep integration points | Low |
| Routes (phases+modules, legacy) | router.tsx | keep route compatibility | Med |

---

## Final Verdict

### 1. What is QYVORA's current learning architecture?
A **single-page long-scroll walkthrough model** spread across three independent vertical families — Bootcamp (server-persisted, quiz-gated), Courses (localStorage-persisted, no gate), Labs (server-verify flags + localStorage record) — sharing a common presentation layer (`StepRenderer`, `EducationalMarkdownRenderer`, `LearningNav`, `LearningToolbar`, `useRoomSession`) and a layered gamification system (CP, Xp/rank, skills, achievements, streaks) with a simulated in-browser terminal. There is no unified LMS model; each family has its own data types and progress semantics.

### 2. What is actually causing the scrolling/document-reading experience?
Five concrete architectural decisions: (a) all steps/lessons/scenarios are mounted simultaneously in a vertical stack (`BootcampRoomPage:395`, `CourseLessonPage:305-320`); (b) navigation is scroll-based (`scrollIntoView` on `step-N`/`lesson-N`, `WalkthroughScrollControls` scrolls by viewport height); (c) browser scroll position is treated as implicit state, with the active step only a highlight; (d) progress is computed from *viewing/scroll* (viewed/total) rather than deliberate interaction; and (e) the AGENTS.md "one page, all steps" rule codifies all of this.

### 3. Which parts are already strong?
The shared sanitized Markdown renderer; the coherent shared step/toolbar component family; the server-side quiz-gated bootcamp progress (the most robust model); the gamification layer (server-authoritative ranks/streaks, CP, achievements); the well-tested SimulatedTerminal engine; lab flag verification that keeps answers off the client; and the cross-linking `topicMap` system.

### 4. Which parts are fragmented or duplicated?
Progress/completion authority (server vs localStorage per surface); `QuizQuestion` (4 shapes); bootcamp config (2 files); course-access checks (4 copies); terminal content injectors (3); markdown/starter highlighters (3); two quiz banks for bootcamp; two completion models for labs; dead `WalkthroughToolbar`.

### 5. Which existing systems must absolutely be preserved?
Bootcamp server progress + graded quiz gate; the shared Markdown renderer; the shared learning component family; SimulatedTerminal; CyberPoints; Xp/rank; missions (daily/weekly); skills/achievements; streaks; leaderboard; lab flag verification; bookmarks/"Got It"/notes; routes and CP transactions.

### 6. What architectural constraints must a future redesign respect?
Keep the server API contracts for bootcamp progress/locks, lab flags/connections, engagement, overview, and CP. Keep the sole sanitized Markdown renderer and the shared walkthrough primitives (or replace them uniformly). Maintain route compatibility (phases+modules, legacy redirects). Preserve localStorage keys or migrate with dual-write. Keep server-authoritative ranks (no client rank derivation).

### 7. What information do we now have that we did NOT know before?
- Bootcamp step *content* is duplicated across `bootcampStructure.ts` (empty) and `bootcampConfig.ts` (full) — a real divergence hazard.
- Course completion is purely cosmetic (localStorage) with no backend record, reward, or gate — significantly weaker than bootcamps.
- "Got It", bookmarks, and viewed-steps have **no effect on progression**; only the room-level graded quiz and the server `complete` call advance a bootcamp.
- Course arrow-key navigation exists at page level but bootcamp lacks it; labs have none; no swipe anywhere in learning.
- The `SkillMatrix` is a brittle client projection mixing 3 data sources with a first-N approximation.
- `WalkthroughToolbar` is dead code; `LearningToolbar` is the sole toolbar.
- The connection model (`useLabConnection`) is real (backend tracks connections/progress) while the terminal itself is fully simulated.
- localStorage course/lab progress survives logout (per-user data not cleared).
- Interactive learning flows (rooms, steps, quizzes, progress, completion, focus/keyboard, reduced-motion, persistence) have **no automated test coverage**.

*This audit is descriptive only. No source files were modified. A separate design/architecture phase should follow based on these findings.*
