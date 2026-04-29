/**
 * Hacker Protocol Bootcamp — Walkthrough Content
 * Bootcamp ID: bc_1775270338500
 *
 * Image paths resolve to:
 *   /HPB-Walkthrough-images/{phase}/{room}/{image}
 *
 * To add a new phase or room, append to the WALKTHROUGH_PHASES array.
 * No code changes required — the UI is fully content-driven.
 */

export interface WalkthroughStep {
  instruction: string;
  image: string; // filename only — path is constructed dynamically
}

export interface WalkthroughRoom {
  roomId: string;
  title: string;
  walkthroughText: string;
  steps: WalkthroughStep[];
}

export interface WalkthroughPhase {
  phaseId: string;   // e.g. "phase1"
  label: string;     // e.g. "Phase 1"
  title: string;     // e.g. "Mindset & System Thinking"
  rooms: WalkthroughRoom[];
}

export const WALKTHROUGH_BOOTCAMP_ID = 'bc_1775270338500';

export const WALKTHROUGH_PHASES: WalkthroughPhase[] = [
  // ── PHASE 1 ──────────────────────────────────────────────────────────────
  {
    phaseId: 'phase1',
    label: 'Phase 1',
    title: 'Mindset & System Thinking',
    rooms: [
      {
        roomId: 'room1',
        title: 'Observing a System',
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
      {
        roomId: 'room2',
        title: 'Thinking in Systems',
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
    ],
  },

  // ── PHASE 2 ──────────────────────────────────────────────────────────────
  {
    phaseId: 'phase2',
    label: 'Phase 2',
    title: 'Networking',
    rooms: [
      {
        roomId: 'room1',
        title: 'Ping',
        walkthroughText:
          "Before you understand applications, you need to understand communication.\n\nYour computer is constantly talking to other systems. Ping is the simplest way to see that happen.\n\nWhen you run a ping command, you're asking:\n\"Can I reach this system, and how fast?\"\n\nThe response tells you:\n• If the system is reachable\n• How long it takes to respond\n\nThis is your first look at how machines communicate across networks.",
        steps: [
          {
            instruction: 'Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux).',
            image: '01-open-terminal.png',
          },
          {
            instruction: 'Type the command: ping google.com — and press Enter. Observe the output.',
            image: '02-run-ping.png',
          },
          {
            instruction: 'Read the response: identify the IP address, the response time (ms), and whether all packets were received.',
            image: '03-read-response.png',
          },
        ],
      },
      {
        roomId: 'room2',
        title: 'DNS Lookup',
        walkthroughText:
          "Humans use names. Computers use numbers.\n\nWhen you type a website like google.com, your system doesn't understand that directly. It needs an IP address.\n\nDNS is what translates that name into something computers can use.\n\nIn this room, you'll see that translation happen.\n\nThis is a key idea:\nEvery user-friendly layer hides a technical process underneath.",
        steps: [
          {
            instruction: 'In your terminal, run: nslookup google.com — observe the output.',
            image: '01-nslookup.png',
          },
          {
            instruction: 'Identify the DNS server being used and the IP address returned for the domain.',
            image: '02-identify-dns.png',
          },
          {
            instruction: 'Try the same command with a different domain (e.g. github.com) and compare the results.',
            image: '03-compare-domains.png',
          },
        ],
      },
      {
        roomId: 'room3',
        title: 'Nmap Scanning',
        walkthroughText:
          "Every system exposes services through ports.\n\nSome are open. Some are closed.\n\nTools like Nmap allow you to discover what a system is exposing to the outside world.\n\nYou're not attacking anything here. You're observing.\n\nYou're learning how systems reveal information about themselves, often without realizing how much they expose.",
        steps: [
          {
            instruction: 'Open your terminal and confirm Nmap is installed by running: nmap --version',
            image: '01-nmap-version.png',
          },
          {
            instruction: 'Run a basic scan on the target IP provided by your instructor: nmap [target-ip]',
            image: '02-basic-scan.png',
          },
          {
            instruction: 'Review the scan results — identify which ports are open and what services are running on them.',
            image: '03-read-results.png',
          },
        ],
      },
    ],
  },

  // ── PHASE 3 ──────────────────────────────────────────────────────────────
  {
    phaseId: 'phase3',
    label: 'Phase 3',
    title: 'Linux & Terminal',
    rooms: [
      {
        roomId: 'room1',
        title: 'Navigation',
        walkthroughText:
          "The terminal is not just a tool. It's direct control over your system.\n\nInstead of clicking through folders, you move through them using commands.\n\nAt first, it feels slower. Then it becomes faster. Then it becomes essential.\n\nIn this room, you're learning how to move inside a system without relying on visuals.",
        steps: [
          {
            instruction: 'Open your terminal and run: pwd — this shows your current location in the file system.',
            image: '01-pwd.png',
          },
          {
            instruction: 'Run: ls — list all files and folders in your current directory.',
            image: '02-ls.png',
          },
          {
            instruction: 'Navigate into a folder using: cd [folder-name] — then run pwd again to confirm your new location.',
            image: '03-cd-navigate.png',
          },
        ],
      },
      {
        roomId: 'room2',
        title: 'Reading Files',
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
        ],
      },
    ],
  },

  // ── PHASE 4 ──────────────────────────────────────────────────────────────
  {
    phaseId: 'phase4',
    label: 'Phase 4',
    title: 'Web & DevTools',
    rooms: [
      {
        roomId: 'room1',
        title: 'Inspecting a Website',
        walkthroughText:
          "Every website you see is built using structure and style.\n\nThe browser hides this from normal users. DevTools exposes it.\n\nWhen you inspect a page, you're seeing:\n• The structure (HTML)\n• The styling (CSS)\n\nYou're looking at the real version of the page, not just the polished surface.",
        steps: [
          {
            instruction: 'Open any website in Chrome or Firefox. Right-click anywhere on the page and select "Inspect" (or press F12).',
            image: '01-open-devtools.png',
          },
          {
            instruction: 'In the Elements tab, hover over different HTML elements and observe how they highlight on the page.',
            image: '02-elements-tab.png',
          },
          {
            instruction: 'Click on an element in the HTML panel and look at the Styles panel on the right — observe the CSS rules applied to it.',
            image: '03-inspect-styles.png',
          },
        ],
      },
      {
        roomId: 'room2',
        title: 'Network Analysis',
        walkthroughText:
          "Websites are not static.\n\nThey constantly send and receive data.\n\nWhen you open the Network tab, you're watching that communication happen in real time.\n\nEvery request tells a story:\n• What was requested\n• Where it was sent\n• What came back\n\nThis is one of the most important skills in this entire bootcamp.",
        steps: [
          {
            instruction: 'Open DevTools (F12) and click on the Network tab. Make sure recording is active (the red circle should be on).',
            image: '01-network-tab.png',
          },
          {
            instruction: 'Reload the page and watch the requests populate. Click on any request to inspect it.',
            image: '02-reload-watch.png',
          },
          {
            instruction: 'In the request details, explore the Headers, Preview, and Response tabs — understand what data was sent and received.',
            image: '03-request-details.png',
          },
        ],
      },
      {
        roomId: 'room3',
        title: 'Demo App Analysis',
        walkthroughText:
          "Now you connect everything.\n\nYou interact with a web application and observe what happens behind the scenes.\n\nWhen you log in, data is sent. When the system responds, data comes back.\n\nYou're no longer guessing.\n\nYou're watching:\n• Requests being made\n• Data being transferred\n• Systems responding\n\nThis is where systems stop being abstract and start becoming visible.",
        steps: [
          {
            instruction: 'Open the demo application provided by your instructor. Open DevTools Network tab before doing anything.',
            image: '01-open-demo-app.png',
          },
          {
            instruction: 'Fill in the login form and click Submit — watch the Network tab as the request is sent.',
            image: '02-submit-login.png',
          },
          {
            instruction: 'Click on the login request in the Network tab. Inspect the Request Payload to see what data was sent to the server.',
            image: '03-inspect-payload.png',
          },
          {
            instruction: 'Look at the Response — identify the status code, and what data the server returned after login.',
            image: '04-read-response.png',
          },
        ],
      },
    ],
  },

  // ── PHASE 5 ──────────────────────────────────────────────────────────────
  {
    phaseId: 'phase5',
    label: 'Phase 5',
    title: 'Coming Soon',
    rooms: [
      {
        roomId: 'room1',
        title: 'Challenges',
        walkthroughText:
          "This phase will bring everything together through challenges.\n\nYou will apply:\n• Observation\n• Networking knowledge\n• System thinking\n\nUntil then, focus on mastering the earlier phases.",
        steps: [],
      },
    ],
  },
];
