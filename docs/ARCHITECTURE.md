# QYVORA Architecture

> **Status:** Approved · **Last updated:** 2026-07-04
> **Scope:** qyvora-frontend, qyvora-backend, qyvora-chain
> **Audience:** Senior engineers maintaining or extending the QYVORA platform
> **Authority:** This document is the single source of truth for architectural decisions. Future implementations must follow these rules. If code conflicts with this document, the code is wrong unless a deviation is explicitly documented below.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [System Overview](#2-system-overview)
3. [Service Boundaries and Responsibilities](#3-service-boundaries-and-responsibilities)
4. [Data Flow](#4-data-flow)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Chain Architecture](#7-chain-architecture)
8. [Cross-Cutting Security Architecture](#8-cross-cutting-security-architecture)
9. [Deviations from Intended Architecture](#9-deviations-from-intended-architecture)
10. [Technical Debt Register](#10-technical-debt-register)
11. [Future Considerations](#11-future-considerations)

---

## 1. Purpose

QYVORA is an African offensive security training platform. The platform consists of three independently deployable services that together deliver a bootcamp-based learning experience with a CP (Cyber Points) token economy on an immutable ledger.

This document defines the intended architecture of all three services, documents where the current implementation deviates, and provides enforceable rules for future development.

**Related documents:**
- `ARCHITECTURE_BOUNDARIES.md` — Hardening status, service boundary rules, and accepted exclusions
- `DATA_FLOW.md` — Mermaid diagram of request/response flow across all three services
- `QYVORA_ENGINEERING_ARCHITECTURE_SECURITY_REVIEW.md` — Full security and architecture review with scores

---

## 2. System Overview

### 2.1 Service Topology

```
┌──────────────┐     HTTP      ┌──────────────┐     HMAC      ┌──────────────┐
│  qyvora-     │  ──────────►  │  qyvora-     │  ──────────►  │  qyvora-     │
│  frontend    │  Axios + JWT  │  backend     │  signed POST  │  chain       │
│              │  ◄──────────  │              │  ◄──────────  │              │
│  React 19    │     JSON      │  Express 4   │    blocks     │  PoA Ledger  │
│  Vite 6      │               │  Mongoose    │               │  SHA-256     │
└──────────────┘               └──────┬───────┘               └──────────────┘
                                      │
                                      │ Mongoose
                                      ▼
                               ┌──────────────┐
                               │   MongoDB    │
                               └──────────────┘
```

### 2.2 Service Responsibilities

| Service | Role | Key Technology | Port (dev) |
|---------|------|----------------|------------|
| `qyvora-frontend` | React SPA — marketing pages, student dashboard, admin panel | React 19, Vite 6, Tailwind CSS v4 | 5173 |
| `qyvora-backend` | Express API — auth, bootcamps, CP ledger, admin ops, file uploads, bridge to chain | Express 4, Mongoose, Joi | 3000 |
| `qyvora-chain` | Private PoA ledger — immutable event recording, CP token source of truth | Express 4, SHA-256, HMAC | 4100 |

### 2.3 Source of Truth

- **CP balances:** The chain is the source of truth. MongoDB is a read cache. All CP write operations must go through the outbox to the chain. Backend CP operations (credit, debit, set) write to MongoDB for fast reads but must always reconcile with the chain.
- **User data:** MongoDB is the source of truth. Chain records reference userId but does not store user profiles.
- **Bootcamp progress:** MongoDB tracks progress, room completion status, quiz scores. Chain records immutable completion events.

### 2.4 Deployment

- **Frontend:** Deploys to Netlify. SPA redirect via `/* → /index.html`. CSP and security headers set in `netlify.toml`.
- **Backend:** Deploys to Render. Health endpoint at `/health`. Chain outbox worker starts automatically.
- **Chain:** Deploys to Render. Persistent disk for JSON ledger. Cron job keeps service awake every 14 minutes.

**Rule:** Each service must have a `/health` endpoint that returns 200 OK.
**Rule:** Each service must validate its environment at startup and refuse to start with placeholder or missing secrets.

---

## 3. Service Boundaries and Responsibilities

### 3.1 Frontend

**Scope:** UI rendering, client-side routing, HTTP transport, state management for auth and UI.

**Must NOT do:**
- Perform business logic (room completion, CP calculations)
- Persist access tokens to localStorage or sessionStorage (in-memory only)
- Enforce authorization (route guards are UX only; backend is authoritative)
- Import from other feature modules (cross-feature imports are forbidden)

### 3.2 Backend

**Scope:** API authorization, business logic, data persistence, file storage, chain bridge, notification dispatch.

**Must NOT do:**
- Implement business logic in controllers (controllers translate HTTP only)
- Fire-and-forget chain writes (must use chain outbox)
- Trust client-provided IDs for authorization-sensitive operations (verify ownership server-side)
- Store secrets in source code

### 3.3 Chain

**Scope:** Immutable event ledger, CP token balance computation, integrity verification.

**Must NOT do:**
- Authenticate users (only validators authenticate via PoA + HMAC)
- Store user profiles or PII
- Modify or delete blocks (append-only)
- Expose write endpoints without PoA + HMAC authentication

---

## 4. Data Flow

See `DATA_FLOW.md` for the complete flow diagram.

### 4.1 Key Data Flows

**Room Completion:**
1. Frontend sends `POST /api/student/modules/:id/rooms/:id/complete` with JWT
2. Backend middleware validates auth, CSRF, request body
3. `student.controller.completeRoom()`:
   a. Verifies room completion conditions (quiz passed if required)
   b. Calculates CP reward
   c. Writes CPTransaction + updates StudentOverview (MongoDB)
   d. Enqueues ChainOutboxEvent via `chainOutbox.service.ts`
   e. Returns updated user state
4. Chain outbox worker processes the event:
   a. HMAC-signs the payload
   b. POSTs to `/block/add` on the chain service
   c. On success, marks event as `completed`
   d. On failure, retries with exponential backoff (max 12 attempts)

**Balance Resolution:**
1. Frontend requests a page that displays CP balance
2. Backend calls `cpToken.service.resolveCpBalance(userId)` which returns MongoDB cached value
3. For admin chain explorer, backend directly queries chain via `chain.service.ts`

**Frontend → Chain direct call (exceptions only):**
- `tokenBalance.service.ts` in `features/student/` calls `VITE_CHAIN_API_BASE_URL/token/balance/:userId` directly
- This is a deviation (see §9.4). All other chain reads should go through the backend.

### 4.2 Data Flow Rules

1. **All API requests from the frontend must use the Axios client (`api.ts`)**, which handles token attachment, CSRF headers, and response interceptor logic automatically.

2. **The frontend must never call chain API endpoints except for the specific case of `GET /token/balance/:userId`** when resolving CP for display purposes. This is a temporary measure.

3. **Chain write must always go through the outbox.** Direct `chain.service.ts` calls are only permitted for read operations (balance, history) and the chain explorer.

4. **Chain failure must never block the user response.** The outbox pattern ensures eventual consistency; the backend should respond to the user immediately after the MongoDB write succeeds.

5. **Security events must be logged for all non-GET requests that return >= 400.** The `securityEventLogger` middleware handles this in the backend.

---

## 5. Frontend Architecture

### 5.1 Directory Layout

```
src/
  app/                  # Application entry, router, provider tree
  assets/               # Static images (organized by domain)
  core/                 # Cross-cutting: api.ts, contexts, hooks
  features/             # Domain modules (marketing, auth, student, admin, news)
  shared/               # Reusable UI, layouts, utils
  styles/               # Tailwind CSS v4 with @theme tokens
```

### 5.2 Routing

**Rules:**
- **All pages must use `React.lazy()` for code splitting.** No synchronous imports of page components in the router.
- **Route guards are UX controls only.** The `StudentOnly` and `AdminOnly` components control what the user sees, but backend authorization is always authoritative.
- **The admin route prefix `/mr-robot` is obfuscation, not security.** It is decoded via `atob()` and used for URL clarity only. Real authorization is enforced by the backend `requireAdmin` middleware.
- **All routes should be wrapped with `ErrorBoundary` + `Suspense` + `<PageLoader />`.** The `Wrap` component provides this consistently.

**Route table:** See `src/app/router.tsx` for the complete route map. There are 30+ lazy-loaded pages across 6 layouts.

### 5.3 Feature Organization

**Rule: Features must not import from other features.** Cross-feature code must be lifted to `src/shared/`.

```
features/
  admin/        # Admin dashboard, chain explorer, CP analytics
  auth/         # Login, register, password flow
  marketing/    # Landing page, blogs, events, courses, team, news
  news/         # Cyber feed
  student/      # Dashboard, bootcamps, marketplace, wallet, profile, settings
```

**Known violations (technical debt):**
- `PublicProfilePage` (marketing) imports from `features/student/utils/walkthroughImages`. Fixed by moving walkthrough helpers to `src/shared/utils/`.
- Other boundary leaks may exist. See §9.2.

### 5.4 Shared Module

`src/shared/` contains:

| Subdirectory | Contents | Importable by |
|---|---|---|
| `components/` | ErrorBoundary, PageLoader, SEO, ScrollReveal, ScrollToTop, Identicon, ConsentBanner, CommunityPopup | All features |
| `components/ui/` | Dialog, BottomSheet, Tooltip, Card, Skeleton, SimpleHeading, StatCounter | All features |
| `components/layout/` | Navbar, Footer, PublicBottomNav | Layouts |
| `components/brand/` | Logo, QyvoraLogotype, QyvoraMark | All features |
| `components/backgrounds/` | HeroBackground, AdinkraBackground | All features |
| `layouts/` | LandingLayout, BlogsLayout, StudentLayout, AdminLayout | Router only |
| `utils/` | cn, cpBalance, formatNumber, resolveImg, etc. | All features |

**Anti-pattern:** Do not put domain-specific components in `shared/`. If a component is only used by one feature, keep it in that feature. If it is used by two or more features, put it in `shared/`.

### 5.5 Core Services

**`api.ts`** — The single Axios client that all features must use for backend communication:
- Two instances: `api` (full interceptor stack) and `authApi` (no response interceptor, for refresh only)
- Access token stored **in-memory only** (a JS variable, never localStorage)
- CSRF token in both localStorage and in-memory
- Response interceptor handles 401 (silent refresh), 403 CSRF (auto-heal), and token extraction
- Refresh de-duplication via `refreshPromise` (prevents concurrent refresh calls)

**`AuthContext`** — The single source of truth for auth state:
- `login()`, `logout()`, `refreshMe()` are the only auth entry points
- User state includes rank (computed from CP), bootcamp status, admin flag
- Bootstrap: on mount, silently restores session via `/auth/me` if `authSessionHint` is set

### 5.6 Layout System

Four layouts, each with different chrome:

| Layout | Navbar | Footer | Bottom Nav | Used For |
|--------|--------|--------|------------|----------|
| `LandingLayout` | Fixed top | Embedded in last scroll section | None | Marketing homepage |
| `BlogsLayout` | Fixed top | Blog post detail only | None | Blog pages |
| `StudentLayout` | `StudentTopbar` (fixed) | None | Student mobile nav | Authenticated student pages |
| `AdminLayout` | `AdminTopbar` (fixed) | None | Admin mobile nav | Admin dashboard |

**Layout padding rules:**
- Layouts must provide top padding to clear the fixed navbar (`pt-20 md:pt-24`)
- Layouts must provide bottom padding to clear fixed mobile navs (`pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6`)
- Bootcamp room pages must remove bottom padding (immersive experience)

### 5.7 UI Principles

**Design tokens** are defined in `src/styles/index.css` via `@theme`:
- `--color-bg`: `#000000` — page background
- `--color-bg-card`: `#050505` — card surface
- `--color-bg-elevated`: `#0b0b0b` — elevated surface
- `--color-accent`: `#06B66F` — green accent (CTAs, active states, highlights)
- `--color-text-primary`: `#EEF0EE` — primary text
- `--color-text-secondary`: `rgba(238,240,238,0.70)` — secondary text
- `--color-text-muted`: `rgba(238,240,238,0.40)` — muted text
- `--color-border`: `rgba(171,181,192,0.12)` — default borders
- `--color-border-strong`: `rgba(6,182,111,0.18)` — accent borders

**No-Gos (must never appear in frontend code):**
1. No gradient backgrounds
2. No CRT scanlines or vignette overlays
3. No glow, blur, or shadow effects on text
4. No `AnimatedField` component in heroes
5. No `TerminalPanel` in heroes
6. No SVG icons or illustrations in section headers (use lucide-react)
7. No `items-center` on grids that force equal column heights with different-sized content
8. No nav links crowding the CTA button (maintain `mr-8/12/16` spacing)
9. No content too close to viewport edges (follow standard hero padding: `pt-20 sm:pt-28 lg:pt-24 pb-10 sm:pb-12 lg:pb-16`)
10. No oversized nav link spacing/tracking (use `space-x-3/5/7`, `tracking-[0.15em] lg:tracking-[0.2em]`)

**Style conventions:**
- Use `cn()` (clsx + tailwind-merge) for conditional class merging
- Global component classes (`.btn-primary`, `.btn-secondary`, `.card-qyvora`) are defined in `src/styles/index.css`
- All headings must use the JetBrains Mono font (set globally via `--font-mono`)
- Dark theme only (`data-theme="dark"` forced by `ThemeContext`)
- Use `lucide-react` for all interface icons; custom SVG icons in `src/shared/components/icons/` only for brand social icons

---

## 6. Backend Architecture

### 6.1 Directory Layout

```
src/
  core/
    config/             # endpoints.config.ts, env.validation.ts
    database/           # Mongoose connection
    logging/            # logger.ts
    middleware/         # setup.ts, core.middleware.ts, auth.middleware.ts, validate.request.ts
    notifications/      # emit.ts (stub)
    repositories/       # user.repository.ts (only repository)
    security/           # jwt.ts, cookies.ts, origins.ts, rateLimiter.ts, security.ts
    services/           # chain.service.ts, chainOutbox.service.ts, cpToken.service.ts,
                        # cpLedger.service.ts, email.service.ts, pdf.service.ts
  modules/
    auth/               # controllers/, services/, models/, routes/
    student/            # controllers/, middleware/, models/, routes/
    dashboards/         # controllers/, routes/ (admin)
    cp/                 # controllers/, routes/
    shared/             # controllers/, models/, routes/ (public, upload)
    news/               # controllers/, services/, routes/
    events/             # controllers/, models/, routes/
    notifications/      # models/, routes/
  shared/
    config/             # bootcamp.config.ts
    utils/              # cache/overviewCache.ts, engagementMetrics.ts
  types/                # express.d.ts, global.d.ts, mongoose.d.ts
```

### 6.2 Middleware Stack (Order is Critical)

Middleware is assembled in `setup.ts()` and applied in `app.ts`. The order below is **mandatory** — changing the order can introduce security vulnerabilities:

| # | Middleware | File | Function |
|---|-----------|------|----------|
| 1 | `helmet()` | setup.ts | Security headers (CSP, HSTS, frameguard, referrer-policy, X-Content-Type-Options) |
| 2 | `trust proxy` | setup.ts | Trust proxy for correct IP resolution |
| 3 | `cookieParser()` | setup.ts | Parse cookies from request |
| 4 | `cors()` | setup.ts | CORS with explicit origin allowlist (parsed from `FRONTEND_URL`/`FRONTEND_URLS`) |
| 5 | `compression()` | setup.ts | Gzip/brotli response compression |
| 6 | `morgan()` | setup.ts | HTTP request logging |
| 7 | `express.json({ limit: '1mb' })` | setup.ts | JSON body parsing with size limit |
| 8 | `express.urlencoded({ extended: true })` | setup.ts | URL-encoded body parsing |
| 9 | `requestSanitizer` | core.middleware.ts | Strips `$` and `.` from body/query/params keys (NoSQL injection prevention) |
| 10 | Request timeout (30s) | app.ts | Responds 408 if no response within 30 seconds |
| 11 | `optionalAuth` | auth.middleware.ts | Sets `req.user` if valid JWT present |
| 12 | `csrfGuard` | core.middleware.ts | Validates CSRF token for state-changing requests |
| 13 | `attachSecurityContext` | core.middleware.ts | Attaches IP, user-agent, device ID to `req.requestContext` |
| 14 | `requestRateLimiter` | core.middleware.ts | Per-IP rate limiting (production only) |
| 15 | `securityEventLogger` | core.middleware.ts | Logs non-GET, >=400 responses to SecurityEvent collection |
| 16 | Route dispatch | — | Mounted routes handle the request |
| 17 | 404 handler | app.ts | Returns `{ error: 'Not found' }` |
| 18 | Global error handler | app.ts | Logs error, sanitizes message in production |

**Rule:** The middleware stack must be applied in exactly this order. New middleware should be inserted at the appropriate position with a comment explaining why.

**Rule:** `optionalAuth` must come before `csrfGuard` because CSRF validation needs `req.user` to determine whether the request is authenticated.

### 6.3 Route Architecture

All API routes mount under `/api` (prefix defined in `endpoints.config.ts`):

| Mount Point | Module | Auth Required | Key Endpoints |
|-------------|--------|---------------|---------------|
| `/api/auth` | `modules/auth/routes/` | Mixed | `POST /login`, `POST /register`, `POST /refresh`, `POST /logout`, `GET /me` |
| `/api/student` | `modules/student/routes/` | `requireAuth` | `GET /overview`, `GET /course`, `POST /quiz`, `POST /.../complete`, `GET /chain-history` |
| `/api/profile` | `modules/student/routes/` | `requireAuth` | Profile CRUD, recovery token, password change |
| `/api/admin` | `modules/dashboards/routes/` | `requireAuth` + `requireAdmin` | User CRUD, CP management, chain explorer, security events |
| `/api/public` | `modules/shared/routes/` | None | Landing stats, CP products, leaderboard, contact form |
| `/api/cp` | `modules/cp/routes/` | `requireAuth` | Balance, transactions, purchase, download |
| `/api/notifications` | `modules/notifications/routes/` | `requireAuth` | List, mark read |
| `/api/news` | `modules/news/routes/` | None | Cyber feed |
| `/api/events` | `modules/events/routes/` | `requireAuth` | Event review, access key, access status |
| `/uploads` | `modules/shared/routes/` | None (public) | GridFS file serving |

**Rule:** Route files must only bind middleware to controller methods. Route files must not contain business logic.

**Rule:** Every mutation endpoint must have a Joi schema validation via `validateBody()` or `validateParams()`.

### 6.4 Controller → Service → Repository Layering

**Intended architecture:**

```
Route ──► Controller ──► Service ──► Repository ──► Model
            │                │
         HTTP only        Business logic
         (parse req,       (orchestration,
          format res)       calculations,
                            authorization checks)
```

**Current state (deviation):**

Controllers in `student.controller.ts` (~894 lines) and `admin.controller.ts` (~981 lines) directly perform:
- HTTP request parsing
- Authorization-adjacent checks
- MongoDB reads/writes
- Reward calculations
- Notification creation
- Cache invalidation
- Chain writes
- Response shaping

**Rule:** Controllers must translate HTTP requests and format HTTP responses only. Business logic must live in services.

**Deviations documented in §9.1.**

### 6.5 Authentication & Authorization Flow

```
login request
  │
  ▼
auth.middleware
  └─ requireAuth: extracts JWT from "Authorization: Bearer" or access_token cookie
     └─ Verifies signature + expiry
        └─ Looks up user by ID
           └─ Checks blockedUntil, emailVerified
              └─ Sets req.user (safe fields only)
```

**Token strategy:**

| Token | Location | Frontend Storage | Backend Verification | Expiry |
|-------|----------|-----------------|---------------------|--------|
| Access | `Authorization: Bearer` header or `access_token` cookie | In-memory JS variable | JWT verify with `JWT_SECRET` | 20 min |
| Refresh | `refresh_token` cookie (httpOnly) | Not accessible to JS | JWT verify + SHA-256 hash match in DB | 7 days |
| CSRF | `csrf_token` cookie | localStorage + in-memory | Header matches cookie value | Per-session |
| Password change | `passwordChangeToken` (in response body) | In-memory | JWT with `type: 'password_change'` | 15 min |
| Password reset | JWT in email link | — | JWT with `type: 'password_reset'` or recovery token | 20 min |

**Refresh token flow:**
1. Access token expires → 401 response
2. Frontend interceptor catches 401, calls `POST /api/auth/refresh` (httpOnly cookie sent automatically)
3. Backend verifies refresh token JWT, looks up SHA-256 hash in `RefreshToken` collection
4. Backend **rotates** the token: marks old as revoked, issues new access + refresh pair
5. Frontend stores new access token in-memory, retries original request

**Rule:** Access tokens must never be stored in localStorage or sessionStorage. They exist only in a JS variable in `api.ts`.

**Rule:** Refresh tokens are single-use. Each refresh call rotates the token, invalidating the previous one.

**Rule:** The frontend `authApi` instance (used for refresh) must NOT have a response interceptor to prevent infinite refresh loops.

### 6.6 Chain Integration (Outbox Pattern)

**Purpose:** Guarantee at-least-once delivery of chain events without blocking the user response.

**Architecture:**

```
1. Business operation (e.g., room completion)
   │
2. Write to MongoDB (CPTransaction, progress update)
   │
3. enqueueChainEvent(event) → upsert ChainOutboxEvent document
   │  (idempotency key = SHA-256 of eventType:scope:payload)
   │
4. Return success to user ←─── user response not blocked by chain
   │
5. Chain outbox worker (every 10s):
   │  a. Find pending/failed events (max 25 per tick)
   │  b. Atomic status change: pending → processing
   │  c. HMAC-sign payload, POST to chain /block/add
   │  d. On 2xx: mark event completed
   │  e. On error: increment attempts, set exponential backoff
   │     (max 12 attempts, backoff capped at 1 hour)
```

**Event types routed through the outbox:**
- `ROOM_COMPLETED` — recorded when a student completes a bootcamp room
- `CP_REWARD` — recorded when CP is rewarded
- `CP_MINT` — recorded when admin mints new CP
- `CP_BURN` — recorded when CP is spent or deducted

**Rule:** All CP-affecting chain writes must go through the outbox. Direct `chain.service.ts` write calls are forbidden.

**Rule:** The outbox worker must use `findOneAndUpdate` with atomic status change to prevent double-processing across replicas.

**Rule:** The outbox must use idempotency keys (unique index on `ChainOutboxEvent.idempotencyKey`) to prevent duplicate chain events.

**Anti-pattern:** Do not `await` the outbox dispatch in the request handler. The user response must not wait for the chain write to complete.

### 6.7 File Upload (GridFS)

**Storage:** MongoDB GridFS with four buckets:

| Bucket | Contents | Public Access | Max File Size |
|--------|----------|---------------|---------------|
| `free-resources` | Public download resources | Yes | — |
| `bootcamp-images` | Bootcamp images | Yes | — |
| `cp-products` | Product PDFs | No (auth check) | 30 MB |
| `cp-product-images` | Product cover images | Yes | 5 MB |

**Upload flow:**
1. Multer middleware writes uploaded file to `os.tmpdir()/qyvora-uploads/`
2. Controller calls `uploadFileToGridFs()` which streams temp file into GridFS via `GridFSBucket`
3. Temp file is cleaned up via `fs.unlink` (best-effort)

**Download flow:**
- Public assets: streamed directly from GridFS with `Cache-Control: public, max-age=31536000, immutable`
- CP product files: ownership verified before streaming

**Rule:** Never buffer file uploads in memory (`memoryStorage` is forbidden). Always stream through temp files or directly to GridFS.

**Rule:** File type validation must be done via MIME type checking (not file extension).

**Rule:** `GRIDFS_MAX_DOWNLOAD_BYTES` (default 50 MB) must be enforced on all GridFS downloads.

### 6.8 Security Controls

| Control | Implementation | Location |
|---------|---------------|----------|
| Password hashing | bcrypt, salt rounds 12 | `auth.service.ts` |
| Password policy | Min 8 chars, upper + lower + number + special | `security.ts` |
| Login rate limiting | Progressive delay + lockout after 10 failures | `auth.service.ts` |
| Auth rate limiting | 10 requests per 15 min per IP | `rateLimit.auth.ts` |
| Global rate limiting | 300 (api), 60 (auth), 600 (public) per 15 min | `core.middleware.ts` |
| NoSQL injection | Strip `$` and `.` from all untrusted keys | `core.middleware.ts` |
| CSRF | Cookie-to-header token validation | `core.middleware.ts` |
| HTTP headers | Helmet (CSP, HSTS, frameguard, referrer-policy) | `setup.ts` |
| CORS | Explicit origin allowlist via `FRONTEND_URL`/`FRONTEND_URLS` | `setup.ts` |
| Environment validation | Startup checks for placeholder secrets, min lengths | `env.validation.ts` |
| Security event logging | All non-GET 400+ responses logged to `SecurityEvent` | `core.middleware.ts` |
| Admin auth | `requireAdmin` middleware (role check) | `auth.middleware.ts` |

### 6.9 Graceful Degradation

**Rule:** If the chain service is unreachable, the backend must still respond to the user successfully. The MongoDB write succeeds immediately; the chain write is retried by the outbox worker later.

**Rule:** If MongoDB is unreachable, the backend should fail fast (the outbox worker can retry later, but user-facing requests that need DB access should return 503).

**Rule:** Environment validation failures at startup must block the service from starting.

---

## 7. Chain Architecture

### 7.1 Purpose

The QYVORA chain is not a general-purpose blockchain. It is a **tamper-evident event ledger** designed to provide an immutable audit trail for CP token operations. It uses Proof-of-Authority consensus with a single trusted validator.

### 7.2 Block Structure

```
Block {
  index: number            // Position in chain (0 = genesis)
  timestamp: string        // ISO 8601 UTC
  previousHash: string     // SHA-256 of preceding block
  hash: string             // SHA-256 of this block's content
  validator: string        // PoA node ID that authorized the block
  data: BlockData {        // Event payload
    type: EventType,       // See below
    userId: string,
    bootcampId: string,
    moduleId: string|null,
    roomId: string|null,
    cpPoints: number|null,
    targetUserId: string|null,
    metadata: Record<string, unknown>
  }
}
```

**Event types:**
| Type | Effect | Required Fields |
|------|--------|----------------|
| `ROOM_COMPLETED` | +CP to userId | userId, bootcampId, cpPoints |
| `MODULE_COMPLETED` | +CP to userId | userId, bootcampId, cpPoints |
| `CP_REWARD` | +CP to userId | userId, bootcampId, cpPoints |
| `CP_MINT` | +CP to userId (admin) | userId, bootcampId, cpPoints |
| `CP_BURN` | -CP from userId (admin) | userId, bootcampId, cpPoints |
| `CP_TRANSFER` | Transfer between users | userId, targetUserId, cpPoints |
| `USER_ACTIVITY_LOG` | Generic event | userId, bootcampId |
| `ASSIGNMENT_SUBMITTED` | +CP to userId | userId, bootcampId, cpPoints |

### 7.3 Hash Chain Integrity

Each block's hash is computed as:

```
hash = SHA-256(JSON.stringify({
  index,
  timestamp,
  previousHash,
  validator,
  data,
}))
```

**Integrity checker** runs every `CHAIN_INTEGRITY_CHECK_INTERVAL_MS` (default 60 seconds) and validates:
1. Every block's `isHashValid()` — ensures no field has been tampered with
2. Every block's `previousHash === chain[i-1].hash` — ensures chain linkage is unbroken

If validation fails, an error is logged. No automatic remediation is attempted (the chain is tamper-evident, not tamper-proof).

### 7.4 Proof-of-Authority

**Two-level authentication for all write operations:**

**Level 1 — Node identity (headers):**
- `X-Validator-Secret`: must match server's `VALIDATOR_SECRET`
- `X-Validator-Node`: must match server's `VALIDATOR_NODE_ID`

**Level 2 — HMAC request signing (replay protection):**
- `X-Request-Timestamp`: Unix epoch seconds
- `X-Request-Signature`: `HMAC-SHA256(VALIDATOR_SECRET, "${timestamp}.${rawBody}")`
- Server verifies timestamp is within 300 seconds of current time
- Server recomputes HMAC and compares with `crypto.timingSafeEqual()`

**Why `rawBody` is required:** After Express parses JSON, the body string changes (whitespace removed). The `verify` callback on `express.json()` captures the original byte stream before parsing, preserving the exact payload for HMAC verification.

**Rule:** All `POST`/`PUT`/`PATCH` requests to the chain must include both PoA identity headers and HMAC signature.

**Rule:** `timingSafeEqual` must be used for all secret comparisons in the chain middleware.

### 7.5 Storage Strategy Pattern

The chain uses a strategy pattern for persistence, selected at startup via `STORAGE_DRIVER` env var:

| Driver | Implementation | Use Case | Trade-offs |
|--------|---------------|----------|------------|
| `json` (default) | `JSONStorage` — reads/writes entire chain to a JSON file | Development, single-node MVP | Full file rewrite on every block; not suitable for scale |
| `mongo` | `MongoStorage` — persists blocks as MongoDB documents via Mongoose | Production | Upsert-per-block (more efficient); requires MongoDB |

**Both drivers share the same `Storage` interface:**

```typescript
interface Storage {
  load(): Promise<Record<string, unknown>[]>;
  save(chainArray: Record<string, unknown>[]): Promise<void>;
}
```

**Atomic write guarantee (JSONStorage):** Writes to a temp file first, then `rename()` — prevents partial writes.

**Rule:** The storage driver must be selectable at startup via environment variable. Hard-coding is forbidden.

### 7.6 Balance Computation (Technical Debt)

**Current implementation:** `getTokenBalance(userId)` replays the entire chain from genesis, summing CP events for the given user. This is `O(n)` in chain length and runs on every balance request.

**Why this is a problem:**
- As the chain grows, balance queries become slower
- Every request reloads the full chain into memory (if not already loaded)
- No caching or snapshot mechanism exists

**Intended future architecture:**
- Materialized balance view that is updated incrementally as blocks are added
- Indexed event queries (by userId, by event type, by time range)
- Periodic snapshot mechanism to bound replay length

**Current mitigation:** The backend caches CP balances in MongoDB and only reconciles on write. This means the chain is queried less frequently than it would be otherwise.

### 7.7 Token Event Effects on Balance

| Event Type | Source User | Target User |
|------------|-------------|-------------|
| `ROOM_COMPLETED` | +cpPoints | — |
| `MODULE_COMPLETED` | +cpPoints | — |
| `CP_REWARD` | +cpPoints | — |
| `CP_MINT` | +cpPoints | — |
| `CP_BURN` | -cpPoints | — |
| `CP_TRANSFER` | -cpPoints | +cpPoints |
| `USER_ACTIVITY_LOG` | 0 | — |
| `ASSIGNMENT_SUBMITTED` | +cpPoints | — |

---

## 8. Cross-Cutting Security Architecture

### 8.1 Password Security

- **Hashing:** bcrypt with salt rounds 12 (`const SALT_ROUNDS = 12`)
- **Minimum strength:** 8+ characters, must contain uppercase, lowercase, number, and special character
- **Lockout:** After 10 consecutive failed login attempts, account is locked for 15 minutes
- **Progressive delay:** Failed attempts 4-5 → 1s delay, 6-9 → 3s delay, 10+ → lockout
- **Legacy weak passwords:** The `mustChangePassword` flag forces users with pre-policy passwords to update

**Rule:** Salt rounds must never be reduced below 12.

### 8.2 JWT Strategy

- **Access token:** 20-minute expiry, `{ sub: userId, email, role }` payload
- **Refresh token:** 7-day expiry, `{ sub, email, role, type: 'refresh', jti: uuid }` payload
- **Refresh token storage:** SHA-256 hashed in `RefreshToken` collection (never stored in plaintext)
- **Rotation:** Each refresh call issues a new access/refresh pair and revokes the old refresh token
- **Replay detection:** If a revoked refresh token is used, all refresh tokens for that user are revoked (token theft detected)

**Rule:** Access token must never be persisted in browser storage (localStorage, sessionStorage, IndexedDB, cookies).

**Rule:** Refresh token must be httpOnly (not accessible to JavaScript).

### 8.3 CSRF Protection

**How it works:**
1. On login, backend sets a `csrf_token` cookie (httpOnly: false, accessible to JS)
2. Frontend reads the cookie value and sends it as `X-CSRF-Token` header on every state-changing request
3. Backend `csrfGuard` middleware validates that the header value matches the cookie value
4. GET/HEAD/OPTIONS requests are exempt
5. Auth endpoints (login, register, refresh, password-reset, verify-email) are exempt

**CSRF healing:** If an authenticated user has a mismatched or missing CSRF token, the backend issues a fresh token and allows the request to proceed. This prevents the user from getting stuck in a broken state.

**Rule:** CSRF healing must only apply to authenticated requests with a valid session. Unauthenticated state-changing requests with invalid CSRF must be rejected with 403.

### 8.4 Rate Limiting

| Layer | Limit | Window | Driver | Location |
|-------|-------|--------|--------|----------|
| Global API | 300 requests | 15 min | MongoDB (prod) / Memory (dev) | `core.middleware.requestRateLimiter` |
| Auth routes | 10 requests | 15 min | MongoDB (prod) / Memory (dev) | `rateLimit.auth.authRateLimit` |
| Public routes | 600 requests | 15 min | MongoDB (prod) / Memory (dev) | `core.middleware.requestRateLimiter` |

**Rule:** The rate limiter must use a pluggable backend (interface with Memory, MongoDB, and Redis-ready contract).

**Rule:** Rate limiting must be applied before route handlers (position #14 in middleware stack).

**Current technical debt:** The in-memory driver is not suitable for multi-replica deployments. A Redis driver exists in the interface but is not yet implemented.

### 8.5 Input Sanitization

**NoSQL injection prevention:** The `requestSanitizer` middleware strips any key starting with `$` or containing `.` recursively from `req.body`, `req.query`, and `req.params`.

```typescript
// Before sanitizer:  { "$gt": "", "user.name": "admin" }
// After sanitizer:   { }
```

**Rule:** The sanitizer must run before route handlers and before any validation middleware (position #9 in middleware stack).

### 8.6 Environment Validation

**Performed at startup in `validateRuntimeEnv()`:**

| Check | Always | Production Only | Condition |
|-------|--------|----------------|----------|
| `JWT_SECRET` required | Yes | — | >= 32 chars, not a placeholder |
| `MONGODB_URI` required | — | Yes | Non-empty |
| `FRONTEND_URL` required | — | Yes | Non-empty |
| `CHAIN_SERVICE_URL` required | — | Yes | Non-empty |
| `CHAIN_VALIDATOR_SECRET` required | — | Yes | >= 32 chars, not a placeholder |
| `ADMIN_PASSWORD` required | — | Yes | >= 12 chars, not a placeholder |

**Placeholder detection:** A `Set` of known placeholder values (e.g., `'replace_me_with_a_32_char_random_jwt_secret'`, `'change-this-password'`). If any env var matches, startup is blocked.

**Rule:** All failures must be aggregated and thrown as a single Error with semicolon-separated messages. No partial startup with some env vars invalid.

**Rule:** The chain service has its own equivalent validation (`validateEnv()` in `config/env.ts`) with similar checks for `VALIDATOR_SECRET` (16-64 chars, no placeholders) and `ALLOWED_ORIGINS` in production.

### 8.7 Security Event Logging

- Every non-GET request that returns status >= 400 is logged to `SecurityEvent` collection
- Captured fields: eventType, action, path, method, statusCode, ipAddress, userAgent, deviceId, userId
- TTL index on `createdAt` (configurable via `SECURITY_EVENT_TTL_DAYS`, default 180 days)
- Admin dashboard exposes filtered views of security events

**Rule:** Security event writes must not block the response (fire-and-forget or asynchronous).

---

## 9. Deviations from Intended Architecture

This section documents where the current implementation deviates from the intended architecture. Each deviation includes the affected files, the gap, and whether it should be treated as technical debt or corrected immediately.

### 9.1 Controller Business Logic

**Intended:** Controllers translate HTTP only. Business logic lives in services.

**Current:** `student.controller.ts` (~894 lines) and `admin.controller.ts` (~981 lines) mix HTTP handling, business rules, MongoDB access, reward calculations, notification creation, cache invalidation, and chain calls.

**Files:**
- `qyvora-backend/src/modules/student/controllers/student.controller.ts`
- `qyvora-backend/src/modules/dashboards/controllers/admin.controller.ts`

**Classification:** Technical debt. Extraction to services should be done incrementally. CP ledger operations have already been partially extracted to `cpLedger.service.ts`. The remaining logic in these controllers is the highest-priority refactoring target.

**Recommendation:** Extract the following domains from `student.controller.ts`:
- Quiz grading → `modules/student/services/quiz.service.ts`
- Room completion logic → `modules/student/services/room.service.ts`
- Chain history → reuse `core/services/chain.service.ts`

From `admin.controller.ts`:
- CP operations → reuse `core/services/cpLedger.service.ts`
- User management → `modules/dashboards/services/userAdmin.service.ts`
- Security events → already partially handled

### 9.2 Cross-Feature Imports (Frontend)

**Intended:** Features must not import from other features.

**Current:** Known violations exist and have been partially fixed. The review identified that `PublicProfilePage` (in `features/marketing/`) imported from `features/student/utils/walkthroughImages`. This was fixed by moving the helpers to `src/shared/utils/`. Other violations may remain undetected.

**Files:** Potentially any file in `src/features/`.

**Classification:** Technical debt. Should be enforced via ESLint rule (`no-restricted-imports`) and code review.

### 9.3 No Repository Layer for Most Domains

**Intended:** MongoDB access behind repositories for high-risk domains (CP, auth, progress, quiz, notifications).

**Current:** Only `user.repository.ts` exists (with CP query methods). All other domains perform direct Mongoose calls from controllers and services.

**Files:** All controllers and services performing direct `Model.find()` / `Model.updateOne()` etc.

**Classification:** Technical debt. Progress, Quiz, and Notifications are the next domains that need repositories.

### 9.4 Direct Frontend→Chain Calls

**Intended:** The frontend should communicate with the chain only through the backend API.

**Current:** `tokenBalance.service.ts` in `features/student/` calls `VITE_CHAIN_API_BASE_URL/token/balance/:userId` directly.

**Files:**
- `qyvora-frontend/src/features/student/services/tokenBalance.service.ts`
- (env) `VITE_CHAIN_API_BASE_URL`

**Classification:** Technical debt. This bypasses backend authorization and should be routed through the backend. The backend already has `cpToken.service.ts` for balance resolution.

### 9.5 No Shared API Contracts

**Intended:** Frontend and backend share TypeScript types for API contracts.

**Current:** API contracts are manually duplicated. The frontend `AuthContext.tsx` manually maps the backend user shape.

**Files:** All frontend files defining TypeScript interfaces for API responses.

**Classification:** Technical debt. Introduces silent contract drift. A future monorepo or shared package should house these types.

### 9.6 Process-Local Cache

**Intended:** Caches that must survive restarts or scale horizontally should use a distributed store (Redis).

**Current:** `overviewCache.ts` uses an in-memory Map. Multiple backend replicas will have inconsistent cache state.

**Files:**
- `qyvora-backend/src/shared/utils/cache/overviewCache.ts`

**Classification:** Technical debt. Acceptable for single-replica deployments. Must be replaced with Redis before horizontal scaling.

### 9.7 Hard-Coded Quiz Answers

**Intended:** Quiz answer keys should be configurable content, not embedded in controller code.

**Current:** Quiz answer keys are hard-coded in `student.controller.ts`.

**Files:**
- `qyvora-backend/src/modules/student/controllers/student.controller.ts`

**Classification:** Technical debt. Content changes require code deployment. Should be moved to a content service or database collection.

### 9.8 Large Static Content in Source

**Current:** `bootcampConfig.ts` (~4050 lines) and `lessons.ts` (~2630 lines) live in frontend source, inflating JS bundles and coupling content changes to code deploys.

**Files:**
- `qyvora-frontend/src/features/student/constants/bootcampConfig.ts`
- `qyvora-frontend/src/features/student/data/courses/lessons.ts`

**Classification:** Technical debt. Should be moved to structured data served by the backend API.

### 9.9 Chain Balance O(n) Computation

**Current:** Balance computation replays the full chain per request. See §7.6 for details.

**Classification:** Technical debt. This is the primary scalability bottleneck in the chain service.

### 9.10 Missing Routes Documentation

**Current:** The chain README documents `/chain`, `/block/:hash`, and `/stats` routes that are not implemented in the code.

**Files:**
- `qyvora-chain/README.md`

**Classification:** Documentation debt. The README should be updated to match the actual routes defined in `chain.routes.ts`.

---

## 10. Technical Debt Register

### 10.1 Priority Matrix

| Priority | Item | Impact | Effort | Status |
|----------|------|--------|--------|--------|
| **P0** | Controller business logic extraction (student + admin) | High regression risk, poor ownership | Weeks | Open |
| **P0** | Chain balance O(n) computation | Scalability bottleneck | Weeks | Open |
| **P1** | Repository layer for Progress, Quiz, Notifications | Inconsistent data rules | Days | Open |
| **P1** | Shared API contracts | Silent contract drift | Days | Open |
| **P1** | Hard-coded quiz answers | Content changes require deploy | Days | Open |
| **P2** | Direct frontend→chain calls | Bypasses backend auth | Hours | Open |
| **P2** | Process-local cache | Not horizontally scalable | Hours | Open |
| **P2** | No frontend tests | High regression likelihood | Weeks | Open |
| **P3** | Large static content in source | Bundle noise, deploy friction | Weeks | Open |
| **P3** | Missing chain README routes | Documentation debt | Hours | Open |

### 10.2 Items Already Fixed

The following items from the original architecture review have been resolved:
- CP/chain consistency via outbox pattern ✓
- Admin search regex injection ✓
- Frontend typecheck failure ✓
- Frontend feature boundary leak ✓
- File upload memory risk ✓
- Backend prebuild side-effect ✓
- Express type alignment ✓
- Root workspace scripts ✓
- Security event TTL ✓
- Recovery token hashing ✓
- CSRF fail-closed ✓
- Rate limiter abstraction ✓
- Empty directory cleanup ✓

See `ARCHITECTURE_BOUNDARIES.md` for detailed hardening status.

---

## 11. Future Considerations

### 11.1 Multi-Replica Readiness

The following must be addressed before running multiple backend replicas:
- Replace in-memory rate limiter with Redis driver
- Replace process-local overview cache with Redis
- Ensure outbox worker uses MongoDB atomic operations (already done) with proper `lockedAt` handling

### 11.2 Chain Performance

- Implement materialized balance snapshots updated incrementally
- Add indexed event queries by userId and event type
- Consider streaming read model instead of full-chain replay
- Add snapshot/replay tooling for disaster recovery

### 11.3 API Contract Automation

- Introduce a shared TypeScript package or OpenAPI specification
- Auto-generate frontend API client types from the backend schema
- Add contract tests that verify frontend types match backend responses

### 11.4 Test Coverage

- Frontend integration tests: auth flow, student dashboard, room navigation
- Cross-service E2E tests: register → enroll → complete room → CP recorded on chain
- Chain integration tests: balance computation, integrity checker, HMAC auth

### 11.5 Observability

- Structured logging with correlation IDs across all three services
- Request metrics (latency, error rate, throughput) per endpoint
- Chain-specific metrics: block height, integrity check results, outbox queue depth

### 11.6 Content Management

- Move bootcamp content (`bootcampConfig.ts`, `lessons.ts`) to database or CMS
- Make bootcamp enrollment policy configurable (remove hard-coded bootcamp ID)
- Make quiz answer keys content-managed (remove from controller code)

---

## Appendix A: Enforcement Rules Summary

| # | Rule | Level | Enforceable Via |
|---|------|-------|----------------|
| F1 | Pages must use `React.lazy()` | **Mandatory** | ESLint + code review |
| F2 | Features must not import other features | **Mandatory** | ESLint `no-restricted-imports` |
| F3 | Access tokens in-memory only | **Mandatory** | Code review |
| F4 | Route guards are UX only | **Mandatory** | Code review |
| F5 | No gradients, glows, blurs on UI | **Mandatory** | Code review |
| F6 | Use `cn()` for conditional classes | **Recommended** | Code review |
| F7 | Standard hero padding pattern | **Recommended** | Code review |
| B1 | Controllers translate HTTP only | **Mandatory** | Code review |
| B2 | Chain writes through outbox | **Mandatory** | Code review |
| B3 | Joi validation on all mutation endpoints | **Mandatory** | Code review |
| B4 | Env validation at startup | **Mandatory** | Automated (crashes if missing) |
| B5 | Chain failure never blocks user | **Mandatory** | Code review |
| B6 | Security events logged for 400+ non-GET | **Mandatory** | Automated (middleware) |
| B7 | NoSQL sanitizer before route handlers | **Mandatory** | Automated (middleware order) |
| B8 | Password bcrypt with 12 rounds | **Mandatory** | Code review |
| C1 | PoA + HMAC for chain writes | **Mandatory** | Automated (middleware) |
| C2 | `timingSafeEqual` for secret comparison | **Mandatory** | Code review |
| C3 | Storage driver selectable at startup | **Mandatory** | Code review |

## Appendix B: Cookie Configuration

| Cookie | Name | httpOnly | Path | SameSite | Secure |
|--------|------|----------|------|----------|--------|
| Access token | `access_token` | true | `/` | `none` (if secure) / `lax` | Configurable |
| Refresh token | `refresh_token` | true | `/api/auth` | `none` (if secure) / `lax` | Configurable |
| CSRF token | `csrf_token` | false | `/` | `none` (if secure) / `lax` | Configurable |

`SameSite` resolves to `none` if `secure=true`, otherwise `lax`. The frontend never reads access or refresh tokens (httpOnly prevents it). The frontend reads the CSRF token cookie (httpOnly: false) to attach the `X-CSRF-Token` header.
