# QYVORA Product Roadmap

**Status:** Live · 170+ users · Social channels active  
**Last updated:** 2026-08-15 (merged with `docs/_ROADMAP.md` feature inventory)

---

## Immediate Priorities (Post-MVP)

### 1. Retention Loop
- **Problem:** Users sign up but drop before completing Phase 01.
- **Strategy:** Build engagement mechanics that pull users back.
- **Actions:**
  - Session reminders for inactive accounts (>3 days since last room completion)
  - Completion celebrations (confetti, shareable completion cards, sound effects)
  - Visible streak counter and daily login rewards
  - Phase-completion leaderboard (opt-in, anonymized)
- **Files affected:** `RoomCompletionCelebration.tsx`, `DashboardPage`, notification system

### 2. Shareable Credentials (Social Proof)
- **Problem:** Users earn on-chain CP but can't share proof of completion socially.
- **Strategy:** Turn every room completion into a shareable asset — drives organic acquisition.
- **Actions:**
  - "Share my badge" flow after room completion (Twitter/X, LinkedIn, copy link)
  - Generated badge image showing room name, phase, CP earned, QYVORA branding
  - Shareable profile page with cumulative achievements
  - Auto-post opt-in after bootcamp completion
- **Files affected:** `RoomCompletionCelebration.tsx`, new `ShareBadge` component, profile page

### 3. Mobile PWA (Baseline Done)
- **Status:** Manifest, service worker, install banner shipped. See `docs/PWA.md` for details.
- **Remaining:**
  - Push notification support for reminders and new room alerts
  - Offline support for room content (cached walkthroughs)

### 4. Phase Drop-off Analytics
- **Problem:** No visibility into where users stall in the pipeline.
- **Strategy:** Track completion rates per phase/room and surface bottlenecks.
- **Actions:**
  - Implement event tracking: room start, room complete, quiz fail, phase enter/exit
  - Dashboard for internal team showing drop-off funnel
  - If Phase 03 (Networking) has 80% drop rate: improve content, add more guided examples, reduce friction
- **Files affected:** New analytics utility, backend `analytics` endpoints, admin dashboard

### 5. In-App Community Layer
- **Problem:** Users are isolated — no way to interact with peers or the team.
- **Strategy:** Add lightweight community features within the dashboard.
- **Actions:**
  - Per-room discussion thread (solves "I'm stuck on this step")
  - QuiteRoot public feed showing team activity, tool releases, security writeups
  - User-to-user mentoring system (high-CP users help new users)
  - Announcement banner for cohort updates and events
- **Files affected:** New `Community` page, `RoomSidebar.tsx`, notification system

---

## Medium-Term Bets

### 6. Cohort Automation
- Automate the HPB cohort pipeline: scheduled start dates, automated progress emails, certificate generation on completion.

### 7. Corporate / B2B Track
- Offer company-sponsored bootcamp cohorts with employer dashboards to track employee progress and credential verification.

### 8. Bug Bounty / Live Range
- Add a live capture-the-flag range where users can compete in real time and earn CP for finding vulnerabilities.

---

## Guiding Principles

| Principle | Rule |
|-----------|------|
| **Mobile-first** | All new components must use `flex-col` on mobile; container padding is `px-3` on small screens. See `AGENTS.md`. |
| **Retention over acquisition** | A user who finishes Phase 01 is worth more than 10 signups. Optimise for completion. |
| **Verifiable credentials** | Every achievement must be on-chain and independently verifiable. CP is not a score — it's a credential. |
| **Community as moat** | The network effect of users helping users is harder to replicate than the curriculum. Invest in it early. |

---

## Feature Inventory

> Replaces the former `docs/_ROADMAP.md`. Keep this section up to date when implementing features (see "Contributing to Roadmap" below).

### ✅ Implemented Features

**Core Systems**
- **Authentication** — JWT access + refresh tokens, CSRF protection, route guards
- **Authorization** — Student/Admin role-based access control
- **Session Management** — Secure token handling; 2FA toggle (enable/disable/verify) — see `KNOWN_ISSUES.md` (not yet enforced at login)

