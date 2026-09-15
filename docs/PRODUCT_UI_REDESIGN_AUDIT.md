# QYVORA Product UI Redesign Audit

**Date:** 15 September 2026  
**Scope:** Marketing, public product pages, documentation, authentication, student dashboard and learning flows, admin dashboard, shared navigation and primitives.  
**Method:** Code and route audit of the shipped frontend architecture. This is a product/design direction document, not an implementation specification. No application UI was changed as part of this audit.

## Decision

QYVORA should stop presenting every capability as a dramatic, full-screen destination. The current interface has a recognisable cyber/terminal voice, but it applies the same high-intensity treatment to almost everything: large type, full-viewport panels, animated borders/grids, cards, carousels, dark surfaces, and navigation choices. The result is visually busy, long to scan, and hard to understand on a phone.

The redesign direction is **calm, task-first security software**:

- One brand personality: dark, technical, confident; not “cyber” decoration on every surface.
- One primary action per screen and per section.
- Content height by default; full-screen height only when it gives a focused task a real benefit.
- Dense but readable dashboard information; simple public conversion pages.
- Mobile is the baseline layout. Desktop adds columns and persistent navigation, not a different information architecture.

This is a simplification programme, not a reskin. Remove duplication and structural noise before polishing cards, motion, or gradients.

## Evidence behind the decision

The audit found the following systemic causes rather than one isolated bad page.

| Finding | Evidence | User impact |
| --- | --- | --- |
| Landing-page overload | The home route composes 16 sequential sections: hero, pillars, two act dividers, labs, simulations, courses, bootcamp, team, QuiteRoot, tools, blogs, market, leaderboard, services, CTA, then footer. Most use `min-h-dvh`. | The visitor must scroll through a catalogue before understanding the product or choosing a path. On phones, every short section becomes a large interruption. |
| Navigation overload | The public menu contains five groups and 20+ destinations, including eight individual tools. It opens as a full-screen catalogue of cards. | Navigation itself becomes a page to read; the most important routes have no clear priority. |
| Repeated page formula | 13 marketing pages use the same `StudentHeroSection`; 17 pages render a footer; 34 marketing components/pages use `min-h-dvh`. | Repetition makes distinct offerings feel interchangeable and creates excessive vertical travel. |
| Decoration competes with information | The frontend has at least 421 references to motion, reveal, grid, canvas, or related visual-effect patterns across marketing, student, and shared UI. Global CSS also supplies beams, animated borders, marquees, floating mascot motion, and grids. | Hierarchy is diluted. Motion, borders and cards become the subject rather than the learning or work. |
| Design primitives are too permissive | The shared system has multiple card/stat variants, strong animated card treatments, raw utility composition in many pages, and a global micro-type scale down to 7px. | Different teams can make locally valid but globally noisy UI. Readability and density vary unpredictably. |
| Dashboard is a control panel and a marketing page at once | The student dashboard begins with a hero/mission and six large navigation tiles, then toggles sections and provides many competing panels/actions. | Returning learners cannot immediately answer “what should I do next?” |
| Public and authenticated journeys overlap | Courses, labs, bootcamp, market and simulations have public browse pages while equivalent student areas have separate patterns and tools. | Users see different names, layouts, and expectations before and after sign-in. |

## What to remove or merge

These are deliberate product decisions. Do not preserve them merely because a component already exists.

### Landing page

Replace the current long-form landing page with **six content blocks plus footer**.

1. Hero: one audience statement, one proof point, primary CTA, secondary “Explore learning” link.
2. Choose your path: three cards only — Learn, Practice, Work with us.
3. Featured learning: one course/bootcamp and up to two labs. Link to the learning catalogue.
4. Product proof: outcomes, learner/company signals, or concise real examples. Use actual proof; remove filler stats.
5. Tools and research: one compact strip leading to `/tools`, not eight tool cards.
6. Final CTA: repeat the intended primary conversion only once.

Remove from the home page as standalone full-height sections: the two “Act” dividers, team, QuiteRoot, individual market preview, individual leaderboard preview, blogs preview, and the separate simulations section. They remain reachable from their own pages or appear as a small editorial module only when there is current, useful content.

Merge Labs, Courses, Bootcamp, and Simulations under a single “Learn by doing” narrative. Merge Cyber Coin, leaderboard, and market into a single optional “Platform” module; do not ask an unfamiliar visitor to learn the reward economy before learning the core offering.

### Navigation and information architecture

Use this public navigation:

| Primary nav | Destination | Notes |
| --- | --- | --- |
| Learn | `/learn` | Catalogue with tabs for courses, labs, bootcamp, simulations. Existing routes can remain as redirects/deep links. |
| Tools | `/tools` | Single index for all open-source tools; individual tool pages stay as documentation detail routes. |
| Research | `/blogs` | Blog, selected research, and community writing. |
| Services | `/services` | The only business-conversion route. |
| About | `/about` | Team, QuiteRoot, contact, and legal links. |

Header actions: `Log in` (quiet) and one contextual primary action: `Start learning` for the platform, or `Talk to us` within Services. Do not show both Contact and other high-emphasis actions on every route.

Remove the public full-screen card-grid menu. On mobile, use a normal sheet/drawer with the five links above and a clearly separated account action. On desktop, display the five links directly; reserve a small menu only for About/legal items.

### Dashboard

The authenticated home should be a **next-action dashboard**, ordered as:

1. Continue card — current course/lab/bootcamp, progress, estimated next step, one CTA.
2. Today — only the daily mission or one short goal, never both a hero and a second competing mission card.
3. Progress — three compact metrics (learning streak, completed items, CP/rank if meaningful).
4. Library — recent courses/labs and a direct “Browse learning” link.
5. Secondary modules — market, tools, network, and competitive features behind navigation, not six large home-page selector tiles.

Remove the dashboard section-toggle tile grid. It hides content behind an interaction, consumes substantial mobile height, and duplicates the topbar. Move those destinations into a bottom navigation on mobile and a compact left sidebar on desktop.

### Other surfaces

