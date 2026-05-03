# HSOCIETY OFFSEC — CTF Platform Plan

> **Status:** Planning  
> **Scope:** Browser-native Capture The Flag rooms hosted on a separate Netlify domain, integrated with the main HSOCIETY platform.

---

## 1. Overview

The CTF system is a browser-native hacking challenge platform. Students use their browser's built-in DevTools — no VM, no downloads, no setup. Each challenge is a standalone static HTML "room" hosted on a dedicated Netlify subdomain. The main HSOCIETY app handles authentication, flag submission, CP rewards, and leaderboard tracking.

```
hsociety.com (main app)                ctf-rooms.hsociety.com (Netlify)
────────────────────────               ──────────────────────────────────
Student opens CTF challenge   ──────►  Vulnerable room loads in new tab
Student finds FLAG{...}       ◄──────  Flag is hidden inside the room
Student submits flag          ──────►  Backend validates, awards CP
```

---

## 2. Architecture

### 2.1 Two Repositories, Two Deployments

| Repo | Purpose | Deployment |
|------|---------|------------|
| `hsociety-frontend` | Main app — auth, flag submission, leaderboard | `hsociety.com` |
| `hsociety-ctf-rooms` | Static vulnerable rooms | `ctf-rooms.hsociety.com` (Netlify) |

The CTF rooms repo is **entirely static** — plain HTML, CSS, and JS. No framework, no build step required. Each room is a folder with an `index.html` and optionally a `netlify.toml` for headers, cookies, and redirects.

### 2.2 Room URL Convention

```
https://ctf-rooms.hsociety.com/r/{room-id}/
```

Examples:
- `https://ctf-rooms.hsociety.com/r/html-source-1/`
- `https://ctf-rooms.hsociety.com/r/console-1/`
- `https://ctf-rooms.hsociety.com/r/network-header-1/`

### 2.3 Flag Format

All flags follow this format:

```
FLAG{module_N_category_keyword}
```

Examples:
- `FLAG{m1_html_ghost_in_the_source}`
- `FLAG{m1_console_hidden_in_plain_sight}`
- `FLAG{m1_header_x_marks_the_spot}`

Flags are **static strings hardcoded into each room** at build time. The backend stores the same string (or its SHA-256 hash) and validates submissions by comparison. No dynamic generation needed for Phase 1.

### 2.4 Backend Storage

Each `CTFChallenge` document in MongoDB gains one field:

```js
roomUrl: String  // e.g. "https://ctf-rooms.hsociety.com/r/html-source-1/"
```

The `/student/ctf/:moduleId/scenario` endpoint already returns challenge data — `roomUrl` is added to the response so the frontend can render the "Launch Room" button.

### 2.5 Frontend Integration

The existing `CtfPage` (`/ctf/:moduleId`) gets a **"Launch Room"** button that opens the room URL in a new tab. The flag input and submission flow remain unchanged.

```
┌─────────────────────────────────────────┐
│  CTF Challenge — Module 1               │
│  Category: HTML Source  Difficulty: Easy│
│                                         │
│  [description of the scenario]          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🚀  Launch Room  (new tab)     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  FLAG{...} ________________________     │
│  [ Submit Flag ]                        │
└─────────────────────────────────────────┘
```

---

## 3. Room Design

### 3.1 Visual Theme

Every room shares a consistent HSOCIETY terminal aesthetic:

- **Background:** `#050706` (matches main app `--color-bg`)
- **Text:** `#eef4ec` (matches `--color-text-primary`)
- **Accent:** `#B7FF99` (matches `--color-accent`)
- **Font:** JetBrains Mono (loaded from Google Fonts)
- **Layout:** Centered card with a scenario description, a fake UI element relevant to the challenge, and a subtle "HSOCIETY CTF" watermark in the corner

Each room looks like a **real (but fake) website** relevant to its scenario — a fake login page, a fake blog, a fake API dashboard — to make the challenge feel authentic. The scenario description is shown as a terminal-style briefing at the top.

### 3.2 Shared Room Template

Every room uses a shared `_base.html` template structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Room Title] — HSOCIETY CTF</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/shared/room.css" />
  <!-- Challenge-specific meta/script tags go here -->
