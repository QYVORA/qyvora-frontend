# Learning Content Architecture V2

> **Status:** Phase 2 ✅ ARCHITECTURE COMPLETE  
> **See Also:** `LEARNING_CONTENT_ARCHITECTURE_AUDIT.md` (Phase 1 audit)

## Overview

QYVORA's Learning System V2 introduces a **semantic learning block architecture** that separates content (what we teach) from learning semantics (how we teach it) from presentation (how it appears).

### Key Principle

```
CONTENT MODEL
      ↓
LEARNING SEMANTICS
      ↓
LEARNING BLOCKS
      ↓
LEARNING RENDERER
      ↓
QYVORA UI
```

**NOT:**

```
Markdown
   ↓
make Markdown prettier
   ↓
hope students learn
```

---

## Architecture Overview

```
src/shared/learning/
├── types/
│   ├── blocks.ts       # 21 semantic block types
│   ├── content.ts      # LearningUnit, LearningSequence
│   ├── progress.ts     # Progress tracking types
│   └── index.ts        # Barrel export
├── renderer/
│   ├── LearningBlockRenderer.tsx      # Dispatches blocks to components
│   ├── LearningContentRenderer.tsx    # Renders complete units
│   └── index.ts
├── blocks/
│   └── [Phase 3 - UI implementation]
├── utils/
│   ├── blockRegistry.ts     # Dynamic block registration
│   ├── contentAdapter.ts    # Legacy → V2 conversion
│   └── index.ts
└── index.ts                 # Main export
```

---

## Semantic Block Types

### 1. Narrative Blocks

**Purpose:** Explanation and context

| Type | Purpose | Key Fields |
|------|---------|------------|
| `text` | Plain explanatory text | `content` (Markdown compatible) |
| `objective` | Learning outcomes | `objectives[]` |
| `mission` | Student's goal | `mission`, `context` |
| `concept` | Key idea emphasis | `title`, `content`, `importance` |
| `debrief` | Post-activity explanation | `content`, `keyTakeaways[]` |
| `recall` | Summary for retention | `points[]` |

### 2. Visual Blocks

**Purpose:** Mental models and diagrams

| Type | Purpose | Key Fields |
|------|---------|------------|
| `mental-model` | Teach relationships | `nodes[]`, `connections[]` |
| `diagram` | Generic diagrams | `diagramType`, `content` |

### 3. Evidence Blocks

**Purpose:** Show students what to notice

| Type | Purpose | Key Fields |
|------|---------|------------|
| `observe` | Direct observation | `artifact`, `artifactContent`, `callouts[]` |
| `evidence` | Terminal/log output | `entries[]`, `format` |

### 4. Interactive Blocks

**Purpose:** Technical artifacts and code

| Type | Purpose | Key Fields |
|------|---------|------------|
| `command` | Terminal command | `command`, `explanation`, `flags[]` |
| `http` | HTTP request/response | `request`, `response`, `annotations[]` |
| `code` | Code snippet | `language`, `code`, `highlights[]` |
| `comparison` | Before/after code | `left`, `right`, `keyDifference` |

### 5. Practice Blocks

**Purpose:** Active learning

| Type | Purpose | Key Fields |
|------|---------|------------|
| `think` | Reasoning question | `question`, `options[]`, `correctIndex` |
| `do` | Action instructions | `instructions[]`, `expectedResult` |
| `checkpoint` | Quiz/flag/validation | `checkpointType`, `quiz`/`flag`/`task` |
| `hint` | Progressive hints | `hints[]` (with levels) |
| `challenge` | Reduced scaffolding | `description`, `constraints[]`, `successCriteria[]` |
| `lab` | Lab handoff | `labId`, `summary`, `objectives[]` |

---

## Core Types

### LearningBlock

```typescript
type LearningBlock =
  | TextBlock
  | ObjectiveBlock
  | MissionBlock
  | ConceptBlock
  | MentalModelBlock
  | DiagramBlock
  | ObserveBlock
  | EvidenceBlock
  | ThinkBlock
  | DoBlock
  | CommandBlock
  | HttpBlock
  | CodeBlock
  | ComparisonBlock
  | CheckpointBlock
  | HintBlock
  | ChallengeBlock
  | LabBlock
  | DebriefBlock
  | RecallBlock;
```

### LearningUnit

A single focused learning experience (equivalent to a step/lesson).

```typescript
interface LearningUnit {
  id: string;
  number: number;
  title: string;
  blocks: LearningBlock[];
  estimatedMinutes?: number;
  image?: { src: string; alt: string };
  completionType?: 'view' | 'checkpoint' | 'manual';
}
```

### LearningSequence

Collection of units (room, lesson, or lab).

```typescript
interface LearningSequence {
  id: string;
  title: string;
  overview: string;
  units: LearningUnit[];
  estimatedMinutes?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  prerequisites?: string[];
  outcomes?: string[];
}
```