- **Public catalogue pages:** Replace “hero + full-screen carousel + full-screen CTA” with a compact page header, filter/search where it adds value, responsive cards/list, and one CTA. A catalogue is a browsing task, not a slideshow.
- **HPB and phase pages:** Show curriculum as an expandable outline with progress/context. Do not make every phase or room a viewport-high marketing section.
- **Tool documentation:** Preserve the documentation shell, but use an index and consistent article anatomy: purpose, install, quick start, capabilities, examples, related tools. Do not make every internal section a card.
- **Services:** Keep a focused service page: outcome, scope, process, proof, CTA. Remove broad platform navigation and reward/community material from this conversion flow.
- **Profile:** Keep identity, selected achievements, recent activity, and share action. Make contribution calendars and trophy-style decoration secondary/collapsible on mobile.
- **Admin:** Prioritise operational work: alerts, queue, key metrics, recent activity. Keep complex tables as their own task screens/tab routes and avoid dashboard-style visual effects.
- **Auth:** Use a quiet, low-distraction layout. A single product promise and form are enough; animations and extra navigation reduce completion.

## Design system to build before page work

Create a deliberately small system. Every new interface must use it before introducing a page-specific pattern.

### Foundations

| Foundation | Decision |
| --- | --- |
| Colour | Keep near-black and the existing green accent, but use green for action, active state, progress, and success only. Surfaces need three levels at most: canvas, raised, selected. Error/warning/info remain semantic exceptions. |
| Typography | Use Space Grotesk for display headings and JetBrains Mono for code, labels, metadata and technical output. Use a readable sans or the display family for normal long-form body copy; dense monospace paragraphs are tiring. Eliminate sub-12px text. |
| Spacing | Use a 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64. Default page gutters: 16px mobile, 24px tablet, 32px desktop. |
| Layout | Use a readable content width for prose and a wider application canvas for dashboards. Avoid forcing every section to full browser width or height. |
| Radius and borders | One standard surface radius (12px) and one compact-control radius (8px). Borders are quiet separators; an accent border only signals selection or direct interaction. |
| Elevation | Use background contrast first. One subtle shadow level for raised overlays only; no card glow as the standard state. |

### Primitive inventory

Ship only these primitives initially: `Button`, `IconButton`, `TextLink`, `Input`, `Select`, `Tabs`, `Badge`, `Alert`, `Card`, `DataList`, `EmptyState`, `Progress`, `Dialog/Sheet`, `PageHeader`, `SectionHeader`, `AppShell`, `PublicShell`.

Each primitive needs documented default, hover, focus-visible, disabled, loading, empty, error, and mobile states. Consolidate the existing multiple stat-card and card variants into one composable Card plus a compact Metric pattern. A “card” is not a default wrapper for every paragraph, list item, or heading.

## Responsive and mobile-first rules

Design at 360px first, then validate 390px, 768px, 1024px, 1440px, and 1920px. A desktop mockup must never be the source layout that gets compressed later.

- Begin with one column and natural document flow. Add columns only when the content remains understandable at the target breakpoint.
- Use `min-height: auto` for ordinary content. Full viewport height is allowed only for a focused onboarding/task screen and must still work at 320px × 568px and with browser chrome visible.
- Keep controls at least 44 × 44px. Icon-only controls need labels/tooltips and an explicit focus state.
- Mobile navigation: bottom navigation for the three to five repeat student destinations; a drawer for infrequent destinations. Public marketing navigation uses a drawer, not a card catalogue.
- Tables become labelled stacked rows or horizontally scrollable data regions with a visible cue; never silently squeeze five columns into a phone.
- Carousels are optional, not structural. Prefer a scrollable list or grid. If retained, they need visible controls, keyboard support, pause control, stable height, and no hidden critical content.
- Respect reduced motion. Motion may orient, confirm, or reveal; it must not be required to discover hierarchy or read content.
- Test zoom at 200%, long translated text, empty/loading/error states, keyboard-only navigation, and safe-area insets.

## Visual language rules

1. One visual focal point per viewport. If the title, a card, the grid background, an animated border, a mascot, and a chart all ask for attention, remove until one wins.
2. Use illustration/product imagery as evidence, not decoration. Every large visual must explain a feature or an outcome.
3. Limit a screen to one motion family. No concurrent marquee, beam, reveal, hover-scale, floating mascot, and canvas effect.
4. Do not use terminal framing around ordinary marketing copy. Reserve code/terminal treatments for executable commands, simulation output, and developer tools.
5. Avoid all-caps paragraphs and long letter-spaced labels. Use these sparingly for small categorisation labels.
6. Treat empty space as structure, not a requirement to make every block fill the viewport.

## Dedicated visual-system findings: admin, type, colour, globe, and backgrounds

### Administration UI

Yes—the admin experience was included in the route and component audit. It is a separate operational context, but it currently inherits too much of the product’s presentation language.

**What is there now:** `AdminLayout` has a fixed, transparent topbar; `AdminTopbar` automatically hides on downward scroll; the dashboard route swaps nine operational domains through a `?tab=` parameter. Admin child components create their own compact cards, inputs, badges, filters, tables, and modal content. Many labels are 9–10px all-caps mono, while active topbar tabs use large 32px icons.

**Why it is a problem:** In an operations console, continuity, scan speed, and consequences matter more than visual drama. A disappearing header can hide the current context and controls. A general dashboard for users, incidents, market, broadcasts, audit, and security creates a very large working surface with inconsistent task patterns. Tiny labels make dense operational data harder—not easier—to scan.

**Decision:** Admin uses a quiet, high-clarity data UI. It does not use globes, marketing heroes, typewriter text, decorative grids, border beams, carousel behaviour, or animated counter treatment. Its background is a stable canvas, not a sequence of marketing panels.

