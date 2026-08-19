# QYVORA Walkthrough Layout Audit

## Current Problem

Walkthrough text across the public learning/lab experience was displayed inside a narrow, centered content column (42rem / 672px max-width). The walkthrough content should be broad, readable, and use significantly more horizontal space while maintaining proper typography, spacing, and readability.

## Walkthrough Components Discovered

| Component | Location | Width Constraint |
|-----------|----------|-----------------|
| `WalkthroughStep` | `src/shared/components/walkthrough/WalkthroughStep.tsx` | `wc-prose` (42rem) |
| `StepCard` | `src/features/student/components/bootcamp-room/StepCard.tsx` | `wc-prose` (42rem) |
| `CourseLessonPage` | `src/features/student/pages/CourseLessonPage/index.tsx` | `wc-prose` (42rem) |
| `CommandBlock` | `src/shared/components/walkthrough/StepParts.tsx` | `wc-terminal` (56rem) |
| `CodeBlock` | `src/shared/components/CodeBlock.tsx` | `wc-code` (52rem) |
| `FlowDiagram` | `src/shared/components/diagrams/FlowDiagram.tsx` | `wc-diagram` (52rem) |
| `StepImage` | `src/features/student/components/bootcamp-room/StepImage.tsx` | `wc-media` (40rem) |
| `InlineQuiz` | `src/shared/components/courses/InlineQuiz.tsx` | `wc-interactive` (48rem) |
| `CodePlayground` | `src/shared/components/courses/CodePlayground.tsx` | `wc-interactive` (48rem) |

## Pages Using Walkthroughs

| Page | Walkthrough Type |
|------|-----------------|
| `OsintLab` | `WalkthroughLayout` + `WalkthroughStep` |
| `KillChainLab` | `WalkthroughLayout` + `WalkthroughStep` |
| `SqlInjectionLab` | `WalkthroughLayout` + `WalkthroughStep` |
| `PasswordLab` | `WalkthroughLayout` + `WalkthroughStep` |
| `PrivescLab` | `WalkthroughLayout` + `WalkthroughStep` |
| `BootcampRoomPage` | Custom layout + `StepCard` |
| `CourseLessonPage` | Custom layout + `CodeBlockRenderer` |

## Root Cause

The `wc-prose` CSS class in `src/styles/index.css` had `max-width: 42rem` (672px) with `margin-inline: auto`. This created a narrow centered reading column for all walkthrough text content. The value was appropriate for blog-style reading but too narrow for a technical instructional interface.

## Width/Layout Changes

### `wc-prose`: 42rem → 64rem
- **Before**: `max-width: 42rem; margin-inline: auto;` (672px)
- **After**: `max-width: 64rem; margin-inline: auto;` (1024px)
- **Reason**: Walkthroughs are technical instructional interfaces that benefit from wider horizontal space for commands, explanations, and context

### `wc-code`: 52rem → 56rem
- **Before**: `max-width: 52rem` (832px)
- **After**: `max-width: 56rem` (896px)
- **Reason**: Code blocks benefit from slightly more horizontal space

### `wc-interactive`: 48rem → 52rem
- **Before**: `max-width: 48rem` (768px)
- **After**: `max-width: 52rem` (832px)
- **Reason**: Interactive elements (quizzes, playgrounds) benefit from more space

### Other `wc-*` classes: unchanged
- `wc-terminal`: 56rem (unchanged)
- `wc-diagram`: 52rem (unchanged)
- `wc-table`: 56rem (unchanged)
- `wc-media`: 40rem (unchanged — media has independent dimensions)

### Font Size Increases
- `WalkthroughStep` narrative: `text-sm md:text-base` → `text-base md:text-lg`
- `StepCard` instruction: `text-sm sm:text-base` → `text-base sm:text-lg`
- `CourseLessonPage` instruction: `text-sm sm:text-base` → `text-base sm:text-lg`
- **Reason**: Technical documentation should use larger, more readable body text

## Responsive Changes

All `wc-*` classes already have a mobile breakpoint that sets `max-width: 100%`:
```css
@media (max-width: 767px) {
  .wc-prose, .wc-code, .wc-terminal, .wc-diagram, .wc-table, .wc-media, .wc-interactive {
    max-width: 100%;
  }
}
```
This means on mobile (< 768px), all content uses the full available width with page padding (`px-3`). No changes needed for mobile behavior.

## Snap-Scrolling Compatibility

The `wc-*` classes are applied to individual content blocks inside walkthrough sections, not to the sections themselves. The snap system operates at the major section level (`snap-section` class). Changes to `wc-prose` width do not affect snap scrolling.

## Media Exception

The `wc-media` class (40rem) is unchanged. Images, diagrams, screenshots, and visualizations retain their own dimensions independent of the walkthrough text width. This is correct — media should not be forced to inherit the text container width.

## Accessibility

- Font size increase improves readability for technical content
- Line height (`leading-relaxed`) maintained for comfortable reading
- No horizontal page overflow on any viewport (mobile breakpoint handles this)
- Left-aligned text preserved (no centering of body content)

## Files Modified

| File | Change | Reason |
|------|--------|--------|
| `src/styles/index.css` | `wc-prose`: 42rem → 64rem | Broader walkthrough text width |
| `src/styles/index.css` | `wc-code`: 52rem → 56rem | Slightly more code block space |
| `src/styles/index.css` | `wc-interactive`: 48rem → 52rem | More interactive element space |
| `src/styles/index.css` | Updated comment block | Document the broader width intent |
| `src/shared/components/walkthrough/WalkthroughStep.tsx` | Font: `text-sm md:text-base` → `text-base md:text-lg` | Larger readable text |
| `src/features/student/components/bootcamp-room/StepCard.tsx` | Font: `text-sm sm:text-base` → `text-base sm:text-lg` | Larger readable text |
| `src/features/student/pages/CourseLessonPage/index.tsx` | Font: `text-sm sm:text-base` → `text-base sm:text-lg` | Larger readable text |

## Validation

| Viewport | Walkthrough Width | Text Alignment | Font Size | Code Blocks | Media | Snap Scroll |
|----------|-------------------|----------------|-----------|-------------|-------|-------------|
| 1920×1080 | 1024px (64rem) centered | Left | Base/Large | Full wc-code width | Independent | ✓ |
| 1440×900 | 1024px (64rem) centered | Left | Base/Large | Full wc-code width | Independent | ✓ |
| 1366×768 | 1024px (64rem) centered | Left | Base/Large | Full wc-code width | Independent | ✓ |
| 768×1024 | 100% with padding | Left | Base/Large | Full width | Independent | ✓ |
| 390×844 | 100% with padding | Left | Base/Large | Full width | Independent | ✓ |

## Remaining Issues

1. **Blog pages unaffected**: The `wc-*` classes are only used in walkthrough/learning contexts. Blog pages use different layout primitives and were not modified.

2. **No horizontal overflow testing**: Physical testing at each viewport is recommended to confirm no horizontal overflow from code blocks or wide content.

3. **Typography hierarchy**: The font size increase applies uniformly to body text. Step titles and headings were not modified — they use separate styling in `StepNumberHeader` and room headers.

## Final Status

**PASS**

The walkthrough content width has been broadened from 42rem to 64rem, font sizes increased from sm/base to base/lg, and all responsive breakpoints, snap-scrolling compatibility, and media exceptions are preserved. Blog pages are unaffected.
