# QYVORA FRONTEND — COMPLETE UI DESIGN SYSTEM & PAGE SPECIFICATION AUDIT

You are working directly inside the **QYVORA frontend repository**.

Your task is to perform a **deep, implementation-aware audit of the existing frontend UI** and produce a comprehensive, precise, reusable **UI Design System and Page Specification** based on what is actually implemented in the current codebase.

## CRITICAL CONTEXT

The current frontend already contains the intended QYVORA UI direction.

Do **not** assume that the current UI needs to be redesigned.

Do **not** invent a new visual language.

Do **not** create a generic design system based on common industry conventions.

Do **not** assume a folder structure, architecture, routing structure, component structure, naming convention, or documentation structure before inspecting the repository.

Do **not** invent pages, components, routes, variants, colors, typography values, spacing values, or behaviors that do not exist.

You are running this task **from inside the frontend repository itself**, so inspect the actual implementation.

The existing implementation is the primary source of truth.

Your job is to:

> **Inspect → Understand → Extract → Measure → Document → Cross-reference → Validate.**

The goal is to transform the existing UI into a **formal frontend design specification that future developers and AI coding agents can follow without repeatedly recreating or guessing the QYVORA interface.**

---

# PRIMARY OBJECTIVE

Create or update the appropriate Markdown documentation in the repository so that QYVORA has a **deep, explicit, measurable UI design system**.

The documentation must be detailed enough that a future developer or AI agent can create a new QYVORA page while maintaining visual consistency with the existing product.

The documentation must answer questions such as:

* What font is used?
* What font size is used?
* What font weight is used?
* What line height is used?
* What letter spacing is used?
* What colors are used?
* What is each color's semantic purpose?
* What background is used?
* What border is used?
* What border radius is used?
* What padding is used?
* What margin/spacing is used?
* What width constraints are used?
* What height constraints are used?
* What icon sizes are used?
* What button sizes are used?
* What card variants exist?
* What heading sizes exist?
* What paragraph sizes exist?
* What text sizes exist for mobile and desktop?
* What responsive changes occur?
* Which components are shared?
* Which components are page-specific?
* Which components are variants of another component?
* Where is each component allowed to be used?
* Where should a component NOT be used?
* Which visual patterns belong specifically to public pages?
* Which belong to documentation?
* Which belong to tools?
* Which belong to dashboards?
* Which belong to administrative interfaces?
* Which belong to Labs/student experiences?
* Which backgrounds belong to which page categories?
* Which spacing patterns belong to which layouts?
* Which typography hierarchy belongs to which page type?
* Which navigation pattern belongs to which interface?
* Which visual patterns are intentionally different?

The final result should be a **usable engineering specification**, not a high-level design description.

---

# STEP 1 — FULL FRONTEND RECONNAISSANCE

Before creating or modifying documentation, inspect the repository thoroughly.

First understand the actual frontend.

Inspect:

* package configuration
* framework and version
* entry points
* application bootstrap
* routing
* layouts
* pages
* shared components
* page-specific components
* UI primitives
* stylesheets
* CSS
* Tailwind configuration if present
* theme configuration if present
* font loading
* icon systems
* asset usage
* responsive breakpoints
* utility classes
* reusable constants
* design tokens if they already exist
* existing documentation
* existing README files
* existing frontend-related Markdown files
* component naming conventions
* route definitions
* navigation definitions
* page metadata where relevant

Do not assume where any of these are located.

Discover them from the repository.

Do not spend the entire task merely reading files. Build an internal model of the frontend and then perform the audit.

---

# STEP 2 — IDENTIFY THE ACTUAL PAGE SYSTEM

Determine every meaningful page and interface category that currently exists.

Do not reduce everything to "public pages."

QYVORA contains different interface contexts, and they may intentionally have different UI rules.

Identify actual categories from the implementation.

For every discovered page or route, document:

* route/path
* page purpose
* page category
* layout used
* navigation used
* header used
* footer used
* sidebar used
* hero pattern if applicable
* primary content pattern
* card patterns
* typography patterns
* background patterns
* CTA patterns
* responsive behavior
* unique components
* shared components
* special visual rules

