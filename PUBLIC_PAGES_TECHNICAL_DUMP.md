# QYVORA Frontend — Technical Dump: Public Pages

> This document is for AI consumption. It describes every public-facing page, every section, every component, every visual element, every API call, every styling pattern, and every design token used across QYVORA's public surface.

---

## 1. Design System Reference

### Colors (CSS variables in `src/styles/index.css`)
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-bg-card` | `#050505` | Card surfaces |
| `--color-bg-elevated` | `#0b0b0b` | Elevated elements, badge backgrounds |
| `--color-accent` | `#06B66F` | Primary accent — CTAs, links, highlights |
| `--color-text-primary` | `#EEF0EE` | Headings, primary text |
| `--color-text-secondary` | `rgba(238,240,238,0.70)` | Body text, descriptions |
| `--color-text-muted` | `rgba(238,240,238,0.40)` | Labels, metadata, secondary info |
| `--color-border` | `rgba(171,181,192,0.12)` | Card borders |
| `--color-border-strong` | `rgba(6,182,111,0.18)` | Accent borders |

### Typography
- **Font**: JetBrains Mono (`font-mono` Tailwind class)
- **All text is mono** — no sans-serif override exists

### Border Radius
| Element | Radius |
|---------|--------|
| Cards, modals, panels | `rounded-2xl` |
| Buttons, inputs | `rounded-xl` |
| Badges, pills | `rounded-lg` or `rounded-full` |
| Small icon buttons | `rounded-lg` |

### Button Classes (defined in `src/styles/index.css`)
| Class | Style |
|-------|-------|
| `btn-primary` | Accent bg, black text, `rounded-xl`, uppercase, 10px font |
| `btn-secondary` | Dark bg, accent text, bordered, `rounded-xl` |
| `btn-danger` | Red bg, red text, bordered, `rounded-xl` |

### Card Border Opacity
| Context | Opacity |
|---------|---------|
| Default card | `border-border/30` |
| Subtle / landing sections | `border-border/20` |
| Interactive hover | `border-accent/30` |

### Badge Pattern
```
px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
```

---

## 2. Route Map (Public Pages Only)

Defined in `src/app/router.tsx`. All public marketing pages use `LandingLayout` (Navbar + Outlet).

| Route | Page Component | Layout |
|-------|---------------|--------|
| `/` | `LandingPage` | `LandingLayout` (snap scroll) |
| `/terms` | `TermsPage` | `LandingLayout` |
| `/anansi` | `AnansiPage` | `LandingLayout` |
| `/quiteroot` | `QuiteRootPage` | `LandingLayout` |
| `/team` | `TeamPage` | `LandingLayout` |
| `/services` | `ServicesPage` | `LandingLayout` |
| `/hpb` | `LearnPage` | `LandingLayout` |
| `/news` | `NewsFeedPage` | `LandingLayout` |
| `/leaderboard` | `LeaderboardPage` | `LandingLayout` |
| `/leaderboard/all` | `LeaderboardAllPage` | `LandingLayout` |
| `/events` | `EventsPage` | `LandingLayout` |
| `/courses` | `CoursesPage` | `LandingLayout` |
| `/courses/:courseId` | `CourseInfoPage` | `LandingLayout` |
| `/blogs` | `BlogsPage` | `BlogsLayout` |
| `/blogs/:slug` | `BlogPostPage` | `BlogsLayout` |
| `/zero-day-market` | `ZeroDayMarketPage` | `LandingLayout` |
| `/@:handle` | `PublicProfilePage` | Standalone (own Navbar) |
| `/login` | `LoginPage` | Standalone |
| `/register` | `RegisterPage` | Standalone |

---

## 3. Landing Layout (`src/shared/layouts/LandingLayout.tsx`)

**Structure:**
```
<Navbar />              ← Fixed at top, z-100, hides on scroll down
<main>                  ← w-full, min-h-screen
  <Outlet />            ← LandingPage renders here
</main>
<ContactModalHost />    ← Contact form modal
<ServiceRequestModalHost /> ← Service request modal
<ConsentBanner />       ← Cookie consent
```

