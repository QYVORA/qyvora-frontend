/**
 * Hacker Protocol Bootcamp — Per-Room Walkthrough Content
 * Bootcamp ID: bc_1775270338500
 *
 * Keys match the real moduleId + roomId from bootcamp.config.js.
 * Image paths resolve to:
 *   /HPB-Walkthrough-images/module{moduleId}/room{roomId}/{image}
 *
 * To add content for a room, add an entry keyed by `${moduleId}:${roomId}`.
 * No other code changes needed.
 */

export interface WalkthroughStep {
  instruction: string;
  image: string; // filename only — path constructed dynamically
}

export interface RoomWalkthrough {
  walkthroughText: string;
  steps: WalkthroughStep[];
}

/** Build the image path for a step */
export function buildWalkthroughImagePath(
  moduleId: string | number,
  roomId: string | number,
  image: string
): string {
  return `/HPB-Walkthrough-images/module${moduleId}/room${roomId}/${image}`;
}

/**
 * Lookup key: `${moduleId}:${roomId}`
 * e.g. "1:101", "2:201", "3:301"
 */
export const ROOM_WALKTHROUGHS: Record<string, RoomWalkthrough> = {

  // ── MODULE 1: Hacker Mindset ─────────────────────────────────────────────

  '1:101': {
    walkthroughText:
      "When you open a website, you're not just looking at a page. You're looking at a system that was designed to respond to your actions.\n\nMost beginners stop at \"this looks nice.\" We don't.\n\nIn this room, your goal is simple: Start seeing systems instead of surfaces.\n\nLook at the layout. Notice the structure. Where are the inputs? What can you click? What changes when you interact?\n\nYou're not trying to be correct. You're training your brain to ask:\n\"What is happening behind this?\"\n\nThat question is the foundation of everything in this bootcamp.",
    steps: [
      {
        instruction: 'Open the target website in your browser and take a moment to observe the full layout before interacting with anything.',
        image: '01-open-website.png',
      },
      {
        instruction: 'Identify all visible input fields, buttons, and interactive elements on the page.',
        image: '02-identify-inputs.png',
      },
      {
        instruction: 'Click on different elements and observe what changes — note any visual feedback, page transitions, or URL changes.',
        image: '03-interact-observe.png',
      },
    ],
  },

  '1:102': {
    walkthroughText:
      "Every application you use follows a flow.\n\nYou click something → something happens → something is returned.\n\nThat's a system.\n\nIn this room, you'll take a normal app and break it into parts:\n• What the user sees (frontend)\n• What processes the logic (backend)\n• What stores the data\n\nYou're building the habit of breaking complexity into pieces.\n\nBecause once you can break a system down, you can understand it, debug it, and eventually control it.",
    steps: [
      {
        instruction: 'Draw or write out the three layers of the application: frontend, backend, and database.',
        image: '01-three-layers.png',
      },
      {
        instruction: 'Trace a single user action (e.g. clicking Login) through all three layers and describe what happens at each.',
        image: '02-trace-action.png',
      },
      {
        instruction: 'Identify which layer you can see directly and which layers are hidden from the user.',
        image: '03-visible-hidden.png',
      },
    ],
  },

  '1:103': {
    walkthroughText:
      "Offensive security is powerful — and that power comes with responsibility.\n\nIn this room you'll understand the legal and ethical boundaries that define the difference between a security professional and a criminal.\n\nScope matters. Authorization matters. Documentation matters.\n\nEvery engagement you ever run must have explicit written permission. No exceptions.",
    steps: [
      {
        instruction: 'Read through the provided responsible disclosure policy and identify the key boundaries it sets.',
        image: '01-disclosure-policy.png',
      },
      {
        instruction: 'Review a sample scope document — note what is in scope and what is explicitly out of scope.',
        image: '02-scope-document.png',
      },
      {
        instruction: 'Identify the legal framework that applies to unauthorized computer access in your jurisdiction.',
        image: '03-legal-framework.png',
      },
    ],
  },

  // ── MODULE 2: Linux Foundations ──────────────────────────────────────────

  '2:201': {
    walkthroughText:
      "The terminal is not just a tool. It's direct control over your system.\n\nInstead of clicking through folders, you move through them using commands.\n\nAt first, it feels slower. Then it becomes faster. Then it becomes essential.\n\nIn this room, you're learning how to move inside a system without relying on visuals.",
    steps: [
      {
        instruction: 'Open your terminal and run: pwd — this shows your current location in the file system.',
        image: '01-pwd.png',
      },
      {
        instruction: 'Run: ls -la — list all files and folders including hidden ones, with permissions.',
        image: '02-ls-la.png',
      },
      {
        instruction: 'Navigate into a folder using: cd [folder-name] — then run pwd again to confirm your new location.',
        image: '03-cd-navigate.png',
      },
      {
        instruction: 'Use: mkdir test-dir to create a new directory, then cd into it and create a file with: touch test.txt',
        image: '04-mkdir-touch.png',
      },
    ],
  },

  '2:202': {
    walkthroughText:
      "Linux controls who can do what through users, groups, and permissions.\n\nEvery file has an owner, a group, and a set of read/write/execute flags.\n\nUnderstanding this is critical — both for hardening systems and for finding misconfigurations to exploit.",
    steps: [
      {
        instruction: 'Run: whoami and id — identify your current user and the groups you belong to.',
        image: '01-whoami-id.png',
      },
      {
        instruction: 'Run: ls -la on a directory and read the permission string (e.g. -rwxr-xr--) for each file.',
        image: '02-permissions.png',
      },
      {
        instruction: 'Use: chmod 755 [file] to change permissions on a test file, then verify with ls -la.',
        image: '03-chmod.png',
      },
    ],
  },

  '2:203': {
    walkthroughText:
      "Files are where data lives.\n\nBeing able to read them directly is a basic but powerful skill.\n\nWhen you use commands like cat, you are bypassing interfaces and accessing raw content.\n\nThis is a shift:\nFrom using systems → to interacting with them directly.",
    steps: [
      {
        instruction: 'Navigate to a directory that contains a text file, then run: cat [filename] to display its contents.',
        image: '01-cat-file.png',
      },
      {
        instruction: 'Use: less [filename] to read a longer file one screen at a time. Press Q to exit.',
        image: '02-less-file.png',
      },
      {
        instruction: 'Use: head [filename] and tail [filename] to view just the beginning and end of a file.',
        image: '03-head-tail.png',
      },
      {
        instruction: 'Run: ps aux to list all running processes. Pipe it through grep: ps aux | grep [name]',
        image: '04-ps-aux.png',
      },
    ],
  },

  '2:204': {
    walkthroughText:
      "Bash scripting lets you automate repetitive tasks — recon, enumeration, file processing.\n\nA script is just a sequence of commands saved to a file and made executable.\n\nStart simple. One command at a time. Then chain them together.",
    steps: [
      {
        instruction: 'Create a new file: nano hello.sh — write a simple script that echoes \"Hello, Operator\" and saves it.',
        image: '01-create-script.png',
      },
      {
        instruction: 'Make it executable: chmod +x hello.sh — then run it: ./hello.sh',
        image: '02-run-script.png',
      },
      {
        instruction: 'Add a variable to your script: NAME="Operator" and use it in the echo statement.',
        image: '03-variables.png',
      },
      {
        instruction: 'Add a for loop that iterates over a list of IP addresses and pings each one.',
        image: '04-for-loop.png',
      },
    ],
  },

  // ── MODULE 3: Networking ─────────────────────────────────────────────────

  '3:301': {
    walkthroughText:
      "Before you understand applications, you need to understand communication.\n\nYour computer is constantly talking to other systems. Every packet follows rules — protocols — that define how data is structured and routed.\n\nThe OSI model gives you a mental map of those layers.\nTCP/IP is the real-world implementation you'll work with every day.",
    steps: [
      {
        instruction: 'Open your terminal and run: ping google.com — observe the IP address and response times.',
        image: '01-ping.png',
      },
      {
        instruction: 'Run: traceroute google.com (or tracert on Windows) — watch each hop your packet takes.',
        image: '02-traceroute.png',
      },
      {
        instruction: 'Map the OSI layers to what you just observed: which layer does ping operate at? Which does traceroute reveal?',
        image: '03-osi-mapping.png',
      },
    ],
  },

  '3:302': {
    walkthroughText:
      "Humans use names. Computers use numbers.\n\nWhen you type a website like google.com, your system doesn't understand that directly. It needs an IP address.\n\nDNS is what translates that name into something computers can use.\n\nHTTP is how your browser and the server talk once the connection is made.\n\nEvery user-friendly layer hides a technical process underneath.",
    steps: [
      {
        instruction: 'In your terminal, run: nslookup google.com — identify the DNS server and the IP returned.',
        image: '01-nslookup.png',
      },
      {
        instruction: 'Run: curl -v http://example.com — read the raw HTTP request and response headers.',
        image: '02-curl-http.png',
      },
      {
        instruction: 'Identify the status code, the Content-Type header, and the server header in the response.',
        image: '03-http-headers.png',
      },
    ],
  },

  '3:303': {
    walkthroughText:
      "Every system exposes services through ports.\n\nSome are open. Some are closed.\n\nTools like Nmap allow you to discover what a system is exposing to the outside world.\n\nYou're not attacking anything here. You're observing.\n\nYou're learning how systems reveal information about themselves, often without realizing how much they expose.",
    steps: [
      {
        instruction: 'Confirm Nmap is installed: nmap --version',
        image: '01-nmap-version.png',
      },
      {
        instruction: 'Run a basic scan on the target IP provided by your instructor: nmap [target-ip]',
        image: '02-basic-scan.png',
      },
      {
        instruction: 'Run a service version scan: nmap -sV [target-ip] — identify what software is running on each open port.',
        image: '03-service-scan.png',
      },
      {
        instruction: 'Review the scan results — list every open port, its service, and its version.',
        image: '04-read-results.png',
      },
    ],
  },

  '3:304': {
    walkthroughText:
      "Packet analysis is reading the actual data moving across a network.\n\nWireshark captures every packet and lets you inspect it layer by layer.\n\nThis is how you see what's really happening — not what an application tells you is happening.",
    steps: [
      {
        instruction: 'Open Wireshark and select your active network interface. Click the blue shark fin to start capturing.',
        image: '01-start-capture.png',
      },
      {
        instruction: 'Open a browser and visit http://example.com — then stop the capture in Wireshark.',
        image: '02-capture-traffic.png',
      },
      {
        instruction: 'Filter for HTTP traffic: type "http" in the filter bar and press Enter.',
        image: '03-filter-http.png',
      },
      {
        instruction: 'Click on an HTTP GET request — expand the layers and read the raw request data.',
        image: '04-inspect-packet.png',
      },
    ],
  },

  // ── MODULE 4: Web & Backend Systems ─────────────────────────────────────

  '4:401': {
    walkthroughText:
      "Every website you see is built using structure and style.\n\nThe browser hides this from normal users. DevTools exposes it.\n\nWhen you inspect a page, you're seeing:\n• The structure (HTML)\n• The styling (CSS)\n• The requests being made\n\nYou're looking at the real version of the page, not just the polished surface.",
    steps: [
      {
        instruction: 'Open any website in Chrome or Firefox. Press F12 to open DevTools.',
        image: '01-open-devtools.png',
      },
      {
        instruction: 'In the Elements tab, hover over different HTML elements and observe how they highlight on the page.',
        image: '02-elements-tab.png',
      },
      {
        instruction: 'Open the Network tab, reload the page, and watch all the requests populate.',
        image: '03-network-tab.png',
      },
      {
        instruction: 'Click on the main document request — inspect the Request Headers and Response Headers.',
        image: '04-request-headers.png',
      },
    ],
  },

  '4:402': {
    walkthroughText:
      "The OWASP Top 10 is the industry-standard list of the most critical web application security risks.\n\nEvery web penetration tester works through this list.\n\nIn this room you'll understand what each category means and why it matters — before you start exploiting them.",
    steps: [
      {
        instruction: 'Open the OWASP Top 10 reference provided by your instructor. Read through each category name and its description.',
        image: '01-owasp-list.png',
      },
      {
        instruction: 'For each of the top 3 risks, write one sentence explaining what the vulnerability is and one sentence on how it could be exploited.',
        image: '02-owasp-notes.png',
      },
      {
        instruction: 'Open the demo application and identify which OWASP categories might apply based on what you can observe.',
        image: '03-identify-risks.png',
      },
    ],
  },

  '4:403': {
    walkthroughText:
      "SQL Injection is one of the oldest and most impactful vulnerabilities in web security.\n\nIt happens when user input is inserted directly into a database query without sanitization.\n\nThe attacker controls the query. The database executes it.\n\nYou're not guessing. You're watching:\n• Requests being made\n• Data being transferred\n• Systems responding",
    steps: [
      {
        instruction: 'Open the demo app login page. Open DevTools Network tab before submitting anything.',
        image: '01-open-demo-app.png',
      },
      {
        instruction: "In the username field, type: ' OR '1'='1 — observe what happens when you submit.",
        image: '02-sqli-payload.png',
      },
      {
        instruction: 'Check the Network tab — inspect the request payload and the server response.',
        image: '03-inspect-payload.png',
      },
      {
        instruction: 'Try a different payload in the search field and observe how the query changes the results returned.',
        image: '04-search-sqli.png',
      },
    ],
  },

  '4:404': {
    walkthroughText:
      "XSS (Cross-Site Scripting) lets an attacker inject JavaScript into a page that other users will see.\n\nCSRF (Cross-Site Request Forgery) tricks a user's browser into making requests they didn't intend.\n\nBoth attacks target the user — not the server directly.",
    steps: [
      {
        instruction: 'Open the demo app comment or search field. Try entering: <script>alert(1)</script>',
        image: '01-xss-payload.png',
      },
      {
        instruction: 'Observe whether the script executes or is escaped. Check the page source to see how the input was handled.',
        image: '02-xss-result.png',
      },
      {
        instruction: 'Review the CSRF example provided — identify the missing token and explain how the attack would work.',
        image: '03-csrf-example.png',
      },
    ],
  },

  '4:405': {
    walkthroughText:
      "Authentication is the front door of every application.\n\nWeak authentication means anyone can walk in.\n\nIn this room you'll test for broken auth: weak passwords, session token exposure, and credential stuffing vectors.",
    steps: [
      {
        instruction: 'Open the demo app login. Open DevTools Network tab. Submit a login attempt and inspect the request.',
        image: '01-login-request.png',
      },
      {
        instruction: 'Look at the response — is the session token visible? Is it in a cookie or a response body?',
        image: '02-session-token.png',
      },
      {
        instruction: 'Try logging in with common weak credentials (admin/admin, admin/password) and observe the responses.',
        image: '03-weak-creds.png',
      },
      {
        instruction: 'Check if the application rate-limits failed login attempts — try 10 rapid failed logins and observe.',
        image: '04-rate-limit.png',
      },
    ],
  },

  // ── MODULE 5: Social Engineering ─────────────────────────────────────────

  '5:501': {
    walkthroughText:
      "Phishing is the most common initial access vector in real-world attacks.\n\nIt works because it targets humans — not systems.\n\nIn this room you'll understand how phishing emails and pretexting scenarios are constructed, so you can recognize and defend against them.",
    steps: [
      {
        instruction: 'Review the sample phishing email provided by your instructor. Identify every social engineering technique used.',
        image: '01-phishing-email.png',
      },
      {
        instruction: 'Check the email headers — identify the true sender address vs the display name.',
        image: '02-email-headers.png',
      },
      {
        instruction: 'Hover over (do not click) the links in the email — note the actual destination URL vs the displayed text.',
        image: '03-link-inspection.png',
      },
    ],
  },

  '5:502': {
    walkthroughText:
      "OSINT — Open Source Intelligence — is the practice of gathering information about a target using only publicly available sources.\n\nBefore any attack, reconnaissance happens.\n\nThe more you know about a target, the more precise and effective your attack can be.",
    steps: [
      {
        instruction: 'Using only public sources, find the following about the target organization: headquarters location, key employees, and tech stack.',
        image: '01-osint-target.png',
      },
      {
        instruction: 'Use Google dorking: site:[target.com] filetype:pdf — find any publicly exposed documents.',
        image: '02-google-dork.png',
      },
      {
        instruction: 'Check the target on Shodan or Censys — identify any exposed services or devices.',
        image: '03-shodan.png',
      },
    ],
  },

  '5:503': {
    walkthroughText:
      "Physical security is often the weakest link.\n\nTailgating, badge cloning, and dumpster diving are real attack vectors used in red team engagements.\n\nIn this room you'll understand how physical intrusion works and what controls prevent it.",
    steps: [
      {
        instruction: 'Review the physical security assessment checklist provided — identify which controls are present and which are missing.',
        image: '01-security-checklist.png',
      },
      {
        instruction: 'Watch the tailgating scenario video — identify the exact moment the attacker gains unauthorized access.',
        image: '02-tailgating.png',
      },
      {
        instruction: 'List three physical security controls that would have prevented the attack in the scenario.',
        image: '03-controls.png',
      },
    ],
  },
};
