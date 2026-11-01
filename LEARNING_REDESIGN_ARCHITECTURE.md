# QYVORA Learning System Redesign - Architecture Design

**Status:** Phase 2 - Architecture Design  
**Date:** 2026-11-01  
**Reference:** React Learn docs navigation pattern

---

## 1. DESIGN PRINCIPLES

### 1.1 Core Principles

1. **Single Navigation Source** - StudentSidebar is the ONLY permanent navigation component
2. **Context-Aware** - Navigation adapts to learning context (bootcamp/course/lab)
3. **Progressive Disclosure** - Show curriculum when in learning mode, hide when not
4. **Preserve Functionality** - All existing routes, progress tracking, and features intact
5. **Documentation Feel** - Clean reading surface with persistent curriculum tree

### 1.2 Visual Reference Mapping

**React Learn Docs → QYVORA Learning:**
- Sidebar navigation tree → StudentSidebar (curriculum mode)
- Main content area → Full-width learning content
- Breadcrumbs → Enhanced StudentTopbar breadcrumbs
- Mobile hamburger → StudentBottomNav with curriculum sheet
- Code examples → Existing CodeBlock component
- Section headings → Blog typography pattern

---

## 2. NAVIGATION ARCHITECTURE

### 2.1 StudentSidebar States

The StudentSidebar will have **two distinct modes**:

#### Mode A: Dashboard Navigation (Current)
```
┌─────────────────────┐
│ QYVORA    [Logo]    │
│ // MAIN             │
│ ○ Home              │
│ ○ Courses           │
│ ○ Bootcamp          │
│ ○ Labs              │
│ ○ Marketplace       │
│                     │
│ // PRACTICE         │
│ ○ Competitive       │
│ ○ Networks          │
│                     │
│ // ACCOUNT          │
│ ○ Profile           │
│ ○ Certificates      │
│ ○ Notifications (3) │
│ ○ Settings          │
│                     │
│ // TOOLS            │
│ [Terminal][Network] │
│                     │
│ [Collapse]          │
│ [Log Out]           │
└─────────────────────┘
```

#### Mode B: Learning Navigation (NEW)
```
┌─────────────────────┐
│ QYVORA    [Logo]    │
│ [← Back to Home]    │ ← New exit button
│                     │
│ // HACKER PROTOCOL  │ ← Context title
│                     │
│ ▼ Phase 1: Recon    │ ← Collapsible section
│   ✓ Room 1: Intel   │ ← Completed
│   ● Room 2: OSINT   │ ← Current/active
│   ○ Room 3: Enum    │ ← Upcoming
│   🔒 Room 4: Map    │ ← Locked
│                     │
│ ▶ Phase 2: Exploit  │ ← Collapsed section
│                     │
│ ▶ Phase 3: Post     │ ← Collapsed section
│                     │
│ // TOOLS            │
│ [Terminal][Network] │
│                     │
│ [Collapse]          │
│ [Exit Learning]     │ ← Changed from Log Out
└─────────────────────┘
```

**Key Differences:**
- Dashboard mode: Static navigation sections
- Learning mode: Dynamic curriculum tree based on current learning context
- Smooth transition animation between modes
- Tools section always present in both modes

### 2.2 Mode Switching Logic

```typescript
interface LearningContext {
  type: 'bootcamp' | 'course' | 'lab' | null;
  title: string;
  curriculum: CurriculumItem[];
  exitPath: string;
}

// Detect learning context from route
const learningContext = useMemo(() => {
  // Bootcamp room pages
  if (pathname.match(/\/dashboard\/bootcamps\/[^/]+\/phases\/[^/]+\/rooms\//)) {
    return {
      type: 'bootcamp',
      title: 'Hacker Protocol Bootcamp',
      curriculum: buildBootcampCurriculum(bootcampId, currentPhase, currentRoom),
      exitPath: `/dashboard/bootcamps/${bootcampId}`
    };
  }
  
  // Course lesson pages
  if (pathname.match(/\/dashboard\/courses\/[^/]+/)) {
    return {
      type: 'course',
      title: course.title,
      curriculum: buildCourseCurriculum(courseId, currentLesson),
      exitPath: '/dashboard/courses'
    };
  }
  
  // Lab pages
  if (pathname.match(/\/dashboard\/labs\/[^/]+/)) {
    return {
      type: 'lab',
      title: `${labType} Lab`,
      curriculum: buildLabCurriculum(labType, currentScenario),
      exitPath: '/dashboard/labs'
    };
  }
  
  return null;
}, [pathname, bootcampId, courseId, labType]);

// Sidebar renders different content based on context
{learningContext ? (
  <LearningNav context={learningContext} />
) : (
  <DashboardNav />
)}
```

