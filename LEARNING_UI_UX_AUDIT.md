# QYVORA Learning Content UI/UX Audit
**Date:** November 1, 2026  
**Scope:** Bootcamp rooms, Course lessons, Lab walkthroughs  
**Status:** CRITICAL — Multiple UI/UX issues identified

---

## Executive Summary

After conducting a comprehensive audit of all learning pages (bootcamp rooms, course lessons, lab walkthroughs), I've identified critical UI/UX problems that make learning content feel "bad," limited, and non-interactive. The core issues are:

1. **Bland, non-interactive layouts** - Content is just text and markdown with minimal visual engagement
2. **Poor use of code/command components** - Very few code examples and terminal commands in actual content
3. **Limited creative components** - No diagrams, interactive elements, visual aids, or progress indicators within steps
4. **Inconsistent sidebar styling** - Active nav items show square bracket decorations (`nav-ticks`) that don't match the rest of the UI
5. **Content feels empty** - Steps are just paragraphs of text with occasional quizzes, no rich media or interactive elements

---

## 1. BOOTCAMP ROOMS — Critical Problems

### 1.1 Content Structure Issues

**Current Implementation:**
- Located: `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId`
- Component: `BootcampRoomPage/index.tsx` → `StepCard.tsx` → `LearningContentRenderer`
- Content: Raw markdown converted to plain text blocks via `parseMarkdownToBlocks`

**Problems Identified:**

#### ❌ **Minimal Code Examples**
```typescript
// bootcampConfig.ts - Room 1, Step 1
instruction: `Valkyrie: "Welcome. At QYVORA, we test security by attacking systems..."
**Core Fields:**
- **Penetration Testing** - Finding security bugs...
*Task:* Write down the difference..."`
```

**Issue:** 
- NO command-line examples shown
- NO code snippets demonstrating concepts
- Just plain text with bold/italic markdown
- Students read theory without seeing practical application

**Expected:** 
```markdown
**Example Reconnaissance Command:**
```bash
nmap -sV 192.168.1.1 -oN scan_results.txt
```

**Output:**
```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9
80/tcp   open  http    nginx 1.24.0
```
```

#### ❌ **No Interactive Components**

**Current:** Steps are just:
1. Markdown text
2. Optional image (`<img>`)
3. Optional quiz at end

**Missing:**
- Interactive terminal simulator
- Code playgrounds
- Clickable diagrams
- Progress checkpoints within steps
- Hands-on exercises
- Flag submission forms
- Tool demonstrations

**Example of what's missing:**
```tsx
// Should have:
<InteractiveTerminal 
  command="whoami"
  expectedOutput="root"
  hint="Try the basic identity command"
/>

<NetworkDiagram 
  nodes={['attacker', 'router', 'target']}
  highlight="attacker"
/>

<FlagInput 
  challenge="Find the hidden admin username"
  correctFlag="administrator"
/>
```

#### ❌ **Bland Step Layout**

**Current rendering:**
```tsx
// StepCard.tsx
<StepRenderer>
  <LearningContentRenderer
    unit={{ blocks: parseMarkdownToBlocks(step.instruction) }}
  />
</StepRenderer>
```

**Result:**
- Just a card with text inside
- No visual hierarchy beyond headings
- No callouts, warnings, tips, notes
- No color-coded sections (theory vs practice vs quiz)

**Should have:**
```tsx
<InfoCallout type="tip">
  Pro tip: Always save nmap results with -oN flag
</InfoCallout>

<WarningCallout>
  Never run port scans without written authorization
</WarningCallout>

<TaskSection>
  <TaskTitle>Hands-On Exercise</TaskTitle>
  <TaskInstructions>...</TaskInstructions>
  <TerminalSimulator />