**Learning Systems**
- **Attack Labs (5 labs)** — all terminal-based with flag verification (Privilege Escalation, Password Cracking, SQL Injection, OSINT, Kill Chain)
- **Simulated Terminal** — 114+ commands, Kali Linux emulation, virtual filesystem (`TerminalShell` behind shared `TerminalWrapper`)
- **13 Simulation Components** — Browser, HTTP Inspector, SQL Console, etc.
- **Course System (12 courses)** — structured lessons with quizzes and code playgrounds
- **Bootcamp System** — Hacker Protocol Bootcamp, 5 phases / 18 rooms
- **Code Playground** — in-browser code execution (Python, Bash, JavaScript)
- **Quiz System** — inline quizzes and bootcamp room quizzes

**Gamification**
- **Cyber Points (CP)** — reward currency tracked on-chain (chain write via backend outbox)
- **Ranking System** — 5-tier progression (Candidate → Vanguard)
- **Streak Tracking** — daily login streak incentives
- **Public Profiles** — handle, rank, CP balance
- **Leaderboard** — top-50 competitive ranking (see `KNOWN_ISSUES.md` — no pagination)

**UI/UX**
- **Responsive Layouts** — unified stretched layout across all pages (see `AGENTS.md`)
- **Dark Theme** — complete dark mode design system
- **45+ Custom Icons** — SVG icon system with lucide-react
- **SEO Components** — dynamic meta tags and structured data
- **Accessibility** — WCAG compliance, keyboard navigation, screen reader support
- **PWA Support** — manifest, service worker, install banner
- **Mobile Optimization** — touch-friendly interfaces, bottom navigation

**Admin Features**
- **Admin Dashboard** — user management, CP analytics
- **Security Events** — audit log viewing
- **CP Management** — mint/burn CP tokens
- ~~Chain Explorer~~ — **removed** (dead frontend calls to non-existent chain endpoints; backend endpoints also removed 2026-08)

**Marketing/Public**
- **Landing Page** — hero sections, feature showcase (scroll-snap sections)
- **Blog System** — `/blogs` + individual posts at `/blogs/:slug`
- **Team Section** — team member profiles
- **Public Profiles** — profile viewing by handle
- **Course Info Pages** — `/courses/:courseId`

### 📋 Planned Features

**Learning Paths (Design Complete)** — see `docs/LEARNING_PATHS.md`
- 5 curated skill-based tracks (Terminal Foundations, Network Operations, Web Security, Developer Toolkit, Wireless Security)
- Path progress tracking, prerequisite system, path detail pages

**CTF Platform (Design Complete)** — see `docs/CTF_PLAN.md`
- 25 browser-native challenges across 5 modules, `FLAG{...}` submission
- 10 Phase 1 rooms; separate Netlify deployment (`qyvora-ctf-rooms` repo, not yet created)

### 🚧 Future Considerations

**Phase 2 (Post-Launch):** social features (team challenges, peer reviews) · live events · certification system · job board · mentorship · custom/shared labs · public API · mobile app · offline mode

**Advanced CTF:** dynamic per-user flags · timed challenges · team CTF · tournaments · advanced challenge types

**Backend improvements:** learning-path API · real-time collaboration · advanced analytics · content recommendations

**Bootcamp room polish:** step transition animations · completion confetti · dark/light image variants · step preview thumbnails · scroll-to-top · step-time analytics · quiz attempt tracking · image preloading · offline room caching · print stylesheet

### Implementation Priority

| Priority | Items |
|----------|-------|
| **High (Q3 2026)** | Learning Paths, CTF Phase 1 (10 rooms) |
| **Medium (Q4 2026)** | Backend path sync, CTF Phase 2, Social features |
| **Low (2027+)** | Mobile apps, public API, advanced analytics |

---

## Contributing to Roadmap

When adding new features to the roadmap:

1. **Status** — mark as Implemented (✅), Planned (📋, design complete), or Future (🚧, concept).
2. **Design Doc** — link to the detailed design document if one exists.
3. **Effort Estimate** — rough time/complexity estimate.
4. **Dependencies** — prerequisite features or infrastructure.
5. **Implementation Checklist** — break down into actionable tasks.

When implementing a planned feature: move it from "Planned" to "Implemented", update related docs to present tense, and remove "Status: Planning" headers from design docs.
