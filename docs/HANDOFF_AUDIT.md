# QYVORA Frontend — Handoff Audit

Cross-repo developer-handoff audit. One doc per repo; phases accumulate here. Repo audited: **qyvora-frontend**.

---

## Phase 1 — Repo Hygiene Cleanup

Date: 2026-08-15 · Status: **EXECUTED ✅** (all items in the approved batch done; changes left uncommitted for review)

### Verdict table

| File / folder | Verdict | Reason |
|---|---|---|
| `continue_AI.sh` | **n/a** | None exists in this repo (checked). |
| `dist/` | **keep as-is** | Not tracked in git (0 files), already in `.gitignore`. |
| `UNUSED_IMAGES_AUDIT.md` | **delete** | Self-marked **COMPLETED** (2026-08-14). Pure record of 3 deleted images + OG-image swap. No lasting value. |
| `docs/USER_FLOW_AUDIT.md` | **fold → delete** | 2026-08-08 audit of user flows, explicitly "Audit-only — no code was changed" at the time. The subsequent `AUDIT_FIXES_CHANGELOG.md` shows the frontend findings were all implemented (verified: ContactPage gone, LoginForm gone, BlogsPage duplicate gone, ChainExplorer tree gone, `/events` nav+route gone, SimulatedTerminal merged into TerminalShell behind TerminalWrapper). Remaining open items are backend-context (2FA stub, leaderboard cap) or design decisions (labs VM simulation) — fold those into `KNOWN_ISSUES.md`, then delete. |
| `docs/LEARNING_UI_AUDIT.md` | **delete** | 2026-07-25 audit + **proposed** shared-component migration plan. The migration was subsequently implemented (verified: `TerminalWrapper` unifies all 3 terminal surfaces, shared `StepNotes`/`InlineQuiz`, `StudentHeroSection` used by Labs, `BootcampRoomPage` rewritten 1116→354 lines). Superseded; component architecture now lives in `COMPONENT_ARCHITECTURE.md` / `ARCHITECTURE.md`. |
| `docs/AUDIT_FIXES_CHANGELOG.md` | **delete** | 2026-08-09 implementation log of the USER_FLOW_AUDIT fixes (Phases 1–12, each "Verified — lint/typecheck/test pass"). No open items (its "Deferred"/"New findings" sections are empty placeholders). Archival only. |
| `docs/_ROADMAP.md` vs `ROADMAP.md` | **merge → delete one** *(needs your input)* | **Not duplicates.** `docs/_ROADMAP.md` (Jul 24) = living feature inventory/status tracker (~30 implemented + ~40 planned/future, priority schedule). `ROADMAP.md` (Jul 31, "Live · 170+ users") = tactical product strategy (retention loop, shareable credentials, drop-off analytics, cohort automation, B2B track, guiding principles). They conflict (e.g. streak counter listed implemented vs planned) and each misses the other's content. **Proposal**: merge into root `ROADMAP.md` as canonical (newer strategic doc), fold in `_ROADMAP.md`'s feature inventory + priority schedule, delete `docs/_ROADMAP.md`. Confirming since it's a judgment call. |
| `docs/` permanent docs (ARCHITECTURE, COMPONENT_ARCHITECTURE, ROUTING, etc.) | **keep** | Phase 4 accuracy pass will update these. |

### Notes
- All 6 dead-code candidates from past audits are **confirmed dead AND removed** in current code (evidence gathered, details in Phase 2 report). No deletions needed on that front.
- Root `dev.sh` / `test.sh` are legitimate scripts — kept, documented at root level (Phase 4).

### Proposed Phase 1 execution batch (frontend only)
1. Delete `UNUSED_IMAGES_AUDIT.md`, `docs/LEARNING_UI_AUDIT.md`, `docs/AUDIT_FIXES_CHANGELOG.md`.
2. Create `KNOWN_ISSUES.md` (fold USER_FLOW_AUDIT open items: 2FA stub, leaderboard cap, labs VM simulation); delete `docs/USER_FLOW_AUDIT.md`.
3. Merge `docs/_ROADMAP.md` into root `ROADMAP.md`; delete `docs/_ROADMAP.md` *(pending your input)*.

