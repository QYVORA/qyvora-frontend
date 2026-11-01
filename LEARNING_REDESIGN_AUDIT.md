# QYVORA Learning System Redesign - Implementation Audit

**Status:** Phase 1 Complete - Comprehensive Audit  
**Date:** 2026-11-01  
**Objective:** Documentation-style UI redesign inspired by React Learn docs

---

## EXECUTIVE SUMMARY

The QYVORA learning system consists of three primary surfaces (Bootcamp Rooms, Course Lessons, Lab Walkthroughs) that currently use shared components but have inconsistent navigation patterns. This redesign will unify them with a documentation-style interface inspired by React's Learn docs while preserving all existing functionality.

**Critical Integration Point:** The existing StudentSidebar is the ONLY global navigation component. Any contextual curriculum navigation must integrate with it, NOT create a competing rail.

---

## 1. CURRENT ARCHITECTURE MAP

### 1.1 Learning Routes

**Bootcamp Routes:**
- `/dashboard/bootcamps/:bootcampId` → BootcampCoursePage (phase overview)
- `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId` → BootcampRoomPage (step walkthrough)
- Legacy: `/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId` (also supported)

**Course Routes:**
- `/dashboard/courses` → MyCoursesPage (course listing)
- `/dashboard/courses/:courseId` → CourseLessonPage (lesson viewer with ?lesson=N param)

**Lab Routes:**
- `/dashboard/labs` → LabsPage (lab listing)
- `/dashboard/labs/privesc` → PrivescLab
- `/dashboard/labs/passwords` → PasswordLab
- `/dashboard/labs/sql-injection` → SqlInjectionLab
- `/dashboard/labs/osint` → OsintLab
- `/dashboard/labs/kill-chain` → KillChainLab
- Plus 8 more lab types (13 total lab routes)

### 1.2 Layout Hierarchy

```
AppShell (src/features/student/layouts/AppShell.tsx)
├── StudentTopbar (contextual breadcrumbs, CP balance, notifications)
├── StudentSidebar (desktop navigation rail - SINGLE GLOBAL NAV)
├── StudentBottomNav (mobile navigation - 5 primary items)
└── Page Content (with pt-20 md:pt-24 clearance)
```

**Critical Rules:**
- StudentSidebar is the ONLY global navigation on desktop (`lg+`)
- StudentBottomNav is the ONLY global navigation on mobile (`<lg`)
- Learning pages MUST NOT add a second permanent sidebar
- Topbar shows context (breadcrumbs) NOT primary navigation

### 1.3 Shared Learning Components

**Primary Components:**
- `FocusedStepList` - ONE active step expanded, others collapsed to rows
- `LearningWorkspaceShell` - Title, stats, progress, optional outline sidebar
- `StepRenderer` - Renders individual step with number header
- `LearningNav` - Previous/Next/Complete buttons
- `LearningCard` - Canonical card for all learning items
- `TerminalWrapper` - Full terminal modal
- `LearningContentRenderer` - V2 semantic block renderer

**Secondary Components:**
- `StepNumberHeader` - Step number badge + title
- `CommandExplanation` - Command blocks with copy
- `LearningAccordion` - Collapsible curriculum sections
- `LearningFilterStrip` - Filter pills for listing pages

### 1.4 Current Learning Flow

**Bootcamp Rooms:**
1. URL: `/dashboard/bootcamps/bc_1775270338500/phases/phase1/rooms/room1?step=0`
2. Loads room data from API: `/student/course?bootcampId=...`
3. Renders steps via `StepCard` components
4. Tracks viewed steps in localStorage: `hpb_viewedSteps_phase1_room1`
5. Quiz gate at end (QuizModal + QuizGateModal)
6. Completion: POST to `/student/modules/{phaseNum}/rooms/{roomId}/complete`

**Course Lessons:**
1. URL: `/dashboard/courses/terminal-mastery?lesson=2`
2. Loads lesson from static data: `getCourseById()`
3. Converts markdown to V2 learning blocks
4. Renders via `LearningContentRenderer`
5. Progress stored in localStorage: `qyvora_course_progress_${courseId}`
6. Completion: POST to `/student/courses/${courseId}/complete`