### 2.3 Curriculum Tree Structure

```typescript
interface CurriculumItem {
  id: string;
  number: number;
  title: string;
  type: 'section' | 'item';
  status: 'locked' | 'upcoming' | 'active' | 'completed';
  children?: CurriculumItem[];
  href: string;
}

// Example bootcamp curriculum
const bootcampCurriculum: CurriculumItem[] = [
  {
    id: 'phase1',
    number: 1,
    title: 'Phase 1: Reconnaissance',
    type: 'section',
    status: 'active',
    href: '#',
    children: [
      { id: 'room1', number: 1, title: 'Intel Gathering', type: 'item', status: 'completed', href: '...' },
      { id: 'room2', number: 2, title: 'OSINT Techniques', type: 'item', status: 'active', href: '...' },
      { id: 'room3', number: 3, title: 'Network Enum', type: 'item', status: 'upcoming', href: '...' },
      { id: 'room4', number: 4, title: 'Target Mapping', type: 'item', status: 'locked', href: '...' },
    ]
  },
  {
    id: 'phase2',
    number: 2,
    title: 'Phase 2: Exploitation',
    type: 'section',
    status: 'locked',
    href: '#',
    children: [...]
  }
];
```

### 2.4 Mobile Navigation

**Mobile Strategy:**
- Keep existing StudentBottomNav structure
- "Learn" button opens curriculum bottom sheet (instead of general links)
- Bottom sheet shows same curriculum tree as desktop sidebar
- Touch-friendly item sizes (min-h-[48px])

```
Desktop (lg+):              Mobile (<lg):
┌──────┬────────────┐      ┌──────────────────┐
│      │            │      │   Breadcrumbs    │
│ Cur- │  Content   │      │   [≡] [CP] [🔔] │
│ ric  │            │      ├──────────────────┤
│ ulum │            │      │                  │
│      │            │      │    Content       │
│ Tree │            │      │                  │
│      │            │      │                  │
└──────┴────────────┘      └──────────────────┘
                           ┌──────────────────┐
                           │[Home][Learn][…]  │← Tapping "Learn"
                           └──────────────────┘   opens curriculum
```

---

## 3. TOPBAR ENHANCEMENTS

### 3.1 Enhanced Breadcrumbs

**Current:**
```
Phase 1: Reconnaissance > Room 2: OSINT
```

**Enhanced:**
```
Hacker Protocol Bootcamp / Phase 1: Reconnaissance / Room 2: OSINT Techniques
```

**Features:**
- Full hierarchy visible
- Each segment clickable (except current)
- Chevron separators (›)
- Current page in `font-black` with `aria-current="page"`
- Truncate on mobile (show last 2 segments)

### 3.2 Lesson Progress Chip

**Course pages only:**
```tsx
<span className="hidden min-h-[44px] items-center rounded-xl border border-border-subtle bg-surface px-3 font-mono text-xs font-bold text-text-primary sm:flex">
  3/12 Lessons
</span>
```

**Position:** Right side of topbar, before notifications bell

---

## 4. CONTENT LAYOUT

### 4.1 Learning Page Structure

```tsx
<div className="min-h-dvh w-full bg-canvas">
  {/* No separate page header - content starts immediately after topbar clearance */}
  <div className="w-full px-3 pb-16 pt-5 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
    
    {/* Optional: Kicker + Title for course/lab landing pages */}
    {showHeader && (
      <header className="mb-8">
        <p className="mb-2 type-label uppercase tracking-[0.12em] text-accent">
          {category}
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight text-text-primary md:text-4xl lg:text-5xl">
          {title}
        </h1>
      </header>
    )}

    {/* Main learning content - full width */}
    <div className="max-w-none">
      <FocusedStepList
        items={steps}
        renderActive={(idx) => (
          <article className="space-y-6 md:space-y-8">
            {/* Step content with documentation typography */}
            <LearningContentRenderer {...} />
            
            {/* Navigation at bottom of each step */}
            <LearningNav {...} />
          </article>
        )}
        onSelect={handleStepSelect}
      />
    </div>
  </div>
</div>
```

### 4.2 Typography System

