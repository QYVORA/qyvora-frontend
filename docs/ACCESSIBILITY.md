# Accessibility

## Standards

QYVORA targets **WCAG 2.1 AA** compliance.

## Keyboard Navigation

### Global

- **Tab:** Navigate between interactive elements
- **Enter/Space:** Activate buttons and links
- **Escape:** Close modals, dropdowns, bottom sheets
- **Arrow keys:** Navigate within menus and lists

### Terminal

| Key | Action |
|-----|--------|
| `Enter` | Execute command |
| `↑` / `↓` | Command history |
| `Tab` | Autocomplete (future) |
| `Ctrl+C` | Cancel |

### Bootcamp Room

| Key | Action |
|-----|--------|
| `←` / `→` | Previous/next step |
| `Q` | Toggle quiz |
| `J` | Jump menu |
| `F` | Fullscreen |

## ARIA Labels

Interactive elements include descriptive `aria-label` attributes:

```tsx
<button aria-label="Open terminal">...</button>
<button aria-label="Back to courses">...</button>
<button aria-label="Toggle lessons sidebar">...</button>
<button aria-label="Notifications (3 unread)">...</button>
```

## Screen Reader Support

- Skip-to-content link: `<a href="#main-content" className="sr-only focus:not-sr-only">`
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<button>`
- Meaningful alt text for images
- Icon-only buttons include `aria-label`

## Color Contrast

- Text primary (`#EEF0EE`) on background (`#000000`): **18.3:1** ratio
- Text muted on background: **3.5:1** ratio (meets AA for large text)
- Accent (`#06B66F`) on background: **5.1:1** ratio

## Reduced Motion

Respected via Motion configuration:

```tsx
<MotionConfig reducedMotion="user">
```

And individual hooks:

```tsx
const shouldReduceMotion = useReducedMotion();
```

When reduced motion is preferred:
- Page transitions disabled
- Scroll animations disabled
- GSAP animations skipped

## Focus Management

- Focus visible indicator: `focus:ring-2 focus:ring-accent`
- Focus trap in modals and dialogs
- Return focus to trigger element on modal close

## Touch Targets

- Minimum touch target: 44x44px (WCAG 2.5.5)
- Buttons: `h-10 w-10` minimum (40px)
- Mobile nav items: generous padding

## Known Limitations

- No screen reader testing automated
- Color contrast for some muted text may need review
- Keyboard navigation in terminal is basic (no tab completion yet)
