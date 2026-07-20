# QYVORA Frontend Roadmap

> **Status:** Living Document  
> **Last Updated:** 2026-07-18

This document tracks the implementation status of all features in the QYVORA platform, separating what exists today from what's planned for the future.

---

## ✅ Implemented Features

### Core Systems
- ✅ **Authentication** - JWT-based auth with refresh tokens, CSRF protection, route guards
- ✅ **Authorization** - Student/Admin role-based access control
- ✅ **Session Management** - Secure session handling with httpOnly cookies

### Learning Systems
- ✅ **Attack Labs (10 labs)** - Fully interactive penetration testing labs
  - Privilege Escalation, Password Cracking, Web Exploitation, SQL Injection
  - Phishing Analysis, Web Proxy, Traffic Analysis, OSINT, Wireless, Kill Chain
- ✅ **Simulated Terminal** - ~149 commands, Kali Linux emulation, virtual filesystem
- ✅ **20 Simulation Components** - Browser, HTTP Inspector, SQL Console, Email Client, etc.
- ✅ **Course System (12 courses)** - Structured lessons with quizzes and code playgrounds
- ✅ **Bootcamp System** - Hacker Protocol Bootcamp with multi-phase progression
- ✅ **Code Playground** - In-browser code execution for Python, Bash, JavaScript
- ✅ **Quiz System** - Inline quizzes and bootcamp room quizzes

### Gamification
- ✅ **Cyber Points (CP)** - Reward currency tracked on blockchain
- ✅ **Ranking System** - 5-tier progression (Candidate → Vanguard)
- ✅ **Streak Tracking** - Daily login streak incentives
- ✅ **Public Profiles** - Student profiles with handle, rank, CP balance
- ✅ **Leaderboard** - Competitive rankings display

### UI/UX
- ✅ **Responsive Layouts** - 6 layout systems (Landing, Public, Student, Admin, etc.)
- ✅ **Dark Theme** - Complete dark mode design system
- ✅ **45+ Custom Icons** - SVG icon system with lucide-react
- ✅ **SEO Components** - Dynamic meta tags and structured data
- ✅ **Accessibility** - WCAG compliance, keyboard navigation, screen reader support
- ✅ **PWA Support** - Progressive Web App capabilities
- ✅ **Mobile Optimization** - Touch-friendly interfaces, bottom navigation

### Admin Features
- ✅ **Admin Dashboard** - User management, CP analytics
- ✅ **Chain Explorer** - Blockchain transaction viewer
- ✅ **Security Events** - Audit log viewing
- ✅ **CP Management** - Mint/burn CP tokens

### Marketing/Public
- ✅ **Landing Page** - Hero sections, feature showcase
- ✅ **Blog System** - Blog posts with markdown rendering
- ✅ **Events System** - Event listings and access management
- ✅ **News Feed** - Cybersecurity news aggregation
- ✅ **Team Page** - Team member profiles
- ✅ **Public Profiles** - Student profile viewing by handle

---

## 📋 Planned Features

### Learning Paths (Design Complete)
- 📋 **Guided Learning Tracks** - 5 curated skill-based paths
  - Terminal Foundations, Network Operations, Web Security
  - Developer Toolkit, Wireless Security
- 📋 **Path Progress Tracking** - Visual progression through course sequences
- 📋 **Prerequisite System** - Locked courses until prerequisites complete
- 📋 **Path Detail Pages** - Step-by-step course navigation

**Design Document:** `docs/LEARNING_PATHS.md` (449 lines)  
**Estimated Effort:** 7-8 hours  
**Status:** Phase 1 checklist incomplete

### CTF Platform (Design Complete)
- 📋 **Browser-Native CTF Rooms** - 25 challenges across 5 modules
- 📋 **Flag Submission System** - `FLAG{...}` format validation
- 📋 **Separate Netlify Deployment** - Independent CTF rooms domain
- 📋 **10 Phase 1 Rooms**:
  - HTML Source, DevTools Console, Network Header, Cookie
  - Robots.txt, Base64 Decode, JS Variable, Meta Tag
  - Redirect Chain, HTTP Status

