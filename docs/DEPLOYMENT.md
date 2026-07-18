# Deployment

> **Status:** ✅ IMPLEMENTED  
> **Platform:** Netlify  
> **Domain:** qyvora.com

## Platform

**Hosting:** Netlify
**Domain:** qyvora.com (configured in Netlify dashboard)

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
| `/icon-*.png` | `public, max-age=31536000, immutable` |

## PWA Assets

Service worker and manifest served with `no-cache` to ensure updates propagate.

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