---

## Phase 2 — Dead Code Audit

Date: 2026-08-15 · Status: **EXECUTED ✅** (all approved deletions done; changes left uncommitted for review. Re-verified: lint clean, 178/178 tests pass, typecheck clean except a pre-existing `App.tsx` error — `BrowserRouter` `future` prop no longer exists in react-router v7.18, unrelated to this batch.)

### 2A. i18n resources

| Item | Verdict | Evidence |
|---|---|---|
| `locales/ar.json`, `de.json`, `es.json`, `fr.json`, `hi.json`, `ja.json`, `pt.json`, `ru.json`, `zh.json` | **delete (9 files)** | Not registered in `src/i18n/index.ts` `localeModules` (only 17 loaded: ha, yo, ig, ak, ee, ff, wo, bm, gaa, sw, am, so, ti, zu, xh, sn, ln) and absent from `LANGUAGES`. Never imported, never loadable at runtime. |
| 917 of 2010 `en.json` keys | **flag, no delete** | Orphaned — no literal/static `t()` call or template-shape match anywhere in `src`. Breakdown: student 267, components 100, landing 99, admin 59, quiterootPage 53, button 44, servicesPage 23, leaderboardPage 23, coursesPage 23, toast 20, heading 20, rest <20. Left intact: they are cheap and may be used by community-contributed translations. |
| ~402 keys missing per African locale (17 loaded) | **flag, no delete** | Each loaded locale is missing ~402 used keys (falls back to English). Not a deletion item — translation debt for later. |
| ~537 keys missing per unregistered locale (9) | **flag** | Same as above; moot if the 9 files are deleted. |

### 2B. Zero-reference files (all verified: zero import references, zero symbol usage)

| File | Verdict | Evidence |
|---|---|---|
| `features/auth/components/RegisterForm.tsx` | **delete** | `RegisterPage` imports only React + `useNavigate`; no other importer. |
| `features/student/components/BootcampCard.tsx` | **delete** | Only `StudentBootcampCard` is used (DashboardPage, ActiveDeployments); `BootcampCard` has zero references. |
| `features/student/components/CourseAvatar.tsx` | **delete** | Zero references. |
| `features/student/components/bootcamp-course/CourseHeader.tsx` | **delete** | Zero references. |
| `features/student/components/lab/LabConnectButton.tsx` | **delete** | WalkthroughLayout drives lab connection via `useLabConnection` hook directly. |
| `features/student/components/layout/StudentTopbar/ToolsDropdown.tsx` | **delete** | Zero references. |
| `features/student/components/layout/StudentTopbar/mobileNav.ts` | **delete** | Zero references. |
| `shared/components/FeatureMarquee.tsx` | **delete** | Zero references. |
| `shared/components/ScenarioDiagrams.ts` | **delete** | Zero references. |
| `shared/components/ui/NavCard.tsx` | **delete** | Not re-exported by `ui/index.ts`; zero references. |
| `shared/components/ui/CodeBlock.tsx` | **delete** | Blog `CodeBlock` is a local `./shared` component; `CodeBlockRenderer` (courses/) is the live one; `ui/CodeBlock` has zero importers and is not in the `ui` barrel. |
| `shared/components/blog/InlineDiagram.tsx` | **delete** | Blog pages use their own `shared.tsx` `InlineDiagram`; this file has zero importers. |
| `shared/components/blog/index.ts` | **delete** | Dead barrel. Note: `blog/Terminal.tsx`, `blog/OutputBlock.tsx`, `blog/IdeBlock.tsx` are **live** (imported by `BlogsPage/shared.tsx`) — keep them, only the barrel + `InlineDiagram` go. |
| `shared/components/diagrams/CommandFlowDiagram.tsx` | **delete** | Zero importers (only its own dead barrel). |
| `shared/components/diagrams/index.ts` | **delete** | Dead barrel. Note: `diagrams/FlowDiagram.tsx` + `diagrams/KillChainDiagram.tsx` are **live** (labs) — keep. |
| `shared/components/dobia/index.ts` | **delete** | Dead barrel only; subcomponents ARE used by `shared/components/Dobia.tsx`. |
| `shared/components/hpb/index.ts` | **delete** | Dead barrel only; subcomponents ARE used by `shared/components/HpbAvatar.tsx`. |
| `shared/components/profile/ProfileSectionNav.tsx` | **delete** | Zero references. |
| `shared/components/profile/ProfileStatCard.tsx` | **delete** | Zero references. |
| `shared/components/profile/SkillsModule.tsx` | **delete** | Zero references. |
| `shared/layouts/BlogsLayout.tsx` | **delete** | Zero references. |
| `features/marketing/components/hacker-globe/types.ts` | **delete** | Zero importers (globe chain is HackerGlobe → helpers.ts → data.ts/countries.ts + useFluidGlobe.ts, all live; types.ts unused). |