</head>
<body>
  <!-- HSOCIETY CTF watermark -->
  <div class="watermark">HSOCIETY CTF</div>

  <!-- Scenario briefing terminal -->
  <div class="terminal-briefing">
    <span class="prompt">operator@hsociety:~$</span>
    <span class="briefing-text">[scenario description]</span>
  </div>

  <!-- Fake website content (challenge-specific) -->
  <main class="room-content">
    <!-- ... -->
  </main>
</body>
</html>
```

A shared `/shared/room.css` file provides the base styles. Each room only needs to add its own content and the hidden flag.

---

## 4. Phase 1 — Room Catalogue (10 Rooms)

All Phase 1 rooms are tied to **Module 1 of the Hacker Protocol Bootcamp**.

---

### Room 01 — HTML Source
**ID:** `html-source-1`  
**Flag:** `FLAG{m1_html_ghost_in_the_source}`  
**Scenario:** A fake company "NovaCorp" internal portal. The developer left a comment in the HTML with the flag.  
**How to solve:** Press `Ctrl+U` (View Page Source) and search for `FLAG`.  
**Hidden in:** An HTML comment `<!-- FLAG{...} -->` inside the `<body>`.  
**Netlify config:** None needed.

---

### Room 02 — DevTools Console
**ID:** `console-1`  
**Flag:** `FLAG{m1_console_hidden_in_plain_sight}`  
**Scenario:** A fake "SecureVault" login page. The developer accidentally left a debug log in the JavaScript.  
**How to solve:** Open DevTools → Console tab. The flag is logged on page load.  
**Hidden in:** `console.log('%c' + atob('RkxBR3ttMV9jb25zb2xlX2hpZGRlbl9pbl9wbGFpbl9zaWdodH0='), 'color:#B7FF99')`  
**Netlify config:** None needed.

---

### Room 03 — Network Header
**ID:** `network-header-1`  
**Flag:** `FLAG{m1_header_x_marks_the_spot}`  
**Scenario:** A fake "OpsDesk" API status page. The server is leaking sensitive data in a custom response header.  
**How to solve:** Open DevTools → Network tab → reload → click the document request → Headers → find `X-CTF-Flag`.  
**Hidden in:** Custom response header `X-CTF-Flag: FLAG{m1_header_x_marks_the_spot}`  
**Netlify config:**
```toml
[[headers]]
  for = "/r/network-header-1/*"
  [headers.values]
    X-CTF-Flag = "FLAG{m1_header_x_marks_the_spot}"
```

---

### Room 04 — Cookie
**ID:** `cookie-1`  
**Flag:** `FLAG{m1_cookie_crumble_the_session}`  
**Scenario:** A fake "AuthPortal" session manager. The session token contains the flag.  
**How to solve:** Open DevTools → Application → Cookies → find `session_token`.  
**Hidden in:** Cookie `session_token=FLAG{m1_cookie_crumble_the_session}` set via `netlify.toml` header or inline JS `document.cookie`.  
**Netlify config:**
```toml
[[headers]]
  for = "/r/cookie-1/*"
  [headers.values]
    Set-Cookie = "session_token=FLAG{m1_cookie_crumble_the_session}; Path=/"
