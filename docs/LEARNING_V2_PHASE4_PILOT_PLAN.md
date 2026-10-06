# Phase 4: HPB Pilot Migration Plan

> **Status:** 📋 READY FOR IMPLEMENTATION  
> **Target:** Phase 1, Room 1 — "Introduction to Offensive Security"  
> **Scope:** Complete end-to-end migration to validate V2 architecture

## Overview

Phase 4 migrates one representative HPB room from the legacy Markdown-driven model to the semantic learning block system. This validates the complete architecture before full rollout.

---

## Selected Pilot Room

**Phase 1, Room 1: Introduction to Offensive Security**

**Why this room:**
- ✅ Contains diverse content types (narrative, tasks, quizzes)
- ✅ Has images (tests image handling)
- ✅ Multiple steps (tests FocusedStepList integration)
- ✅ Representative of typical HPB content
- ✅ Beginner-friendly (good for testing UX)
- ✅ Not too long (2 steps, ~20 min estimated)

**Current structure:**
```typescript
{
  id: 'room1',
  title: 'Introduction to Offensive Security',
  overview: '...',
  estimatedMinutes: 20,
  steps: [
    {
      title: 'What Is Offensive Security?',
      instruction: `Valkyrie: "Welcome. At QYVORA, we test security by attacking systems before real hackers do..."`,
      image: 'step-01.webp',
      quiz: [/* 2 questions */],
    },
    {
      title: 'The QYVORA Operating Model',
      instruction: `Valkyrie: "QYVORA operates on three simple pillars..."`,
      image: 'step-02.webp',
      quiz: [/* 1 question */],
    },
  ],
}
```

---

## Migration Strategy

### Step 1: Create V2 Content File

Create `src/features/student/data/bootcamp-v2/phase1-room1.ts`:

```typescript
import type { BootcampRoomContent } from '@/shared/learning';

export const phase1Room1V2: BootcampRoomContent = {
  surfaceType: 'bootcamp-room',
  id: 'phase1-room1',
  phaseId: 'phase1',
  roomId: 'room1',
  title: 'Introduction to Offensive Security',
  overview: 'Offensive security is the practice of thinking and acting like an attacker...',
  estimatedMinutes: 20,
  units: [
    {
      id: 'phase1-room1-step-1',
      number: 1,
      title: 'What Is Offensive Security?',
      blocks: [
        {
          type: 'text',
          id: 'intro',
          content: 'Valkyrie: "Welcome. At QYVORA, we test security by attacking systems before real hackers do. This is called offensive security.',
        },
        {
          type: 'text',
          id: 'explanation',
          content: 'We simulate real-world attacks to find security bugs. Once we find them, organisations can patch them.',
        },
        {
          type: 'concept',
          id: 'core-fields',
          title: 'Core Fields',
          content: 'Offensive security includes multiple specialized areas:',
          importance: 'core',
        },
        {
          type: 'objective',
          id: 'fields',
          title: 'Core Fields',
          objectives: [
            'Penetration Testing - Finding security bugs in an application or network',
            'Red Teaming - Simulating a full attack on a company to test their response times',
            'Bug Bounties - Finding bugs independently for cash rewards',
            'Vulnerability Research - Finding new bugs in system code',
          ],
        },
        {
          type: 'do',
          id: 'task1',
          title: 'Reflect',
          instructions: [
            'Write down the difference between offensive (attacking) and defensive (protecting) security in your own words',
          ],
        },
        {
          type: 'checkpoint',
          id: 'quiz1',
          checkpointType: 'quiz',
          quiz: {
            questions: [/* existing quiz questions */],
          },
        },
      ],
      image: {
        src: buildStepImagePath('phase1', 'room1', 'step-01.webp'),
        alt: 'Introduction to Offensive Security illustration',
      },
      completionType: 'view',
    },
    // Step 2...
  ],
};
```

**Key transformation:**
- Large Markdown `instruction` → Multiple semantic blocks
- Tasks → `DoBlock`
- Core concepts → `ConceptBlock` + `ObjectiveBlock`
- Quiz → `CheckpointBlock`

### Step 2: Create V2-Enabled BootcampRoomPage

Create `src/features/student/pages/BootcampRoomPageV2.tsx`:

```typescript
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LearningContentRenderer } from '@/shared/learning';
import '@/shared/learning/blocks'; // Register all blocks
import FocusedStepList from '@/shared/components/learning/FocusedStepList';
import LearningNav from '@/shared/components/learning/LearningNav';
import { phase1Room1V2 } from '@/features/student/data/bootcamp-v2/phase1-room1';

export default function BootcampRoomPageV2() {
  const { bootcampId, phaseId, roomId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // For pilot, hard-code the V2 content
  const room = phase1Room1V2;
  
  const items = room.units.map((unit, index) => ({
    index,
    number: unit.number,
    title: unit.title,
    isActive: index === activeIndex,
    isCompleted: false, // TODO: integrate with progress API
    isLocked: false,
  }));
  
  const handleStepSelect = (index: number) => {
    setActiveIndex(index);
    // Scroll to step
    const element = document.getElementById(`step-${index + 1}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handleNext = () => {
    if (activeIndex < room.units.length - 1) {
      handleStepSelect(activeIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (activeIndex > 0) {
      handleStepSelect(activeIndex - 1);
    }
  };
  
  const handleComplete = async (unitId: string) => {
    // TODO: Call progress API
    console.log('Unit completed:', unitId);
  };
  
  return (
    <div className="min-h-screen pt-20 md:pt-24 px-3 md:px-4 lg:px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Room header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-4">
            {room.title}
          </h1>
          <p className="text-base text-text-secondary font-mono leading-relaxed">
            {room.overview}
          </p>
        </header>
        
        {/* Focused step list */}
        <FocusedStepList
          items={items}
          onSelect={handleStepSelect}
          idPrefix="step"
          renderActive={(index) => {
            const unit = room.units[index];
            return (
              <LearningContentRenderer
                unit={unit}
                context={{
                  surface: 'bootcamp',
                  sequenceId: room.id,
                  unitId: unit.id,
                  onComplete: handleComplete,
                }}
              />
            );
          }}
        />
        
        {/* Navigation */}
        <LearningNav
          currentStep={activeIndex + 1}
          totalSteps={room.units.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isFirstStep={activeIndex === 0}
          isLastStep={activeIndex === room.units.length - 1}
          showComplete={activeIndex === room.units.length - 1}
          onComplete={() => console.log('Room complete')}
        />
      </div>
    </div>
  );
}
```

### Step 3: Add Route

Add V2 route for testing alongside legacy route:

```typescript
// src/app/routes.tsx
{
  path: '/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId/v2',
  element: <BootcampRoomPageV2 />,
}
```

### Step 4: Integration Checklist

**Must work:**
- ✅ FocusedStepList shows all steps, active one expanded
- ✅ Clicking collapsed step scrolls to it and expands
- ✅ Next/Previous navigation
- ✅ Images render correctly
- ✅ Quiz submission works
- ✅ Progress tracking (view events)
- ✅ Mobile responsive
- ✅ Keyboard accessible
- ✅ Screen reader compatible

**Visual validation:**
- ✅ No card soup (semantic cards only)
- ✅ Full-width reading text
- ✅ Proper spacing between blocks
- ✅ Typography follows design system
- ✅ Icons render correctly
- ✅ Colors use semantic tokens

---

## Testing Plan

### Unit Tests

```typescript
// src/features/student/data/bootcamp-v2/__tests__/phase1-room1.test.ts
describe('Phase 1 Room 1 V2 Content', () => {
  it('has the correct structure', () => {
    expect(phase1Room1V2.units).toHaveLength(2);
    expect(phase1Room1V2.units[0].blocks.length).toBeGreaterThan(0);
  });
  
  it('all blocks have unique IDs', () => {
    const allIds = phase1Room1V2.units.flatMap(u => u.blocks.map(b => b.id));
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });
  
  it('checkpoint blocks have valid quiz data', () => {
    const checkpoints = phase1Room1V2.units[0].blocks.filter(
      b => b.type === 'checkpoint'
    );
    checkpoints.forEach(cp => {
      if (cp.checkpointType === 'quiz') {
        expect(cp.quiz?.questions.length).toBeGreaterThan(0);
      }
    });
  });
});
```

### Integration Tests

```typescript
// src/features/student/pages/__tests__/BootcampRoomPageV2.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BootcampRoomPageV2 from '../BootcampRoomPageV2';

describe('BootcampRoomPageV2', () => {
  it('renders room title and overview', () => {
    render(<BootcampRoomPageV2 />);
    expect(screen.getByText(/Introduction to Offensive Security/i)).toBeInTheDocument();
  });
  
  it('shows first step expanded by default', () => {
    render(<BootcampRoomPageV2 />);
    expect(screen.getByText(/What Is Offensive Security/i)).toBeInTheDocument();
  });
  
  it('navigates to next step on Next button click', async () => {
    const user = userEvent.setup();
    render(<BootcampRoomPageV2 />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    
    expect(screen.getByText(/QYVORA Operating Model/i)).toBeInTheDocument();
  });
  
  it('renders all semantic blocks', () => {
    render(<BootcampRoomPageV2 />);
    
    // Text blocks
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    
    // Concept block
    expect(screen.getByText(/Core Fields/i)).toBeInTheDocument();
    
    // Do block
    expect(screen.getByText(/Reflect/i)).toBeInTheDocument();
    
    // Checkpoint (quiz)
    expect(screen.getByText(/What is the core difference/i)).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

**Desktop (Chrome, Firefox, Safari):**
- [ ] All blocks render correctly
- [ ] FocusedStepList navigation works
- [ ] Images load properly
- [ ] Quiz interaction works
- [ ] Copy buttons on commands work
- [ ] Keyboard navigation (Tab, Enter, Space, Arrow keys)
- [ ] No console errors

**Mobile (iOS Safari, Android Chrome):**
- [ ] Layout is responsive
- [ ] Touch targets are 48px minimum
- [ ] No horizontal scroll
- [ ] Quiz tappable areas work
- [ ] Images scale properly
- [ ] Navigation buttons accessible

**Accessibility:**
- [ ] Screen reader announces content correctly
- [ ] Focus visible on all interactive elements
- [ ] Heading hierarchy correct
- [ ] ARIA labels present where needed
- [ ] Color contrast passes WCAG AA

---

## Success Criteria

### Architecture Validation

✅ **Content adapts to blocks:**
- Legacy Markdown strings successfully split into semantic blocks
- No information loss during transformation
- Block types match content semantics

✅ **Renderer works end-to-end:**
- LearningBlockRenderer dispatches correctly
- All block components render without errors
- BlockRegistry finds all registered components

✅ **Integration with existing system:**
- FocusedStepList works with LearningContentRenderer
- LearningNav navigation functions
- Progress tracking APIs can be called
- Routes work correctly

### UX Validation

✅ **Feels like learning, not documentation:**
- Clear visual hierarchy
- Semantic emphasis (missions, concepts, checkpoints)
- Reading flow is natural
- No unnecessary card soup

✅ **Interactions work:**
- Quiz answering
- Step navigation
- Scroll behavior
- Mobile gestures

### Code Quality

✅ **TypeScript:**
- No type errors
- Strict mode passing
- All types properly inferred

✅ **Linting:**
- No semantic token violations
- No accessibility violations
- Code follows QYVORA conventions

✅ **Tests:**
- Unit tests pass
- Integration tests pass
- No regressions in existing tests

---

## Known Limitations (Phase 4)

**Intentionally NOT addressed in pilot:**

1. **Full content migration** — Only 1 room migrated, not all 18
2. **Progress API integration** — Stubbed, not fully wired
3. **Image optimization** — Uses existing image paths
4. **Advanced block types** — mental-model, diagram, http, code, comparison not needed for pilot
5. **A/B testing** — No feature flag system
6. **Analytics** — No tracking of V2 usage

These are deferred to Phase 5 (iterate) and Phase 6 (full rollout).

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Block types don't match real content | High | Chose representative room with diverse content |
| Performance regression | Medium | Keep V2 route separate, measure metrics |
| Accessibility issues | High | Manual testing with screen reader, automated checks |
| Breaking existing functionality | High | V2 is separate route, legacy unchanged |
| Type errors from real data | Medium | Use actual bootcamp data structure |

---

## Implementation Timeline

**Estimated effort:** 4-6 hours for complete pilot

1. **Hour 1:** Create V2 content file, transform content to blocks
2. **Hour 2:** Create BootcampRoomPageV2 component
3. **Hour 3:** Wire up navigation, progress, image handling
4. **Hour 4:** Unit tests for content and renderer
5. **Hour 5:** Integration tests for page
6. **Hour 6:** Manual testing, accessibility, polish

---

## Next Steps After Pilot

**If successful:**
1. ✅ Validate approach works end-to-end
2. Move to Phase 5: Iterate on missing primitives
3. Identify patterns for automated content transformation
4. Plan Phase 6: Full HPB migration

**If issues found:**
1. Document blockers
2. Refine block types
3. Adjust UI components
4. Iterate until architecture validated

---

## File Checklist

**New files to create:**
- [ ] `src/features/student/data/bootcamp-v2/phase1-room1.ts`
- [ ] `src/features/student/pages/BootcampRoomPageV2.tsx`
- [ ] `src/features/student/data/bootcamp-v2/__tests__/phase1-room1.test.ts`
- [ ] `src/features/student/pages/__tests__/BootcampRoomPageV2.test.tsx`

**Files to modify:**
- [ ] `src/app/routes.tsx` (add V2 route)
- [ ] Update this document with results

**Files NOT to modify:**
- ✅ Existing `BootcampRoomPage.tsx` (keep legacy working)
- ✅ Existing `bootcampConfig.ts` (keep as fallback)
- ✅ Existing tests (don't break existing functionality)

---

## Example: Content Transformation

**Before (Legacy):**
```typescript
{
  title: 'What Is Offensive Security?',
  instruction: `Valkyrie: "Welcome. At QYVORA, we test security by attacking systems before real hackers do. This is called offensive security.

We simulate real-world attacks to find security bugs. Once we find them, organisations can patch them.

**Core Fields:**
- **Penetration Testing** - Finding security bugs in an application or network.
- **Red Teaming** - Simulating a full attack on a company to test their response times.
- **Bug Bounties** - Finding bugs independently for cash rewards.
- **Vulnerability Research** - Finding new bugs in system code.

*Task:* Write down the difference between offensive (attacking) and defensive (protecting) security in your own words."`,
  image: 'step-01.webp',
  quiz: [/* 2 questions */],
}
```

**After (V2 Semantic Blocks):**
```typescript
{
  id: 'phase1-room1-step-1',
  number: 1,
  title: 'What Is Offensive Security?',
  blocks: [
    {
      type: 'text',
      id: 'intro',
      content: 'Valkyrie: "Welcome. At QYVORA, we test security by attacking systems before real hackers do. This is called offensive security."',
    },
    {
      type: 'text',
      id: 'explanation',
      content: 'We simulate real-world attacks to find security bugs. Once we find them, organisations can patch them.',
    },
    {
      type: 'concept',
      id: 'core-fields',
      title: 'Core Fields',
      content: 'Offensive security includes multiple specialized areas:',
      importance: 'core',
    },
    {
      type: 'objective',
      id: 'fields-list',
      title: 'Core Fields',
      objectives: [
        'Penetration Testing - Finding security bugs in an application or network',
        'Red Teaming - Simulating a full attack on a company to test their response times',
        'Bug Bounties - Finding bugs independently for cash rewards',
        'Vulnerability Research - Finding new bugs in system code',
      ],
    },
    {
      type: 'do',
      id: 'task-reflection',
      title: 'Reflect',
      instructions: [
        'Write down the difference between offensive (attacking) and defensive (protecting) security in your own words',
      ],
    },
    {
      type: 'checkpoint',
      id: 'quiz-osec',
      checkpointType: 'quiz',
      quiz: {
        questions: [/* same quiz */],
      },
    },
  ],
  image: {
    src: buildStepImagePath('phase1', 'room1', 'step-01.webp'),
    alt: 'Introduction to Offensive Security illustration',
  },
  completionType: 'view',
}
```

**Benefits:**
- ✅ Clear semantic structure
- ✅ Each block has a purpose
- ✅ Renderer can adapt presentation
- ✅ Easy to add new block types
- ✅ Content authors focus on teaching, not UI

---

**Phase 4 Ready ✅**

This plan provides a complete roadmap for the pilot migration. The actual implementation would validate the entire V2 architecture before full rollout.