- Keep the admin topbar stable; do not auto-hide it. On desktop pair a persistent sidebar with a breadcrumb/page title. On mobile use a compact title bar plus a task-navigation sheet.
- Split query-tab work into direct, addressable routes as part of migration: overview, users, bootcamps, market, points, inbox, broadcasts, audit log, security, incidents. Keep redirects from old tab URLs.
- Establish one `AdminDataTable` and one `AdminFilterBar`; stop creating tab-local inputs, select controls, badges and list rows. Rows need a clear primary identifier, status, timestamp, contextual actions, empty/loading/error states, and a deliberate mobile record mode.
- Use 14px minimum data text and 12px minimum metadata; labels should be sentence case by default. Reserve all caps for a small number of durable status tags.
- Information hierarchy: urgent action/incident first, then work queue, then health/metrics. Cards are summary containers only; the actual working content is a list, table, detail drawer, or form.
- Destructive/security actions must show scope, irreversible effect, confirmation, result, and audit reference in the interface. Toasts remain supplementary.

### Typography system

**What is there now:** The global body is JetBrains Mono; headings request Space Grotesk from a Google-hosted stylesheet. The source contains 589 explicit mono usages, 509 `text-[10px]` usages, 407 `text-[9px]` usages, 58 `text-[8px]` usages and 13 `text-[7px]` usages. The CSS codifies 10px, 9px, 8px and 7px micro-type tokens. This is a systemic readability issue, not a few exceptions.

**Decision:** Typography must communicate role, not brand decoration.

| Role | Family | Mobile/Desktop size | Use |
| --- | --- | --- | --- |
| Display | Space Grotesk | 36–48px / 48–64px | Landing hero only; one per view. |
| Page title | Space Grotesk | 28–32px / 32–40px | App/public/documentation titles. |
| Section title | Space Grotesk | 22–24px / 24–28px | Major content groups. |
| Body | System sans or Space Grotesk | 16px / 16–18px | Marketing copy, docs, instructions, forms. |
| Body compact | System sans or Space Grotesk | 14px / 14–16px | Supporting copy and table cell content. |
| Label | JetBrains Mono | 12px / 12px | Short field labels, status, metadata. |
| Code/data | JetBrains Mono | 13–14px / 13–14px | Commands, code, IDs, terminal and technical values. |

- Remove the 7–11px visible text scale from normal product UI. It may remain only inside a deliberately zoomable code editor/terminal rendering where it is user-adjustable.
- Do not set mono as the body default. The app may retain mono as the technical accent and preserve terminal authenticity without making every long paragraph and form label feel dense.
- Load/fallback both families intentionally. The current display font is remote while JetBrains Mono is bundled; establish a resilient fallback stack and test slow/offline font loading so heading hierarchy does not collapse.
- Reduce excessive uppercase and wide tracking. These patterns are useful for short state labels, not paragraphs, navigation groups or dense operational forms.

### Colour and surface system

**What is there now:** The canvas is `#000`, with `#050505`, `#080808` and `#0b0b0b` used as cards, alternate sections and elevated surfaces. Their luminance differences are extremely small. The interface then adds borders, accent dim/glow, card shimmer, several semantic colours, code colours, and page-local raw colours. Alternating `bg`/`bg-alt` full-height blocks creates striping without a clear semantic distinction.

**Decision:** Keep the brand’s near-black/green identity, but create usable surface separation and use colour semantically.

| Token | Recommended role | Direction |
| --- | --- | --- |
| `canvas` | App/page background | A neutral charcoal, not pure black; approximately `#0B0D0E`. |
| `surface` | Cards, form fields, static panels | One visible step above canvas; approximately `#121617`. |
| `surface-raised` | Menus, sheets, dialogs, active utility panels | One further visible step; approximately `#181D1E`. |
| `border-subtle` | Grouping/division | Neutral grey-green at a visible but quiet contrast. |
| `text-primary` / `text-secondary` / `text-tertiary` | Reading hierarchy | Validate body and metadata contrast independently; muted text is not for essential content. |
| `accent` | Primary action, selected state, progress, success | Retain QYVORA green close to `#06B66F`; do not apply it to every border, icon, grid, or hover state. |
| semantic states | Error, warning, info | Use only for meaning, always paired with text/icon. |

- Remove automatic full-page alternation between background blacks. Use `canvas` as the stable default; add a raised surface only when it communicates grouping, state, or focus.
- Remove `card-shimmer`, accent glow, and accent border from default card state. A selected or directly actionable card may use one clear cue.
- Keep syntax colours inside code/terminal contexts. They should not become arbitrary interface status colours.
- Build a contrast matrix for all text/surface and focus-ring/surface combinations, including disabled states. Test it in bright outdoor mobile conditions, not only a dark desktop monitor.

### Globe and decorative background system

**What is there now:** The HackerGlobe is a lazy-loaded Three.js/WebGL canvas with a dot map, pins, scroll rotation and fluid sizing. It is used in the landing hero and is also imported through `StudentHeroSection`, `PublicHeroSection`, and `AuthFormLayout`. Grid backgrounds are likewise reused through `GridBoxedBackground` across heroes, authentication and the 404 route. The landing combines globe, animated grid, typewriter copy, badge pulse, reveal motion, statistics and multiple controls.

**Decision:** The globe is a **single flagship brand asset**, not a universal background component.

- Keep it only on the primary landing hero, where it can support the Africa/security positioning. It must be `aria-hidden`, non-interactive, lazy-loaded after usable text/CTA, paused/offscreen when not visible, disabled for reduced motion/constrained devices, and replaced by a static lightweight fallback when WebGL is unavailable.
- Remove it from public catalogue heroes, student pages, docs and authentication. A globe behind an account form is distracting and spends rendering budget where completion and trust matter most.
- `GridBoxedBackground` must become opt-in and static. It is appropriate for the landing hero and perhaps an empty/not-found state; it is not a default canvas for every route.
- Remove decorative grid, beam, glow, marquee and typewriter combinations from any one screen. The landing may retain **one** ambient layer (the globe *or* a subtle grid), not both as competing background effects.
- Backgrounds never convey information, state, or available actions. If an effect prevents legibility at 360px, it must not render rather than merely being darkened.

## Delivery sequence

### Phase 0 — Product alignment (1 week)

Confirm the five public navigation destinations, landing conversion goal, and which audience is primary: learner, enterprise buyer, or tool user. Define one success metric per journey: sign-up/learning start, service lead, tool install, or return-to-learning.

