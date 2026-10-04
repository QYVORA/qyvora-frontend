# SEO

> **Status:** ✅ IMPLEMENTED  
> **Production:** https://qyvora.org  
> **Approach:** Static prerendering + client-side `react-helmet-async`

## Overview

QYVORA is a client-side React SPA, so it uses a **two-layer SEO strategy**:

1. **Static head (per route, baked at build time)** — `src/prerender.tsx` (driven by `vite-prerender-plugin`) injects `<title>`, description, canonical, Open Graph, Twitter, and JSON-LD directly into each prerendered `dist/<route>/index.html`. This is what crawlers and social scrapers see without executing JavaScript.
2. **Dynamic head (client-side)** — `src/shared/components/SEO.tsx` manages the same tags at runtime via `react-helmet-async`, covering non-prerendered routes (auth, dashboard) and SPA navigations.

`index.html` is kept intentionally thin: it contains no fallback title/description/OG/Twitter tags (they used to duplicate and override the prerendered per-page tags). It only holds charset, viewport, `theme-color`, favicon, and `og:locale`.

## Static head pipeline

```
index.html (minimal shell)
  └─ vite-prerender-plugin (vite.config.ts → additionalPrerenderRoutes)
       └─ src/prerender.tsx (routeMetadata + head elements per route)
            └─ dist/<route>/index.html  ← crawler-ready static HTML
```

- The prerender plugin runs `prerender()` from `src/prerender.tsx` for every route in `additionalPrerenderRoutes` (`vite.config.ts`).
- `prerender.tsx` looks up `routeMetadata[url]` for per-route `title`/`description`; unknown routes fall back to the homepage defaults.
- It also injects a `<noscript>` block with the route title/description so the static HTML carries text content.
- **JSON-LD must be passed as `children` on the script element, never `props.innerHTML`** — the plugin serializes props literally, so `innerHTML` becomes a bogus attribute (`<script type="application/ld+json" innerHTML="…">`), which Google cannot parse. Use `children: JSON.stringify({…})`.

### Adding a new public page

To give a new public page a correct static head (title, description, canonical, OG/Twitter, JSON-LD):

1. Add the route to `additionalPrerenderRoutes` in `vite.config.ts`.
2. Add a matching entry to `routeMetadata` in `src/prerender.tsx`.
3. Add the URL to `public/sitemap.xml` (with `lastmod`, `changefreq`, `priority`).
4. Render `<SEO title description … />` in the page component (drives the client-side head and, on re-deploy, can be mirrored in `routeMetadata`).

Do **not** add non-indexable/private routes (auth, dashboard, admin, labs/tools) to any of the above.

## SEO component (`src/shared/components/SEO.tsx`)

| Prop | Type | Notes |
|------|------|-------|
| `title` | `string?` | Appended with ` | QYVORA` |
| `description` | `string?` | Falls back to `SITE_CONFIG.brand.description` |
| `image` | `string?` | Absolute or root-relative; defaults to `/og-image.png` |
| `article` | `boolean?` | Sets `og:type: article` |
| `canonical` | `string?` | Defaults to `siteUrl + pathname` |
| `type` | `'website' | 'article' | 'software'` | Reserved for `og:type` (currently only `article` used) |
| `schemaData` | `object?` | Extra JSON-LD; falls back to the default Organization schema |
| `breadcrumbs` | `Array<{ name, item }>?` | Renders `BreadcrumbList` JSON-LD |
| `noindex` | `boolean?` | Sets `noindex,nofollow` robots |

The component always emits: canonical, robots, OG/Twitter (title/description/image/card/site), `og:image:type: image/png`, `og:image:width/height` (1200×630), `theme-color`, and JSON-LD (WebPage + Organization/BreadcrumbList).

## Structured data

| Type | Where | Notes |
|------|-------|-------|
| `WebPage` + `WebSite` (isPartOf) | Every prerendered route (`prerender.tsx`) | Static, crawl-ready |
| `Organization` | Client-side default (`SEO.tsx`); overridden by `schemaData` on the landing page | Single `schemaData || default` — no duplicates |
| `BreadcrumbList` | HPB phase pages, blog posts, service pages (`SEO.tsx` `breadcrumbs` prop) | Client-side |
| `BlogPosting` / `Service` | Not yet implemented | Follow-up — see Known Follow-ups |

