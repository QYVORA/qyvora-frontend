# Progressive Web App

> **Status:** ✅ IMPLEMENTED — whole-site scope  
> **Service Worker:** app-shell precache + runtime caching, offline navigations  
> **Install:** browser install prompt (with iOS instructions)  
> **Updates:** announced in-app, applied on accept

## Overview

QYVORA is a Progressive Web App covering the **entire site** — public marketing
pages, tools and simulators as well as the student dashboard. `start_url` and
`scope` are both `/`, and the worker is registered from the app entry
(`src/app/main.tsx`), not from a shell, so every route is installable and works
offline once cached.

| Piece | Source |
|-------|--------|
| Manifest | `public/manifest.webmanifest` |
| Service worker | `public/sw.js` (+ `vite-plugin-sw-precache.ts` at build time) |
| Offline fallback | `public/offline.html` |
| Icons | `public/icons/*` (generated) |
| Icon generator | `scripts/generate-pwa-icons.mjs` (`npm run icons:pwa`) |
| Service / registration | `src/core/services/pwa.ts` |
| React bindings | `src/core/hooks/usePWA.ts` |
| UI host | `src/shared/components/layout/PwaStatus.tsx` |

## Manifest

- `id: "/"`, `start_url: "/?source=pwa"`, `scope: "/"` — whole site.
- `display: standalone` with `display_override` fallback to `minimal-ui`/`browser`.
- `theme_color: #06B66F` (accent), `background_color: #000000`.
- **Icons are real PNGs** (WebP manifest icons are not universally supported):
  - `icon-192.png`, `icon-512.png` — `purpose: any`
  - `icon-maskable-192.png`, `icon-maskable-512.png` — `purpose: maskable`,
    mark inside the inner 80% safe zone, background bleeding to every edge
  - `apple-touch-icon.png` (180×180) — iOS home screen
  - Regenerate with `npm run icons:pwa` (renders `public/favicon.webp` artwork
    onto the brand near-black canvas via `sharp`).
- **Shortcuts:** Dashboard, Learn, Terminal simulator.

## Service Worker

`public/sw.js` — hand-written, no Workbox. Stale caches are deleted on
`activate`.

| Request | Strategy |
|---------|----------|
| `/api/*`, `/uploads/*`, `/sw.js`, `/manifest.webmanifest`, `/offline.html` | network only (never cached) |
| Navigations (`request.mode === 'navigate'`) | network-first with a 4 s timeout → cached app shell (`/index.html`) → `/offline.html` |
| Everything else same-origin | stale-while-revalidate into the runtime cache |
| Cross-origin (Google Fonts) | untouched — left to the network + HTTP cache |

**App shell precache** (installed once per build):

- static entries: `/`, `/index.html`, `/offline.html`, `/manifest.webmanifest`,
  `/favicon.webp`, `/fonts/jetbrains-latin.woff2` and every icon
- `BUILD_ASSETS`: the hashed **static import graph of the entry chunks** —
  entry chunk, vendor imports (react, router, motion, radix, axios, lucide) and
  the app CSS — injected by `vite-plugin-sw-precache.ts`

Each entry is cached individually, so one unavailable asset cannot fail the
install.

Route chunks are **not** precached: they are dynamic imports and the whole set is
~15 MB (`HpbAvatar` alone is 1.2 MB), which would turn every student's first
visit into a massive download. They are runtime-cached on demand instead, so
any room, course or lab the student has actually opened works offline.

Without the build-time injection a hand-written worker cannot know Vite's hashed
filenames, and the first page load's JS is fetched *before* the worker takes
control — leaving the app unable to boot offline at all.

Navigations fall back to the **shell**, not the last HTML document, so the SPA
boots offline and the client router renders the requested route.

### Per-build cache identity

`vite-plugin-sw-precache.ts` hashes the precached asset list into
`CACHE_VERSION`, so every deploy produces a new `qyvora-shell-*` /
`qyvora-runtime-*` pair and the previous pair is pruned on `activate`. Bump the
version by hand only when the caching behaviour changes without a rebuild.

### Activation is user-driven

The worker never calls `skipWaiting()` on its own. `install` only precaches;
`activate` deletes old caches and claims clients. A new build is announced by
`PwaStatus` ("Update ready" → **Reload**), which posts `SKIP_WAITING` and
reloads once the new worker takes control (`applyUpdate` in
`src/core/services/pwa.ts`). Updates are also re-checked when a tab regains
focus, at most once an hour.

## Install flow

1. `initPWA()` (app entry) registers `/sw.js` and listens for
   `beforeinstallprompt` / `appinstalled`.
2. The captured prompt is mirrored into React through `useInstallPrompt()`
   (`useSyncExternalStore`), so the UI reacts the moment the browser offers it.
3. `InstallBanner` (inside `PwaStatus`) waits for `usePopupManager('install', 5)`.
4. Tapping **Install** calls `promptInstall()` → the browser prompt.
5. Dismissal persists in `localStorage` (`qyvora_install_dismissed`).

**iOS Safari** never fires `beforeinstallprompt`; there `canPrompt` stays false
and `isIos` is true, so the banner shows Share → Add to Home Screen instructions
instead of a dead button. When the app already runs standalone, the banner does
not render at all.

On acceptance the service calls `navigator.storage.persist()` (best-effort) so
the offline shell survives eviction.

## PWA status host

`PwaStatus` is mounted once per shell (`PublicShell` and `AppShell`) and stacks
every passive notice in one fixed column so cards can never overlap:

| Card | Condition |
|------|-----------|
| Update ready | a new worker finished installing |
| `// OFFLINE` | `navigator.onLine === false` |
| Install | `usePopupManager('install', 5)` slot + install eligibility |

The column is `pointer-events-none` and collapses to zero height when empty, so
it never blocks the page underneath.

## Push notifications

`src/core/services/pwa.ts` keeps the push helpers (`tryAutoSubscribePush`,
`subscribeToPush`, `getPushSubscription`, `unsubscribeFromPush`,
`requestNotificationPermission`). `AppShell` calls `tryAutoSubscribePush()` after
the session is authenticated. The worker handles `push` and `notificationclick`:
a notification click focuses an existing tab on the same path, otherwise reuses
any open tab of this origin, otherwise opens a new window.

## Development

- Registration is skipped in dev (a worker caching Vite's module graph breaks
  HMR). Set `VITE_ENABLE_SW_IN_DEV=true` in `.env` to exercise install and
  offline flows locally.
- Serve the production build (`npm run build && npm run preview`) — the worker
  only exists at the site root scope, and `localhost` is treated as secure.

## Caching headers (Netlify)

| Resource | `Cache-Control` |
|----------|-----------------|
| `/assets/*` | `public, max-age=31536000, immutable` |
| `/icons/*` | `public, max-age=86400, stale-while-revalidate` |
| `/sw.js` | `no-cache` |
| `/manifest.webmanifest` | `no-cache` (+ `application/manifest+json`) |
| `/offline.html` | `no-cache` |

## Offline behaviour

- Cached rooms, courses, labs and the terminal simulator boot from the shell.
- `/api` is never cached — API failures surface through the normal error toasts.
- Lab flag verification still needs a network round trip.
- Uncached routes fall back to `public/offline.html`.