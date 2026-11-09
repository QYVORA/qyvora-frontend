# QYVORA — Full UI Wireframe

**Status:** Current implementation reference  
**Scope:** Every public, documentation, auth, student, admin, and utility screen in the frontend.  
**Source of truth:** `src/app/router.tsx` for routes and the page components referenced below.  
**Purpose:** A single structural wireframe document for the whole UI — layouts, sections, controls, states, and responsive behaviour.

> This is a structural wireframe, not a pixel-perfect design file. Labels and order follow the current code. Where several routes share one implemented template, the shared template is drawn once and every route is listed.

---

## 0. Wireframe Key

```text
┌─────────────┐   card / panel / surface
│             │
└─────────────┘

[ Button ]        button or primary action
( Toggle )        switch / checkbox
( • )             selected option
▾                 dropdown / select
●                 status dot / unread marker
---               divider
N                 live count or numeric value
```

**Responsive breakpoints**

| Token | Width | Meaning |
|---|---:|---|
| base | `< 640px` | phone |
| `sm` | `>= 640px` | large phone / small tablet |
| `md` | `>= 768px` | tablet |
| `lg` | `>= 1024px` | desktop / full navigation |
| `xl` | `>= 1280px` | wide desktop |

---

## 1. Global UI System

### 1.1 Standard page frame

Most content pages use `PageBody`:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ px-3 pt-6 pb-16                                                              │
│ md:px-4 md:pt-8 md:pb-20                                                     │
│ lg:px-6 lg:pb-24                                                             │
│                                                                              │
│  PageHeader                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ KICKER · UPPERCASE ACCENT                                             │  │
│  │ PAGE TITLE · UPPERCASE 3xl / 4xl / 5xl                                │  │
│  │ Description sentence                                                   │  │
│  │                                             [Action] [Action]           │  │
│  │ ────────────────────────────────────────────────────────────────────── │  │
│  │ metadata row: counts · status · filters                                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Page sections, usually `space-y-8`                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Shared feedback states

| State | Visual |
|---|---|
| Loading | pulsing skeleton cards or rows; `role="status"` where provided |
| Empty | dashed or bordered panel, icon tile, title, optional description + action |
| Error | danger-tinted panel, Dobia avatar, bold title, muted error text |
| Success | toast or inline success alert |
| Locked | muted card or dashed panel with unlock / enrol action |
| Disabled | reduced opacity, not-allowed cursor, no action |

### 1.3 Shared data table

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Search................................]                    N results        │
├──────────────────────────────────────────────────────────────────────────────┤
│ Column A ↑       Column B          Column C          Column D      Actions   │
├──────────────────────────────────────────────────────────────────────────────┤
│ row content ...                                                              │
│ row content ...                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ [10 / page ▾]        Page 1 of N                         [<] [>]             │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Below `md`, the table becomes stacked mobile cards.
- Sortable headers show arrows.
- Empty tables show a dashed empty panel.
- Pagination buttons have 44px touch targets.

### 1.4 Learning page anatomy

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LearningWorkspaceShell                                                       │
│                                                                              │
│ [Back]                                                                       │
│ KICKER                                                                       │
│ TITLE                                                                        │
│ Description                                                                  │
│                                                                              │
│ [stat] [stat] [stat]                              [header action]            │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Progress bar · N of M complete                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Centered learning column — one active task at a time                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 01  Task title                                           [difficulty]  │  │
│  │     task description                                                   │  │
│  │     learning content / terminal / code / quiz checkpoints              │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ [Prev]                                                             [Next]    │
└──────────────────────────────────────────────────────────────────────────────┘
```

Learning pages do not render a persistent lesson sidebar or outline rail. `LearningTaskAccordion` expands one task at a time.

---

## 2. Shells

### 2.1 Public shell

Routes: all public marketing, legal, services, tools index, public profiles, verification, status, sitemap, FAQ, contact.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PUBLIC NAVIGATION — fixed, z-[100], h-16 lg:h-20                            │
│                                                                              │
│ [Logo]      Learn  Bootcamp  Tools  Research  Services  About   [FS] [Auth]  │
└──────────────────────────────────────────────────────────────────────────────┘
│                                                                              │
│ <main id="main-content">                                                     │
│   Page content                                                               │
│   Hero / section clearance: pt-24 md:pt-28 lg:pt-32                          │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ PUBLIC FOOTER                                                                │
│ ┌──────────────────────┬────────────┬──────────┬──────────┬────────────────┐ │
│ │ Logo + mission       │ Learning   │ Tools    │ Company  │ Legal & Trust  │ │
│ │ email                │ links      │ links    │ links    │ links          │ │
│ │ [Join platform]      │            │          │          │                │ │
│ │ [Download App]       │            │          │          │                │ │
│ │ social icons         │            │          │          │                │ │
│ └──────────────────────┴────────────┴──────────┴──────────┴────────────────┘ │
│ QYVORA · GHANA, TAMALE · 2026            “Train like a hacker...”   Sitemap │
├──────────────────────────────────────────────────────────────────────────────┤
│ PUBLIC BOTTOM NAV — mobile only                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Shell-level overlays:** Contact modal, Service Request modal, Tool Install modal, Bootcamp Access modal, Consent banner, PWA status.

#### Public navigation behaviour

- Transparent at top; blurred dark background after scrolling.
- `lg+`: logo + six icon-over-label links + fullscreen + auth actions.
- `< lg`: logo mark + account icon; account icon opens a drawer under the navbar.
- Mobile drawer: `Dashboard` (when signed in) / `Start learning` / `Log In` + `Install App`.
- Keyboard: Escape closes; focus moves into the drawer.

### 2.2 Documentation shell

Routes: all 15 tool documentation pages.

```text
DESKTOP
┌──────────────────────┬───────────────────────────────────────────────────────┐
│ DOCS SIDEBAR         │ DOCUMENT COLUMN                                       │
│ fixed, 264px         │                                                       │
│ collapsed 76px       │ DocHeader                                             │
│                      │  Reference / domain kicker                            │
│ [Logo]               │  [logo] Tool name                                     │
│                      │  summary                                              │
│ Tool links           │  [Repository] [Install]                               │
│  anansi              │  facts: repo / module / Go / binary / entrypoint      │
│  toha3ee             │                                                       │
│  jabari              │ “On this page” TOC                                    │
│  ...                 │                                                       │
│                      │ Sections: prose / code / commands / tables / notes    │
│                      │                                                       │
│                      │ Previous / Next tool pager                            │
│                      │ Colophon + All tools                                  │
└──────────────────────┴───────────────────────────────────────────────────────┘

MOBILE
┌──────────────────────────────────────────────────────────────────────────────┐
│ DOCS MOBILE NAV — sticky identity bar, h-14                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Document column                                                              │
│ pb-[calc(4.5rem+env(safe-area-inset-bottom))]                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ DOCS BOTTOM NAV — fixed                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Auth shell

```text
DESKTOP
┌──────────────────────────────────────┬───────────────────────────────────────┐
│ AUTH HERO                            │ AUTH FORM COLUMN                      │
│ auth-dobia.webp                      │ scrollable                            │
│ [Back to Home]                       │ my-auto max-w-lg                      │
│ “Welcome to QYVORA”                  │                                       │
│ “Building a strong cybersecurity     │  Form card                            │
│  ecosystem in Africa.”               │  ┌─────────────────────────────────┐  │
│                                      │  │ auth mode toggle                │  │
│ • Hands-on penetration testing labs  │  │ identifier / password           │  │
│ • Real-world offensive scenarios     │  │ [GitHub OAuth]                  │  │
│ • CTF challenges & rankings          │  │ [Submit]                        │  │
│                                      │  └─────────────────────────────────┘  │
└──────────────────────────────────────┴───────────────────────────────────────┘

MOBILE: hero stacks above / collapses; form fills width below.
```

### 2.4 Student shell — desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ STUDENT TOPBAR — fixed, z-[100], h-24 md:h-28 + safe-area                   │
│                                                                              │
│ [Dashboard] [Learn] [Practice v] [Complete] [Develop v]  [FS] [Bell] [x] [●] │
│                         ├ Bootcamps      ├ Network                           │
│                         ├ Labs           └ Terminal                          │
│                         └ Competitive                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ Clearance: pt-[calc(6rem+env(safe-area-inset-top))]                          │
│            md:pt-[calc(7rem+env(safe-area-inset-top))]                       │
│                                                                              │
│ Routed page content                                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Topbar actions**

| Control | Behaviour |
|---|---|
| Dashboard | `/dashboard` |
| Learn | `/dashboard/courses` |
| Practice | dropdown: Bootcamps, Labs, Competitive |
| Complete | `/dashboard/certificates` |
| Develop | dropdown: Network, Terminal |
| Fullscreen | browser fullscreen, `lg+` only |
| Notifications | `/dashboard/notifications` |
| Streak | current streak status |
| Profile | `/dashboard/profile` |

### 2.5 Student shell — mobile

```text
┌──────────────────────────────────────────────┐
│ TOPBAR — fixed, h-24 + safe-area             │
│                                              │
│ [Menu]                        [Bell] [x] [●] │
└──────────────────────────────────────────────┘
│ Clearance: 6rem + safe-area                  │
│                                              │
│ Page content                                 │
│                                              │
└──────────────────────────────────────────────┘
```

### 2.6 Full-screen student sidebar

```text
┌──────────────────────────────────────────────┐
│ FULL-SCREEN NAVIGATION                       │
│ fixed inset-0, z-[111], h-dvh                │
│                                              │
│ MENU                              [FS] [X]   │
│                                              │
│ MAIN                                         │
│  Dashboard                                   │
│  Learn                                       │
│                                              │
│ PRACTICE                              [v]    │
│  Bootcamp                                    │
│  Labs                                        │
│                                              │
│ COMPETE                                      │
│  Competitive                                 │
│                                              │
│ DEVELOP                                      │
│  Network                                     │
│  Terminal                                    │
│                                              │
│ ACCOUNT                                      │
│  Profile                                     │
│  Certificates                                │
│  Notifications                     [badge]   │
│  Settings                                    │
│  Marketplace                                 │
│                                              │
│ [Log Out]                                    │
└──────────────────────────────────────────────┘
Backdrop: fixed inset-0, z-[110]
```

