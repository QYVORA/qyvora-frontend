# HSOCIETY OFFSEC — Frontend

React 19 + Vite frontend for the HSOCIETY offensive security training platform.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| Animation | Motion (Framer Motion) |
| 3D Globe | Three.js |
| Icons | Lucide React |
| HTTP | Axios |
| State | Context API (Auth, Theme, Toast) |

## Quick Start

```bash
npm install
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL
npm run dev
```

Runs at `http://localhost:5173`.

## Environment Variables

```env
# Local dev — points to local backend
VITE_API_BASE_URL=http://localhost:3000/api

# Production — points to deployed backend
VITE_API_BASE_URL=https://hsociety-backend.onrender.com/api
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── app/
│   └── router.tsx              # All routes (public, student, admin)
├── core/
│   ├── contexts/               # Auth, Theme, Toast, Modal contexts
│   ├── hooks/                  # useScrollY, useDebounce, etc.
│   └── services/
│       └── api.ts              # Axios instance with interceptors
├── features/
│   ├── auth/
│   │   └── pages/LoginPage.tsx
│   ├── marketing/
│   │   ├── components/
│   │   │   ├── landing/        # HeroSection, EconomySection, etc.
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── HackerGlobe.tsx # Three.js globe
│   │   │   └── HeroCanvas.tsx  # Canvas background
│   │   ├── content/
│   │   │   └── siteConfig.ts   # Nav items, brand config
│   │   └── pages/              # LandingPage, ChainPage, ServicesPage, etc.
│   ├── student/
│   │   ├── components/         # EnrollmentModal, BootcampCard, etc.
│   │   ├── constants/
│   │   │   └── bootcampConfig.ts # Single source of truth for bootcamp structure
│   │   ├── pages/              # Dashboard, Bootcamp, Wallet, Profile, etc.
│   │   └── services/
│   │       └── chain.service.ts # Chain history proxy calls
│   └── admin/
│       ├── components/
│       │   ├── ChainExplorer.tsx # Admin chain block viewer
│       │   └── QuizManager.tsx
│       └── pages/AdminDashboardPage.tsx
└── shared/
    ├── components/
    │   ├── brand/Logo.tsx
    │   ├── ChainLogo.tsx       # HSOCIETY Chain logo component
    │   ├── CpLogo.tsx          # Cyber Points logo component
    │   └── ScrollReveal.tsx
    ├── layouts/                # PublicLayout, StudentLayout, AdminLayout
    └── utils/
        └── resolveImg.ts

public/
├── images/
│   ├── bootcamp-room-images/   # Per-phase room card images
│   ├── cp-images/              # Cyber Points logo + visual
│   ├── HSOCIETY_LOGO.png       # Main dark logo
│   ├── HSOCIETY_LOGO_LIGHT.png # Main light logo
│   ├── HSOCIETY-H-LOGO.webp    # H mark only
│   ├── HSOCIETY_CHAIN_LOGO.png # Chain logo 512×512
│   └── HPB-image.png           # Hacker Protocol Bootcamp hero image
├── HPB-Walkthrough-images/     # Step-by-step walkthrough images
├── _headers                    # Netlify/Vercel response headers
├── _redirects                  # Netlify SPA redirect rule
└── robots.txt
```

## Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/chain` | Public | CP + HSOCIETY Chain explainer |
| `/cyber-points` | Public | Redirects to `/chain` |
| `/leaderboard` | Public | Operator leaderboard |
| `/zero-day-market` | Public | Marketplace preview |
| `/services` | Public | Services page |
| `/contact` | Public | Contact form |
| `/login` | Public | Login / Register |
| `/dashboard` | Student | Main dashboard |
| `/bootcamps` | Student | Bootcamp list |
| `/bootcamps/:id` | Student | Curriculum map |
| `/bootcamps/:id/phases/:phaseId/rooms/:roomId` | Student | Room walkthrough |
| `/wallet` | Student | CP wallet + chain ledger |
| `/profile` | Student | Operator profile |
| `/mr-robot/dashboard` | Admin | Admin console |

## Deployment

Deployed on Vercel. Every push to `master` triggers a production deploy.

```bash
# Build
npm run build

# Preview locally
npm run preview
```

Set `VITE_API_BASE_URL` in the Vercel project environment variables.