**Key behaviors:**
- Navbar is `position: fixed`, always on top
- No top padding on `<main>` — hero handles its own offset
- No `<Footer>` at layout level — footer is embedded as last snap section in LandingPage
- No `overflow-hidden` on `<main>` — snap container manages its own scroll

---

## 4. Landing Page (`src/features/marketing/pages/LandingPage/index.tsx`)

The landing page is a **scroll-snap experience** — each section is 100vh tall, snapping between sections on desktop.

**Container:**
```html
<div class="relative w-full bg-bg snap-container no-scrollbar">
```
- `.snap-container` applies `scroll-snap-type: y mandatory` on desktop (≥768px)
- `.snap-section` applies `scroll-snap-align: start; scroll-snap-stop: always`
- Each section: `min-h-dvh md:h-dvh snap-section`

**Sections (in order):**

| # | ID | Component | Background | Nav invert? |
|---|-----|-----------|------------|-------------|
| 1 | `hero` | `LandingHeroSection` | `bg-accent` (green) | Yes |
| 2 | `pillars` | `LandingPillarsSection` | `bg-bg` (black) | No |
| 3 | `labs` | `LandingLabsSection` | `bg-accent` | Yes |
| 4 | `courses` | `LandingCoursesSection` | `bg-bg` | No |
| 5 | `bootcamp` | `LandingBootcampSection` | `bg-accent` | Yes |
| 6 | `leaderboard` | `LandingLeaderboardSection` | `bg-bg` | No |
| 7 | `services` | `LandingServicesSection` | `bg-bg` | No |
| 8 | `cta` | `LandingFinalCtaSection` | `bg-accent` | Yes |
| 9 | `footer` | `Footer` | `bg-bg` | No |

**Data fetching:**
- `useLandingData()` hook fetches platform stats from API
- `useAuth()` provides current user state
- Leaderboard section fetches top 40 from `/public/leaderboard?period=all&limit=40`

**Active section tracking:**
- Scroll listener detects which section is at 30% viewport height
- Updates URL hash (`#hero`, `#pillars`, etc.)
- Supports programmatic scroll via hash on load

---

## 5. Landing Section Details

### 5.1 Hero Section (`LandingHeroSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingHeroSection.tsx`

**Background:** `bg-accent` (solid green) with `GridBoxedBackground` (animated grid pattern)

**Visual elements:**
- **Status badge**: pulsing dot + "ACTIVE THREAT INTELLIGENCE" text, bordered, rounded-lg
- **Headline**: Two-line typewriter animation cycling through 4 messages:
  - "Train Like A / Hacker"
  - "Train Like A Hacker / Become A Hacker"
  - "Securing Africa's / Digital Future"
  - "Creating 100K / Cyber Professionals"
- **Subtext**: Single sentence description, `text-bg/70`
- **CTA buttons**: "Start Training →" (btn-primary) + "Log In" (btn-secondary)
- **HackerGlobe**: 3D globe animation on right side (desktop only), lazy-loaded, expands + fades on scroll

**Animations:**
- Framer Motion entrance animations (opacity + y translate)
- Typewriter effect (vanilla JS, 80ms per character, 30ms delete)
- Globe parallax via `useScroll` + `useTransform`
- Reduced motion: all animations disabled, typewriter shows static text

**Props:** `{ heroRef, user, stats, totalCp }`

**Styling:**
- 2-column grid on desktop (`lg:grid-cols-2`), single column mobile
- Left column: `px-4 sm:px-10 md:px-12 lg:pl-16 xl:pl-20`
- Headline: `text-[2.5rem]` → `text-[3.75rem]` responsive scaling
- All text is `text-bg` (white on green)

---

### 5.2 Pillars Section (`LandingPillarsSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingPillarsSection.tsx`

**Background:** `bg-bg` (black)

