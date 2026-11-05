# Interaction Feedback System

**Last Updated**: 2026-11-05  
**Status**: Implemented  
**Motion Tokens**: `src/styles/index.css` (lines 17-23)

## Overview

The QYVORA UI uses a comprehensive interaction feedback system to provide clear visual confirmation for every user action and system state change. This document describes the motion tokens, animation patterns, and implementation guidelines.

---

## Motion Tokens

Defined in `src/styles/index.css`:

```css
/* ── Motion System ── */
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);      /* Standard ease-out for most transitions */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);       /* Bouncy ease-out for entrances */
--ease-in: cubic-bezier(0.4, 0, 1, 1);              /* Ease-in for exits */
--dur-instant: 120ms;                                /* Press/active feedback */
--dur-fast: 160ms;                                   /* Hover, focus states */
--dur-base: 260ms;                                   /* State changes, color transitions */
--dur-slow: 420ms;                                   /* Panels, drawers, complex animations */
```

### Usage Guidelines

- **Press feedback**: Use `--dur-instant` (120ms) with `active:scale-[0.96-0.98]`
- **Hover states**: Use `--dur-fast` (160ms) with subtle color/transform changes
- **State changes**: Use `--dur-base` (260ms) for buttons changing states, tabs switching
- **Panels/Drawers**: Use `--dur-slow` (420ms) for sidebar, modals, dropdowns

---

## Keyframe Animations

All keyframes defined in `src/styles/index.css`:

### Error Feedback
```css
@keyframes shake-x          /* Horizontal shake for errors */
@keyframes pulse-error      /* Border pulse for invalid fields */
@keyframes glow-error       /* Glow shadow for errors */
```

**Usage**: `.animate-shake-x` or `.input-error` class

### Success Feedback
```css
@keyframes success-pop      /* Scale pop for successful actions */
@keyframes success-flash    /* Green border flash on async success */
```

**Usage**: `.animate-success-pop`, `.animate-success-flash`

### Panel Animations
```css
@keyframes slide-down       /* Dropdown menus entrance */
@keyframes slide-up         /* Bottom sheets entrance */
```

**Usage**: `.animate-slide-down`, `.animate-slide-up`

---

## Component Patterns

### Buttons

All buttons have consistent feedback:

```tsx
className="
  transition-[filter,transform,background-color,color,border-color] 
  duration-[var(--dur-base)] 
  ease-[var(--ease-smooth)]
  active:scale-[0.97]
  hover:brightness-110
  focus-visible:outline-2 focus-visible:outline-accent
"
```

**Loading state**: Spinner replaces icon, button disabled  
**Success state**: Brief `animate-success-flash` on async completion

### Icon Buttons

Smaller scale reduction for icon-only buttons:

```tsx
className="
  transition-all 
  duration-[var(--dur-fast)]
  hover:scale-105
  active:scale-[0.92]
"
```

### Cards

Clickable cards have subtle press feedback:

```tsx
className="
  transition-[border-color,box-shadow,background-color,transform]
  duration-[var(--dur-base)]
  hover:border-accent/60
  active:scale-[0.99]
"
```

### Nav Links

Navigation items have smooth transitions:

```tsx
className={`
  transition-all
  duration-[var(--dur-fast)]
  hover:bg-surface-raised hover:text-text-primary
  active:scale-[0.98]
  ${isActive ? 'bg-accent/10 text-accent scale-[1.02]' : ''}
`}
```

### Dropdown Menus

Dropdowns slide down on open:

```tsx
<div className="animate-slide-down rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg">
  <Link className="
    flex items-center gap-3 rounded-lg px-3 py-2.5
    transition-all duration-[var(--dur-fast)]
    hover:bg-surface-raised hover:text-text-primary hover:translate-x-1
    active:scale-[0.98]
  ">
    {/* Menu item */}
  </Link>
</div>
```

### Form Inputs

Inputs have error shake and focus states:

```tsx
<input
  className={cn(
    'transition-[border-color,box-shadow] duration-[var(--dur-base)]',
    'focus:border-accent',
    error && 'animate-shake-x border-danger'
  )}
/>
```

### Tabs

Tab indicators slide smoothly between states:

```tsx
<button
  role="tab"
  className={cn(
    'transition-all duration-[var(--dur-base)]',
    'hover:text-text-primary',
    'active:scale-[0.98]',
    selected && 'text-accent'
  )}
>
  {label}
</button>
```