---

## Rendering System

### Block Registry

Dynamic registration system allowing new block types to be added without modifying core renderer.

```typescript
import { blockRegistry } from '@/shared/learning';

// Register a block component
blockRegistry.register({
  type: 'text',
  component: TextBlockComponent,
  description: 'Plain explanatory text',
});
```

### Render Context

Context passed to every block during rendering.

```typescript
interface BlockRenderContext {
  surface: 'bootcamp' | 'course' | 'lab';
  sequenceId: string;
  unitId: string;
  onCheckpointSubmit?: (blockId: string, answer: any) => Promise<{correct: boolean}>;
  onComplete?: (unitId: string) => void;
  labId?: string;
  metadata?: Record<string, any>;
}
```

### Usage Example

```tsx
import { LearningContentRenderer } from '@/shared/learning';
import type { LearningUnit } from '@/shared/learning';

function RoomPage() {
  const unit: LearningUnit = /* ... */;
  
  return (
    <LearningContentRenderer
      unit={unit}
      context={{
        surface: 'bootcamp',
        sequenceId: 'phase1-room1',
        unitId: 'step-1',
        onComplete: handleComplete,
      }}
    />
  );
}
```

---

## Content Adapters

### Bootcamp Adapter

Convert legacy `BootcampStep` to `LearningUnit`:

```typescript
import { adaptBootcampStep } from '@/shared/learning';

const legacyStep: BootcampStep = {
  title: "Linux Basics",
  instruction: "# Introduction\n\nLinux is...",
  image: "linux-intro.webp",
  quiz: [/* quiz questions */],
};

const unit = adaptBootcampStep(legacyStep, 0, 'room1', 'phase3');
```

**Strategy:** For now, wraps Markdown in `TextBlock`. Future enhancement: parse Markdown to extract semantic structures.

### Lab Adapter

Convert `WalkthroughStep` to `LearningUnit`:

```typescript
import { adaptLabStep } from '@/shared/learning';

const legacyStep: LegacyWalkthroughStep = {
  title: "Find the Vulnerability",
  narrative: "Inspect the application...",
  mission: "Identify the SQL injection point",
  objectives: ["Locate user input", "Trace data flow"],
  evidence: ["> SELECT * FROM users", "> admin' OR '1'='1"],
  commandInstruction: "sqlmap -u http://target.com",
  flagId: "privesc-step-1",
};

const unit = adaptLabStep(legacyStep, 0, 'privesc');
```

**Result:** Semantic blocks extracted from structured fields.

---

## Progress Tracking

### Progress States

```typescript
type ProgressState =
  | 'not_started'
  | 'in_progress'
  | 'checkpoint_passed'
  | 'completed';
```

### Unit Progress

```typescript
interface UnitProgress {
  unitId: string;
  state: ProgressState;
  startedAt?: number;
  completedAt?: number;
  checkpointResults?: Array<{
    blockId: string;
    passed: boolean;
    attempts: number;
    lastAttemptAt: number;
  }>;
  thinkBlockResponses?: Array<{
    blockId: string;
    response: string | number;
    timestamp: number;
  }>;
}
```

### Legacy API Compatibility

Adapters maintain compatibility with existing backend:

```typescript
interface LegacyProgressAdapter {
  markBootcampStepViewed(bootcampId, phaseId, roomId, stepIndex): Promise<void>;
  submitLabFlag(labId, stepId, flag): Promise<{correct: boolean}>;
  completeCourseLesson(courseId, lessonIndex): Promise<void>;
  submitQuiz(quizId, answers): Promise<{score: number; passed: boolean}>;
}
```

---

## Design Principles

### 1. Separation of Concerns

**Content authors** define WHAT to teach (semantic blocks).  
**Block components** define HOW to present it (QYVORA UI).  
**Renderer** connects them dynamically.

### 2. No Presentation in Content

Content authors should NOT need to know:
- Tailwind classes
- React components
- Layout decisions

Bad:
```typescript
{
  type: 'text',
  content: 'This is <span className="text-accent">important</span>',
}
```

Good:
```typescript
{
  type: 'concept',
  title: 'Important Concept',
  content: 'This is the key idea',
  importance: 'core',
}
```

### 3. Pedagogical Enforcement

Block types encode learning best practices:

- `mission` → Start with clear goal
- `objective` → Define learning outcomes
- `think` → Check understanding before revealing
- `observe` → Direct attention to evidence
- `do` → Turn explanation into action
- `debrief` → Explain what happened and why
- `recall` → Summarize for retention

### 4. No Card Soup

Avoid:
```
<Card><Concept /></Card>
<Card><Observation /></Card>
<Card><Command /></Card>
```

Use typography, spacing, visual hierarchy. Cards only for semantic emphasis (missions, checkpoints, hints).

---

## Type Guards