**Layout:** Bento grid — 4 columns on desktop (`lg:grid-cols-4`), single column mobile

**Cards:**

| Card | Grid Position | Content |
|------|--------------|---------|
| **Bootcamp** (featured) | 2 cols, 2 rows | Icon (IconShield), title, description, stat badge, "Start Bootcamp →" CTA, dotted map background |
| **Labs** | 2 cols | Icon (IconLabs), title, description, stat badge, "Explore →" link |
| **Courses** | 1 col | Icon (BookOpen), title, description, stat badge, "Explore →" link |
| **Services** | 1 col | Icon (IconLock), title, description, stat badge, "Explore →" link |

**Card styling:**
- `rounded-2xl border border-border/30 bg-bg-card`
- `hover:border-accent/30` transition
- Dotted map background overlay at 4% opacity: `getDottedMapBg()`
- Icon containers: `w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 border border-accent/20`
- Featured stat badge: `text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent`
- CTA: `px-6 py-3 rounded-xl bg-accent text-[10px] font-black uppercase tracking-widest text-bg`

**Animations:** Framer Motion `whileInView` with staggered delays (0, 0.1, 0.2, 0.3s)

---

### 5.3 Labs Section (`LandingLabsSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingLabsSection.tsx`

**Background:** `bg-accent` with `GridBoxedBackground`

**Layout:** 3-column bento (`lg:grid-cols-3`), auto-cycling groups of 3 labs every 4s

**10 labs:** privesc, passwords, webapp, sqli, phishing, proxy, traffic, osint, wireless, killchain

**Cards:**

| Card | Content |
|------|---------|
| **Featured** (2 cols, 2 rows) | Identicon avatar (bordered, `border-accent/30 bg-accent/10`), CP badge, title, description, "Launch Lab →" CTA |
| **Supporting ×2** (1 col each) | Smaller identicon, CP badge, title, description, "Launch Lab →" link |

**Identicon styling:**
- Featured: `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-accent/30 bg-accent/10 overflow-hidden`
- Supporting: `w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-accent/30 bg-accent/10 overflow-hidden`

**Card styling:**
- `rounded-2xl border border-border/20 bg-bg/90`
- `hover:border-accent/30`

**Animations:** Group transitions with `x` direction slide, staggered delays

---

### 5.4 Courses Section (`LandingCoursesSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingCoursesSection.tsx`

**Background:** `bg-bg` (black)

**Layout:** Single column with category filter tabs + 3-column course card grid

**12 courses** across 6 categories: terminal, networking, programming, web-security, wireless, tools

**Category tabs:**
- Horizontal scroll on mobile with `ChevronLeft`/`ChevronRight` arrows
- Wrapping on desktop (`md:flex-wrap`)
- Active: `bg-bg-elevated text-text-primary border-border/50 shadow-lg`
- Inactive: `bg-bg-card text-text-muted border-border/30 hover:bg-bg-elevated`

**Course cards (3 per page, auto-cycling every 3s):**
- Category icon in `w-8 h-8 rounded-xl bg-accent/10 border border-accent/20`
- "Popular" badge if applicable
- Title, description (2-line clamp)
- Bottom bar: level badge (`border-accent/20 bg-accent/10 text-accent`), duration, arrow icon
- `rounded-2xl border border-border/30 bg-bg-card`
- `hover:border-accent/30`

**Pagination:** Dot indicators at bottom (active = `bg-accent w-5`, inactive = `bg-border/40 w-1.5`)

---

### 5.5 Bootcamp Section (`LandingBootcampSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingBootcampSection.tsx`

**Background:** `bg-accent` with `GridBoxedBackground`

**Layout:** 3-column bento (`lg:grid-cols-3`), auto-cycling groups of 3 phases every 4.5s

**5 phases** from `BOOTCAMP_CONFIG` + `PHASES` data

**Cards:**