### 2.7 Admin shell

```text
DESKTOP
┌──────────────────────────────────────────────────────────────────────────────┐
│ ADMIN TOPBAR — fixed, z-[100], h-20 md:h-24                                  │
│ [mark + ADMIN]                                [Bell] [Avatar] [Logout]       │
├──────────────────────┬───────────────────────────────────────────────────────┤
│ ADMIN SIDEBAR        │ ADMIN CONTENT                                         │
│ fixed, z-[90]        │ pt-20 md:pt-24                                        │
│ 264px / 76px         │                                                       │
│                      │ KICKER: ADMIN · Admin Console                         │
│ MANAGE               │ H1: active tab                                         │
│  Overview            │ Description                                           │
│  Users               │                          [Users N] [Market N] [Refresh]│
│  Bootcamps           │                                                       │
│  Instructor          │ Tab content                                           │
│  QOSE                │                                                       │
│ CONTENT              │                                                       │
│  Market              │                                                       │
│  Points              │                                                       │
│  Certificates        │                                                       │
│ COMMUNICATIONS       │                                                       │
│  Inbox               │                                                       │
│  Broadcast           │                                                       │
│ MONITOR              │                                                       │
│  Audit               │                                                       │
│  Security            │                                                       │
│  Incidents           │                                                       │
│ [Collapse] [Log Out] │ Last updated: HH:MM:SS                                │
└──────────────────────┴───────────────────────────────────────────────────────┘

MOBILE
┌──────────────────────────────────────────────────────────────────────────────┐
│ ADMIN TOPBAR — logo + ADMIN badge             [Bell] [Avatar] [Logout]       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Admin tab content                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ BOTTOM NAV — Overview · Users · Bootcamps · Points · More                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Admin More sheet:** full `NAV_GROUPS` catalogue in a bottom sheet — Manage, Content, Communications, Monitor. Rows show icon + label; descriptions show from `sm+`.

---

## 3. Public UI

### 3.1 Landing page — `/`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ HERO — min-h-dvh, desktop/mobile background variants                        │
│                                                                              │
│ KICKER                                                                       │
│ H1 with rotating typewriter phrases:                                         │
│   “become a hacker.” / “prove it on-chain.” / “earn the badge.”              │
│ Description                                                                  │
│ [Primary CTA] [Secondary CTA]                                                │
│ [PWA install prompt when available]                                          │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ CHOOSE YOUR PATH                                                             │
│ H2: Learn. Practice. Prove.                                                  │
│ ┌────────────┐  ┌────────────┐  ┌────────────┐                              │
│ │ Learn      │  │ Practice   │  │ Work with  │                              │
│ │ /learn     │  │ /learn?tab │  │ us         │                              │
│ └────────────┘  └────────────┘  └────────────┘                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FEATURED LEARNING — background band                                          │
│ [HPB flagship card]                                                          │
│ [Courses] [Labs] [Simulations] [CyberPoints]                                │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ PROOF — live metrics                                                         │
│ [students enrolled] [professionals trained] [bootcamp launches] [products]  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ TOOLS AND RESEARCH                                                           │
│ H2: Combat-ready open-source tooling.                                        │
│ ┌──────────────────────────────┐  ┌──────────────────────────────┐           │
│ │ Tools /tools                 │  │ Research /blogs              │           │
│ └──────────────────────────────┘  └──────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FINAL CTA                                                                    │
│ “Your first module is minutes away.”                              [/register]│
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile:** hero copy scales down; all multi-column blocks stack to one column.

### 3.2 Learning hub — `/learn`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Learn                                                               │
│ Learn                                                                        │
│ Courses, labs, the Hacker Protocol Bootcamp, and more.                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Courses] [Labs] [Bootcamp] [Simulations] [CyberPoints]                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE TAB PANEL                                                             │
│                                                                              │
│ Courses:      CourseBadge · level · title · overview · lessons/minutes/CP    │
│ Labs:         LabBadge · difficulty · title · description · CP reward        │
│ Bootcamp:     QOSE card + five HPB phase cards                               │
│ Simulations:  live-demo cards                                                │
│ CyberPoints:  “Earn CyberPoints on-chain.” card                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Footer CTA: Browse courses / labs / bootcamp / simulations / about CP       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile:** tabs wrap; card grid becomes one column.

### 3.3 Hacker Protocol Bootcamp — `/hpb`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ProgrammeHeroCard over hpb-header.webp                                       │
│ QYVORA · Bootcamp · [Open for enrollment]                                    │
│ HPB · Hacker Protocol Bootcamp                                               │
│ Title + tagline                                                              │
│ [Enroll now] [Join the HPB group]                                            │
└──────────────────────────────────────────────────────────────────────────────┘
│ BootcampFacts strip                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

THE PROGRAMME
  H2: Understand systems before tools
  ┌ What it is ┐  ┌ Who it is for ┐
  ┌ What it covers — two-column bullet list ──────────────────────────────────┐

THE CURRICULUM
  Five phases, nineteen rooms
  [Phase LearningCard] x5 — avatar · duration · room count · [Rooms]

ROOMS BY PHASE
  ┌ Phase N ─ title ─ room count ────────────────────────────────────────────┐
  │ room ID · title · overview · minutes                                     │
  │ ...                                                                      │
  └──────────────────────────────────────────────────────────────────────────┘

ETHICS + NEXT LEVEL
  [Ethics & responsibility] [Learn responsibly] [Next level → Explore QOSE]
```

**Mobile:** hero stacks; cards one column; room rows stack metadata.

### 3.4 QOSE programme — `/qose`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ProgrammeHeroCard over qose-header.webp                                      │
│ QOSE · [Registration status badge]                                           │
│ Title + tagline + status note                                                │
│ [Submit a seat request] or [Ask about the next cohort]                       │
│ Prerequisite: HPB                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
│ BootcampFacts strip                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

TUITION & DATES
  H2: One programme. Three instalments.
  [Month 1 — GH₵300] [Month 2 — GH₵250] [Month 3 — GH₵250]
  [Total GH₵800 + cohort details]

WHAT IT IS
  Overview / Who it is for / What it covers

THE CURRICULUM
  Six phases, twelve weeks, one engagement cycle
  [numbered phase cards]

GROUND RULES
  Authorized work only
  [Ethics card]
  [QOSE registration form when open] + [WhatsApp]
```

**Mobile:** instalment cards stack; curriculum cards one column; form full width.

### 3.5 Public course detail — `/courses/:courseId`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ HERO SPLIT                                                                   │
│ ┌ CourseBadge 40/56 ┐   category badge · difficulty badge · Popular          │
│ │                   │   H1 course title                                      │
│ │                   │   description                                           │
│ │                   │   [Enroll now] [Back to learn]                         │
│ └───────────────────┘                                                        │
└──────────────────────────────────────────────────────────────────────────────┘

┌ Key facts ───────────────────────────────────────────────────────────────────┐
│ [Estimated time] [Lessons] [Cost CP] [Skill level]                           │
└──────────────────────────────────────────────────────────────────────────────┘

[Overview] [What you will learn]
[Prerequisites: linked courses or “None — start with no prior knowledge.”]
[Syllabus: numbered lesson titles]
[CTA: Unlock it for N CP · Create account]

Not found: “Course not found” / “No such transmission” + [Browse courses] [Return]
```

### 3.6 Simulations index — `/simulations`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Tools · Simulations                                                 │
│ Start Training                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ TWO-COLUMN CARD GRID                                                         │
│ ┌──────────────────────────────────┐  ┌──────────────────────────────────┐   │
│ │ icon · title                     │  │ icon · title                     │   │
│ │ description                      │  │ description                      │   │
│ │ feature bullets                  │  │ feature bullets                  │   │
│ │ No account required              │  │ No account required              │   │
│ │ [Open simulation]                │  │ [Open simulation]                │   │
│ └──────────────────────────────────┘  └──────────────────────────────────┘   │
│                                                                              │
│ Browser Terminal Linux Shell             Network Visualizer                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Empty:** “No simulations published yet” + Browse all tools. **Mobile:** one column.

### 3.7 Simulation detail — `/simulations/:slug`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Simulations                                                         │
│ {title} {titleAccent}                                                        │
│ description · tag metadata                                                   │
│ [Start Training] [Back to All Simulations]                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ DEMO LAUNCHER SPLIT                                                          │
│ ┌────────────────────────────────────┐  ┌─────────────────────────────────┐  │
│ │ icon · tag                         │  │ reference CodeBlock             │  │
│ │ demo title + description           │  │                                 │  │
│ │ [Run the Demo]                     │  │                                 │  │
│ │ No account · live in browser       │  │                                 │  │
│ └────────────────────────────────────┘  └─────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│ WHAT YOU CAN DO — feature tiles + [Start Training]                           │
│ RelatedContentSection — sibling simulations                                  │
└──────────────────────────────────────────────────────────────────────────────┘

