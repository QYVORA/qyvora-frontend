# Learning Content Architecture Audit — Phase 1

> **Status:** ✅ AUDIT COMPLETE  
> **Date:** Current  
> **Purpose:** Repository audit before V2 semantic learning block refactor

## Executive Summary

The current QYVORA learning system is built around a **Markdown-driven walkthrough model** with surface-specific rendering (labs, courses, bootcamp). The system works but treats educational content primarily as styled documentation rather than structured learning experiences.

### Current Mental Model

```
Markdown document
    ↓
Generic renderer (EducationalMarkdownRenderer)
    ↓
Surface-specific wrapper (WalkthroughStep / StepCard / LessonViewer)
    ↓
Optional interactive elements (quiz, flag, command)
```

### Target Mental Model (V2)

```
Semantic Learning Blocks
    ↓
Learning Block Renderer
    ↓
QYVORA UI Components
    ↓
Surface-agnostic presentation
```

---

## 1. Current Learning Surfaces

### 1.1 Hacker Protocol Bootcamp (HPB)

**Routes:**
- Public: `/hpb` (HpbPage)
- Student: `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId`

**Components:**
- `StepCard.tsx` — bootcamp step renderer
- `StepRenderer.tsx` — shared step chrome
- `FocusedStepList.tsx` — focused step presentation
- `LearningNav.tsx` — Previous/Next navigation
- `LearningWorkspaceShell.tsx` — page shell
- `QuizModal.tsx` — room completion quiz
- `ReportIssueModal.tsx` — content feedback

**Data Model:**
```typescript
interface BootcampStep {
  title: string;
  instruction: string;  // GitHub Flavored Markdown
  image: string | null;
  quiz?: QuizQuestion[];
}
```

**Content Storage:**
- `src/features/student/constants/bootcampConfig.ts` (4028 lines)
- 5 phases, 18 rooms, ~100+ steps total
- Markdown strings mixed with optional quiz data

**Rendering Path:**
```
BootcampRoomPage
  ↓
FocusedStepList (active step expanded)
  ↓
StepCard
  ↓
StepRenderer (step chrome: number header, status)
  ↓
EducationalMarkdownRenderer (GFM → React)
  ↓
StepImage (optional)
```

**Progress Model:**
- Steps marked "viewed" when scrolled past
- Rooms complete when all steps viewed
- Final room quiz gates completion
- Per-step inline quizzes are optional self-checks (not gates)

---

### 1.2 Attack Labs

**Routes:**
- Landing: `/dashboard/labs`
- Lab: `/dashboard/labs/:labId`
- Walkthrough: labs implement focused-step walkthrough inline

**Components:**
- `WalkthroughLayout.tsx` — two-panel layout (narrative + simulation)
- `WalkthroughStep.tsx` — lab step with mission/objectives/evidence/flag
- `FocusedStepList.tsx` — shared with bootcamp
- `LearningNav.tsx` — shared navigation
- `StepParts.tsx` — CommandBlock, FlagInput, StepComplete

**Data Model:**
```typescript
interface WalkthroughStepProps {
  stepIndex: number;
  title: string;
  narrative: string;
  hint?: string;
  progressiveHints?: ProgressiveHintLevel[];
  commandInstruction?: string;
  mission?: string;
  objectives?: string[];
  evidence?: string[];
  reflection?: string;
  quiz?: QuizQuestion[];
  flagId: string;
  onFlagSubmit: (stepId: string, flag: string) => Promise<{correct: boolean}>;
}
```

**Content Storage:**
- `src/features/student/data/simulations/` (multiple scenario files)
- 5 labs: privesc, passwords, sql-injection, osint, kill-chain
- More structured than bootcamp but still Markdown-heavy in narrative

**Rendering Path:**
```
PrivescLab (or similar)
  ↓
FocusedStepList
  ↓
WalkthroughStep
  ↓
Mission card
  ↓
Objectives stepper
  ↓
EducationalMarkdownRenderer (narrative)
  ↓
Evidence panel
  ↓
CommandBlock
  ↓
Progressive hints
  ↓
InlineQuiz
  ↓
FlagInput (completion gate)
```