**Lab Walkthroughs:**
1. URL: `/dashboard/labs/privesc?scenario=0`
2. Each lab page is a separate component (PrivescLab, PasswordLab, etc.)
3. Uses scenario-based structure with terminal simulations
4. Flag validation for completion

### 1.5 Progress Tracking

**Storage Mechanisms:**
- Bootcamp: localStorage + server API (`/student/modules/.../complete`)
- Courses: localStorage + server API (`/student/courses/.../complete`)
- Labs: Flag submission + server validation

**Progress State:**
- Bootcamp: `viewed` (localStorage) + `completed` (server)
- Courses: `completedLessons` set (localStorage) + course complete (server)
- Labs: Scenario completion via flag validation

### 1.6 Data Sources

**Bootcamp:**
- Static: `BOOTCAMP_CONFIG` (src/features/student/constants/bootcampConfig.ts)
- Dynamic: API `/student/course?bootcampId=...` returns modules/rooms/completion

**Courses:**
- Static only: `src/features/student/data/courses/` 
- 12 courses across 6 categories
- Each lesson has instruction (markdown), quiz, code playground, terminal commands

**Labs:**
- Scenario data: `src/features/student/data/simulations/`
- Terminal commands: 114+ commands in simulation system
- Each lab has multiple difficulty-graded scenarios

---

## 2. EXISTING DESIGN PATTERNS

### 2.1 Typography

**Current:**
- Body: `text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]`
- Headings: `font-black uppercase tracking-tight`
- h2: `text-2xl md:text-4xl mb-6 md:mb-8 text-text-primary`
- h3: `text-xl md:text-2xl mb-5 md:mb-6 text-accent`

**Design System:**
- Accent: `#06B66F` (only green)
- Font: JetBrains Mono (body), Space Grotesk (headings)
- Background: `#000000` with surface layers

### 2.2 Navigation Patterns

**Desktop Current:**
- Fixed StudentSidebar (left): `w-[264px]` expanded, `w-[76px]` collapsed
- Sections: Main, Practice, Account
- Icons + labels, active state with accent left bar
- Tools section: Terminal, Network Lab buttons

**Mobile Current:**
- Fixed StudentBottomNav (bottom): 5 items
- Home · Learn (sheet) · Practice (sheet) · Profile · Settings
- Learn/Practice open BottomSheet with navigation links

### 2.3 Learning Page Patterns

**Current Shell Pattern:**
```tsx
<LearningWorkspaceShell
  kicker="Course Category"
  title="Lesson Title"
  stats={[{ label: 'rooms', value: 19 }]}
  progress={{ value: 45, label: '45%' }}
  outline={[{ id: 'section-1', label: 'Introduction' }]}
>
  <FocusedStepList
    items={steps}
    renderActive={(idx) => <StepContent />}
    onSelect={setActiveStep}
  />
</LearningWorkspaceShell>
```

**Current Issues:**
1. Outline sidebar competes with global StudentSidebar
2. No persistent curriculum tree across rooms/lessons
3. Breadcrumbs only show current location, not full hierarchy
4. Mobile navigation hides curriculum (must open bottom sheet)

---

## 3. REACT DOCS REFERENCE PATTERNS

**Key Characteristics:**
1. **Persistent Navigation Tree** - Always visible on desktop, shows:
   - Current section highlighted
   - Nested structure (Learn > Quick Start > Creating components)
   - Completion state for sections
   - Next/previous clear

2. **Clean Reading Surface** - Documentation content:
   - Full-width prose
   - Code blocks with copy buttons
   - Interactive examples
   - Clear section headings

3. **Mobile Adaptation** - Responsive:
   - Hamburger menu for navigation tree
   - Full-width content
   - Touch-friendly controls

4. **Breadcrumb Trail** - Shows hierarchy:
   - Home > Learn > Quick Start
   - Clickable for navigation

---

## 4. INTEGRATION STRATEGY

### 4.1 The StudentSidebar Constraint