**Apply blog typography pattern to learning content:**

```css
/* Body text */
.learning-prose {
  @apply text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8;
}

/* Headings */
.learning-h2 {
  @apply text-2xl md:text-4xl font-black uppercase tracking-tight mb-6 md:mb-8 text-text-primary;
}

.learning-h3 {
  @apply text-xl md:text-2xl font-black uppercase tracking-tight mb-5 md:mb-6 text-accent;
}

.learning-h4 {
  @apply text-base md:text-lg font-black uppercase tracking-tight mb-4 mt-4 text-text-primary;
}
```

### 4.3 Step Card Design

**Enhanced FocusedStepList items:**

```tsx
// Collapsed (completed/upcoming) - Clean rows
<button className="group w-full flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface hover:border-accent/40 hover:bg-surface-raised px-4 py-3.5 min-h-[48px]">
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent-dim/20 text-accent">
    {isCompleted ? <Check /> : number}
  </span>
  <span className="flex-1 text-left">
    <span className="block text-sm font-bold text-text-primary">{title}</span>
    <span className="block text-xs font-black uppercase tracking-widest text-accent">
      {status}
    </span>
  </span>
  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent" />
</button>

// Expanded (active) - Full content with documentation styling
<article className="space-y-6 md:space-y-8 rounded-2xl border border-accent/30 bg-bg-card p-6 md:p-8">
  <header>
    <div className="flex items-center gap-3 mb-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-accent bg-accent/10 font-mono text-sm font-black text-accent">
        {number}
      </span>
      <h2 className="text-2xl md:text-3xl font-black text-text-primary">{title}</h2>
    </div>
    {badges && <div className="flex gap-2">{badges}</div>}
  </header>
  
  <div className="learning-prose space-y-6 md:space-y-8">
    {/* Content blocks */}
  </div>
  
  <LearningNav {...} />
</article>
```

---

## 5. COMPONENT ARCHITECTURE

### 5.1 New Components

#### `LearningCurriculumTree.tsx`
```typescript
interface LearningCurriculumTreeProps {
  items: CurriculumItem[];
  activeId: string;
  onSelect: (item: CurriculumItem) => void;
  collapsed?: boolean;
}

/**
 * Renders the curriculum tree for bootcamp/course/lab navigation.
 * Used inside StudentSidebar when in learning mode.
 * 
 * Features:
 * - Nested collapsible sections
 * - Status indicators (completed, active, locked)
 * - Keyboard navigation
 * - Active item highlighting
 */
export function LearningCurriculumTree({...}) {
  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([/* sections with active item */])
  );
  
  return (
    <nav aria-label="Learning curriculum">
      {items.map(item => (
        item.type === 'section' ? (
          <CurriculumSection
            key={item.id}
            item={item}
            expanded={expandedSections.has(item.id)}
            onToggle={() => toggleSection(item.id)}
            activeId={activeId}
            onSelect={onSelect}
          />
        ) : (
          <CurriculumItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            onSelect={onSelect}
          />
        )
      ))}
    </nav>
  );
}
```

#### `CurriculumBottomSheet.tsx`
```typescript
interface CurriculumBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculum: CurriculumItem[];
  activeId: string;
  title: string;
}

/**
 * Mobile curriculum navigation via bottom sheet.
 * Triggered from StudentBottomNav "Learn" button.
 */
export function CurriculumBottomSheet({...}) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent ariaLabel={`${title} curriculum`}>
        <div className="px-3 py-4">
          <h2 className="mb-4 text-lg font-black text-text-primary">{title}</h2>
          <LearningCurriculumTree
            items={curriculum}
            activeId={activeId}
            onSelect={(item) => {
              navigate(item.href);
              onOpenChange(false);
            }}
          />
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}
```

#### `EnhancedBreadcrumb.tsx`
```typescript
interface BreadcrumbSegment {
  label: string;
  href?: string; // undefined = not clickable (current page)
}

/**
 * Enhanced breadcrumb with full hierarchy and click navigation.
 * Shows: Bootcamp > Phase > Room
 * Mobile: Truncates to last 2 segments
 */
export function EnhancedBreadcrumb({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-hidden">
      {segments.map((segment, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <ChevronRight className="h-3 w-3 shrink-0 text-text-muted" aria-hidden="true" />
          )}
          {segment.href ? (
            <Link
              to={segment.href}
              className="truncate text-sm font-medium text-text-muted hover:text-accent transition-colors"
            >
              {segment.label}
            </Link>
          ) : (
            <span
              className="truncate text-sm font-black text-text-primary"
              aria-current="page"
            >
              {segment.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
```

