# Learning-Page UI Audit

> **Scope**: `BootcampCoursePage`, `BootcampRoomPage`, `CourseLessonPage`, `LabsPage`
> **Shared chrome**: `SimulatedTerminal`, `TerminalShell`, `WalkthroughLayout`, `StudentLayout`, `LearningFilterStrip`, `StudentHeroSection`
> **Date**: 2026-07-25

---

## 1. Executive Summary

Three learning surfaces — **Bootcamp**, **Courses**, and **Labs** — were built at different times and have significant UI inconsistencies. The goal of this audit is to catalogue every surface-level component, identify what's shared vs duplicated, and propose a migration path toward a unified component architecture.

### Key Findings

| Area | Status |
|------|--------|
| Terminal wrapper (`SimulatedTerminal`/`TerminalShell`) | ✅ Fully shared — all 3 surfaces use it |
| Hero sections | ⚠️ Duplicated — `StudentHeroSection` vs `LabHeroSection` |
| Step/walkthrough chrome | ⚠️ Partially shared — `WalkthroughLayout` + `WalkthroughStep` exist but `StepParts` are duplicated per-surface |
| Step notes | ❌ Duplicated 3x — separate `StepNotes` in bootcamp, courses, and labs |
| Inline quiz | ❌ Duplicated — separate implementations in courses and labs |
| Code playground | ⚠️ Partially shared — `CodePlayground` exists but labs have `InteractiveTerminal` overlay |
| Filter strips | ⚠️ Duplicated — `LearningFilterStrip` vs `BootcampFilterBar` vs labs filter state |
| Scenario cards | ✅ Shared — `ScenarioCard` used by both Bootcamp and Labs |
| Completion celebration | ❌ 3 separate modal implementations |

---

## 2. Surface Inventories

### 2.1 Bootcamp Course Page

**File**: `src/features/student/pages/BootcampCoursePage/index.tsx`
**Lines**: 763 total

| Line Range | Component | Description |
|-----------|-----------|-------------|
| 141–180 | BootcampCompletionModal | Completion celebration overlay |
| 182–348 | CourseContent | Main content orchestrator |
| 204–225 | BootcampCourseHeader | Title + back button |
| 227–248 | Progress header (inline) | Steps count + total time |
| 250–279 | StepHeader | Title + description (duplicated) |
| 280–300 | QuizBlock | Inline quiz (duplicated) |
| 301–334 | StepPartsRenderer | Code editor + output + sandbox (duplicated) |
| 335–345 | BootcampStepNotes | Step notes (duplicated) |
| 350–466 | PhaseSidebar | Phase list with expand/collapse |
| 468–699 | BootcampCoursePage | Main page component |

**Layout**: Two-column — `lg:grid-cols-[280px_1fr]`, sidebar with `border-r border-border/20`, content with `max-w-4xl mx-auto`

**Key styling tokens**:
- Sidebar background: `bg-bg-card border-r border-border/20`
- Content area: `bg-surface/50`
- Active step: `bg-accent/10 border-accent text-accent rounded-xl`
- CTA button: `bg-accent text-bg rounded-lg`
- Phase number badge: `bg-accent text-bg rounded-full w-6 h-6`
- Completed badge: `bg-accent/10 text-accent rounded-full w-5 h-5`

**File**: `src/features/student/components/bootcamp-course/PhaseSidebar.tsx` (85 lines)

---

### 2.2 Bootcamp Room Page

**File**: `src/features/student/pages/BootcampRoomPage/index.tsx`
**Lines**: 1116 total

| Line Range | Component | Description |
|-----------|-----------|-------------|
| 173–218 | BootcampCompletionModal | Completion overlay (duplicated) |
| 239–259 | RoomHeader | Title + back button (duplicated) |
| 261–358 | PhaseSelector | Phase grid selector (unique to room) |
| 360–434 | ScenarioSelector | Scenario cards via `ScenarioCard` (shared) |
| 436–461 | StepPartsRenderer | Code editor + output + sandbox (duplicated) |
| 462–474 | StepNotes | Step notes (duplicated) |
| 476–746 | RoomView | Step content orchestrator |
| 748–950 | RoomSidebar | Navigation sidebar (duplicated) |
| 952–1114 | BootcampRoomPage | Main page component |