### Phase 1 — Foundations and shells (1–2 weeks)

Freeze new page-level styling. Define tokens, typography, primitive contracts, PublicShell, AppShell, navigation, responsive breakpoints, and shared empty/loading/error states. Build a visual regression matrix before component migration.

### Phase 2 — Highest-leverage journeys (2–3 weeks)

Redesign and validate: landing → sign-up, public learning catalogue → course/lab detail → sign-up, and student dashboard → continue learning. Use real data and the smallest supported phone first.

### Phase 3 — Remaining public routes (2 weeks)

Migrate services, tools index/detail, research, about, market/leaderboard, profiles, and auth to the new shells and primitives. Convert duplicated public routes into redirects only after analytics confirms safe destinations.

### Phase 4 — Operational and advanced experiences (2 weeks)

Migrate admin, settings, notifications, marketplace, competitive/network tools, and immersive learning experiences. Preserve specialised tool UIs, but place their controls within the new shell rules.

### Phase 5 — Quality gate (ongoing)

Remove deprecated visual utilities/components only after routes are migrated. Review metrics, usability findings, accessibility checks, and visual regression coverage on every UI pull request.

## Definition of done

A page is complete only when it meets all of the following:

- A new user can name the page purpose and the primary next action within five seconds.
- It has one primary CTA; secondary actions are visibly subordinate.
- It works at 360px without horizontal page scroll, clipped controls, hidden content, or viewport-height traps.
- It uses only approved tokens and primitives; no arbitrary colour, spacing, radius, shadow, or animation is introduced without system review.
- Keyboard focus is visible; all controls are labelled; touch targets meet 44px minimum.
- Loading, empty, error, disabled and long-content states have been designed, not improvised.
- It respects `prefers-reduced-motion` and meets target text contrast.
- It has been checked at the required viewport matrix and against a real/representative data set.

## Future UI audit prompt

Use the following prompt whenever a new feature, page, or redesign is proposed:

```text
You are the QYVORA product-design reviewer. Review the proposed UI against the
QYVORA Product UI Redesign Audit before any code is written.

Context
- Journey: [public learner / signed-in learner / enterprise buyer / admin / tool user]
- User goal: [one sentence]
- Primary action: [one action]
- Route(s): [routes]
- Content/data states: [loading, empty, populated, error, permissions]
- Target devices: 360, 390, 768, 1024, 1440, 1920px

Return, in this order:
1. A one-sentence verdict: keep, simplify, merge, or reject.
2. The exact page purpose and one primary CTA. Flag every competing CTA.
3. Information architecture: what belongs on this route, what should move to an
   existing route, and what should be removed. Do not create a new destination
   if it belongs under Learn, Tools, Research, Services, or About.
4. A mobile-first content order for 360px, then only the changes justified for
   tablet and desktop. Do not begin with desktop columns.
5. Which approved primitives are needed. Identify any new primitive and prove
   why an existing one cannot serve it.
6. Visual hierarchy decisions: the single focal point, typography levels,
   spacing, surface use, and whether imagery/motion is necessary.
7. Accessibility and resilience checks: 44px controls, focus, labels, contrast,
   reduced motion, keyboard flow, long text, loading, empty and error states.
8. A short removal list: cards, sections, decorative effects, carousel behavior,
   or navigation items that do not advance the user goal.
9. Acceptance criteria that can be tested at all six viewport widths.

Rules
- Calm, task-first security software; no decorative cyber treatment by default.
- One visual focal point and one primary action per viewport.
- Natural content height by default; never use viewport-height sections for
  ordinary catalogue, marketing, or reading content.
- Green is reserved for action/active/progress/success; terminal styling is
  reserved for actual code, command, or simulation content.
- Prefer lists/grids to carousels. A carousel may not hide essential content.
- Never use sub-12px visible text, arbitrary visual tokens, or a card around
  every block of information.
- If an element does not improve comprehension, conversion, or task completion,
  recommend removing it.
```

## Deep journey audit

The following is the required journey-level interpretation of the redesign. It covers the route families and the components that currently shape them. The aim is to remove decisions from the learner’s path, not merely change how the existing screens look.

### 1. Acquisition: landing → exploration → account

**Current flow:** The visitor arrives on a long home route, encounters many equally weighted full-height sections, opens a full-screen navigation catalogue, and then selects from public pages that frequently repeat a large hero, a carousel, a CTA, and a footer. Login and contact are both elevated across navigation.

**Breakdown:** The visitor has to decide whether QYVORA is a learning platform, tool company, research collective, services firm, marketplace, reward system, or community before understanding any one of them. A large hero does not solve that ambiguity when every following section starts another story.

**Target flow:**

`Landing` → choose **Learn**, **Tools**, or **Services** → focused catalogue/detail → `Start free` or `Talk to us` → auth/contact completion → appropriate signed-in or confirmation destination.

**Required changes:**

- The hero must name a primary audience and outcome, then give one primary CTA. It must not include a mascot, animated background, scoreboards, and several high-emphasis CTAs at once.
- Use the public Learn catalogue as the one discovery route. Courses, labs, bootcamp and simulations are filters/content types, not four competing top-level sales journeys.
- Services must be intentionally separate from learner conversion. A buyer should not be sent through competitive ranks, CP or an educational carousel to request a pentest.
- Auth return URLs must preserve intent: after registration from a course/lab/bootcamp card, return to that specific item, not a generic dashboard.
- Success states must provide a next action: account created → begin selected content; contact submitted → expectation and alternate resource; tool install → copy/install confirmation and docs link.

### 2. Sign-in, registration, password recovery, and first-run

**Current flow:** Login has a shared auth form but the admin variant is a separate dense viewport-height treatment. A registration path and password-change path are adjacent but visually/structurally separate. On first dashboard load, onboarding modal/tour, dashboard hero, mission panels, install prompts, consent, and floating assistant infrastructure can all compete.

**Breakdown:** Security-sensitive forms need clarity and confidence. Decorative animation, micro type, overloaded panels, or simultaneous onboarding interruptions make the account flow feel less trustworthy.

