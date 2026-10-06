# Learning Blocks UI Reference

> **Status:** Phase 3 ✅ COMPLETE  
> **Component Location:** `src/shared/learning/blocks/`

## Overview

This document describes the UI implementation of each semantic learning block type. All components follow the QYVORA design system (AGENTS.md, UI-PRINCIPLES.md) and are registered in the blockRegistry on import.

---

## Implemented Blocks (Phase 3)

### 1. TextBlock

**Purpose:** Plain explanatory text — the primary reading flow.

**Visual:**
- Full viewport width (`max-w-none`)
- Blog typography: `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]`
- Renders Markdown via `EducationalMarkdownRenderer`

**Usage:**
```tsx
{
  type: 'text',
  id: 'intro',
  content: '# Introduction\n\nLinux is a powerful operating system...',
}
```

**Accessibility:**
- Semantic HTML from Markdown renderer
- Heading hierarchy preserved
- Links get proper focus states

---

### 2. MissionBlock

**Purpose:** Student's goal/task for the learning unit.

**Visual:**
- Rounded card: `rounded-xl border border-accent/20 bg-accent/5`
- Target icon (lucide-react)
- Kicker: `text-xs font-black uppercase tracking-widest text-accent`
- Mission text: `text-sm font-mono text-text-secondary leading-[2]`
- Optional context in muted text

**Usage:**
```tsx
{
  type: 'mission',
  id: 'mission',
  mission: 'Find the SQL injection vulnerability',
  context: 'The application accepts user input without validation',
}
```

**Design Notes:**
- Cards are semantic emphasis, not decorative
- Accent color signals importance
- Icon adds visual hierarchy

---

### 3. ObjectiveBlock

**Purpose:** Numbered learning outcomes.

**Visual:**
- Vertical stepper with connecting lines
- Number badges: `w-7 h-7 rounded-lg border border-accent/40 bg-bg`
- Connecting line between objectives: `w-px bg-border/40`
- Kicker header with ClipboardList icon
- Text: `text-sm md:text-base font-mono leading-[2] md:leading-[2.2]`

**Usage:**
```tsx
{
  type: 'objective',
  id: 'objectives',
  objectives: [
    'Identify attacker-controlled input',
    'Trace where the input travels',
    'Explain where trust breaks',
  ],
  title: 'Learning Objectives', // Optional, defaults to "Objectives"
}
```

**Accessibility:**
- Semantic `<ol role="list">`
- Number badges have `aria-label`
- Connecting lines are `aria-hidden`

---

### 4. ConceptBlock

**Purpose:** Highlight a key idea.

**Visual:**
- Two importance levels:
  - **Core:** `border-accent/30 bg-accent/5` with accent kicker
  - **Supporting:** `border-border/30 bg-bg-elevated` with muted kicker
- Title: `text-lg md:text-xl font-black tracking-tight`
- Content: Blog typography

**Usage:**
```tsx
{
  type: 'concept',
  id: 'concept1',
  title: 'Trust Boundary',
  content: 'A point where data moves from one security context to another.',
  importance: 'core', // or 'supporting'
}
```

**Design Notes:**
- Visual weight adjusts based on importance
- No emoji icons — clean typography

---

### 5. DebriefBlock

**Purpose:** Post-activity explanation.

**Visual:**
- Card: `rounded-xl border border-border/20 bg-bg-elevated`
- MessageSquare icon
- Content with `whitespace-pre-wrap` for formatted text
- Optional key takeaways: bulleted list with `•` markers

**Usage:**
```tsx
{
  type: 'debrief',
  id: 'debrief',
  title: 'What Just Happened', // Optional
  content: 'You succeeded because the application trusted attacker-controlled input...',
  keyTakeaways: [
    'Input is not automatically safe',
    'Always validate at the trust boundary',
  ],
}
```

**Accessibility:**
- Semantic `<ul role="list">` for takeaways
- Icon is `aria-hidden`

---

### 6. RecallBlock

**Purpose:** Concise summary for retention.

**Visual:**
- Prominent card: `rounded-xl border-2 border-accent/30 bg-accent/5`
- Bookmark icon
- Numbered list (01, 02, 03...) in accent color
- Text in primary color (more emphasis than body text)

