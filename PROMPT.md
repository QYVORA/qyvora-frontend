# QYVORA Frontend — Execution Prompt: Credential Verification, QOSE Labs, Leaderboard Pagination

**Document ID:** QYVORA-EXEC-2026-10-14
**Prepared for:** OpenCode (execution agent)
**Repository:** `qyvora-frontend` (this repo). Secondary, only where stated: `qyvora-backend`, `qyvora-docs`.
**Date:** 2026-10-14
**Priority:** High — items sit on the October execution checklist with a Fri 16 Oct credential gate and a Sat 17 Oct Month-1 gate.
**Supersedes:** the previous `PROMPT.md` (profile-system redesign). That work is preserved in git history if it is ever needed again; this file is the current execution prompt.

---

## 0. Mission

Implement the three open product items on the October CEO action checklist:

| ID | Task |
|---|---|
| `EX-CERT-006` | Continue the public `/verify/<credential-id>` page. |
| `EX-BC-005` | Define and build the QOSE lab set — ethical-hacking and web/app labs, each mapped to a module. |
| `EX-PRD-004` | Leaderboard pagination beyond 50 entries; prerender `/nzinga`. |

Each task below states **WHAT / HOW / DONE WHEN / HOW TO VERIFY** exactly as the checklist defines it. Implement all three in this repo; only touch other repos where a task explicitly requires it.

## 1. Mandatory execution rules

1. **Inspect before you change.** Read the current implementation of every file named below before editing. Do not assume an older layout.
2. **Extend, do not fork.** Reuse the existing services, hooks, components, design tokens, and route wiring. Do not create a competing implementation of something that already exists.
3. **Never fabricate.** No invented backend endpoints, database fields, credential records, lab flags, user counts, or "live" claims. If a capability is missing, implement it for real or document the dependency. The credential page must never output a locally-invented record.
4. **Keep responses truthful in the UI.** A credential the API does not return is `not-found`; an unreachable API is `error`; neither may render a fake certificate.
5. **Real files, real tests.** Run the checks in §5 and make them pass. Do not stop at a design proposal.
6. **Preserve working behaviour.** Do not regress existing routes, tests, or the certificate/lab CP logic.
7. **Follow the house style** in §4.

---

## 2. Task A — `EX-CERT-006`: Continue the `/verify` page

**WHAT:** the public `/verify/<credential-id>` page, so a visitor can check a credential without trusting a PDF.
**HOW:** continue the frontend page wired to the live verify API.
**DONE WHEN:** the page is complete and ready to deploy.
**HOW TO VERIFY:** the route renders and calls the API.

### Current state (verify this first)
- Page: `src/features/marketing/pages/public/VerifyPage.tsx` — form, "how it works", and five result states (`invalid`, `checking`, `error`, `not-found`, `revoked`, `valid`) are already built.
- Service: `src/core/services/credentialVerification.ts` — `verifyCredential()`, `normalizeCredentialId()`, types; API-only, no local fallback (a demo fallback was deliberately removed in commit `6a6d3435`).
- Related: `src/core/services/credentials.ts`, `src/core/services/credentialVerification.ts`, `src/core/services/__tests__/credentialVerification.test.ts`, `src/core/services/__tests__/credentials.test.ts`.
- Routes: `src/app/router.tsx` — `/verify` and `/verify/:credentialId`.
- Certificate preview: `src/shared/components/certificates/CertificateFrame.tsx`.
- API contract (public, no auth): `GET /api/credentials/verify/:credentialId` → `{ success, valid, credential: { recipientName, programName, cohortIdentifier, completionDate, result, issuedAt, status, bootcampId, chainVerified, blockIndex } }`. A `404` means "no such credential".
- Status: **code complete, not yet live** (commits `6a6d3435`, `53ab4f1`). The Fri 16 Oct gate is about it being finish-ready and, separately, deployed.

### Do this
1. Re-read the page and service against the checklist wording. Confirm every state renders correctly and that the API is called with the normalised ID.
2. Close the remaining gaps to "ready to deploy":
   - Confirm the API base URL / client (`src/core/services/api`) is the live configuration for production and that no mock/interceptor intercepts the verify route.
   - Confirm SEO is correct: `noindex` (a verification result page should not be indexed), with an accurate title and description.
   - Confirm the credential ID shown in the certificate footer and any "verify at …" copy matches this route (`/verify/<id>`), and that the link is discoverable where credentials are described.
   - Confirm the `CertificateFrame` renders read-only for both `QOSE` and `HPB` programs and never renders for a non-`valid` result.
   - Confirm accessibility: label/`aria-describedby`, `role="status"` + `aria-live`, keyboard submit, focus behaviour.
   - Confirm `normalizeCredentialId()` accepts a bare ID, whitespace/newlines, and a full `https://qyvora.org/verify/<id>` URL, and rejects malformed input.