### 5.2 Modified Components

#### `StudentSidebar.tsx` - Add Learning Mode

```typescript
// Add learning context detection
const learningContext = useLearningContext();
const isLearningMode = Boolean(learningContext);

return (
  <aside className={`... ${isLearningMode ? 'learning-mode' : ''}`}>
    {/* Header stays same */}
    <div className="flex h-20 items-center ...">
      <Link to="/dashboard">QYVORA Logo</Link>
    </div>
    
    {/* Navigation area - conditional rendering */}
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {isLearningMode ? (
        <>
          {/* Back to dashboard button */}
          <Button
            variant="ghost"
            onClick={() => navigate(learningContext.exitPath)}
            className="mb-4 w-full"
          >
            <ArrowLeft /> Back to Dashboard
          </Button>
          
          {/* Curriculum tree */}
          <div className="mb-4">
            <h3 className="mb-2 type-label px-3 text-text-tertiary">
              <span className="text-accent">//&nbsp;</span>
              {learningContext.title}
            </h3>
            <LearningCurriculumTree
              items={learningContext.curriculum}
              activeId={getCurrentItemId()}
              onSelect={handleCurriculumSelect}
              collapsed={collapsed}
            />
          </div>
        </>
      ) : (
        <>
          {/* Existing dashboard navigation sections */}
          {NAV_SECTIONS.map(section => (...))}
        </>
      )}
    </nav>
    
    {/* Footer stays same - tools + collapse + logout */}
    <div className="border-t ...">
      {/* Tools cluster */}
      {/* Collapse button */}
      {/* Logout button */}
    </div>
  </aside>
);
```

#### `StudentBottomNav.tsx` - Add Curriculum Sheet

```typescript
// Add curriculum sheet state
const [curriculumOpen, setCurriculumOpen] = useState(false);
const learningContext = useLearningContext();

// Modify "Learn" button to open curriculum if in learning mode
const handleLearnClick = () => {
  if (learningContext) {
    setCurriculumOpen(true);
  } else {
    setSheet('learn'); // Existing behavior
  }
};

return (
  <>
    <nav className="...">
      {/* Existing bottom nav items, but Learn button calls handleLearnClick */}
    </nav>
    
    {/* Existing learn/practice sheets */}
    <BottomSheet open={sheet === 'learn'} ...>...</BottomSheet>
    
    {/* New curriculum sheet */}
    {learningContext && (
      <CurriculumBottomSheet
        open={curriculumOpen}
        onOpenChange={setCurriculumOpen}
        curriculum={learningContext.curriculum}
        activeId={getCurrentItemId()}
        title={learningContext.title}
      />
    )}
  </>
);
```

---

## 6. STATE MANAGEMENT

### 6.1 Learning Context Hook

```typescript
// src/core/hooks/useLearningContext.ts
export function useLearningContext(): LearningContext | null {
  const { pathname } = useLocation();
  const { bootcampId } = useParams();
  const { courseId } = useParams();
  const { labType } = useParams();
  
  // Bootcamp detection
  const bootcampMatch = pathname.match(/\/dashboard\/bootcamps\/([^/]+)\/phases\/([^/]+)\/rooms\/([^/]+)/);
  if (bootcampMatch) {
    const [, bootcampId, phaseId, roomId] = bootcampMatch;
    return {
      type: 'bootcamp',
      bootcampId,
      phaseId,
      roomId,
      title: 'Hacker Protocol Bootcamp',
      curriculum: buildBootcampCurriculum(bootcampId, phaseId, roomId),
      exitPath: `/dashboard/bootcamps/${bootcampId}`
    };
  }
  
  // Course detection
  const courseMatch = pathname.match(/\/dashboard\/courses\/([^/]+)/);
  if (courseMatch && courseId) {
    const course = getCourseById(courseId);
    return {
      type: 'course',
      courseId,
      title: course?.title || 'Course',
      curriculum: buildCourseCurriculum(courseId, getCurrentLessonIdx()),
      exitPath: '/dashboard/courses'
    };
  }
  
  // Lab detection
  const labMatch = pathname.match(/\/dashboard\/labs\/([^/]+)/);
  if (labMatch && labType) {
    return {
      type: 'lab',
      labType,
      title: `${labType.replace(/-/g, ' ')} Lab`,
      curriculum: buildLabCurriculum(labType, getCurrentScenarioIdx()),
      exitPath: '/dashboard/labs'
    };
  }
  
  return null;
}
```

