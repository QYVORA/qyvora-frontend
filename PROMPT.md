# QYVORA STUDENT DASHBOARD REFACTOR
## OpenCode Engineering Task

**Objective:** Refactor and standardize the QYVORA Student Dashboard so that its layout, visual language, responsiveness, and overall user experience align with the existing QYVORA public website.

**Important:** This is not a complete redesign. The objective is to identify inconsistencies, remove unnecessary complexity, improve space utilization, and bring the student dashboard in line with the established QYVORA design language.

---

# PHASE 1: CODEBASE AUDIT & DESIGN GAP ANALYSIS

**Do not begin implementation until this phase is complete.**

### 1.1 Inspect the existing public website

Explore the existing QYVORA website and identify its established design language.

Inspect:
- Main landing page.
- Public navigation and header.
- Footer.
- Public information pages.
- Public course and bootcamp landing pages.
- Typography and font hierarchy.
- Colors, backgrounds, borders, shadows, and spacing.
- Buttons, badges, labels, and interactive elements.
- Responsive behavior across desktop, tablet, and mobile.

Identify the reusable design patterns and components that establish visual consistency throughout the public website.

Treat these pages as the primary design reference.

### 1.2 Audit the student dashboard

Inspect the entire student dashboard, including:

- Dashboard overview.
- Student navigation and sidebar.
- Profile page.
- Learning walkthrough pages.
- Lab pages.
- Course pages.
- Bootcamp pages.
- Progress tracking.
- Statistics and performance indicators.
- Progress matrices.
- Learning activities and related components.

Identify which parts are already working well and which parts need improvement.

**Do not assume every page needs modification.**

The profile page, for example, is currently acceptable and should not be redesigned without identifying a specific problem.

### 1.3 Perform a design gap analysis

Compare the public website against the student dashboard.

Document:

1. Visual inconsistencies.
2. Layout inconsistencies.
3. Differences in typography and spacing.
4. Components that unnecessarily use large cards.
5. Poor mobile space utilization.
6. Repeated or redundant information.
7. Unnecessary overview pages and navigation layers.
8. Pages that could be simplified or consolidated.
9. Missing explanatory content.
10. Components that should become reusable shared components.

Pay particular attention to the dashboard overview section.

The top portions of the dashboard pages appear to be the primary source of layout problems. The lower sections of the overview page are generally acceptable and should be preserved where possible.

### 1.4 Deliverable

Before implementation, create:

`docs/audits/student-dashboard-refactor-audit.md`

Include:
- Existing architecture and layout structure.
- Public website design-system findings.
- Student dashboard findings.
- Mobile and desktop responsiveness findings.
- Design gap analysis.
- Unnecessary pages and navigation layers.
- Recommended changes.
- Components that should remain untouched.
- Implementation priorities.

Finish Phase 1 and establish a clear implementation plan before proceeding.

---

# PHASE 2: DASHBOARD LAYOUT REFACTOR

### 2.1 Establish visual consistency

Refactor the student dashboard to follow the same visual language as the public QYVORA website.

Reuse existing:
- Colors.
- Typography.
- Spacing conventions.
- Border treatments.
- Button styles.
- Navigation patterns.
- Component styles.
- Responsive design principles.

Avoid introducing a completely new visual identity.

The dashboard should feel like another section of the same product, not a separate application.

### 2.2 Fix the overview layout

Prioritize the upper sections of the student dashboard.

Review:
- Welcome section.
- Student information.
- Statistics.
- Learning progress.
- Quick actions.
- Activity summaries.
- Progress indicators.

Improve their positioning, hierarchy, and space utilization.

Do not unnecessarily modify the lower sections that already work well.

### 2.3 Implement dynamic card layouts

One of the biggest problems is the excessive use of vertically stacked cards.

Avoid layouts where every statistic, progress indicator, and dashboard component occupies an entire horizontal row.

Instead, implement responsive layouts that utilize available screen space.

Examples include:
- Two-column grids.
- Two-by-two statistic layouts.
- Two-by-three layouts.
- Four-column desktop statistic layouts.
- Responsive grid combinations.
- Compact inline information groups.

These are examples, not fixed requirements.