```

---

### Room 05 — Robots.txt
**ID:** `robots-1`  
**Flag:** `FLAG{m1_robots_disallow_the_truth}`  
**Scenario:** A fake "CipherCorp" public website. The robots.txt is hiding something it shouldn't.  
**How to solve:** Navigate to `/r/robots-1/robots.txt` in the browser.  
**Hidden in:** `robots.txt` file:
```
User-agent: *
Disallow: /admin/
Disallow: /FLAG{m1_robots_disallow_the_truth}/
```
**Netlify config:** None needed — just a `robots.txt` file in the room folder.

---

### Room 06 — Base64 Decode
**ID:** `base64-1`  
**Flag:** `FLAG{m1_base64_encoded_secrets}`  
**Scenario:** A fake "DataVault" dashboard showing an "encrypted" activation key. It's just Base64.  
**How to solve:** Copy the visible string → open DevTools Console → run `atob('...')`.  
**Hidden in:** A visible `<code>` element on the page showing the Base64-encoded flag. The page also shows a hint: "Activation Key (Base64 encoded)".  
**Netlify config:** None needed.

---

### Room 07 — JS Variable
**ID:** `js-variable-1`  
**Flag:** `FLAG{m1_js_variable_source_dive}`  
**Scenario:** A fake "AdminPanel" dashboard. The developer stored an API key in a JavaScript variable.  
**How to solve:** Open DevTools → Sources tab → find `app.js` → search for `apiKey` or `FLAG`.  
**Hidden in:** An external `app.js` file loaded by the page:
```js
const _apiKey = 'FLAG{m1_js_variable_source_dive}';
// TODO: remove before production
```
**Netlify config:** None needed.

---

### Room 08 — Meta Tag
**ID:** `meta-1`  
**Flag:** `FLAG{m1_meta_data_never_lies}`  
**Scenario:** A fake "PulseMedia" blog. The CMS left a debug meta tag in the page head.  
**How to solve:** Press `Ctrl+U` → search for `<meta` tags in the `<head>`.  
**Hidden in:**
```html
<meta name="debug-token" content="FLAG{m1_meta_data_never_lies}" />
```
**Netlify config:** None needed.

---

### Room 09 — Redirect Chain
**ID:** `redirect-1`  
**Flag:** `FLAG{m1_redirect_follow_the_trail}`  
**Scenario:** A fake "LinkVault" URL shortener. Following the redirect chain reveals the flag in the final destination URL path.  
**How to solve:** Open DevTools → Network tab → enable "Preserve log" → click the link → follow the redirect chain → the final URL contains the flag.  
**Hidden in:** A chain of Netlify redirects ending at a URL path containing the flag:
```toml
[[redirects]]
  from = "/r/redirect-1/go"
  to   = "/r/redirect-1/hop1"
  status = 302

[[redirects]]
  from = "/r/redirect-1/hop1"
  to   = "/r/redirect-1/FLAG{m1_redirect_follow_the_trail}"
  status = 302
```
The final destination page displays "You found the end of the chain."  
**Netlify config:** As above.

---

### Room 10 — HTTP Status
**ID:** `status-1`  
**Flag:** `FLAG{m1_status_418_im_a_teapot}`  
**Scenario:** A fake "BrewAPI" coffee machine API. One endpoint returns an unusual HTTP status code — the flag is the status code name.  
**How to solve:** Open DevTools → Network tab → click "Check Brew Status" button → observe the response status code (418).  
**Hidden in:** The page makes a fetch to `/r/status-1/brew` which returns HTTP 418. The flag encodes the status name.  
**Netlify config:**
```toml
[[redirects]]
  from   = "/r/status-1/brew"
  to     = "/r/status-1/brew-response.html"
  status = 418
