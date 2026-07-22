# QYVORA OFFSEC — Frontend

React 19 + Vite frontend for the QYVORA offensive security training platform.

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
VITE_API_BASE_URL=<YOUR_API_BASE_URL>
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build locally |

## Image Optimization

The project automatically optimizes images to **WebP** for faster loading speeds.

- **Automatic Conversion**: Any `.png`, `.jpg`, or `.jpeg` file added to the `public/` folder is automatically converted to `.webp` during development or build.
- **Invisible Integration**: The development server and build process automatically serve/use the `.webp` versions even if you reference the original extension in your code.
- **Tools used**: `sharp` (for high-performance conversion) and a custom Vite plugin (`vite-plugin-webp-conversion.ts`).

To add a new image:
1. Drop your `.png` or `.jpg` into `public/`.
2. Reference it as `.webp` in your code (e.g., `<img src="/assets/my-image.webp" />`).
3. The plugin handles the rest.

## Code & Folder Structure Rules

### 1. Component Splitting

If a component can be split into smaller, focused sub-components, it **must** be split. This improves maintainability, reusability, and file readability.

- **Single-responsibility**: Each component should do one thing well.
- **Extract sub-components**: When a component has distinct visual/logical sections, extract them into separate files under a folder named after the parent component.
- **Example pattern**: For `HackerGlobe.tsx`, extract `hacker-globe/data.ts`, `hacker-globe/helpers.ts`, `hacker-globe/types.ts`, and keep the main component in `hacker-globe/HackerGlobe.tsx`. Re-export from the original file path.

### 2. File Size Limit

No component file should exceed **250 lines**. If a file exceeds this:
- Extract data constants into a separate file (`data.ts`, `constants.ts`)
- Extract helper/utility functions into `helpers.ts` or `utils.ts`
- Extract type definitions into `types.ts`
- Split the component into sub-components

### 3. Shared Components

If a component is imported by **two or more features** (e.g., used across `auth/`, `student/`, `marketing/`), it must be moved to `src/shared/components/`.

- **Shared UI primitives** go in `src/shared/components/ui/` (e.g., Dialog, BottomSheet, Card, Tooltip)
- **Shared layout components** go in `src/shared/components/layout/` (e.g., Navbar, Footer, BlogsNavbar)
- **Shared brand components** go in `src/shared/components/brand/` (e.g., Logo)
- **Shared backgrounds** go in `src/shared/components/backgrounds/` (e.g., HeroBackground)

Components that depend on feature-specific data (e.g., importing from `features/marketing/content/`) should stay in their feature directory and be imported via the `@/` path alias.

### 4. Folder Structure