The actual layout should depend on the content, available screen width, and component importance.

**Mobile requirements:**

- Do not automatically stack every card vertically.
- Use two-column layouts where content permits.
- Keep related statistics together.
- Use compact progress indicators.
- Avoid unnecessarily large cards.
- Prevent horizontal overflow.
- Maintain readable typography.
- Ensure buttons and interactive elements remain accessible.
- Allow cards to adapt naturally to smaller screens.

**Desktop requirements:**

- Use available horizontal space efficiently.
- Avoid excessively wide or unnecessarily tall cards.
- Establish a clear visual hierarchy.
- Use appropriate grid layouts.
- Keep related information visually grouped.

### 2.4 Reduce unnecessary card usage

Not everything needs to be inside a card.

Consider displaying certain elements as:
- Inline statistics.
- Compact metric groups.
- Progress bars.
- Small status indicators.
- Horizontal information sections.
- Lightweight progress matrices.
- Unboxed content sections.

Use cards when they provide meaningful visual grouping, not simply because a component needs somewhere to live.

### 2.5 Statistics and progress visualization

Improve the presentation of:
- Student statistics.
- Course progress.
- Lab completion.
- Bootcamp progress.
- Learning streaks.
- Performance indicators.
- Progress matrices.

Make these elements compact, readable, and visually connected.

Avoid turning every metric into a separate large dashboard card.

---

# PHASE 3: INFORMATION ARCHITECTURE & NAVIGATION CLEANUP

### 3.1 Identify unnecessary pages

Review the current navigation and page hierarchy.

Some pages may introduce unnecessary navigation layers.

For example:
- Separate overview pages that simply list all available labs.
- Separate course overview pages that duplicate existing course navigation.
- Redundant bootcamp landing or overview pages.
- Pages that repeat information already available elsewhere.

Identify opportunities to simplify these structures.

Do not remove pages simply because they look unnecessary.

For every proposed removal or consolidation:
1. Identify the existing page.
2. Identify its purpose.
3. Identify where its functionality or information already exists.
4. Determine whether it is genuinely redundant.
5. Propose the replacement navigation flow.

### 3.2 Preserve essential learning experiences

The following experiences must remain functional:

- Individual lab walkthroughs.
- Individual course learning experiences.
- Bootcamp learning experiences.
- Student progress tracking.
- Course and lab navigation.
- Learning resources.
- Existing student functionality.

Do not break existing URLs, student progress records, or navigation flows.

Where a route must change, implement appropriate redirects or compatibility handling.

### 3.3 Simplify navigation

Make it easier for students to move between their learning activities.

Avoid unnecessary clicks and duplicate navigation destinations.

The student should be able to understand where they are, what they are learning, and what they should do next.

---

# PHASE 4: LEARNING CONTENT & COMMAND DOCUMENTATION

This is an important improvement.

Some existing learning and landing pages lack sufficiently explanatory commands and technical instructions.

Going forward, learning experiences should be beginner-friendly without sacrificing technical accuracy.

### 4.1 Command documentation

Where labs, walkthroughs, courses, or technical learning pages require terminal commands, provide:

- The actual command.
- A short explanation of what it does.
- An explanation of important flags or arguments.
- Expected output where appropriate.
- What the student should observe.
- The next action to take.

Example:

**Command:**

`ip addr`

**What it does:**

Displays the network interfaces available on your Linux system, including their IP addresses.

**What to look for:**

Identify the active network interface and inspect its assigned IP address.

Do not simply display commands without explaining their purpose.

### 4.2 Beginner-friendly technical explanations

Ensure that:
- Technical terminology is explained when first introduced.
- Commands are easy to read and copy.
- Instructions follow a logical sequence.
- Students understand why they are performing each action.
- Important warnings are clearly communicated.
- Expected results are included where useful.

Avoid unnecessary complexity and lengthy explanations.

The goal is to make technical learning approachable while maintaining real-world accuracy.

### 4.3 Content integrity

Do not invent commands, outputs, or technical procedures.

Verify commands against the actual learning environment and the relevant lab requirements.

Preserve existing educational content unless there is a clear reason to improve or correct it.

---

