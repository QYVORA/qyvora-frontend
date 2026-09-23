# QYVORA Frontend V2 — UI Reconciliation Plan

**Phase 1 deliverable.** This is the working implementation plan produced from the
Phase 0 repository + UI audit. The QYVORA frontend already shipped a coherent V2
design language (AGENTS.md, `docs/`, `siteConfig.ts`, `index.css` calm-system tokens,
shared `Card`/`LearningCard`/`Button`/`Input`/avatar system, dark + light themes,
`SimulatedTerminal`, `FlowDiagram`/`KillChainDiagram`). The goal of this reconciliation
is **not** to invent a new product — it is to make the UI, UX, architecture,
responsiveness, documentation, theme system, feedback behavior, authentication, and
design components all work together as one coherent QYVORA frontend V2 system.

Implementation is in phases; each phase is validated (typecheck, lint, build, route
check, responsive check, dark/light theme check, auth-state check) before moving on.

---

## Phase A — Foundation cleanups (quick wins)

1. **Auth-state flash fix** (dashboard flash for logged-out guests). Root cause:
   the `AppShell` route element mounts chrome (topbar/sidebar/bottom-nav) ungated
   while the `StudentOnly` content guard runs; on a fresh page load the chrome
   renders before the auth bootstrap resolves, and a logged-out visitor can briefly
   see the dashboard shell before redirect. Fix: gate the `AppShell` route element
   itself with an auth guard (`loading → PageLoader`, `!user → Navigate /login`,
   admin → admin) so the shell never mounts for guests — not even one frame.
   Investigate: `bootstrapRanRef`, `DelayedPageLoader` 120ms invisible window, and
   the `AnimatePresence mode="wait"` exit fade. Fix underlying issues, no arbitrary
   setTimeout delays.
2. **WhatsApp links** → replace all company WhatsApp links with the canonical
   `https://whatsapp.com/channel/0029Vb8Aw6L5EjxzLY6L2m1V` channel link in
   `siteConfig.ts`, `socialLinks.ts`, `PublicFooter`, `ContactModal`, `CommunityPopup`,
   and any other WhatsApp href (`wa.me` → channel). Config-driven (`SITE_CONFIG`) so
   there is a single source of truth.
3. **Remove `GridBoxedBackground`** component + its usage on `NotFoundPage` entirely.
4. **Remove long horizontal em-dash constructions** from user-visible copy
   (`— one skill at a time.` etc.) across landing, docs, terms, services, footer.
5. **Terms page redesign** — readability-focused; remove distracting symbol-based
   formatting (`("Terms")`, `&gt;` bullets, em-dashes, brackets).

## Phase B — Landing page redesign

6. **Hero redesign** with avatar-based background image concept:
   - Not clumsy, not overly compact, not overloaded with styling.
   - Works across screen sizes, readable, responsive spacing.
   - Background: avatar-based (Dobia hero) composition with the grid animation
     removed; negative space so hero remains readable on mobile.
   - CTA primary: **"Become a Hacker"** (replaces "Start learning").
7. **Learning section redesign**: a large HPB bootcamp card (Hacker Protocol
   Bootcamp) + complete learning ecosystem: Courses, Labs, Bootcamps, Simulations,
   Cyber Points. Uses the HPB avatar phase system.
8. **Footer redesign**: accent-colored headings, compact spacing, reduce vertical/
   horizontal padding, add company email `qyvorasec@gmail.com`, add WhatsApp channel
   link, clean tail (year + tagline), no giant whitespace.
9. **Landing learning cards**: no scroll-reveal fade that hides card collections;
   render full collection so users see more content below (see Phase D).

## Phase C — UI feedback system + action feedback

10. **UI feedback audit**: every action (search, filter, tag click, toggle, form
    submit) gives clear, human-readable feedback; no raw runtime/technical errors in
    user-facing UI; proper loading/error/success states with `role="status"`/`aria-live`.
11. **Tag/search/toggle interaction**: on tag clicks / search / title toggles,
    provide visible feedback — scroll/focus toward results, result counts, no hidden
    clipped tag strips. Tags wrap naturally (no horizontal clipping).
12. **Tag collections as horizontal carousels**: remove clipping; wrap naturally.
13. **Public card collections**: remove per-card scroll reveal so additional content
    visible below isn't hidden; no horizontal tag carousels.

## Phase D — Documentation redesign

14. **Tool documentation pages** (`/anansi /toha3ee ...`): remove fake/decorative
    terminals; reader-centered redesign; detailed technical content (what/how/install/
    use/commands/examples); no fake terminal decoration; no cards-in-cards.
15. **Code block scrolling**: interactive code blocks keep internal scrolling, but
    don't let page scroll get trapped; require intentional interaction.
16. **Component architecture**: split oversized shared files (e.g. `codeBlockRenderer`)
    into focused modules; separate flow diagram from kill-chain into a shared
    diagram foundation for future learning/docs content.

## Phase E — Services, modals, contact

17. **Services cards redesign** (visual hierarchy, layout, readability, scanning).
    Services CTA: **"Secure Your Company"**.
18. **Request-assessment modal redesign** (layout + QYVORA UI alignment).
19. **Contact Us page** — dedicated public page wired into site navigation.
20. **Input/modal design system** alignment with `/login` + `/register` auth forms.

## Phase F — Profile / leaderboard / team

21. **QYVORA public profile cards + team cards distinct treatment** — separate
    visual language for public/community faces vs founding/core team.
22. **Team page**: add Junior Pentester member (avatar + socials from provided
    folder).
23. **HBB routes**: face cards use the avatar assigned to each card (landing uses
    per-phase avatar already — HPB pages should too).
24. **Leaderboard redesign** (consistent with landing reference).
25. **Avatar system audit + usage recommendations** (where avatars add value:
    empty states, achievements, trophies, onboarding, docs — intentionally placed).
26. **Trophy/achievement system audit** + badge/trophy prompt specs (art may need
    generation; provide image prompts).

## Phase G — Theme + terminal + page loader

27. **Light theme overhaul** — not "everything white"; intentional light counters;
    dark terminal/code blocks retained in light mode.
28. **Simulator terminal color alignment** with QYVORA design system (KALI palette →
    QYVORA accent-based, but terminal stays dark technical in light theme).
29. **Page loader** study reference portfolio loader implementation; adopt its
    typing→completion→hold→fade principles while preserving QYVORA colors (no new
    color system; boot-command loader already matches the design language).

## Final

30. **Final audit** against all requirements; docs (`docs/UI-PATTERN-INVENTORY.md`,
    `docs/AVATARS.md`, `docs/FLOWCHARTS.md`, `docs/TROPHIES.md`,
    `docs/BACKGROUNDS.md`) updated with findings + image-generation prompts.
31. **Commit** all work to `qyvora-frontend-version-two` (current branch) in logical
    commits. Do not touch other branches.