**Problem:** We cannot add a second permanent sidebar because StudentSidebar already exists as the global navigation.

**Solutions Evaluated:**

**Option A: Contextual Sidebar Extension (RECOMMENDED)**
- Extend StudentSidebar to show curriculum when on learning pages
- Main nav sections collapse when curriculum is active
- Smooth transition between navigation modes
- Desktop only - mobile uses bottom sheet
- Pros: Single navigation source of truth, clean integration
- Cons: More complex sidebar logic

**Option B: Temporary Overlay Panel**
- Keep StudentSidebar unchanged
- Add curriculum panel that overlays on demand (button trigger)
- Similar to bottom sheet but for desktop
- Pros: No sidebar modifications needed
- Cons: Less discoverable, not persistent like React docs

**Option C: In-Content Navigation**
- No sidebar changes
- Curriculum tree lives IN the page content (sticky on scroll)
- Mobile bottom sheet for curriculum
- Pros: Simplest integration
- Cons: Not as prominent as React docs pattern

**Decision: Option A - Contextual Sidebar Extension**
- Best matches React docs persistent navigation
- Maintains single navigation paradigm
- Provides clear learning context

### 4.2 Topbar Role

**Current:** Breadcrumbs show context (Phase 1 > Room 1)

**Redesign:**
- Keep breadcrumb pattern
- Expand to full hierarchy: Bootcamp > Phase 1 > Room 1
- Make breadcrumbs clickable for quick navigation
- Add lesson progress chip (e.g., "3/19")

### 4.3 Mobile Strategy

**Current:** Bottom sheet navigation for Learn/Practice sections

**Redesign:**
- Use existing bottom sheet pattern
- Curriculum tree in bottom sheet (replaces current "Learn" links)
- Full-width content on mobile
- Touch-friendly step cards

---

## 5. COMPONENT REUSE vs NEW

### 5.1 Keep and Enhance

**Components to Preserve:**
- `FocusedStepList` - Already implements one-active-step pattern
- `LearningCard` - Canonical learning card design
- `StepRenderer` - Good step structure
- `LearningNav` - Previous/Next/Complete buttons
- `LearningContentRenderer` - V2 block system
- `TerminalWrapper` - Terminal modal

**Enhancements Needed:**
- Add curriculum tree component
- Enhance breadcrumb component with full hierarchy
- Add mobile curriculum bottom sheet
- Improve step progress indicators

### 5.2 Create New

**New Components Needed:**
- `LearningCurriculumTree` - Nested navigation tree
- `LearningBreadcrumb` - Enhanced breadcrumb with hierarchy
- `CurriculumBottomSheet` - Mobile curriculum navigation
- `LessonProgressChip` - Compact lesson counter

### 5.3 Deprecate or Replace

**Consider Removing:**
- Duplicate navigation in `LearningWorkspaceShell` outline (conflicts with new curriculum tree)
- Separate quiz modals (consolidate to inline checkpoints)

---

## 6. DATA FLOW PRESERVATION

### 6.1 Bootcamp Room Flow (MUST PRESERVE)

```
1. Route: /dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId?step=N
2. Fetch: GET /student/course?bootcampId=...
3. State:
   - currentStepIdx (from ?step param)
   - viewedSteps (localStorage)
   - quizPassed (boolean)
   - timeSpent (session hook)
4. Completion: POST /student/modules/{phaseNum}/rooms/{roomId}/complete
5. Progress: Increment phase completion, show CelebrationModal
```

**Do NOT Change:**
- URL structure
- API endpoints
- Progress storage
- Quiz gate logic
- Session tracking

### 6.2 Course Lesson Flow (MUST PRESERVE)

```
1. Route: /dashboard/courses/:courseId?lesson=N
2. Data: Static getCourseById()
3. State:
   - currentLessonIdx (from ?lesson param)
   - completedLessons (localStorage set)
   - courseMeta (current/total, progress %)
4. Blocks: buildLessonBlocks() → V2 semantic blocks
5. Completion: POST /student/courses/:courseId/complete
```