Do not invent page categories.

Derive them from the actual application.

---

# STEP 3 — EXTRACT THE DESIGN TOKENS

Create a precise inventory of every visual token used by the frontend.

Do not merely say:

> "The application uses dark colors."

Record the actual implementation values.

## COLORS

Identify every meaningful color.

For each color document:

* name
* exact HEX value
* RGB value if useful
* HSL value if useful
* semantic purpose
* where it is used
* light/dark context if applicable
* whether it is global or component-specific

Examples of semantic categories to investigate:

* primary background
* secondary background
* elevated background
* card background
* surface background
* border
* primary text
* secondary text
* muted text
* accent
* success
* warning
* error
* informational
* interactive
* hover
* active
* focus
* disabled
* code syntax colors
* terminal colors

Only document values actually found.

If several visually similar colors exist, do not automatically merge them.

Determine whether they are intentionally different.

---

# STEP 4 — TYPOGRAPHY MUST BE EXTREMELY PRECISE

Typography is one of the most important parts of this specification.

Do not document typography using vague descriptions such as:

> "Large heading"

or:

> "Small text."

Record exact values wherever they can be determined from the implementation.

For every typography level, document:

* font family
* fallback font
* font size
* font weight
* line height
* letter spacing
* text transform
* color
* responsive size
* responsive line height
* typical usage
* allowed page contexts

Identify the complete hierarchy.

At minimum investigate:

* display text
* page title
* H1
* H2
* H3
* H4
* H5
* H6
* section heading
* card heading
* body large
* body regular
* body small
* caption
* metadata
* labels
* navigation text
* button text
* badges
* breadcrumbs
* code text
* terminal text
* table text
* form labels
* form helper text
* error text
* status text

For each typography level, provide concrete measurements.

For example, if the implementation uses something equivalent to:

```text
font-size: 48px
font-weight: 700
line-height: 1.1
letter-spacing: -0.02em
```

document exactly that.

If responsive behavior changes it:

```text
Desktop: 48px
Tablet: 40px
Mobile: 32px
```

document all values.

Do not replace actual values with generic names.

The specification should be precise enough for someone to reproduce the typography without looking at the original component.

---

# STEP 5 — SPACING SYSTEM

Audit the spacing system in detail.

Identify recurring values for:

* page padding
* section padding
* component padding
* card padding
* button padding
* navigation spacing
* grid gaps
* flex gaps
* text spacing
* heading-to-paragraph spacing
* paragraph-to-action spacing
* card-to-card spacing
* section-to-section spacing
* sidebar spacing
* form spacing
* modal spacing

Determine whether the frontend follows a consistent spacing scale.

If it does, document it.

If it does not, document the actual recurring patterns and identify inconsistencies separately.

Do not silently normalize them.

---

# STEP 6 — LAYOUT SYSTEM

Document the actual layout rules.

Determine:

* maximum content widths
* page widths
* container behavior
* horizontal padding
* grid structures
* column counts
* grid gaps
* flex layouts
* alignment rules
* vertical rhythm
* sidebar widths
* navigation heights
* header heights
* footer structure
* content offsets
* fixed/sticky elements
* positioning rules
* overflow behavior
* scrolling behavior

Record exact measurements wherever possible.

For example:

```text
Header:
Desktop height: Xpx
Mobile height: Xpx

Sidebar:
Width: Xpx
Collapsed width: Xpx

Content:
Maximum width: Xpx
Horizontal padding: Xpx
```

Do not invent these values.

Extract them from the implementation.

---

# STEP 7 — BACKGROUND SYSTEM

Audit every meaningful background treatment.

This is especially important.

Do not document backgrounds merely as "dark."

Identify:

* exact background colors
* background images
* image positioning
* image sizing
* overlays
* opacity
* borders
* textures
* patterns
* terminal-style backgrounds
* page backgrounds
* section backgrounds
* card backgrounds
* elevated surfaces
* documentation backgrounds
* dashboard backgrounds
* modal backgrounds

Then determine where each background is intended to be used.

For example:

```text
Background Variant: Public Hero
Used on:
- X page
- Y page

Not intended for:
- dashboard
- admin
```