### 6.2 Curriculum Builders

```typescript
// src/shared/utils/curriculumBuilders.ts

export function buildBootcampCurriculum(
  bootcampId: string,
  currentPhaseId: string,
  currentRoomId: string
): CurriculumItem[] {
  const config = BOOTCAMP_CONFIG;
  const apiData = useBootcampProgress(bootcampId);
  
  return config.phases.map(phase => ({
    id: phase.id,
    number: phase.number,
    title: phase.title,
    type: 'section',
    status: getPhaseStatus(phase, currentPhaseId),
    href: '#',
    children: phase.rooms.map(room => ({
      id: room.id,
      number: room.number,
      title: room.title,
      type: 'item',
      status: getRoomStatus(room, currentRoomId, apiData),
      href: `/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${room.id}`
    }))
  }));
}

export function buildCourseCurriculum(
  courseId: string,
  currentLessonIdx: number
): CurriculumItem[] {
  const course = getCourseById(courseId);
  const completedLessons = getCompletedLessons(courseId);
  
  return course.lessons.map((lesson, idx) => ({
    id: lesson.id,
    number: idx + 1,
    title: lesson.title,
    type: 'item',
    status: getLessonStatus(lesson.id, idx, currentLessonIdx, completedLessons),
    href: `/dashboard/courses/${courseId}?lesson=${idx}`
  }));
}

export function buildLabCurriculum(
  labType: string,
  currentScenarioIdx: number
): CurriculumItem[] {
  const scenarios = getLabScenarios(labType);
  
  return scenarios.map((scenario, idx) => ({
    id: scenario.id,
    number: idx + 1,
    title: scenario.title,
    type: 'item',
    status: getScenarioStatus(scenario, idx, currentScenarioIdx),
    href: `/dashboard/labs/${labType}?scenario=${idx}`
  }));
}
```

---

## 7. RESPONSIVE BEHAVIOR

### 7.1 Breakpoint Strategy

```
Mobile (<1024px):
- StudentSidebar: hidden
- StudentBottomNav: visible, "Learn" opens curriculum sheet
- Content: full-width
- Breadcrumbs: show last 2 segments

Desktop (≥1024px):
- StudentSidebar: visible with curriculum in learning mode
- StudentBottomNav: hidden
- Content: full-width (sidebar doesn't constrain)
- Breadcrumbs: show full hierarchy
```

### 7.2 Sidebar Responsive Classes

```tsx
<aside className={`
  chrome-fixed fixed inset-y-0 left-0 z-[90]
  hidden lg:flex flex-col
  border-r border-border-subtle bg-canvas
  transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)]
  ${collapsed ? 'w-[76px]' : 'w-[264px]'}
  ${isLearningMode ? 'learning-mode' : 'dashboard-mode'}
`}>
```

### 7.3 Content Responsive Padding

```tsx
<div className={`
  w-full
  px-3 md:px-4 lg:px-6
  pb-16 md:pb-20 lg:pb-24
  pt-5 md:pt-8
  ${isLearningMode ? 'learning-content' : ''}
`}>
```

---

## 8. ANIMATION & TRANSITIONS

### 8.1 Sidebar Mode Transition

```css
/* Smooth transition between dashboard and learning modes */
.student-sidebar {
  transition: all var(--dur-base) var(--ease-smooth);
}

.student-sidebar nav {
  transition: opacity var(--dur-fast) var(--ease-smooth);
}

/* Fade out old content, fade in new content */
.student-sidebar.transitioning nav {
  opacity: 0;
}
```

### 8.2 Curriculum Tree Animations

```typescript
// Use framer-motion for collapsible sections
<motion.div
  initial={false}
  animate={{ height: expanded ? 'auto' : 0 }}
  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
>
  {children}
</motion.div>
```

### 8.3 Step Navigation

```typescript
// Scroll to step with smooth animation (respecting reduced motion)
const prefersReducedMotion = useReducedMotion();

function scrollToStep(stepId: string) {
  const element = document.getElementById(stepId);
  element?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start'
  });
}
```

---

## 9. ACCESSIBILITY

### 9.1 Keyboard Navigation