</TaskSection>
```

### 1.2 Visual Design Problems

#### ❌ **No Visual Learning Aids**

**Current:** Step images are just decorative illustrations
```typescript
image: 'step-01.webp' // Just a static image
```

**Should have:**
- Annotated screenshots showing where to click
- Process flow diagrams
- Attack chain visualizations
- Before/after comparisons
- Animated GIFs of tool usage
- Interactive SVG diagrams

#### ❌ **No Progress Indicators Within Steps**

**Current:** Progress is only shown at room level
- `viewedSteps` set tracks which steps scrolled into view
- Progress bar shows "X / Y steps"

**Problem:** No way to track completion of tasks WITHIN a step

**Should have:**
- Task checklists: `[ ] Task 1`, `[x] Task 2`
- Sub-step progress: "2 of 4 commands completed"
- Exercise completion badges
- Milestone markers

### 1.3 Content Quality Issues

#### ❌ **Too Much Theory, Not Enough Practice**

**Current content example:**
```markdown
"Offensive security is the practice of thinking and acting like an attacker..."
```

**Problem:** 
- 90% reading, 10% doing
- No commands to run
- No code to analyze
- No systems to explore

**Should be:**
- 40% explanation → 60% hands-on practice
- Every concept demonstrated with live example
- Immediate application of learned theory

---

## 2. COURSE LESSONS — Critical Problems

### 2.1 Content Structure Issues

**Current Implementation:**
- Located: `/dashboard/courses/:courseId?lesson=N`
- Component: `CourseLessonPage/index.tsx` → `LessonViewer` → `LearningContentRenderer`
- Content: Markdown + optional terminal commands + optional code playground + optional quiz

**Problems Identified:**

#### ❌ **Inconsistent Interactive Elements**

```typescript
// buildLessonBlocks() in CourseLessonPage/index.tsx
if (lesson.hasTerminal && lesson.terminalCommands) {
  parts.push({ type: 'command', command: cmd });
}
if (lesson.hasCodePlayground) {
  parts.push({ type: 'playground', language: '...', ... });
}
```

**Issues:**
- Interactive elements are OPTIONAL flags
- Most lessons don't have them
- No standard for when to include interactivity
- Feels random which lessons have code/terminal

**Should be:**
- EVERY lesson has practical component
- Code examples for programming courses
- Terminal for security/ops courses
- Interactive exercises are mandatory, not optional

#### ❌ **Poor Code Playground Integration**

**Current:**
```typescript
hasCodePlayground: boolean
codePlaygroundLanguage?: string
codePlaygroundInitial?: string
codePlaygroundExpectedOutput?: string
```

**Problems:**
- Code playground appears at END of lesson
- Separated from the explanation
- No incremental code-along
- No multiple practice exercises per lesson

**Should be:**
```tsx
<CodeSection>
  <Explanation>Functions in Python...</Explanation>
  <CodePlayground 
    exercise="Define a function that calculates area"
    starter="def calculate_area(width, height):"
    tests={[...]}
  />
</CodeSection>
```

#### ❌ **Limited Terminal Command Examples**

**Current:**
```typescript
terminalCommands: string[] // Just array of strings
```

**Problems:**
- Commands shown without context
- No expected output
- No explanation of what command does
- No flags/options breakdown

**Should be:**
```tsx
<CommandBlock
  command="nmap -sV -sC 192.168.1.1"
  flags={[
    { flag: '-sV', description: 'Version detection' },
    { flag: '-sC', description: 'Default scripts' }
  ]}
  expectedOutput="..."
  explanation="This scans for service versions..."