**Target flow:** One `AuthShell`; simple route heading; one form; short reassurance; support/help text; no unrelated global overlays. After authentication, run onboarding only if there is no preserved destination and only one interruption at a time.

**Required changes:**

- Merge login, register, change password and password reset around `AuthShell`, `AuthCard`, `FormField`, `PasswordField`, `FormMessage`, and `AuthFooter`.
- Make the administrator identity a clear route label/permission state, not a wholly separate visual system.
- Never place consent banner, PWA prompt, product tour, username modal, community popup and assistant above a form or first-run screen together. Define a single overlay queue with priority: security-required → legal consent → account-required → educational onboarding → optional promotion.
- Add explicit success/locked/rate-limited/expired-token states. Do not use colour or toast alone to communicate a security outcome.

### 3. Student home: return → continue learning

**Current flow:** `DashboardPage` combines a welcome hero, daily mission, section-toggle grid, metrics, active deployment/content panels, tools, marketplace, skills and progression. The grid functions as a second primary navigation system; content appears conditionally beneath it.

**Breakdown:** This asks a returning learner to scan a dashboard before doing the next piece of work. The page is taller and more visually loud than the task it should initiate.

**Target flow:**

`Dashboard` → **Continue** the single most relevant learning item → resume at the exact step → show concise confirmation/progress → optionally browse the library.

**Required changes:**

- Use `ContinueLearningCard` as the first block and preserve resume point at room, lesson, scenario and focused step level.
- Replace the six large `SectionButton` tiles and conditional section content with persistent navigation. Student mobile: `Home`, `Learn`, `Practice`, `Progress`, `Profile`; desktop: corresponding compact sidebar.
- Retain only three compact metrics directly below Continue. Daily mission is a subordinate module; weekly operation, market, tools, skills and network features belong to their own destinations or a “More” panel.
- Do not make every dashboard module a bordered card. Use section separation and lists for low-priority content.

### 4. Learning discovery: catalogue → selection → entitlement

**Current flow:** Public courses/labs/HPB pages use hero and carousel/full-height content patterns. Signed-in equivalents use separate filters, hero patterns, accordion/card patterns and purchase/access checks. Some discovery pages are effectively promotional versions of task pages.

**Breakdown:** Content types, availability, difficulty, prerequisites, progress, duration and price/CP have inconsistent placement and visual priority. The learner may discover an item publicly then has to learn a new layout when signed in.

**Target flow:** A single `LearningCatalogue` in both public and signed-in states. Signed-out cards explain the outcome and prompt sign-in; signed-in cards additionally show progress/access. Details use one `LearningDetailShell` with overview, curriculum, requirements, outcomes, related content, and contextual CTA.

**Required changes:**

- Build `LearningCard`, `LearningFilterBar`, `LearningCatalogue`, `LearningDetailHeader`, `CurriculumOutline`, `EntitlementNotice`, and `ResumeAction` once. Do not retain public-only and student-only visual card families.
- Use filters only when they change a meaningful result set. Search/filter controls must not be inserted as decorative catalogue chrome.
- Replace full-screen carousels with responsive grids or a deliberate horizontal list of featured items. The first three items must remain discoverable without swipe.
- Put CP cost, access rule, and unlock result in the same place on all content cards/details. Use one purchase/access confirmation flow.

### 5. Course lesson flow: lesson → study → check → continue

**Current flow:** Course lessons combine `LearningToolbar`, `FocusedStepList`, `LearningNav`, hero content, markdown/code/quiz renderers, and an internal terminal. Controls are distributed across floating/fixed and document locations.

**Breakdown:** The learner must infer which control changes a lesson, a focused step, the sidebar, fullscreen state, or the terminal. This is difficult on small screens where fixed UI competes for vertical space.

**Target learning workspace:**

- **Desktop:** a narrow course outline left; one central content column; one optional utility rail/panel only when the lesson requires it.
- **Mobile:** a compact sticky lesson header with Back, lesson title/progress, and one `Tools` trigger. Outline, notes, terminal and fullscreen are all destinations within a single bottom sheet—not simultaneous floating controls.
- **Within content:** one active lesson/step, clear completion criterion, one next action. Code and quizzes sit in the learning sequence, not as disconnected card stacks.

**Required changes:**

- Consolidate `LearningToolbar`, `LearningNav`, `FocusedStepList`, and ad hoc room controls into `LearningWorkspaceShell` with slots: outline, context, content, utilities, progress, next action.
- Give the student one durable progress model: course completion → lesson completion → step completion. A completed row should be an outcome, not a second interactive hierarchy.
- Make `InlineQuiz`, code block, code playground and command block share the same feedback vocabulary: neutral, correct, incorrect, hint, retry, complete.
- Keep navigation after content, never over a form/quiz. Step changes must retain/restore logical reading position and announce the new active step to assistive technology.

### 6. Bootcamp room flow: bootcamp → phase → room → completion

**Current flow:** A room can show `RoomSidebar`, `LearningToolbar`, `FocusedStepList`, `LearningNav`, `InternalTerminal`, plus bootcamp contextual panels. The route supports both module and phase forms. Desktop/mobile variants duplicate some navigation and content behaviours.

**Breakdown:** This is the highest cognitive-load journey and currently has the most controls. Duplicate navigation concepts (phase/room sidebar, step list, prev/next controls, toolbar actions) risk losing a learner’s place. A room should feel like a guided workspace, not a dashboard embedded inside another dashboard.

**Target flow:**

`Bootcamp overview` → phase outline → room intro (goal, time, prerequisites) → focused task sequence → evidence/quiz/flag → room complete → next room recommendation.

**Required changes:**

- Use the same `LearningWorkspaceShell` as courses, with `BootcampOutline` as the desktop outline and mobile sheet content. Retire separate competing toolbars/sidebars after migration.
- Room intro is a compact context panel, not a hero: objective, duration, target/environment state, safety/authorization notice, and Start/Resume.
- Make connection state a single compact status in the workspace header. Opening the terminal or simulation must be an intentional utility action, not another attention-grabbing panel in the reading flow.
- Keep a single sticky bottom `Next` action on mobile only when it does not cover an input or quiz. Desktop next action belongs at the end of the active step.
- Completion must have a stable sequence: validate work → show result/reward → mark room complete → offer next room and return-to-outline. Do not auto-scroll unexpectedly during answer entry or interaction.

