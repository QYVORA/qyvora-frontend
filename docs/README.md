# QYVORA Frontend Documentation

> **Last Updated:** 2026-07-18

Welcome to the QYVORA Frontend documentation. This guide helps you navigate all available documentation.

---

## 📋 Quick Navigation

### Getting Started
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture overview ⭐ START HERE
- **[_ROADMAP.md](_ROADMAP.md)** - Feature implementation status and future plans

### Core Systems (✅ Implemented)
- **[AUTHENTICATION.md](AUTHENTICATION.md)** - JWT auth, CSRF, session management
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Axios setup, interceptors, token refresh
- **[ROUTING.md](ROUTING.md)** - React Router setup, route guards, lazy loading
- **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)** - Context providers, local state patterns
- **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error boundaries, toasts, API errors

### Learning Systems (✅ Implemented)
- **[SIMULATIONS.md](SIMULATIONS.md)** - Complete simulation system reference (19 types) ⭐
- **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)** - Labs, courses, bootcamp overview
- **[BOOTCAMP.md](BOOTCAMP.md)** - Hacker Protocol Bootcamp details
- **[TERMINAL_SIMULATION.md](TERMINAL_SIMULATION.md)** - Terminal emulator (114+ commands)

### UI/UX (✅ Implemented)
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Colors, typography, buttons, spacing
- **[ICON_SYSTEM.md](ICON_SYSTEM.md)** - Custom SVG icon library (45+ icons)
- **[COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md)** - Component structure
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - WCAG 2.1 AA compliance, keyboard nav

### Development (✅ Implemented)
- **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** - Vite 6, TypeScript, ESLint setup
- **[TESTING.md](TESTING.md)** - Vitest, React Testing Library (192 tests)
- **[PERFORMANCE.md](PERFORMANCE.md)** - Bundle optimization, lazy loading
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify configuration, security headers

### Advanced Features (✅ Implemented)
- **[PWA.md](PWA.md)** - Progressive Web App setup, offline support
- **[SEO.md](SEO.md)** - Meta tags, Open Graph, social sharing

### Planned Features (📋 Design Complete)
- **[LEARNING_PATHS.md](LEARNING_PATHS.md)** - 📋 5 guided learning tracks (NOT YET IMPLEMENTED)
- **[CTF.md](CTF.md)** - 📋 Capture The Flag platform overview (NOT YET IMPLEMENTED)
- **[CTF_PLAN.md](CTF_PLAN.md)** - 📋 Detailed CTF implementation plan (NOT YET IMPLEMENTED)

### Audit Records
- **[frontend-audits/](frontend-audits/)** - Historical audit reports and fixes

---

## 📊 Documentation Status Legend

| Icon | Status | Description |
|------|--------|-------------|
| ✅ | **Implemented** | Feature is live and documented accurately |
| 📋 | **Planned** | Design complete, implementation pending |
| 🚧 | **Future** | Concept stage, no detailed design |
| ⚠️ | **Partial** | Partially implemented or needs update |

---

## 🎯 Documentation by Role

### For New Developers
1. Start with **[ARCHITECTURE.md](ARCHITECTURE.md)** for system overview
2. Read **[ROUTING.md](ROUTING.md)** to understand page structure
3. Review **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** for UI patterns
4. Check **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)** for data flow

### For Backend Developers
1. **[AUTHENTICATION.md](AUTHENTICATION.md)** - Token flow and security
2. **[API_INTEGRATION.md](API_INTEGRATION.md)** - API client setup
3. **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error response patterns

### For UI/UX Designers
1. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Design tokens and patterns
2. **[ICON_SYSTEM.md](ICON_SYSTEM.md)** - Available icons
3. **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - Accessibility standards

### For QA/Testers
1. **[TESTING.md](TESTING.md)** - Test framework and patterns
2. **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error scenarios
3. **[_ROADMAP.md](_ROADMAP.md)** - What's implemented vs planned

### For DevOps
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify configuration
2. **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** - Build process
3. **[PERFORMANCE.md](PERFORMANCE.md)** - Optimization strategies

---

## 📁 File Organization

