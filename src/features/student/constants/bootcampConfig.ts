/**
 * HACKER PROTOCOL BOOTCAMP — STATIC CONFIG
 * =========================================
 * This is the SINGLE SOURCE OF TRUTH for the bootcamp structure.
 * UI must render ONLY from this config.
 * DO NOT add phases, rooms, or steps that are not defined here.
 *
 * Image paths resolve to:
 *   /HPB-Walkthrough-images/{phaseId}/{roomId}/{image}
 *
 * If an image filename is null → render placeholder.
 */

export interface BootcampStep {
  title: string;
  instruction: string;
  /** Exact filename from the filesystem. null = no image yet → show placeholder. */
  image: string | null;
}

export interface BootcampRoom {
  id: string;          // e.g. "room1"
  title: string;
  overview: string;
  steps: BootcampStep[];
}

export interface BootcampPhase {
  id: string;          // e.g. "phase1"
  title: string;
  codename: string;    // short label shown in sidebar
  rooms: BootcampRoom[];
}

export interface BootcampConfig {
  id: string;
  title: string;
  phases: BootcampPhase[];
}

// ── Image path builder ────────────────────────────────────────────────────────
export function buildStepImagePath(
  phaseId: string,
  roomId: string,
  filename: string
): string {
  return `/HPB-Walkthrough-images/${phaseId}/${roomId}/${filename}`;
}