**Usage:**
```tsx
{
  type: 'recall',
  id: 'recall',
  points: [
    'Input is not automatically safe',
    'Trace where input travels',
    'Identify the interpreter',
    'Find the trust boundary',
  ],
}
```

**Design Notes:**
- Visually distinct for easy scanning
- Padded numbers for alignment
- Always at end of learning unit

---

### 7. ObserveBlock

**Purpose:** Direct students to observe something specific.

**Visual:**
- Two-part layout:
  1. Observation prompt card (accent/5 background)
  2. Artifact display (terminal-style with header)
- Optional callouts: arrow markers with muted backgrounds
- Artifact types: terminal, HTTP, code, network, file

**Usage:**
```tsx
{
  type: 'observe',
  id: 'observe1',
  title: 'Look Closely', // Optional
  content: 'Notice how the parameter is reflected in the response',
  artifact: 'http',
  artifactContent: 'GET /search?q=<script>alert(1)</script>',
  callouts: [
    { text: 'The script tag is reflected unescaped' },
    { text: 'No Content-Security-Policy header' },
  ],
}
```

**Accessibility:**
- Artifact content in `<pre><code>` for screen readers
- Callouts in separate divs for navigation

---

### 8. EvidenceBlock

**Purpose:** Terminal output, logs, evidence list.

**Visual:**
- Terminal-style container: `wc-terminal rounded-xl border border-border/50 bg-bg`
- Header with entry count
- Terminal prompt markers (`>`) for terminal format
- Scrollable content

**Usage:**
```tsx
{
  type: 'evidence',
  id: 'evidence',
  entries: [
    'SELECT * FROM users WHERE id=1',
    "admin' OR '1'='1",
    '42 rows returned',
  ],
  format: 'terminal', // or 'log', 'plain'
}
```

**Design Notes:**
- Clean, scannable list
- Monospace font for technical content
- Entry count helps students track information

---

### 9. CommandBlock

**Purpose:** Terminal command with explanation.

**Visual:**
- Code container: `wc-code rounded-xl border border-border/50 bg-bg`
- Compact header: `px-3 py-1.5`
- Copy button with feedback
- Command in accent color: `text-accent`
- Explanation sections: What/Why/Watch
- Optional flag details and expected output

**Usage:**
```tsx
{
  type: 'command',
  id: 'cmd1',
  command: 'nmap -sV 192.168.1.1',
  explanation: {
    what: 'Scans for services and versions',
    why: 'To identify potential attack surfaces',
    watch: 'Open ports and service versions',
  },
  flags: [
    { flag: '-sV', description: 'Service version detection' },
  ],
  expectedOutput: '22/tcp open ssh OpenSSH 8.2',
}
```

**Accessibility:**
- Copy button has `aria-label`
- Keyboard accessible
- Success feedback announced

---

### 10. DoBlock

**Purpose:** Action instructions.

**Visual:**
- Accent card: `rounded-xl border border-accent/20 bg-accent/5`
- Play icon
- Numbered steps with accent numbers
- Optional expected result and verification hint

**Usage:**
```tsx
{
  type: 'do',
  id: 'do1',
  title: 'Practice', // Optional, defaults to "Try It"
  instructions: [
    'Open Burp Suite',
    'Submit the login form',
    'Inspect the captured request',
  ],
  expectedResult: 'You should see username and password in cleartext',
  verificationHint: 'Look in the Proxy > HTTP history tab',
}
```

**Design Notes:**
- Clear step progression
- Verification guidance reduces frustration

---

### 11. ThinkBlock

**Purpose:** Reasoning question before revealing answer.

**Visual:**
- Warning-colored card: `border-warning/20 bg-warning/5`
- Lightbulb icon
- Multiple choice options (if provided)
- Interactive reveal with feedback
- Correct: green check, Incorrect: red X
- Open-ended mode: just the prompt and explanation

**Usage:**
```tsx
{
  type: 'think',
  id: 'think1',
  question: 'Which parameter can you control?',
  options: ['URL path', 'Query parameter "id"', 'HTTP method'],
  correctIndex: 1,
  explanation: 'The "id" parameter is user-controlled via the URL',
  openEnded: false, // Optional, true = no validation
}
```

