# Changelog

All notable changes to `qyvora-frontend` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- Removed all card illustrations (numbered badges, DotMap backgrounds, radial patterns, cover images) from lab and course cards
- Reverted dashboard navbar color switching — StudentTopbar no longer uses `useNavInvert`
- ScenarioCard simplified: removed `index` and `accentColor` props

### Removed
- `LabIcons.tsx` — 10 SVG shield badge illustrations (771 lines, never imported)
- `AdinkraCardBg.tsx` — Adinkra symbol decorative backgrounds (never imported)
- `DotMapBackground.tsx` — Dot map component (no remaining consumers)

### Added
- Tests for `ScenarioCard`, `LabCard`, `useNavInvert` hook (26 new tests, 192 total)

### Documentation
- Consolidated docs: removed 12 redundant/stale files, merged content into living references
- Moved `QYVORA_TERMINAL_ENGINEERING_AUDIT.md` and `QYVORA_TERMINAL_SIMULATION_COMMANDS.md` to `docs/archive/`
- Fixed accent color (`#66B870` → `#06B66F`) in `docs/ARCHITECTURE.md`
- Fixed deployment info in root `README.md` (Vercel → Netlify)
- Updated route table in root `README.md` to match actual router
- Updated command counts from 114+ to ~149 across docs
- Added 10 bootcamp room polish items to `_ROADMAP.md` (from completed UI improvement audit)
- Bootcamp room features (keyboard nav, copy code, bookmarks, jump menu, report issue, timer, fullscreen) documented in `docs/BOOTCAMP.md`
- Captured mobile UX fixes, scrollbar overlay fix, and bootcamp curriculum corrections from deleted audit logs

## [0.1.0] - 2026-07-16

### Added
- Simulated terminal engine: ~149 commands, in-browser VFS, streaming output
- 10 attack labs: privesc, passwords, webapp, sqli, phishing, proxy, traffic, osint, wireless, killchain
- Hacker Protocol Bootcamp walkthrough system: 5 phases, 19 rooms, 4000+ lines of content
- Course lessons with code playground and quiz system
- 27 locale internationalization (strong African language coverage)
- Dashboard with stats, learning overview, progress tracking
- StudentTopbar with responsive navigation (desktop tabs + mobile hamburger)
- Marketplace and CP token integration
- PWA support with install banner and service worker
- Dark theme with accent color `#06B66F`
- Custom SVG icon library (45+ icons)
- ScrollReveal animations, GSAP integration
- Public profile pages with handle-based routing
- News feed system
- Event management with Google Meet integration
- Admin dashboard
- SEO with react-helmet-async
- Error boundary with scope-based error capture
- Consent banner for storage preferences
- Community popup
- Promotional system

### Security
- JWT httpOnly cookies with CSRF double-submit pattern
- Access token stored in-memory only (never localStorage)
- DOMPurify for HTML sanitization
- CSP headers via Netlify configuration
- XSS protection headers

## [0.0.1] - 2026-06-01

### Added
- Initial project scaffold with React 19, Vite 6, Tailwind CSS v4
- Routing with React Router 6
- Authentication context and protected routes
- API client with Axios interceptors