```typescript
// Curriculum tree keyboard support
function handleKeyDown(e: KeyboardEvent, item: CurriculumItem) {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      onSelect(item);
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusPreviousItem();
      break;
    case 'ArrowDown':
      e.preventDefault();
      focusNextItem();
      break;
    case 'ArrowLeft':
      if (item.type === 'section' && expanded) {
        e.preventDefault();
        collapseSection();
      }
      break;
    case 'ArrowRight':
      if (item.type === 'section' && !expanded) {
        e.preventDefault();
        expandSection();
      }
      break;
  }
}
```

### 9.2 ARIA Labels

```tsx
// Curriculum tree
<nav aria-label="Learning curriculum">

// Section
<button
  aria-expanded={expanded}
  aria-label={`${title}, ${children.length} items`}
>

// Item
<Link
  aria-current={isActive ? 'page' : undefined}
  aria-label={`${number}. ${title}${isCompleted ? ' - completed' : ''}${isLocked ? ' - locked' : ''}`}
>

// Progress announcements
<div
  role="status"
  aria-live="polite"
  className="sr-only"
>
  {announcement}
</div>
```

### 9.3 Focus Management

```typescript
// When switching modes, focus the first item
useEffect(() => {
  if (isLearningMode) {
    const firstItem = document.querySelector('[data-curriculum-item]');
    if (firstItem instanceof HTMLElement) {
      firstItem.focus();
    }
  }
}, [isLearningMode]);

// When navigating to a new step, announce it
useEffect(() => {
  if (currentStep) {
    announceToScreenReader(`Now viewing: ${currentStep.title}`);
  }
}, [currentStep]);
```

---

## 10. IMPLEMENTATION CHECKLIST

### Phase 2A: Foundation Components
- [ ] Create `LearningCurriculumTree` component
- [ ] Create `CurriculumBottomSheet` component  
- [ ] Create `useLearningContext` hook
- [ ] Create curriculum builder utilities
- [ ] Create `EnhancedBreadcrumb` component

### Phase 2B: Sidebar Integration
- [ ] Add learning mode detection to StudentSidebar
- [ ] Add curriculum tree rendering in learning mode
- [ ] Add mode transition animations
- [ ] Add "Back to Dashboard" button
- [ ] Test sidebar collapse in learning mode

### Phase 2C: Mobile Integration
- [ ] Update StudentBottomNav to detect learning mode
- [ ] Integrate CurriculumBottomSheet
- [ ] Test bottom sheet navigation
- [ ] Verify safe-area handling

### Phase 2D: Topbar Enhancements
- [ ] Implement EnhancedBreadcrumb in StudentTopbar
- [ ] Add lesson progress chip component
- [ ] Update breadcrumb data sources
- [ ] Test mobile breadcrumb truncation

### Phase 2E: Testing & Refinement
- [ ] Test desktop sidebar transitions
- [ ] Test mobile bottom sheet
- [ ] Test all breakpoints
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Test reduced motion
- [ ] Performance profiling

---

## 11. SUCCESS METRICS

### Functional Requirements
- ✅ Sidebar shows appropriate navigation for context
- ✅ Mode transitions are smooth (no flashing)
- ✅ Curriculum tree shows correct status for all items
- ✅ Navigation works via sidebar, breadcrumbs, and mobile sheet
- ✅ Collapsed sidebar still functional in learning mode
- ✅ All existing routes still work
- ✅ Progress tracking unchanged

### UX Requirements
- ✅ Navigation feels like React docs (persistent tree)
- ✅ Current location always clear
- ✅ Easy to navigate between phases/lessons
- ✅ Easy to exit back to dashboard
- ✅ Mobile navigation discoverable
- ✅ Touch targets meet 48px minimum

### Technical Requirements
- ✅ No console errors
- ✅ TypeScript compiles
- ✅ Tests pass
- ✅ Bundle size acceptable
- ✅ Performance: <100ms mode transitions
- ✅ Accessibility: WCAG 2.1 AA

---

## 12. NEXT STEPS

After completing Phase 2 architecture design, proceed to:

1. **Phase 3: Core Implementation** - Build the foundation components
2. **Phase 4: HPB Integration** - Apply to bootcamp rooms first
3. **Phase 5: Full Migration** - Extend to courses and labs
4. **Phase 6: Polish** - Responsive refinement and animations
5. **Phase 7: Validation** - Full testing and quality assurance

---

**Architecture Document Complete**