### 2C. Clean results
- **Commented-out dead code**: none. All `//` and `/* */` comments are JSDoc or JSX layout comments (verified across all 3 repos).
- **Orphaned CSS/Tailwind classes**: none found (`shared/styles/index.css` tokens all referenced).
- **False positives cleared**: `CodeBlock.tsx` (live = `CodeBlockRenderer`, separate file), `BootcampCard` (live = `StudentBootcampCard`), `hacker-globe/types.ts` (nothing else in that folder is dead).

### Proposed Phase 2 execution batch (frontend only)
1. Delete the 9 unregistered locale files.
2. Delete the 22 zero-reference files listed in 2B.
3. Re-verify with `npm run typecheck` + `npm run lint` + `npm test` *(pending your approval)*.

---

## Phase 3 — Structure & Component-Size Audit

Date: 2026-08-16 · Status: **REPORT ONLY** (no changes — refactor candidates for later, nothing deleted)

### 3A. Oversized files

**Logic/components (refactor candidates, >500 lines):**

| File | Lines | Note |
|---|---|---|
| `features/student/pages/DashboardPage/index.tsx` | 763 | Single-file page despite `pages/DashboardPage/` folder convention (no extracted subcomponents). Largest page. |
| `features/student/components/layout/Sidebar.tsx` | 663 | 14 internal sub-components (`SidebarPanel`, `CoursesListPanel`, `RightRailSection`, …) — extract to a folder. |
| `features/student/components/SimulatedTerminal/TerminalShell.tsx` | 638 | Core terminal shell; handlers already split into `engine/handlers/*`. |
| `features/student/components/tools/Ide.tsx` | 635 | Tool component. |
| `features/student/components/tools/NetworkBuilder.tsx` | 606 | Tool component. |
| `features/student/pages/SettingsPage.tsx` | 596 | 8 internal components — split candidate. |
| `features/student/components/layout/StudentTopbar/StudentTopbar.tsx` | 540 | Topbar; already a folder but single file. |
| `features/student/components/SimulatedTerminal/engine/handlers/network.ts` | 560 | Domain logic; legitimately large. |
| `features/student/components/SimulatedTerminal/engine/handlers/security.ts` | 510 | Domain logic; legitimately large. |

**Large but legitimate (content/data/SVG — not refactor candidates):**
`bootcampConfig.ts` (4116), `helpTexts.ts` (1933), `privesc-scenarios.ts` (1367), `SimulatedTerminal/engine/handlers/files.ts` (1043), course data (`linux-terminal-101` 903, `python-for-hackers-101` 891, …), avatar SVGs (563–701), `simulations/*-data.ts`.