```
src/
├── app/
│   ├── App.tsx                    # Root app component
│   ├── main.tsx                   # Entry point
│   └── router.tsx                 # All routes (public, student, admin)
├── core/
│   ├── contexts/                  # Auth, Theme, Toast contexts
│   ├── hooks/                     # useScrollY, useAdaptiveUi, useCountUp, etc.
│   └── services/
│       └── api.ts                 # Axios instance with interceptors
├── features/
│   ├── auth/
│   │   ├── components/            # AuthHero, LoginForm, RegisterForm, etc.
│   │   ├── pages/                 # LoginPage, RegisterPage, etc.
│   │   └── ... (hooks/, services/, validators/ as needed)
│   ├── marketing/
│   │   ├── components/
│   │   │   ├── hacker-globe/      # HackerGlobe sub-components (data, helpers, types)
│   │   │   ├── landing/           # HeroSection, ServicesSection, FinalCtaSection
│   │   │   ├── HackerGlobe.tsx    # Barrel re-export
│   │   │   ├── ContactModal.tsx
│   │   │   └── ServiceRequestModal.tsx
│   │   ├── content/               # Blog content, site config, team data
│   │   ├── hooks/                 # useLandingData, landingCache
│   │   └── pages/                 # LandingPage, BlogsPage, TeamPage, etc.
│   ├── student/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── StudentTopbar.tsx          # Barrel re-export
│   │   │   │   └── StudentTopbar/             # Sub-components:
│   │   │   │       ├── StudentTopbar.tsx      # Main component
│   │   │   │       ├── NotificationsDropdown.tsx
│   │   │   │       ├── MobileNotificationsSheet.tsx
│   │   │   │       ├── MobileMoreSheet.tsx
│   │   │   │       ├── navGroups.ts
│   │   │   │       ├── mobileNav.ts
│   │   │   │       └── types.ts
│   │   │   ├── bootcamp-course/    # CourseHeader, PhaseSection, RoomCard, etc.
│   │   │   ├── bootcamp-room/      # StepCard, CodeBlockRenderer, QuizModal, etc.
│   │   │   ├── profile/            # EditModal
│   │   │   ├── BootcampCard.tsx
│   │   │   ├── RecoveryTokenModal.tsx
│   │   │   └── WelcomeModal.tsx
│   │   ├── constants/
│   │   ├── data/                   # Quiz data
│   │   ├── hooks/                  # useRoomSession
│   │   ├── layouts/                # StudentLayout.tsx
│   │   ├── pages/                  # Dashboard, Bootcamp, Wallet, Profile, etc.
│   │   ├── services/               # Chain service, token balance
│   │   └── utils/                  # rankUtils, studentExperience
│   └── admin/
│       ├── components/
│       │   ├── layout/
│       │   │   ├── AdminTopbar.tsx             # Barrel re-export
│       │   │   └── AdminTopbar/                # Sub-components:
│       │   │       ├── AdminTopbar.tsx         # Main component
│       │   │       ├── NotificationsDropdown.tsx
│       │   │       ├── MobileNotificationsSheet.tsx
│       │   │       ├── MobileMoreSheet.tsx
│       │   │       ├── navGroups.ts
│       │   │       └── types.ts
│       │   ├── chain-explorer/     # ChainExplorer sub-components
│       │   │   ├── ChainExplorer.tsx
│       │   │   ├── BlockCard.tsx
│       │   │   └── types.ts
│       │   ├── cp-analytics/       # BarChart, KpiCard, TradingChart, etc.
│       │   ├── dashboard/          # UsersTab, ContactsTab, SecurityTab, etc.
│       │   ├── ChainExplorer.tsx   # Barrel re-export
│       │   ├── BootcampAccessPanel.tsx
│       │   └── CpAnalytics.tsx
│       ├── constants/
│       ├── pages/                  # AdminDashboardPage
│       └── types/
├── shared/
│   ├── components/
│   │   ├── backgrounds/            # AdinkraBackground, HeroBackground
│   │   ├── brand/                  # Logo
│   │   ├── icons/                  # Brand social icons (Github, LinkedIn, etc.)
│   │   ├── layout/                 # Navbar, Footer, BlogsNavbar, PublicBottomNav
│   │   ├── ui/                     # BottomSheet, Card, Dialog, SimpleHeading, StatCounter, Tooltip
│   │   ├── AdaptiveMode.tsx
│   │   ├── ChainLogo.tsx
│   │   ├── CommunityPopup.tsx
│   │   ├── CookieConsent.tsx
│   │   ├── CpLogo.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── OptionalDecorImage.tsx
│   │   ├── PageLoader.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SEO.tsx
│   │   └── SnapSection.tsx
│   ├── layouts/                    # PublicLayout, SnapPublicLayout, BlogsLayout, LandingLayout
│   ├── pages/                      # NotFoundPage
│   └── utils/                      # cn, cpBalance, formatNumber, resolveImg, storageConsent
├── styles/
│   └── index.css                   # Tailwind CSS v4 entry
└── vite-env.d.ts
```

### 5. Barrel Exports

When refactoring a component into a folder of sub-components:
1. Place the main component file inside the folder (e.g., `ComponentName/ComponentName.tsx`)
2. Create a `ComponentName.tsx` barrel export at the original location that re-exports the default:
   ```ts
   import ComponentName from './ComponentName/ComponentName';
   export default ComponentName;
   ```
3. This keeps all existing imports (`@/features/.../ComponentName`) working.

### 6. Naming Conventions

- **Files**: PascalCase for components (`LoginForm.tsx`), camelCase for utilities (`formatNumber.ts`)
- **Folders**: kebab-case for multi-word folders (`hacker-globe/`, `bootcamp-room/`)
- **Exports**: Default export for main components, named exports for types, constants, and utilities
- **Types**: Co-locate with the component in a `types.ts` file within the component folder

### 7. Imports

- Use the `@/` path alias for imports across the project (configured in `vite.config.ts`)
- Group imports: React → third-party → internal core → shared → features
- No circular dependencies: `shared/` must not import from `features/`

## Project Structure (Current)