Overlay: TerminalWrapper or NetworkBuilder modal.
```

### 3.8 Tools index — `/tools`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ Open-source tooling                                                          │
│ Combat-ready tools, documented end to end.                                   │
│ N tools                                                                      │
│ [Release changelog]                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ Domain chips: All · Web & OSINT · Network & Directory · Binary & Fuzzing     │
│               Mobile · Infrastructure · Shared                              │
│ [Search................................]                    N tools          │
├──────────────────────────────────────────────────────────────────────────────┤
│ CARD GRID                                                                    │
│ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐        │
│ │ logo/mark          │ │ logo/mark          │ │ logo/mark          │        │
│ │ display name       │ │ display name       │ │ display name       │        │
│ │ registry name      │ │ registry name      │ │ registry name      │        │
│ │ summary            │ │ summary            │ │ summary            │        │
│ │ [Read the docs]    │ │ [Read the docs]    │ │ [Read the docs]    │        │
│ └────────────────────┘ └────────────────────┘ └────────────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.9 Changelog — `/changelog`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Changelog                                                           │
│ Tool releases, tracked in public                                             │
│ [Browse the tools]                                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Source of truth card · N frameworks tracked                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ RELEASE TRACKER                                                              │
│ [logo] name · summary · [version] · released date · [Changelog] [Docs]      │
│ ...                                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ RECENT CHANGES                                                               │
│ ┌ framework ─────────────────────┐  ┌ framework ─────────────────────┐      │
│ │ highlight bullets              │  │ highlight bullets              │      │
│ │ [Full changelog] [Tool docs]   │  │ [Full changelog] [Tool docs]   │      │
│ └────────────────────────────────┘  └────────────────────────────────┘      │
├──────────────────────────────────────────────────────────────────────────────┤
│ CTA → [Open resources]                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.10 Resources — `/resources`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Resources                                                           │
│ Cheat sheets for operators                                                   │
│ [Open the repository]                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ One source of truth card · counts                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ QYVORA FRAMEWORKS                                                            │
│ [SheetCard: title · description · [Open cheat sheet] [Tool docs]] xN         │
├──────────────────────────────────────────────────────────────────────────────┤
│ POPULAR CHEAT-SHEET GROUPS                                                   │
│ GROUP HEADING                                                                │
│ [sheet card] [sheet card] [sheet card]                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│ CTA → [Read the changelog]                                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.11 Services index — `/services`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Services                                                            │
│ Security Services                                                            │
│ [Secure Your Company]                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ GRID sm:2 lg:3                                                               │
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────┐  │
│ │ icon · featured badge  │ │ icon                   │ │ icon             │  │
│ │ title                  │ │ title                  │ │ title            │  │
│ │ overview               │ │ overview               │ │ overview         │  │
│ │ USD + local price      │ │ USD + local price      │ │ custom quote     │  │
│ │ [View Details]         │ │ [View Details]         │ │ [View Details]   │  │
│ └────────────────────────┘ └────────────────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.12 Service detail — `/services/:service`

Applies to:

- `/services/basic-web-application-pentest`
- `/services/standard-web-application-pentest`
- `/services/employee-cybersecurity-bootcamp`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ badge kicker · service title                                                 │
│ overview                                                                     │
│ [Secure Your Company] [All Services]                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ SCOPE SPLIT                                                                  │
│ What This Engagement Covers                         pricing + pricing note    │
├──────────────────────────────────────────────────────────────────────────────┤
│ WHAT'S INCLUDED — two-column checklist + optional highlight callout          │
├──────────────────────────────────────────────────────────────────────────────┤
│ METHODOLOGY — numbered step cards                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ WHAT YOU GAIN — two-column benefit list                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ THE SECURITY REPORT — deliverables split grid                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ CTA block with DottedMapOverlay                                              │
│ “Ready to get started?” [Request assessment] [All services]                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ RelatedContentSection — sibling services                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.13 Blog index — `/blogs`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Intelligence                                                        │
│ Intelligence Reports                                                         │
│ description · article count                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tag chips: All · top 6 tags · +N more / Fewer tags                           │
│ [Search articles................................]              N results     │
├──────────────────────────────────────────────────────────────────────────────┤
│ CARD GRID 1 / sm:2 / lg:3                                                    │
│ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐        │
│ │ cover              │ │ cover              │ │ cover              │        │
│ │ tags               │ │ tags               │ │ tags               │        │
│ │ title              │ │ title              │ │ title              │        │
│ │ excerpt            │ │ excerpt            │ │ excerpt            │        │
│ │ author · read time │ │ author · read time │ │ author · read time │        │
│ └────────────────────┘ └────────────────────┘ └────────────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘

Empty: “No articles found.”
```

### 3.14 Blog detail — `/blogs/:slug`

Current article routes:

- `/blogs/hacker-protocol-bootcamp`
- `/blogs/anansi-cli`
- `/blogs/africa-cybersecurity-ecosystem`
- `/blogs/attackers-discover-companies`
- `/blogs/africa-needs-cybersecurity-professionals`
- `/blogs/mapping-attack-surfaces`
- `/blogs/future-cybersecurity-africa`
- `/blogs/hpb-2026-cohort-case-study`

Legacy redirect: `/blogs/hacker-protocol-book` → `/blogs/hacker-protocol-bootcamp`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ARTICLE HEADER                                                               │
│ [tag] [tag]                                                                  │
│ H1 article title                                                             │
│ subtitle                                                                     │
│ author · date · read time                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ FEATURED IMAGE — 16/9, 21/9 at larger widths                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ ARTICLE BODY                                                                 │
│ Template selected by slug: prose, headings, lists, code, quote blocks        │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Back to all blogs]                          QYVORA // {date}                │
├──────────────────────────────────────────────────────────────────────────────┤
│ KEEP READING — two-column cards of all other posts                           │
└──────────────────────────────────────────────────────────────────────────────┘

Not found: “Blog Not Found” + [Back to Blogs].
```

### 3.15 About — `/about`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ About QYVORA                                                                 │
│ Built in Africa, for African defenders.                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ FIVE TILES                                                                   │
│ [The team] [Leadership] [Quiteroot] [Contact] [Legal]                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.16 Team — `/team`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Team Directory                                                      │
│ Our Team · member count                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ 01. FOUNDING & LEADERSHIP                                                    │
│ Executive Team                                                               │
│ [member card] [member card] [member card]                                    │
│                                                                              │
│ 02. QYVORA SECURITY TEAM                                                     │
│ Security Operations & Research                                               │
│ [member card] ... or empty-state link to /quiteroot?team=security            │
│                                                                              │
│ 03. QYVORA TECH TEAM                                                         │
│ Engineering & Development                                                    │
│ [member card] ... or empty-state link to /quiteroot?team=tech                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Join QYVORA CTA · [View open roles] [Get in touch]                           │
└──────────────────────────────────────────────────────────────────────────────┘

Member card:
┌────────────────────────────┐
│ 4/3 image                  │
│ role badge                 │
│ @handle                    │
│ name                       │
│ location                   │
│ bio                        │
│ discipline chips           │
│ [View profile] socials     │
└────────────────────────────┘
```

### 3.17 Leadership — `/leadership`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Leadership                                                          │
│ Founding & Executive Team                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ SIX LEADER CARDS                                                             │
│ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐        │
│ │ 4/3 image          │ │ 4/3 image          │ │ 4/3 image          │        │
│ │ role               │ │ role               │ │ role               │        │
│ │ @handle · name     │ │ @handle · name     │ │ @handle · name     │        │
│ │ location           │ │ location           │ │ location           │        │
│ │ disciplines        │ │ disciplines        │ │ disciplines        │        │
│ │ [Profile] socials  │ │ [Profile] socials  │ │ [Profile] socials  │        │
│ └────────────────────┘ └────────────────────┘ └────────────────────┘        │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Meet the complete team → /team]                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.18 Quiteroot — `/quiteroot`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Technical Team                                                      │
│ Quiteroot                                                                    │
│ metadata: Teams / Roles / In place · Open                                    │
│ [Apply to Quiteroot]                                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Branch tabs: [Tech] [Security]     (?team=tech | ?team=security)             │
├──────────────────────────────────────────────────────────────────────────────┤
│ QUITEROOT TEAM SECTION                                                       │
│ branch header + description                                                  │
│                                                                              │
│ per role:                                                                    │
│ ┌ filled role ─────────────────────────────────────────────────────────────┐ │
│ │ holder identity · role · profile link                                     │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│ ┌ open role ───────────────────────────────────────────────────────────────┐ │
│ │ capability evidence · responsibilities · [Apply]                          │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.19 Public leaderboard — `/leaderboard`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Operators                                                           │
│ Operator · total operator count                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Period chips · optional cohort chips · [Operators]                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ PODIUM — order 2 · 1 · 3 on desktop                                          │
│ ┌──────────┐   ┌──────────┐   ┌──────────┐                                  │
│ │ #2       │   │ #1       │   │ #3       │                                  │
│ │ operator │   │ operator │   │ operator │                                  │
│ │ rank · CP│   │ rank · CP│   │ rank · CP│                                  │
│ └──────────┘   └──────────┘   └──────────┘                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ RANKS 4+                                                                     │
│ # | Operator | Rank | CP | Streak                                            │
│ row ... (“You” highlighted)                                                  │
│ [Load more operators (N remaining)] or “End of board · all operators shown”  │
├──────────────────────────────────────────────────────────────────────────────┤
│ CP balances verified on QYVORA Chain · N operators                           │
└──────────────────────────────────────────────────────────────────────────────┘

