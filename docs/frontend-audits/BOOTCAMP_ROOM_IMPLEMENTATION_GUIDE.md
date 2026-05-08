# Bootcamp Room Page - Implementation Status

## ✅ Completed

### 1. Config Updates
- ✅ Added `estimatedMinutes` to BootcampRoom interface
- ✅ Added estimated times to all 19 rooms across 5 phases

### 2. New Components Added
- ✅ `CopyButton` - Copy code to clipboard
- ✅ `InstructionWithCodeBlocks` - Auto-detect and render code blocks with copy buttons
- ✅ `KeyboardHints` - Show keyboard shortcuts at bottom
- ✅ `JumpMenu` - Quick step navigation modal
- ✅ `ReportIssueModal` - Report problems to admin
- ✅ Updated `StepCard` - Added bookmark button, report issue button, code block rendering

### 3. New Icons Imported
- ✅ Clock, List, Bookmark, Flag, Timer, Minimize2, Check, Copy, Keyboard

### 4. Utility Functions
- ✅ `formatTime(ms)` - Format milliseconds to human-readable time

## 🔄 Remaining Implementation

### Main Component State (add to BootcampRoomPage)

```typescript
// Session timer
const [sessionStart, setSessionStart] = useState<number>(Date.now());
const [timeSpent, setTimeSpent] = useState<number>(0);

// Fullscreen mode
const [fullscreen, setFullscreen] = useState(false);

// Jump menu
const [jumpMenuOpen, setJumpMenuOpen] = useState(false);

// Report issue
const [reportIssueOpen, setReportIssueOpen] = useState(false);
const [reportStepIdx, setReportStepIdx] = useState(0);

// Bookmarks (localStorage)
const bookmarksKey = `hpb_bookmarks_${bootcampId || 'hpb'}`;
const [bookmarkedSteps, setBookmarkedSteps] = useState<Set<string>>(() => {
  try {
    const raw = localStorage.getItem(bookmarksKey);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
});

const toggleBookmark = (stepIdx: number) => {
  const key = `${phaseId}:${roomId}:${stepIdx}`;
  setBookmarkedSteps(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    try {
      localStorage.setItem(bookmarksKey, JSON.stringify([...next]));
    } catch (_e) { /* ignore */ }
    return next;
  });
};

const isStepBookmarked = (stepIdx: number) => {
  return bookmarkedSteps.has(`${phaseId}:${roomId}:${stepIdx}`);
};
```

### Effects to Add

```typescript
// Session timer
useEffect(() => {
  const interval = setInterval(() => {
    setTimeSpent(Date.now() - sessionStart);
  }, 1000);
  return () => clearInterval(interval);
}, [sessionStart]);

// Reset session timer on room change
useEffect(() => {
  setSessionStart(Date.now());
  setTimeSpent(0);
}, [phaseId, roomId]);

// Keyboard navigation
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    // Ignore if typing in input/textarea
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    
    // Ignore if modal is open
    if (quizOpen || quizGateOpen || showCompleteOverlay || jumpMenuOpen || reportIssueOpen) return;

    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
      e.preventDefault();
      goNext();
    }
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
      e.preventDefault();
      goPrev();
    }
    if (e.key.toLowerCase() === 'q' && quizModuleId) {
      e.preventDefault();
      setQuizOpen(true);
    }
    if (e.key.toLowerCase() === 'j') {
      e.preventDefault();
      setJumpMenuOpen(true);
    }
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleFullscreen();
    }
  };
  
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, [currentStepIdx, room, quizOpen, quizGateOpen, showCompleteOverlay, jumpMenuOpen, reportIssueOpen]);

// Fullscreen change listener
useEffect(() => {
  const handleFullscreenChange = () => {
    setFullscreen(Boolean(document.fullscreenElement));
  };
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
}, []);
```

### Functions to Add

```typescript
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};
```

### UI Updates Needed

#### 1. Room Header - Add estimated time display
After the room title and overview, add:
```tsx
<div className="flex items-center gap-4 text-sm text-text-muted mt-3">
  <div className="flex items-center gap-1.5">
    <Clock className="h-4 w-4" />
    <span>{room.estimatedMinutes} min</span>
  </div>
  <div className="flex items-center gap-1.5">
    <BookOpen className="h-4 w-4" />
    <span>{room.steps.length} steps</span>
  </div>
  <div className="flex items-center gap-1.5">
    <Timer className="h-4 w-4" />
    <span>Session: {formatTime(timeSpent)}</span>
  </div>
</div>
```