The actual values must come from the codebase.

---

# STEP 8 — COMPONENT SYSTEM

Perform a complete component inventory.

Identify all reusable UI components.

For every component document:

* component name
* actual source location
* purpose
* variants
* props if relevant
* visual appearance
* dimensions
* typography
* colors
* spacing
* borders
* radius
* shadows
* iconography
* states
* responsive behavior
* usage contexts
* pages currently using it

Components to investigate include, but are not limited to:

* buttons
* links
* cards
* badges
* inputs
* textareas
* selects
* checkboxes
* radio controls
* toggles
* navigation
* headers
* sidebars
* footers
* breadcrumbs
* tabs
* accordions
* modals
* dialogs
* alerts
* notifications
* tooltips
* tables
* pagination
* code blocks
* terminal blocks
* command blocks
* search controls
* filters
* dropdowns
* loading states
* empty states
* error states
* skeletons
* avatars
* status indicators
* progress indicators

Only document components that actually exist.

---

# STEP 9 — BUTTON SPECIFICATION

Buttons need exact specifications.

For every button variant determine:

* width behavior
* height
* min-width
* padding
* font family
* font size
* font weight
* line height
* border
* radius
* background
* text color
* icon size
* icon spacing
* hover state
* active state
* focus state
* disabled state
* loading state
* responsive behavior

Identify where each button variant is used.

Do not allow the documentation to simply say:

> "Primary button."

It should describe exactly what "primary button" means in QYVORA.

---

# STEP 10 — CARD SYSTEM

Perform the same level of analysis for cards.

Identify every meaningful card variant.

For each card:

* name
* purpose
* background
* border
* radius
* padding
* minimum/maximum dimensions
* heading typography
* body typography
* metadata typography
* icon placement
* image behavior
* action placement
* hover behavior
* responsive behavior
* page contexts

Most importantly:

**document where each card variant should be used.**

Do not allow future developers to randomly reuse a visually similar card simply because it happens to fit.

---

# STEP 11 — CODE BLOCKS AND TERMINAL UI

QYVORA contains technical/security-oriented interfaces, so code and terminal presentation must be treated as first-class design patterns.

Audit:

* code blocks
* inline code
* terminal windows
* command blocks
* command input areas
* output areas
* syntax highlighting
* line numbers
* copy buttons
* terminal controls
* prompt styling
* cursor styling if applicable
* scrolling
* horizontal overflow
* mobile behavior
* monospace typography
* borders
* backgrounds
* spacing

Document exact values.

These patterns must be reusable across the QYVORA ecosystem.

---

# STEP 12 — NAVIGATION SYSTEM

Audit every navigation pattern.

Do not assume there is only one navigation.

Identify:

* public navigation
* documentation navigation
* dashboard navigation
* admin navigation
* student/Labs navigation
* mobile navigation
* sidebar navigation
* breadcrumbs
* contextual navigation

For each:

* dimensions
* typography
* spacing
* icon sizes
* active state
* hover state
* collapsed state
* mobile behavior
* fixed/sticky behavior
* scrolling behavior
* background
* borders

Document which navigation belongs to which page category.

---

# STEP 13 — RESPONSIVE SYSTEM

Determine the actual responsive strategy.

Inspect the implementation and identify:

* breakpoints
* desktop behavior
* tablet behavior
* mobile behavior
* typography changes
* spacing changes
* grid changes
* navigation changes
* sidebar changes
* card changes
* button changes
* code block behavior
* table behavior
* overflow behavior
* image behavior

Document exact breakpoints if defined.

If responsive behavior is implemented through framework defaults, document the actual breakpoint values used by that framework/configuration.

Do not invent custom breakpoints.

---

# STEP 14 — PAGE-LEVEL DESIGN SPECIFICATION

After extracting the global design system, document each meaningful page category.

For every page, specify:

### Structure

* header
* navigation
* hero
* content sections
* cards
* CTA
* footer
* sidebar
* supporting elements

### Visual rules

* page background
* section backgrounds
* heading hierarchy
* paragraph hierarchy
* card variants
* button variants
* spacing
* layout
* responsive behavior