States: skeleton podium · empty “No operators ranked yet” · error panel.
```

### 3.20 CyberPoints — `/cp`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Economy                                                             │
│ [CP logo] CyberPoints (CP)                                                   │
│ [Start Learning] [View Bootcamp]                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ HOW IT WORKS                                                                 │
│ Earn CP Through Real Work                                                    │
│ [Complete Labs] [Submit Solutions] [Accumulate Points] [Prove Your Skills]   │
├──────────────────────────────────────────────────────────────────────────────┤
│ WHY CP MATTERS                                                               │
│ ┌ Skills Over Certificates ───────────────┐  ┌ Public Profiles ────────────┐ │
│ │ copy + [Verify a Credential]            │  │ Competitive Rankings        │ │
│ │                                         │  │ Verifiable Progress          │ │
│ └─────────────────────────────────────────┘  └─────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ ProgrammeCtaCard                                                             │
│ Ready to Start · Build Your Verified Cybersecurity Profile                   │
│ [View Bootcamp] [Create Account]                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.21 Zero Day Market — `/zero-day-market`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Market                                                              │
│ Zero Day Market                                                              │
│ [Join to Purchase] or [Open the CP marketplace]                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Search................................]                       [ViewToggle]  │
├──────────────────────────────────────────────────────────────────────────────┤
│ BATCHED PRODUCT GRID — 3 per batch                                           │
│ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐        │
│ │ cover              │ │ cover              │ │ cover              │        │
│ │ Intelligence Asset │ │ Intelligence Asset │ │ Intelligence Asset │        │
│ │ title              │ │ title              │ │ title              │        │
│ │ description        │ │ description        │ │ description        │        │
│ │ CP price           │ │ CP price           │ │ CP price           │        │
│ │ [View in Store]    │ │ [Log In to Purchase]│ │ [View in Store]   │        │
│ └────────────────────┘ └────────────────────┘ └────────────────────┘        │
├──────────────────────────────────────────────────────────────────────────────┤
│ [BatchPagination]                                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.22 Credentials — `/credentials`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Credentials                                                         │
│ Credentials that can be checked                                              │
│ [Verify a credential]                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌ The public record ─────────────────┐  ┌ The file is not the proof ───────┐ │
│ │ Recipient · Programme · Cohort     │  │ registry source of truth          │ │
│ │ Completion date · Result           │  │ chain anchor · revocation         │ │
│ │ Credential ID                      │  │ keepsake                          │ │
│ └────────────────────────────────────┘  └───────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ HOW VERIFICATION WORKS — 3 numbered steps                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ WHAT A RESULT MEANS — Valid · Revoked/suspended · Not found                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ CTA [Verify a credential] [Ask about a credential]                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.23 Verify — `/verify`, `/verify/:credentialId`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Credentials                                                         │
│ Verify a Credential                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌ Check an ID ────────────────────────┐  ┌ How verification works ──────────┐ │
│ │ [Credential ID input]              │  │ 1. Paste the credential ID       │ │
│ │ hint                               │  │ 2. Registry and chain check      │ │
│ │ [Verify Credential]                │  │ 3. A clear verdict               │ │
│ └────────────────────────────────────┘  │ privacy note                     │ │
│                                          └──────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ RESULT REGION — aria-live                                                    │
│ checking skeleton → error “Verification unavailable”                         │
│ → “Credential not found”                                                     │
│ → “Credential revoked” + record fields                                       │
│ → “Credential verified” + status/block + copy link + record fields           │
│    + chain-anchor alert + read-only CertificateFrame                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.24 Status — `/status`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Status                                                              │
│ System status                                                                │
│ [Refresh status] · auto-refresh 60s                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ CURRENT STATUS CARD · icon · level · last checked · badge                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ COMPONENT CARDS — three columns                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ ACTIVE INCIDENTS                                                             │
│ success card “All systems operational” or incident cards                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ RECENTLY RESOLVED — conditional                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ CTA “Seeing a problem?” → [Contact the desk]                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.25 Sitemap — `/sitemap`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Sitemap                                                             │
│ Every public page                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ CARD GRID                                                                    │
│ [Start here]   [Platform]   [Company]                                        │
│ [Trust and credentials]      [Legal]                                         │
│ [Research — All articles + every post]                                       │
│ [Tool documentation — all 15 tools, sm:2 lg:3]                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.26 FAQ — `/faq`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · FAQ                                                                 │
│ Questions, answered                                                          │
│ [Ask the desk]                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ Category anchor pills                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ FAQ GROUP 01 — heading + intro                                               │
│ ┌ accordion row ───────────────────────────────────────────────────────────┐ │
│ │ Question                                                        [+]      │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ...                                                                          │
│ FAQ GROUP 02 ...                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ Still stuck? Talk to the operations desk                                     │
│ [Contact us] [Book a call → /contact#book-a-call]                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.27 Contact — `/contact`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ QYVORA · Contact                                                             │
│ Contact the Desk                                                             │
│ [Browse the FAQ]                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ TWO-COLUMN SPLIT                                                             │
│ ┌ CHANNELS ──────────────────────────┐  ┌ SEND A TRANSMISSION ─────────────┐ │
│ │ [Email]                            │  │ Name                              │ │
│ │ [WhatsApp]                         │  │ Email                             │ │
│ │ [Operations · replies in 24h]      │  │ Message                           │ │
│ │                                    │  │ [Send]                            │ │
│ └────────────────────────────────────┘  └───────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ #book-a-call                                                                 │
│ Book a conversation with the desk · CallRequestForm                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.28 Legal and policy pages

Shared `LegalDocumentPage` template. Routes:

| Route | Title | Kicker | Special action |
|---|---|---|---|
| `/terms` | Terms of Service | Legal Framework | — |
| `/privacy` | Privacy Policy | Legal · Privacy | [Contact us] |
| `/cookies` | Cookie Policy | Legal · Cookies | [Manage cookie preferences] |
| `/security` | Security & Responsible Disclosure | Trust · Security | [Report a vulnerability] · security.txt |
| `/refund-policy` | Refund & Cancellation Policy | Legal · Payments | [Request a refund] |
| `/accessibility` | Accessibility Statement | Trust · Accessibility | [Report a barrier] |
| `/acceptable-use` | Acceptable Use & Community Guidelines | Legal · Community | [Report a concern] |

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader                                                                   │
│ kicker · title · summary                                                     │
│ [optional action]                                                            │
│ Effective · Updated · Jurisdiction                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ ON THIS PAGE — numbered TOC                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ 01  Section title                                                            │
│     body copy                                                                │
│     • accent bullet                                                          │
│     • accent bullet                                                          │
│                                                                              │
│ 02  Section title                                                            │
│     ...                                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Related policies: [policy] [policy] [policy]                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.29 Public profile — `/:handle`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PublicContainer · pt-24 md:pt-28 lg:pt-32                                    │
│ lg:grid-cols-12                                                              │
│                                                                              │
│ ┌ LEFT RAIL — lg:col-span-4, sticky top-24 ─────────────────────────────────┐ │
│ │ ProfileIdentityBlock                                                      │ │
│ │ identicon · rank chip · bio · meta grid · socials · XP bar                │ │
│ │ [Back to Home] [Share]                                                    │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌ RIGHT MAIN — lg:col-span-8 ───────────────────────────────────────────────┐ │
│ │ ProfileMetricsStrip — CP · Rank · Labs · Courses · Level · Since          │ │
│ │ AchievementsSection                                                       │ │
│ │ ActivityTimeline + ContributionCalendar                                   │ │
│ │ CoursesModule                                                             │ │
│ │ LabsModule                                                                │ │
│ │ TrophyCabinet                                                             │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

Invalid handle without @ → NotFoundPage.
Loading → PageLoader. Not found → “Operator Not Found” + [Return Home].
Mobile: rail and main stack vertically.
```

---

## 4. Documentation UI

### 4.1 Tool documentation template

Routes:

`/anansi`, `/toha3ee`, `/jabari`, `/aksum`, `/shaka`, `/nzinga`, `/sekhmet`, `/mansa`, `/amanirenas`, `/amina`, `/sundiata`, `/timbuktu`, `/kush`, `/imhotep`, `/qyvora-common`

```text
┌──────────────────────┬───────────────────────────────────────────────────────┐
│ TOOL RAIL            │ DOCUMENT HEADER                                       │
│                      │                                                       │
│ [logo]               │ Reference / {domain}                                  │
│ anansi               │ [logo] {displayName}                                  │
│ toha3ee              │ summary                                               │
│ jabari               │ [Repository] [Install]                                │
│ aksum                │                                                       │
│ shaka                │ Facts                                                 │
│ nzinga               │ [Repository] [Go module] [Go version]                 │
│ sekhmet              │ [Binary] [Entrypoint] [License]                       │
│ mansa                │                                                       │
│ amanirenas           │ ON THIS PAGE                                          │
│ amina                │ [section link] ...                                    │
│ sundiata             │                                                       │
│ timbuktu             │ DOCUMENT BODY                                         │
│ kush                 │ prose / subheading / code / command / commands        │
│ imhotep              │ table / note / list / facts / definitions / stages    │
│ qyvora-common        │                                                       │
│                      │ [Previous tool]                  [Next tool]           │
│                      │ Colophon · Part of the QYVORA open-source toolkit.    │
│                      │ [All tools]                                           │
└──────────────────────┴───────────────────────────────────────────────────────┘
```

**Mobile:** rail becomes `DocsMobileNav` identity bar; bottom nav is fixed; no footer.

---

## 5. Auth UI

### 5.1 Login / admin login — `/login`, `/mr-robot`

```text
┌──────────────────────────────────────┬───────────────────────────────────────┐
│ AUTH HERO                            │ AUTH FORM                             │
│ image                                │                                       │
│ [Back to Home]                       │ [Log In] [Register] mode toggle       │
│ “Welcome to QYVORA”                  │                                       │
│ mission copy                         │ Identifier                            │
│                                      │ Password                              │
│ • hands-on labs                      │ [Show / hide password]                │
│ • offensive scenarios                │                                       │
│ • CTF & rankings                     │ [Log In]                              │
│                                      │                                       │
│                                      │ ─── or ───                            │
│                                      │ [Continue with GitHub]                │
│                                      │                                       │
│                                      │ error alert / shake state             │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

Admin login uses the same form with admin-specific copy. Registration mode exposes handle suggestions.

### 5.2 Register — `/register`

Immediately redirects to `/login` with registration mode selected. No standalone visual page.

### 5.3 Auth callback — `/auth/callback`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ AuthFormLayout                                                               │
│ centered status card                                                         │
│ • Signing in…                                                                │
│ • success toast → redirect                                                   │
│ • failed state                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Change password — `/change-password`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ AuthFormLayout                                                               │
│ ┌ Password Change Required ────────────────────────────────────────────────┐ │
│ │ shield icon                                                               │ │
│ │ token field (when required)      ?token= or change_token                  │ │
│ │ New password                                                              │ │
│ │ Confirm password                                                          │ │
│ │ [Update password]                                                         │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Student UI

### 6.1 Dashboard — `/dashboard`

```text
PageHeader
  QYVORA · Dashboard · Dashboard
  metadata: [N CP] [Rank] [Nd Streak]