#### 2. Progress Bar - Add session timer
Inside the progress bar card, after the progress percentage:
```tsx
<div className="flex items-center gap-2 text-xs text-text-muted mt-2">
  <Timer className="h-3.5 w-3.5" />
  <span>Time in room: {formatTime(timeSpent)}</span>
</div>
```

#### 3. Navigation Buttons - Add Jump and Fullscreen
Before the Prev/Next buttons:
```tsx
<div className="flex flex-wrap items-center gap-3 pb-16">
  {/* Jump to step button */}
  <button
    onClick={() => setJumpMenuOpen(true)}
    className="btn-secondary inline-flex items-center gap-2"
  >
    <List className="h-4 w-4" />
    <span className="hidden sm:inline">Jump to step</span>
  </button>

  {/* Fullscreen button */}
  <button
    onClick={toggleFullscreen}
    className="btn-secondary inline-flex items-center gap-2"
    title="Toggle fullscreen"
  >
    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    <span className="hidden sm:inline">{fullscreen ? 'Exit' : 'Fullscreen'}</span>
  </button>

  {/* Existing Prev/Next buttons... */}
</div>
```

#### 4. StepCard Usage - Update all StepCard calls
Add new props to every `<StepCard>` component:
```tsx
<StepCard
  key={idx}
  step={step}
  stepNum={idx + 1}
  total={room.steps.length}
  phaseId={phaseId || ''}
  roomId={roomId || ''}
  isActive={idx === currentStepIdx}
  isViewed={viewedSteps.has(idx)}
  isBookmarked={isStepBookmarked(idx)}
  onToggleBookmark={() => toggleBookmark(idx)}
  onReportIssue={() => { setReportStepIdx(idx); setReportIssueOpen(true); }}
  onClick={() => goToStep(idx)}
/>
```

#### 5. Add Modals Before Main Content
After the quiz modals, add:
```tsx
{/* Jump menu */}
<AnimatePresence>
  {jumpMenuOpen && room && (
    <JumpMenu
      room={room}
      currentStepIdx={currentStepIdx}
      viewedSteps={viewedSteps}
      onJump={goToStep}
      isOpen={jumpMenuOpen}
      onClose={() => setJumpMenuOpen(false)}
    />
  )}
</AnimatePresence>

{/* Report issue modal */}
<AnimatePresence>
  {reportIssueOpen && phaseId && roomId && (
    <ReportIssueModal
      phaseId={phaseId}
      roomId={roomId}
      stepIdx={reportStepIdx}
      onClose={() => setReportIssueOpen(false)}
    />
  )}
</AnimatePresence>
```

#### 6. Add Keyboard Hints at Bottom
At the very end of the content area, before closing tags:
```tsx
<KeyboardHints />
```

## Backend Endpoint Needed

Add this endpoint to handle issue reports:
```
POST /student/report-issue
Body: {
  type: 'bootcamp_room',
  phaseId: string,
  roomId: string,
  stepIdx: number,
  description: string,
  url: string
}
```

## Testing Checklist

- [ ] Keyboard navigation works (Arrow keys, Q, J, F)
- [ ] Code blocks are detected and have copy buttons
- [ ] Estimated time displays correctly
- [ ] Jump menu opens and navigates correctly
- [ ] Bookmarks persist across page reloads
- [ ] Report issue modal submits successfully
- [ ] Session timer counts up correctly
- [ ] Fullscreen mode toggles correctly
- [ ] All features work on mobile
- [ ] Keyboard shortcuts don't interfere with quiz/modals

## Files Modified

1. `hsociety-frontend/src/features/student/constants/bootcampConfig.ts`
   - Added `estimatedMinutes` to interface
   - Added times to all 19 rooms

2. `hsociety-frontend/src/features/student/pages/BootcampRoomPage.tsx`
   - Added new imports
   - Added utility components
   - Updated StepCard component
   - Need to add state and effects to main component
   - Need to update UI with new features

## Next Steps

1. Add all state variables to main component
2. Add all useEffect hooks
3. Update UI sections with new features
4. Test all functionality
5. Create backend endpoint for issue reporting
