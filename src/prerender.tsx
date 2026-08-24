import type { PrerenderArguments, PrerenderResult } from 'vite-prerender-plugin';

const SITE_URL = 'https://qyvora.netlify.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface Section {
  heading: string;
  body?: string;
  bullets?: string[];
}

interface RouteContent {
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections?: Section[];
  links?: { label: string; href: string }[];
  canonical?: string;
}

const routeContent: Record<string, RouteContent> = {
  '/': {
    title: 'QYVORA | Africa\'s Offensive Security Platform',
    description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training, penetration testing, and advanced intelligence tools.',
    h1: 'QYVORA | Africa\'s Offensive Security Platform',
    lead: 'Train like a hacker. Build Africa\'s cyber professionals. QYVORA is Africa\'s offensive security platform: structured training, hands-on attack labs, professional penetration testing services, and open-source tooling built for operators.',
    sections: [
      {
        heading: 'Train Like a Hacker',
        body: 'From the Hacker Protocol Bootcamp to structured courses and hands-on attack labs, QYVORA sharpens your skills from the ground up: privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain.',
      },
      {
        heading: 'Tools for Operators',
        body: 'Anansi CLI runs a nine-phase attack-surface reconnaissance pipeline from the terminal. Toha3ee is a local & network security assessment framework in Go covering discovery, enumeration, credential auditing, wireless and MITM capabilities.',
      },
      {
        heading: 'Professional Services',
        body: 'Enterprise-grade penetration testing and security assessments built around the OWASP Top 10, with clear, prioritized findings and practical remediation guidance.',
      },
      {
        heading: 'The Community',
        body: 'Compete on the leaderboard, trade on the Zero Day Market, and follow the latest research on the QYVORA blog.',
      },
    ],
    links: [
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
      { label: 'Courses', href: '/courses' },
      { label: 'Attack Labs', href: '/labs' },
      { label: 'Services', href: '/services' },
      { label: 'Anansi CLI', href: '/anansi' },
      { label: 'Toha3ee', href: '/toha3ee' },
      { label: 'Zero Day Market', href: '/zero-day-market' },
      { label: 'QuiteRoot', href: '/quiteroot' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Team', href: '/team' },
      { label: 'Leaderboard', href: '/leaderboard' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  '/hpb': {
    title: 'Hacker Protocol Bootcamp | QYVORA',
    description: 'Learn offensive security techniques with the Hacker Protocol Bootcamp - comprehensive training for cybersecurity professionals.',
    h1: 'Hacker Protocol Bootcamp',
    lead: 'A structured offensive security bootcamp that turns curious minds into operators: five phases, one phase at a time.',
    sections: [
      {
        heading: 'Phase 1 - Hacker Mindset',
        body: 'Offensive security is a proactive mindset. Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
      },
      {
        heading: 'Phase 2 - Linux Foundations',
        body: 'Master navigation, user privilege escalation, file permissions, and directory structures. Transition from a GUI observer to a terminal-proficient operator.',
      },
      {
        heading: 'Phase 3 - Networking',
        body: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
      },
      {
        heading: 'Phase 4 - Web & Backend Systems',
        body: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
      },
      {
        heading: 'Phase 5 - Social Engineering',
        body: 'Understand the human factor in the defensive boundary. Study pretexting, psychological vectors, coordinates of trust, and human spoofing.',
      },
    ],
    links: [
      { label: 'Phase 1 - Hacker Mindset', href: '/hpb/phase1' },
      { label: 'Phase 2 - Linux Foundations', href: '/hpb/phase2' },
      { label: 'Phase 3 - Networking', href: '/hpb/phase3' },
      { label: 'Phase 4 - Web & Backend Systems', href: '/hpb/phase4' },
      { label: 'Phase 5 - Social Engineering', href: '/hpb/phase5' },
    ],
  },
  '/hpb/phase1': {
    title: 'Hacker Mindset - Hacker Protocol Bootcamp | QYVORA',
    description: 'Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
    h1: 'Phase 1 - Hacker Mindset',
    lead: 'Offensive security is a proactive mindset. Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
    sections: [
      {
        heading: 'About this phase',
        body: 'The first phase of the Hacker Protocol Bootcamp builds the discipline behind offensive security: operating within legal boundaries, defining scope, and following coordinator rules.',
      },
    ],
    links: [{ label: 'Back to Hacker Protocol Bootcamp', href: '/hpb' }],
  },
  '/hpb/phase2': {
    title: 'Linux Foundations - Hacker Protocol Bootcamp | QYVORA',
    description: 'Master navigation, user privilege escalation, file permissions, and directory structures on the Linux terminal.',
    h1: 'Phase 2 - Linux Foundations',
    lead: 'Master navigation, user privilege escalation, file permissions, and directory structures. Transition from a GUI observer to a terminal-proficient operator.',
    sections: [
      {
        heading: 'About this phase',
        body: 'The second phase of the Hacker Protocol Bootcamp builds terminal fluency, the foundation every operator depends on for the rest of the program.',
      },
    ],
    links: [{ label: 'Back to Hacker Protocol Bootcamp', href: '/hpb' }],
  },
  '/hpb/phase3': {
    title: 'Networking - Hacker Protocol Bootcamp | QYVORA',
    description: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
    h1: 'Phase 3 - Networking',
    lead: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
    sections: [
      {
        heading: 'About this phase',
        body: 'The third phase of the Hacker Protocol Bootcamp covers the network stack in depth, the visibility every offensive operator needs to move laterally.',
      },
    ],
    links: [{ label: 'Back to Hacker Protocol Bootcamp', href: '/hpb' }],
  },
  '/hpb/phase4': {
    title: 'Web & Backend Systems - Hacker Protocol Bootcamp | QYVORA',
    description: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
    h1: 'Phase 4 - Web & Backend Systems',
    lead: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
    sections: [
      {
        heading: 'About this phase',
        body: 'The fourth phase of the Hacker Protocol Bootcamp dissects modern web architecture, from the HTTP request to the database behind it.',
      },
    ],
    links: [{ label: 'Back to Hacker Protocol Bootcamp', href: '/hpb' }],
  },
  '/hpb/phase5': {
    title: 'Social Engineering - Hacker Protocol Bootcamp | QYVORA',
    description: 'Learn the human element of security through persuasion, pretexting, and awareness-building techniques.',
    h1: 'Phase 5 - Social Engineering',
    lead: 'Understand the human factor in the defensive boundary. Study pretexting, psychological vectors, coordinates of trust, and human spoofing.',
    sections: [
      {
        heading: 'About this phase',
        body: 'The final phase of the Hacker Protocol Bootcamp studies the human element of security, the boundary no firewall can fully defend.',
      },
    ],
    links: [{ label: 'Back to Hacker Protocol Bootcamp', href: '/hpb' }],
  },
  '/services': {
    title: 'Services | QYVORA',
    description: 'Professional penetration testing, security auditing, and cybersecurity consulting services.',
    h1: 'Security Services',
    lead: 'Enterprise-grade penetration testing, security assessments, and offensive security training, delivered by operators who work the craft.',
    sections: [
      {
        heading: 'Basic Web Application Penetration Testing',
        body: 'A focused assessment of your application\u2019s most critical pages, fast, thorough, and built around the OWASP Top 10. From $300 - $500 USD.',
      },
      {
        heading: 'Standard Web Application Penetration Testing',
        body: 'A deep, full-application assessment covering authentication, authorization, business logic, and everything in between. From $600 - $1,000 USD. Includes one free retest.',
      },
      {
        heading: 'Employee Cybersecurity Bootcamp',
        body: 'Build a security-aware workforce with hands-on training your employees will actually retain. Custom quotation based on organization size and scope.',
      },
      {
        heading: 'Why We Test',
        body: 'We do not perform penetration tests to check a box or generate revenue. The objective is to identify real vulnerabilities, help you strengthen your security posture, and deliver meaningful security improvements.',
      },
    ],
    links: [
      { label: 'Basic Web Application Penetration Testing', href: '/services/basic-web-application-pentest' },
      { label: 'Standard Web Application Penetration Testing', href: '/services/standard-web-application-pentest' },
      { label: 'Employee Cybersecurity Bootcamp', href: '/services/employee-cybersecurity-bootcamp' },
    ],
  },
  '/services/basic-web-application-pentest': {
    title: 'Basic Web Application Penetration Testing | QYVORA',
    description: 'A focused assessment of your application\u2019s most critical pages: fast, thorough, and built around the OWASP Top 10.',
    h1: 'Basic Web Application Penetration Testing',
    lead: 'A focused assessment of your application\u2019s most critical pages, fast, thorough, and built around the OWASP Top 10.',
    sections: [
      { heading: 'Scope', body: 'Up to 5 application pages/endpoints.' },
      {
        heading: 'What\'s included',
        bullets: [
          'OWASP Top 10 assessment',
          'Authentication testing',
          'Basic SQL Injection testing',
          'Cross-Site Scripting (XSS) testing',
          'Session management testing',
        ],
      },
      {
        heading: 'Benefits',
        bullets: [
          'Ideal entry point for small applications and MVPs',
          'Manual + automated analysis of every in-scope endpoint',
          'Clear, prioritized findings tied to real business risk',
          'No checkbox audit: real exploitation with practical fixes',
        ],
      },
      {
        heading: 'Deliverables',
        bullets: [
          'Executive summary',
          'Technical findings with reproducible steps',
          'Risk ratings to triage what to fix first',
          'Evidence: screenshots and request/response proof',
          'Remediation recommendations',
        ],
      },
    ],
    links: [{ label: 'All Services', href: '/services' }],
  },
  '/services/standard-web-application-pentest': {
    title: 'Standard Web Application Penetration Testing | QYVORA',
    description: 'A deep, full-application assessment covering authentication, authorization, business logic, and everything in between.',
    h1: 'Standard Web Application Penetration Testing',
    lead: 'A deep, full-application assessment covering authentication, authorization, business logic, and everything in between.',
    sections: [
      { heading: 'Scope', body: 'Comprehensive assessment covering the entire application.' },
      {
        heading: 'What\'s included',
        bullets: [
          'Authentication testing',
          'Authorization and role testing',
          'Business logic testing',
          'IDOR testing',
          'File upload security testing',
          'JWT security analysis',
          'Session security testing',
          'Rate limiting checks',
        ],
      },
      {
        heading: 'Benefits',
        bullets: [
          'Full application coverage: no endpoint left out of scope',
          'Deep-dive into authorization, business logic, and file handling',
          'Actionable findings mapped to remediation priority',
          'One free retest after vulnerabilities have been remediated',
        ],
      },
      {
        heading: 'Deliverables',
        bullets: [
          'Executive summary',
          'Technical findings with full technical detail',
          'Risk ratings to triage what to fix first',
          'Evidence: screenshots and request/response proof',
          'Detailed remediation guidance',
          'One free re-assessment after remediation to verify every fix',
        ],
      },
    ],
    links: [{ label: 'All Services', href: '/services' }],
  },
  '/services/employee-cybersecurity-bootcamp': {
    title: 'Employee Cybersecurity Bootcamp | QYVORA',
    description: 'Build a security-aware workforce with hands-on training your employees will actually retain.',
    h1: 'Employee Cybersecurity Bootcamp',
    lead: 'Build a security-aware workforce with hands-on training your employees will actually retain.',
    sections: [
      {
        heading: 'Scope',
        body: 'Tailored to your organization size, employee count, and training requirements.',
      },
      {
        heading: 'What\'s included',
        bullets: [
          'Understanding cybersecurity risks',
          'Physical security awareness',
          'Social engineering',
          'Phishing awareness',
          'Employee-targeted attacks',
          'Safe workplace security practices',
          'Security awareness fundamentals',
          'Basic incident response awareness',
        ],
      },
      {
        heading: 'Benefits',
        bullets: [
          'A security-aware workforce: your employees become your first line of defense',
          'Practical, scenario-based training instead of slideware',
          'Curriculum tailored to your industry and risk profile',
          'Hands-on drills and simulations employees will remember',
        ],
      },
    ],
    links: [{ label: 'All Services', href: '/services' }],
  },
  '/blogs': {
    title: 'Blog | QYVORA',
    description: 'Latest insights on cybersecurity, ethical hacking, and offensive security in Africa.',
    h1: 'Intelligence Reports',
    lead: 'Security research, tutorials, and updates from the QYVORA team.',
    sections: [
      {
        heading: 'Latest posts',
        body: 'From attack-surface research and tooling deep-dives to the story of Africa\u2019s cybersecurity talent pipeline.',
      },
    ],
    links: [
      { label: 'Hacker Protocol Bootcamp - 2026 Cohort', href: '/blogs/hacker-protocol-bootcamp' },
      { label: 'Anansi CLI: Attack Surface Intelligence from the Terminal', href: '/blogs/anansi-cli' },
      { label: 'Building Africa\'s Cybersecurity Ecosystem', href: '/blogs/africa-cybersecurity-ecosystem' },
      { label: 'How Attackers Actually Discover Companies on the Internet', href: '/blogs/attackers-discover-companies' },
      { label: 'Why Africa Needs 100,000 More Cybersecurity Professionals', href: '/blogs/africa-needs-cybersecurity-professionals' },
      { label: 'What We Learned From Mapping Real-World Attack Surfaces', href: '/blogs/mapping-attack-surfaces' },
      { label: 'The Future of Cybersecurity in Africa', href: '/blogs/future-cybersecurity-africa' },
      { label: 'HPB 2026 Cohort. Case Study', href: '/blogs/hpb-2026-cohort-case-study' },
    ],
  },
  '/blogs/hacker-protocol-bootcamp': {
    title: 'Hacker Protocol Bootcamp | QYVORA Blog',
    description: 'How we designed a bootcamp that turns curious minds into offensive security operators, one phase at a time.',
    h1: 'Hacker Protocol Bootcamp - 2026 Cohort',
    lead: 'Building Africa\'s Cybersecurity Pipeline From the Ground Up. How we designed a bootcamp that turns curious minds into offensive security operators, one phase at a time.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 8 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/anansi-cli': {
    title: 'Anansi CLI | QYVORA Blog',
    description: 'A philosophy-driven walkthrough of the Anansi CLI: what it does, why it exists, and how to wield it.',
    h1: 'Anansi CLI: Attack Surface Intelligence from the Terminal',
    lead: 'Why we built a no-nonsense, single-binary recon engine for operators who hate bloat. A philosophy-driven walkthrough of the Anansi CLI: what it does, why it exists, and how to wield it.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 8 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/africa-cybersecurity-ecosystem': {
    title: 'Africa\'s Cybersecurity Ecosystem | QYVORA Blog',
    description: 'Why we are building a homegrown offensive security company for the African context, from education to tooling to services.',
    h1: 'Building Africa\'s Cybersecurity Ecosystem: Why QYVORA Exists',
    lead: 'The vision behind Africa\'s first dedicated offensive security ecosystem, from education to tooling to services.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 7 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/attackers-discover-companies': {
    title: 'How Attackers Discover Companies | QYVORA Blog',
    description: 'Learn how attackers map your attack surface using CT logs, DNS brute-force, and automated discovery, and how to defend against it.',
    h1: 'How Attackers Actually Discover Companies on the Internet',
    lead: 'The six-phase reconnaissance pipeline and what it means for your organisation. Learn how attackers map your attack surface using CT logs, DNS brute-force, and automated discovery.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 8 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/africa-needs-cybersecurity-professionals': {
    title: 'Africa Needs Cybersecurity Professionals | QYVORA Blog',
    description: 'Africa faces a critical cybersecurity talent shortage. We break down the numbers and the pathway to closing the gap.',
    h1: 'Why Africa Needs 100,000 More Cybersecurity Professionals',
    lead: 'The talent gap is growing. Here is how we close it. Africa faces a critical cybersecurity talent shortage.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 7 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/mapping-attack-surfaces': {
    title: 'Mapping Attack Surfaces | QYVORA Blog',
    description: 'Real findings from real attack surface assessments: shadow assets, exposed secrets, and misconfigurations we see everywhere.',
    h1: 'What We Learned From Mapping Real-World Attack Surfaces',
    lead: 'Common patterns, recurring findings, and structural weaknesses from hundreds of assessments: shadow assets, exposed secrets, and misconfigurations.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 8 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/future-cybersecurity-africa': {
    title: 'The Future of Cybersecurity in Africa | QYVORA Blog',
    description: 'AI, automation, and Africa\'s unique opportunity to leapfrog legacy security models into a more resilient future.',
    h1: 'The Future of Cybersecurity in Africa: AI, Talent, and Innovation',
    lead: 'Where African cybersecurity is heading, and how to prepare. AI, automation, and Africa\'s unique opportunity to leapfrog legacy security models.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), June 2026, 7 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/blogs/hpb-2026-cohort-case-study': {
    title: 'HPB 2026 Cohort Case Study | QYVORA Blog',
    description: 'How the HPB 2026 Cohort produced a COO, formed the QuiteRoot tech team, and proved Africa\'s talent pipeline works.',
    h1: 'HPB 2026 Cohort - Case Study',
    lead: 'From Training to Team Building: The Hacker Protocol Bootcamp Story. How the cohort produced a COO, formed the QuiteRoot tech team, and proved Africa\'s talent pipeline works.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), July 2026, 10 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
  },
  '/courses': {
    title: 'Courses | QYVORA',
    description: 'Master offensive security with QYVORA\'s structured courses.',
    h1: 'Offensive Courses',
    lead: 'Structured courses that teach the fundamentals of offensive security, from the command line to wireless attacks.',
    sections: [
      {
        heading: 'Course categories',
        bullets: [
          'Terminal: master the command line, the hacker\'s primary interface.',
          'Networking: understand how data moves across networks and the internet.',
          'Programming: write code that automates, exploits, and defends.',
          'Web Security: explore web technologies and how to secure them.',
          'Wireless Security: understand wireless networks and their unique attack surface.',
          'Tools: get hands-on with the essential tools of the trade.',
        ],
      },
    ],
    links: [{ label: 'Hacker Protocol Bootcamp', href: '/hpb' }],
  },
  '/labs': {
    title: 'Labs | QYVORA',
    description: 'Hands-on penetration testing labs and offensive security challenges.',
    h1: 'Attack Labs',
    lead: 'Hands-on offensive security labs covering privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain.',
    sections: [
      {
        heading: 'Available labs',
        bullets: [
          'Privilege Escalation',
          'Password Cracking',
          'SQL Injection',
          'OSINT',
          'Kill Chain',
        ],
      },
    ],
    links: [{ label: 'Courses', href: '/courses' }],
  },
  '/zero-day-market': {
    title: 'Zero Day Market | QYVORA',
    description: 'Intelligence assets, guides, papers, and tools available for CP.',
    h1: 'Zero Day Market',
    lead: 'A marketplace where operators trade intelligence assets, guides, papers, and tools for CP: the QYVORA platform currency.',
    sections: [
      {
        heading: 'What you can find',
        body: 'Products, guides, papers, and tools curated for the QYVORA community, acquired with CP earned through training and competition.',
      },
    ],
    links: [{ label: 'Leaderboard', href: '/leaderboard' }],
  },
  '/quiteroot': {
    title: 'QuiteRoot | QYVORA',
    description: 'Advanced security tools and utilities for penetration testers.',
    h1: 'QuiteRoot',
    lead: 'QuiteRoot: a network of security researchers pushing the boundaries of offensive security.',
    sections: [
      {
        heading: 'The researchers',
        bullets: [
          'Awalle Grammator - Graphic designer turning ideas into visually compelling designs.',
          'L. Giant - Software Engineer specialising in development and automation for detection engineering.',
          'Zero Mind - Security Researcher focused on hands-on research and web application testing.',
          'Ghost Venom - Penetration Tester building skills across the cybersecurity stack.',
        ],
      },
    ],
    links: [{ label: 'Meet the QYVORA Team', href: '/team' }],
  },
  '/anansi': {
    title: 'Anansi CLI | QYVORA',
    description: 'Attack Surface Intelligence CLI: a nine-phase recon pipeline from subdomain discovery to exploit-chain analysis.',
    h1: 'Anansi CLI',
    lead: 'Attack Surface Intelligence from the terminal. A nine-phase recon pipeline from subdomain discovery to exploit-chain analysis.',
    sections: [
      {
        heading: 'The nine phases',
        bullets: [
          'DISCOVERY: subdomains via crt.sh CT logs + DNS brute-force wordlist',
          'PROBE: live HTTP/HTTPS hosts, status codes, servers, redirect chains, titles',
          'TLS: certificate expiry, SANs, protocol version, cipher, self-signed detection',
          'HEADERS: missing security headers and CORS misconfigurations',
          'PATHS: exposed files (.env, .git), configs, admin panels, backups, API docs',
          'TECH-STACK: deep audit of detected platforms and known-vulnerable version matching',
          'TAKEOVER: dangling CNAMEs pointing to unclaimed cloud services',
          'OSINT: emails, phone numbers, employees, WHOIS registrant data',
          'CHAIN: assembles findings into multi-step exploit paths with per-step techniques',
        ],
      },
      {
        heading: 'Install',
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi-cli/main/install.sh | bash',
      },
      {
        heading: 'Usage',
        bullets: [
          'anansi target.com',
          'anansi target.com --deep',
          'anansi target.com --modules discovery,tls,takeover',
          'anansi target.com --out json > results.json',
        ],
      },
    ],
    links: [{ label: 'Toha3ee', href: '/toha3ee' }],
  },
  '/toha3ee': {
    title: 'Toha3ee | QYVORA',
    description: 'Local & network security assessment framework written in Go: host and service discovery, enumeration, credential auditing, wireless and MITM capabilities from an interactive REPL.',
    h1: 'Toha3ee',
    lead: 'Local & network security assessment framework written in Go. Ten module categories spanning recon, enumeration, OSINT, auth, web, switch, wireless, MITM and post-exploitation, driven from an interactive REPL.',
    sections: [
      {
        heading: 'Capabilities',
        bullets: [
          'MITM - ARP, DHCP, DNS, IPv6 and LLMNR poisoning with inline interception',
          'Espionage, inline HTTP/HTTPS interception, credential harvesting and SSL stripping',
          'Auth, relay, signing checks, spraying, brute force and AS-REP',
          'Recon, network discovery and fingerprinting that ranks attack vectors',
          'OSINT - DNS, WHOIS, CT logs, ASN, Shodan, buckets, wayback and GitHub dorks',
          'Enumeration - SMTP, SNMP, LDAP, NFS and SMB users plus IPv6 host sweeps',
          'Web, web-layer assessment on top of recon fingerprints',
          'Switch, layer-2 exploitation: flooding, port stealing, VLAN hopping, STP/CDP abuse',
          'Wireless - 802.11 attacks: scanning, deauth, handshake capture, evil twin, PMKID and KARMA',
          'Post, reporting and session tooling on top of the in-memory store',
        ],
      },
      {
        heading: 'Install',
        bullets: [
          'Linux / macOS: curl -fsSL https://raw.githubusercontent.com/qyvora/qyvora-toha3ee/main/scripts/install.sh | sh',
          'Windows (PowerShell): irm https://raw.githubusercontent.com/qyvora/qyvora-toha3ee/main/scripts/install.ps1 | iex',
          'From a checkout: make install',
        ],
      },
    ],
    links: [{ label: 'Anansi CLI', href: '/anansi' }],
  },
  '/aksum': {
    title: 'Aksum | QYVORA',
    description: 'Binary security assessment & reverse-engineering framework in Go, identification, disassembly, function discovery, dataflow-corroborated findings and honest confidence states.',
    h1: 'Aksum',
    lead: 'Binary security assessment from the terminal. A ten-stage pipeline from identification and disassembly to dataflow-corroborated findings, with confidence states that only escalate when independent evidence agrees.',
    sections: [
      {
        heading: 'The ten stages',
        bullets: [
          'IDENTIFY, format, architecture, linking and hardening posture (PIE/NX/RELRO/canary)',
          'ENUMERATE, sections, segments, symbols and imports grouped by security relevance',
          'STRINGS, extraction with URL/path/command/crypto/credential classification',
          'DISASSEMBLY, x86/x86-64 linear sweep with structured operands and CET-aware decoding',
          'FUNCTIONS, multi-source discovery with provenance and per-function confidence',
          'GRAPHS, basic-block CFGs, loop detection, direct-call graph, code/data xrefs',
          'DATAFLOW, call-site argument tracking; PLT stubs resolved to import names via relocations',
          'VALIDATION, findings escalate to VALIDATED only on independent corroboration',
          'SURFACE, attack-surface aggregation of entry points, risky import categories and string classes',
          'REPORT, terminal summary or schema_version-1.0 JSON anchored to the target SHA-256',
        ],
      },
      {
        heading: 'Honest limits',
        body: 'A dangerous import alone is a CANDIDATE, never a verdict. Only statically resolved call sites justify VALIDATED. Unsupported architectures exit with a dedicated code instead of guessing, and this build ships no dynamic executor.',
      },
      {
        heading: 'Install',
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.sh | bash',
      },
      {
        heading: 'Usage',
        bullets: [
          'aksum binary /usr/bin/ls',
          'aksum analyze /usr/bin/ls --report report.json',
          'aksum surface /usr/bin/ls',
          'aksum dynamic plan ./target --yes',
        ],
      },
    ],
    links: [{ label: 'Jabari', href: '/jabari' }],
  },
  '/cp': {
    title: 'Cyber Coin (CP) | QYVORA',
    description: 'CP, the QYVORA Cyber Coin. The reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem.',
    h1: 'CP | QYVORA Cyber Coin',
    lead: 'Earn Your Progress. CP is the reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem. Learn. Execute. Earn.',
    sections: [
      {
        heading: 'A reward system built around capability',
        body: 'Instead of rewarding passive engagement, QYVORA rewards operators for actually progressing through its ecosystem, completing courses, passing quizzes, finishing bootcamp phases, clearing attack labs, completing challenges, and reaching defined milestones.',
      },
      {
        heading: 'The philosophy',
        body: 'Knowledge is only the beginning. QYVORA is designed around the transition from consuming cybersecurity knowledge to actually executing it: KNOWLEDGE → PRACTICE → EXECUTION → VERIFICATION → REWARD.',
      },
      {
        heading: 'How you earn CP',
        bullets: [
          'Course Completed - + CP',
          'Quiz Passed - + CP',
          'Phase Completed - + CP',
          'Attack Lab Completed - + CP',
          'Challenge Completed - + CP',
          'Milestone Achieved - + CP',
        ],
      },
      {
        heading: 'Future architecture',
        body: 'CP is designed with a future-ready architecture that can connect verified cybersecurity achievements with a blockchain-backed reward infrastructure. Blockchain settlement is planned, not deployed. CP currently functions as the QYVORA platform reward system and is not a publicly tradable asset.',
      },
    ],
    links: [
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
      { label: 'Courses', href: '/courses' },
      { label: 'Attack Labs', href: '/labs' },
      { label: 'Anansi CLI', href: '/anansi' },
      { label: 'Leaderboard', href: '/leaderboard' },
    ],
  },
  '/team': {
    title: 'Team | QYVORA',
    description: 'Meet the team behind QYVORA - cybersecurity experts building Africa\'s security ecosystem.',
    h1: 'Our Team',
    lead: 'The operators, engineers, and security researchers behind QYVORA.',
    sections: [
      {
        heading: 'The core team',
        bullets: [
          'wsuits6 - CEO. "I don\'t follow paths, I burn them then I write my own in code."',
          'sopt4 - COO. "I don\'t break systems, I find the flaws so others don\'t."',
          'Mohammed Rafiq: CFO. "I don\'t protect assets. I grow them wisely."',
          'Ghost Venom - CMO. "I am the whisper in the code, the shadow in the system."',
        ],
      },
    ],
    links: [{ label: 'QuiteRoot', href: '/quiteroot' }],
  },
  '/leaderboard': {
    title: 'Leaderboard | QYVORA',
    description: 'Top offensive security operators ranked by CP earnings.',
    h1: 'Operator Leaderboard',
    lead: 'Top offensive security operators ranked by CP earnings.',
    sections: [
      {
        heading: 'How it works',
        body: 'Operators earn CP through bootcamp phases, courses, attack labs, and competitive events. The leaderboard ranks them by total CP earned.',
      },
    ],
    links: [{ label: 'Zero Day Market', href: '/zero-day-market' }],
  },
  '/leaderboard/all': {
    title: 'Leaderboard | QYVORA',
    description: 'Top offensive security operators ranked by CP earnings.',
    h1: 'Operator Leaderboard',
    lead: 'Top offensive security operators ranked by CP earnings.',
    canonical: '/leaderboard',
    sections: [
      {
        heading: 'How it works',
        body: 'Operators earn CP through bootcamp phases, courses, attack labs, and competitive events. The leaderboard ranks them by total CP earned.',
      },
    ],
    links: [{ label: 'Zero Day Market', href: '/zero-day-market' }],
  },
  '/terms': {
    title: 'Terms of Service | QYVORA',
    description: 'QYVORA terms of service and usage policies.',
    h1: 'Terms of Service',
    lead: 'QYVORA OFFSEC terms of service, effective January 1, 2024, last updated July 2026, jurisdiction: Republic of Ghana.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing, browsing, or using the QYVORA platform, you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service.',
      },
      {
        heading: 'Eligibility & Account Registration',
        body: 'The Services are intended solely for individuals and entities that can form legally binding agreements under applicable law.',
      },
      {
        heading: 'Permitted Use & Prohibited Conduct',
        body: 'All use of the Services must comply with applicable laws. Any penetration testing or offensive security activity must be conducted only on systems for which you have explicit, written authorization.',
      },
      {
        heading: 'Training Programs & Laboratories',
        body: 'All training content, lab environments, exercises, and associated materials are proprietary and protected under applicable intellectual property laws.',
      },
      {
        heading: 'Professional Services & Engagements',
        body: 'Professional engagements require execution of a formal Statement of Work or Master Service Agreement prior to commencement.',
      },
      {
        heading: 'Intellectual Property Rights',
        body: 'All content, materials, and intellectual property associated with the Platform are the exclusive property of QYVORA or its licensors.',
      },
      {
        heading: 'Payment, Billing & Refunds',
        body: 'All fees are stated in United States Dollars (USD) unless otherwise specified. All payments are non-refundable unless expressly stated otherwise in writing.',
      },
      {
        heading: 'Cancellations & Termination',
        body: 'You may cancel your account at any time. QYVORA reserves the right to suspend or terminate access to the Services for breach of these Terms.',
      },
      {
        heading: 'Limitation of Liability & Indemnification',
        body: 'To the maximum extent permitted by law, QYVORA shall not be liable for indirect or consequential damages. You agree to indemnify and hold QYVORA harmless from claims arising from your use of the Services.',
      },
      {
        heading: 'Governing Law & Dispute Resolution',
        body: 'These Terms are governed by the laws of the Republic of Ghana. Disputes are resolved through good-faith negotiation followed by binding arbitration administered by the ADRC in Accra, Ghana.',
      },
    ],
  },
};

function renderBody(content: RouteContent): string {
  const sections = (content.sections || [])
    .map((s) => {
      const bullets = s.bullets ? `<ul>${s.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>` : '';
      return `<section><h2>${s.heading}</h2>${s.body ? `<p>${s.body}</p>` : ''}${bullets}</section>`;
    })
    .join('');

  const links = content.links
    ? `<nav aria-label="Related pages"><h2>Explore</h2><ul>${content.links
        .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
        .join('')}</ul></nav>`
    : '';

  return `
    <main>
      <h1>${content.h1}</h1>
      <p>${content.lead}</p>
      ${sections}
      ${links}
    </main>
  `;
}

export async function prerender(data: PrerenderArguments): Promise<PrerenderResult> {
  const { url } = data;

  const content = routeContent[url] || {
    title: 'QYVORA | Africa\'s Offensive Security Platform',
    description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training.',
    h1: 'QYVORA',
    lead: 'Building a strong cybersecurity ecosystem in Africa.',
  };

  const canonical = `${SITE_URL}${content.canonical || url}`;

  const html = `
    <div data-prerender="true">
      ${renderBody(content)}
    </div>
  `;

  return {
    html,
    head: {
      lang: 'en',
      title: content.title,
      elements: new Set([
        { type: 'meta', props: { name: 'description', content: content.description } },
        { type: 'meta', props: { name: 'robots', content: 'index, follow, max-image-preview:large' } },
        { type: 'link', props: { rel: 'canonical', href: canonical } },
        { type: 'meta', props: { property: 'og:type', content: 'website' } },
        { type: 'meta', props: { property: 'og:title', content: content.title } },
        { type: 'meta', props: { property: 'og:description', content: content.description } },
        { type: 'meta', props: { property: 'og:url', content: canonical } },
        { type: 'meta', props: { property: 'og:image', content: DEFAULT_OG_IMAGE } },
        { type: 'meta', props: { property: 'og:image:type', content: 'image/png' } },
        { type: 'meta', props: { property: 'og:image:width', content: '1200' } },
        { type: 'meta', props: { property: 'og:image:height', content: '630' } },
        { type: 'meta', props: { property: 'og:image:alt', content: content.title } },
        { type: 'meta', props: { property: 'og:site_name', content: 'QYVORA' } },
        { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
        { type: 'meta', props: { name: 'twitter:site', content: '@qyvorasec' } },
        { type: 'meta', props: { name: 'twitter:title', content: content.title } },
        { type: 'meta', props: { name: 'twitter:description', content: content.description } },
        { type: 'meta', props: { name: 'twitter:image', content: DEFAULT_OG_IMAGE } },
        {
          type: 'script',
          props: {
            type: 'application/ld+json',
          },
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: content.title,
            description: content.description,
            url: canonical,
            isPartOf: {
              '@type': 'WebSite',
              name: 'QYVORA',
              url: SITE_URL,
            },
          }),
        },
      ]),
    },
  };
}