**Do NOT Change:**
- Lesson indexing
- localStorage key format
- Block conversion logic
- Completion criteria

### 6.3 Lab Flow (MUST PRESERVE)

```
1. Route: /dashboard/labs/:labType?scenario=N
2. Data: Scenario data from src/features/student/data/simulations/
3. Terminal: SimulatedTerminal with 114+ commands
4. Completion: Flag validation
```

**Do NOT Change:**
- Scenario structure
- Terminal simulation system
- Flag validation logic

---

## 7. ACCESSIBILITY REQUIREMENTS

**Mandatory (from docs/ACCESSIBILITY.md):**
- Keyboard navigation: Tab, Enter, Escape, Arrow keys
- Screen reader: Semantic HTML, ARIA labels, skip links
- Touch targets: min-h-[48px] (44px mobile acceptable)
- Focus visible: Accent outline (don't suppress)
- Reduced motion: Respect prefers-reduced-motion
- Color contrast: WCAG 2.1 AA

**Learning-Specific:**
- Step navigation via keyboard (ArrowLeft/Right)
- Curriculum tree keyboard navigation
- Quiz/checkpoint keyboard interaction
- Progress announcements for screen readers

---

## 8. RESPONSIVE BREAKPOINTS

**Validation Matrix (from docs/RESPONSIVE.md):**
- 360px (minimum mobile)
- 768px (tablet)
- 1024px (desktop - sidebar appears)
- 1440px (wide desktop)
- 1920px (ultra-wide)

**Key Transitions:**
- `lg` (1024px): StudentSidebar appears, BottomNav hides
- Content: Full-width on mobile, constrained on desktop
- Navigation: Bottom sheet on mobile, sidebar on desktop

---

## 9. SAFE INTEGRATION POINTS

### 9.1 Lowest Risk Changes

1. **Enhance breadcrumbs** - Topbar component only
2. **Add lesson progress chip** - Topbar component only
3. **Improve step cards** - StepCard/StepRenderer styling
4. **Better code blocks** - Already using CodeBlock component

### 9.2 Medium Risk Changes

1. **Curriculum tree component** - New component, integrates with existing data
2. **Mobile curriculum sheet** - New BottomSheet instance
3. **Enhanced LearningCard** - Styling updates to existing component

### 9.3 Highest Risk Changes

1. **StudentSidebar curriculum mode** - Modifies critical global component
2. **Route structure changes** - Could break deep links (AVOID)
3. **Progress storage changes** - Could lose user progress (AVOID)

---

## 10. IMPLEMENTATION SEQUENCE

### Phase 1: Foundation (Low Risk)
- Create `LearningCurriculumTree` component (standalone)
- Create `CurriculumBottomSheet` component (standalone)
- Enhance breadcrumb component
- Add lesson progress chip
- Test in isolation

### Phase 2: Content Styling (Low Risk)
- Apply documentation typography to learning content
- Enhance code block presentation
- Improve step card design
- Add section dividers
- Test on one bootcamp room

### Phase 3: Navigation Integration (Medium Risk)
- Integrate curriculum tree in StudentSidebar (contextual mode)
- Add mobile curriculum bottom sheet trigger
- Test navigation flows
- Ensure sidebar collapse still works

### Phase 4: Full Migration (Medium Risk)
- Apply to all bootcamp rooms
- Apply to all course lessons
- Apply to all labs
- Verify progress tracking still works

### Phase 5: Polish (Low Risk)
- Responsive refinement
- Animation improvements
- Performance optimization
- Accessibility audit

---

## 11. FILES TO MODIFY

### Core Layout Files
- `src/features/student/components/layout/StudentSidebar.tsx` - Add curriculum mode
- `src/features/student/components/layout/StudentTopbar/StudentTopbar.tsx` - Enhanced breadcrumbs
- `src/shared/components/ui/Breadcrumb.tsx` - Full hierarchy support

### Learning Components
- `src/shared/components/learning/FocusedStepList.tsx` - Style enhancements
- `src/shared/components/learning/StepRenderer.tsx` - Documentation styling
- `src/shared/components/learning/LearningWorkspaceShell.tsx` - Remove competing outline
- `src/shared/components/learning/LearningNav.tsx` - Enhanced navigation

### Page Components
- `src/features/student/pages/BootcampRoomPage/index.tsx` - Integrate curriculum nav
- `src/features/student/pages/CourseLessonPage/index.tsx` - Integrate curriculum nav
- `src/features/student/pages/labs/*` - Apply consistent patterns

### New Files to Create
- `src/shared/components/learning/LearningCurriculumTree.tsx`
- `src/shared/components/learning/CurriculumBottomSheet.tsx`
- `src/shared/components/ui/LessonProgressChip.tsx`

---

## 12. TESTING CHECKLIST

### Functional Testing
- [ ] All bootcamp rooms load and navigate correctly
- [ ] Course lessons maintain progress across refreshes
- [ ] Lab scenarios complete and award CP
- [ ] Quiz gates function properly
- [ ] Terminal simulations work
- [ ] Deep links still work
- [ ] Browser back/forward work
- [ ] Mobile bottom nav works
- [ ] Desktop sidebar works

### Visual Testing
- [ ] Typography matches design system
- [ ] Spacing is consistent
- [ ] Colors use design tokens
- [ ] Code blocks render correctly
- [ ] Images display properly
- [ ] Progress bars animate
- [ ] Active states visible
- [ ] Hover states work

### Responsive Testing
- [ ] 360px: No horizontal overflow
- [ ] 768px: Tablet layout works
- [ ] 1024px: Desktop sidebar appears
- [ ] 1440px: Wide desktop layout
- [ ] 1920px: Ultra-wide layout

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces properly
- [ ] Focus visible on all interactive elements
- [ ] Touch targets meet minimum size
- [ ] Reduced motion respected
- [ ] Color contrast meets WCAG AA

### Performance Testing
- [ ] Page load time acceptable
- [ ] Navigation feels instant
- [ ] Animations smooth (60fps)
- [ ] No layout shift on load

---

## 13. ROLLBACK PLAN

**If Issues Discovered:**

1. **Visual only** - Revert styling changes
2. **Navigation broken** - Revert sidebar changes, use Option C (in-content nav)
3. **Progress lost** - Revert to previous version, restore from localStorage
4. **Critical failure** - Feature flag to toggle new UI off

**Feature Flag Strategy:**
- Add `ENABLE_DOCS_STYLE_LEARNING` flag
- Gate all new components behind flag
- Allow easy toggle for rollback

---

## 14. SUCCESS CRITERIA

**Must Have:**
1. ✅ All existing routes work unchanged
2. ✅ All progress tracking preserved
3. ✅ All quiz/completion logic intact
4. ✅ Desktop navigation feels like React docs
5. ✅ Mobile navigation is touch-friendly
6. ✅ Typography matches design system
7. ✅ Accessibility maintained
8. ✅ No console errors
9. ✅ Tests pass
10. ✅ Build succeeds

**Nice to Have:**
1. Faster perceived performance
2. Better mobile experience than before
3. More intuitive navigation
4. Clearer progress indicators

---

## 15. CONCLUSION

This redesign is feasible with careful integration into the existing StudentSidebar pattern. The key insight is that we're not building a second navigation system - we're extending the existing one with contextual learning navigation.

**Next Steps:**
1. ✅ Complete audit (this document)
2. ⏭️ Design shared responsive learning layout
3. ⏭️ Build core components in isolation
4. ⏭️ Integrate with StudentSidebar
5. ⏭️ Migrate bootcamp rooms
6. ⏭️ Migrate courses and labs
7. ⏭️ Responsive refinement
8. ⏭️ Cleanup and validation

**Estimated Effort:**
- Phase 1 (Foundation): 2-3 hours
- Phase 2 (Content Styling): 2-3 hours
- Phase 3 (Navigation Integration): 3-4 hours
- Phase 4 (Full Migration): 4-5 hours
- Phase 5 (Polish): 2-3 hours
- **Total: 13-18 hours**

---

**Document End**