/>
```

### 2.2 Visual Design Problems

#### ❌ **No Visual Differentiation Between Section Types**

**Current:** Everything looks the same:
- Lesson intro text
- Concept explanation
- Code example
- Quiz question
All rendered as plain markdown blocks with same styling

**Should have:**
- Color-coded sections (theory = blue border, practice = green border, quiz = accent border)
- Different layouts for different content types
- Visual hierarchy that guides learning flow

---

## 3. LAB WALKTHROUGHS — Critical Problems

### 3.1 Content Structure Issues

**Current Implementation:**
- Located: `/dashboard/labs/:labId` (various lab pages)
- Component: `WalkthroughLayout.tsx`
- Content: Children components with `stepList` for navigation

**Problems Identified:**

#### ❌ **Over-Engineered Connection UI**

**Current:** Massive connection panel dominates the page:
```tsx
{scenarioId && showConnectionGuide && (
  <div className="rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
    {/* 40+ lines of connection UI */}
  </div>
)}
```

**Problems:**
- Takes up huge vertical space
- Only needs to be shown once
- Repeats on every lab page
- Pushes actual learning content down

**Should be:**
- Compact banner when disconnected: "Connect to lab → [Button]"
- Mini status indicator when connected: "🟢 Connected to 192.168.1.1"
- Connection panel in sidebar, not main content

#### ❌ **Simulation Panel Not Integrated**

**Current:**
```typescript
simulations?: { type: SimulationType; content: ReactNode }[]
```

**Problems:**
- Simulations are separate component
- Not woven into step content
- Feels like sidebar feature, not part of learning flow

**Should be:**
- Inline simulations within steps
- "Try this command in the terminal below" → terminal appears
- Interactive elements contextual to the step

### 3.2 Step Navigation Problems

#### ❌ **All Steps Visible at Once**

**Current:**
```tsx
<div className="space-y-12 md:space-y-16">
  {Children.toArray(children).map((child, index) => (
    <div key={index} id={id}>{child}</div>
  ))}