## Social sharing

- `og:image` is `/og-image.png` (1200×630, 8-bit PNG) — **SVG and WebP are not supported as social previews** (Facebook, LinkedIn, WhatsApp reject them).
- `og:image:type` is `image/png`; width/height are declared.
- `twitter:card` is `summary_large_image` with `@qyvorasec` as `twitter:site`/`twitter:creator`.
- **Artwork**: the QYVORA **mark alone on the brand black canvas** (`#000000`) — no wordmark, no tagline. One file serves every route, so a shared link to `qyvora.org` or any of its routes renders the same preview.
- Source asset: `public/og-image.svg`. The PNG and WebP are **derived** — never hand-edit them. Regenerate both with `npm run og:image` (`scripts/generate-og-image.mjs`).

## Indexability

**Non-indexable (noindex + robots.txt disallow):** `/admin`, `/dashboard*`, `/api`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/change-password`.

- `public/robots.txt` blocks the paths above and declares the sitemap.
- Pages render `<SEO noindex />` client-side (auth pages, student dashboard, labs/tools).

## 404 handling

- Client-side: `NotFoundPage` (`src/shared/pages/NotFoundPage.tsx`) renders with `<SEO noindex />` so soft-404 URLs are not indexed.
- Static: `public/404.html` is a self-contained branded 404 page (served at `/404`).
- **Known limitation:** the Netlify catch-all `/* → /index.html 200` returns HTTP 200 for any unmatched URL (soft 404). A true 404 status requires a Netlify function or an explicit route whitelist in `public/_redirects` — not yet implemented.

## sitemap.xml and robots.txt

- `public/sitemap.xml` lists the 43 indexable public routes: home, HPB, QOSE, Learn, Tools index + all 14 tool doc pages, Services + 3 detail pages, Simulations + 2 labs, Blog + 8 posts, Zero Day Market, QuietRoot, Cyber Coin, Team, About, Contact, Leaderboard and Terms. **Dashboard routes, auth routes, legacy redirects (`/leaderboard/all`, `/bootcamps`, `/marketplace`, …) and user profile handles (`/:handle`) are excluded.**
- `public/robots.txt` allows crawlers, disallows private sections, and declares `Sitemap: https://qyvora.org/sitemap.xml`.
- Keep the sitemap in sync with `additionalPrerenderRoutes` (`vite.config.ts`) and `routeContent` (`src/prerender.tsx`).
- Tool pages derive their title, description, canonical URL and `SoftwareApplication` JSON-LD in `src/shared/seo/toolSeoCore.ts` from the tool registry plus the tool's own doc file. Both the prerendered head and the client head call the same builder, so they cannot drift. Adding a tool to `data/tools/registry.ts` plus its doc file is all that is required — no per-tool SEO edits.

## Google Search Console verification

**Status: verified.** `qyvora.org` is confirmed in Search Console via the DNS TXT
record managed through Cloudflare. That is the authoritative proof of ownership
and it needs nothing from this repository.

`public/google47823e83d4a4a338.html` is also still committed. It is **redundant,
not required** — DNS verification already covers it. It is kept only as a
fallback: if DNS or Cloudflare access is ever lost (domain transfer, registrar
change), that file lets Search Console re-verify ownership without touching DNS.
It is 61 bytes of static text with no runtime effect. Delete it if you would
rather not carry it; the only consequence is losing that fallback path.

If it is ever replaced, remember the mechanics: put the file GSC provides in
`public/`. Vite copies `public/*` verbatim to the build root, so it lands at
`dist/<token>.html` (= Netlify publish root), and Netlify serves existing files
**before** the `/* → /index.html 200` rewrite, so it stays reachable at
`https://qyvora.org/<token>.html`.

## Known follow-ups

- `BlogPosting` / `Service` / `WebSite`+`SearchAction` structured data (currently only WebPage/Organization/BreadcrumbList).
- Real HTTP 404 status for unmatched routes (Netlify function or `_redirects` whitelist).
- Consolidate security headers: `public/_headers` and `netlify.toml` both define CSP, and their `connect-src` values differ (`'self'` vs `https: http: wss:`).
- Image `width`/`height` + `loading="lazy"` on marketing images to stabilize CLS.