[ErrorState: Sync Failed]
[CertificateClaimBanner when claimable]
[QoseDashboardCard when QOSE state exists]

CONTINUE
┌──────────────────────────────────────────────────────┐  ┌────────────────────┐
│ DashboardHero                                        │  │ DailyMissionCard   │
│ Welcome back, @username                              │  │ difficulty badge   │
│ H2 next objective                                    │  │ mission details    │
│ body copy                                            │  │                    │
│ [primary CTA]                                        │  │                    │
└──────────────────────────────────────────────────────┘  └────────────────────┘
  lg: main + 340px right rail

TODAY
┌──────────────────────────────────┐  ┌───────────────────────────────────────┐
│ WeeklyOperationCard             │  │ Week at a Glance / WeekActivity        │
│ or “No weekly operation…”       │  │ visit dates + durations                │
└──────────────────────────────────┘  └───────────────────────────────────────┘
[CpEarnHint]

YOUR LEARNING
Everything you are enrolled in, plus the tools you work with.

BOOTCAMP                                      [View All →]
[ActiveDeployments]
[StudentBootcampCard] [StudentBootcampCard] [StudentBootcampCard]
empty: “No active deployments.”

COURSES                                       [View All →]
[LearningCard] [LearningCard] [LearningCard]

LABS                                          [View All →]
[LearningCard] [LearningCard] [LearningCard]

TOOLS
[Terminal] [Network Visualizer]

MARKETPLACE                                   [View All →]
[LearningCard] [LearningCard] [LearningCard]

SKILL MATRIX                                  Overall · NN%
┌ radar chart ─────────────────────┐  ┌ SkillStats ──────────────────────────┐
└──────────────────────────────────┘  └──────────────────────────────────────┘

[ProgressionPanel — Rank · Progression Points · Current Rank · Next Rank]
```

**Mobile:** hero + mission stack; Today stacks; grids 1 column; radar and stats stack.

### 6.2 My Courses — `/dashboard/courses`

```text
PageHeader
  QYVORA · Learn · My Courses
  Your enrolled courses and progress.
  [Continue] or [Browse Courses]

[Search courses…] — only when purchased courses exist
[loading: MyCoursesSkeleton]
[ErrorState: Failed to load your courses.]

AVAILABLE COURSES — grid 1 / sm:2 / lg:3
┌ LearningCard ──────────────────────────────┐
│ course badge · category · difficulty       │
│ title                                      │
│ description                                │
│ duration · progress bar                    │
│ [Completed] / [Continue] / [Start]         │
└────────────────────────────────────────────┘

Empty search: “No courses match your search.” [Clear]

LOCKED COURSES — grid 1 / sm:2 / lg:3
┌ muted 16:9 card ───────────────────────────┐
│ category badge                             │
│ title                                      │
│ CourseBadge                                │
│ [View Details]                             │
└────────────────────────────────────────────┘
```

### 6.3 Course lesson — `/dashboard/courses/:courseId?lesson=N`

```text
LearningWorkspaceShell
  back: Back to My Courses
  kicker: course category
  title: course title
  description
  stats:
    [Progress NN%] [Lessons n/N] [CP cost] [Level]
  progress bar
  action: [Review course] / [Continue learning] / [Start learning]

LearningTaskAccordion
  01  lesson title                                  [check / lock / number]
      expanded lesson content
      code / terminal / quiz checkpoints

[Prev]                                                              [Next]

Completion: CelebrationModal — “Course Complete”
```

States: course not found, access skeleton, “Course Not Unlocked”, completed lesson persisted locally.

### 6.4 Bootcamp course — `/dashboard/bootcamps/:bootcampId`

```text
NOT ENROLLED
LearningWorkspaceShell
  QYVORA · Bootcamp
  Hacker Protocol Bootcamp
  Registration is required…
  [Back to Dashboard]
  EmptyState: Bootcamp access required
  [View enrolment] [Account settings]

ENROLLED
LearningWorkspaceShell
  back: Back to Dashboard
  QYVORA · Bootcamp
  course title
  description
  stats:
    [Progress NN%] [Rooms done/total] [Phases done/total]
  progress bar
  [Continue training →]

  LearningFilterStrip — phase filters
  LearningAccordion
    01  phase / room title                         [check / lock]
        description
        [Start] or [Unlock for N CP]
```

### 6.5 Bootcamp room — `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId`

```text
Loading: BootcampRoomSkeleton

LOCKED / MISSING
LearningWorkspaceShell
  room title
  EmptyState: “Room not found.” or “This room is locked…”

NORMAL ROOM
LearningWorkspaceShell
  kicker: phase codename - phase title
  title: room title
  description
  back: Back to Bootcamp
  stats: [minutes] [steps] [in session] [complete]
  progress: viewed steps / total steps
  action: [Review room] / [Continue training] / [Go to checkpoint]

  LearningTaskAccordion
    01  step title
        step content / terminal / checkpoint
    checkpoint: room-final-quiz
      “Passed” or “Required before the room can be completed”

  “N of M tasks viewed”
  completion CTA

Overlay: RoomCompletionCelebration + next-room navigation.
```

### 6.6 Labs index — `/dashboard/labs`

```text
PageHeader
  QYVORA · Practice · Attack Labs
  description · [13 Labs] [CP Range]
  [Start First Lab]

LearningCatalogue
  [Search labs…]
  filters: All Labs / difficulty filters
  grid 1 / sm:2 / lg:3

  ┌ LabCard ───────────────────────────────────┐
  │ LabBadge · difficulty badge                │
  │ title                                      │
  │ description                                │
  │ CP reward · progress if complete           │
  │ [Completed] / [Start]                      │
  └────────────────────────────────────────────┘

Empty: “No labs found” · adjust search/filter.
```

### 6.7 Lab page template — all 13 labs

**Shared scenario listing**

```text
LearningWorkspaceShell
  back: Back to Labs
  kicker
  title: “<Lab title> Lab”
  description

LearningAccordion
  01  scenario title                              [number / check / lock]
      description
      [Start] or [Unlock for N CP]

[Optional RelatedContent]
```

**Active walkthrough**

```text
WalkthroughLayout
  LearningWorkspaceShell
    icon · title · subtitle · back label
    stats: [Difficulty] [Est. time] [Lab ID] [steps completed/total]
    progress bar
    [Start lab] / [Continue lab] / [Review lab]

    Connection banner
      Disconnected: “Connect to lab environment to begin” [Connect]
      Connected: “Connected: <target IP>” [Disconnect]

    [SimulationPanel when configured]

    LearningTaskAccordion
      01  step title
          walkthrough content / terminal / quiz / flag

    [Prev]                                                        [Next]
    [Operation complete banner]
```

**Lab catalogue**

| Lab | Route | Scenarios |
|---|---|---|
| Privilege Escalation | `/dashboard/labs/privesc` | SUID Find · Sudo Vim Escape · Cron Job Hijack · Writable passwd · Dirty Kernel · Cap Setuid Python · PATH Trick · Docker Breakout · NFS No Root Squash · Sticky Bit Race |
| Password Cracking | `/dashboard/labs/passwords` | MD5 · SHA-256 · bcrypt · NTLM · /etc/shadow extraction · Multi-hash cracking |
| SQL Injection | `/dashboard/labs/sql-injection` | NovaCorp Login Portal · NovaCorp Search API |
| OSINT | `/dashboard/labs/osint` | Email Harvesting · Social Media Recon · Subdomain Enumeration · Data Breach Check · Full Recon Mission |
| Kill Chain | `/dashboard/labs/kill-chain` | Internal Network Penetration · Web Application Attack Chain |
| Broken Access Control | `/dashboard/labs/web-access-control` | Meridian Billing Portal · Fleetline Orders API |
| AD Enumeration | `/dashboard/labs/ad-enum` | Anonymous LDAP Bind · Charting the Domain |
| API Security | `/dashboard/labs/api-security` | Gateway Token Service · Avatarly Image Proxy |
| Enterprise Attack Paths | `/dashboard/labs/attack-paths` | AS-REP Roastable Accounts · Credential Reuse Path |
| Security Automation | `/dashboard/labs/automation` | Python Port Scanner · Bash HTTP Enumerator |
| Engagement Methodology | `/dashboard/labs/methodology` | Rules of Engagement · Attack Surface Mapping |
| Network Security | `/dashboard/labs/network-security` | Service Enumeration · Cleartext in the Wire |
| Wireless Security | `/dashboard/labs/wlan-security` | Access Point Discovery · Handshake Capture |

### 6.8 Competitive leaderboard — `/dashboard/competitive`

```text
PageHeader
  QYVORA · Battle · Competitive Leaderboard
  N operators ranked by CyberPoints
  [Trophy] [N] Operators
  [View Public Board]

Period tabs: [All Time] [This Week] [This Month]

[loading: CompetitiveSkeleton]
[error banner]

Desktop header:
  # | Operator | Rank | CP | Streak

LeaderboardRow
  rank · avatar/name · rank · CP · streak
  current user marked “You”

[Show more] / “Loading…”
CP balances verified on QYVORA Chain · N operators
```

### 6.9 Networks — `/dashboard/networks`

```text
PageHeader
  QYVORA · Practice · Network Lab
  Simulated corporate network environment for terminal practice
  [10.0.0.0/24] Subnet · [N/M] Discovered
  [Open Terminal]

SIMULATED ENVIRONMENT NOTICE
  fictional devices / IPs / traffic disclaimer

