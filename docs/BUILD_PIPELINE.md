# Build Pipeline

> **Status:** ✅ IMPLEMENTED  
> **Build Tool:** Vite 6  
> **Bundler:** esbuild with code splitting

## Overview

QYVORA Frontend uses Vite 6 as its build tool with TypeScript, ESLint, and Tailwind CSS v4.

## Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Vite | 6.2+ | Build tool, dev server, HMR |
| TypeScript | 5.8 | Type checking |
| ESLint | 8.57 | Linting |
| Vitest | 4.1 | Testing |
| Tailwind CSS | 4.1 | Styling (via Vite plugin) |
| esbuild | (bundled) | Minification |

## Scripts

```bash
npm run dev          # Vite dev server on port 5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run clean        # Remove dist/
npm run lint         # ESLint check
npm run typecheck    # TypeScript type check
npm run test         # Vitest run
npm run test:watch   # Vitest watch mode
```

## Vite Configuration

**Source:** `vite.config.ts`

### Plugins

1. `@vitejs/plugin-react` — React Fast Refresh
2. `@tailwindcss/vite` — Tailwind CSS v4 integration
3. `vite-plugin-webp-conversion` — Image optimization

### Path Aliases

```typescript
alias: { '@': path.resolve(__dirname, 'src') }
```

All imports use `@/` prefix: `import X from '@/shared/components/X'`

### Dev Server

- Port: 5173
- Host: `127.0.0.1` (configurable via `VITE_DEV_HOST`)
- HMR enabled
- Proxy: `/api` → `http://localhost:3000`

### Build

- Target: ES2020
- Minification: esbuild
- No sourcemaps
- Chunk size warning: 800KB

## TypeScript

**Source:** `tsconfig.json`

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Includes: `src/**/*.ts`, `src/**/*.tsx`
- Excludes: `node_modules`, `dist`

## ESLint

**Source:** `.eslintrc.cjs`

- TypeScript ESLint parser
- React plugin
- Rules tuned for the project's conventions

## Tailwind CSS v4

**No `tailwind.config.*` file** — Tailwind CSS v4 uses the Vite plugin and `@theme` blocks in `src/styles/index.css`.

All design tokens are defined as CSS custom properties in the `@theme` block.

## Pre-commit Checks

Before committing, run:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

All four must pass.