**Layout**: Two-column — `lg:grid-cols-[280px_1fr]`, sidebar with `border-r border-border/20`

**Key styling tokens**:
- Room header: `text-accent` title, `bg-bg-card border-b border-border/20`
- Phase number: `w-10 h-10 sm:w-12 sm:h-12 bg-accent text-bg rounded-lg`
- Completed phase: `bg-accent/10 border-accent/30`
- Active scenario: `border-accent bg-accent/10`
- Step navigation: `border border-border/20 rounded-xl`

---

### 2.3 Course Lesson Page

**File**: `src/features/student/pages/CourseLessonPage/index.tsx`
**Lines**: 1173 total

| Line Range | Component | Description |
|-----------|-----------|-------------|
| 147–211 | CourseCompletionModal | Completion overlay (duplicated) |
| 213–302 | InteractiveTerminal | Terminal overlay modal (labs-specific) |
| 304–380 | TerminalButton | Open/close terminal FAB (labs-specific) |
| 382–483 | StepContent | Main content orchestrator |
| 384–405 | CourseContentHeader | Title + description (duplicated) |
| 407–423 | CourseStepNotes | Step notes (duplicated) |
| 425–451 | CourseInlineQuiz | Quiz (duplicated) |
| 453–481 | CourseStepParts | Code editor + output (duplicated) |
| 485–743 | CourseSidebar | Navigation sidebar (duplicated) |
| 745–1171 | CourseLessonPage | Main page component |

**Layout**: Two-column — `lg:grid-cols-[280px_1fr]`, sidebar with `border-r border-border/20`

**Key styling tokens**:
- Sidebar: `bg-bg-card border-r border-border/20`
- Content: `bg-surface/50`
- Active step: `bg-accent/10 border-l-2 border-accent text-accent`
- Terminal FAB: `bg-accent text-bg shadow-lg shadow-accent/20`
- Quiz selected: `border-accent bg-accent/5`
- Quiz correct: `bg-green-500/10 border-green-500`
- Quiz incorrect: `bg-red-500/10 border-red-500`

---

### 2.4 Labs Page

**File**: `src/features/student/pages/labs/LabsPage/index.tsx`
**Lines**: 1291 total

| Line Range | Component | Description |
|-----------|-----------|-------------|
| 94–262 | ActiveLabSession | Main lab workspace |
| 123–158 | LabWorkspaceHeader | Title + back + close + scenario pill |
| 162–183 | WalkthroughProgress | Step dots + time tracker |
| 209–410 | ScenarioSelector | Scenario cards (duplicated) |
| 412–437 | LabCompletionModal | Completion overlay (duplicated) |
| 439–503 | WelcomeScreen | Landing before lab start |
| 505–1289 | LabsPage | Main page component |

**Layout**: Full-width with floating `TerminalShell` (no sidebar — terminal is the sidebar)

**Key styling tokens**:
- Lab workspace: `bg-black min-h-screen`
- Terminal shell: `w-full sm:w-[600px] md:w-[700px] max-h-[85vh]`
- Scenario card: `bg-surface border border-border/30 rounded-2xl`
- Active scenario: `border-accent bg-accent/10`
- Lab button: `bg-accent text-bg font-semibold`
- Floating close: `bg-surface border border-border/30 hover:bg-accent hover:text-bg`

---

## 3. Shared Chrome Components

### 3.1 SimulatedTerminal + TerminalShell

**Files**: `src/features/student/components/SimulatedTerminal/`
- `SimulatedTerminal.tsx` (240 lines) — wrapper with resize, drag, collapse
- `TerminalShell.tsx` (61 lines) — simpler shell for labs

