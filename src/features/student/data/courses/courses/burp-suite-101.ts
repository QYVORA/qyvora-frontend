import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('burp-1', 'What is Burp Suite?',
      `**Burp Suite** is the most widely used web application security testing tool. It sits between your browser and the target server, letting you intercept, inspect, and modify all HTTP traffic.

Burp Suite Community Edition (free) includes:

- **Proxy** — intercepts requests between browser and server
- **Repeater** — resend and manually tweak requests
- **Intruder** — automated fuzzing and brute-force attacks
- **Decoder** — encode/decode data (Base64, URL, hex)
- **Target** — site map and scope management

Burp Suite Professional adds a web vulnerability scanner and advanced features.

Download the free Community Edition from portswigger.net. Java is required to run it.

\`\`\`bash
# Run Burp Suite (after downloading)
java -jar burpsuite_community.jar
\`\`\``),

    l('burp-2', 'Setting Up the Proxy',
      `Burp's **Proxy** is the core feature. It captures HTTP traffic between your browser and the target.

**Step 1: Configure Burp as a proxy**
1. Open Burp Suite → Proxy → Proxy Settings
2. Default listener: \`127.0.0.1:8080\`
3. Make sure "Intercept is on"

**Step 2: Configure your browser**

In Firefox:
1. Settings → Network Settings → Manual proxy
2. HTTP Proxy: \`127.0.0.1\` Port: \`8080\`
3. Check "Also use this proxy for HTTPS"

**Step 3: Install Burp's CA certificate**

For HTTPS traffic, Burp needs to decrypt the SSL/TLS:
1. Visit \`http://burpsuite\` in the configured browser
2. Download \`cacert.cer\`
3. Firefox: Settings → Privacy & Security → Certificates → Import
4. Check "Trust this CA to identify websites"

Now all your traffic flows through Burp:

\`\`\`bash
# Every request appears in Burp's Intercept tab
# Press "Forward" to send it to the server
# Press "Drop" to discard it
\`\`\`

You can now see, modify, or block every request before it reaches the server.`),

    l('burp-3', 'Intercepting Requests',
      `With the proxy running, you can **intercept** requests and modify them in real time before they reach the server.

When you submit a form or click a link, Burp pauses the request:

\`\`\`http
POST /login HTTP/1.1
Host: vulnerable-site.com
Cookie: session=abc

username=admin&password=secret123
\`\`\`

You can edit anything before forwarding:
- Change \`username\` to \`admin' OR '1'='1\` (SQL injection test)
- Change \`role=user\` to \`role=admin\`
- Modify \`Cookie\` values
- Add or remove headers
- Change HTTP method (\`GET\` to \`POST\`)

\`\`\`http
# Modified request with SQL injection
POST /login HTTP/1.1
Host: vulnerable-site.com

username=admin' --&password=
\`\`\`

**Keyboard shortcuts:**
- \`Forward\` — send the modified request
- \`Drop\` — discard the request
- \`Action\` — send to Repeater, Intruder, or other tools
- Toggle Intercept on/off with the big "Intercept is on" button

Use the **Target** tab to see the site map — every page and resource Burp has seen.`),

    l('burp-4', 'Repeater Tool',
      `**Repeater** allows you to take a request, modify it, and resend it multiple times. This is useful for exploring how a server responds to different inputs.

Send a request to Repeater:
1. Intercept a request (or find one in HTTP History)
2. Right-click → "Send to Repeater" (or press Ctrl+R)

In Repeater:
\`\`\`http
GET /api/user?id=1 HTTP/1.1
Host: target.com
\`\`\`

Click "Send" to see the response. Then modify:

\`\`\`http
GET /api/user?id=2 HTTP/1.1
Host: target.com
\`\`\`

Click "Send" again. Compare responses. This is called **IDOR testing** — checking if you can access another user's data by changing an ID parameter.

**Use cases for Repeater:**
- Test parameter tampering (\`?admin=true\`, \`?debug=1\`)
- Test SQL injection variants
- Try different HTTP methods
- Manipulate headers (\`X-Forwarded-For: 127.0.0.1\`)
- Test rate limiting by sending rapid requests

Each request and response stays in its own tab so you can compare results side by side.`),

    l('burp-5', 'Intruder Tool',
      `**Intruder** automates attacks by sending many requests with different payloads. It's used for brute-force attacks, fuzzing, and parameter enumeration.

**Setup:**
1. Send a request to Intruder (right-click → "Send to Intruder")
2. Highlight the parameter you want to fuzz and click "Add §" (or just highlight and hit Ctrl+Space, then the auto-selected positions appear with §)
3. The payload position is marked with \`§\`:

\`\`\`http
GET /api/user?id=§1§ HTTP/1.1
\`\`\`

4. Go to the "Payloads" tab
5. Choose a payload type (Simple list, Numbers, Brute force, etc.)
6. Add payloads or load a wordlist

**Attack types:**
- **Sniper** — one payload position, one payload set (default)
- **Battering ram** — same payload into multiple positions
- **Pitchfork** — different payloads for different positions
- **Cluster bomb** — every combination of multiple payload sets

\`\`\`http
# Example: fuzzing for hidden files
GET /§FUZZ§ HTTP/1.1
Host: target.com

# Payload list: admin, backup, test, .git, .env, config
\`\`\`

Results are color-coded by response length and status code. Different responses often indicate valid discoveries.

**Rate limiting:** Intruder is fast. Use "Resource pool" to set delays if you don't want to overwhelm the target or get blocked.`),

    l('burp-6', 'Practical Exercise',
      `Let's walk through a real test scenario.

**Target:** \`http://testphp.vulnweb.com\` (a deliberately vulnerable site from Acunetix)

\`\`\`bash
# Open this URL in your Burp-configured browser
http://testphp.vulnweb.com
\`\`\`

**Exercise 1: Intercept a login form**
1. Navigate to the site
2. Find a login or search form
3. Intercept the POST request
4. Try modifying the input (add special characters, change values)
5. Forward and observe the response

**Exercise 2: Use Repeater for parameter fuzzing**
1. Send a \`GET /product.php?id=1\` request to Repeater
2. Change \`id\` to different values (2, 3, 10, ' , -1)
3. Observe which responses contain different data
4. Look for SQL error messages (they indicate SQL injection)

**Exercise 3: Intruder brute-force**
1. Find a login form
2. Send it to Intruder
3. Set username as fixed (\`admin\`) and password as payload position
4. Use a small password list (common passwords)
5. Run the attack and look for different response lengths

**What to look for:**
- \`500\` errors — server-side issues that might leak information
- Different response lengths — could indicate valid credentials
- SQL errors in responses — potential SQL injection
- Stack traces — reveal technology and file paths
- \`Set-Cookie\` headers — session handling behavior

The more you practice with Burp, the more patterns you'll recognize in web applications.`, { hasQuiz: true, quiz: [
        { id: 'burp-6-q1', question: 'What is the difference between Burp Repeater and Intruder?', options: ['Repeater is for manual tests, Intruder for automated', 'Repeater is faster', 'Intruder is for proxy only', 'They do the same thing'], correctIndex: 0, explanation: 'Repeater sends one request at a time for manual testing. Intruder automates many requests with different payloads.' },
        { id: 'burp-6-q2', question: 'What does a different response length in Intruder results indicate?', options: ['Server error', 'Possible valid finding', 'Network issue', 'Rate limiting'], correctIndex: 1, explanation: 'Different response lengths often indicate a different server response, which can mean a valid discovery like a found directory or correct credential.' },
      ] }),

    l('burp-7', 'Burp Collaborator & Out-of-Band Testing',
      `Burp Collaborator is a service that detects out-of-band vulnerabilities like blind XXE, SSRF, and blind SQLi.

**What is Collaborator?**
\`\`\`
Burp Collaborator generates unique subdomains that Burp controls.
If a vulnerability causes the target to make a request to that
subdomain, Burp captures it — even though you never see the response.

This is critical for:
- Blind SQL injection (time-based is slow, out-of-band is instant)
- Blind XXE (force XML parser to fetch external DTD)
- SSRF (make server request your Collaborator server)
- Blind XSS (force browser to ping Collaborator)
\`\`\`

**Using Collaborator:**
1. In Burp Suite: Burp → Burp Collaborator client
2. Click "Copy to clipboard" — you get a unique URL
3. Inject that URL into a potential vulnerability:
\`\`\`http
POST /api/xml HTTP/1.1
Content-Type: application/xml

<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://BURP-COLLABORATOR-ID.burpcollaborator.net">
]>
<search>&xxe;</search>
\`\`\`
4. Click "Poll now" — if the server made a request, you'll see it

**Automated collaborator checks:**
Many Burp Scanner checks automatically use Collaborator to detect out-of-band vulnerabilities. This is why Burp Professional is so effective at finding blind vulnerabilities.`),

    l('burp-8', 'Burp Extensions & BApp Store',
      `Burp's functionality can be extended with plugins from the BApp Store.

**Installing extensions:**
1. Burp → Extender → BApp Store
2. Browse or search for extensions
3. Click "Install"

**Essential extensions for web testing:**
\`\`\`
1. CO2 — SQLi and auth testing macros
2. Autorize — automated authorization testing
3. Logger++ — enhanced HTTP logging with search
4. Turbo Intruder — ultra-fast brute-forcing (Python-based)
5. Content Type Converter — convert request formats
6. ActiveScan++ — enhanced active scanning
7. JWT Editor — decode and forge JWT tokens
8. JSON Web Tokens — JWT attack toolkit
9. Request Timer — measure response times for timing attacks
10. Collaborator Everywhere — add Collaborator URLs to headers
\`\`\`

**Using Turbo Intruder:**
Turbo Intruder uses Python scripts for maximum speed:
\`\`\`python
def queueRequests(target, wordlist):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=10,
                           requestsPerConnection=100)

    for word in wordlist:
        engine.queue(target.req, word)

def handleResponse(req, interesting):
    if '200' in req.response:
        table.add(req)
\`\`\`

**Writing your own extensions:**
Burp extensions can be written in Java, Python (via Jython), or Ruby (via JRuby). The Montoya API (Burp v2023+) provides a modern interface for building extensions.`),

    l('burp-9', 'Advanced Burp Techniques',
      `Master these techniques to level up your Burp Suite skills.

**Match and Replace — auto-modify requests:**
\`\`\`
Proxy → Options → Match and Replace
Automatically modify requests/responses as they pass through:

Match: ^User-Agent:.*$  →  Replace: User-Agent: Googlebot/2.1
Match: Cookie:           →  Replace: Cookie: session=admin

Useful for:
- Spoofing User-Agent on every request
- Removing CSP headers to test XSS
- Bypassing client-side restrictions
\`\`\`

**Session handling rules — automate authentication:**
\`\`\`
Proxy → Options → Session Handling Rules

Create a rule that:
1. Checks if a request returns 302 (redirect to login)
2. If so, posts to the login endpoint
3. Captures the new session cookie
4. Retries the original request with the new cookie

This lets you run Intruder attacks that automatically re-authenticate.
\`\`\`

**Scope and filtering — reduce noise:**
\`\`\`bash
# Set target scope:
# Target → Scope → "Use advanced scope control"
# Add exactly the hosts you want to test

# Filter HTTP History:
# Proxy → HTTP History → Filter bar
# Show only: requests within scope, certain MIME types, certain status codes
\`\`\`

**Comparer — spot the difference:**
\`\`\`
Use Comparer to:
- Compare responses from different parameter values
- Compare responses before and after login
- Spot differences in timing, content length, or error messages
- Identify blind SQLi by comparing true/false responses

Send two responses to Comparer (right-click → "Send to Comparer")
It highlights the exact differences. \`\`\``),
];

export const COURSE: Course = {
  id: 'burp-suite-101',
  title: 'Burp Suite 101',
  categoryId: 'tools',
  description:
    'The industry standard for web application security testing. Learn to intercept, modify, and replay HTTP traffic.',
  overview:
    'Burp Suite is the Swiss Army knife of web security testing. This course teaches you to set up the proxy, intercept requests, use Repeater and Intruder, and analyze web traffic like a professional penetration tester.',
  estimatedMinutes: 65,
  cpCost: 100,
  learningObjectives: [
      'Configure Burp Suite as an intercepting proxy',
      'Intercept, inspect, and modify HTTP requests in real time',
      'Use Repeater to manually craft and resend requests',
      'Use Intruder to automate parameter fuzzing and brute-force attacks',
  ],
  skillLevel: 'intermediate',
  prerequisites: ["web-technologies-101"],
  lessons: LESSONS,
};