| Card | Content |
|------|---------|
| **Featured** (2 cols, 2 rows) | Phase icon (white on accent), room count badge, phase name, description, phase image as background (`bg-cover bg-center` with gradient overlay), "Start Phase N →" CTA |
| **Supporting ×2** (1 col each) | Phase icon, room count badge, phase name, description, "Start Phase N →" link |

**Card styling:**
- Featured: `bg-bg/90` with image background + gradient overlay (`bg-gradient-to-t from-bg-card via-bg-card/80 to-bg-card/40`)
- Supporting: `bg-bg/90`
- All: `rounded-2xl border border-border/20 hover:border-accent/30`

**CTA on featured:** `px-6 py-3 rounded-xl bg-bg text-[10px] font-black uppercase tracking-widest text-accent` (inverted colors)

---

### 5.6 Leaderboard Section (`LandingLeaderboardSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingLeaderboardSection.tsx`

**Background:** `bg-bg` (black)

**Layout:** 2-column — left header (fixed width), right grid (flex)

**API call:** `GET /public/leaderboard?period=all&limit=40`

**Header (left):**
- Heading: `text-3xl md:text-5xl lg:text-6xl font-black`
- Description text
- "View Full Leaderboard" btn-secondary link

**Grid (right):**
- 40 cells in a flex-wrap layout
- Cell sizes: 56px mobile, 72px desktop
- Gap: 4px
- Each cell contains an Identicon (seeded by `hackerHandle`)
- Top 3 cells have colored borders + glow:
  - 1st: `border-yellow-400` + `shadow-[0_0_16px_rgba(250,204,21,0.4)]`
  - 2nd: `border-gray-300` + `shadow-[0_0_14px_rgba(209,213,219,0.3)]`
  - 3rd: `border-amber-600` + `shadow-[0_0_14px_rgba(217,119,6,0.3)]`
- Medal icon on top 3 cells
- Rank number on other cells (`text-[8px] font-mono`)
- Hover: gradient overlay with handle + CP value
- Empty cells: `bg-bg-elevated/40 border-border/10`

**Loading state:** 40 pulsing skeleton cells

---

### 5.7 Services Section (`LandingServicesSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingServicesSection.tsx`

**Background:** `bg-bg` (black)

**Layout:** 4-column bento (`lg:grid-cols-4`) — same structure as Pillars

**3 service tiers:**

| Card | Tier | Features |
|------|------|----------|
| **Standard** (featured, 2 cols × 2 rows) | Most Popular | webMobile, authTesting, businessLogic, report |
| **Basic** (2 cols) | Entry tier | webAppAssessment, scanning, owasp, report |
| **Bootcamp** (2 cols) | Training | curriculum, exercises, phishing, progress |

**Card styling:**
- All: `rounded-2xl border border-border/30 bg-bg-card`
- Dotted map background at 4% opacity
- Feature list with `IconCheck` (accent) + text
- Featured has "Most Popular" badge with `Sparkles` icon
- Price display: `text-base lg:text-lg font-black text-accent`
- CTA buttons: `openServiceRequestModal()` triggers the service request modal

---

### 5.8 Final CTA Section (`LandingFinalCtaSection.tsx`)

**File:** `src/features/marketing/components/landing/LandingFinalCtaSection.tsx`

**Background:** `bg-accent` with `GridBoxedBackground`

**Layout:** 2-column on desktop (`grid-cols-[0.9fr_1.1fr]`), single column mobile

**Content:**
- **Left:** Heading (via `SimpleHeading` component, `variant="inverted"`), description text, CTA buttons
- **Right:** `QyvoraMark` logo (large, black on green)

**CTA buttons:**
- Logged in: "Go to Dashboard" btn-primary
- Logged out: "Start Training →" btn-primary + "Log In" btn-secondary

**Animations:** Scale entrance for logo (`scale 0.88 → 1`), staggered text entrance

---

### 5.9 Footer (embedded in LandingPage)

**File:** `src/shared/components/layout/Footer.tsx`

**Background:** `bg-bg`

**Layout:** 3-column link grid + social links + bottom bar