**Progress Model:**
- Flag submission is the checkpoint
- No "viewed" tracking — must solve to progress
- Debrief steps exist but aren't consistently locked

---

### 1.3 Courses

**Routes:**
- Catalog: `/dashboard/courses`
- Course: `/dashboard/courses/:courseId`
- Lesson: `/dashboard/courses/:courseId/lessons/:lessonIndex`

**Components:**
- `CourseLessonPage.tsx` — lesson viewer
- `EducationalMarkdownRenderer` — markdown rendering
- `InlineQuiz.tsx` — optional self-check
- `CodePlayground.tsx` — interactive code editor
- `LearningNav.tsx` — shared navigation

**Data Model:**
```typescript
interface CourseLesson {
  id: string;
  title: string;
  content: string;  // Large Markdown document
  estimatedMinutes: number;
  quiz?: QuizQuestion[];
}
```

**Content Storage:**
- `src/features/student/data/courses/` (multiple course files)
- 12 courses across 6 categories
- Very large Markdown strings (1000+ lines in some lessons)

**Rendering Path:**
```
CourseLessonPage
  ↓
EducationalMarkdownRenderer (full lesson content)
  ↓
Optional CodePlayground
  ↓
Optional InlineQuiz
  ↓
Complete button (no requirement to interact)
```

**Progress Model:**
- Lessons marked complete by user action (free Complete button)
- No validation that content was read or understood
- Quiz is optional self-check, not a gate

---

## 2. Current Shared Components

### 2.1 FocusedStepList

**Purpose:** Focused-step presentation — only active step expanded, others collapsed.

**Usage:** HPB rooms, Lab walkthroughs

**Architecture:**
```typescript
interface FocusedStepListItem {
  index: number;
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked?: boolean;
}
```

**Key Insight:** This is a **presentation pattern**, not a content model. It solves the "how to show steps" problem, not the "what is a learning unit" problem.

**V2 Decision:** Keep FocusedStepList as a **page-level progression mechanism**, but it should render semantic learning blocks, not be the definition of content.

---

### 2.2 EducationalMarkdownRenderer

**Location:** `src/shared/components/courses/markdown/CodeBlockRenderer.tsx`

**Purpose:** Render GFM → styled React components

**Features:**
- Syntax highlighting via `FencedCodeBlock`
- Inline code via `InlineCode`
- Typography components (Heading, paragraph, lists)
- Sanitization (rehype-sanitize)
- Tables, blockquotes, horizontal rules
- Safe URL checking

**Insight:** This is a **presentation layer**. It doesn't understand learning semantics — it just makes Markdown pretty.

**V2 Decision:** Keep as a fallback for legacy Markdown text blocks, but new content should use semantic blocks instead of authoring everything as Markdown.

---

### 2.3 LearningNav

**Purpose:** Previous/Next navigation with step counter

**Usage:** All walkthrough surfaces

**V2 Decision:** Keep as-is. Navigation is orthogonal to content architecture.

---

### 2.4 StepRenderer / StepNumberHeader

**Purpose:** Step chrome (number badge, title, status label)

**Usage:** Bootcamp rooms, shared infrastructure

**V2 Decision:** Absorb into new semantic block rendering. Step numbering is page-level presentation, not block-level.

---

## 3. Current Content Model Problems

### 3.1 Everything Is Markdown

**Problem:**
```markdown
# SQL Injection Basics

SQL injection happens when...

Run this command:
```bash
sqlmap -u "http://target.com"
```

**Think:** What does the `-u` flag do?

Now try it yourself!
```

**Issues:**
- Author must manually structure learning flow in prose
- No semantic distinction between explanation vs instruction vs question
- Renderer can't adapt presentation based on content type
- Hard to enforce pedagogical patterns
- Can't easily add new interaction types without Markdown extensions

---

### 3.2 Duplication Across Surfaces