NETWORK INFO — grid 2 / md:4
[Subnet] [Gateway] [DNS] [Netmask]

YOUR MACHINE (KALI)
[IP Address] [MAC] [Hostname]

LEGEND
● Discovered (N/M)     ○ Undiscovered     ! hidden devices, use nmap

DEVICE LIST
# | Hostname | IP
discovered rows …
empty: “No hosts discovered yet. Open the terminal and run nmap -sn…”
“N more device(s) to discover”

TRY IT YOURSELF
ping 10.0.0.1
nmap -sn 10.0.0.0/24
nmap -sV 10.0.0.5
nmap -O 10.0.0.10
nmap -p- 10.0.0.5
arp

TerminalWrapper modal — title: network-lab
```

### 6.10 Marketplace — `/dashboard/marketplace`

```text
PageHeader
  Marketplace · Marketplace
  Redeem your CyberPoints.
  [CP logo] [balance] CP Balance

[Search items…] — when All tab active
Tabs: [All] [Market]

ALL TAB
grid 1 / md:2 / lg:3
┌ product card ──────────────────────────────┐
│ 16:9 cover                                 │
│ Intelligence Asset · Owned / Public badge  │
│ title                                      │
│ description                                │
│ Free Access or CP amount                   │
│ [Download] / [Unlock]                      │
└────────────────────────────────────────────┘
empty: “No items found.”

MARKET TAB — transaction history
[Zap] Market
transaction rows:
  positive/negative icon · description
  date · short ID
  signed CP amount
empty: “No items found.”
```

### 6.11 Profile — `/dashboard/profile`, `/dashboard/profile/:username`

```text
PageBody
lg:grid-cols-12

LEFT ASIDE — lg:col-span-4, sticky top-24
┌ ProfileIdentityBlock ──────────────────────────────────────────────────────┐
│ avatar                                                                     │
│ display name / @handle                                                     │
│ rank badge + RankInsignia                                                  │
│ Cyber Points                                                               │
│ bio                                                                        │
│ metadata: org / email / joined / country                                   │
│ social links                                                               │
│ Level N · XP current / next + progress bar                                 │
│ [Edit Profile] [Share] [Public View]                                       │
└────────────────────────────────────────────────────────────────────────────┘
┌ SocialAccountConnection — own profile only ────────────────────────────────┐
└────────────────────────────────────────────────────────────────────────────┘

RIGHT MAIN — lg:col-span-8
┌ ProfileMetricsStrip ───────────────────────────────────────────────────────┐
│ [CP] [Rank] [Labs] [Courses] [Level] [Since]                              │
└────────────────────────────────────────────────────────────────────────────┘
┌ AchievementsSection ───────────────────────────────────────────────────────┐
│ Achievements · tabs: All / Courses / Labs / Bootcamp / Skills              │
│ badge grid · optional show-all                                             │
└────────────────────────────────────────────────────────────────────────────┘
┌ ActivityTimeline · ContributionCalendar ───────────────────────────────────┐
└────────────────────────────────────────────────────────────────────────────┘
┌ CoursesModule ─────────────────────────────────────────────────────────────┐
└────────────────────────────────────────────────────────────────────────────┘
┌ LabsModule ────────────────────────────────────────────────────────────────┐
└────────────────────────────────────────────────────────────────────────────┘
┌ CertificatesModule — own profile ──────────────────────────────────────────┐
└────────────────────────────────────────────────────────────────────────────┘
┌ TrophyCabinet ─────────────────────────────────────────────────────────────┐
└────────────────────────────────────────────────────────────────────────────┘

Overlay: EditModal.
Mobile: left rail and main stack; metrics wrap.
```

### 6.12 Certificates — `/dashboard/certificates`

```text
PageHeader
  Achievements · Certificates
  Your verifiable credentials — view, verify and download each certificate…

[ErrorState: Could not load certificates]
or [loading: 3 card skeletons, grid sm:2 xl:3]
or
  [CertificateClaimCard]
    Certificate ready · Claim your HPB certificate
    [Claim certificate]

  YOUR CREDENTIALS
  grid sm:2 xl:3
  ┌ credential card ───────────────────────────┐
  │ programme logo (HPB / QOSE)                │
  │ status badge: Issued / revoked             │
  │ programme name                             │
  │ completion date · result                   │
  │ Credential ID                              │
  │ [View] [Verify]                            │
  └────────────────────────────────────────────┘

  Empty: “No certificates yet” + [View bootcamps]

CERTIFICATE DIALOG
  CertificateFrame preview
  [PDF] [PNG] [JPEG]
  public verification link
```

### 6.13 Notifications — `/dashboard/notifications`

```text
PageHeader
  Inbox · Notifications
  System alerts and mission updates.
  metadata: [N] Unread
  [Mark All Read] when unread > 0

Empty:
  filter=unread → “No unread notifications.”
  otherwise → “No notifications yet. You're clear.”

NOTIFICATION LIST — vertical stack
┌ notification card ─────────────────────────────────────────────────────────┐
│ unread accent dot                                              top-right   │
│ type-colored border/background                                             │
│ bell icon · title · type badge                                             │
│ message                                                                    │
│ timestamp                                                                  │
│ [Mark read] when unread                                                    │
└────────────────────────────────────────────────────────────────────────────┘
read cards muted / lower opacity

[Load more (N remaining)] — page size 15
```

The `?filter=unread|system|achievement` URL state affects the list and empty copy, but no visible filter tabs are rendered.

### 6.14 Settings — `/dashboard/settings/:section?`

```text
PageHeader
  Configure
  {section title}
  {section description}

SINGLE CARD for the selected section
(no in-page settings nav / sidebar / tab strip)
```

| Route | Section | Card contents |
|---|---|---|
| `/dashboard/settings` | Appearance | Compact Mode toggle · Animations toggle · Font Size Small/Medium/Large · Data Saver toggle |
| `/dashboard/settings/appearance` | Appearance | same |
| `/dashboard/settings/notifications` | Notification Preferences | Email · Push · Mission updates · CP alerts · Marketing emails · System updates |
| `/dashboard/settings/learning` | Learning Preferences | Preferred Difficulty · Weekly Study Goal · Show Hints · Auto-play Videos · Show Code Examples |
| `/dashboard/settings/security` | Security | Change Password · Recovery Token · Active Sessions |
| `/dashboard/settings/account` | Danger Zone | Delete Account confirmation |

**Security card anatomy**

```text
CHANGE PASSWORD
[Current] [New] [Confirm] [Update Password]

RECOVERY TOKEN
warning: token restores account access
live token: “Copy this now. It won't be shown again” + [Copy] + [I've saved my token]
saved token: “Token exists” + [Generate New Token] + regenerate confirmation
no token: [Generate New Token]

ACTIVE SESSIONS
[Revoke All Others]
session rows: user agent · Current badge · IP/date · [Revoke]
empty: “No active sessions found.”
```

### 6.15 QOSE registration — `/dashboard/qose`

```text
LOADING
skeleton title + text + two payment-plan cards

ERROR
ErrorState “QOSE registration unavailable” [Try again]

LOADED
PageHeader
  QYVORA · QOSE
  “Seat confirmed” OR “QOSE registration”
  12-week offensive security programme…
  [Refresh status]
  metadata: registration closes · classes begin · duration

NOT REGISTERED
[warning alert if registration window closed]
CHOOSE HOW TO PAY
total tuition GH₵800 either way
grid md:2
┌ Full payment ──────────────┐  ┌ Three instalments ─────────┐
│ plan details · price       │  │ stage amounts              │
│ [Choose]                   │  │ [Choose]                   │
└────────────────────────────┘  └────────────────────────────┘
Paystack notice card

REGISTERED
┌ STATUS CARD ───────────────────────────────────────────────────────────────┐
│ programme kicker · status badge · plan label                               │
│ paid: “Tuition fully paid. Your seat is confirmed.” [Open QOSE course]     │
│ unpaid: “Next payment: <stage> · <amount>” [Pay GH₵amount]                 │
│ [Total tuition] [Paid] [Remaining]                                         │
│ Progress: Tuition paid                                                     │
│ pending alert / failed alert / plan-locked note                            │
└────────────────────────────────────────────────────────────────────────────┘

TWO-COLUMN PAYMENT DETAIL — lg:2
┌ Payment schedule ──────────────────┐  ┌ Payment history ─────────────────┐
│ stage rows: paid / due / upcoming  │  │ stage · amount · status badge     │
└────────────────────────────────────┘  └──────────────────────────────────┘

SERVER-SIDE VERIFICATION CARD
[View programme details → /qose]
```

### 6.16 Learning V2 demo — `/dashboard/learning-v2-demo`

```text
Centered max-w-4xl

Header
  [V2 Architecture Demo]
  H1 Learning System V2
  Interactive demonstration of all semantic learning blocks

LearningContentRenderer
  mission → objective → text → concept → observe → evidence
  → command → think → do → debrief → recall → checkpoint

Footer
  Architecture: 21 block types…
  Status: Production ready…
  Docs: docs/LEARNING_V2_STATUS.md
```

### 6.17 Terminal tool — `/dashboard/tools/terminal`

```text
ImmersiveToolShell — full viewport h-dvh
┌──────────────────────────────────────────────────────────────────────────────┐
│ Terminal · Standalone terminal                                      [Exit]  │
├──────────────────────────────────────────────────────────────────────────────┤
│ TerminalWrapper mode="raw"                                                   │
│                                                                              │
│ Kali-style prompt                                                            │
│ _terminal v2.0, type "help"                                                  │
│                                                                              │
│ terminal output region                                                       │
│ terminal input region                                                        │
│ tab completion                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.18 Network visualizer — `/dashboard/tools/network-visualizer`

