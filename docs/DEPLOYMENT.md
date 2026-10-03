# Deployment

> **Status:** ✅ IMPLEMENTED  
> **Platform:** Netlify  
> **Domain:** qyvora.org

## Platform

**Hosting:** Netlify
**Domain:** qyvora.org (configured in Netlify dashboard)

## Build Configuration

**Source:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## Environment Variables

Set in Netlify dashboard (not in repository):

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL |

## SPA Routing

All routes redirect to `index.html` for client-side routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Security Headers

Applied to all responses:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | See CSP section |
| `Permissions-Policy` | Restricted (no camera, mic, etc.) |

## CSP Policy

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https:;
img-src 'self' data: blob: https: http:;
font-src 'self' data: https:;
connect-src 'self' https: http: wss:;
object-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

## Caching

| Resource | Cache-Control |
|----------|---------------|
| `/assets/*` | `public, max-age=31536000, immutable` |
| `/favicon.ico` | `public, max-age=604800` |
| `/sw.js` | `no-cache` |
| `/manifest.webmanifest` | `no-cache` |
| `/icons/*` | `public, max-age=86400, stale-while-revalidate` |
| `/offline.html` | `no-cache` |

## PWA Assets

Service worker and manifest served with `no-cache` to ensure updates propagate.

`vite-plugin-sw-precache` rewrites two placeholders in the emitted `dist/sw.js`
at build time: `CACHE_VERSION` (a hash of the precached asset list, so every
deploy starts a fresh cache pair and prunes the previous one) and `BUILD_ASSETS`
(the hashed entry graph — entry chunk, static vendor imports and CSS). Without
it a hand-written worker cannot know Vite's hashed filenames and the first page
load's JS is never cached. See **[PWA.md](PWA.md)**.

## SEO Assets

Public indexable routes are prerendered at build time (see **[BUILD_PIPELINE.md](BUILD_PIPELINE.md)** and **[SEO.md](SEO.md)**). Netlify serves these static files before applying the `/*` SPA rewrite.

| Asset | Purpose |
|-------|---------|
| `public/robots.txt` | Crawl rules + sitemap declaration |
| `public/sitemap.xml` | Indexable public URLs (keep in sync with prerender routes) |
| `public/404.html` | Static branded 404 page (served at `/404`) |
| `public/og-image.png` | 1200×630 social preview (SVG is not supported by social scrapers) |

**Note:** the catch-all `/* → /index.html 200` returns HTTP 200 for unmatched URLs (soft 404). A true 404 status needs a Netlify function or an explicit `_redirects` route whitelist.

## Google Search Console Verification

Already verified for `qyvora.org` via the DNS TXT record managed through Cloudflare, so nothing is required from this repository for verification to hold.

`public/google47823e83d4a4a338.html` is retained purely as a fallback for re-verifying ownership without DNS access (domain transfer, registrar change). It is redundant today and safe to delete — see `docs/SEO.md` for details.

## Deployment Process

1. Push to `master` branch
2. Netlify auto-builds and deploys
3. Build takes ~12 seconds
4. Deploy preview available for PRs

## Rollback

Netlify maintains deploy history. Rollback to any previous deploy via the Netlify dashboard.

## Monitoring

- Netlify Analytics for traffic
- Console errors via browser dev tools
- No external error tracking (Sentry, etc.) configured