```
src/
├── app/
│   └── router.tsx              # All routes (public, student, admin)
├── core/
│   ├── contexts/               # Auth, Theme, Toast, Modal contexts
│   ├── hooks/                  # useScrollY, useAdaptiveUi, etc.
│   └── services/
│       └── api.ts              # Axios instance with interceptors
├── features/
│   ├── auth/
│   │   ├── components/         # AuthHero, LoginForm, PasswordInput, etc.
│   │   └── pages/              # LoginPage, RegisterPage, VerifyEmailPage, etc.
│   ├── marketing/
│   │   ├── components/
│   │   │   ├── hacker-globe/   # HackerGlobe (data, helpers, types, component)
│   │   │   ├── landing/        # HeroSection, ServicesSection, FinalCtaSection
│   │   │   ├── HackerGlobe.tsx # Barrel re-export
│   │   │   ├── ContactModal.tsx
│   │   │   └── ServiceRequestModal.tsx
│   │   ├── content/
│   │   │   └── siteConfig.ts   # Nav items, brand config
│   │   └── pages/              # LandingPage, Blog pages, TeamPage, etc.
│   ├── student/
│   │   ├── components/
│   │   │   ├── layout/StudentTopbar/  # With sub-components
│   │   │   ├── bootcamp-course/
│   │   │   ├── bootcamp-room/
│   │   │   ├── profile/
│   │   │   ├── BootcampCard.tsx
│   │   │   ├── RecoveryTokenModal.tsx
│   │   │   └── WelcomeModal.tsx
│   │   ├── constants/
│   │   │   └── bootcampConfig.ts # Single source of truth for bootcamp structure
│   │   ├── data/
│   │   │   └── quizzes.ts
│   │   ├── layouts/
│   │   │   └── StudentLayout.tsx
│   │   ├── pages/              # Dashboard, BootcampCourse, BootcampRoom, etc.
│   │   └── services/
│   │       ├── chain.service.ts
│   │       └── tokenBalance.service.ts
│   └── admin/
│       ├── components/
│       │   ├── layout/AdminTopbar/    # With sub-components
│       │   ├── chain-explorer/        # ChainExplorer + BlockCard + types
│       │   ├── cp-analytics/          # BarChart, KpiCard, TradingChart, etc.
│       │   ├── dashboard/             # UsersTab, ContactsTab, etc.
│       │   ├── ChainExplorer.tsx      # Barrel re-export
│       │   ├── BootcampAccessPanel.tsx
│       │   └── CpAnalytics.tsx
│       ├── constants/
│       ├── layouts/
│       │   └── AdminLayout.tsx
│       └── pages/AdminDashboardPage.tsx
└── shared/
    ├── components/
    │   ├── backgrounds/         # AdinkraBackground, HeroBackground
    │   ├── brand/Logo.tsx
    │   ├── icons/               # Brand social icons
    │   ├── layout/              # Navbar, Footer, BlogsNavbar, PublicBottomNav
    │   ├── ui/                  # BottomSheet, Card, Dialog, Tooltip, etc.
    │   ├── ChainLogo.tsx
    │   ├── CpLogo.tsx
    │   ├── CookieConsent.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── PageLoader.tsx
    │   ├── ScrollReveal.tsx
    │   ├── ScrollToTop.tsx
    │   ├── SEO.tsx
    │   └── SnapSection.tsx
    ├── layouts/                 # PublicLayout, SnapPublicLayout, BlogsLayout, LandingLayout
    └── utils/
        ├── cn.ts
        ├── cpBalance.ts
        ├── formatNumber.ts
        ├── resolveImg.ts
        └── storageConsent.ts

public/
├── assets/
│   ├── bootcamp/               # Bootcamp covers + phase/room visuals
│   ├── branding/               # Logos + chain branding assets
│   ├── illustrations/          # UI illustration assets
│   ├── sections/               # Section backgrounds and service/curriculum images
│   └── social/                 # Social card thumbnails
├── walkthrough/
│   └── hpb/                    # Step-by-step walkthrough images by phase/room
├── _headers                    # Netlify response headers
├── _redirects                  # Netlify SPA redirect rule
└── robots.txt

docs/
├── CTF_PLAN.md
└── frontend-audits/            # Architecture notes and implementation audit docs
```

## Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/hpb` | Public | Hacker Protocol Bootcamp |
| `/services` | Public | Services page |
| `/courses` | Public | Course catalog |
| `/blogs` | Public | Blog listing |
| `/leaderboard` | Public | Operator leaderboard |
| `/zero-day-market` | Public | Marketplace preview |
| `/anansi` | Public | Anansi CLI |
| `/quiteroot` | Public | QuiteRoot |
| `/team` | Public | Team page |
| `/events` | Public | Events page |
| `/news` | Public | Cyber Feed |
| `/terms` | Public | Terms of Service |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/dashboard` | Student | Main dashboard |
| `/dashboard/bootcamps/:bootcampId` | Student | Curriculum map |
| `/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId` | Student | Room walkthrough |
| `/dashboard/courses/:courseId` | Student | Course lesson |
| `/dashboard/labs` | Student | Attack Labs overview |
| `/dashboard/labs/:labId` | Student | Individual lab |
| `/dashboard/marketplace` | Student | Marketplace |
| `/dashboard/profile` | Student | Operator profile |
| `/dashboard/settings` | Student | Settings |
| `/mr-robot/dashboard` | Admin | Admin dashboard |
| `/:handle` | Public | Public profile |
| `/*` | Public | Catch-all 404 |

## Deployment

Deployed on Netlify. Every push to `master` triggers a production deploy.

```bash
# Build
npm run build

# Preview locally
npm run preview
```

Set `VITE_API_BASE_URL` in the Netlify project environment variables.