---

## Sidebar & Panels

### Mobile Sidebar

Uses Framer Motion for smooth slide-in:

```tsx
<motion.aside
  initial={{ x: '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: '-100%' }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="fixed inset-y-0 left-0 z-[130]"
>
  {/* Sidebar content */}
</motion.aside>
```

**Backdrop**: Fades in/out with sidebar

### Dropdowns

Desktop dropdowns use CSS animations:

```tsx
<div className="hidden group-hover:block">
  <div className="animate-slide-down">
    {/* Dropdown content */}
  </div>
</div>
```

---

## Accessibility

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators

All interactive elements have visible focus rings:

```tsx
focus-visible:outline-2 
focus-visible:outline-offset-2 
focus-visible:outline-accent
```

### Keyboard Navigation

All `role="button"` elements handle Enter and Space:

```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick();
  }
}}
```

---

## Touch Devices

### Press States

Use `@media (hover: hover)` to prevent sticky hover on touch:

```tsx
className="
  hover:bg-surface-raised     /* Desktop hover */
  active:scale-[0.98]         /* Touch press (works everywhere) */
"
```

### Tap Targets

All interactive elements maintain 44px minimum touch target:

```tsx
className="min-h-[44px] min-w-[44px]"
```

---

## Implementation Checklist

When adding new interactive elements:

- [ ] Add press state: `active:scale-[0.96-0.98]`
- [ ] Add hover state: Color change + optional scale/transform
- [ ] Add focus ring: `focus-visible:outline-accent`
- [ ] Use motion tokens: `duration-[var(--dur-fast)]`
- [ ] Handle loading state: Show spinner, disable interaction
- [ ] Handle error state: Shake + color change
- [ ] Handle success state: Brief flash or toast
- [ ] Test keyboard: Tab, Enter, Space, Escape
- [ ] Test reduced motion: Animations respect preference
- [ ] Test touch: No sticky hover, good tap targets

---

## Common Patterns

### Async Button

```tsx
<Button
  loading={isLoading}
  onClick={async () => {
    setIsLoading(true);
    try {
      await saveData();
      // Success flash handled by Button component
    } catch (error) {
      // Error shake handled by form/input
    } finally {
      setIsLoading(false);
    }
  }}
>
  Save
</Button>
```

### Form with Validation

```tsx
<form onSubmit={handleSubmit}>
  <Input
    error={errors.email}
    className={errors.email && 'animate-shake-x'}
  />
  <Button loading={isSubmitting}>
    Submit
  </Button>
</form>
```

### Copy Button with Feedback

```tsx
const [copied, setCopied] = useState(false);

<button
  onClick={() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
  className={copied && 'animate-success-pop'}
>
  {copied ? <Check /> : <Copy />}
</button>
```

---

## Performance

### GPU Acceleration

Only animate `transform` and `opacity` for best performance:

```tsx
// ✅ Good - GPU accelerated
transition-[transform,opacity]

// ❌ Avoid - causes layout reflow
transition-[width,height,top,left]
```

### Will-Change

Reserve for complex animations only:

```tsx
className="will-change-transform"  // Marquee, floating animations
```

---

## Testing

### Manual Testing

1. **Hover**: Hover over all interactive elements, verify feedback
2. **Click/Tap**: Press all buttons/links, verify scale-down
3. **Keyboard**: Tab through UI, verify focus rings and Enter/Space
4. **Loading**: Trigger async operations, verify spinners
5. **Errors**: Cause validation errors, verify shake + color
6. **Success**: Complete actions, verify success feedback
7. **Reduced Motion**: Enable in OS, verify animations minimize

### Automated Testing

```tsx
test('button shows loading state', () => {
  render(<Button loading>Save</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('button')).toBeDisabled();
});
```

---

## Migration Notes

### Old Pattern → New Pattern

**Before** (no feedback):
```tsx
<button className="hover:bg-surface">Click</button>
```

**After** (with feedback):
```tsx
<button className="
  transition-all duration-[var(--dur-fast)]
  hover:bg-surface-raised
  active:scale-[0.98]
  focus-visible:outline-2 focus-visible:outline-accent
">
  Click
</button>
```

---

## Questions?

See also:
- `src/styles/index.css` - Motion token definitions
- `src/shared/components/ui/Button.tsx` - Reference implementation
- `src/shared/components/ui/Dialog.tsx` - Modal animation example