**Design Documents:** `docs/CTF_PLAN.md` (449 lines), `docs/CTF.md`  
**Estimated Effort:** 7-8 hours  
**Status:** No implementation started  
**Infrastructure:** Separate `qyvora-ctf-rooms` repository (not yet created)

---

## 🚧 Future Considerations

### Phase 2 Features (Post-Launch)
- 🚧 **Social Features** - Team challenges, peer code reviews
- 🚧 **Live Events** - Scheduled workshops and webinars
- 🚧 **Certification System** - Official QYVORA certifications
- 🚧 **Job Board** - Career opportunities integration
- 🚧 **Mentorship Program** - 1-on-1 mentor matching
- 🚧 **Custom Labs** - User-generated lab content
- 🚧 **Lab Sharing** - Share and discover community labs
- 🚧 **API Access** - Public API for third-party integrations
- 🚧 **Mobile App** - Native iOS/Android applications
- 🚧 **Offline Mode** - Download courses for offline learning

### Advanced CTF Features (Post Phase 1)
- 🚧 **Dynamic Flags** - Per-user unique flags
- 🚧 **Timed Challenges** - Countdown-based competitions
- 🚧 **Team CTF** - Collaborative flag capture
- 🚧 **CTF Tournaments** - Scheduled competitive events
- 🚧 **Advanced Challenges** - localStorage, WebSocket, CSS content, SVG hidden, etc.

### Backend Improvements
- 🚧 **Learning Path API** - Backend progress tracking for paths
- 🚧 **Real-time Collaboration** - Multi-user lab sessions
- 🚧 **Advanced Analytics** - Learning pattern insights
- 🚧 **Content Recommendations** - AI-powered course suggestions

### Bootcamp Room Polish
- 🚧 **Step Transition Animations** - AnimatePresence fade/slide between steps
- 🚧 **Confetti on Completion** - canvas-confetti celebration when room completed
- 🚧 **Dark/Light Image Variants** - Optional `imageDark` field on steps for theme-specific screenshots
- 🚧 **Step Preview Thumbnails** - Mini image previews on hover in progress bar
- 🚧 **Scroll-to-Top Button** - For long rooms with many steps on desktop
- 🚧 **Step Time Analytics** - Track time per step, POST /analytics/step-timing
- 🚧 **Quiz Attempt Tracking** - Log attempts per quiz pass
- 🚧 **Image Preloading** - Preload next 2 step images
- 🚧 **Offline Room Caching** - Service Worker caching for room content
- 🚧 **Print Stylesheet** - PDF study guide export for room content

---

## Implementation Priority

### High Priority (Q3 2026)
1. **Learning Paths** - Critical for user navigation and retention
2. **CTF Phase 1** - 10 rooms to diversify learning options

### Medium Priority (Q4 2026)
3. **Backend Path Sync** - Sync path progress to backend
4. **CTF Phase 2** - Advanced challenge types
5. **Social Features** - Team challenges

### Low Priority (2027+)
6. **Mobile Apps** - Native mobile experience
7. **API Access** - Third-party integrations
8. **Advanced Analytics** - ML-based insights

---

## Feature Status Legend

| Icon | Status | Description |
|------|--------|-------------|
| ✅ | Implemented | Feature is live in production |
| 📋 | Planned | Design complete, implementation pending |
| 🚧 | Future | Concept stage, no detailed design yet |
| ⚠️ | Partial | Partially implemented or needs rework |
| ❌ | Deprecated | Feature removed or cancelled |

---

## Contributing to Roadmap

When adding new features to the roadmap:

1. **Status** - Clearly mark as Planned (📋) or Future (🚧)
2. **Design Doc** - Link to detailed design documentation if it exists
3. **Effort Estimate** - Provide rough time/complexity estimate
4. **Dependencies** - List any prerequisite features or infrastructure
5. **Implementation Checklist** - Break down into actionable tasks

When implementing a planned feature:
1. Update status from 📋 to ✅
2. Move from "Planned Features" to "Implemented Features"
3. Update documentation to reflect current state (not future tense)
4. Remove "Status: Planning" headers from related docs
