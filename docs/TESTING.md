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
