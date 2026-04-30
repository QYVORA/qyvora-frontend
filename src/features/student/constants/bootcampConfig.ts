/**
 * HACKER PROTOCOL BOOTCAMP — STATIC CONFIG
 * =========================================
 * Single source of truth for the bootcamp walkthrough structure.
 * MUST mirror the backend bootcamp.config.js exactly:
 *   - Same number of modules/phases
 *   - Same number of rooms per module
 *   - Same titles (used for title-based matching in BootcampRoomPage)
 *
 * Image paths resolve to:
 *   /walkthrough/hpb/phase-xx/room-xx/step-xx-*.png
 *
 * image: null → renders placeholder (upload image later)
 *
 * Backend module → Frontend phase mapping (by index):
 *   moduleId 1 → phase1  (Hacker Mindset,       3 rooms)
 *   moduleId 2 → phase2  (Linux Foundations,     4 rooms)
 *   moduleId 3 → phase3  (Networking,            4 rooms)
 *   moduleId 4 → phase4  (Web & Backend Systems, 5 rooms)
 *   moduleId 5 → phase5  (Social Engineering,    3 rooms)
 */

export interface BootcampStep {
  title: string;
  instruction: string;
  /** Exact filename from the filesystem. null = no image yet → show placeholder. */
  image: string | null;
}

export interface BootcampRoom {
  id: string;       // e.g. "room1"
  title: string;    // MUST match backend room title exactly (case-insensitive)
  overview: string;
  steps: BootcampStep[];
}

export interface BootcampPhase {
  id: string;       // e.g. "phase1"
  title: string;    // MUST match backend module title exactly (case-insensitive)
  codename: string;
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
  const phaseMatch = phaseId.match(/\d+/);
  const roomMatch = roomId.match(/\d+/);
  const phaseNum = phaseMatch ? Number(phaseMatch[0]) : 0;
  const roomNum = roomMatch ? Number(roomMatch[0]) : 0;
  const phaseDir = `phase-${String(phaseNum).padStart(2, '0')}`;
  const roomDir = `room-${String(roomNum).padStart(2, '0')}`;

  const normalized = filename.toLowerCase().replaceAll('_', '-');
  const withStepPrefix = /^step-\d{2}-/.test(normalized)
    ? normalized
    : normalized.replace(/^(\d+)-/, (_m, n) => `step-${String(Number(n)).padStart(2, '0')}-`);

  return `/walkthrough/hpb/${phaseDir}/${roomDir}/${withStepPrefix}`;
}

