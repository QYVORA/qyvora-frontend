# QYVORA Frontend — Known Issues

Deliberately short: only issues that are **currently open** and that a developer should know before touching related code. Items carried over from `docs/USER_FLOW_AUDIT.md` (deleted) after reconciliation against current code.

---

## 1. 2FA toggle works but is not enforced at login

**Location:** backend `src/modules/auth/services/auth.service.ts:499` (`// 2FA is currently disabled.`)

**Status:** OPEN — half-implemented.

The full 2FA surface exists: settings toggle (`SettingsPage.tsx` → `POST /auth/2fa/enable|disable`), TOTP secret + backup codes on `User`, `POST /auth/2fa/verify`, and a short-lived `type: '2fa'` JWT (`issue2FAToken`, `JWT_2FA_EXPIRY` default 5m). But the **login flow never requires it** — a user with 2FA enabled signs in with password only. The 2FA-enforced login branch is never reached.

**Fix direction:** in the login path, after password validation, if `user.twoFactorEnabled` is true, return the 2FA challenge (short-lived 2FA token) instead of access/refresh tokens; add a verify step that exchanges the 2FA token for the real tokens. Coordinate with the frontend login flow.

---

## 2. Leaderboard capped at top 50, no pagination

**Location:** `src/features/marketing/pages/public/LeaderboardPage.tsx:25` (`limit: 50`); landing section `LandingLeaderboardSection.tsx:68` (`limit=40`).

**Status:** OPEN (Low).

Users below rank 50 are unreachable. Backend accepts a `limit`; frontend never paginates or links to a fuller view.

**Fix direction:** add paging (e.g. "Load more" / offset) or a full leaderboard view, keeping the top-50 on the landing section.

---

## 3. Lab "VM" is simulated, but the connection lifecycle is backend-tracked

**Location:** `src/features/student/hooks/useLabConnection.ts` → `POST /student/labs/connect`, `POST /disconnect`, `PUT /progress`, `GET /student/labs/connections`.

**Status:** design decision — documented for clarity, not a bug.

The connection (connectionId/targetIp/expiresAt/commandsRun/chaptersCompleted) is a real backend-tracked session, but there is **no actual remote VM** — commands execute against the client-side simulated filesystem (`TerminalShell`). This is intentional for the current product. If a real sandbox is ever added, the `LabConnectionState` contract is the integration point.

---

## Historical note

The Aug-2026 `USER_FLOW_AUDIT.md` and `AUDIT_FIXES_CHANGELOG.md` findings (dead ContactPage/LoginForm/BlogsPage duplicates, orphaned ChainExplorer, `/events` 404, `SimulatedTerminal` merge, notification filters, lesson `?lesson=` param, hardcoded bootcamp ID, etc.) are **all resolved** — verified against current code and removed from the repo. See `docs/HANDOFF_AUDIT.md` Phase 1 for the evidence.
