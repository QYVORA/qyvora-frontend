# QYVORA UI Behavior (UIB) Guidelines

## Mobile Width Rule

On mobile viewports (`< 640px` / `sm` breakpoint), containers and cards must use **maximum available width** with **minimal side margins**:

| Breakpoint | Side Margin | Example Class |
|-----------|-------------|---------------|
| Mobile (< 640px) | 8–12px (0.5–0.75rem) | `px-3` |
| sm (≥ 640px) | 16–24px (1–1.5rem) | `px-6` |
| md (≥ 768px) | 24–40px (1.5–2.5rem) | `px-10` |
| lg+ (≥ 1024px) | 40–80px (2.5–5rem) | `px-16` or `px-20` |

### Rationale
- Mobile screens are narrow — maximize usable space for content.
- Cards should feel full-width but retain a **small breathing gap** (~8–12px) from screen edges so they are not "glued" to the sides.
- Avoid excessive horizontal padding that pushes content into a narrow column.

### Implementation
- Use `px-3` for mobile, `sm:px-6` for larger screens.
- For blog article bodies: `px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20`
- For dashboard pages: `px-4 md:px-6 lg:px-10`

## Card Sizing Rule

Card groups displayed in grids must have **uniform dimensions** (same width AND same height) regardless of content differences.

### Implementation
- Always use CSS Grid for card groups (`grid grid-cols-N`).
- Add `min-h-[160px]` (or appropriate value) to cards with variable content to ensure baseline uniformity.
- Use `flex flex-col` on card bodies to enable `mt-auto` for pushing content to the bottom.