### Component usage

Explicitly identify:

* which shared components are used
* which variants are used
* which components are unique to the page
* which components must not be substituted casually

The purpose is to make creating another page in the same category predictable.

---

# STEP 15 — BUILD A PAGE × COMPONENT MATRIX

Create a clear reference showing where reusable components are used.

For example:

| Component   | Landing | Public | Docs | Tools | Dashboard | Admin | Labs |
| ----------- | ------: | -----: | ---: | ----: | --------: | ----: | ---: |
| Component A |     Yes |    Yes |   No |   Yes |        No |    No |  Yes |
| Component B |      No |    Yes |  Yes |    No |       Yes |   Yes |   No |

Do not use these example categories unless they actually exist.

Generate the matrix from the repository.

The matrix should make component reuse and page-specific boundaries obvious.

---

# STEP 16 — IDENTIFY INTENTIONAL VS ACCIDENTAL INCONSISTENCIES

Do not assume every difference is a mistake.

Identify:

### Intentional differences

Examples:

* public UI versus dashboard UI
* documentation navigation versus application navigation
* terminal interface versus marketing interface
* administrative interface versus student interface

### Potential inconsistencies

Examples:

* same component implemented differently in multiple places
* slightly different button heights
* duplicate typography values
* inconsistent spacing
* duplicated card implementations
* inconsistent border radius
* inconsistent mobile behavior
* duplicated colors with no obvious semantic reason

Do not automatically modify these.

Document them separately as:

**Potential Design System Inconsistencies**

Explain what differs and where it occurs.

---

# STEP 17 — DO NOT DESTROY EXISTING DOCUMENTATION

Before creating files:

* inspect existing Markdown documentation
* determine whether a design system already exists
* determine whether an existing document should be expanded
* avoid unnecessary duplication
* preserve useful existing documentation
* update existing documentation when appropriate

Do not blindly create five new files when one existing document already serves the same purpose.

Choose the documentation structure based on the repository's actual current state.

---

# STEP 18 — DOCUMENTATION QUALITY REQUIREMENTS

The resulting documentation must be:

* precise
* measurable
* implementation-aware
* reusable
* maintainable
* structured
* searchable
* understandable by humans
* understandable by AI coding agents

Avoid vague language.

Bad:

> "Use a large heading."

Good:

> `font-size: 48px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em`

Bad:

> "Use some spacing between cards."

Good:

> `gap: 24px`

Bad:

> "Dark card."

Good:

> `background: #0B0B0B; border: 1px solid ...; border-radius: 16px; padding: 24px`

Everywhere that an exact value can be reliably extracted, provide the exact value.

---

# STEP 19 — SOURCE-OF-TRUTH RULE

The hierarchy of truth for this task is:

1. Actual rendered/implemented frontend behavior
2. Actual source code
3. Existing design tokens/configuration
4. Existing frontend documentation
5. Reasonable interpretation of repeated implementation patterns

Do not use generic design-system conventions to override the existing QYVORA implementation.

If something cannot be determined reliably, explicitly mark it as:

> `UNDETERMINED — requires manual confirmation`

Do not fabricate values.

---

# STEP 20 — FUTURE DEVELOPMENT RULES

The resulting design documentation should contain a section explaining how future developers and AI agents should use the system.

It should establish principles such as:

* reuse existing components before creating new ones
* reuse existing variants before creating new variants
* reuse existing typography levels
* reuse semantic colors
* reuse spacing tokens
* reuse page patterns
* do not create arbitrary one-off visual styles
* do not introduce new colors without justification
* do not introduce new font sizes unnecessarily
* do not create duplicate components
* do not recreate existing UI patterns manually
* update the design specification when a genuinely new system-level pattern is introduced

The final documentation should function as a **contract for future frontend development**.

---

# STEP 21 — AI IMPLEMENTATION SAFETY

You are performing an audit and documentation task.

Do not perform a broad redesign.

Do not rewrite the frontend.

Do not replace the existing architecture.

Do not rename large numbers of files.

Do not introduce a new component library.

Do not replace existing styling technologies.