**Bootcamp StepCard:**
- Renders `instruction` Markdown
- Optional image
- Optional quiz

**Lab WalkthroughStep:**
- Mission card
- Objectives stepper
- Narrative Markdown
- Evidence panel
- Command block
- Progressive hints
- Quiz
- Flag input

**Course Lesson:**
- Large Markdown document
- Optional playground
- Optional quiz

**Problem:** Each surface reinvents the wheel. A "command to run" in bootcamp is plain Markdown. In labs it's a `CommandBlock`. Courses have neither.

**V2 Goal:** All surfaces should use the same learning primitives.

---

### 3.3 No Pedagogical Enforcement

**Current:** Author can write a 500-line Markdown wall with no structure.

**Result:** Some lessons are well-structured, others are documentation dumps.

**V2 Goal:** Content model encourages/enforces pedagogical best practices:
- Start with context/mission
- Build mental models
- Show evidence
- Provide practice
- Check understanding
- Debrief

---

## 4. Existing Tests

### 4.1 WalkthroughStep.test.tsx

**Tests:**
- Step rendering
- Flag submission flow
- Progressive hints
- Mission/objectives display
- Evidence panel
- Reflection display

**Status:** 6 tests, all passing

**V2 Impact:** These tests prove behavioral requirements. Must maintain equivalent functionality in new architecture.

---

## 5. API Integration Points

### 5.1 Progress Tracking

**Endpoints (inferred from context):**
- `POST /student/bootcamp/room/progress` — mark step viewed
- `POST /student/lab/flag` — submit flag
- `POST /student/course/lesson/complete` — mark lesson complete
- `POST /student/quiz` — submit quiz answers

**V2 Requirement:** New content model must not break existing API contracts.

---

### 5.2 Quiz System

**Current:** `QuizQuestion` interface used across surfaces

```typescript
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}
```

**V2 Decision:** Keep quiz format, integrate as a semantic block type.

---

## 6. Identified Patterns for V2

### 6.1 Semantic Block Types (Initial List)

Based on current content and pedagogical requirements:

**Narrative Blocks:**
- `TextBlock` — plain explanation
- `ObjectiveBlock` — learning outcomes
- `MissionBlock` — student goal/task
- `ConceptBlock` — key idea highlight
- `DebriefBlock` — post-activity explanation
- `RecallBlock` — summary for retention

**Interactive Blocks:**
- `CommandBlock` — terminal command with explanation
- `HttpBlock` — HTTP request/response
- `CodeBlock` — code snippet with syntax highlighting
- `ComparisonBlock` — before/after, vulnerable/safe
- `DiagramBlock` — mental model visualization

**Evidence Blocks:**
- `ObserveBlock` — show students what to notice
- `EvidenceBlock` — terminal/log output
- `ThinkBlock` — reasoning question

**Practice Blocks:**
- `DoBlock` — action instructions
- `CheckpointBlock` — quiz/flag/validation
- `ChallengeBlock` — reduced-scaffolding task
- `LabBlock` — lab handoff
- `HintBlock` — progressive hints

---

### 6.2 Current vs V2 Mapping

| Current | V2 Block Type |
|---------|---------------|
| Markdown prose | `TextBlock` or appropriate semantic type |
| Mission card (labs) | `MissionBlock` |
| Objectives stepper | `ObjectiveBlock` |
| Evidence panel | `ObserveBlock` + `EvidenceBlock` |
| Command instruction | `CommandBlock` |
| Reflection | `DebriefBlock` |
| Progressive hints | `HintBlock` |
| Quiz | `CheckpointBlock` (type: quiz) |
| Flag input | `CheckpointBlock` (type: flag) |
| Markdown headings | Could be `ConceptBlock` |

---

## 7. Migration Strategy

### 7.1 Phase Order (from prompt)

1. **Audit** ← WE ARE HERE
2. **Architecture** — types, renderer, block registry
3. **UI** — new learning visual language
4. **HPB Pilot** — migrate one room
5. **Iterate** — add missing primitives
6. **HPB Migration** — all rooms
7. **Courses** — adapt course content
8. **Labs** — integrate lab-specific features
9. **Cleanup** — remove obsolete code

