# QYVORA Frontend Documentation

> **Last Updated:** 2026-09-20

Welcome to the QYVORA Frontend documentation. This guide helps you navigate all available documentation.

---

## Quick Navigation

### Getting Started
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture overview (start here)

### Core Systems
- **[AUTHENTICATION.md](AUTHENTICATION.md)** - JWT auth, CSRF, session management
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - Axios setup, interceptors, token refresh
- **[ROUTING.md](ROUTING.md)** - React Router setup, route guards, lazy loading
- **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)** - Context providers, local state patterns
- **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error boundaries, toasts, API errors

### Learning Systems
- **[SIMULATIONS.md](SIMULATIONS.md)** - Complete simulation system reference (13 component types, 5 labs)
- **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)** - Labs, courses, bootcamp overview
- **[BOOTCAMP.md](BOOTCAMP.md)** - Hacker Protocol Bootcamp details + recent room features

### UI/UX (canonical, enforced)
- **[UI-PRINCIPLES.md](UI-PRINCIPLES.md)** - Enforced design rules (dark theme, accent, layout)
- **[UI-PATTERN-INVENTORY.md](UI-PATTERN-INVENTORY.md)** - Existing pattern implementations
- **[TOKENS.md](TOKENS.md)** - Design token single source of truth (colors, spacing, radius, motion, z-index)
- **[TYPOGRAPHY.md](TYPOGRAPHY.md)** - Heading scale source of truth
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Colors, typography, buttons, spacing
- **[PAGE_PATTERNS.md](PAGE_PATTERNS.md)** - Shells, headers, grids, and page composition recipes
- **[RESPONSIVE.md](RESPONSIVE.md)** - Breakpoint matrix and layout behavior
- **[COMPONENT_STATES.md](COMPONENT_STATES.md)** - Interactive and loading state matrix
- **[DEVELOPER_RULES.md](DEVELOPER_RULES.md)** - Pre-write checklist + definition of done
- **[COMPONENTS.md](COMPONENTS.md)** - Full component reference
- **[COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md)** - Component structure
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - WCAG 2.1 AA compliance, keyboard nav
- **[PROFILE_PAGE_UI.md](PROFILE_PAGE_UI.md)** - Profile page UI design and layout

### Game / Reward Systems
- **[TROPHY-SPECS.md](TROPHY-SPECS.md)** - Trophy, badge, and HPB reward specifications

### Development
- **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** - Vite 6, TypeScript, ESLint setup
- **[TESTING.md](TESTING.md)** - Vitest, React Testing Library
- **[PERFORMANCE.md](PERFORMANCE.md)** - Bundle optimization, lazy loading
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify configuration, security headers
- **[SEO.md](SEO.md)** - Prerendering, meta tags, structured data, GSC verification

### Advanced Features
- **[PWA.md](PWA.md)** - Progressive Web App setup, offline support

### Planned Features
- **[LEARNING_PATHS.md](LEARNING_PATHS.md)** - 5 guided learning tracks (not yet implemented)
- **[CTF_PLAN.md](CTF_PLAN.md)** - CTF platform implementation plan (not yet implemented)
- **[PLATFORM_ILLUSTRATION_SYSTEM.md](PLATFORM_ILLUSTRATION_SYSTEM.md)** - Unified visual identity with SVG illustrations and platform entities (planned)

---

## Documentation by Role

### For New Developers
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System overview
2. **[ROUTING.md](ROUTING.md)** - Page structure
3. **[UI-PRINCIPLES.md](UI-PRINCIPLES.md)** - Enforced UI rules
4. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - UI patterns

### For Backend Developers
1. **[AUTHENTICATION.md](AUTHENTICATION.md)** - Token flow and security
2. **[API_INTEGRATION.md](API_INTEGRATION.md)** - API client setup
3. **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error response patterns

