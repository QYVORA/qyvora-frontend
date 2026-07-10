# QYVORA Product Roadmap

**Status:** Live · 170+ users · Social channels active  
**Last updated:** July 2026

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

### 3. Mobile PWA
- **Problem:** Mobile web has layout issues (being fixed); no install prompt.
- **Strategy:** Convert the student dashboard into a Progressive Web App.
- **Actions:**
  - Add manifest.json and service worker
  - Push notification support for reminders and new room alerts
  - Offline support for room content (cached walkthroughs)
  - Install prompt banner on mobile
- **Files affected:** `public/`, `StudentLayout.tsx`, new service worker

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
| **Mobile-first** | All new components must use `flex-col` on mobile; container padding is `px-3` on small screens. See `UIB.md`. |
| **Retention over acquisition** | A user who finishes Phase 01 is worth more than 10 signups. Optimise for completion. |
| **Verifiable credentials** | Every achievement must be on-chain and independently verifiable. CP is not a score — it's a credential. |
| **Community as moat** | The network effect of users helping users is harder to replicate than the curriculum. Invest in it early. |