**Other notable (>350):** `prerender.tsx` (753, build prerender script — fine), `router.tsx` (393, route config), `core/services/api.ts` (366, axios layer), `CodeBlockRenderer.tsx` (375), `SpotlightTour.tsx` (359), `Navbar.tsx` (356), `topicMap.ts` (361, content).

### 3B. Dependency direction (the real structural finding)

**`shared/` imports from `features/` (inverted dependency) — 9 files:**

| `shared/` file | Imports from |
|---|---|
| `shared/seo/schema.ts` | `@/features/marketing/content/siteConfig`, `servicesConfig` |
| `shared/components/PublicSnapLayout.tsx` | `LandingFinalCtaSection` (marketing) |
| `shared/components/backgrounds/GridBoxedBackground.tsx` | `HeroGridAnimation` (marketing) |
| `shared/components/layout/PublicBottomNav.tsx`, `Footer.tsx`, `Navbar.tsx` | `ContactTrigger` (marketing) + `SITE_CONFIG` |
| `shared/components/layout/AuthFormLayout.tsx` | `AuthHero` (auth) |
| `shared/components/CourseIconBackground.tsx`, `CoursePurchaseModal.tsx` | `features/student/data/courses` |
| `shared/components/learning/TerminalWrapper.tsx` | `TerminalShell` (student) |
| `shared/components/walkthrough/WalkthroughLayout.tsx` | `useLabConnection`, `SimulationPanel`, `useSimulation` (student) |

`shared` components are genuinely shared-across-features here (marketing + student both use them); the coupling is real but pragmatic. Moving the underlying primitives up is a large refactor — **flag for a dedicated refactor phase, not this one.**

**Cross-feature coupling (feature → other feature):**
- `marketing → student` (7 files): course/bootcamp **data** + tool **components** (`Ide`, `NetworkBuilder`, `DeviceShape`, `SimulationProvider`) reused by public marketing pages. These resources are domain-shared but live under `features/student` — candidate for promotion to `shared/`.
- `admin → student`: `AdminDashboardPage.tsx:21` imports `LearningOverviewCard` (student). Single reach-in.
- **Cleared (not a violation):** `AdminTopbar/AdminTopbar.tsx` imports `NotificationsDropdown`/`MobileNotificationsSheet` from its own folder — earlier suspected cross-feature reach-in is fine.

### 3C. Conventions — status
- **Feature folders** (`features/<domain>/{components,pages,hooks,services,data,constants,utils}`): consistent. Labs and tools pages follow `pages/<Name>/index.tsx` folder pattern; standalone pages are `PascalCase.tsx`.
- **Naming**: no lowercase-component or PascalCase-hook violations found; `index.tsx` folder files are the only lowercase `.tsx` (standard).
- **`core/` is clean** — no `core → features` imports.
- Backend + chain structures were clean (see per-repo Phase 3 below).

### Proposed Phase 3 actions
None required — this is a report-only phase. Recommended backlog (for a future dedicated refactor):
1. Split `DashboardPage/index.tsx` (763) into subcomponents.
2. Extract `Sidebar.tsx`'s 14 internal components into `components/layout/Sidebar/` folder.
3. Promote the shared course/simulation primitives (`features/student/data/courses`, `Ide`, `NetworkBuilder`, `SimulationProvider`, bootcampConfig) to `shared/` to kill the `shared → features` and `marketing → student` coupling.
4. Remove the `future` prop from `App.tsx:90` (react-router v7) — pre-existing typecheck failure, unrelated to Phase 2.

---

## Phase 4 — Docs Accuracy Audit

Date: 2026-08-16 · Status: **EXECUTED** (approved 2026-08-16; doc fixes applied)

### Findings (doc claim → code truth)

