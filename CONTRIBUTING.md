# Contributing to QYVORA Frontend

Thank you for your interest in contributing to QYVORA.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env`
5. Start development: `npm run dev`

## Development Workflow

### Branch Strategy

- `master` — production-ready code
- Feature branches: `feat/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`

### Before Submitting

Run the full check suite:

```bash
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint
npm run test        # Vitest
npm run build       # Production build
```

All four must pass before submitting a PR.

### Code Standards

- **TypeScript** — no `any` types; use proper interfaces
- **Component limit** — keep components under 250 lines; split into smaller files
- **Shared components** — reuse from `src/shared/` before creating new
- **Styling** — Tailwind CSS only; no inline styles except dynamic `style={}`
- **Naming** — PascalCase for components, camelCase for functions/variables
- **Files** — one component per file; match filename to export name

### File Structure Rules

```
src/
├── features/           # Feature-specific code
│   └── <feature>/
│       ├── components/ # Feature components
│       ├── pages/      # Route pages
│       ├── hooks/      # Feature hooks
│       └── services/   # API calls
├── shared/             # Cross-feature code
│   ├── components/     # Reusable components
│   ├── hooks/          # Reusable hooks
│   └── utils/          # Utility functions
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add lab card hover animation
fix: resolve navbar z-index overlap on mobile
docs: update README quick start section
refactor: extract useNavInvert hook
test: add ScenarioCard unit tests
```

### Pull Request Process

1. Create a descriptive PR title following commit conventions
2. Fill in the PR description with:
   - What changed and why
   - Screenshots/recordings for UI changes
   - Test coverage for new features
3. Request review from a maintainer
4. Address review feedback
5. Squash and merge

## Testing

- **Unit tests** — colocated in `__tests__/` directories
- **Framework** — Vitest with React Testing Library
- **Run tests** — `npm run test` or `npm run test:watch`
- **Mocking** — use `vi.mock()` for external dependencies

## Design System

Refer to `AGENTS.md` for the complete design system:

- Accent color: `#06B66F`
- Typography: JetBrains Mono
- Border radius: cards `rounded-2xl`, buttons `rounded-xl`, badges `rounded-lg`
- Button tiers: `btn-primary`, `btn-secondary`, `btn-danger`

## Reporting Issues

- Use GitHub Issues for bugs and feature requests
- Include reproduction steps for bugs
- Tag issues with appropriate labels

## Code of Conduct

Be respectful, inclusive, and constructive. We are building for the African cybersecurity community.
