# QYVORA Frontend Documentation

> **Last Updated:** 2026-07-22

Welcome to the QYVORA Frontend documentation. This guide helps you navigate all available documentation.

---

## Quick Navigation

### Getting Started
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture overview (start here)
- **[_ROADMAP.md](_ROADMAP.md)** - Feature implementation status and future plans

### Core Systems
- **[AUTHENTICATION.md](AUTHENTICATION.md)** - JWT auth, CSRF, session management
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Axios setup, interceptors, token refresh
- **[ROUTING.md](ROUTING.md)** - React Router setup, route guards, lazy loading
- **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)** - Context providers, local state patterns
- **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error boundaries, toasts, API errors

### Learning Systems
- **[SIMULATIONS.md](SIMULATIONS.md)** - Complete simulation system reference (20 types)
- **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)** - Labs, courses, bootcamp overview
- **[BOOTCAMP.md](BOOTCAMP.md)** - Hacker Protocol Bootcamp details + recent room features

### UI/UX
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Colors, typography, buttons, spacing
- **[COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md)** - Component structure
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - WCAG 2.1 AA compliance, keyboard nav

### Development
- **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** - Vite 6, TypeScript, ESLint setup
- **[TESTING.md](TESTING.md)** - Vitest, React Testing Library (192 tests)
- **[PERFORMANCE.md](PERFORMANCE.md)** - Bundle optimization, lazy loading
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify configuration, security headers

### Advanced Features
- **[PWA.md](PWA.md)** - Progressive Web App setup, offline support

### Planned Features
- **[LEARNING_PATHS.md](LEARNING_PATHS.md)** - 5 guided learning tracks (not yet implemented)
- **[CTF_PLAN.md](CTF_PLAN.md)** - CTF platform implementation plan (not yet implemented)

### Archive
- **[archive/](archive/)** - Historical audit docs and command reference (read-only)

---

## Documentation by Role

### For New Developers
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System overview
2. **[ROUTING.md](ROUTING.md)** - Page structure
3. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - UI patterns
4. **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)** - Data flow

### For Backend Developers
1. **[AUTHENTICATION.md](AUTHENTICATION.md)** - Token flow and security
2. **[API_INTEGRATION.md](API_INTEGRATION.md)** - API client setup
3. **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error response patterns

### For UI/UX Designers
1. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Design tokens and patterns
2. **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - Accessibility standards

### For QA/Testers
1. **[TESTING.md](TESTING.md)** - Test framework and patterns
2. **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error scenarios
3. **[_ROADMAP.md](_ROADMAP.md)** - What's implemented vs planned

### For DevOps
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify configuration
2. **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** - Build process
3. **[PERFORMANCE.md](PERFORMANCE.md)** - Optimization strategies

---

## File Organization

```
docs/
├── README.md                    # This file - documentation index
├── _ROADMAP.md                  # Implementation status and plans
│
├── Core System Docs
│   ├── ARCHITECTURE.md          # System overview (start here)
│   ├── COMPONENT_ARCHITECTURE.md
│   ├── AUTHENTICATION.md
│   ├── API_INTEGRATION.md
│   ├── ROUTING.md
│   ├── STATE_MANAGEMENT.md
│   └── ERROR_HANDLING.md
│
├── Learning System Docs
│   ├── SIMULATIONS.md           # Complete simulation reference
│   ├── LEARNING_SYSTEM.md
│   └── BOOTCAMP.md
│
├── UI/UX Docs
│   ├── DESIGN_SYSTEM.md
│   └── ACCESSIBILITY.md
│
├── Development Docs
│   ├── BUILD_PIPELINE.md
│   ├── TESTING.md
│   ├── PERFORMANCE.md
│   └── DEPLOYMENT.md
│
├── Advanced Features
│   └── PWA.md
│
├── Planned Features
│   ├── LEARNING_PATHS.md        # Not yet implemented
│   └── CTF_PLAN.md              # Not yet implemented
│
└── archive/                     # Historical reference (read-only)
    └── (empty - audits cleaned up)
```

Root-level docs (outside `docs/`):
- `README.md` - Project README with stack, quick start, routes
- `ROADMAP.md` - Product roadmap with future priorities
- `UIB.md` - Mobile-first UI behavior guidelines
- `PROFILE_PAGE_UI.md` - Profile page UI design and layout

---

## Finding Specific Information

### Authentication & Security
- How auth works: **[AUTHENTICATION.md](AUTHENTICATION.md)**
- Token storage: **[AUTHENTICATION.md](AUTHENTICATION.md)** - "Token Storage Model"
- CSRF protection: **[AUTHENTICATION.md](AUTHENTICATION.md)** - "CSRF Protection"
- Route guards: **[ROUTING.md](ROUTING.md)** - "Route Guards"

### API & Data
- API client setup: **[API_INTEGRATION.md](API_INTEGRATION.md)**
- Token refresh: **[API_INTEGRATION.md](API_INTEGRATION.md)** - "Response Interceptor"
- Error handling: **[ERROR_HANDLING.md](ERROR_HANDLING.md)**
- State management: **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)**

### UI Components
- Design tokens: **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**
- Button styles: **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - "Button System"
- Identicon defaults: **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - "Identicon Defaults"
- Component structure: **[COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md)**

### Learning Features
- Lab simulations: **[SIMULATIONS.md](SIMULATIONS.md)**
- Bootcamp structure: **[BOOTCAMP.md](BOOTCAMP.md)**
- Course system: **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)**

### Build & Deployment
- Build configuration: **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)**
- Performance optimization: **[PERFORMANCE.md](PERFORMANCE.md)**
- Deployment process: **[DEPLOYMENT.md](DEPLOYMENT.md)**
- Testing: **[TESTING.md](TESTING.md)**

---

## Important Notes

### About Planned Features
Documents marked as planned (LEARNING_PATHS.md, CTF_PLAN.md) describe features that do NOT exist yet. They are design documents, not implementation documentation.

### Keeping Documentation Current
When making code changes:
1. Update relevant documentation files
2. Keep status headers accurate
3. Update **[_ROADMAP.md](_ROADMAP.md)** if adding/removing features
4. Use present tense for implemented features, future tense for planned ones
