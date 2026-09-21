# Component Architecture

## App Shell

```
ErrorBoundary (scope="App")
└── MotionConfig (reducedMotion="user")
    └── BrowserRouter
        ├── AdaptiveMode
        ├── ScrollToTop
        └── AppRouter
```

**Source:** `src/app/App.tsx`

The root component is a configuration shell — no visible UI. It wraps the entire app in error handling, motion configuration, and routing.

## Layouts (Lazy-Loaded)

| Layout | Route Scope | Source |
|--------|-------------|--------|
| `PublicShell` | `/`, `/terms`, `/team`, `/hpb`, `/courses`, `/anansi` (tool docs), etc. | `src/shared/layouts/` |
| `AppShell` | `/dashboard/**` | `src/features/student/layouts/` |
| `AdminLayout` | `{ADMIN_PATH}/**` | `src/features/admin/layouts/` |
| `AuthFormLayout` | Auth routes (standalone) | `src/shared/components/layout/` |
| `ImmersiveToolShell` | Full-screen tool routes | `src/shared/components/tools/` |

All layouts are loaded via `React.lazy()` with `<Suspense>` fallback.

## Route Guards

| Guard | Behavior |
|-------|----------|
| `StudentOnly` | Redirects to `/login` if no user; to admin path if `isAdmin` |
| `AdminOnly` | Redirects to `/login` if no user; to `/dashboard` if not admin |

## Component Hierarchy

```mermaid
graph TD
    A[App] --> B[ErrorBoundary]
    B --> C[MotionConfig]
    C --> D[BrowserRouter]
    D --> E[AdaptiveMode]
    D --> F[ScrollToTop]
    D --> G[AppRouter]
    G --> H{Layout?}
    H -->|/| I[PublicShell]
    H -->|/dashboard| K[AppShell]
    H -->|admin| L[AdminLayout]
    H -->|/:handle| M[PublicProfile]
    H -->|/*| N[NotFoundPage]
    I --> O[PublicNavigation + PublicFooter]
    I --> P[Marketing Pages]
    K --> Q[StudentTopbar]
    K --> R[Desktop Rail]
    K --> S[Student Pages]
```

## Shared Components (`src/shared/components/`)

### UI Primitives (`ui/`)

| Component | Purpose |
|-----------|---------|
| `BottomSheet` | Mobile bottom sheet overlay |
| `Card` | Card primitives (CardBase, CardMedia, CardStat) |
| `Dialog` | Radix dialog wrapper with `DialogContent` |
| `SimpleHeading` | Reusable section heading |
| `PageHeader` | Page/section title with back/nav + CTAs |
| `Skeleton` | Loading skeleton placeholder |
| `StatCounter` | Animated number counter |
| `Tooltip` | Radix tooltip wrapper |

### Layout Components (`layout/`)

| Component | Purpose |
|-----------|---------|
| `PublicNavigation` | Public/marketing page navigation |
| `PublicFooter` | Public page footer |
| `AuthFormLayout` | Auth page shell (2-col grid) |
| `socialLinks` | Shared social link data |

### Standalone Components

| Component | Purpose |
|-----------|---------|
| `ErrorBoundary` | Scope-based error capture with fallback UI |
| `ScrollReveal` | Intersection Observer scroll animations |
| `ScrollToTop` | Reset scroll on route change |
| `SEO` | Dynamic meta tags via react-helmet-async |
| `ScenarioCard` | Lab scenario selection card |
| `ShareProfile` | Profile sharing modal |
| `LanguageSwitcher` | i18n language selector |
| `ConsentBanner` | Storage consent notification |
| `CommunityPopup` | Community join prompt |
| `PageLoader` | Full-page loading spinner |
| `Identicon` | Jdenticon-based user avatar |
| `ChainLogo` | QYVORA chain logo |
| `CpLogo` | Cyber Points logo |
| `BootcampBadge` | Bootcamp completion badge |
| `RelatedContent` | Related learning content recommendations |

### Feature Directories

| Directory | Contents |
|-----------|----------|
| `backgrounds/` | GridBoxedBackground, AdinkraBackground decorative patterns |
| `blog/` | Blog content renderer |
| `brand/` | Logo component |
| `carousel/` | Carousel component with auto-play |
| `courses/` | Course-specific components |
| `dashboard/` | EmptyState and dashboard primitives |
| `icons/` | 45+ custom SVG icons (see ICON_SYSTEM.md) |
| `walkthrough/` | WalkthroughLayout and WalkthroughStep |

## Feature Components (`src/features/`)

| Feature | Path | Description |
|---------|------|-------------|
| `admin` | `features/admin/` | Admin dashboard, user management |
| `auth` | `features/auth/` | Login, register, forgot password |
| `marketing` | `features/marketing/` | Landing pages, public pages |
| `student` | `features/student/` | Main student experience (largest) |

### Student Feature Structure

```
features/student/
├── components/
│   ├── layout/          # StudentTopbar (desktop + mobile nav)
│   ├── bootcamp-room/   # StepCard, progress tracking
│   ├── bootcamp-course/ # RoomCard, curriculum browser
│   ├── dashboard/       # DashboardHero, stats widgets
│   ├── SimulatedTerminal/ # Terminal engine
│   └── simulations/     # Lab simulation content
├── constants/           # bootcampConfig (4028 lines)
├── data/                # Static data (courses, labs, quizzes)
├── hooks/               # Student-specific hooks
├── layouts/             # AppShell
├── pages/               # 20+ page components
├── services/            # lab.service, pwa
└── utils/               # Student utilities
```