```
docs/
├── README.md                    # This file - documentation index
├── _ROADMAP.md                  # Implementation status and plans
│
├── Core System Docs (✅)
│   ├── ARCHITECTURE.md          # System overview ⭐
│   ├── COMPONENT_ARCHITECTURE.md
│   ├── AUTHENTICATION.md
│   ├── API_INTEGRATION.md
│   ├── ROUTING.md
│   ├── STATE_MANAGEMENT.md
│   └── ERROR_HANDLING.md
│
├── Learning System Docs (✅)
│   ├── SIMULATIONS.md           # Complete simulation reference ⭐
│   ├── LEARNING_SYSTEM.md
│   ├── BOOTCAMP.md
│   └── TERMINAL_SIMULATION.md
│
├── UI/UX Docs (✅)
│   ├── DESIGN_SYSTEM.md
│   ├── ICON_SYSTEM.md
│   └── ACCESSIBILITY.md
│
├── Development Docs (✅)
│   ├── BUILD_PIPELINE.md
│   ├── TESTING.md
│   ├── PERFORMANCE.md
│   └── DEPLOYMENT.md
│
├── Advanced Features (✅)
│   ├── PWA.md
│   └── SEO.md
│
├── Planned Features (📋)
│   ├── LEARNING_PATHS.md        # NOT YET IMPLEMENTED
│   ├── CTF.md                   # NOT YET IMPLEMENTED
│   └── CTF_PLAN.md              # NOT YET IMPLEMENTED
│
└── frontend-audits/             # Historical records
    ├── ARCHITECTURE.md
    ├── BOOTCAMP_ROOM_*.md
    ├── MOBILE_FIXES_SUMMARY.md
    ├── SCROLLBAR_*.md
    └── WALKTHROUGH_TEXT.md
```

---

## 🔍 Finding Specific Information

### Authentication & Security
- How auth works: **[AUTHENTICATION.md](AUTHENTICATION.md)**
- Token storage: **[AUTHENTICATION.md](AUTHENTICATION.md)** → "Token Storage Model"
- CSRF protection: **[AUTHENTICATION.md](AUTHENTICATION.md)** → "CSRF Protection"
- Route guards: **[ROUTING.md](ROUTING.md)** → "Route Guards"

### API & Data
- API client setup: **[API_INTEGRATION.md](API_INTEGRATION.md)**
- Token refresh: **[API_INTEGRATION.md](API_INTEGRATION.md)** → "Response Interceptor"
- Error handling: **[ERROR_HANDLING.md](ERROR_HANDLING.md)**
- State management: **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)**

### UI Components
- Design tokens: **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**
- Button styles: **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** → "Button System"
- Icons: **[ICON_SYSTEM.md](ICON_SYSTEM.md)**
- Component structure: **[COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md)**

### Learning Features
- Lab simulations: **[SIMULATIONS.md](SIMULATIONS.md)** ⭐ Most comprehensive
- Terminal commands: **[TERMINAL_SIMULATION.md](TERMINAL_SIMULATION.md)**
- Bootcamp structure: **[BOOTCAMP.md](BOOTCAMP.md)**
- Course system: **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)**

### Build & Deployment
- Build configuration: **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)**
- Performance optimization: **[PERFORMANCE.md](PERFORMANCE.md)**
- Deployment process: **[DEPLOYMENT.md](DEPLOYMENT.md)**
- Testing: **[TESTING.md](TESTING.md)**

---

## ⚠️ Important Notes

### About Planned Features
Documents marked with 📋 (LEARNING_PATHS.md, CTF.md, CTF_PLAN.md) describe **planned features that do NOT exist yet**. They are design documents, not implementation documentation.

**Before implementing a planned feature:**
1. Read the design document thoroughly
2. Check **[_ROADMAP.md](_ROADMAP.md)** for implementation timeline
3. Update the status header when implementation begins
4. Move to "Implemented Features" section in roadmap when complete

### Keeping Documentation Current
When making code changes:
1. Update relevant documentation files
2. Keep status headers accurate (✅, 📋, 🚧)
3. Update **[_ROADMAP.md](_ROADMAP.md)** if adding/removing features
4. Use present tense only for implemented features
5. Use future tense for planned features

---

## 📞 Documentation Feedback

If you find:
- **Inaccurate information** - Update the doc and note the change
- **Missing documentation** - Create an issue or add the doc
- **Outdated content** - Mark it and schedule an update
- **Confusing sections** - Clarify and simplify

---

## 🔗 External Resources

- **React 19:** https://react.dev/
- **Vite 6:** https://vitejs.dev/
- **Tailwind CSS v4:** https://tailwindcss.com/
- **React Router:** https://reactrouter.com/
- **Vitest:** https://vitest.dev/
- **Netlify:** https://docs.netlify.com/

---

**Happy coding! 🚀**
