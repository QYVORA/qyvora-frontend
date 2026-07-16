# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in QYVORA Frontend, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@qyvora.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a timeline for resolution.

## Security Architecture

### Authentication

- JWT access tokens stored **in-memory only** (never localStorage)
- Refresh tokens in httpOnly cookies (browser-managed)
- CSRF double-submit pattern: token in localStorage + `X-CSRF-Token` header
- Silent token refresh on 401 with automatic retry
- Session hint in localStorage for refresh gating

### Content Security

- DOMPurify for all user-generated HTML content
- CSP headers configured in `netlify.toml`:
  - `default-src 'self'`
  - `script-src 'self'`
  - `object-src 'none'`
  - `frame-ancestors 'none'`
- XSS protection headers enabled
- Referrer-Policy: strict-origin-when-cross-origin

### Network Security

- All API communication over HTTPS
- CORS configuration via backend
- Permissions-Policy restricting browser features (no camera, microphone, etc.)

### Data Protection

- No sensitive data in localStorage (only preferences, CSRF token, session hint)
- No API keys in client-side code
- Environment variables prefixed with `VITE_` for client exposure
- `.env` files in `.gitignore`

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |
| < Latest| No        |

## Security Headers

Configured in `netlify.toml`:

- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Referrer-Policy: strict-origin-when-cross-origin`