```text
ImmersiveToolShell — full viewport
┌──────────────────────────────────────────────────────────────────────────────┐
│ Network Visualizer · Standalone tool                                [Exit]  │
├──────────────────────────────────────────────────────────────────────────────┤
│ NetworkBuilder                                                              │
│ toolbar: traffic simulation · traffic level · labels · fullscreen · close   │
│ ┌ device palette ┐  ┌────────────────────────────────────────────────────┐  │
│ │ device groups  │  │ canvas / topology area                             │  │
│ │ [add device]   │  │ context menus · connections · nodes                │  │
│ └────────────────┘  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Admin UI

All admin screens are inside `AdminLayout`, at `/mr-robot/dashboard?tab=<tab>`.

### 7.1 Dashboard frame

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ADMIN · Admin Console                                    Users N Market N    │
│ {Active tab label}                                             [Refresh]     │
│ Managing the {label} module.                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ TAB CONTENT                                                                  │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Last updated: HH:MM:SS                    error: Failed to sync… [Retry]     │
└──────────────────────────────────────────────────────────────────────────────┘

First load: 4-card skeleton grid.
```

### 7.2 Overview — `?tab=overview`

```text
PLATFORM
[Total Users] [Active 24h] [New This Week]
[Total CP Minted] [Bootcamp Enrollment] [Chain Status]

SYSTEM HEALTH — when available
[Database] [Open incidents] [Blocked accounts] [Auth failures (24h)]

BOOTCAMP HEALTH — when available
[Bootcamp enrolled] [Bootcamp active] [In current module] [Current module]

RECENT SIGNUPS
Name / Email | Date
```

### 7.3 Users — `?tab=users`

```text
[Total Users] [Active 24h] [Admins]

[Search by name, handle, email…]                    N results
┌──────────────────────────────────────────────────────────────────────────────┐
│ User | Role | Last Login | Points | Bootcamp Access | Recovery | Status | Actions │
├──────────────────────────────────────────────────────────────────────────────┤
│ name/email · role badge · IP/date/U-A · CP · [Revoked/Allowed] · token ·     │
│ [Blocked/Active] · [Block/Unblock] [Delete]                                  │
└──────────────────────────────────────────────────────────────────────────────┘
[10 / page ▾] Page X of Y                                   [<] [>]

Dialogs: Authorize User Termination.
Mobile: stacked user cards.
```

### 7.4 Bootcamps — `?tab=bootcamps`

```text
[Enrolled students] [Active students] [Engaged in current phase]

┌ Bootcamp live ──────────────────────────────────────────────────────────────┐
│ [Live / Paused]                                              [toggle]       │
│ Turn off when bootcamp is not active                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌ Phase control ──────────────────────────────────────────────────────────────┐
│ X of 5 phases unlocked · unlock adds all rooms in that phase                │
│ ● Current module title · N rooms in this phase                              │
│ [Unlock next phase · Next module title]                                     │
│ ALL PHASES                                                                  │
│ [01] Hacker Mindset            3 Rooms                                      │
│ [02] Linux Foundations         4 Rooms                                      │
│ [03] Networking                4 Rooms                                      │
│ [04] Web & Backend Systems     5 Rooms                                      │
│ [05] Social Engineering        3 Rooms                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.5 Instructor — `?tab=instructor`

```text
┌ COHORTS — 280px ──────────────┬ COHORT DETAIL ──────────────────────────────┐
│ Cohorts                    N  │ cohort name + description                    │
│ [cohort card]                 │ [Avg progress] [Blocked] [Stalled] [Open]   │
│  members/capacity             │                                             │
│  X% avg · N blocked           │ LEARNER CARDS                               │
│  N stalled · N open           │ ┌ learner ─────────────────────────────────┐ │
│ [cohort card]                 │ │ name · risk badge · escalation badge     │ │
│                               │ │ email · rooms/modules · current module   │ │
│                               │ │ last activity · [Escalate]               │ │
│                               │ │ progress bar                             │ │
│                               │ │ escalation rows + Acknowledge / Resolve  │ │
│                               │ └──────────────────────────────────────────┘ │
└───────────────────────────────┴─────────────────────────────────────────────┘

Dialog: Escalate learner · Reason select · Note · [Cancel] [Record escalation]
Mobile: cohort rail stacks above detail.
```

### 7.6 QOSE — `?tab=qose`

```text
[Registrations] [Fully paid] [Collected] [Outstanding]

[All payment states ▾]                                      [Refresh]

┌──────────────────────────────────────────────────────────────────────────────┐
│ Student | Plan | Paid | Remaining | Status                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ name/email · Full/Instalments · stage · GH₵ · GH₵ · [paid/partial/failed]   │
│ expanded: registered date · last payment · bootcamp status · payment rows    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 7.7 Market — `?tab=zero_day`

```text
┌ ASSET FORM ──────────────────────────────────────────────────────────────────┐
│ Initialize New Asset / Editing Asset: title                     [Abort]     │
│                                                                              │
│ Asset Title                    │ CP Valuation [CP]                           │
│ Asset Intelligence             │ Sequence Order                              │
│                                │ Classification (Type)                       │
│                                │ ( ) Deployment Active  ( ) Public Domain    │
│ Visual Identification          │ Data Core (Product PDF)                     │
│                                                                              │
│ [Initialize Asset / Authorize Update]                         [Purge]       │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Asset | Valuation | Classification (Type) | Status | Actions                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ cover/thumb · title · ID · Free/CP · type · Operational/Offline ·           │
│ [Modify] [Terminate]                                                         │
└──────────────────────────────────────────────────────────────────────────────┘

Dialog: Delete Product.
```

### 7.8 Points — `?tab=cp`

```text
CP Economy [trend icon]                              [7d] [30d] [90d] [⟳]
Real-time Cyber Points flow: issued, burned, net

[CP Issued] [CP Burned] [Net Flow]
[Active Users] [Avg per Tx] [Top Earner]

┌ By Type ──────────────────────┐  ┌ Points Control ─────────────────────────┐
│ label ███████████ value        │  │ User [select]                           │
│ label ██████ value             │  │ [Grant] [Deduct] [Set]                  │
│ label ███ value                │  │ [Points amount / Target value]          │
│                                │  │ Reason (optional)                       │
│                                │  │ [Execute]                               │
└────────────────────────────────┘  └─────────────────────────────────────────┘

┌ Transaction Ledger · N total ────────────────────────────────────────────────┐
│ [Search user…] [All types ▾]                                                 │
│ User | Type | Points | Balance After | Note | Date                           │
│ [Page X of Y]                                                [<] [>]         │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 7.9 Certificates — `?tab=certificates`

```text
Certificate Templates
Two certificate templates ship with the platform — QOSE and HPB…

┌ CONTROLS — 320px ──────────────┬ LIVE PREVIEW ───────────────────────────────┐
│ Certificate                     │ Live Preview · Alex Johnson · landscape     │
│ [QOSE Certificate] [HPB]        │ [PDF] [PNG] [JPEG]                          │
│ Template Name [input]           │                                             │
│ Program Name [input]            │ ┌ CertificateFrame ───────────────────────┐ │
│ Cohort Identifier [input]       │ │ charcoal header + QYVORA/programme logo │ │
│ Size [landscape/portrait]       │ │ CERTIFICATE OF COMPLETION                │ │
│ Test Name Length                │ │ PRESENTED TO · recipient name            │ │
│ [short] [medium] [long]         │ │ programme · cohort · date                │ │
│ Preview [Active only] [Both]    │ │ footer: credential ID · programme ·      │ │
│ [Save as Default]               │ │ status · verify URL · QYVORA Chain       │ │
│                                 │ └──────────────────────────────────────────┘ │
└─────────────────────────────────┴─────────────────────────────────────────────┘
```

### 7.10 Inbox — `?tab=inbox`

```text
[All] [Contact] [Service]   [Search by name or email…]      N items

┌ message row ────────────────────────────────────────────────────────────────┐
│ [mail/shield icon] Name [CONTACT/SERVICE] [STATUS]              date         │
│                    email                                                     │
└──────────────────────────────────────────────────────────────────────────────┘

DETAIL DIALOG
  name · type badge · status badge
  [Name] [Email] [Subject/Business/Phone/Website/Package]
  MESSAGE
  Update Status: [new] [in_progress] [resolved] [archived]
  [Delete]

Delete confirmation: “Delete Inquiry” · [Cancel] [Delete]
```

### 7.11 Broadcast — `?tab=broadcast`

```text
┌ New Announcement ───────────────────────────────────────────────────────────┐
│ megaphone icon · Send a broadcast notification to platform users            │
│                                                                              │
│ TITLE       [e.g., Platform Maintenance Tomorrow]                           │
│ MESSAGE     [Write your announcement message…]                              │
│                                                                              │
│ TARGET AUDIENCE                                                             │
│ [All Users] [Bootcamp Enrolled] [By Role]                                   │
│ Role [Select role… ▾] — when By Role                                        │
│                                                                              │
│ PREVIEW                                                                     │
│ ┌ title + message preview ─────────────────────────────────────────────────┐ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ [Send]                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘

Dialog: Confirm Broadcast · [Cancel] [Send]
```

### 7.12 Audit — `?tab=audit`

```text
[All Actions ▾] [From date] [To date] [Correlation ID] [Filter]   N entries

┌ log rows ────────────────────────────────────────────────────────────────────┐
│ • timestamp   admin name   action → target:ID   IP   correlation link        │
└──────────────────────────────────────────────────────────────────────────────┘

[<] Page X of Y [>]

Empty: clock icon · “No audit log entries”
```

Correlation link → `?tab=security&requestId=<id>`.

### 7.13 Security — `?tab=security`

```text
[Events 24h] [Unique IPs 24h] [Auth Failures 24h]

┌ Filtered by request · full-request-id ─────────────────────────────── [X] ─┐
└────────────────────────────────────────────────────────────────────────────┘

┌ SECURITY EVENTS ────────────────────────────────────────────────────────────┐
│ Time | Type | Action | Path | Code | IP                                      │
│ ...                                                                         │
│ [10 / page ▾] Page X of Y                                  [<] [>]          │
└─────────────────────────────────────────────────────────────────────────────┘

