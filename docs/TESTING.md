# Testing

> **Status:** ✅ IMPLEMENTED  
> **Framework:** Vitest 4.1 + React Testing Library  
> **Coverage:** 22 test files, 192 tests

## Framework

**Test runner:** Vitest 4.1
**Component testing:** React Testing Library
**Environment:** jsdom
**Setup:** `src/test/setup.ts` (imports `@testing-library/jest-dom`)

## Commands

```bash
npm run test         # Run all tests once
npm run test:watch   # Run tests in watch mode
```

## Test Structure

Tests are colocated with source code in `__tests__/` directories:

```
src/
├── shared/
│   ├── components/__tests__/
│   │   ├── ErrorBoundary.test.tsx
│   │   ├── ScenarioCard.test.tsx
│   │   └── ...
│   ├── hooks/__tests__/
│   │   └── useNavInvert.test.ts
│   └── utils/__tests__/
│       └── cn.test.ts
├── features/
│   └── student/
│       ├── components/SimulatedTerminal/engine/__tests__/
│       │   ├── filesystem.test.ts
│       │   ├── parser.test.ts
│       │   └── handlers.test.ts
│       ├── data/simulations/__tests__/
│       │   ├── privesc-scenarios.test.ts
│       │   └── ... (9 more)
│       └── pages/labs/__tests__/
│           ├── LabsPage.test.tsx
│           └── LabCard.test.tsx
└── core/contexts/__tests__/
    └── ToastContext.test.tsx
```

## Test Categories

### Unit Tests

Pure function tests:
- `cn.test.ts` — className merging utility
- `filesystem.test.ts` — VFS operations
- `parser.test.ts` — Command parsing
- `handlers.test.ts` — Terminal command handlers

### Component Tests

React component rendering:
- `ErrorBoundary.test.tsx` — Error capture
- `ScenarioCard.test.tsx` — Lab scenario card
- `LabCard.test.tsx` — Dashboard lab card
- `PasswordInput.test.tsx` — Auth input
- `LabsPage.test.tsx` — Full labs page
- `ToastContext.test.tsx` — Toast provider

### Hook Tests

Custom hook behavior:
- `useNavInvert.test.ts` — Nav inversion detection

### Data Tests

Static data validation:
- 9 simulation data tests (privesc, traffic, wireless, osint, passwords, phishing, kill-chain, proxy, sql-injection, web-app)

## Mocking Patterns

```tsx
// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    })),
  },
}));

// Mock window.matchMedia
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
}));
```

## Current Coverage

- **22 test files**
- **192 tests**
- **All passing**

## Writing Tests

1. Create `__tests__/` directory next to source
2. Name test file `<ComponentName>.test.tsx`
3. Use `describe`/`it` blocks
4. Mock external dependencies
5. Test rendering, interactions, and edge cases

## E2E Test Plan (Playwright/Cypress)

> **Status:** Not yet implemented — no E2E framework installed.
> **When added:** Convert this checklist to automated specs.

### Setup Requirements

- [ ] Install Playwright (`@playwright/test`) or Cypress
- [ ] Configure base URL to local dev server (`http://localhost:5173`)
- [ ] Configure API URL to local backend (`http://localhost:3001`)
- [ ] Seed test database with known user credentials
- [ ] Create test helper: `tests/helpers/auth.ts` (login flow)
- [ ] Create test helper: `tests/helpers/lab.ts` (lab navigation + flag submission)

### Test Suite 1: Authentication Flow

```
✅ 1.1  User can register with email/password
✅ 1.2  User receives email verification (mock SMTP)
✅ 1.3  User can log in with valid credentials
✅ 1.4  User sees dashboard after login
✅ 1.5  Invalid credentials show error toast
✅ 1.6  Protected routes redirect to /auth/login
```

### Test Suite 2: Dashboard Engagement Loop

