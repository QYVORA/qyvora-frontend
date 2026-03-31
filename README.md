# HSOCIETY — Offensive Security Training Platform

A complete React frontend for the HSOCIETY offensive security training platform.

## Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS** (with dark/light theme)
- **React Router v6**
- **Context API** (Auth, Theme, Toast, Modal)
- **Axios** (API service layer, mock-ready)
- **Lucide React** (icons)

---

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Demo Credentials

| Role    | Email                   | Password   |
|---------|-------------------------|------------|
| Student | `student@hsociety.io`   | any value  |
| Admin   | `admin@hsociety.io`     | any value  |

---

## Project Structure

```
src/
├── assets/
├── components/
│   ├── layout/         # Shared layout parts
│   ├── shared/         # Shared components
│   └── ui/             # Reusable UI primitives
│       └── index.jsx   # Button, Card, Input, Badge, StatCard, etc.
├── context/
│   ├── AuthContext.jsx     # Auth state (user, login, logout, register)
│   ├── ModalContext.jsx    # Global modal system
│   ├── ThemeContext.jsx    # Dark/light theme toggle
│   └── ToastContext.jsx    # Toast notification system
├── features/
│   ├── auth/
│   ├── bootcamp/
│   ├── marketplace/
│   ├── wallet/
│   └── admin/
├── hooks/
├── layouts/
│   ├── AdminLayout.jsx     # Admin sidebar + header
│   ├── PublicLayout.jsx    # Public nav + footer
│   └── StudentLayout.jsx   # Student sidebar + header
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── student/
│   │   ├── Dashboard.jsx   # Main student hub
│   │   ├── Bootcamp.jsx    # Phase learning UI
│   │   ├── Marketplace.jsx # Zero-Day Market
│   │   ├── Wallet.jsx      # CP wallet + transactions
│   │   └── Profile.jsx     # XP, rank, leaderboard
│   ├── admin/
│   │   ├── Dashboard.jsx   # Platform overview
│   │   ├── Users.jsx       # User management + ban
│   │   ├── Content.jsx     # PDF/content upload
│   │   └── Marketplace.jsx # Approve/reject listings
│   └── LandingPage.jsx     # Public marketing page
├── services/
│   └── authService.js      # Axios API layer (all endpoints)
├── utils/
│   └── mockData.js         # All mock data (phases, items, users)
├── App.jsx                 # Routes + providers
├── index.css               # Global styles + CSS vars
└── main.jsx
```

---

## Features Built

### Public
- ✅ Landing page (Hero, Flow, Phases, CP System, Ranks, CTA)
- ✅ Login page
- ✅ Register page with password strength indicator

### Student
- ✅ Dashboard (Phase progress, XP, CP, activity feed)
- ✅ Bootcamp (Phase map, module list, locked states)
- ✅ CP Wallet (Balance, earn/spend history)
- ✅ Marketplace (Filter, search, purchase flow)
- ✅ Profile (Edit, rank progress, leaderboard)

### Admin
- ✅ Overview (Stats, recent users, event log)
- ✅ User management (Search, filter, ban/unban)
- ✅ Content upload (Drag & drop, file list)
- ✅ Marketplace control (Approve/reject pending)

### System
- ✅ Dark/Light theme toggle (persistent)
- ✅ Toast notification system (success, error, info, warning)
- ✅ Global modal system (confirm dialogs, purchase confirms)
- ✅ Protected routes by role
- ✅ Responsive layout (mobile + desktop)
- ✅ Skeleton loaders
- ✅ Empty states

---

## API Layer

All API calls are in `src/services/authService.js`. Replace mock logic in `AuthContext.jsx` with real API calls:

```js
// Example: real login
const login = async (email, password) => {
  const { data } = await authService.login(email, password)
  setUser(data.user)
  setToken(data.token)
  ...
}
```

Set your backend URL in `.env`:
```
VITE_API_URL=https://api.yourdomain.com/v1
```

---

## Theme Colors

| Token       | Value     |
|-------------|-----------|
| Accent      | `#1fbf8f` |
| Success     | `#22c55e` |
| Warning     | `#f59e0b` |
| Danger      | `#ef4444` |
| Phase 1     | `#3A3F8F` |
| Phase 2     | `#0EA5E9` |
| Phase 3     | `#22C55E` |
| Phase 4     | `#B8860B` |
| Phase 5     | `#6D28D9` |

---

## Connecting to Backend

1. Update `VITE_API_URL` in `.env`
2. Replace mock logic in `AuthContext.jsx` with real API calls
3. Remove mock data from context, wire to `src/services/authService.js`
4. All service functions are already defined and typed correctly