```typescript
import { isTextBlock, isCheckpointBlock, isMissionBlock } from '@/shared/learning';

if (isCheckpointBlock(block)) {
  // TypeScript knows block is CheckpointBlock
  if (block.checkpointType === 'flag') {
    // Handle flag checkpoint
  }
}
```

---

## Validation

```typescript
import { validateLearningUnit } from '@/shared/learning';

const result = validateLearningUnit(unit);

if (!result.valid) {
  console.warn('Unit validation warnings:', result.warnings);
  // Example warnings:
  // - "Unit has no content blocks"
  // - "Unit has 3 checkpoints. Consider splitting into multiple units."
  // - "Unit requires checkpoint completion but has no checkpoint blocks"
}
```

---

## Migration Path

### Phase-by-Phase

1. ✅ **Phase 1:** Audit existing system
2. ✅ **Phase 2:** Create type system and renderer architecture ← **WE ARE HERE**
3. **Phase 3:** Build block UI components
4. **Phase 4:** HPB pilot (one room)
5. **Phase 5:** Iterate, add missing primitives
6. **Phase 6:** Complete HPB migration
7. **Phase 7:** Migrate courses
8. **Phase 8:** Integrate lab features
9. **Phase 9:** Remove legacy code

### Backward Compatibility

During migration:

- ✅ Legacy content continues working via adapters
- ✅ Existing routes unchanged
- ✅ Progress APIs unchanged
- ✅ Quiz/flag systems unchanged
- ✅ Tests continue passing (updated as needed)

New content uses semantic blocks directly.

---

## Example: Semantic vs Legacy

### Legacy (Markdown-driven)

```typescript
{
  title: "SQL Injection Basics",
  instruction: `
# SQL Injection

SQL injection happens when user input is directly concatenated...

**Your Mission:** Find the vulnerable parameter.

Try this command:
\`\`\`bash
sqlmap -u "http://target.com?id=1"
\`\`\`

**Think:** Which parameter can you control?
  `,
}
```

**Problems:**
- No semantic structure
- Author must manually create learning flow
- Renderer can't adapt based on content type
- Hard to add new interaction types

### V2 (Semantic Blocks)

```typescript
{
  title: "SQL Injection Basics",
  blocks: [
    {
      type: 'text',
      id: 'intro',
      content: 'SQL injection happens when user input is directly concatenated...',
    },
    {
      type: 'mission',
      id: 'mission',
      mission: 'Find the vulnerable parameter',
    },
    {
      type: 'command',
      id: 'cmd1',
      command: 'sqlmap -u "http://target.com?id=1"',
      explanation: {
        what: 'Scans for SQL injection vulnerabilities',
        watch: 'Parameter "id" is injectable',
      },
    },
    {
      type: 'think',
      id: 'think1',
      question: 'Which parameter can you control?',
      options: ['URL path', 'Query parameter "id"', 'HTTP method'],
      correctIndex: 1,
      explanation: 'The "id" parameter is user-controlled via the URL query string',
    },
  ],
}
```

**Benefits:**
- ✅ Clear semantic structure
- ✅ Renderer knows how to present each type
- ✅ Easy to add new block types
- ✅ Pedagogical patterns enforced
- ✅ Content authors focus on teaching, not UI

---

## Next Steps (Phase 3)

1. Create block UI components in `src/shared/learning/blocks/`
2. Register each component in `blockRegistry`
3. Follow QYVORA design system (AGENTS.md, UI-PRINCIPLES.md)
4. Test with sample content
5. Prepare for HPB pilot

---

## API Reference

### Imports

```typescript
// Types
import type {
  LearningBlock,
  LearningUnit,
  LearningSequence,
  TextBlock,
  MissionBlock,
  CheckpointBlock,
  // ... other block types
} from '@/shared/learning';

// Type guards
import {
  isTextBlock,
  isMissionBlock,
  isCheckpointBlock,
  // ... other guards
} from '@/shared/learning';

// Renderers
import {
  LearningContentRenderer,
  LearningBlockRenderer,
} from '@/shared/learning';

// Utils
import {
  blockRegistry,
  adaptBootcampStep,
  adaptLabStep,
  validateLearningUnit,
} from '@/shared/learning';
```

### Key Functions

```typescript
// Register a block component
blockRegistry.register({
  type: 'text',
  component: TextBlockComponent,
  description: 'Plain explanatory text',
});

// Get a registered renderer
const Component = blockRegistry.getRenderer('text');

// Adapt legacy content
const unit = adaptBootcampStep(legacyStep, index, roomId, phaseId);
const unit = adaptLabStep(legacyStep, index, labId);

// Validate content
const result = validateLearningUnit(unit);
```

---

**Phase 2 Complete ✅**

TypeScript strict mode: ✅ Passing  
Architecture: ✅ Complete  
Documentation: ✅ Complete  
Next: Phase 3 — Build block UI components