### For UI/UX Designers
1. **[UI-PRINCIPLES.md](UI-PRINCIPLES.md)** - Enforced design rules
2. **[TOKENS.md](TOKENS.md)** - Design token reference
3. **[UI-PATTERN-INVENTORY.md](UI-PATTERN-INVENTORY.md)** - Pattern implementations
4. **[TYPOGRAPHY.md](TYPOGRAPHY.md)** - Heading scale
5. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Design tokens and patterns
6. **[PAGE_PATTERNS.md](PAGE_PATTERNS.md)** - Page composition recipes
7. **[ACCESSIBILITY.md](ACCESSIBILITY.md)** - Accessibility standards

### For QA/Testers
1. **[TESTING.md](TESTING.md)** - Test framework and patterns
2. **[ERROR_HANDLING.md](ERROR_HANDLING.md)** - Error scenarios
3. **[ROADMAP.md](ROADMAP.md)** - What's implemented vs planned

### For DevOps
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Netlify configuration
2. **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** - Build process
3. **[PERFORMANCE.md](PERFORMANCE.md)** - Optimization strategies

---

## File Organization

```
docs/
├── README.md                    # This file - documentation index
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
├── UI/UX Docs (canonical)
│   ├── UI-PRINCIPLES.md         # Enforced rules - source of truth
│   ├── UI-PATTERN-INVENTORY.md  # Pattern implementations
│   ├── TOKENS.md                # Design tokens single source of truth
│   ├── TYPOGRAPHY.md            # Heading scale
│   ├── DESIGN_SYSTEM.md
│   ├── PAGE_PATTERNS.md         # Shells, headers, grids, recipes
│   ├── RESPONSIVE.md            # Breakpoint matrix
│   ├── COMPONENT_STATES.md      # State matrix
│   ├── DEVELOPER_RULES.md       # Pre-write checklist + DoD
│   ├── COMPONENTS.md            # Full component reference
│   ├── COMPONENT_ARCHITECTURE.md
│   ├── ACCESSIBILITY.md
│   └── PROFILE_PAGE_UI.md       # Profile page UI design and layout
│
├── Game / Reward Systems
│   └── TROPHY-SPECS.md          # Trophy, badge, HPB reward specs
│
├── Development Docs
│   ├── BUILD_PIPELINE.md
│   ├── TESTING.md
│   ├── PERFORMANCE.md
│   ├── DEPLOYMENT.md
│   └── SEO.md
│
├── Advanced Features
│   └── PWA.md
│
└── Planned Features
    ├── LEARNING_PATHS.md        # Not yet implemented
    ├── CTF_PLAN.md              # Not yet implemented
    └── PLATFORM_ILLUSTRATION_SYSTEM.md  # Planned
```

Root-level docs (outside `docs/`):
- `README.md` - Project README with stack, quick start, routes
- `ROADMAP.md` - Product roadmap with future priorities
- `AGENTS.md` - Design conventions (source of truth for UI patterns)

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
- Enforced rules: **[UI-PRINCIPLES.md](UI-PRINCIPLES.md)**
- Pattern implementations: **[UI-PATTERN-INVENTORY.md](UI-PATTERN-INVENTORY.md)**
- Design tokens: **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**
- Component reference: **[COMPONENTS.md](COMPONENTS.md)**

### Learning Features
- Lab simulations: **[SIMULATIONS.md](SIMULATIONS.md)**
- Bootcamp structure: **[BOOTCAMP.md](BOOTCAMP.md)**
- Course system: **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)**

### Build & Deployment
- Build configuration: **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)**
- Performance optimization: **[PERFORMANCE.md](PERFORMANCE.md)**
- Deployment process: **[DEPLOYMENT.md](DEPLOYMENT.md)**
- SEO / prerendering / GSC: **[SEO.md](SEO.md)**
- Testing: **[TESTING.md](TESTING.md)**

---

## Important Notes

### About Planned Features
Documents marked as planned (`LEARNING_PATHS.md`, `CTF_PLAN.md`, `PLATFORM_ILLUSTRATION_SYSTEM.md`) describe features that do NOT exist yet. They are design documents, not implementation documentation.

### Keeping Documentation Current
When making code changes:
1. Update relevant documentation files
2. Keep status headers accurate
3. Update `ROADMAP.md` if adding/removing features
4. Use present tense for implemented features, future tense for planned ones