```
**Netlify config:** As above.

---

## 5. CTF Rooms Repository Structure

```
hsociety-ctf-rooms/
├── netlify.toml                  ← global headers + redirects
├── shared/
│   ├── room.css                  ← shared terminal theme styles
│   └── room.js                   ← shared utilities (watermark, briefing animation)
├── r/
│   ├── html-source-1/
│   │   └── index.html
│   ├── console-1/
│   │   └── index.html
│   ├── network-header-1/
│   │   └── index.html
│   ├── cookie-1/
│   │   └── index.html
│   ├── robots-1/
│   │   ├── index.html
│   │   └── robots.txt
│   ├── base64-1/
│   │   └── index.html
│   ├── js-variable-1/
│   │   ├── index.html
│   │   └── app.js
│   ├── meta-1/
│   │   └── index.html
│   ├── redirect-1/
│   │   ├── index.html            ← entry page with the link
│   │   └── index.html (final)    ← destination page
│   └── status-1/
│       ├── index.html
│       └── brew-response.html
└── README.md
```

---

## 6. Backend Changes Required

### 6.1 CTFChallenge Model

Add `roomUrl` field to the existing `CTFChallenge` Mongoose schema:

```js
roomUrl: {
  type: String,
  default: null,
  // e.g. "https://ctf-rooms.hsociety.com/r/html-source-1/"
}
```

### 6.2 Scenario Endpoint

The existing `/student/ctf/:moduleId/scenario` response already returns `challenge`. Add `roomUrl` to the serialised output so the frontend can render the Launch Room button.

### 6.3 Flag Validation

No changes needed. The existing flag submission endpoint compares the submitted string against the stored flag. Since flags are static strings, this works as-is.

### 6.4 Seed Data

Add a seed script `scripts/seeds/ctf-phase1.mjs` that creates the 10 Phase 1 challenges with their flags and `roomUrl` values. Run once against the dev and production databases.

---

## 7. Frontend Changes Required

### 7.1 CtfPage — Launch Room Button

In `hsociety-frontend/src/features/student/pages/CtfPage.tsx`, add a "Launch Room" button below the challenge description that opens `challenge.roomUrl` in a new tab:

```tsx
{challenge.roomUrl && (
  <a
    href={challenge.roomUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-primary flex items-center gap-2 w-fit"
  >
    <ExternalLink className="w-4 h-4" /> Launch Room
  </a>
)}
```

### 7.2 Public CTF Page

Already created at `/ctf` — no additional changes needed for Phase 1.

---

## 8. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Flag scraping from room HTML | Flags are not secret — the challenge is knowing *where* to look, not *what* the flag is. Obfuscation (Base64, comments) is intentional difficulty, not security. |
| Flag sharing between students | Acceptable for Phase 1. Phase 2 can introduce per-user dynamic flags via a token in the room URL. |
| CORS on the CTF domain | Rooms open in a new tab — no cross-origin requests from the main app to the room domain. No CORS config needed. |
| Netlify rate limiting | Static sites have no rate limit concerns. The main app's submission endpoint already has rate limiting. |
| XSS in room pages | Rooms are read-only static pages. No user input is accepted. No XSS surface. |

---

## 9. Phase 2 — Future Rooms (Post Phase 1)

Once Phase 1 is live and validated, the following room types can be added:

| Category | Description |
|----------|-------------|
| `localStorage` | Flag stored in `localStorage` — find it in Application → Local Storage |
| `websocket` | Flag sent over a WebSocket message — find it in Network → WS tab |
| `css_content` | Flag set as CSS `content` property on a pseudo-element |
| `svg_hidden` | Flag hidden inside an SVG `<desc>` or `<title>` element |
| `form_hidden` | Flag in a hidden `<input type="hidden">` field |
| `timing_attack` | Flag revealed by measuring response time differences |
| `csp_header` | Flag embedded in the `Content-Security-Policy` header |
| `etag` | Flag in the `ETag` response header |

---

## 10. Build & Deploy Checklist

### CTF Rooms Repo
- [ ] Create `hsociety-ctf-rooms` GitHub repository
- [ ] Build all 10 Phase 1 rooms
- [ ] Write shared `room.css` and `room.js`
- [ ] Configure `netlify.toml` with all headers and redirects
- [ ] Deploy to Netlify → set custom domain `ctf-rooms.hsociety.com`
- [ ] Test all 10 rooms manually — verify each flag is findable

### Backend
- [ ] Add `roomUrl` field to `CTFChallenge` schema
- [ ] Update scenario endpoint to include `roomUrl` in response
- [ ] Write and run `ctf-phase1.mjs` seed script
- [ ] Verify flag submission works for all 10 flags

### Frontend
- [ ] Add "Launch Room" button to `CtfPage`
- [ ] Verify public `/ctf` marketing page links correctly
- [ ] Verify Navbar and Footer CTF links work

### QA
- [ ] Test full flow: enroll → open CTF → launch room → find flag → submit → CP awarded
- [ ] Test on Chrome, Firefox, and Safari (DevTools differ slightly)
- [ ] Test hint unlock and CP deduction
- [ ] Verify leaderboard updates after flag capture

---

## 11. Timeline Estimate

| Phase | Work | Estimate |
|-------|------|----------|
| CTF rooms repo scaffold + shared styles | 1 session | ~2 hrs |
| Build all 10 Phase 1 rooms | 1 session | ~3 hrs |
| Backend: schema + seed + endpoint update | 1 session | ~1 hr |
| Frontend: Launch Room button | < 30 min | — |
| Deploy + DNS + QA | 1 session | ~1 hr |
| **Total** | | **~7–8 hrs** |
