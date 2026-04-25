# HSOCIETY Platform — Architecture Reference

---

## Table of Contents

1. [Request Lifecycle](#1-request-lifecycle)
2. [Authentication Flow](#2-authentication-flow)
3. [Frontend Route Map](#3-frontend-route-map)
4. [Student Learning Flow & CP Earning](#4-student-learning-flow--cp-earning)
5. [CP Economy](#5-cp-economy)
6. [Admin Dashboard](#6-admin-dashboard)
7. [Data Models](#7-data-models)
8. [Security Layers](#8-security-layers)
9. [File Upload Flow](#9-file-upload-flow)
10. [Landing Page Cache Strategy](#10-landing-page-cache-strategy)

---

## 1. Request Lifecycle

Every HTTP request passes through this chain before hitting a route handler:

```
Browser
  → CORS check          (blocked → 403)
  → Helmet headers      (CSP, X-Frame, Referrer)
  → CSRF guard          (GET/exempt → skip | mismatch → 403)
  → Rate limiter        (exceeded → 429)
  → Input sanitizer     (strips MongoDB $ operators and dot keys)
  → Security event logger
  → API Router
```

**Route groups and their middleware:**

| Path prefix | Middleware |
|-------------|-----------|
| `/api/public` | none (open) |
| `/api/auth` | none (open) |
| `/api/student` | `requireAuth` |
| `/api/profile` | `requireAuth` |
| `/api/notifications` | `requireAuth` |
| `/api/cp` | `requireAuth` |
| `/api/admin` | `requireAuth` + `requireAdmin` |

---

## 2. Authentication Flow

### Register

```
POST /api/auth/register
  → Joi validation + unique handle generation
  → bcrypt hash (cost 12)
  → User created (cpPoints = 2000 signup bonus)
  → CPTransaction created (source: signup)
  → Recovery token issued
  → JWT access (15 min) + Refresh (7d) set as httpOnly cookies
  → csrfToken cookie set
  → Redirect → /dashboard
```

### Login

```
POST /api/auth/login
  → Credentials check
    ✗ Invalid → 401 + SecurityEvent logged
    ✗ Email unverified → 403 verificationRequired
    ✗ mustChangePassword → return passwordChangeToken → /change-password
    ✓ OK → JWT + Refresh + csrfToken issued
      → student → /dashboard
      → admin   → /mr-robot/dashboard
```

### Password Reset

```
POST /api/auth/password-reset/request
  → Generate JWT reset token
  → Store SHA-256 hash on user (20 min expiry)
  → Email sent with link

POST /api/auth/password-reset/confirm
  → Verify JWT + hash match
  → bcrypt new password
  → Clear reset token
  → Back to login
```

### Token Refresh

```
POST /api/auth/refresh
  → Read httpOnly refresh cookie
  → Validate token + check not revoked in DB
    ✗ → 401, clear cookies
    ✓ → New access token + rotate refresh token
```

### Logout

```
POST /api/auth/logout
  → Invalidate all refresh tokens for user
  → Clear cookies
  → Redirect → /
```

### Email Verification

```
POST /api/auth/verify-email/confirm
  → Validate token
    ✗ → 401
    ✓ → emailVerified = true → back to login
```

---

## 3. Frontend Route Map

### Public routes (PublicLayout — Navbar + Footer)

| Path | Page |
|------|------|
| `/` | Landing Page |
| `/services` | Services |
| `/contact` | Contact |
| `/cyber-points` | Cyber Points explainer |
| `/leaderboard` | Leaderboard (localStorage cache) |
| `/zero-day-market` | Marketplace (public listing) |
| `/u/:handle` | Public Operator Profile |

### Auth routes (no layout)

| Path | Page |
|------|------|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot Password |
| `/reset-password` | Reset Password |
| `/verify-email` | Email Verification |
| `/change-password` | Change Password |
| `/mr-robot` | Admin Login |

### Student routes (StudentLayout — requires auth, student role)

| Path | Page |
|------|------|
| `/dashboard` | Student Dashboard |
| `/learn` | Learn (free resources) |
| `/bootcamps` | Bootcamp list |
| `/bootcamps/:id` | Bootcamp Course Page |
| `/marketplace` | Zero-Day Market |
| `/wallet` | CP Wallet |
| `/profile` | Profile / Account |
| `/notifications` | Notifications |
| `/settings` | Settings |

### Admin routes (AdminLayout — requires admin role)

| Path | Page |
|------|------|
| `/mr-robot/dashboard` | Admin Dashboard |

**Guards:**
- `StudentOnly` — redirects to `/login` if not authenticated, to `/mr-robot/dashboard` if admin
- `AdminOnly` — redirects to `/dashboard` if not admin

---

## 4. Student Learning Flow & CP Earning

### Step 1 — Bootcamp List

```
GET /api/public/bootcamps  (no auth)
GET /api/student/overview  (auth — checks enrollment)

For each bootcamp card:
  isActive = false  → Locked modal (launch date + Join WhatsApp)
  not enrolled      → Enrollment Modal (5-step form)
  enrolled          → "Continue" → Course Page
```

### Step 2 — Enrollment Modal (5 steps)

```
1. Why are you joining?
2. Current level in offensive security?
3. What do you want to achieve in 6 months?
4. Hours per week you can commit?
5. WhatsApp number (required)

→ POST /api/student/bootcamp
  → User.bootcampStatus = 'enrolled'
  → User.bootcampId = bootcampId
  → StudentProfile.snapshot.bootcampApplication saved
  → Overview cache cleared
```

### Step 3 — Course Page

```
GET /api/student/course?bootcampId=X
  → Reads bootcamp from SiteContent
  → Applies bootcampAccess locks:
      started = false         → entire bootcamp locked
      module not in unlockedModules → module locked
      room not in unlockedRooms     → room locked
  → Returns modules + rooms with locked flags + progress state
```

### Step 4 — Room Actions

**Join Live Session:**
```
POST /api/student/modules/:moduleId/rooms/:roomId/session-open
  → Validates module + room unlocked
  → Reads room.meetingLink from SiteContent
  → Creates/updates BootcampRoomSession (openCount++)
  → Frontend opens meetingLink in new tab
```

**Take Quiz:**
```
POST /api/student/quiz  { type: 'room', id, moduleId, courseId }
  → Checks quiz access (quizRelease.enabled OR user in quizAccessUserIds)
  → Returns quiz questions
  → Student answers → POST /api/student/quiz with answers
  → Score calculated (pass = 70%+)
  → QuizSubmission saved
  → Notification emitted
```

**Mark Room Complete:**
```
POST /api/student/modules/:moduleId/rooms/:roomId/complete
  → Validates room unlocked
  → StudentProfile.snapshot.progressState updated
  → CP granted = room.cpReward (min 250, set per room by admin)
  → CPTransaction created
  → Notification emitted
  → Overview cache cleared
```

**Complete CTF:**
```
POST /api/student/modules/:moduleId/ctf/complete
  → progressState.modules[moduleId].ctfCompleted = true
  → +500 CP (CTF_COMPLETION_CP)
  → CPTransaction + notification
```

**Complete Module:**
```
POST /api/student/modules/:moduleId/complete
  → lifecycle.completedModules.push(moduleId)
  → +750 CP (MODULE_COMPLETION_CP)
  → CPTransaction + notification
```

### Progress Calculation

```
Module progress % = (roomsCompleted + ctfCompleted) / (totalRooms + 1) × 100
```

---

## 5. CP Economy

### Earning CP

| Source | Amount |
|--------|--------|
| Signup bonus | 2,000 CP |
| Room completion | 250 CP minimum (set per room by admin) |
| CTF completion | 500 CP |
| Module completion | 750 CP |
| Admin grant | Any amount |

### Spending CP

```
POST /api/cp/purchase  { productId }
  → Check cpPoints >= product.cpPrice
    ✗ → 400 Insufficient CP
    ✓ → Atomic findOneAndUpdate ($inc cpPoints by -cost)
      → CPTransaction created (type: purchase)
      → Product access granted

GET /api/cp/products/:id/download
  → requireAuth
  → isFree OR CPTransaction(type: purchase) exists?
    ✗ → 403 Purchase required
    ✓ → Stream file from GridFS → response
```

### Rank Thresholds

| CP | Rank |
|----|------|
| 0 | Candidate |
| 150+ | Contributor |
| 450+ | Specialist |
| 900+ | Architect |
| 1500+ | Vanguard |

### Admin CP Controls

| Endpoint | Action |
|----------|--------|
| `POST /api/admin/cp/grant` | Add CP to one or more users |
| `POST /api/admin/cp/deduct` | Remove CP from one or more users |
| `POST /api/admin/cp/set` | Set exact CP value for one or more users |

All operations create a `CPTransaction` record and emit a notification to the user.

---

## 6. Admin Dashboard

### Login

```
POST /api/auth/login  (via /mr-robot page)
  → role = admin → /mr-robot/dashboard
  → Loads: overview + users + content + products + security + contacts + applications
```

### Tabs

**Users**
- Search and paginate all users
- `PATCH /api/admin/users/:id/block` — block/unblock with timestamp
- `PATCH /api/admin/users/:id` — set bootcampAccessRevoked, bootcampStatus, bootcampId
- `DELETE /api/admin/users/:id`

**Bootcamps** (3 sub-tabs)
- *Content* — visual editor for bootcamp metadata, modules, rooms, meeting links, CP rewards per room
- *Phase Access* — toggle "Bootcamp Started", unlock modules and rooms with checkboxes
- *Quizzes* — form-based quiz builder, release quiz to a specific room

**Enrollment Applications**
- `GET /api/admin/bootcamp-applications` — all submitted applications with motivation, level, goal, commitment, phone

**Zero-Day Market**
- Create/edit/delete CP products
- Upload cover image (GridFS `cp-product-images`)
- Upload PDF file (GridFS `cp-products`)
- Set `cpPrice`, `isFree`, `isActive`, `sortOrder`

**Points**
- Grant / deduct / set CP for any user

**Security**
- `GET /api/admin/security/summary` — 24h stats
- `GET /api/admin/security/events` — all 4xx/5xx with IP, path, userId

**Contacts**
- View contact form submissions
- Update status: `new → in_progress → resolved → archived`
- Delete messages

---

## 7. Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `email` | String | unique, lowercase |
| `passwordHash` | String | bcrypt cost 12, never selected by default |
| `name` | String | |
| `hackerHandle` | String | unique display handle |
| `bio` | String | |
| `organization` | String | |
| `role` | String | `student` or `admin` |
| `cpPoints` | Number | default 2000 (signup bonus) |
| `bootcampStatus` | String | `not_enrolled / enrolled / active / completed` |
| `bootcampId` | String | references SiteContent bootcamp id |
| `bootcampAccessRevoked` | Boolean | admin can revoke |
| `emailVerified` | Boolean | |
| `mustChangePassword` | Boolean | |
| `recoveryTokenHash` | String | |
| `blockedUntil` | Date | |

### StudentProfile

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | unique ref to User |
| `snapshot` | Mixed | flexible JSON blob |
| `snapshot.progressState` | Object | `{ modules: { [moduleId]: { rooms: {}, ctfCompleted } } }` |
| `snapshot.activity.visitDates` | Array | ISO date strings for streak calc |
| `snapshot.bootcampApplication` | Object | enrollment form answers |
| `snapshot.onboarding` | Object | onboarding step tracking |
| `snapshot.lifecycle.completedModules` | Array | completed module IDs |

### CPTransaction

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | |
| `productId` | ObjectId | optional, for purchases |
| `type` | String | `credit / debit / purchase / adjustment` |
| `points` | Number | positive = credit, negative = debit |
| `balanceAfter` | Number | snapshot of balance after transaction |
| `note` | String | human-readable reason |
| `metadata` | Object | `{ source, moduleId, roomId, bootcampId }` |

### CPProduct

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | |
| `cpPrice` | Number | 0 if free |
| `isFree` | Boolean | |
| `coverUrl` | String | relative URL to GridFS image |
| `fileId` | ObjectId | GridFS file reference |
| `fileName` | String | |
| `fileMime` | String | |
| `type` | String | `book / tool / etc` |
| `isActive` | Boolean | |
| `sortOrder` | Number | |

### BootcampRoomSession

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | |
| `bootcampId` | String | |
| `moduleId` | Number | |
| `roomId` | Number | |
| `meetingLink` | String | link that was opened |
| `openCount` | Number | incremented each open |
| `firstOpenedAt` | Date | |
| `lastOpenedAt` | Date | |

Unique index: `{ userId, bootcampId, moduleId, roomId }`

### Quiz

| Field | Type | Notes |
|-------|------|-------|
| `scope` | Object | `{ type, id, courseId, moduleId }` |
| `title` | String | |
| `message` | String | notification message on release |
| `questions` | Array | `[{ id, text, options[], correctIndex }]` |
| `active` | Boolean | |

### QuizSubmission

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | |
| `scope` | Object | matches Quiz scope |
| `score` | Number | 0–100 |
| `correct` | Number | |
| `total` | Number | |
| `passed` | Boolean | score >= 70 |

### SiteContent

Single document (`key: 'site'`) — the CMS for all editable content.

| Field | Notes |
|-------|-------|
| `learn.bootcamps[]` | Array of bootcamp definitions (modules, rooms, cpReward per room) |
| `learn.bootcampAccess` | `{ [bootcampId]: { started, unlockedModules[], unlockedRooms{}, quizRelease{} } }` |
| `learn.bootcampRoomLinks[]` | Per-room meeting link overrides |
| `learn.freeResources[]` | Free learning resources for /learn page |
| `landing` | Hero text, CTA labels |
| `terms` | Terms of service sections |
| `version` | Incremented on every save (conflict detection) |

### Relationships

```
User ──< CPTransaction        (earns and spends)
User ──< Notification         (receives)
User ──< BootcampRoomSession  (opens rooms)
User ──< QuizSubmission       (submits quizzes)
User ──| StudentProfile       (one profile per user)
CPProduct ──< CPTransaction   (purchased via)
```

---

## 8. Security Layers

### Transport
- TLS 1.3 (HTTPS only in production)
- HSTS: 1 year, includeSubDomains, preload

### Application
- **Helmet** — CSP, X-Frame-Options: DENY, Referrer-Policy
- **CORS** — explicit allowedOrigins whitelist (env-configured)
- **CSRF** — double-submit cookie pattern (cookie + `X-CSRF-Token` header must match)
- **Rate limiting** — in-memory per IP:
  - Auth routes: 60 req / 15 min
  - Public routes: 600 req / 15 min
  - All other API: 300 req / 15 min
- **Input sanitizer** — strips all keys starting with `$` or containing `.` from body/query/params

### Authentication
- JWT access token: 15 min, stored in memory only (never localStorage)
- Refresh token: 7 days, httpOnly cookie, rotated on every use, SHA-256 hash stored in DB
- bcrypt cost factor: 12
- Recovery token: SHA-256 stored, acknowledged on first view

### Data
- All CP operations use MongoDB atomic `$inc` — no race conditions
- Files stored in GridFS — no direct filesystem access
- All 4xx/5xx API responses logged to `SecurityEvent` collection with IP, path, userId

---

## 9. File Upload Flow

### Admin uploads a product

```
Admin → multipart/form-data → Multer (memoryStorage)
  → PDF (max 30 MB)  → GridFS bucket: cp-products
  → Image (max 5 MB) → GridFS bucket: cp-product-images

CPProduct saved with:
  fileId, fileName, fileSize, fileMime  (from PDF upload)
  coverUrl = /uploads/cp-products/:filename  (from image upload)
```

### Student downloads a product

```
GET /api/cp/products/:id/download  (requireAuth)
  → isFree?
    Yes → stream from GridFS → response
    No  → CPTransaction(type: purchase) exists?
      No  → 403 Purchase required
      Yes → open GridFS stream by fileId → pipe to response
            Content-Disposition: attachment
            Cache-Control: private, no-store
```

---

## 10. Landing Page Cache Strategy

The landing page uses a two-layer cache to eliminate loading flashes:

### Layer 1 — localStorage snapshot

```
On page load:
  localStorage has snapshot?
    Yes → hydrate React state instantly (no skeleton)
    No  → show skeleton loaders

Then in background (always):
  Parallel fetch:
    GET /api/public/landing-stats   → studentsCount, bootcampsCount, cpPoolSize
    GET /api/public/bootcamps       → bootcamp cards
    GET /api/public/leaderboard     → top operators
    GET /api/public/cp-products     → marketplace items

  → Update React state
  → Write new snapshot to localStorage
  → Warm Cache API with bootcamp/product images
```

### Layer 2 — Cache API (image preloading)

After data loads, bootcamp cover images and product covers are fetched and stored in the browser Cache API so subsequent visits render images instantly.

### What gets cached

| Key | Data |
|-----|------|
| `landing_snapshot` | stats, bootcamps, leaderboard, marketItems |
| Cache API | bootcamp images, product cover images |