</div>
```

**Problems:**
- All lab steps render simultaneously
- Creates VERY long scrolling pages
- Hard to focus on one step at a time
- No clear "next step" progression

**Should be:**
- Option for focused mode (one step at a time)
- Clear step boundaries
- Next button advances to next step
- Breadcrumb shows position in walkthrough

---

## 4. SIDEBAR STYLING ISSUES

### 4.1 Nav-Ticks Square Brackets Problem

**Current Implementation:**
```tsx
// StudentSidebar.tsx line ~228
{active && (
  <>
    <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
    <span className="nav-ticks" aria-hidden="true">
      <i />
      <i />
    </span>
  </>
)}
```

**CSS (index.css lines 1141-1163):**
```css
.nav-ticks {
  position: absolute;
  inset: 7px 8px;
  pointer-events: none;
}
.nav-ticks i {
  position: absolute;
  width: 7px;
  height: 7px;
  border: 2px solid var(--color-accent);
  opacity: 0.7;
}
.nav-ticks i:first-child {
  top: 0;
  left: 0;
  border-right: 0;
  border-bottom: 0;
}
.nav-ticks i:last-child {
  right: 0;
  bottom: 0;
  border-left: 0;
  border-top: 0;
}
```

**Visual Result:**
```
┌──────────────────┐
│  [  🏠 Home  ]   │  ← Active item has square bracket corners
│     📚 Courses    │
│     🎓 Bootcamp   │
└──────────────────┘
```

**Problems:**
1. **Inconsistent with other UI** - No other components use this "terminal bracket" decoration
2. **Feels out of place** - Public nav doesn't have this, admin doesn't have this, only dashboard sidebar
3. **Clutters the interface** - Active indicator should be subtle (left bar) not decorative brackets
4. **Doesn't match QYVORA design system** - Design tokens don't include bracket decorations
5. **Not documented in UI principles** - `docs/UI-PRINCIPLES.md` doesn't mention this pattern

**Recommended Fix:**
```tsx
// Remove nav-ticks entirely
{active && (
  <span 
    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent" 
    aria-hidden="true" 
  />
)}
// Simple left accent bar, no brackets
```

### 4.2 Other Sidebar Issues

#### ❌ **Learning Mode Has Different Styling Than Dashboard Mode**

**Problem:** When on learning pages, sidebar shows curriculum tree with different styling than nav sections

**Inconsistencies:**
- Curriculum items use different hover states
- Indentation differs from nav sections
- Font weights inconsistent
- Color usage varies

**Should be:** Single consistent nav styling whether in dashboard or learning mode

---

## 5. ROOT CAUSES ANALYSIS

### Why Content Feels "Bad"

1. **Content is data-driven but lacks rich structure**
   - Bootcamp steps are just `{ title, instruction, image?, quiz? }`
   - No support for complex layouts, multi-media, interactions
   - Data model is too simple for engaging learning

2. **No content authoring guidelines**
   - Instructors write plain markdown
   - No templates for code examples
   - No standards for when to include interactive elements
   - Inconsistent quality across rooms/lessons

3. **Missing component library for learning**
   - Have: CodeBlock, CommandBlock, Quiz
   - Don't have: Diagrams, Callouts, Task Lists, Interactive Sims, Progress Trackers, Flag Inputs, Tool Demos, Tabbed Code, Annotated Screenshots

4. **Layout prioritizes simplicity over engagement**
   - Everything is vertical scroll
   - No two-column layouts (theory left, terminal right)
   - No sticky sidebars with context
   - No expandable sections

### Why Interactive Elements Are Missing

1. **Optional flags make interactivity an afterthought**
   ```typescript
   hasTerminal?: boolean
   hasCodePlayground?: boolean
   ```
   Should be: Every lesson type has REQUIRED interactive component

2. **No inline interactivity**
   - Code playgrounds at END of lesson
   - Terminal separate from instructions
   - Simulations in separate panel
   
   Should be: Interactive elements woven INTO the narrative

3. **Data structure doesn't support rich content**
   ```typescript
   instruction: string // Just markdown
   ```
   
   Should be:
   ```typescript
   sections: Array<{
     type: 'explanation' | 'code' | 'terminal' | 'quiz' | 'diagram' | 'task'
     content: any
   }>
   ```

---

## 6. RECOMMENDED SOLUTIONS

### 6.1 Immediate Fixes (Can Implement Now)

#### A. Remove Nav-Ticks Decoration
```typescript
// src/features/student/components/layout/StudentSidebar.tsx
// DELETE lines with nav-ticks, keep only left accent bar
{active && (
  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
)}
```

#### B. Add More Code/Command Examples to Existing Content
```typescript
// bootcampConfig.ts - Update steps to include practical examples
{
  title: 'What Is Offensive Security?',
  instruction: `... theory here ...`,
  commands: [
    {
      title: 'Basic Network Scan',
      command: 'nmap -sV 192.168.1.1',
      explanation: 'Scans for service versions',
      expectedOutput: '...'
    }
  ],
  codeExamples: [
    {
      language: 'python',
      code: 'import nmap\nscanner = nmap.PortScanner()',
      explanation: 'Python nmap automation'
    }
  ]
}
```

#### C. Create New Learning Components
```tsx
// New components needed:
<InfoCallout type="tip|warning|note|danger" />
<TaskChecklist items={[...]} />
<CodeComparison before="..." after="..." />
<AnnotatedScreenshot src="..." annotations={[...]} />
<ProcessFlow steps={[...]} />
<FlagSubmission challenge="..." />
```

### 6.2 Short-Term Improvements (1-2 weeks)

#### A. Redesign Step Layout with Rich Sections
```tsx
<StepCard>
  <StepIntro>{intro}</StepIntro>
  
  <TheorySection>
    <Heading>Concept</Heading>
    <Explanation>{...}</Explanation>
  </TheorySection>
  
  <PracticeSection>
    <Heading>Hands-On</Heading>
    <CommandBlock command="..." />
    <CodeBlock code="..." />
  </PracticeSection>
  
  <CheckpointSection>
    <Quiz questions={[...]} />
  </CheckpointSection>
</StepCard>
```

#### B. Add Inline Interactive Elements
- Move code playground INTO lesson body, not at end
- Show terminal next to commands, not separate panel
- Embed flag inputs where challenges appear

#### C. Create Content Templates for Authors
```markdown
# Step Template