**Accessibility:**
- `role="radiogroup"` for options
- `role="radio"` and `aria-checked` on buttons
- Keyboard navigation
- Touch targets: `min-h-[48px]`

**Interaction:**
- Select option → Check Answer button appears
- Click Check Answer → Reveal with visual feedback
- Disabled after reveal

---

### 12. CheckpointBlock

**Purpose:** Learning checkpoint (quiz/flag/task).

**Visual:**
- Quiz: Reuses `InlineQuiz` component
- Flag: Input form with submit button, progressive hints, success card
- Task: Instruction card with verification steps
- Progressive hints: Warning-colored cards stacked
- Success: `border-2 border-accent/40 bg-accent/5` with CheckCircle icon

**Usage — Flag:**
```tsx
{
  type: 'checkpoint',
  id: 'checkpoint1',
  checkpointType: 'flag',
  flag: {
    flagId: 'privesc-step-1',
    hint: 'The file is in the /home directory',
    progressiveHints: [
      { level: 1, content: 'Look for hidden files' },
      { level: 2, content: 'Check file permissions' },
    ],
  },
}
```

**Usage — Quiz:**
```tsx
{
  type: 'checkpoint',
  id: 'checkpoint2',
  checkpointType: 'quiz',
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'What is SQL injection?',
        options: ['...', '...', '...'],
        correctIndex: 1,
        explanation: '...',
      },
    ],
    passThreshold: 70, // Optional
  },
}
```

**Accessibility:**
- Form has proper labels
- Error messages via `role="alert"`
- Submit button disabled while submitting
- Success announced to screen readers

**Interaction:**
- Flag submission via `context.onCheckpointSubmit`
- Calls `context.onComplete` on success
- Progressive hints revealed one at a time

---

## Component Spacing

All blocks use consistent vertical spacing via parent container:

```tsx
<div className="space-y-10 md:space-y-14">
  {blocks.map(block => <LearningBlockRenderer ... />)}
</div>
```

Individual blocks should NOT add top/bottom margin — spacing is handled by the parent.

---

## Width Constraints

| Content Type | Constraint | Applied Where |
|--------------|-----------|---------------|
| Reading text | `max-w-none` | TextBlock, narrative content |
| Code/commands | `wc-code` or `wc-terminal` | CommandBlock, EvidenceBlock |
| Interactive | `wc-interactive` | CheckpointBlock, quiz forms |
| Diagrams | `wc-diagram` | DiagramBlock (future) |

---

## Color Usage

### Status Colors

Use semantic tokens from `src/styles/index.css`:

- ✅ `text-accent` — Primary accent (#06B66F)
- ✅ `text-danger` — Error/incorrect states
- ✅ `text-warning` — Hints, think blocks
- ✅ `text-success` — Same as accent for completion
- ✅ `text-info` — Informational (blue)

### DO NOT Use:

- ❌ `text-red-400`, `text-green-400`, `text-blue-400`, etc.
- ❌ `emerald-*`, `sky-*`, `amber-*` raw palette colors

The linter will catch these violations.

---

## Typography

### Body Text

```
text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]
```

### Kickers/Labels

```
text-xs font-black uppercase tracking-widest text-accent
```

### Headings in Blocks

```tsx
// Block titles
<h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight">
```

### Numbers/Badges

```tsx
// Objective numbers
<span className="font-mono text-xs font-black text-accent">
  {String(index + 1).padStart(2, '0')}
</span>
```

---

## Accessibility Checklist

Every block component MUST:

- ✅ Have `min-h-[48px]` on interactive elements
- ✅ Use semantic HTML (`<button>`, not `<div onClick>`)
- ✅ Provide `aria-label` where text is not visible
- ✅ Mark decorative icons as `aria-hidden="true"`
- ✅ Use `role="list"` on custom lists
- ✅ Handle keyboard events (Enter/Space for custom buttons)
- ✅ Announce dynamic changes (`role="alert"`, `role="status"`)
- ✅ Respect focus-visible (global CSS handles this)

---

## Motion & Interaction

### No Scroll Hijacking

**Rule:** Never attach `onClick`/scroll handlers to containers wrapping interactive content.

**Bad:**
```tsx
<div onClick={() => scrollToTop()}>
  <button>Submit</button>
</div>
```

**Good:**
```tsx
<div onClick={(e) => {
  if (e.target.closest('button, input, a')) return;
  scrollToTop();
}}>
  <button>Submit</button>
</div>
```

### Reduced Motion

All animations respect `prefers-reduced-motion` via:
1. Global CSS
2. `MotionConfig` in App.tsx
3. Component-level checks

---

## Registration System

Blocks self-register on import:

```typescript
// src/shared/learning/blocks/index.ts
import TextBlockComponent from './TextBlock';
blockRegistry.register({
  type: 'text',
  component: TextBlockComponent,
  description: 'Plain explanatory text',
});
```

To use blocks:

```tsx
import '@/shared/learning/blocks'; // Registers all blocks
import { LearningContentRenderer } from '@/shared/learning';
```

Or import the barrel:

```tsx
import { LearningContentRenderer } from '@/shared/learning';
// blocks are auto-imported via barrel export
```

---

## Testing Blocks

### Unit Test Template

```tsx
import { render, screen } from '@testing-library/react';
import TextBlockComponent from './TextBlock';

describe('TextBlock', () => {
  it('renders markdown content', () => {
    const block = {
      type: 'text' as const,
      id: 'test',
      content: '# Hello\n\nWorld',
    };
    
    render(<TextBlockComponent block={block} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });
});
```

---

## Not Yet Implemented (Phase 5)

The following block types have type definitions but no UI components yet:

- `mental-model` — Visual mental model diagrams
- `diagram` — Generic diagrams
- `http` — HTTP request/response display
- `code` — Code snippets (distinct from commands)
- `comparison` — Side-by-side code comparison
- `hint` — Standalone hint block (progressive hints live in CheckpointBlock)
- `challenge` — Reduced-scaffolding challenges
- `lab` — Lab handoff cards

These will be implemented in Phase 5 as needed for HPB migration.

---

## Design Principles Followed

### 1. No Card Soup

Blocks use typography, spacing, and visual hierarchy. Cards are semantic:
- ✅ Mission (sets direction)
- ✅ Checkpoints (gates progress)
- ✅ Concepts (emphasizes key ideas)
- ✅ Debriefs (separates reflection)
- ❌ NOT everything

### 2. Full-Width Reading

Text blocks use `max-w-none` — no narrow prose column like documentation.

### 3. Monospace Body

All body text is `font-mono` — maintains the terminal-born character.

### 4. Bold Typography

Headings use `font-black` (900 weight), kickers use `font-black uppercase tracking-widest`.

### 5. Semantic Color

Accent green for learning-positive actions, warning yellow for hints/thinking, danger red for errors only.

---

## File Sizes

| Component | Lines | Complexity |
|-----------|-------|------------|
| TextBlock | 18 | Minimal (wrapper) |
| MissionBlock | 31 | Low |
| ObjectiveBlock | 53 | Medium (stepper) |
| ConceptBlock | 39 | Low |
| DebriefBlock | 60 | Medium (conditional) |
| RecallBlock | 43 | Low |
| ObserveBlock | 72 | Medium (callouts) |
| EvidenceBlock | 61 | Low |
| CommandBlock | 134 | High (sections) |
| DoBlock | 66 | Medium |
| ThinkBlock | 109 | High (interaction) |
| CheckpointBlock | 179 | Very High (3 modes) |

**Total:** ~865 lines across 12 components

---

## Next: Phase 4

With all core block components implemented, the next phase is to:

1. Migrate one HPB room to use semantic blocks
2. Test the rendering pipeline end-to-end
3. Identify missing primitives
4. Iterate on block designs based on real content

---

**Phase 3 Complete ✅**

- ✅ 12 semantic block components
- ✅ All following QYVORA design system
- ✅ TypeScript strict mode passing
- ✅ Linter passing (semantic tokens enforced)
- ✅ Auto-registration system
- ✅ Accessibility compliant
- ✅ Zero card soup
- ✅ Full-width reading text
- ✅ Ready for HPB pilot