### 7. Lab flow: lab library → scenario → practice → flag

**Current flow:** Each lab is a custom page combining `LabPage`, `LearningAccordion`, `WalkthroughLayout`, `WalkthroughStep`, scenario-specific diagrams, connection/simulation controls, related content, and flags. The five implementations repeat the same structure with individually styled inline blocks.

**Breakdown:** Repeating bespoke lab composition makes future labs expensive and introduces subtle behavioural differences. The technical interfaces are valuable, but the framing around them is too card-heavy and uses many tiny labels.

**Target flow:**

`Lab catalogue` → lab overview and access → choose/resume scenario → workspace → perform task → submit flag → completion summary → next recommended lab/course.

**Required changes:**

- Build `LabWorkspace` on `LearningWorkspaceShell`; configure scenario content through a schema rather than bespoke page layout.
- Standardise `LabOverview`, `ScenarioPicker`, `EnvironmentStatus`, `ObjectiveList`, `EvidencePanel`, `HintPanel`, `CommandBlock`, `FlagSubmission`, `LabCompletion`, and `RelatedLearning`.
- Move all scenario-specific diagrams to a `LearningDiagram` slot. They should collapse or become horizontally scrollable on mobile; never compress labels to unreadable text.
- Progressive hints should show consequence/CP rule before reveal, preserve state, and not reflow the entire page after each reveal.
- Flag submission needs explicit pending, validated, invalid, retry, locked and network-error states; success should not depend on a colour change/toast alone.

### 8. Tools and simulations

**Current flow:** Public simulation pages are content-rich product experiences; student tools include separate fullscreen IDE, terminal and network visualiser routes, as well as modal/docked tools invoked from the student shell. Terminals use their own raw palette and tiny control sizing.

**Breakdown:** There are overlapping ways to enter and use tools. A learner cannot easily tell whether a terminal is global, room-specific, sandboxed, or a standalone tool.

**Target flow:**

- A `ToolsHub` categorises standalone tools, learning utilities, and open-source documentation.
- The workspace opens a contextual utility panel with clear scope (for this room/course/lab) and a `Open full tool` action where appropriate.
- Fullscreen tools use `ImmersiveToolShell`: exit/back, title, scope, status, save/reset, keyboard-shortcut help, and responsive utility drawer.

**Required changes:**

- Keep terminal colour/typography inside terminal content only. Its surrounding controls should use the shared app system and 44px targets.
- Define context in the UI: “Room terminal”, “Course playground”, or “Standalone terminal”—never just an icon.
- Make simulation states persistent and recoverable; leaving/reopening must state whether work is retained, reset, or scoped to a room.

### 9. Progress, profile, CP, market, leaderboard, and community

**Current flow:** Profile, rank, trophies, activity, Cyber Coin, marketplace and leaderboard are presented as independently styled product experiences. Landing also promotes several of them before the core learning value is established.

**Breakdown:** Motivation mechanics may help active learners, but they should not rival core learning navigation or obscure transactional/safety information.

**Target flow:** Progress is an integrated view under the student app; profile is shareable identity; market/leaderboard are optional destinations. CP is shown as a compact balance and explained only at moments where it changes an outcome.

**Required changes:**

- Create `ProgressSummary`, `AchievementList`, `ActivityFeed`, `RankSummary`, `Balance`, `TransactionList`, `MarketplaceCard`, and `LeaderboardTable` on shared primitives.
- Do not use trophy cabinets, contribution calendars, animated counters, or celebratory overlays as the default above-the-fold profile/dashboard treatment.
- Market purchases must use one transactional pattern: item, cost, balance after purchase, what unlocks, confirmation, receipt/history, error/retry.
- Public profile should prioritise consent and shareable achievements, with private student details excluded by default.

### 10. Documentation and open-source tool pages

**Current flow:** Tool pages use a dedicated `ToolDocLayout`/topbar, table of contents, hero and repeated documentation section layouts. The topbar includes document navigation as well as broader product menu behaviours. Individual tool pages repeat large grid/card compositions.

**Breakdown:** Documentation needs fast orientation, not the same marketing density. The doc header is attempting to be global navigation, product CTA, section navigation and responsive menu simultaneously.

**Target flow:**

`ToolsHub` → tool overview → install/quick-start → documentation article → related tools/support.

**Required changes:**

- Create `DocsShell`: compact product header; desktop sticky local TOC; mobile “On this page” sheet; article content column; contextual install action. Do not put the full public navigation into the documentation control space.
- Standardise `ToolDocHero`, `InstallCommand`, `CodeExample`, `Callout`, `CapabilityList`, `OptionTable`, `RelatedTools`, `DocPager`, `DocFeedback`.
- Articles should use semantic headings, readable proportional body text, code at a constrained width, copy controls with visible confirmation, and scannable tables on mobile.
- A tool documentation page may use one product visual in its intro. Remove decorative grids/borders around ordinary prose and every example.

### 11. Admin and operational flow

**Current flow:** The admin route places many operational domains behind a query-param tab system: overview, users, bootcamps, market, CP, inbox, broadcast, audit, security, incidents. The page uses a dashboard header and nested tab content with distinct components.

**Breakdown:** A broad tab list is acceptable for an admin workspace, but each workflow needs a direct URL, stable context, filters, bulk actions, saved states and clear destructive-action handling. It should not inherit marketing or learner decoration.

**Target flow:**

`Admin overview` → alert/queue → direct task route (`/admin/users`, `/admin/incidents`, etc.) → complete action → return to context with result.

**Required changes:**