Empty: “No security events”
```

### 7.14 Incidents — `?tab=incidents`

```text
[All statuses ▾] [All severities ▾]              [+ New incident]

NEW INCIDENT FORM — inline expandable card
  Title · Description · Severity · Correlation ID (optional)
  ( ) Publish this incident on the public status page
  [Cancel] [Create incident]

INCIDENT CARD
  [SEVERITY] [STATUS] [PUBLIC/INTERNAL]   title              date/time
  description
  Created by: name · Resolved: date · correlation link
  [Publish/Unpublish] [Monitor] [Resolve] / [Reopen]

[<] Page X of Y [>]
```

### 7.15 Admin notification surfaces

```text
DESKTOP — dropdown under bell
┌ Notifications ──────────────────────────────────────────────┐
│ 3 unread                                  Mark all read     │
├─────────────────────────────────────────────────────────────┤
│ [icon] Title                                    [unread dot]│
│        message line-clamp-2                                 │
│        date · type                                          │
├─────────────────────────────────────────────────────────────┤
│ [Close]                                                     │
└─────────────────────────────────────────────────────────────┘

MOBILE — bottom sheet
┌ Notifications · 3 unread          Mark all read      [X] ─┐
│ [notification rows]                                      │
│ [Close]                                                  │
└──────────────────────────────────────────────────────────┘
```

---

## 8. Cross-Cutting Behaviour

### 8.1 Overlay and z-index stack

| Layer | Z-index | Owner |
|---|---|---|
| Admin sidebar / bottom nav | `z-[90]` | Admin shell |
| Public navbar / student topbar / admin topbar | `z-[100]` | Shell chrome |
| Student full-screen sidebar backdrop | `z-[110]` | Student sidebar |
| Student full-screen sidebar panel | `z-[111]` | Student sidebar |
| Bottom sheet overlay / content | `z-[120]` / `z-[130]` | Shared bottom sheet |
| Consent banner | `z-[150]` | Public / student |
| Dialog overlay / content | `z-[200]` / `z-[201]` | Shared dialog |
| Tooltip | `z-[300]` | Shared tooltip |
| Toast | `z-[500]` | Shared toast |
| Page loader | `z-[9999]` | `PageLoader` |

### 8.2 Responsive rules

| Area | Rule |
|---|---|
| Public cards | 1 col → 2 `sm` → 3 `lg` where specified |
| Public programme hero | stacked mobile → split desktop |
| Public profile | stacked → sticky 4/8 split at `lg` |
| Blog cards | 1 → 2 `sm` → 3 `lg` |
| Tool cards | 1 → 2 `sm` → 3 `lg` |
| Student catalogue grids | 1 → 2 `sm` → 3 `lg` |
| Student dashboard Continue | stacked → main + 340px right rail at `lg` |
| Student learning pages | centered single column at all sizes |
| Student profile | stacked → 4/8 split at `lg` |
| Student certificates | 1 → 2 `sm` → 3 `xl` |
| Admin tables | mobile cards below `md`, table above |
| Admin instructor | stacked → 280px + detail at `lg` |
| Admin certificates | stacked → 320px + preview at `lg` |

### 8.3 Redirects

| From | To |
|---|---|
| `/leaderboard/all` | `/leaderboard` |
| `/blogs/hacker-protocol-book` | `/blogs/hacker-protocol-bootcamp` |
| `/dashboard/bootcamps` | `/dashboard/bootcamps/bc_1775270338500` |
| `/bootcamps` | `/dashboard/bootcamps/bc_1775270338500` |
| `/marketplace` | `/dashboard/marketplace` |
| `/profile` | `/dashboard/profile` |
| `/notifications` | `/dashboard/notifications` |
| `/settings` | `/dashboard/settings` |
| `/register` | `/login` with registration mode |

### 8.4 Not found — `*`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ forced dark                                                                  │
│ terminal card                                                                │
│ qyvora@core:~$ HTTP 404                                                      │
│                                                                              │
│                         404                                                  │
│                  Lost in the Network?                                        │
│                                                                              │
│ [Dashboard / Return]                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Complete Route Index

### 9.1 Public routes

| Route | Screen |
|---|---|
| `/` | Landing |
| `/terms` | Terms |
| `/privacy` | Privacy |
| `/cookies` | Cookies |
| `/security` | Security |
| `/refund-policy` | Refund policy |
| `/accessibility` | Accessibility |
| `/acceptable-use` | Acceptable use |
| `/hpb` | Hacker Protocol Bootcamp |
| `/qose` | QOSE programme |
| `/learn` | Learning hub |
| `/courses/:courseId` | Public course detail |
| `/services` | Services index |
| `/services/basic-web-application-pentest` | Basic Pentest |
| `/services/standard-web-application-pentest` | Standard Pentest |
| `/services/employee-cybersecurity-bootcamp` | Employee Bootcamp |
| `/leaderboard` | Public leaderboard |
| `/leaderboard/all` | Redirect |
| `/tools` | Tools index |
| `/about` | About |
| `/zero-day-market` | Zero Day Market |
| `/blogs` | Blog index |
| `/blogs/hacker-protocol-book` | Redirect |
| `/blogs/:slug` | Blog detail |
| `/team` | Team |
| `/leadership` | Leadership |
| `/quiteroot` | Quiteroot |
| `/simulations` | Simulations index |
| `/simulations/:slug` | Simulation detail |
| `/cp` | CyberPoints |
| `/contact` | Contact |
| `/faq` | FAQ |
| `/resources` | Resources |
| `/changelog` | Changelog |
| `/credentials` | Credentials |
| `/status` | Status |
| `/sitemap` | Sitemap |
| `/verify` | Verify |
| `/verify/:credentialId` | Verify result |
| `/:handle` | Public profile |

### 9.2 Documentation routes

`/anansi`, `/toha3ee`, `/jabari`, `/aksum`, `/shaka`, `/nzinga`, `/sekhmet`, `/mansa`, `/amanirenas`, `/amina`, `/sundiata`, `/timbuktu`, `/kush`, `/imhotep`, `/qyvora-common`

### 9.3 Auth routes

| Route | Screen |
|---|---|
| `/login` | Login |
| `/register` | Registration redirect |
| `/auth/callback` | OAuth callback |
| `/change-password` | Change password |
| `/mr-robot` | Admin login |

### 9.4 Student routes

| Route | Screen |
|---|---|
| `/dashboard` | Dashboard |
| `/dashboard/qose` | QOSE registration |
| `/dashboard/learning-v2-demo` | Learning V2 demo |
| `/dashboard/bootcamps` | Redirect to default bootcamp |
| `/dashboard/bootcamps/:bootcampId` | Bootcamp course |
| `/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId` | Legacy bootcamp room |
| `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId` | Bootcamp room |
| `/dashboard/courses` | My Courses |
| `/dashboard/courses/:courseId` | Course lesson |
| `/dashboard/marketplace` | Marketplace |
| `/dashboard/profile` | Profile |
| `/dashboard/profile/:username` | Profile by username |
| `/dashboard/certificates` | Certificates |
| `/dashboard/notifications` | Notifications |
| `/dashboard/settings` | Settings — Appearance |
| `/dashboard/settings/:section` | Settings section |
| `/dashboard/competitive` | Competitive |
| `/dashboard/networks` | Networks |
| `/dashboard/labs` | Labs index |
| `/dashboard/labs/privesc` | Privilege Escalation |
| `/dashboard/labs/passwords` | Password Cracking |
| `/dashboard/labs/sql-injection` | SQL Injection |
| `/dashboard/labs/osint` | OSINT |
| `/dashboard/labs/kill-chain` | Kill Chain |
| `/dashboard/labs/web-access-control` | Broken Access Control |
| `/dashboard/labs/api-security` | API Security |
| `/dashboard/labs/automation` | Security Automation |
| `/dashboard/labs/methodology` | Engagement Methodology |
| `/dashboard/labs/network-security` | Network Security |
| `/dashboard/labs/wlan-security` | Wireless Security |
| `/dashboard/labs/ad-enum` | AD Enumeration |
| `/dashboard/labs/attack-paths` | Enterprise Attack Paths |
| `/dashboard/tools/terminal` | Terminal |
| `/dashboard/tools/network-visualizer` | Network Visualizer |

### 9.5 Admin routes and tabs

| Route / query | Screen |
|---|---|
| `/mr-robot/dashboard?tab=overview` | Overview |
| `/mr-robot/dashboard?tab=users` | Users |
| `/mr-robot/dashboard?tab=bootcamps` | Bootcamps |
| `/mr-robot/dashboard?tab=instructor` | Instructor |
| `/mr-robot/dashboard?tab=qose` | QOSE |
| `/mr-robot/dashboard?tab=zero_day` | Market |
| `/mr-robot/dashboard?tab=cp` | Points |
| `/mr-robot/dashboard?tab=certificates` | Certificates |
| `/mr-robot/dashboard?tab=inbox` | Inbox |
| `/mr-robot/dashboard?tab=broadcast` | Broadcast |
| `/mr-robot/dashboard?tab=audit` | Audit |
| `/mr-robot/dashboard?tab=security` | Security |
| `/mr-robot/dashboard?tab=incidents` | Incidents |
| `*` | 404 |

---

## 10. Maintenance Rules

- `src/app/router.tsx` is the route source of truth.
- Student shell geometry must stay in sync:
  - topbar `h-24 md:h-28`
  - clearance `pt-[calc(6rem+env(safe-area-inset-top))] md:pt-[calc(7rem+env(safe-area-inset-top))]`
- Admin shell geometry must stay in sync:
  - topbar `h-20 md:h-24`
  - clearance `pt-20 md:pt-24`
- When a page adds, removes, or reorders a major section, update its wireframe section here.
- When a shared template changes, update the template once and verify every route listed under it.
