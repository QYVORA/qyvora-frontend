# Progressive Web App

> **Status:** ✅ IMPLEMENTED  
> **Service Worker:** Offline caching enabled  
> **Install:** Browser install prompt with banner

## Overview

QYVORA Frontend is a Progressive Web App with offline support and install capability.

## Manifest

**Source:** `public/manifest.webmanifest`

```json
{
  "name": "QYVORA",
  "short_name": "QYVORA",
  "theme_color": "#06B66F",
  "background_color": "#000000",
  "display": "standalone",
  "icons": [...]
}
```

- Theme color matches accent: `#06B66F`
- Icons generated from `/favicon.png`
- Display mode: standalone (full-screen when installed)

## Service Worker

**Source:** `public/sw.js`

- Caches static assets for offline use
- Network-first strategy for API calls
- Cache-first for static assets
- Manifest and SW served with `Cache-Control: no-cache`

## Install Flow

**Source:** `src/features/student/services/pwa.ts`

1. Browser fires `beforeinstallprompt` event
2. Event captured and stored
3. `InstallBanner` checks `usePopupManager('install', 5)`
4. Install banner shown to user (lowest popup priority)
5. User clicks "Install" → browser install prompt

## Popup Priority

| Priority | Popup |
|----------|-------|
| 1 | Consent banner |
| 2 | Onboarding wizard |
| 3 | Community popup |
| 4 | Promotional system |
| 5 | **Install banner** (highest) |

## Netlify Configuration

**Source:** `netlify.toml`

PWA-specific redirects:
```toml
[[redirects]]
  from = "/sw.js"
  to = "/sw.js"
  status = 200

[[redirects]]
  from = "/manifest.webmanifest"
  to = "/manifest.webmanifest"
  status = 200

[[redirects]]
  from = "/icon-*.png"
  to = "/icon-:splat.png"
  status = 200
```

## Caching Strategy

| Resource | Cache-Control |
|----------|---------------|
| `/assets/*` | `public, max-age=31536000, immutable` |
| `/favicon.ico` | `public, max-age=604800` |
| `/sw.js` | `no-cache` |
| `/manifest.webmanifest` | `no-cache` |
| `/icon-*.png` | `public, max-age=31536000, immutable` |

## Offline Behavior

- Static assets served from cache
- API calls fail gracefully (error toasts)
- Terminal simulator works offline (VFS is client-side)
- Labs require network for flag verification