- Keep overview to health, urgent exceptions and assigned work. Move large data tables/forms to task routes rather than conditional dashboard panels.
- Create shared `AdminPageHeader`, `MetricGrid`, `DataTable`, `FilterBar`, `BulkActionBar`, `DetailDrawer`, `ActivityLog`, `DangerZone`, `StatusIndicator`.
- Use explicit confirmation and post-action audit feedback for destructive or security-sensitive actions. Never rely on only a toast.
- On mobile, tables must reflow into labelled records or offer deliberate horizontal-scroll mode with pinned identity/action fields.

## Component and styling migration inventory

This is the ownership model for the new UI. It prevents new page-specific copies of the same pattern. “Retire” means migrate callers and then delete/deprecate the old visual implementation; it does not mean remove a required user capability.

| Target shared component | Must absorb / replace | Required contract |
| --- | --- | --- |
| `PublicShell` | Landing layout, marketing headers/footers, public hero wrappers | Compact header, skip link, page gutter, optional footer, one contextual CTA; no implicit full-height section. |
| `AppShell` | Student topbar, dashboard navigation tiles, standalone page wrappers | Mobile bottom nav, desktop sidebar, utility/overlay region, route title and notification area. |
| `DocsShell` | Tool doc layout/topbar/TOC/mobile doc menu | Global back/product link, local TOC, article region, install action, mobile sheet. |
| `ImmersiveToolShell` | Fullscreen terminal/IDE/network pages and tool-specific chrome | Exit, title/scope, persistent save/reset/help actions, responsive tool drawer, keyboard shortcuts. |
| `LearningWorkspaceShell` | `LearningToolbar`, `LearningNav`, `FocusedStepList`, room sidebar, lab page framing, duplicate mobile controls | Outline, context, active content, utilities, progress, completion and next-action slots; one navigation source on each breakpoint. |
| `LearningCatalogue` + `LearningDetailShell` | Public/signed-in course, lab, HPB and simulation page families | Shared filters, cards, access/progress state, curriculum, requirements, CTA and related items. |
| `Card` + `Metric` | Existing `CardBase`, `CardMedia`, `CardStat`, standalone stat cards, page-local bordered blocks | Variants only for surface/media/interactive/selected; semantic heading/body/footer slots; no default animation/glow. |
| `PageHeader` / `SectionHeader` | Repeated `StudentHeroSection`, ad hoc public heroes and micro-label headings | Eyebrow optional, title, body, one action group, optional factual metadata; compact and content-height. |
| `Button`, `IconButton`, `TextLink` | Raw buttons and raw CTA links across pages | Four semantic variants, 44px minimum controls, loading/disabled state, icon label requirement, router/external support. |
| `FormField` family | Page-local inputs, labels, password implementations, filter controls | Label/help/error/required/status relationship, accessible IDs, mobile spacing, valid/invalid/loading states. |
| `Feedback` family | Toast-only outcomes, custom success/error blocks, hint/quiz feedback | Inline alert, status message, empty state, error state, confirmation state, progress announcement. |
| `OverlayManager` | Modal hosts, bottom sheets, install banner, consent, onboarding/tour, username popup, assistant/community surfaces | Prioritised queue, focus management, one blocking overlay at a time, route exclusions, safe-area handling. |
| `DataDisplay` family | Repeated cards, tables, leaderboards, market rows, admin lists | List, responsive table, key-value grid, timeline, metric grid and pagination contracts. |
| `LearningInteraction` family | Custom lab steps, hints, flags, quiz/code exercise variants | Objective, instructions, evidence, hint, command/copy, quiz, flag submission, completion; shared feedback and event semantics. |

### Styling rules to enforce in code review

- No arbitrary font-size utility in product UI. Adopt named type tokens: `display`, `h1`, `h2`, `h3`, `body`, `body-sm`, `label`, `meta`, `code`. Visible text never falls below 12px; default mobile body is 16px or larger.
- No raw hex/RGB colours outside the token definition and specialised code-syntax themes. The current source contains 3,438 raw hex matches, many in data/simulation code; catalogue those that are truly syntax/diagram-specific and move every UI colour to tokens.
- No raw `<button>` except inside a shared primitive or where a documented accessibility exception exists. The current source has 134 files containing raw buttons.
- No new page-level card class. The audit found 253 card-like class definitions. A product surface must use `Card`, list/divider, or a documented new primitive.
- No `min-h-dvh`, `h-dvh`, `min-h-screen`, canvas/grid effect, marquee, border beam, or entry animation without a documented task reason. There are currently 94 viewport-height declarations and 437 motion/reveal references.
- No feature may add a fixed/floating control without declaring its owner, z-index layer, mobile placement, safe-area behaviour, and collision behaviour with keyboard, banners, and other overlays.
- All long prose must use reading typography; JetBrains Mono remains appropriate for commands, labels, IDs, status and data—not extended marketing/documentation paragraphs.

## Master implementation prompt

Use this prompt for the redesign implementation. It is intentionally prescriptive so an implementation team cannot reduce the work to cosmetic Tailwind edits.