Do not "modernize" the UI simply because you personally prefer another design style.

Do not make visual changes merely to make the documentation easier to write.

If you discover a serious UI inconsistency, document it.

Only make implementation changes if they are strictly necessary for the documentation task or explicitly requested.

---

# STEP 22 — FINAL DOCUMENT STRUCTURE

The final documentation should cover, as applicable:

```text
1. Purpose
2. Design System Principles
3. Source of Truth
4. Brand / Visual Identity
5. Color System
6. Typography System
7. Spacing System
8. Layout System
9. Responsive System
10. Background System
11. Border System
12. Radius System
13. Shadow / Elevation System
14. Icon System
15. Button System
16. Link System
17. Card System
18. Form System
19. Navigation System
20. Sidebar System
21. Header System
22. Footer System
23. Badge / Status System
24. Alert / Notification System
25. Modal / Dialog System
26. Table System
27. Code Block System
28. Terminal System
29. Search / Filter System
30. Loading / Empty / Error States
31. Page Layout Patterns
32. Page-Specific Specifications
33. Component Usage Matrix
34. Responsive Behavior Matrix
35. Intentional UI Differences
36. Potential Inconsistencies
37. Accessibility Rules
38. Future Development Rules
39. Adding New Components
40. Adding New Page Patterns
41. Design System Maintenance
42. Audit Findings
```

Do not force sections that have no relevance to the actual implementation.

---

# STEP 23 — MEASUREMENT STANDARD

Wherever possible, use implementation-level measurements.

Prefer:

```text
48px
32px
24px
16px
14px
12px
1.5
700
16px
0.02em
16px radius
1px border
```

over:

```text
large
medium
small
bold
rounded
wide
```

If the implementation uses framework utility classes, translate those utilities into their concrete values in the documentation while retaining the original class/reference when useful.

For example:

```text
Tailwind utility: text-4xl
Resolved value: 2.25rem / 36px
```

This makes the specification useful even if the implementation technology changes later.

---

# STEP 24 — DO NOT ONLY DOCUMENT COMPONENTS

This is extremely important.

A design system is not just:

> Button + Card + Input + Navbar.

Document the **relationships between components**.

For example:

* heading spacing inside cards
* relationship between hero heading and hero paragraph
* relationship between cards in a grid
* relationship between sections
* relationship between navigation and page content
* relationship between sidebar and content
* relationship between code blocks and explanatory text
* relationship between buttons and surrounding content
* visual hierarchy between primary and secondary information

The goal is to document the **composition rules** of the QYVORA interface.

---

# STEP 25 — FINAL AUDIT

Before finishing, perform a second pass over the repository.

Check:

* Did you inspect all major routes?
* Did you inspect all major pages?
* Did you inspect shared components?
* Did you inspect styles?
* Did you inspect responsive behavior?
* Did you inspect typography?
* Did you inspect colors?
* Did you inspect spacing?
* Did you inspect backgrounds?
* Did you inspect navigation?
* Did you inspect cards?
* Did you inspect buttons?
* Did you inspect code/terminal UI?
* Did you identify page-specific patterns?
* Did you identify reusable patterns?
* Did you identify duplicates?
* Did you avoid inventing values?
* Did you preserve the existing UI direction?
* Is every major visual rule documented?
* Could another AI agent build a new QYVORA page using only the resulting documentation and existing components without guessing basic visual values?

If not, continue the audit.

---

# FINAL OUTPUT

At the end, provide a concise summary containing:

1. Documentation files created or modified.
2. Major design-system areas documented.
3. Number of major page categories identified.
4. Number of reusable component patterns identified.
5. Number of typography levels identified.
6. Number of meaningful color tokens identified.
7. Number of major spacing/layout patterns identified.
8. Responsive behavior documented.
9. Potential inconsistencies discovered.
10. Any areas that could not be determined reliably.

Do not claim that something was documented if you did not actually inspect and document it.

The objective is not to produce a pretty Markdown file.

The objective is to establish a **deep, measurable, maintainable QYVORA frontend design system that becomes the visual contract for future development.**

Future QYVORA pages should be built from this system rather than recreated from memory.
