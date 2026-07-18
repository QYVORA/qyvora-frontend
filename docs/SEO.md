# SEO

> **Status:** ✅ IMPLEMENTED  
> **Library:** react-helmet-async  
> **Component:** `src/shared/components/SEO.tsx`

## Implementation

**Source:** `src/shared/components/SEO.tsx`

Uses `react-helmet-async` for dynamic meta tag management.

## Per-Page SEO

Each page sets its own meta tags:

```tsx
<SEO
  title="QYVORA - Cybersecurity Training Platform"
  description="Learn offensive security through hands-on labs..."
  url="https://qyvora.com/dashboard"
/>
```

## Meta Tags

| Tag | Source |
|-----|--------|
| `title` | Page-specific |
| `description` | Page-specific |
| `og:title` | Same as title |
| `og:description` | Same as description |
| `og:image` | Page-specific or default |
| `og:url` | Canonical URL |
| `twitter:card` | `summary_large_image` |

## Static Routes

All public routes have unique meta descriptions:

| Route | Title Pattern |
|-------|---------------|
| `/` | QYVORA - Cybersecurity Training Platform |
| `/courses` | Courses - QYVORA |
| `/hpb` | Hacker Protocol Bootcamp - QYVORA |
| `/blogs` | Blog - QYVORA |
| `/leaderboard` | Leaderboard - QYVORA |
| `/:handle` | @{handle} - QYVORA |

## Dynamic Routes

Dynamic pages set meta tags based on content:

- Blog posts: title from post data
- Course pages: title from course data
- Profile pages: title from username

## Canonical URLs

Set via `og:url` meta tag. Base URL from environment or hardcoded `https://qyvora.com`.

## Social Sharing

Profile share functionality via `ShareProfile` component:
- Generates shareable link
- Copy to clipboard
- Social media share buttons

## Security Headers

Configured in `netlify.toml`:

- `X-Frame-Options: DENY` (prevents framing)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