```
✅ 2.1  Dashboard loads with stat cards (XP, CP, streak)
✅ 2.2  Daily mission card appears with available missions
✅ 2.3  Weekly operation card shows current operation + steps
✅ 2.4  CpEarnHint shows nearest CP opportunity
✅ 2.5  Skill matrix displays per-category progress
✅ 2.6  Leaderboard tab loads with cohort filters
```

### Test Suite 3: Lab Lifecycle (Critical Path)

```
✅ 3.1  Labs page lists all categories (privesc, sqli, osint, passwords, killchain)
✅ 3.2  Clicking a scenario opens WalkthroughLayout
✅ 3.3  Briefing step renders with mission + objectives (skipFlag = true)
✅ 3.4  First technical step is active, others are locked
✅ 3.5  Running correct command in terminal completes step
✅ 3.6  Submitting correct flag advances to next step
✅ 3.7  Submitting incorrect flag shows error, stays on step
✅ 3.8  All steps completed → debrief step becomes visible
✅ 3.9  Debrief step shows reflection prompt (skipFlag = true)
✅ 3.10 LabCelebration modal appears on completion
✅ 3.11 CP reward is credited to user account
✅ 3.12 Back button returns to scenario selection
✅ 3.13 Completed scenario shows checkmark in accordion
```

### Test Suite 4: CP Economy

```
✅ 4.1  User sees current CP balance on dashboard
✅ 4.2  Purchasing advanced lab deducts CP
✅ 4.3  Insufficient CP shows lock icon + cost on accordion
✅ 4.4  After purchase, lab unlocks and becomes startable
✅ 4.5  CP transaction appears in transaction history
```

### Test Suite 5: Profile & Achievements

```
✅ 5.1  Profile page loads with identity block
✅ 5.2  Achievements section shows earned badges
✅ 5.3  Skill achievements display per-category rarity
✅ 5.4  Contribution calendar shows activity dates
✅ 5.5  Activity timeline shows recent events
✅ 5.6  Labs module lists completed labs
```

### Test Suite 6: Cohorts & Leaderboards

```
✅ 6.1  User can create a cohort (gets invite code)
✅ 6.2  User can join cohort via invite code
✅ 6.3  Leaderboard filters by selected cohort
✅ 6.4  Cohort filter shows only member scores
✅ 6.5  "All Users" filter shows global leaderboard
```

### Test Suite 7: Onboarding Flow

```
✅ 7.1  New user sees onboarding wizard after first login
✅ 7.2  Completing onboarding awards XP + records activity
✅ 7.3  Onboarding status persists across page reloads
✅ 7.4  Skipping onboarding redirects to dashboard
```

### Test Suite 8: Responsive & Accessibility

```
✅ 8.1  Dashboard renders correctly on mobile (375px)
✅ 8.2  Dashboard renders correctly on tablet (768px)
✅ 8.3  Dashboard renders correctly on desktop (1440px)
✅ 8.4  All interactive elements have min-h-[48px]
✅ 8.5  Focus-visible navigation works via keyboard
✅ 8.6  Screen reader announces step completion
```

### CI Integration

```yaml
# .github/workflows/e2e.yml (when ready)
- name: Run E2E tests
  run: |
    npm run build
    npm run test:e2e
  env:
    BASE_URL: http://localhost:5173
    API_URL: http://localhost:3001
```

### File Structure (When Implemented)

```
qyvora-frontend/
├── tests/
│   ├── helpers/
│   │   ├── auth.ts          # Login/register helpers
│   │   ├── lab.ts           # Lab navigation + flag helpers
│   │   └── api.ts           # API mock helpers
│   ├── auth.spec.ts         # Suite 1
│   ├── dashboard.spec.ts    # Suite 2
│   ├── lab-lifecycle.spec.ts # Suite 3 (critical path)
│   ├── cp-economy.spec.ts   # Suite 4
│   ├── profile.spec.ts      # Suite 5
│   ├── cohorts.spec.ts      # Suite 6
│   ├── onboarding.spec.ts   # Suite 7
│   └── responsive.spec.ts   # Suite 8
├── playwright.config.ts
└── ...
```