// ── Config ────────────────────────────────────────────────────────────────────
export const BOOTCAMP_CONFIG: BootcampConfig = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  phases: [

    // ── PHASE 1: HACKER MINDSET (moduleId: 1, 3 rooms) ──────────────────────
    {
      id: 'phase1',
      title: 'Hacker Mindset',
      codename: 'PHASE 1',
      rooms: [
        {
          id: 'room1',
          title: 'Introduction to Offensive Security',
          overview:
            'What is offensive security, why it matters, and how HSOCIETY operates. This room sets the foundation for everything that follows.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will introduce the concept of offensive security. Listen carefully and note the difference between offensive and defensive security.',
              image: '01-intro.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Understand the HSOCIETY operating model: education, execution, and community. Write down what each pillar means to you as a future operator.',
              image: '02-model.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Explore the landscape: red teams, penetration testers, bug bounty hunters, and security researchers. Which role interests you most and why?',
              image: '03-roles.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'The Hacker Mindset',
          overview:
            'How attackers think — curiosity, persistence, and creative problem solving. The mindset is the most important tool you will ever develop.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will walk through the core traits of the hacker mindset: curiosity, persistence, and lateral thinking. Take notes on each.',
              image: '01-mindset.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Apply the mindset to a simple object in your environment. Ask: how was this built? How could it be misused? What assumptions does it make about the user?',
              image: '02-apply.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Discuss with your group: what separates a hacker from someone who just runs tools? Write your answer in your notes.',
              image: '03-discuss.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Ethics & Legal Boundaries',
          overview:
            'Responsible disclosure, scope, and operating within the law. Understanding the legal and ethical framework is non-negotiable for every operator.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will cover the Computer Misuse Act and equivalent laws in your jurisdiction. Note the key offences and their consequences.',
              image: '01-law.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Learn what "scope" means in a penetration test. Why is written authorisation critical before touching any system?',
              image: '02-scope.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Study responsible disclosure: what it is, how to report a vulnerability, and why it matters for the security community.',
              image: '03-disclosure.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 2: LINUX FOUNDATIONS (moduleId: 2, 4 rooms) ───────────────────
    {
      id: 'phase2',
      title: 'Linux Foundations',
      codename: 'PHASE 2',
      rooms: [
        {
          id: 'room1',
          title: 'Linux Basics & Navigation',
          overview:
            'File system, permissions, and essential commands. The terminal is your primary weapon — learn to move through it with confidence.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open your terminal. Run: pwd — this shows your current working directory. Then run: ls -la — observe all files including hidden ones.',
              image: '01-terminal.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Navigate the filesystem: use cd to move into directories, cd .. to go up, and ls -la at each level to see what\'s there.',
              image: '02-navigate.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Read the permission string on a file (e.g. -rwxr-xr-x). Identify the owner, group, and world permissions. What does each character mean?',
              image: '03-permissions.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Use cat, less, and head to read file contents. Use grep to search inside files. Practice on the files in your home directory.',
              image: '04-reading.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'Users, Groups & Permissions',
          overview:
            'Managing access control on Linux systems. Understanding who can do what is fundamental to both attacking and defending systems.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Run: id — this shows your current user, UID, and group memberships. Run: whoami — confirm your username.',
              image: '01-id.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Examine /etc/passwd and /etc/group. What information do these files contain? Why are they important to an attacker?',
              image: '02-passwd.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Use chmod to change file permissions and chown to change ownership. Practice creating a file and modifying its permissions.',
              image: '03-chmod.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Understand sudo and the sudoers file. Run: sudo -l — what commands can your user run with elevated privileges?',
              image: '04-sudo.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Processes & Networking',
          overview:
            'Process management, ports, and basic network commands. Every running service is a potential attack surface.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Run: ps aux — list all running processes. Identify the PID, user, and command for each. What processes are running as root?',
              image: '01-ps.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Run: netstat -tulnp or ss -tulnp — list all listening ports and the processes bound to them. Note every open port.',
              image: '02-netstat.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Use ping to test connectivity and traceroute to trace the path to a host. What does each hop in the traceroute tell you?',
              image: '03-ping.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Use kill and killall to terminate processes. Understand the difference between SIGTERM (15) and SIGKILL (9).',
              image: '04-kill.png',
            },
          ],
        },
        {
          id: 'room4',
          title: 'Scripting Fundamentals',
          overview:
            'Bash scripting for automation and recon tasks. Operators who can script move faster and work smarter.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Create your first bash script: open a text editor, write #!/bin/bash on the first line, then echo "Hello, Operator". Save it and run: chmod +x script.sh && ./script.sh',
              image: '01-script.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Add variables to your script. Use $1, $2 for arguments. Write a script that takes a hostname as an argument and pings it.',
              image: '02-variables.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Add a for loop to your script. Write a script that iterates over a list of IP addresses and pings each one.',
              image: '03-loop.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Add conditional logic with if/else. Write a script that checks if a port is open using nc (netcat) and prints the result.',
              image: '04-conditional.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 3: NETWORKING (moduleId: 3, 4 rooms) ──────────────────────────
    {
      id: 'phase3',
      title: 'Networking',
      codename: 'PHASE 3',
      rooms: [
        {
          id: 'room1',
          title: 'TCP/IP & OSI Model',
          overview:
            'How data moves across networks — protocols and layers. Every attack and defence starts with understanding how packets travel.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will walk through the 7 layers of the OSI model. Draw the model and write one sentence describing what happens at each layer.',
              image: '01-osi.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Understand the TCP three-way handshake: SYN → SYN-ACK → ACK. Draw the sequence and explain what each step establishes.',
              image: '02-handshake.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Compare TCP and UDP. When would an attacker prefer UDP? What services run on UDP that are commonly targeted?',
              image: '03-tcp-udp.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Use Wireshark or tcpdump to capture live traffic. Identify TCP, UDP, DNS, and HTTP packets in the capture.',
              image: '04-capture.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'DNS, HTTP & Common Protocols',
          overview:
            'The protocols attackers abuse most. Understanding how DNS and HTTP work is essential for web and network attacks.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Run: nslookup google.com and dig google.com. Compare the output. What DNS record types exist and what does each one store?',
              image: '01-dns.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Use curl to make an HTTP GET request: curl -v http://example.com. Read the request and response headers carefully.',
              image: '02-http.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Understand HTTP methods: GET, POST, PUT, DELETE, OPTIONS. What does each method do and which ones are most relevant to attackers?',
              image: '03-methods.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Explore SMTP, FTP, and SSH at a high level. What ports do they run on? What credentials or data do they expose if misconfigured?',
              image: '04-protocols.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Network Scanning & Enumeration',
          overview:
            'Using nmap and other tools to map a target network. Enumeration is the foundation of every successful engagement.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Run a basic nmap scan: nmap [target-ip]. Observe which ports are open and what services are detected.',
              image: '01-nmap-basic.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Run a service version scan: nmap -sV [target-ip]. What versions are running? Why does version information matter to an attacker?',
              image: '02-nmap-version.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Run an OS detection scan: nmap -O [target-ip]. What operating system is the target running? How confident is nmap in its guess?',
              image: '03-nmap-os.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Use nmap scripts: nmap --script=default [target-ip]. Review the additional information gathered. What vulnerabilities or misconfigurations are flagged?',
              image: '04-nmap-scripts.png',
            },
          ],
        },
        {
          id: 'room4',
          title: 'Packet Analysis',
          overview:
            'Reading traffic with Wireshark to understand what\'s happening on the wire. Packet analysis is a core skill for both attackers and defenders.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open Wireshark and start a capture on your active network interface. Browse to a website and observe the traffic generated.',
              image: '01-wireshark.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Apply a display filter: http — this shows only HTTP traffic. Find a GET request and inspect the full packet details.',
              image: '02-filter.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Use "Follow TCP Stream" on an HTTP request. Read the full request and response as plain text. What sensitive data is visible?',
              image: '03-stream.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Apply a filter for DNS traffic: dns. Find a DNS query and response. What domain was resolved and what IP was returned?',
              image: '04-dns-capture.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 4: WEB & BACKEND SYSTEMS (moduleId: 4, 5 rooms) ───────────────
    {
      id: 'phase4',
      title: 'Web & Backend Systems',
      codename: 'PHASE 4',
      rooms: [
        {
          id: 'room1',
          title: 'How the Web Works',
          overview:
            'HTTP, requests, responses, cookies, and sessions. Before you can attack a web application, you need to understand exactly how it communicates.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Open the target web application. Press F12 to open DevTools and navigate to the Network tab. Reload the page and observe all requests.',
              image: '01-devtools.png',
            },
            {
              title: 'STEP 2',
              instruction:
                'Click on the main HTML document request. Inspect the Request Headers and Response Headers. What information is revealed about the server?',
              image: '02-headers.png',
            },
            {
              title: 'STEP 3',
              instruction:
                'Navigate to the Application tab in DevTools. Inspect Cookies and Local Storage. What data is being stored client-side?',
              image: '03-cookies.png',
            },
            {
              title: 'STEP 4',
              instruction:
                'Log in to the application and observe the login request in the Network tab. What data is sent? What does the server return on success?',
              image: '04-login-request.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'OWASP Top 10 Overview',
          overview:
            'The most critical web application security risks. The OWASP Top 10 is the industry standard reference for web vulnerabilities.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will walk through the OWASP Top 10 list. For each item, write one sentence describing the vulnerability and one example of how it is exploited.',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Focus on the top 3: Broken Access Control, Cryptographic Failures, and Injection. For each, describe what a successful attack looks like.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Using the demo application, identify which OWASP Top 10 categories are present. Document your findings with evidence.',
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'SQL Injection',
          overview:
            'Finding and exploiting SQL injection vulnerabilities. SQLi remains one of the most impactful vulnerabilities in web applications.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Navigate to the login form on the demo application. Enter a single quote ( \' ) in the username field and observe the response. Does the application throw an error?',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Try a basic SQLi payload in the username field: admin\'-- and any password. Observe whether you can bypass authentication.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Your instructor will demonstrate a UNION-based injection to extract data from the database. Follow along and note the structure of the payload.',
              image: null,
            },
            {
              title: 'STEP 4',
              instruction:
                'Use sqlmap on the target URL (with permission): sqlmap -u "[url]" --dbs. Observe what databases are discovered.',
              image: null,
            },
            {
              title: 'STEP 5',
              instruction:
                'Document your findings: what data was accessible, what the injection point was, and how it could be remediated.',
              image: null,
            },
          ],
        },
        {
          id: 'room4',
          title: 'XSS & CSRF',
          overview:
            'Client-side attacks and how to exploit them. XSS and CSRF target users of an application, not just the server.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Find an input field on the demo application that reflects user input. Enter: <script>alert(1)</script> and observe whether the script executes.',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Your instructor will demonstrate a stored XSS attack. Observe how the payload is stored and executed when another user views the page.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Understand CSRF: how an attacker can trick a logged-in user into performing actions they didn\'t intend. Review the demo CSRF form.',
              image: null,
            },
            {
              title: 'STEP 4',
              instruction:
                'Document both vulnerabilities: the injection point, the payload used, the impact, and the recommended fix.',
              image: null,
            },
          ],
        },
        {
          id: 'room5',
          title: 'Authentication Attacks',
          overview:
            'Broken auth, session hijacking, and credential attacks. Authentication is the front door — and it\'s often left unlocked.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Attempt a brute force attack on the demo login using Burp Suite Intruder or Hydra with a small wordlist. Observe the application\'s response to repeated failures.',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Inspect the session token (cookie) after logging in. Is it predictable? Is it properly invalidated on logout?',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Your instructor will demonstrate session fixation and session hijacking. Follow along and note how the attack is executed.',
              image: null,
            },
            {
              title: 'STEP 4',
              instruction:
                'Document your findings: what authentication weaknesses exist, how they were exploited, and what controls would prevent each attack.',
              image: null,
            },
          ],
        },
      ],
    },

    // ── PHASE 5: SOCIAL ENGINEERING (moduleId: 5, 3 rooms) ──────────────────
    {
      id: 'phase5',
      title: 'Social Engineering',
      codename: 'PHASE 5',
      rooms: [
        {
          id: 'room1',
          title: 'Phishing & Pretexting',
          overview:
            'Crafting convincing attacks that target people, not systems. The most sophisticated technical defences can be bypassed by a well-crafted email.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will present examples of real phishing emails. Identify the psychological triggers used: urgency, authority, fear, curiosity.',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Understand pretexting: creating a believable scenario to manipulate a target. Write a pretext scenario for a simulated engagement.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Analyse the anatomy of a phishing email: sender spoofing, lookalike domains, malicious links, and urgency language. Document each technique.',
              image: null,
            },
          ],
        },
        {
          id: 'room2',
          title: 'OSINT Fundamentals',
          overview:
            'Open source intelligence gathering on targets. OSINT is the first step in any engagement — know your target before you touch anything.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Use Google dorking to find information about a target organisation. Try: site:[domain] filetype:pdf and site:[domain] inurl:admin',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Use theHarvester to gather email addresses and subdomains: theHarvester -d [domain] -b google. Document all findings.',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Search LinkedIn, Twitter/X, and other social platforms for employees of the target organisation. What information is publicly available that could aid an attack?',
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'Physical Security',
          overview:
            'Tailgating, badge cloning, and physical intrusion concepts. Physical access often bypasses all digital controls.',
          steps: [
            {
              title: 'STEP 1',
              instruction:
                'Your instructor will cover tailgating and piggybacking. Discuss: what physical controls prevent unauthorised entry and how are they bypassed?',
              image: null,
            },
            {
              title: 'STEP 2',
              instruction:
                'Understand RFID/NFC badge cloning at a conceptual level. What tools are used? What are the legal implications of testing this?',
              image: null,
            },
            {
              title: 'STEP 3',
              instruction:
                'Discuss dumpster diving and shoulder surfing. What sensitive information can be obtained through physical observation? How do organisations defend against this?',
              image: null,
            },
          ],
        },
      ],
    },

  ],
};