| Feature | SimulatedTerminal | TerminalShell |
|---------|------------------|---------------|
| Used by | BootcampCoursePage, CourseLessonPage | LabsPage |
| Resize | `react-resizable` | None |
| Drag | `react-draggable` | None |
| Collapse | Yes | Yes |
| Keyboard shortcuts | Ctrl+`, Ctrl+Shift+C | None |
| Layout | Fixed position overlay | `sm:fixed sm:inset-y-0 sm:right-0` |

### 3.2 WalkthroughLayout

**File**: `src/features/student/components/walkthrough/WalkthroughLayout.tsx` (34 lines)
- `min-h-screen bg-black text-text`
- Fixed top bar: `sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-border/20`
- Content: `flex-1 px-4 sm:px-6 lg:px-8 pb-20`
- Only used by `StudentLearnPage`

### 3.3 WalkthroughStep

**File**: `src/features/student/components/walkthrough/WalkthroughStep.tsx` (70 lines)
- Responsive padding: `p-4 sm:p-5 md:p-6 lg:p-8`
- Title: `text-xl sm:text-2xl md:text-3xl`
- Description: `text-text-secondary text-sm sm:text-base`
- Only used by `StudentLearnPage`

### 3.4 LearningFilterStrip

**File**: `src/features/student/components/learning/LearningFilterStrip.tsx` (322 lines)
- Used by: BootcampCoursePage, CourseLessonPage
- NOT used by LabsPage (labs use ScenarioSelector only)

### 3.5 StudentHeroSection

**File**: `src/shared/components/StudentHeroSection.tsx` (251 lines)
- Used by: BootcampCoursePage, CourseLessonPage
- NOT used by LabsPage (has its own LabHeroSection)

### 3.6 ScenarioCard

**File**: `src/shared/components/ScenarioCard.tsx` (116 lines)
- Used by: BootcampRoomPage, LabsPage
- NOT used by CourseLessonPage

### 3.7 StepNotes (3 implementations)

| Implementation | File | Lines |
|---------------|------|-------|
| Bootcamp | `BootcampCoursePage/index.tsx:335` (inline) | ~10 |
| Bootcamp Room | `BootcampRoomPage/index.tsx:462` (inline) | ~12 |
| Courses | `CourseLessonPage/index.tsx:407` (inline) | ~16 |
| Labs | Lab-specific (via LabCard) | N/A |

All use: `text-sm text-text/70 bg-surface/50 border border-border/20 rounded-lg p-3`

### 3.8 Inline Quiz (2 implementations)

| Implementation | File | Lines |
|---------------|------|-------|
| Bootcamp | `BootcampCoursePage/index.tsx:280` (inline) | ~20 |
| Courses | `CourseLessonPage/index.tsx:425` (inline) | ~26 |
| Labs | None (quizzes handled differently) | — |

Both use: `bg-surface border border-border/30 rounded-xl p-4`

### 3.9 StepParts / Code Playground (3 implementations)

| Implementation | File | Lines | Terminal Integration |
|---------------|------|-------|---------------------|
| Bootcamp | `BootcampCoursePage/index.tsx:301` (inline) | ~33 | `SimulatedTerminal` |
| Bootcamp Room | `BootcampRoomPage/index.tsx:436` (inline) | ~25 | `SimulatedTerminal` |
| Courses | `CourseLessonPage/index.tsx:453` (inline) | ~28 | `SimulatedTerminal` |
| Labs | `LabCard.tsx` + `InteractiveTerminal` | separate | `TerminalShell` |

---

## 4. Cross-Page Diff Table

### 4.1 Layout Structure

| Feature | Bootcamp Course | Bootcamp Room | Course Lesson | Labs |
|---------|----------------|---------------|---------------|------|
| Layout | `grid-cols-[280px_1fr]` | `grid-cols-[280px_1fr]` | `grid-cols-[280px_1fr]` | Full-width + floating terminal |
| Sidebar | Phase list with expand | Room navigation with breadcrumbs | Step list with expand | None (terminal is sidebar) |
| Content area | `max-w-4xl mx-auto` | `max-w-4xl mx-auto` | `max-w-4xl mx-auto` | `max-w-3xl mx-auto` |
| Background | `bg-surface/50` | `bg-surface/50` | `bg-surface/50` | `bg-black` |

### 4.2 Navigation Sidebar

| Feature | Bootcamp Course | Bootcamp Room | Course Lesson | Labs |
|---------|----------------|---------------|---------------|------|
| File | `index.tsx` (inline) | `RoomSidebar.tsx` | `CourseSidebar.tsx` | — |
| Width | `w-[280px]` | `w-[280px]` | `w-[280px]` | — |
| Position | `sticky top-16` | `sticky top-[72px]` | `sticky top-[68px]` | — |
| Height | `h-[calc(100vh-72px)]` | `h-[calc(100vh-72px)]` | `h-[calc(100vh-68px)]` | — |
| Active item | `bg-accent/10 border-accent` | `bg-accent/10 text-accent` | `bg-accent/10 border-l-2 border-accent` | — |
| Phase expand | `ChevronDown` rotate | `ChevronRight` rotate | `ChevronDown` rotate | — |
| Step badges | ✅ Phase number | ✅ Phase number | ✅ (number only) | — |
| Completion | ✅ Green checkmark | ✅ Green checkmark | ✅ Green checkmark | — |

### 4.3 Step Content Header

| Feature | Bootcamp Course | Bootcamp Room | Course Lesson | Labs |
|---------|----------------|---------------|---------------|------|
| Title class | `text-xl` | `text-2xl` | `text-xl` | `text-xl` |
| Description | ✅ Below title | ❌ (shown in step selector) | ✅ Below title | ❌ |
| Back button | ❌ | ❌ | ❌ | ✅ |

### 4.4 Step Parts (Code + Output)

| Feature | Bootcamp | Room | Courses | Labs |
|---------|----------|------|---------|------|
| File | Inline in `index.tsx` | Inline in `index.tsx` | Inline in `index.tsx` | `LabCard.tsx` |
| Grid | `grid-cols-1 lg:grid-cols-2` | `grid-cols-1 lg:grid-cols-2` | `grid-cols-1 lg:grid-cols-2` | `grid-cols-1 lg:grid-cols-2` |
| Min height | `min-h-[300px] lg:min-h-[500px]` | `min-h-[300px] lg:min-h-[500px]` | `min-h-[300px] lg:min-h-[500px]` | `min-h-[300px]` |
| Editor | `LanguageEditor` | `LanguageEditor` | `LanguageEditor` | `LanguageEditor` |
| Output | `CodeOutput` | `CodeOutput` | `CodeOutput` | `CodeOutput` |
| Terminal | `SimulatedTerminal` (fixed) | `SimulatedTerminal` (fixed) | `SimulatedTerminal` (fixed) | `InteractiveTerminal` (inline) |
| Sandbox button | ✅ `bg-accent text-bg rounded-lg` | ✅ Same | ✅ Same | ❌ |
| Terminal button | ❌ (auto-opened) | ❌ (auto-opened) | ❌ (auto-opened) | ✅ FAB `bg-accent text-bg` |

### 4.5 Completion Modal

| Feature | Bootcamp Course | Bootcamp Room | Course Lesson | Labs |
|---------|----------------|---------------|---------------|------|
| Title | "Bootcamp Completed! 🎉" | "Room Completed! 🎉" | "Congratulations! 🎉" | "Congratulations! 🎉" |
| Subtitle | "Outstanding work..." | "Outstanding work..." | "You've completed..." | "You've successfully completed..." |
| Stats | "2" days, "2" hours | "2" days, "2" hours | "2" days, "2" hours | None |
| Buttons | `Continue Learning`, `Back to Home` | `Back to Home`, `Next Lesson` | `Continue Learning`, `Back to Home` | `Back to Lab Hub`, `Start New Lab` |
| Background | `bg-accent` circle (w-32 h-32) | Same | Same | Same |

### 4.6 Color Usage

| Token | Bootcamp | Room | Courses | Labs |
|-------|----------|------|---------|------|
| Accent bg | `bg-accent/10` | `bg-accent/10` | `bg-accent/10` | `bg-accent/10` |
| Accent border | `border-accent` | `border-accent/30` | `border-accent` | `border-accent` |
| Accent text | `text-accent` | `text-accent` | `text-accent` | `text-accent` |
| CTA bg | `bg-accent` | `bg-accent` | `bg-accent` | `bg-accent` |
| CTA text | `text-bg` | `text-bg` | `text-bg` | `text-bg` |
| Completed | `bg-green-500 text-white` | `bg-green-500 text-white` | `bg-green-500 text-white` | `bg-green-500 text-white` |
| Progress bar bg | `bg-accent/20` | `bg-accent/20` | `bg-accent/20` | `bg-accent` (solid) |
| Quiz correct | — | — | `bg-green-500/10 border-green-500` | — |
| Quiz incorrect | — | — | `bg-red-500/10 border-red-500` | — |

---

## 5. Proposed Shared Component Architecture

### 5.1 New Shared Components

```
src/shared/components/learning/
├── StepNotes.tsx              ← Extract from inline implementations
├── InlineQuiz.tsx             ← Extract from CourseLessonPage
├── CompletionModal.tsx        ← Extract and parameterize from 3 implementations
├── StepContentHeader.tsx      ← Extract from BootcampCourseHeader / CourseContentHeader / RoomHeader
├── StepPartsPanel.tsx         ← Extract from 3 StepPartsRenderer implementations
└── FilterBar.tsx              ← Unify LearningFilterStrip + BootcampFilterBar
```

### 5.2 Component Contracts

```tsx
// StepNotes.tsx
interface StepNotesProps {
  notes?: string;
}

