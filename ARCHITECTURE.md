# HSOCIETY Platform — Frontend Architecture Reference

> Read this before touching any frontend code. It covers the full request lifecycle, component structure, routing, auth flow, and every feature area.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build | Vite 6 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 4 |
| HTTP | Axios |
| Animations | Motion (Framer Motion) |
| 3D | Three.js |
| Icons | Lucide React |

---

## Directory Structure

```
hsociety-frontend/src/
├── app/
│   ├── main.tsx          # React root mount
│   ├── App.tsx           # Context providers wrapper
│   └── router.tsx        # All routes + guards
├── core/
│   ├── contexts/
│   │   ├── AuthContext.tsx   # Auth state, login/logout, user object
│   │   ├── ThemeContext.tsx  # Dark/light theme
│   │   └── ToastContext.tsx  # Global toast notifications
│   ├── hooks/
│   │   ├── useCountUp.ts    # Animated number counter
│   │   └── useScrollY.ts    # Scroll position tracker
│   ├── services/
│   │   └── api.ts           # Axios instance with interceptors
│   └── utils/               # (empty — add shared utilities here)
├── features/
│   ├── admin/
│   │   ├── components/
│   │   │   └── BootcampManager.tsx  # Full bootcamp CMS (4 sub-tabs)
│   │   └── pages/
│   │       └── AdminDashboardPage.tsx  # Admin console (7 tabs)
│   ├── auth/
│   │   └── pages/           # Login, Register, ForgotPassword, etc.
│   ├── marketing/
│   │   ├── components/      # Landing page sections
│   │   ├── content/         # Static content (terms, etc.)
│   │   ├── data/            # Static data arrays
│   │   ├── hooks/           # Marketing-specific hooks
│   │   └── pages/           # LandingPage, ServicesPage, ContactPage, etc.
│   └── student/
│       ├── components/      # Dashboard widgets, course components
│       └── pages/           # DashboardPage, BootcampPage, etc.
├── shared/
│   ├── components/
│   │   ├── brand/           # Logo components
│   │   ├── icons/           # Custom SVG icons
│   │   ├── ui/              # Reusable UI primitives
│   │   ├── CpLogo.tsx       # Cyber Points logo
│   │   ├── ScrollReveal.tsx # Intersection observer animation wrapper
│   │   └── ScrollToTop.tsx  # Route change scroll reset
│   ├── layouts/
│   │   ├── AdminLayout.tsx   # Admin shell (no nav — admin has its own sidebar)
│   │   ├── PublicLayout.tsx  # Marketing shell (Navbar + Footer)
│   │   └── StudentLayout.tsx # Student shell (sidebar nav)
│   ├── pages/
│   │   └── NotFoundPage.tsx
│   └── utils/
│       └── resolveImg.ts    # Image URL resolver (public/ vs remote)
└── styles/
    └── index.css            # Tailwind base + custom CSS variables
```

---

## Request Lifecycle

```
User Action
  ↓
React Component
  ↓
api.ts (Axios instance)
  ├── Request interceptor: attaches X-CSRF-Token header from cookie
  ↓
Backend API (https://api.hsociety.com/api/v1/...)
  ↓
Response interceptor:
  ├── 401 → clear auth state → redirect /login
  ├── 403 verificationRequired → show email verification prompt
  └── 2xx → return data to component
```

### Axios instance (`core/services/api.ts`)
- Base URL from `VITE_API_URL` env variable
- `withCredentials: true` (sends cookies)
- Request interceptor reads `csrfToken` cookie and adds `X-CSRF-Token` header
- Response interceptor handles 401 globally

---

## Route Map

### Public routes (PublicLayout — Navbar + Footer)

| Path | Page |
|------|------|
| `/` | Landing Page |
| `/services` | Services |
| `/contact` | Contact |
| `/cyber-points` | Cyber Points explainer |
| `/leaderboard` | Leaderboard |
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

### Route Guards

```
StudentOnly guard:
  not authenticated → /login
  role = admin      → /mr-robot/dashboard
  role = student    → render children

AdminOnly guard:
  not authenticated → /mr-robot (admin login)
  role = student    → /dashboard
  role = admin      → render children
```

---

## Auth Flow

### State (AuthContext)

```
AuthContext provides:
  user: User | null
  loading: boolean
  login(email, password) → void
  logout() → void
  refreshUser() → void
```

### Login sequence

```
1. POST /api/v1/auth/login
2. Backend sets httpOnly cookies: accessToken, refreshToken, csrfToken
3. AuthContext stores user object in React state (NOT localStorage)
4. Router redirects based on role
```

### Session persistence