```text
You are a senior product designer and frontend systems engineer rebuilding the
QYVORA frontend. Implement the redesign described in
docs/PRODUCT_UI_REDESIGN_AUDIT.md. This is a product-information-architecture
and component-system migration, not a visual reskin.

Non-negotiable outcome
Create a calm, modern, mobile-first security product. Every screen must make
the user’s next action obvious. Retain QYVORA’s dark technical identity, but
remove decorative cyber UI from ordinary content. Do not reproduce the current
pattern of viewport-high sections, dense card grids, micro-labels, animated
borders/grids, competing CTAs, or floating controls.

First, audit before editing
1. Map every route in src/app/router.tsx to a target journey and shell:
   PublicShell, AppShell, DocsShell, ImmersiveToolShell, or LearningWorkspaceShell.
2. Inventory every existing shared component and page-local card/button/form.
   Reuse behaviour/data where sound, but migrate visual ownership to the target
   shared components below. Do not silently fork components.
3. Produce a route migration checklist and mark old patterns deprecated only
   after their callers have moved.

Build these foundations before page rewrites
- Design tokens for colour, type, space, radius, border, elevation, motion,
  breakpoint, z-index and safe-area. No raw UI colours or arbitrary text sizes.
- Typography tokens: display, h1, h2, h3, body, body-sm, label, meta, code.
  Visible text is never under 12px; body copy is readable and is not mono by
  default. Use mono for code, data and technical labels.
- Shared Button/IconButton/TextLink; all interactive controls meet 44x44px and
  have hover, focus-visible, pressed, disabled and loading states.
- Shared FormField/Input/Select/Checkbox/Toggle; labels, help, errors and
  status are programmatically connected.
- Shared Card, Metric, PageHeader, SectionHeader, EmptyState, InlineAlert,
  StatusIndicator, Progress, responsive DataTable/List, Dialog/BottomSheet.
- OverlayManager: only one blocking overlay at a time; priority is security,
  legal consent, account requirement, onboarding, then promotion. Respect
  focus trapping, Escape, safe areas and the virtual keyboard.

Build exactly these shells
1. PublicShell: direct desktop links; mobile drawer; one contextual CTA; no
   full-screen card-grid navigation.
2. AppShell: desktop sidebar and mobile bottom nav for Home, Learn, Practice,
   Progress and Profile; utilities/notifications have a separate controlled area.
3. DocsShell: article content column, desktop local TOC, mobile On-this-page
   sheet, contextual install action. It must not mix global navigation with TOC.
4. ImmersiveToolShell: explicit back/exit, tool title and scope, save/reset,
   help/shortcuts and responsive utility drawer.
5. LearningWorkspaceShell: one source of learning navigation per breakpoint;
   outline, context, content, utilities, progress and next-action slots. It
   replaces conflicting toolbars, sidebars and duplicate navigation controls.

Migrate journeys in this order
1. Landing → Learn/Tools/Services discovery → authentication.
2. Student dashboard → resume exact learning step.
3. Learning catalogue/detail and entitlement states.
4. Course, bootcamp room and lab workspace flows.
5. Documentation/tool pages and immersive tools.
6. Profile/progress/CP/market/leaderboard.
7. Admin task flows and auth/settings/notifications.

Page-level decisions
- Landing contains six content blocks plus footer: hero, three paths, featured
  learning, proof, tools/research strip, final CTA. Remove standalone Act,
  team, QuiteRoot, blog, market, leaderboard and simulation home sections.
- Public navigation is Learn, Tools, Research, Services, About. Individual
  tools belong under Tools; existing URLs can redirect after migration.
- Dashboard begins with Continue Learning, then Today, three metrics, and
  recent library. Remove the large section-toggle grid.
- Course, bootcamp rooms and labs use LearningWorkspaceShell. On mobile provide
  a compact sticky header plus one Tools bottom sheet—not simultaneous floating
  terminal/sidebar/toolbar/navigation controls. Preserve current learning data,
  completion rules, flag verification and scenario capability.
- Labs must become configuration-driven through shared LabWorkspace and
  LearningInteraction components. Keep specialised diagrams/simulations in
  designated slots and make them readable or scrollable on phone screens.
- Tool docs use DocsShell and semantic article content. Use terminal styling
  only for command/output/code, never normal prose.
- Admin uses direct task routes for table/form work; overview shows only health,
  exceptions and queue. All destructive actions have confirmation and durable
  audit feedback.

Mobile and accessibility acceptance rules
- Start design at 360px, then validate 390, 768, 1024, 1440 and 1920px.
- Natural content height is the default. Viewport-height layouts are only for
  a documented focused task and must work at 320x568 with browser chrome.
- No page-level horizontal scroll, clipped target, keyboard-obscured input or
  overlapping fixed controls. Tables reflow to labelled records or provide a
  deliberate scroll region.
- Keyboard navigation, visible focus, semantic headings/landmarks, labels,
  live status, contrast, reduced motion and 200% zoom are required for every
  route. Do not use colour, toast or animation as the only feedback channel.
- Loading, empty, error, permission-denied, long-content and offline/retry
  states must be built at the same time as populated states.

Visual rules
- One primary action and one visual focal point per viewport.
- Green means action, active, progress or success; semantic warning/error/info
  are exceptions. It is not a decorative border/glow colour.
- Prefer composition, typography, spacing and dividers to a card around every
  block. Use one subtle overlay elevation; no default card glow or beam.
- Motion only explains state or orientation, must respect reduced motion and
  never delays interaction. Remove decorative marquees, ambient border beams,
  and competing reveals.
- Carousels may not hide essential content. Prefer responsive lists/grids.

Verification and handoff
- Add visual regression coverage for populated, loading, empty and error states
  at every target width for the five shells and top journeys.
- Add interaction tests for navigation, overlay priority, resume/step progress,
  flag/quiz feedback, form errors, entitlement and destructive admin actions.
- Run typecheck, lint, test and production build after each migration stage.
- For each migrated route, document: removed UI, replacement shared components,
  analytics event changes, accessibility checks and viewport evidence.
Do not declare success until all route families use an approved shell and no
deprecated duplicate navigation/card/toolbar pattern remains in active UI.
```

## Audit inventory

This report reviewed the complete frontend inventory: 742 non-dependency frontend files (363 TSX, 178 TS, 2 CSS, configuration/public assets and documentation), including all 89,949 lines of non-test TS/TSX/CSS under `src`. The deep static sweep covered the full route map, all page families, navigation, layouts, student components, marketing components, admin components, shared components, walkthrough/learning and simulation systems, data-driven visual configuration, component tests, global styles, and public assets. Key locations include `src/app/router.tsx`, `src/features/marketing/pages/LandingPage/index.tsx`, `src/features/marketing/content/siteConfig.ts`, `src/shared/components/layout/Navbar.tsx`, `src/shared/layouts/{LandingLayout,ToolDocLayout}.tsx`, `src/features/student/layouts/StudentLayout.tsx`, `src/features/student/pages/DashboardPage/index.tsx`, `src/features/student/pages/{CourseLessonPage,BootcampRoomPage}/index.tsx`, `src/features/student/pages/labs/`, `src/shared/components/{learning,walkthrough,tools,ui}/`, `src/features/admin/`, and `src/styles/index.css`.