// InlineQuiz.tsx
interface InlineQuizProps {
  quiz: {
    question: string;
    options: string[];
  };
  onAnswer?: (answer: string) => void;
}

// CompletionModal.tsx
interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  stats?: { label: string; value: string }[];
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

// StepContentHeader.tsx
interface StepContentHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
  showBack?: boolean;
}

// StepPartsPanel.tsx
interface StepPartsPanelProps {
  parts: Array<{
    title?: string;
    type: 'code' | 'output';
    content?: string;
    language?: string;
  }>;
  showSandbox?: boolean;
  sandboxLabel?: string;
  onSandbox?: () => void;
  showTerminal?: boolean;
  terminalLabel?: string;
  onTerminal?: () => void;
}

// FilterBar.tsx
interface FilterBarProps {
  filters: Array<{
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }>;
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  sortOptions?: { value: string; label: string }[];
  activeSort?: string;
  onSortChange?: (value: string) => void;
  onClearAll?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  activeSearch?: string;
  onSearchChange?: (value: string) => void;
  searchResultsInfo?: string;
}
```

---

## 6. Migration Plan

### Phase 1: Extract Shared Primitives (Low Risk)

| Step | Component | Source | Target | Files Modified |
|------|-----------|--------|--------|----------------|
| 1.1 | `StepNotes` | 3 inline impls | `src/shared/components/learning/StepNotes.tsx` | 3 page files |
| 1.2 | `CompletionModal` | 3 modal impls | `src/shared/components/learning/CompletionModal.tsx` | 3 page files |
| 1.3 | `InlineQuiz` | 2 inline impls | `src/shared/components/learning/InlineQuiz.tsx` | 2 page files |

### Phase 2: Unify Step Parts (Medium Risk)

| Step | Component | Source | Target | Files Modified |
|------|-----------|--------|--------|----------------|
| 2.1 | `StepPartsPanel` | 3 StepPartsRenderers | `src/shared/components/learning/StepPartsPanel.tsx` | 3 page files |
| 2.2 | Unify `SimulatedTerminal` and `TerminalShell` into single `TerminalWrapper` | Both | `src/shared/components/learning/TerminalWrapper.tsx` | 3 page files + labs |

### Phase 3: Unify Navigation (High Risk)

| Step | Component | Source | Target | Files Modified |
|------|-----------|--------|--------|----------------|
| 3.1 | `LearningSidebar` | 3 sidebar impls | `src/shared/components/learning/LearningSidebar.tsx` | 3 page files |
| 3.2 | Unify `FilterBar` | `LearningFilterStrip` + `BootcampFilterBar` | `src/shared/components/learning/FilterBar.tsx` | 2 component files |

### Phase 4: Unify Hero Sections (Low Risk)

| Step | Component | Source | Target | Files Modified |
|------|-----------|--------|--------|----------------|
| 4.1 | Unify `StudentHeroSection` + `LabHeroSection` | Both | `src/shared/components/StudentHeroSection.tsx` (enhance) | LabsPage |

---

## 7. Validation

After each phase, run:
```bash
npx tsc --noEmit          # Type check
npx eslint src/           # Lint
```

All changes must maintain:
- `bg-black` page background
- `bg-surface` / `bg-surface/50` content areas
- `border-border/20` borders
- `text-accent` for highlights
- `bg-accent text-bg` for CTAs
- JetBrains Mono for code
- Consistent spacing: `gap-6`, `p-6`, `rounded-xl`