```
On app load (App.tsx):
  GET /api/v1/auth/me
    ✓ → set user in AuthContext
    ✗ → user = null (not logged in)
```

### Token refresh

Handled transparently by the backend via the `refreshToken` cookie. The frontend does not manually refresh tokens — the backend rotates them on each `/auth/refresh` call.

---

## Admin Dashboard

`AdminDashboardPage.tsx` is a single-page admin console with 7 tabs:

| Tab | Key | Description |
|-----|-----|-------------|
| User Management | `users` | Search, paginate, block, delete users |
| Bootcamp Management | `bootcamps` | Full CMS via `BootcampManager` component |
| Enrollment Applications | `applications` | View submitted enrollment forms |
| Zero-Day Market | `zero_day` | Create/edit/delete CP products |
| Points Management | `cp` | Grant/deduct/set CP for any user |
| Security Management | `security` | 24h stats + event log |
| Contact Messages | `contacts` | View/update/delete contact submissions |

### BootcampManager sub-tabs

| Sub-tab | Description |
|---------|-------------|
| Content | Edit bootcamp metadata, modules, rooms, meeting links, CP rewards |
| Phase Access | Toggle bootcamp started, unlock modules/rooms per bootcamp |
| Quizzes | Build and release quizzes to specific rooms |
| Room Completion | Admin-mark rooms complete for enrolled students |

### Layout notes (important for future fixes)

The admin dashboard uses a fixed-height layout to prevent content overflow:

```
div.h-screen.overflow-hidden          ← root, locks viewport
  aside.h-screen.overflow-y-auto      ← desktop sidebar, scrolls independently
  div.h-screen.overflow-hidden        ← main column
    header (mobile only, sticky)
    main.flex-1.min-h-0.overflow-y-auto  ← scrollable content area
      div.flex-1.min-h-0.flex.flex-col   ← content wrapper
        section (per tab)
```

All table wrappers use `maxHeight: calc(100vh - Xrem)` with `overflow-auto` to prevent unbounded growth.

---

## Student Learning Flow

```
/bootcamps
  → GET /api/v1/public/bootcamps (no auth)
  → GET /api/v1/student/overview (auth — checks enrollment)

  isActive = false  → Locked modal
  not enrolled      → Enrollment Modal (5-step form)
  enrolled          → /bootcamps/:id

/bootcamps/:id
  → GET /api/v1/student/course?bootcampId=X
  → Renders modules + rooms with lock states

Room actions:
  Join session  → POST .../session-open → opens meetingLink
  Take quiz     → GET/POST .../quiz
  Mark complete → POST .../complete → grants CP + notification
  Complete CTF  → POST .../ctf/complete → +500 CP
  Complete module → POST .../complete → +750 CP
```

---

## CP Economy (Frontend)

| Source | Amount |
|--------|--------|
| Signup bonus | 2,000 CP |
| Room completion | 250 CP minimum |
| CTF completion | 500 CP |
| Module completion | 750 CP |

### Rank display

| CP | Rank |
|----|------|
| 0 | Candidate |
| 150+ | Contributor |
| 450+ | Specialist |
| 900+ | Architect |
| 1500+ | Vanguard |

---

## Landing Page Cache Strategy

Two-layer cache to eliminate loading flashes:

```
Layer 1 — localStorage snapshot:
  On load: localStorage has snapshot? → hydrate instantly (no skeleton)
  Always in background: fetch stats + bootcamps + leaderboard + products
  → update state → write new snapshot to localStorage

Layer 2 — Cache API (image preloading):
  After data loads: fetch bootcamp/product images → store in Cache API
  → subsequent visits render images instantly
```

---

## Environment Variables

```env
VITE_API_URL=https://api.hsociety.com   //  fix thiswe dont have a domain we are using render
```

All other config is handled at build time via Vite.

---

## Adding a New Feature

1. Create `src/features/<name>/` with `pages/` and `components/` subdirs
2. Add routes to `src/app/router.tsx`
3. If it needs auth, wrap with the appropriate guard
4. If it needs a new layout, add to `src/shared/layouts/`
5. Shared UI primitives go in `src/shared/components/ui/`
6. Feature-specific hooks go in `src/features/<name>/hooks/` or `src/core/hooks/` if reusable

## Breaking Down Large Components

If a component exceeds ~300 lines, extract sub-components:
- `AdminDashboardPage.tsx` → tab sections can be extracted to `features/admin/components/tabs/`
- `BootcampManager.tsx` → sub-tabs are already separate functions, can be moved to `features/admin/components/bootcamp/`
- Marketing page sections → already in `features/marketing/components/`