| Doc | Claim | Truth | Severity |
|---|---|---|---|
| `docs/ARCHITECTURE.md:145` | "`tokenBalance.service.ts` in `features/student/` calls `VITE_CHAIN_API_BASE_URL/token/balance/:userId` directly" | Both are gone. `features/student/services/` = `lab.service.ts` + `pwa.ts` only; balance comes from `GET /api/cp/balance` (backend). | **STALE** |
| `docs/ARCHITECTURE.md:792,795-796` | Same `tokenBalance.service.ts` / `VITE_CHAIN_API_BASE_URL` in the "Current" + "Files involved" section | Same as above. | **STALE** |
| `docs/COMPONENT_ARCHITECTURE.md:110` | `card-grid/` "CardGrid layout wrapper" | Removed (AGENTS.md: "Removed Components — CardGrid"). | **STALE** |
| `docs/COMPONENT_ARCHITECTURE.md:143` | services tree includes `tokenBalance` | Not present. | **STALE** |
| `docs/API_INTEGRATION.md:101-102` | Service Files table lists `chain.service` + `tokenBalance` | Neither exists; actual = `lab.service`, `pwa`. | **STALE** |
| `docs/SIMULATIONS.md:46` | File table lists `SimulatedTerminal.tsx` ("Radix Dialog wrapper") | No such file — folder exports `TerminalShell` via `index.ts`; wrapper = shared `TerminalWrapper.tsx`. (`engine/handlers` now 10 files vs "7 modules" — minor.) | **STALE** |
| `ROADMAP.md` | — | Correctly marks Chain Explorer **removed** ✓ | OK |
| `docs/ROUTING.md` | — | No stale/removed routes ✓ | OK |
| `docs/` (24 files) | — | No other references to deleted components/pages found | OK |

### Proposed Phase 4 fixes (frontend only)
1. ARCHITECTURE.md: replace the `tokenBalance`/`VITE_CHAIN_API_BASE_URL` passages with the actual flow (frontend → `GET /api/cp/balance` → backend cpLedger/chain-outbox → chain).
2. COMPONENT_ARCHITECTURE.md: remove the `card-grid/` row + the `tokenBalance` services-tree entry.
3. API_INTEGRATION.md: fix the Service Files table (remove `chain.service`, `tokenBalance`; keep `lab.service`, `pwa`).
4. SIMULATIONS.md: replace the `SimulatedTerminal.tsx` row with the current structure (folder `index.ts` → `TerminalShell`; shared `TerminalWrapper`); update handler count.

**Applied 2026-08-16:** all 4 fixes executed. Also fixed extra staleness found during the sweep: README.md tree (LoginForm/RegisterForm/mobileNav/CourseHeader/BootcampCard/BlogsLayout rows removed, hacker-globe example de-typed), BlogsLayout + NavCard rows in ARCHITECTURE/COMPONENT_ARCHITECTURE, SIMULATIONS.md dependency map (SimulatedTerminal→TerminalShell, LabConnectButton removed), LEARNING_PATHS.md dead `mobileNav.ts` row, chain-explorer references in ARCHITECTURE, and §9.10 marked resolved.

## Phase 5 — Security Audit + npm audit

Status: **AUDITED** (2026-08-16) — no blocking findings.

**Dependency audit:** `npm audit` = **0 vulnerabilities**. No action needed.

**Verified strong:**
- No secrets: only `.env.example` tracked; `.env` gitignored; no high-signal secret patterns (private keys, API tokens) in tracked files.
- Security headers in `netlify.toml`: HSTS `max-age=31536000; includeSubDomains; preload`, `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, strict CSP (`default-src 'self'; script-src 'self'; frame-ancestors 'none'`...). No inline scripts, no third-party CDN scripts.

**Findings:**

| # | Location | Finding | Severity |
|---|---|---|---|
| 1 | `netlify.toml` CSP | `style-src 'unsafe-inline' https:` + `img/font/connect https:` allowed — required for Tailwind/themes and external assets; acceptable. | INFO |
| 2 | — | No other security findings. | — |

### Proposed Phase 5 fixes (frontend)
None required.