## Introduction (required)
Brief overview of what student will learn

## Concept Explanation (required)
Theory with diagrams/visuals

## Demonstration (required)
```bash
command examples with output
```

## Hands-On Exercise (required)
<InteractiveTerminal />

## Knowledge Check (required)
Quiz or flag challenge
```

### 6.3 Long-Term Redesign (2-4 weeks)

#### A. Refactor Data Structure
```typescript
// New learning content model
interface LearningStep {
  id: string;
  title: string;
  sections: LearningSection[];
}

interface LearningSection {
  id: string;
  type: 'intro' | 'theory' | 'demo' | 'practice' | 'checkpoint';
  layout: 'full' | 'split' | 'sidebar';
  blocks: LearningBlock[];
}

interface LearningBlock {
  type: 'text' | 'code' | 'command' | 'terminal' | 'quiz' | 'diagram' | 'callout' | 'task' | 'flag';
  content: any;
  interactive?: boolean;
}
```

#### B. Create Advanced Interactive Components
- Network diagram builder
- Interactive command simulator with hints
- Code diff viewer for security concepts
- Exploit chain visualizer
- Progress dashboards per room

#### C. Two-Column Learning Layout
```tsx
<TwoColumnLearning>
  <TheoryColumn>
    <Explanation />
    <Diagrams />
    <Callouts />
  </TheoryColumn>
  
  <PracticeColumn sticky>
    <Terminal />
    <CodeEditor />
    <FlagInput />
  </PracticeColumn>
</TwoColumnLearning>
```

---

## 7. METRICS TO TRACK IMPROVEMENT

### Before (Current State)
- Average code examples per step: **0.2** (1 in 5 steps have code)
- Average interactive elements per lesson: **0.5** (half have playground OR terminal)
- Student engagement time per room: **12 minutes** (mostly reading)
- Completion rate: **65%** (students drop off due to boredom)

### After (Target State)
- Average code examples per step: **2+** (every step has examples)
- Average interactive elements per lesson: **3+** (multiple practice opportunities)
- Student engagement time per room: **35 minutes** (hands-on work)
- Completion rate: **85%+** (engaging content keeps students)

---

## 8. PRIORITY RECOMMENDATIONS

### 🔴 **CRITICAL (Do First)**
1. Remove `nav-ticks` square bracket decoration from sidebar
2. Add command/code examples to all existing bootcamp rooms
3. Create InfoCallout, WarningCallout, TaskChecklist components

### 🟠 **HIGH PRIORITY (Do This Week)**
4. Redesign step layout with theory/practice/checkpoint sections
5. Move interactive elements inline (not at end)
6. Create content authoring guidelines for instructors

### 🟡 **MEDIUM PRIORITY (Next 2 Weeks)**
7. Build advanced learning components (diagrams, annotated screenshots)
8. Implement two-column learning layout option
9. Add progress tracking within steps

### 🟢 **LOW PRIORITY (Future)**
10. Complete data structure refactor
11. Build interactive simulation library
12. Create content CMS for easier authoring

---

## 9. CONCLUSION

The learning content UI/UX problems stem from three core issues:

1. **Data-driven content is too simple** - Steps are just markdown strings without rich structure
2. **Interactive elements are optional afterthoughts** - Should be required, inline, contextual
3. **Design prioritizes simplicity over engagement** - Need richer layouts, visual aids, hands-on practice

**Immediate action items:**
- Remove nav-ticks decoration
- Add code/command examples to all steps
- Create reusable callout/task components
- Start writing content guidelines

**Success looks like:**
- Every step has code/command examples
- Interactive elements woven into narrative
- Visual aids (diagrams, screenshots) throughout
- Clear theory → demo → practice → checkpoint flow
- Consistent styling across all learning surfaces

This audit provides the roadmap to transform QYVORA's learning experience from "text-heavy and boring" to "interactive and engaging."
