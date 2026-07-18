# Performance

> **Status:** ✅ IMPLEMENTED  
> **Bundler:** Vite 6 with code splitting  
> **Optimizations:** Lazy loading, WebP conversion, chunk splitting

## Build Optimization

**Source:** `vite.config.ts`

### Manual Chunk Splitting

Vite splits vendor code into separate chunks for optimal caching:

| Chunk | Contents |
|-------|----------|
| `three` | Three.js / React Three Fiber |
| `motion` | Motion (Framer Motion) |
| `react` | React + ReactDOM |
| `router` | React Router |
| `radix` | Radix UI primitives |
| `axios` | HTTP client |
| `lucide` | Lucide icons |

### Build Settings

- **Minifier:** esbuild (fastest)
- **Target:** ES2020
- **Sourcemaps:** Disabled in production
- **Chunk size warning:** 800KB limit

## Lazy Loading

All route pages are lazy-loaded:

```tsx
const DashboardPage = lazy(() => import('../features/student/pages/DashboardPage'));
```

Wrapped in `<Suspense>` with `<PageLoader />` fallback.

## Image Optimization

**Plugin:** `vite-plugin-webp-conversion`

- Automatic WebP conversion during build
- Sharp-based image processing
- Original images retained as fallback

## Animation Performance

- **GSAP:** ScrollTrigger animations (scroll-linked)
- **Motion:** Page transitions, micro-interactions
- **Reduced motion:** Respected via `useReducedMotion()` and `MotionConfig`
- **CSS transforms:** Hardware-accelerated (translate, scale, opacity)

## Bundle Analysis

Run `npm run build` to see chunk sizes in terminal output.

Key metrics to watch:
- Main bundle should be under 500KB gzipped
- Vendor chunks should be under 200KB gzipped each
- Total initial load under 1MB gzipped

## Runtime Performance

- **Virtual scrolling:** Not implemented (content fits viewport)
- **Debounced inputs:** Search, filters use debounced state
- **Intersection Observer:** ScrollReveal animations
- **requestAnimationFrame:** useNavInvert hook
- **Passive event listeners:** Scroll, resize handlers