**Columns:**
| Column | Links |
|--------|-------|
| Platform | Events, HPB, Anansi, Blogs, News, Market, Leaderboard, Services |
| Company | Team |
| Account | Register, Log In |

**Social links:** X (Twitter), LinkedIn, GitHub, YouTube, WhatsApp

**Bottom bar:** Copyright, Terms, Privacy Policy, Language switcher

---

## 6. Navbar (`src/shared/components/layout/Navbar.tsx`)

**Position:** Fixed at top, z-100

**Behavior:**
- Hides on scroll down (past 80px), shows on scroll up (desktop only, 5px deadzone)
- Listens to `.snap-container` scroll events (not `window`)
- Uses `requestAnimationFrame` to wait for DOM mount

**Navigation groups (desktop dropdowns):**
| Group | Items |
|-------|-------|
| Learn | Courses, HPB, Events |
| Research | Anansi, QuiteRoot |
| Resources | Market, Blogs, News, Leaderboard |
| Company | Team, Contact |

**Mobile:** Hamburger menu with accordion groups, z-90

**Visual:**
- Logo on left
- Nav items center
- Auth buttons right: "Log In" (btn-secondary) + "Sign Up" (btn-primary)
- Dashboard link if logged in
- Language switcher

---

## 7. Public Profile Page (`src/features/marketing/pages/PublicProfilePage.tsx`)

**Route:** `/@:handle` (catch-all, validates `@` prefix)

**Layout:** Standalone (renders own `<Navbar />`)

**API calls:**
- `GET /public/users/:handle` — profile data
- `GET /public/users/:handle/activity-calendar?days=365` — activity dates

**Sections (in order):**

| Section | ID | Content |
|---------|-----|---------|
| Identity | `profile-section-identity` | `ProfileIdentityBlock` — avatar, name, handle, rank, bio, org, XP bar, join date, social links, share button |
| Stats | `profile-section-stats` | 6 `ProfileStatCard` components in 2-col grid: CP (accent), Rank, Labs, Courses, Streak, XP Level |
| Activity | `profile-section-activity` | `ContributionCalendar` (SVG grid) + `ActivityTimeline` (derived events) |
| Skills | `profile-section-skills` | `SkillsModule` — 7 skill progress bars from skillRegistry |
| Achievements | `profile-section-achievements` | `AchievementsSection` — pinned shelf + full grid |
| Labs | `profile-section-labs` | `LabsModule` — recently completed labs list |
| Courses | `profile-section-courses` | `CoursesModule` — completed course count |
| Trophy | `profile-section-trophy` | `TrophyCabinet` — tier-based trophies |

**Section navigation:**
- Desktop: Vertical sidebar (`ProfileSectionNav`, sticky, left side, 192px width)
- Mobile: Horizontal scrollable tabs (sticky at top, backdrop-blur)
- Active section tracked via IntersectionObserver

---

## 8. Profile Components Reference

### ProfileIdentityBlock
**File:** `src/shared/components/profile/ProfileIdentityBlock.tsx`

**Props:** `{ id, handle, name, bio, rank, organization, email, actions, showShare, showPublicView, publicViewPath, xpLevel, xpCurrent, xpToNext, joinDate, country, website, github, linkedin, twitter }`

**Visual:**
- Card: `rounded-2xl border border-border/30 bg-bg-card`
- Top accent stripe: `h-1 w-full bg-accent`
- Avatar: `w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-border/30` — `Identicon` component (jdenticon, seeded by username)
- Name: `text-lg sm:text-xl font-black`
- Handle badge: `px-2 py-0.5 rounded-lg bg-bg-elevated border border-border/30 text-[10px] font-black uppercase tracking-widest text-accent font-mono`
- Rank badge: `px-2 py-0.5 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent`
- Bio: `text-sm text-text-secondary line-clamp-2`
- Meta line: join date (Calendar icon), country, org, email
- Social links: GitHub, LinkedIn, website — small icon buttons (`w-7 h-7 rounded-lg bg-bg-elevated border border-border/30`)
- XP bar: `p-3 rounded-xl bg-bg-elevated border border-border/20` — progress bar `h-2 rounded-full bg-accent`
- Action buttons: `rounded-xl text-xs font-black uppercase tracking-widest border border-border hover:border-accent/50`