3. Ensure the tests cover all five states and the URL/normalisation paths. Add cases for: a full URL pasted, uppercase/mixed-case ID, a 404 → `not-found`, a network failure → `error`, a `REVOKED`/`SUSPENDED` status → `revoked`, and `chainVerified` true/false branching.
4. If you cannot test against a real issued credential ID, say so explicitly in the completion note — do not invent one. Use the documented demo IDs in `credentialVerification.ts` only as unchecked fixtures, never as real results.

### Do not
- Do not re-introduce any client-side demo/fallback record.
- Do not claim third-party or "certified" verification in copy. Say the credential is checked against the issuing registry and its qyvora-chain anchor.

---

## 3. Task B — `EX-BC-005`: Define and build the QOSE lab set

**WHAT:** the hands-on lab exercises for the bootcamp, each tied to a specific module.
**HOW:** define the per-module labs (ethical hacking + web/app), then build and self-test them.
**DONE WHEN:** the lab-to-module matrix is complete and the labs run.
**HOW TO VERIFY:** open the matrix and run one lab.

### Where labs live today
- Registry: `src/features/student/constants/labs.ts` (`LABS`, `LABS_IDS`) — currently five labs: `privesc`, `passwords`, `sqli`, `osint`, `killchain`, routed at `/dashboard/labs/*`.
- Pages: `src/features/student/pages/labs/{LabsPage,PrivescLab,PasswordLab,SqlInjectionLab,OsintLab,KillChainLab}`.
- Scenario/exercise data: `src/features/student/data/simulations/{privesc-scenarios.ts, password-exercises.ts, sql-injection-data.ts, osint-data.ts, kill-chain-data.ts, types.ts, index.ts}`.
- Interactive components: `src/features/student/components/simulations/*` (OsintDashboard, ApiExplorer, SqlConsole, TimelineInvestigation, labSimulations, networkProfiles).
- Flag verification (server-side only): `src/features/student/services/lab.service.ts` → `POST /api/student/labs/verify-flag` (`{ labId, scenarioId, flag }`). Backend: `qyvora-backend/src/modules/student/controllers/lab.controller.ts`, `.../routes/student.routes.ts`, `labFlagSchema`. **Flag values must never appear in the client bundle.**
- Progress: `src/features/student/utils/labProgress.ts` (localStorage `qyvora_lab_progress`); access: `src/features/student/hooks/useLabAccess.ts`.
- Curricula to map against (docs repo):
  - `07-products/qose/curriculum/QOSE-3-MONTH-CURRICULUM.md` — modules `QOSE-M01`…`QOSE-M12` (Month 1 offensive ops; Month 2 infra/enterprise; Month 3 enterprise offensive engineering).
  - `07-products/qose/plans/QOSE-MASTER-PLAN.md` — lab taxonomy (Web Labs, API Labs, Database Labs, Misc Labs, AD Lab) and the Kali + VM + containerized lab environment.
  - `07-products/qose/curriculum/grading-rubric.md` and `07-products/qose/packages/week-*/` — assessment/production shape.

### Do this
1. **Define the matrix.** Produce a `lab → module` matrix covering `QOSE-M01`…`QOSE-M12`, classifying each lab (ethical hacking vs web/app; and where relevant API/database/AD). Identify which modules already have cover from the five existing labs and which are uncovered.
2. **Add the missing labs** with a web/app focus, following the existing data-driven pattern (scenario objects consumed by a lab page + simulation component). Each lab must have: id, module mapping, objectives, step-by-step scenarios, hints, at least one verifiable flag (server-side), and a CP reward consistent with `constants/labs.ts`.
3. **Register** each new lab in `constants/labs.ts`, add its route in `src/app/router.tsx`, and add its scenarios to `data/simulations/`.
4. **Backend flags.** For each new flag, add the server-side flag definition (never client-side). Update `lab.controller.ts`/schema as needed and extend the backend tests. If a flag cannot be added server-side in this change, mark the lab explicitly as not-yet-scorable rather than shipping a client-side secret.
5. **Self-test.** Run the lab data tests (`data/simulations/__tests__/*`) and add tests for each new lab's data integrity (every step reachable, every flag defined server-side, unique ids). Run `useLabScenario`/progress paths.
6. **Matrix deliverable.** Write the completed lab-to-module matrix as tracked content — a data module in this repo (e.g. `src/features/student/data/labs/lab-module-matrix.ts`) and a matching Markdown table in the docs repo under `07-products/qose/curriculum/`. Keep the two in sync; state clearly which is the source of truth.

### Do not
- Do not expose flag values in the client.
- Do not invent curriculum modules — use the real `QOSE-M01`…`M12` set.
- Do not touch bootcamp logo assets, the bootcamp badge system, or bootcamp completion behaviour.

