# Performance

> **Status:** ✅ IMPLEMENTED  
> **Last Updated:** 2026-10-07  
> **Bundler:** Vite 6.2.0 with code splitting  
> **Optimizations:** Lazy loading, WebP conversion, chunk splitting, PWA caching

## Build Optimization

**Source:** `vite.config.ts`

### Manual Chunk Splitting

Vite splits vendor code into separate chunks for optimal caching:

| Chunk | Contents | Purpose |
|-------|----------|---------|
| `three` | Three.js / React Three Fiber | Isolate large 3D library |
| `motion` | Motion (Framer Motion) | Animation library |
| `react` | React 19.2.7 + ReactDOM | Core framework |
| `router` | React Router 7.18.2 | Client-side routing |
| `radix` | Radix UI primitives | Dialog, Tooltip components |
| `axios` | Axios 1.15.2 HTTP client | API communication |
| `lucide` | Lucide React 0.546.0 icons | Icon library |

### Build Settings

- **Minifier:** esbuild (fastest, built into Vite)
- **Target:** ES2020
- **Sourcemaps:** Disabled in production
- **Chunk size warning:** 800KB limit
- **CSS:** Tailwind CSS 4.1.14 with JIT compilation

## Image Optimization

**Plugin:** `vite-plugin-webp-conversion.ts` (custom)

### Automatic WebP Conversion

- **Source:** Any `.png`, `.jpg`, `.jpeg` in `public/` directory
- **Tool:** Sharp (high-performance image processing)
- **Process:** Converts during dev server startup and build
- **Output:** WebP files alongside originals
- **Quality:** 85 (configurable)
- **Result:** 50-80% smaller file sizes

### Usage

```tsx
// Reference as .webp, plugin handles conversion
<img src="/assets/hero.webp" alt="Hero" />
// Original hero.png automatically converted
```

### Benefits

- **Faster loading:** 50-80% smaller than PNG/JPEG
- **Better compression:** Superior to legacy formats
- **Modern browser support:** 95%+ global coverage
- **Automatic fallback:** Service worker provides offline access

## Animation Performance

- **Motion (Framer Motion):** Page transitions, micro-interactions, semantic block animations
- **Reduced motion:** Respected via `useReducedMotion()` and `MotionConfig`
- **CSS transforms:** Hardware-accelerated (translate, scale, opacity)
- **GSAP:** Deprecated (removed in favor of Motion)

## PWA Caching Strategy

**Service Worker:** `public/sw.js` (hand-written, no Workbox)

### Cache Strategies

| Resource Type | Strategy | Cache Name |
|---------------|----------|------------|
| App shell + static assets | Precache on install | `qyvora-shell-{version}` |
| Same-origin requests | Stale-while-revalidate | `qyvora-runtime-{version}` |
| Navigations | Network-first (4s timeout) → shell → offline.html | — |
| API calls (`/api/*`) | Network only (never cached) | — |

### Precached Assets

**Static entries:**
- `/`, `/index.html`, `/offline.html`
- `/manifest.webmanifest`
- `/favicon.webp`
- `/fonts/jetbrains-latin.woff2`
- All PWA icons (192×192, 512×512, maskable variants)

**Build assets** (injected by `vite-plugin-sw-precache.ts`):
- Entry chunk (hashed filename)
- Vendor chunks (react, router, motion, radix, axios, lucide)
- App CSS (hashed filename)

**Route chunks:** NOT precached (lazy-loaded on demand, ~15MB total)
- Cached in runtime cache when accessed
- Enables offline access to visited routes

### Cache Versioning

- `CACHE_VERSION` is computed from asset list hash
- New build = new cache version
- Old caches purged on service worker activation
- User-controlled updates (no automatic `skipWaiting()`)

## Lazy Loading

All route pages are lazy-loaded:

```tsx
const DashboardPage = lazy(() => import('../features/student/pages/DashboardPage'));
```

Wrapped in `<Suspense>` with `<PageLoader />` fallback.

**Route chunks:**
- Each page is a separate chunk
- Loaded on navigation
- Cached by service worker after first visit
- Available offline once cached

## Bundle Analysis

Run `npm run build` to see chunk sizes in terminal output.

**Target metrics:**
- Main bundle: Under 500KB gzipped
- Vendor chunks: Under 200KB gzipped each
- Total initial load: Under 1MB gzipped
- WebP images: 50-80% smaller than PNG/JPEG

**Current optimizations:**
- Code splitting by route (lazy loading)
- Vendor chunk separation (better caching)
- WebP image format (smaller file sizes)
- Service worker precaching (instant repeat visits)
- Tree shaking (unused code eliminated)

## Runtime Performance

### Optimizations Implemented

- **Debounced inputs:** Search, filters use debounced state to reduce re-renders
- **Intersection Observer:** ScrollReveal animations trigger on visibility
- **Passive event listeners:** Scroll, resize handlers marked passive
- **Memoization:** Expensive computations use `useMemo`, `useCallback`
- **Context optimization:** Auth/Theme/Toast contexts minimize re-renders

### Not Implemented (Not Needed)

- **Virtual scrolling:** Content generally fits viewport, lists are short
- **Image lazy loading:** Most images above fold or immediately visible
- **Component virtualization:** No long lists requiring windowing

## Performance Best Practices

**For developers adding new features:**

1. **Images:** Add PNG/JPEG to `public/`, reference as `.webp` in code
2. **Routes:** Use `lazy()` for all page components
3. **Heavy libraries:** Check if already in vendor chunks, avoid duplicates
4. **Animations:** Use Motion, respect `prefers-reduced-motion`
5. **API calls:** Use Axios client from `core/services/api.ts` (includes interceptors)
6. **State:** Prefer local state, use context sparingly
7. **Memoization:** Profile first, optimize hot paths only

## Monitoring

**Tools:**
- Chrome DevTools → Lighthouse (Performance, PWA, SEO scores)
- Network tab → Check chunk sizes, caching headers
- Performance tab → Profile runtime performance
- Coverage tab → Identify unused code

**Key metrics to track:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

**PWA metrics:**
- Offline functionality: All visited routes
- Install eligibility: Passed manifest + service worker requirements
- Cache hit rate: Monitor via service worker logs
- Update frequency: New build detection within 1 hour