### ProfileStatCard
**File:** `src/shared/components/profile/ProfileStatCard.tsx`

**Props:** `{ icon, label, value, accent }`

**Visual:**
- Card: `rounded-2xl border p-5 flex flex-col gap-2.5`
- Accent variant: `border-accent/20 bg-accent/5`
- Default: `border-border/30 bg-bg-card`
- Icon container: `w-10 h-10 rounded-xl` (accent: `bg-accent/15`, default: `bg-bg-elevated`)
- Label: `text-[10px] font-black uppercase tracking-[0.2em] text-text-muted`
- Value: `font-mono text-2xl font-black tabular-nums` (accent: `text-accent`, default: `text-text-primary`)

### ContributionCalendar
**File:** `src/shared/components/profile/ContributionCalendar.tsx`

**Visual:** GitHub-style SVG activity grid
- 52 weeks × 7 days
- Cell size: 11px, gap: 3px
- 4 intensity levels: `bg-accent/5`, `bg-accent/25`, `bg-accent/50`, `bg-accent`
- Month labels at top, day labels on left (Mon, Wed, Fri)
- Legend at bottom (Less → More)
- Today highlighted with `stroke-accent`

### AchievementsSection
**File:** `src/shared/components/profile/AchievementsSection.tsx`

**Visual:**
- Bootcamp badge: `BootcampBadge` component (16×16 image)
- Pinned shelf: horizontal scroll of high-rarity achievements
- Full grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`
- Achievement cards: rarity-based styling (common/uncommon/rare/epic/legendary)
- Rarity borders: common=`border-border/30`, rare=`border-blue-400/30`, epic=`border-purple-400/30`, legendary=`border-amber-400/30`
- Collapsible (shows 8 by default, "Show all" button)

### ActivityTimeline
**File:** `src/shared/components/profile/ActivityTimeline.tsx`

**Visual:**
- Vertical timeline with colored dots
- Events derived from profile data (rooms, bootcamp, courses)
- Each event: icon in colored container, title, description, relative timestamp
- Activity type colors: lab=`red-400`, course=`blue-400`, bootcamp=`accent`, achievement=`amber-400`

### SkillsModule
**File:** `src/shared/components/profile/SkillsModule.tsx`

**Visual:**
- 7 skill bars from `skillRegistry`: Mindset, Linux, Networking, Web, Social, Tools, Programming
- Each: colored dot, label, progress bar (`h-2 rounded-full`), completed/total count
- Colors: mindset=`#06B66F`, linux=`#60A5FA`, networking=`#A78BFA`, web=`#F59E0B`, social=`#EF4444`, tools=`#8B5CF6`, programming=`#10B981`
- Animated progress bars via Framer Motion

### LabsModule
**File:** `src/shared/components/profile/LabsModule.tsx`

**Visual:**
- List of up to 8 recently completed labs
- Each: red flask icon, lab title, external link on hover
- `rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated` row styling

### CoursesModule
**File:** `src/shared/components/profile/CoursesModule.tsx`

**Visual:**
- Grid of completed course placeholders
- Each: blue book icon, "Course N", "Completed" label
- `rounded-xl bg-bg-elevated/50 border border-border/20`

### TrophyCabinet
**File:** `src/shared/components/profile/TrophyCabinet.tsx`

**Visual:**
- Grid of trophies: `grid-cols-2 sm:grid-cols-3`
- 5 tiers with distinct styling:
  - Bronze: `border-amber-600/30 bg-amber-600/5 text-amber-600`
  - Silver: `border-gray-300/30 bg-gray-300/5 text-gray-300`
  - Gold: `border-yellow-400/30 bg-yellow-400/5 text-yellow-400` + glow
  - Platinum: `border-accent/30 bg-accent/5 text-accent` + glow
  - Diamond: `border-purple-400/30 bg-purple-400/5 text-purple-400` + glow