---

### 7.2 Backward Compatibility Requirements

**Must Not Break:**
- Existing routes (`/dashboard/bootcamps/:bootcampId/...`)
- Progress tracking APIs
- Quiz submission
- Flag verification
- Lab connections
- Deep links
- SEO metadata
- Images
- Existing tests (must pass or be updated with equivalent behavior)

**Migration Path:**
- Old renderer can remain behind adapter during transition
- New content uses new semantic renderer
- Gradual migration per surface

---

### 7.3 HPB Pilot Selection Criteria

Choose a room with:
- ✅ Narrative text
- ✅ Images
- ✅ Commands (currently plain Markdown)
- ✅ Practical instructions
- ✅ Optional inline quiz
- ✅ Moderate length (not too simple, not too complex)

**Candidate:** Phase 3, Room 1: Linux Fundamentals (diverse content types)

---

## 8. Component Dependencies

### 8.1 Current Imports

**Bootcamp:**
- `BootcampRoomPage` → `FocusedStepList`, `StepCard`, `LearningNav`
- `StepCard` → `StepRenderer`, `EducationalMarkdownRenderer`, `StepImage`

**Labs:**
- `PrivescLab` → `WalkthroughLayout`, `WalkthroughStep`, `FocusedStepList`
- `WalkthroughStep` → `CommandBlock`, `FlagInput`, `InlineQuiz`, `EducationalMarkdownRenderer`

**Courses:**
- `CourseLessonPage` → `EducationalMarkdownRenderer`, `InlineQuiz`, `CodePlayground`

**V2 Impact:** Need to trace all imports to ensure no breaking changes.

---

## 9. Design System Compliance

### 9.1 Current Patterns (from AGENTS.md)

**Typography:**
- Walkthrough text: `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]`
- Headings: `font-black uppercase tracking-tight`
- No `leading-relaxed` on narrative

**Layout:**
- Full viewport width (no `wc-prose` constraint on main text)
- Command blocks use `wc-code` / `wc-terminal`
- Cards: `rounded-2xl`
- Compact padding: `px-3 py-1.5` header, `px-3 py-2` body

**Motion:**
- `ScrollReveal` for reveals
- `prefers-reduced-motion` respect (three layers)

**Accessibility:**
- `min-h-[48px]` interactive elements
- `role="button"` needs `aria-label` + Enter/Space
- Focus-visible: accent outline
- No scroll hijacking on interactions

**V2 Requirement:** All new blocks must follow these patterns.

---

## 10. Key Files to Create

### Phase 2 (Architecture):

```
src/shared/learning/
├── types/
│   ├── index.ts
│   ├── blocks.ts
│   ├── content.ts
│   └── progress.ts
├── renderer/
│   ├── LearningContentRenderer.tsx
│   ├── LearningBlockRenderer.tsx
│   └── index.ts
├── blocks/
│   ├── index.ts
│   ├── TextBlock.tsx
│   ├── ObjectiveBlock.tsx
│   ├── MissionBlock.tsx
│   ├── ConceptBlock.tsx
│   ├── CommandBlock.tsx
│   ├── ObserveBlock.tsx
│   ├── ThinkBlock.tsx
│   ├── DoBlock.tsx
│   ├── CheckpointBlock.tsx
│   ├── HintBlock.tsx
│   ├── ChallengeBlock.tsx
│   ├── LabBlock.tsx
│   ├── DebriefBlock.tsx
│   └── RecallBlock.tsx
└── utils/
    ├── blockRegistry.ts
    └── contentAdapter.ts
```

---

## 11. Critical Design Decisions

### 11.1 DO NOT Copy Current Walkthrough UI

**Rule:** Existing components are **behavioral** reference, not **visual** reference.

**Bad:** Rename `WalkthroughStep` → `LearningUnit`, add more props, ship it.