# PHASE 5: COMPONENT REFACTORING & RESPONSIVENESS

### 5.1 Reusable components

Identify opportunities to consolidate repeated UI patterns.

Where appropriate, create reusable components for:
- Dashboard statistics.
- Progress indicators.
- Progress matrices.
- Learning activity summaries.
- Compact metric groups.
- Status indicators.
- Responsive card layouts.
- Section headers.

Avoid creating abstractions for components that are only used once and have no meaningful shared behavior.

### 5.2 Responsive verification

Test the dashboard at representative viewport sizes:

- Small mobile: 320px.
- Standard mobile: 375px.
- Large mobile: 430px.
- Tablet: 768px.
- Laptop: 1024px.
- Desktop: 1440px.

Check:
- Grid behavior.
- Card sizing.
- Text wrapping.
- Navigation behavior.
- Sidebar behavior.
- Overflow.
- Spacing.
- Touch accessibility.
- Content hierarchy.

Do not optimize exclusively for desktop and treat mobile as an afterthought.

---

# PHASE 6: TESTING, VERIFICATION & CLEANUP

After implementation:

1. Run the existing project tests.
2. Run linting.
3. Run the production build.
4. Fix introduced errors.
5. Verify all affected routes.
6. Verify student navigation.
7. Verify responsive layouts.
8. Verify that existing student data still renders correctly.
9. Verify that progress tracking remains intact.
10. Verify that no placeholder or mock data has been introduced.

**Data integrity requirements:**

- No mock student data.
- No fabricated progress statistics.
- No fake course completion records.
- No fabricated lab results.
- No replacement of real backend integrations with static data.
- No breaking changes to existing API contracts.

Preserve the existing backend integrations and real student data.

Document any pre-existing failures separately from issues introduced by this refactor.

---

# PHASE 7: GIT MICRO-COMMITTING & FINAL REPORT

Work incrementally.

### Git requirements

- Inspect the current Git status before making changes.
- Do not overwrite unrelated user changes.
- Never reset or discard existing work.
- Avoid large, unrelated commits.
- Make small, meaningful commits after completed units of work.
- Keep commits focused on one logical change.
- Do not commit broken intermediate implementations.
- Do not push changes unless explicitly authorized.

Suggested commit sequence:

1. `docs: add student dashboard design audit`
2. `refactor: align dashboard design tokens`
3. `refactor: improve dashboard overview layout`
4. `refactor: optimize responsive dashboard grids`
5. `refactor: simplify learning navigation`
6. `improve: clarify technical learning instructions`
7. `refactor: consolidate reusable dashboard components`
8. `test: verify dashboard responsiveness and functionality`

Adapt the sequence to the actual work. Do not create empty or unnecessary commits just to follow this list.

### Final report

Create:

`docs/audits/student-dashboard-refactor-report.md`

Include:
- What was changed.
- What was intentionally preserved.
- Pages modified.
- Pages consolidated or removed.
- Components created or refactored.
- Mobile improvements.
- Desktop improvements.
- Learning content improvements.
- Tests performed and their results.
- Known limitations.
- Git commits created.
- Outstanding recommendations.

---

# ENGINEERING RULES

1. Audit before implementation.
2. The existing public website is the design reference.
3. This is a refinement, not a complete redesign.
4. Preserve working components and pages.
5. Prioritize the dashboard overview.
6. Avoid excessive vertical card stacking.
7. Use responsive grids intelligently.
8. Not everything needs a card.
9. Preserve real data and backend functionality.
10. Do not introduce mock data.
11. Keep technical learning content beginner-friendly.
12. Do not remove functionality during navigation cleanup.
13. Work in small, verifiable increments.
14. Micro-commit throughout implementation.
15. Keep documentation updated.

**FINAL EXPECTATION**

The result should be a student dashboard that feels like a natural extension of the QYVORA public website.

It should be minimal, consistent, modern, responsive, and practical.

Students should be able to understand their progress quickly, navigate their learning activities easily, and follow technical instructions without unnecessary confusion.

Do not chase visual complexity. Focus on clarity, consistency, functionality, and efficient use of screen space.

**Start with Phase 1. Complete the audit and document the findings before modifying application code.**