- Trophy icon: `w-6 h-6` in tier color
- Tier badge at bottom

### ProfileSectionNav
**File:** `src/shared/components/profile/ProfileSectionNav.tsx`

**Desktop:** Vertical sidebar, sticky at top-28
- Active: `text-accent bg-accent/10 border border-accent/20` with animated indicator (`motion.div` with `layoutId`)
- Inactive: `text-text-muted hover:text-text-secondary hover:bg-bg-elevated`

**Mobile:** Horizontal scrollable tabs, sticky at top
- `bg-bg/90 backdrop-blur-md border-b border-border/20`
- `overflow-x-auto no-scrollbar`
- Active: `text-accent bg-accent/10`

---

## 9. Shared Utilities

### Identicon (`src/shared/components/Identicon.tsx`)
- Library: `jdenticon` (not DiceBear)
- Seeded by: `username` (unique per user)
- SVG sanitized via `dompurify`
- Dynamically imported (React.lazy)

### Dotted Map (`src/shared/utils/dottedMap.ts`)
- Generates SVG data URI of world map dots
- Continent polygons defined as lat/lng arrays
- Used as card backgrounds at 4% opacity
- `getDottedMapBg()` returns `url("data:image/svg+xml,...")`

### SEO (`src/shared/components/SEO.tsx`)
- Sets `<title>`, `<meta description>`, Open Graph tags
- Supports `noindex` prop for profile pages
- Supports `breadcrumbs` for structured data
- Supports `schemaData` for JSON-LD

---

## 10. Animations & Motion

**Library:** `motion/react` (Framer Motion v11+)

**Common patterns:**
- Entrance: `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}`
- Viewport: `whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`
- Staggered: `transition={{ delay: idx * 0.05 }}`
- Layout: `layout` prop for shared layout animations
- Reduced motion: `useReducedMotion()` hook disables all animations

**Scroll-snap:**
- Desktop: `scroll-snap-type: y mandatory` on `.snap-container`
- Each section: `scroll-snap-align: start; scroll-snap-stop: always`
- Mobile: normal scroll (no snap)

**Page transitions:** `AnimatePresence` with `mode="wait"` in router, opacity fade (0.25s)

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Default | < 640px | Mobile single column |
| `sm` | ≥ 640px | Slightly larger mobile |
| `md` | ≥ 768px | Tablet, snap scroll activates, navbar hide-on-scroll activates |
| `lg` | ≥ 1024px | Desktop, 2-column layouts, sidebar nav |
| `xl` | ≥ 1280px | Wide desktop |
| `2xl` | ≥ 1536px | Ultra-wide |

---

## 12. Accessibility

- All buttons have `min-height: 48px` (tap target)
- Focus visible: `outline: 2px solid var(--color-accent); outline-offset: 2px`
- `aria-label` on icon-only buttons
- `aria-current` on active nav items
- Semantic HTML: `<nav>`, `<section>`, `<main>`, `<h1>`-`<h6>`
- `prefers-reduced-motion`: all animations disabled
- Screen reader: `aria-describedby` on dialogs
- Keyboard navigation: full tab order, Escape to close modals
- Contrast: all text meets WCAG AA on dark backgrounds

---

## 13. Performance

- All page components lazy-loaded via `React.lazy()` + `Suspense`
- `PageLoader` (thin accent progress bar) shown during load
- HackerGlobe lazy-loaded with error boundary
- Identicons dynamically imported
- `React.memo()` on expensive components (LandingHeroSection, LandingFinalCtaSection)
- SVG contribution calendar computed via `useMemo`
- Scroll listeners use `{ passive: true }`
- Reduced motion: `body[data-performance-mode="constrained"]` disables blur effects
- Image optimization: `img { max-width: 100%; height: auto }`