---

## 4. Task C — `EX-PRD-004`: Leaderboard pagination + prerender `/nzinga`

**WHAT:** the leaderboard must page beyond 50 entries, and `/nzinga` must be prerendered.
**HOW:** add pagination to the leaderboard; prerender the route.
**DONE WHEN:** more than 50 entries page correctly and `/nzinga` is prerendered.
**HOW TO VERIFY:** load a leaderboard with over 50 rows and check the `/nzinga` build output.

### Current state (verify this first)
- Page: `src/features/marketing/pages/public/LeaderboardPage.tsx` — fetches with `limit: 50`, shows a top-3 podium and a `LeaderboardRestSection` that paginates **only within the fetched 50** via `BatchPagination` (`BATCH_SIZE = 5`). The hook's `loadMore`/`hasMore`/`loadingMore` are **not wired**, so more than 50 entries can never appear.
- Hook: `src/shared/components/leaderboard/useLeaderboard.ts` — already supports `limit`, `offset`, `loadMore`, `hasMore`, `total`. API: `GET /api/public/leaderboard?period=&limit=&offset=&cohortId=`.
- Components: `src/shared/components/leaderboard/*` (`LeaderboardRow`, `PodiumCard`, types, `PERIODS`), and `BatchPagination` from `src/shared/components/ui`.
- Prerender: `src/prerender.tsx` + `vite.config.ts`. `/nzinga` is already in the prerender route list and `dist/nzinga/index.html` is produced by `npm run build`.

### Do this
1. **Leaderboard pagination beyond 50.** Wire real pagination so the page can display more than 50 operators, end to end:
   - Either append batches via `loadMore` (`mode: 'append'`) with a "Load more" control bound to `hasMore`/`loadingMore`, or add numbered pages that fetch by `offset`.
   - Keep the top-3 podium correct across pages, keep rank numbers correct, and keep the cohort/period filters working (changing either must reset to page 1/offset 0).
   - Handle the empty, loading, error, and end-of-list states cleanly.
   - Confirm the backend honours `offset` (it does in `public.controller.ts`) and that `total` drives the controls.
2. **Prerender `/nzinga`.** Confirm the build emits `dist/nzinga/index.html` with prerendered body + head. If any part is missing or stale (wrong title/description, no body, missing from `vite.config.ts`), fix it so the tool route is fully prerendered.
3. Add tests: leaderboard pagination logic (reset on filter change, append batch, `hasMore`/`total` maths) and, where feasible, a prerender assertion for `/nzinga`.

### Do not
- **Do not edit the Nzinga tool.** `prerender /nzinga` is a frontend build concern only. The Go framework (`products/QYVORA-AI/frameworks/qyvora-nzinga`) does not need changes — leave it untouched.

---

## 5. Verification (run all, per the repo)

```
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run test           # vitest run
npm run build          # vite build — also exercises the prerender plugin
```

After `npm run build`, verify `dist/nzinga/index.html` exists and contains prerendered content. If any command fails because of a pre-existing, unrelated flake, note it explicitly rather than silently ignoring it.

## 6. House style and constraints

- **Brand tokens only.** Dark-first; accent is the single green `#06B66F`; canvas `#0b0d0e`, card `#050505`, text `#EEF0EE`. Tokens live in `src/styles/index.css` (Tailwind v4, no `tailwind.config.*`). Fonts: Space Grotesk (display) + JetBrains Mono (body/mono). Logo is the inline `QyvoraMark`/`QyvoraLogotype` SVG — never redraw it.
- **No new design system.** Reuse existing UI primitives (`Button`, `Input`, `Card`, `InlineAlert`, `Skeleton`, `EmptyState`, `ErrorState`, `BatchPagination`, `PageHeader`, `PublicContainer`).
- **Tone.** Beginner-friendly, honest about what is built vs planned. Never claim "certified"/"certification" (use "credential"), never claim the platform has users it does not, never treat QOSE as launched (launch is planned for 1 Nov 2026), never invent milestones.
- Keep diffs focused; do not reformat unrelated files.

## 7. Definition of done (all three)

- `EX-CERT-006`: `/verify` renders and calls the live API for all states; build and tests pass; ready to deploy (deployment is a separate gate).
- `EX-BC-005`: lab-to-module matrix complete and in sync (code + docs); new modules' labs built, flagged server-side, and self-tested.
- `EX-PRD-004`: leaderboard pages beyond 50 entries; `/nzinga` prerenders to real HTML.
- `npm run typecheck && npm run lint && npm run test && npm run build` all pass.

## 8. When done

Report per task: files changed, the matrix produced, the exact verification commands and results, and anything left open or blocked (e.g. real credential ID unavailable, backend flag work outstanding). Commit with clear messages (one logical change per commit); do not push unless instructed.