**Good:** Design new semantic block components from scratch following QYVORA design system.

---

### 11.2 Width Constraints

**Rule:** Learning text uses full viewport width (like blog), not `wc-prose`.

**Code blocks:** Use `wc-code` / `wc-terminal`  
**Diagrams:** Use `wc-diagram`  
**Reading text:** Use `max-w-none` (full width)

---

### 11.3 No Card Soup

**Bad:**
```
<Card><Concept /></Card>
<Card><Observation /></Card>
<Card><Command /></Card>
<Card><Practice /></Card>
```

**Good:** Use typography, spacing, rules, semantic interruptions. Cards only where semantically appropriate (missions, checkpoints, hints).

---

### 11.4 FocusedStepList Role

**Decision:** Keep as a **page-level navigation component**, not the content definition.

```
LearningWorkspace
    ↓
FocusedStepList (progression UI)
    ↓
LearningUnit (contains semantic blocks)
        ↓
    LearningContentRenderer
        ↓
    [MissionBlock, ConceptBlock, CommandBlock, ...]
```

---

## 12. Risk Assessment

### High Risk:
- Breaking existing progress tracking
- Breaking quiz/flag submission
- Breaking deep links
- Breaking SEO

### Medium Risk:
- TypeScript type breakage across surfaces
- Test failures
- Performance regression (re-rendering)

### Low Risk:
- Visual differences (expected, intentional)
- Animation changes
- Mobile layout shifts

---

## 13. Success Criteria

### Architecture:
✅ Learning content is semantic, not presentation-driven  
✅ HPB, courses, labs share the learning renderer  
✅ New block types can be added without modifying every page

### UX:
✅ Experience no longer feels like documentation  
✅ Students understand what they're learning and why  
✅ Visual distinction between explanation, observation, action, assessment  
✅ Interface encourages reasoning, not passive scrolling

### UI:
✅ Fits QYVORA design system  
✅ NOT a reproduction of current WalkthroughStep  
✅ No card soup  
✅ No decorative nonsense

### Content:
✅ Lessons can express Mission, Objective, Concept, Mental Model, Observe, Think, Do, Checkpoint, Challenge, Lab, Debrief, Recall

### Engineering:
✅ TypeScript strict  
✅ Routes work  
✅ Progress works  
✅ Quizzes work  
✅ Flags work  
✅ Labs work  
✅ Tests updated and passing  
✅ `npm run typecheck` passes  
✅ `npm run lint` passes  
✅ `npm run build` passes

---

## 14. Next Steps (Phase 2)

1. Create type definitions in `src/shared/learning/types/`
2. Implement LearningBlockRenderer dispatch logic
3. Create base semantic block components
4. Wire up block registry
5. Test with sample content (not yet migrating real data)

---

## Appendix A: Existing File Count

**Components to understand:**
- `StepCard.tsx` (bootcamp)
- `WalkthroughStep.tsx` (labs)
- `FocusedStepList.tsx` (shared)
- `EducationalMarkdownRenderer` (shared)
- `StepRenderer.tsx` (shared)
- `LearningNav.tsx` (shared)
- `CommandBlock` (labs)
- `FlagInput` (labs)
- `InlineQuiz` (courses/bootcamp)

**Data files:**
- `bootcampConfig.ts` — 4028 lines
- `src/features/student/data/courses/*` — 12 files
- `src/features/student/data/simulations/*` — 5 files

**Total scope:** ~20K+ lines of content + rendering

---

## Appendix B: Grep Search Commands for Migration

```bash
# Find all WalkthroughStep usages
grep -r "WalkthroughStep" --include="*.tsx" --include="*.ts"

# Find all EducationalMarkdownRenderer usages
grep -r "EducationalMarkdownRenderer" --include="*.tsx" --include="*.ts"

# Find all StepCard usages
grep -r "StepCard" --include="*.tsx" --include="*.ts"

# Find bootcamp data
grep -r "BootcampStep" --include="*.ts"
```

---

**End of Audit — Phase 1 Complete ✅**