// ── Config ────────────────────────────────────────────────────────────────────
export const BOOTCAMP_CONFIG: BootcampConfig = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  phases: [
    // ── PHASE 1: MINDSET ────────────────────────────────────────────────────
    {
      id: 'phase1',
      title: 'Mindset',
      codename: 'PHASE 1',
      rooms: [
        {
          id: 'room1',
          title: 'Observing a System',
          overview:
            'When you open a website, you\'re not just looking at a page — you\'re looking at a system designed to respond to your actions. This room trains your brain to see systems instead of surfaces.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open the target website in your browser and take a moment to observe the full layout before interacting with anything. Notice the structure — headers, sections, footers.',
              image: '01-open-website.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Study the overall layout. Where are the navigation elements? What sections exist? Sketch or note the page structure before touching anything.',
              image: '02-layout.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Identify all visible input fields, buttons, forms, and interactive elements on the page. Ask: what can a user submit or trigger here?',
              image: '03-inputs.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Open your notes and write down your observations. What is this system doing? What data does it collect? What actions does it allow?',
              image: '04-notes.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'Thinking in Systems',
          overview:
            'Every application follows a flow: user acts → logic processes → data is returned. This room teaches you to break any app into its core layers.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open your notes application. You\'re going to map out the system you observed in Room 1 into its three core layers: frontend, backend, and database.',
              image: '01-open-notes.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Look at the application again. Identify what the user sees (frontend), what processes the logic (backend), and what stores the data (database).',
              image: '02-app.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Draw or write out the three-layer breakdown. Label each layer and describe what it does in this specific application.',
              image: '03-breakdown.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Trace a single user action — like clicking Login — through all three layers. Describe what happens at each layer when that action is triggered.',
              image: '04-flow.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 2: NETWORKING ─────────────────────────────────────────────────
    {
      id: 'phase2',
      title: 'Networking',
      codename: 'PHASE 2',
      rooms: [
        {
          id: 'room1',
          title: 'Ping & Connectivity',
          overview:
            'Before you understand applications, you need to understand communication. Ping is the most basic tool for testing whether a system is reachable on a network.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open your terminal. This is where you\'ll run all networking commands. Familiarise yourself with the interface before proceeding.',
              image: '01-terminal.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Run the ping command against a known host: ping google.com — observe the output. Note the IP address resolved and the response times.',
              image: '02-ping-command.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Read the ping output carefully. What is the round-trip time? Are all packets returned? What does packet loss indicate about connectivity?',
              image: '03-ping-output.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'DNS Lookup',
          overview:
            'Humans use names. Computers use numbers. DNS translates domain names into IP addresses. Understanding DNS is fundamental to understanding how the internet works.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Run: nslookup google.com in your terminal. Observe the DNS server being queried and the IP address returned for the domain.',
              image: '01-nslookup.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Note the IP address returned. This is the actual address your computer will connect to when you visit that domain. Try nslookup on a few other domains.',
              image: '02-ip.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Nmap Scanning',
          overview:
            'Every system exposes services through ports. Nmap lets you discover what a system is exposing to the outside world. You\'re not attacking — you\'re observing.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Run a basic Nmap scan on the target IP provided by your instructor: nmap [target-ip] — observe which ports are listed as open.',
              image: '01-nmap.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Review the scan results. List every open port and the service associated with it. What does each open port tell you about this system?',
              image: '02-ports.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 3: LINUX ──────────────────────────────────────────────────────
    {
      id: 'phase3',
      title: 'Linux',
      codename: 'PHASE 3',
      rooms: [
        {
          id: 'room1',
          title: 'File Navigation',
          overview:
            'The terminal gives you direct control over your system. Instead of clicking through folders, you move through them using commands. This room teaches you to navigate the Linux filesystem.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open your terminal and run: ls -la — this lists all files and folders in your current directory, including hidden files, with their permissions and sizes.',
              image: '01-ls.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Navigate into a directory using: cd [folder-name] — then run ls -la again to see its contents. Use cd .. to go back up one level.',
              image: '02-cd.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'File Reading',
          overview:
            'Being able to read files directly from the terminal is a basic but powerful skill. When you use cat, you bypass interfaces and access raw content.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Navigate to a directory that contains a text file, then run: cat [filename] — this outputs the full contents of the file directly to your terminal.',
              image: '01-cat.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 4: WEB ────────────────────────────────────────────────────────
    {
      id: 'phase4',
      title: 'Web',
      codename: 'PHASE 4',
      rooms: [
        {
          id: 'room1',
          title: 'Inspecting a Website',
          overview:
            'Every website is built using structure and style. DevTools exposes what the browser hides from normal users. You\'re looking at the real version of the page, not just the polished surface.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open the target website in Chrome or Firefox. Take a moment to observe the page as a normal user would see it.',
              image: '01-site.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Press F12 (or right-click → Inspect) to open DevTools. This is your window into the underlying structure of the page.',
              image: '02-inspect.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'In the Elements tab, hover over different HTML elements and observe how they highlight on the page. Read the structure — what tags are used? What classes?',
              image: '03-elements.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'Network Analysis',
          overview:
            'The Network tab in DevTools shows every request your browser makes. This is how you see what data is being sent and received behind the scenes.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open DevTools and click the Network tab. You\'ll see a list of all network requests made by the page.',
              image: '01-network.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Reload the page while the Network tab is open. Watch all the requests populate in real time.',
              image: '02-reload.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Click on individual requests to inspect them. Look at the Request Headers, Response Headers, and the response body. What data is being exchanged?',
              image: '03-requests.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Demo Web App',
          overview:
            'Now you\'ll apply everything to a real demo application. You\'ll observe how a login flow works at the network level — what data is sent, what is returned.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open the demo web application provided by your instructor. Observe the interface before interacting with it.',
              image: '01-open-app.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Navigate to the login page. Open DevTools Network tab before submitting anything — you want to capture the login request.',
              image: '02-login.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Open the Network tab in DevTools. Make sure it is recording before you submit the login form.',
              image: '03-network.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Submit a login attempt. Watch the Network tab — find the request that was made. Click on it to inspect it.',
              image: '04-requests.png',
            },
            {
              title: 'STEP 5',
              instruction:
                'Inspect the response. What did the server return? Is there a token? A session cookie? What does a successful vs failed login response look like?',
              image: '05-response.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 5: PSYCHOLOGY ─────────────────────────────────────────────────
    {
      id: 'phase5',
      title: 'Psychology',
      codename: 'PHASE 5',
      rooms: [
        {
          id: 'room1',
          title: 'Scenario Analysis',
          overview:
            'Social engineering targets humans, not systems. In this room you\'ll analyse real-world scenarios to understand how attackers exploit trust, urgency, and authority.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will present a social engineering scenario. Read through it carefully and identify every psychological technique being used.',
              image: null, // No image yet — placeholder will render
            },
            {
              title: 'STEP 2',
              instruction:
                'For each technique identified, write down: what the attacker is exploiting (trust, fear, urgency, authority) and how a target would recognise it.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Discuss with your group: what controls or awareness training would have prevented this attack from succeeding?',
              image: null,
            },
          ],
        },
      ],
    },

    // ── FINAL PHASE: CTF ────────────────────────────────────────────────────
    {
      id: 'phase6',
      title: 'CTF',
      codename: 'FINAL',
      rooms: [
        {
          id: 'room1',
          title: 'Basic Challenge',
          overview:
            'Apply everything you\'ve learned. This Capture The Flag challenge tests your ability to combine mindset, networking, Linux, and web skills to find the flag.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will provide the CTF environment details. Connect to the target system and begin your reconnaissance.',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Use the skills from all previous phases: observe the system, check open ports, navigate the filesystem, and inspect any web interfaces.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Find the flag. It will be in the format FLAG{...}. Submit it to your instructor to complete the bootcamp.',
              image: null,
            },
          ],
        },
      ],
    },
  ],
};
