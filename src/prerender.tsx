import type { PrerenderArguments, PrerenderResult } from 'vite-prerender-plugin';
import { buildOrganization } from '@/shared/seo/schema';
import { canonicalUrl } from '@/shared/seo/metadata';
import { loadToolSeoByPath } from '@/shared/seo/toolSeoForPrerender';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import { TOOLS } from '@/features/marketing/data/tools/registry';

const SITE_URL = canonicalUrl('/');
const DEFAULT_OG_IMAGE = `${SITE_URL}og-image.png`;

interface Section {
  heading: string;
  body?: string;
  bullets?: string[];
}

interface RouteContent {
  /**
   * Omitted for tool routes: those read their title/description from the tool
   * registry + doc data via `getToolSeoByPath`, so the static head and the
   * client head are generated from one source.
   */
  title?: string;
  description?: string;
  h1: string;
  lead: string;
  sections?: Section[];
  links?: { label: string; href: string }[];
  canonical?: string;
}

/**
 * Prerendered body copy for indexable public routes.
 *
 * The `<h1>`, lead, sections and links below are crawler-visible text that the
 * client bundle would otherwise only produce after hydration.
 */
const routeContent: Record<string, RouteContent> = {
  '/': {
    title: 'QYVORA | Africa\'s Offensive Security Platform',
    description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training, penetration testing, and advanced intelligence tools.',
    h1: 'QYVORA | Africa\'s Offensive Security Platform',
    lead: 'Train like a hacker. Build Africa\'s cyber professionals. QYVORA is Africa\'s offensive security platform: structured training, hands-on attack labs, professional penetration testing services, and open-source tooling built for operators.',
    sections: [
      {
        heading: 'Train Like a Hacker',
        body: 'From the Hacker Protocol Bootcamp to structured content labs and hands-on attack labs, QYVORA sharpens your skills from the ground up: privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain.',
      },
      {
        heading: 'Tools for Operators',
        body: 'anansi runs a nine-phase attack-surface reconnaissance pipeline from the terminal. toha3ee is a local & network security assessment framework in Go covering discovery, enumeration, credential auditing, wireless and MITM capabilities. sekhmet is a baseline-aware fuzzing & vulnerability discovery framework that profiles normal behaviour before fuzzing.',
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
      { label: 'Learn', href: '/learn' },
      { label: 'Services', href: '/services' },
      { label: 'anansi', href: '/anansi' },
      { label: 'toha3ee', href: '/toha3ee' },
      { label: 'shaka', href: '/shaka' },
      { label: 'nzinga', href: '/nzinga' },
      { label: 'jabari', href: '/jabari' },
      { label: 'aksum', href: '/aksum' },
      { label: 'sekhmet', href: '/sekhmet' },
      { label: 'mansa', href: '/mansa' },
      { label: 'amanirenas', href: '/amanirenas' },
      { label: 'sundiata', href: '/sundiata' },
      { label: 'timbuktu', href: '/timbuktu' },
      { label: 'kush', href: '/kush' },
      { label: 'imhotep', href: '/imhotep' },
      { label: 'Zero Day Market', href: '/zero-day-market' },
      { label: 'Quiteroot', href: '/quiteroot' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Team', href: '/team' },
      { label: 'Leadership', href: '/leadership' },
      { label: 'Leaderboard', href: '/leaderboard' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy | QYVORA',
    description: 'How QYVORA collects, uses, shares, and protects personal data across its platform, training programmes, and professional services.',
    h1: 'Privacy Policy',
    lead: 'How QYVORA collects, uses, shares, and protects personal data across the platform, training programmes, and professional services.',
    sections: [
      {
        heading: 'Data we collect',
        bullets: [
          'Account, authentication, and security data',
          'Learning, certificate, and credential data',
          'Programme registration and payment-confirmation references',
          'Communications, usage, and device diagnostics',
        ],
      },
      {
        heading: 'How we use personal data',
        body: 'We use personal data to provide and secure the platform, deliver training and services, issue and verify credentials, process registrations, support users, improve performance, and meet legal obligations.',
      },
      {
        heading: 'Your rights',
        body: 'Subject to applicable law, you may access, correct, delete, restrict, or object to our processing, request a portable copy, and withdraw consent. Privacy requests can be sent to the operations desk with the subject "Privacy request".',
      },
      {
        heading: 'Cookies',
        body: 'Cookies and browser storage are used for authentication, security, preferences, and consent-gated performance measurement. See the Cookie Policy for categories and controls.',
      },
    ],
    links: [
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security & Responsible Disclosure', href: '/security' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/cookies': {
    title: 'Cookie Policy | QYVORA',
    description: 'The cookies and browser storage QYVORA uses, why we use them, and how you can change your choices at any time.',
    h1: 'Cookie Policy',
    lead: 'The cookies and browser storage QYVORA uses, why we use them, and how you can change your choices at any time.',
    sections: [
      {
        heading: 'Strictly necessary',
        body: 'Required for authentication, session security, CSRF protection, rate limiting, and remembering your consent choices. These cannot be switched off through the banner.',
      },
      {
        heading: 'Functional',
        body: 'Optional storage for appearance, layout, install prompts, onboarding, and browser-only learning progress.',
      },
      {
        heading: 'Analytics and performance',
        body: 'Consent-gated performance measurement and landing-page caching. We do not use third-party advertising or cross-site tracking cookies.',
      },
      {
        heading: 'Managing preferences',
        body: 'Use the "Manage cookie preferences" button on this page, the "Customize" option in the consent banner, or your browser settings. Blocking strictly necessary items prevents sign-in and weakens security protections.',
      },
    ],
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  '/security': {
    title: 'Security, Compliance & Responsible Disclosure | QYVORA',
    description: 'How to report a security vulnerability to QYVORA, our safe-harbour commitment, and the security, privacy, and quality frameworks we are evaluating.',
    h1: 'Security, Compliance & Responsible Disclosure',
    lead: 'How to report a security vulnerability to QYVORA, our safe-harbour commitment, and the security, privacy, and quality frameworks we are evaluating.',
    sections: [
      {
        heading: 'Report a vulnerability',
        body: 'Send reports privately to the security desk with the subject "Security report". Include a clear description, reproduction steps, impact, and a short proof of concept that does not damage data or disrupt service.',
      },
      {
        heading: 'In scope',
        body: 'qyvora.org and its public pages, the QYVORA API, authentication and account flows, the credential registry and verification flow, and QYVORA-owned open-source tools.',
      },
      {
        heading: 'Out of scope',
        body: 'Social engineering, physical attacks, denial-of-service, automated high-volume scanning, accessing other users\u2019 data, third-party services, and public disclosure before a coordinated date.',
      },
      {
        heading: 'Safe harbour',
        body: 'Good-faith research that follows this policy will not lead to legal action from QYVORA for the research itself. Do not access, retain, or share data that does not belong to you.',
      },
      {
        heading: 'Our response',
        body: 'We aim to acknowledge reports within 3 business days and complete initial triage within 10 business days where the report is complete. We prefer coordinated disclosure and will agree a realistic timeline with you.',
      },
      {
        heading: 'Compliance posture',
        body: 'We do not hold ISO/IEC 27001:2022, ISO/IEC 27701, ISO 9001:2015, ISO/IEC 42001:2023, or SOC 2 certification today. We are evaluating these frameworks and publish their status instead of displaying unearned badges. We handle personal data under the Ghana Data Protection Act 2012 (Act 843) and GDPR where relevant.',
      },
    ],
    links: [
      { label: 'Compliance posture', href: '/security#compliance' },
      { label: 'security.txt', href: '/.well-known/security.txt' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/refund-policy': {
    title: 'Refund & Cancellation Policy | QYVORA',
    description: 'How cancellations, refunds, and instalment payments work for QYVORA bootcamps, labs, and professional services.',
    h1: 'Refund & Cancellation Policy',
    lead: 'How cancellations, refunds, and instalment payments work for QYVORA bootcamps, labs, and professional services.',
    sections: [
      {
        heading: 'Bootcamp tuition and instalments',
        body: 'QOSE is a three-month programme with a total tuition of GH\u20b5800, paid in three instalments. The first instalment is GH\u20b5300 and confirms your place; the remaining instalments are set out on the QOSE programme page.',
      },
      {
        heading: 'Cancelling before the programme starts',
        body: 'If you cancel before the cohort start date, contact us. We will refund tuition for content that has not started, less non-recoverable payment-processing costs, unless the law requires a different outcome.',
      },
      {
        heading: 'Cancelling after the programme starts',
        body: 'The instalment for a stage that has started is non-refundable. Future instalments that are not yet due can be cancelled, and paid-ahead months that have not started can be refunded.',
      },
      {
        heading: 'Labs and professional services',
        body: 'Self-paced digital labs are generally non-refundable once started. Professional engagements follow the cancellation and payment terms in the applicable statement of work.',
      },
      {
        heading: 'How to request a refund',
        body: 'Email the operations desk with the subject "Refund request", including your name, programme or service, registration email, payment reference, and reason. We aim to acknowledge within 3 business days and decide within 10 business days once we have the information we need.',
      },
    ],
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'QOSE programme', href: '/qose' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/accessibility': {
    title: 'Accessibility Statement | QYVORA',
    description: "QYVORA's commitment to making the platform and learning materials usable by as many people as possible.",
    h1: 'Accessibility Statement',
    lead: 'QYVORA\u2019s commitment to making the platform and learning materials usable by as many people as possible.',
    sections: [
      {
        heading: 'Our commitment',
        body: 'We aim to meet WCAG 2.2 Level AA for public pages and core learning flows, and we treat accessibility as ongoing work rather than a one-time checklist.',
      },
      {
        heading: 'What we do',
        bullets: [
          'Semantic HTML, labelled forms, and logical headings',
          'Keyboard navigation, visible focus, and a skip link',
          'Contrast checks and reduced-motion support',
          'Responsive layouts and accessible names for icon controls',
          'Captions or transcripts where available',
        ],
      },
      {
        heading: 'Known limitations',
        body: 'Some older PDFs and downloads may not be fully tagged, third-party embeds are outside our direct control, and complex terminal or lab simulations may need additional assistance for some users.',
      },
      {
        heading: 'Feedback',
        body: 'Contact the operations desk with the subject "Accessibility" and tell us the page or feature, what happened, and the assistive technology you used if you are comfortable sharing it. We aim to acknowledge within 5 business days.',
      },
    ],
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/acceptable-use': {
    title: 'Acceptable Use & Community Guidelines | QYVORA',
    description: "The standards we expect from everyone using QYVORA's platform, labs, programmes, and community channels.",
    h1: 'Acceptable Use & Community Guidelines',
    lead: 'The standards we expect from everyone using QYVORA\u2019s platform, labs, programmes, and community channels.',
    sections: [
      {
        heading: 'Authorized use only',
        body: 'Only test systems you own or have explicit written permission to test. Lab exercises must stay inside the in-scope lab environment. Never use QYVORA skills or tools for unauthorized access or harm.',
      },
      {
        heading: 'Respect and privacy',
        body: 'No harassment, threats, hate speech, discrimination, doxxing, or sharing another learner\u2019s private information. Do not impersonate staff, instructors, or other learners.',
      },
      {
        heading: 'Prohibited conduct',
        bullets: [
          'Illegal activity, malware, extortion, fraud, or stolen data and access',
          'Spam, unsolicited advertising, or repetitive low-value posting',
          'Scraping or bulk collection without written permission',
          'Circumventing access controls, paywalls, or rate limits',
          'Sharing account credentials',
          'Interfering with the platform or other learners',
        ],
      },
      {
        heading: 'Learning integrity',
        body: 'Do not complete assessments for another person, forge or misrepresent credentials, or share live assessment answers. Collaborate only where the exercise allows it.',
      },
      {
        heading: 'Enforcement',
        body: 'We may warn, remove content, suspend, or terminate accounts, and may report serious conduct to authorities. Appeals can be sent with the subject "Community appeal".',
      },
    ],
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security & Responsible Disclosure', href: '/security' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
  '/learn': {
    title: 'Learn | QYVORA',
    description: 'Labs, the Hacker Protocol Bootcamp, simulations and more.',
    h1: 'Learn',
    lead: 'Labs, the Hacker Protocol Bootcamp, simulations and more.',
    sections: [
      {
        heading: 'What is here',
        body: 'Everything QYVORA teaches is collected on one page and grouped by how you want to learn.',
        bullets: [
          'COURSES: structured offensive security material you can work through at your own pace',
          'LABS: hands-on exercises against deliberately vulnerable targets',
          'BOOTCAMP: the Hacker Protocol Bootcamp, our structured cohort programme',
          'SIMULATIONS: browser-based tooling you can try with no account and no setup',
          'CYBERPOINTS: the points system that tracks your progress across the platform',
        ],
      },
    ],
    links: [
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
      { label: 'Simulations', href: '/simulations' },
      { label: 'Services', href: '/services' },
      { label: 'Zero Day Market', href: '/zero-day-market' },
    ],
  },
  '/simulations': {
    title: 'Simulations | QYVORA',
    description:
      "Try QYVORA's simulation tools live in your browser: browser terminal and a network visualizer. No account required.",
    h1: 'Simulations',
    lead: "Try the tools before you commit. Every simulation runs live in your browser, with no account and no setup.",
    sections: [
      {
        heading: 'Browser Terminal — Linux Shell',
        body: 'A full Linux shell running in your browser. Navigate a realistic filesystem, inspect permissions, and chain commands with pipes and redirects.',
        bullets: [
          'Realistic Linux filesystem',
          'Pipes, redirects, and environment variables',
          'Persistent session state',
          'Typed output with realistic timing',
        ],
      },
      {
        heading: 'Network — Visualizer',
        body: 'Map live network topologies: hosts, subnets, ports, and services, the same way operators build a picture of a target environment.',
        bullets: [
          'Interactive topology canvas',
          'Host and service discovery',
          'Subnet grouping',
          'Drag and connect nodes',
        ],
      },
    ],
    links: [
      { label: 'Browser Terminal', href: '/simulations/terminal' },
      { label: 'Network', href: '/simulations/network-visualizer' },
      { label: 'Learn', href: '/learn' },
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
    ],
  },
  '/tools': {
    title: 'Tools | QYVORA',
    description: 'Open-source offensive security tools, documented for operators.',
    h1: 'Combat-ready tools, documented end to end.',
    lead: 'Open-source offensive security tools, built and documented for operators. Each tool has full documentation, install guides, and walkthroughs.',
    sections: [
      {
        heading: 'Web & OSINT',
        bullets: ['anansi — web application security testing from the terminal', 'nzinga — authorized OSINT collection and correlation'],
      },
      {
        heading: 'Network & Directory',
        bullets: ['toha3ee — local and network security assessment', 'shaka — Windows and Active Directory assessment', 'mansa — authorized wireless security assessment'],
      },
      {
        heading: 'Binary & Fuzzing',
        bullets: ['aksum — binary assessment and reverse engineering', 'kush — offline malware sample analysis', 'sekhmet — baseline-aware fuzzing and vulnerability discovery'],
      },
      {
        heading: 'Mobile',
        bullets: ['jabari — Android device assessment', 'amanirenas — offline iOS and Android app assessment'],
      },
      {
        heading: 'Infrastructure',
        bullets: ['imhotep — offline cloud snapshot analysis', 'sundiata — identity and access assessment for Active Directory', 'timbuktu — incident response and digital forensics'],
      },
      {
        heading: 'Shared',
        bullets: ['qyvora-common — the contract and conformance suite every QYVORA framework is built against'],
      },
    ],
    links: [
      { label: 'Learn', href: '/learn' },
      { label: 'Simulations', href: '/simulations' },
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
    ],
  },
  '/about': {
    title: 'About | QYVORA',
    description: 'The team, research collective, security practices, and mission behind QYVORA.',
    h1: 'Built in Africa, for African defenders.',
    lead: 'QYVORA is an offensive security training platform and services team. Get to know the people, mission, and security practices driving it.',
    sections: [
      {
        heading: 'Security, privacy, and responsible technology',
        body: 'We are building our formal security and privacy programme. We publish framework status on our Security page and do not display certification badges we have not earned. Personal data is handled under our Privacy Policy and applicable data-protection law.',
      },
    ],
    links: [
      { label: 'Team', href: '/team' },
      { label: 'Security & compliance', href: '/security' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blogs' },
    ],
  },
  '/contact': {
    title: 'Contact | QYVORA',
    description: 'Reach the QYVORA operations desk: email, WhatsApp channel, and the secure message form.',
    h1: 'Contact the Desk',
    lead: 'Establishing a secure channel for inquiries, partnerships, and operational support.',
    links: [
      { label: 'About QYVORA', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blogs' },
    ],
  },
  '/simulations/terminal': {
    title: 'Browser Terminal — Linux Shell | QYVORA',
    description:
      'A full Linux shell running in your browser. Navigate a realistic filesystem, inspect permissions, and chain commands with pipes and redirects.',
    h1: 'Browser Terminal — Linux Shell',
    lead: 'A full Linux shell running in your browser. Navigate a realistic filesystem, inspect permissions, and chain commands with pipes and redirects.',
    sections: [
      {
        heading: 'What you get',
        bullets: [
          'Realistic Linux filesystem',
          'Pipes, redirects, and environment variables',
          'Persistent session state',
          'Typed output with realistic timing',
        ],
      },
    ],
    links: [
      { label: 'Network Visualizer', href: '/simulations/network-visualizer' },
      { label: 'All simulations', href: '/simulations' },
      { label: 'Learn', href: '/learn' },
    ],
  },
  '/simulations/network-visualizer': {
    title: 'Network — Visualizer | QYVORA',
    description:
      'Map live network topologies: hosts, subnets, ports, and services, the same way operators build a picture of a target environment.',
    h1: 'Network — Visualizer',
    lead: 'Map live network topologies: hosts, subnets, ports, and services, the same way operators build a picture of a target environment.',
    sections: [
      {
        heading: 'What you get',
        bullets: [
          'Interactive topology canvas',
          'Host and service discovery',
          'Subnet grouping',
          'Drag and connect nodes',
        ],
      },
    ],
    links: [
      { label: 'Browser Terminal', href: '/simulations/terminal' },
      { label: 'All simulations', href: '/simulations' },
      { label: 'Learn', href: '/learn' },
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
    description: 'How the HPB 2026 Cohort produced a COO, formed the Quiteroot tech team, and proved Africa\'s talent pipeline works.',
    h1: 'HPB 2026 Cohort - Case Study',
    lead: 'From Training to Team Building: The Hacker Protocol Bootcamp Story. How the cohort produced a COO, formed the Quiteroot tech team, and proved Africa\'s talent pipeline works.',
    sections: [
      {
        heading: 'Post details',
        body: 'Written by WSUITS6 (Alhassan Osman Wunpini), July 2026, 10 min read.',
      },
    ],
    links: [{ label: 'All Blog Posts', href: '/blogs' }],
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
    title: 'Quiteroot | QYVORA',
    description: "Quiteroot is QYVORA's technical team: a Tech Team and a Security Team. Every role is published, filled or open, and open roles are advertised on the Contact page.",
    h1: 'Quiteroot',
    lead: "QYVORA's technical team, split into two branches: the Tech Team that builds QYVORA's products and interfaces, and the Security Team that runs its offensive-security tooling, research and authorized security work.",
    sections: [
      {
        heading: 'Quiteroot Tech Team',
        body: 'Junior and Senior Frontend Developers, Junior and Senior Backend Developers, a Full-Stack Developer, a UI/UX Designer and a Graphic & Brand Designer. Every documented role is published, whether it is filled or open.',
      },
      {
        heading: 'Quiteroot Security Team',
        body: 'A Senior Penetration Tester, a Junior Penetration Tester, a Security Researcher, an Offensive Security Engineer and a Security Tool Developer. No testing without written authorization.',
      },
      {
        heading: 'Every role is published',
        body: 'A person is placed in a Quiteroot role because QYVORA has demonstrated what they can do, never because the seat needs filling. Open roles show the evidence that qualifies, so you can see exactly what is being looked for before you apply.',
      },
    ],
    links: [
      { label: 'Apply on the Contact page', href: '/contact' },
      { label: 'Team', href: '/team' },
    ],
  },
  '/qose': {
    title: 'Offensive Security Engineer Bootcamp (QOSE) | QYVORA',
    // QOSE-COMPLETE (2026-11-06): keep static/prerendered copy aligned with the
    // canonical Cohort 1 dates and the 3-month delivery model.
    description: 'QOSE is a 3-month, practical-first online bootcamp that turns Hacker Protocol Bootcamp graduates into entry-level offensive-security practitioners.',
    h1: 'QYVORA Offensive Security Engineer Bootcamp',
    lead: 'Three months from Hacker Protocol Bootcamp foundations to structured, authorized assessment work. Cohort 1 registration opens 10 November 2026.',
    sections: [
      {
        heading: 'What it covers',
        body: 'Offensive security operations and the engagement lifecycle, professional reconnaissance and attack-surface mapping, web application security, network and systems security, enterprise security, offensive security engineering, and advanced security exposure.',
      },
      {
        heading: 'Who it is for',
        body: 'Learners who have completed the Hacker Protocol Bootcamp or hold equivalent grounding in the Linux terminal, networking, scripting, reconnaissance, web security and OSINT. Delivery is online, on Kali Linux with VMs and containerized labs.',
      },
      {
        heading: 'Cohort 1 dates',
        body: 'Registration opens 10 November and closes 14 November 2026 at 23:59 GMT. Classes begin 15 November 2026. The form starts a secure Paystack checkout for full payment or the first instalment; a seat is confirmed only after the first payment is verified.',
      },
    ],
    links: [
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
      { label: 'Learn', href: '/learn' },
      { label: 'Quiteroot', href: '/quiteroot' },
    ],
  },
  '/anansi': {
    h1: 'anansi',
    lead: 'anansi – web application security testing from the terminal. A nine-phase recon pipeline from subdomain discovery to exploit-chain analysis.',
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
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.sh | bash',
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
    links: [
      { label: 'toha3ee', href: '/toha3ee' },
      { label: 'nzinga', href: '/nzinga' },
    ],
  },
  '/toha3ee': {
    h1: 'toha3ee',
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
          'Linux / macOS: curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.sh | bash',
          'Windows (PowerShell): irm https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.ps1 | iex',
          'From a checkout: make install',
        ],
      },
    ],
    links: [{ label: 'anansi', href: '/anansi' }],
  },
  '/jabari': {
    h1: 'jabari',
    lead: 'Android security assessment from the terminal. Connect via USB or Wi-Fi (ADB) to evaluate device posture, application hardening, and system exposures with reproducible evidence.',
    sections: [
      {
        heading: 'The seven stages',
        bullets: [
          'DISCOVERY, ADB device enumeration: manufacturer, model, build, patch level, kernel, root indicators',
          'ENUMERATION, package inventory, system properties and posture facts gathered from the device',
          'ANALYSIS, rule engine evaluates posture. AND-001..007 detect debuggable, rooted, outdated or exposed devices',
          'VALIDATION, non-destructive confirmation of findings with honest low-confidence attribution',
          'EVIDENCE, SHA-256-hashed evidence store ties every finding to a reproducible artifact',
          'RISK, severity × confidence scoring ranks what to fix first',
          'REPORTING, offline re-renderable sessions: table, JSON, YAML, text, Markdown or HTML',
        ],
      },
      {
        heading: 'Authorization guarantee',
        body: 'Jabari assesses only explicitly authorized USB and network-connected Android devices. High-risk modules require confirmation or explicit flags.',
      },
      {
        heading: 'Install',
        body: 'git clone https://github.com/QYVORA/qyvora-jabari && cd qyvora-jabari && make install-user',
      },
      {
        heading: 'Usage',
        bullets: [
          'jabari assess usb',
          'jabari assess ip 192.168.1.50 -p deep -y',
          'jabari report --list',
        ],
      },
    ],
    links: [{ label: 'aksum', href: '/aksum' }],
  },
  '/aksum': {
    h1: 'aksum',
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
    links: [{ label: 'jabari', href: '/jabari' }],
  },
  '/sekhmet': {
    h1: 'sekhmet',
    lead: 'Baseline-aware fuzzing from the terminal. Profile a target\u2019s normal behaviour first, then mutate, execute and classify crashes, hangs and anomalies against that profile instead of fuzzing blindly.',
    sections: [
      {
        heading: 'The ten stages',
        bullets: [
          'BASELINE, profile normal exit codes, signals, runtime and output variance before fuzzing',
          'CORPUS, persistent seed store with SHA-256 dedup, priority ordering and trimming',
          'MUTATE, 17 structured operators driven by a seeded RNG for reproducibility',
          'EXECUTE, process {fuzz}/{stdin} templates with no shell, HTTP payloads, or a deterministic simulation target',
          'CLASSIFY, crash, hang, and anomaly classification relative to the baseline with sanitizer text matching',
          'DEDUP, SHA-256 signatures collapse thousands of near-identical crashes into unique findings',
          'FEEDBACK, novelty scoring over behavioral, edge, and block coverage keeps the campaign aimed at new code',
          'SCHEDULE, power scheduling across fast, explore, exploit, rare, balanced, and adaptive strategies',
          'MINIMIZE, delta-debugging reducer turns an interesting input into a minimal reproducer',
          'REPORT, terminal, JSON or YAML with a JSONL event stream (schema_version, execution_id, framework)',
        ],
      },
      {
        heading: 'Authorization guarantee',
        body: 'sekhmet fuzzes only the declared target. Local process targets are scoped to the declared path, remote HTTP targets require an explicit authorization acknowledgement, and --dry-run audits a campaign before anything executes. Command execution is shell-free so inputs cannot reach a shell.',
      },
      {
        heading: 'Install',
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-sekhmet/main/install.sh | bash',
      },
      {
        heading: 'Usage',
        bullets: [
          'sekhmet target set --name sim --kind simulation',
          'sekhmet baseline --target sim',
          'sekhmet fuzz --target sim --runs 100000',
          'sekhmet crashes --session <id>',
          'sekhmet minimize --input interesting.bin',
          'sekhmet report --session <id> --format json > report.json',
        ],
      },
    ],
    links: [{ label: 'jabari', href: '/jabari' }],
  },
  '/mansa': {
    h1: 'mansa',
    lead: 'Authorized wireless security assessment from the terminal. Discover interfaces, enumerate access points, observe stations, and run the deterministic rule engine with transparent risk scoring — offline with --sim or on declared live scopes.',
    sections: [
      {
        heading: 'The eight stages',
        bullets: [
          'DISCOVER, list wireless interfaces and their capabilities (bands, modes, power)',
          'ENUMERATE, scan for access points and record BSSID, SSID, channel, band, RSSI, protocols and cipher suites',
          'OBSERVE, watch stations and traffic, client behavior, association patterns and signal anomalies',
          'ANALYZE, run the deterministic rule engine (WLAN-001+) over the session',
          'VALIDATE, cross-check each finding against raw evidence and hold confidence until confirmed',
          'FINDINGS, deterministic IDs (WLAN-<category>-<hash>) with supporting evidence records',
          'RISK, severity_weight × confidence × exposure_factor × 35, capped at 100',
          'REPORT, terminal, markdown or JSON with a JSONL event stream (schema_version, execution_id, framework)',
        ],
      },
      {
        heading: 'Authorization guarantee',
        body: 'mansa assesses only the wireless networks and interfaces you explicitly declare and have authorization to test. Live scopes require an explicit authorization acknowledgement, while --sim runs the full deterministic pipeline offline against the built-in simulated dataset.',
      },
      {
        heading: 'Install',
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.sh | bash',
      },
      {
        heading: 'Usage',
        bullets: [
          'mansa assess --sim',
          'mansa discover --sim',
          'mansa scan --sim',
          'mansa enumerate --sim',
          'mansa observe --sim',
          'mansa analyze',
          'mansa findings',
          'mansa evidence',
          'mansa report -f json --out report.json',
        ],
      },
    ],
    links: [{ label: 'sekhmet', href: '/sekhmet' }],
  },
  '/amanirenas': {
    h1: 'amanirenas',
    lead: 'Offline mobile app security assessment from the terminal. Analyze app packages (IPA/APK/AAB) for hardcoded secrets, weak cryptography, insecure endpoint usage and WebView posture — without a device, an emulator or live runtime access.',
    sections: [
      {
        heading: 'Guarantees',
        bullets: [
          'Offline by design — analyzes only the app package you point it at; live runtime/device collection is refused honestly',
          'Six-stage pipeline: intake, metadata, static analysis, configuration, API endpoints and evidence-backed findings',
          'Deterministic rule engine (AMN-001+) — a rule is a pure function of the read-only environment',
          'Risk scores are transparent: severity_weight × confidence × exposure, capped at 100',
        ],
      },
      {
        heading: 'Install',
        body: 'git clone --depth 1 https://github.com/QYVORA/qyvora-amanirenas && cd qyvora-amanirenas && go build ./cmd/amanirenas',
      },
      {
        heading: 'Usage',
        bullets: [
          'amanirenas assess --sim',
          'amanirenas package --output app.json',
          'amanirenas assess --package app.json',
          'amanirenas findings',
          'amanirenas evidence',
          'amanirenas report -f json --out report.json',
        ],
      },
    ],
    links: [{ label: 'imhotep', href: '/imhotep' }],
  },
  '/sundiata': {
    h1: 'sundiata',
    lead: 'Identity & access security assessment for Windows Active Directory from the terminal. Identity discovery, account posture, password policy evaluation and sensitive group membership checks — credentials are redacted at collection time and never stored.',
    sections: [
      {
        heading: 'Guarantees',
        bullets: [
          'No live collection — identity data is read from captured/recorded sources only; live collection is refused honestly',
          'Credentials are redacted at collection time and never written to disk, logs or reports',
          'Deterministic rule engine (SDT-001+) over identity posture, account posture and sensitive memberships',
          'Risk scores are transparent: severity_weight × confidence × exposure, capped at 100',
        ],
      },
      {
        heading: 'Install',
        body: 'git clone --depth 1 https://github.com/QYVORA/qyvora-sundiata && cd qyvora-sundiata && go build ./cmd/sundiata',
      },
      {
        heading: 'Usage',
        bullets: [
          'sundiata assess --sim',
          'sundiata recruit --identity identity.yaml',
          'sundiata assess --lease identities.yaml',
          'sundiata findings',
          'sundiata evidence',
          'sundiata report -f json --out report.json',
        ],
      },
    ],
    links: [{ label: 'timbuktu', href: '/timbuktu' }],
  },
  '/timbuktu': {
    h1: 'timbuktu',
    lead: 'Incident response and digital forensics from the terminal. Analyze offline case data: source integrity, artifact identification, filesystem lifecycle, memory postmortems, log analysis and evidence-backed timelines.',
    sections: [
      {
        heading: 'Guarantees',
        bullets: [
          'Offline only — analyzes recorded case data; live acquisition is refused honestly',
          'Evidence-backed forensic timeline: every entry carries source, observed_at and integrity',
          'Deterministic rule engine across integrity, artifacts, filesystem, memory, logs and timelines',
          'Risk scores are transparent: severity_weight × confidence × exposure, capped at 100',
        ],
      },
      {
        heading: 'Install',
        body: 'git clone --depth 1 https://github.com/QYVORA/qyvora-timbuktu && cd qyvora-timbuktu && go build ./cmd/timbuktu',
      },
      {
        heading: 'Usage',
        bullets: [
          'timbuktu assess --sim',
          'timbuktu case --output case.json',
          'timbuktu assess --case case.json',
          'timbuktu timeline',
          'timbuktu findings',
          'timbuktu report -f json --out report.json',
        ],
      },
    ],
    links: [{ label: 'kush', href: '/kush' }],
  },
  '/kush': {
    h1: 'kush',
    lead: 'Offline malware sample analysis from the terminal. Hash samples, extract metadata, analyze static posture and strings, surface network indicators and classify IOCs — without ever executing the sample on the developer host.',
    sections: [
      {
        heading: 'Guarantees',
        bullets: [
          'Static by design — samples are never executed on the developer host; dynamic execution is refused honestly',
          'Nine-stage pipeline: intake, hashing, metadata, static, strings, behavior, network, IOC and risk',
          'Deterministic rule engine (KSH-001+) with verified high-confidence IOC catalog',
          'Risk scores are transparent: severity_weight × confidence × exposure, capped at 100',
        ],
      },
      {
        heading: 'Install',
        body: 'git clone --depth 1 https://github.com/QYVORA/qyvora-kush && cd qyvora-kush && go build ./cmd/kush',
      },
      {
        heading: 'Usage',
        bullets: [
          'kush assess --sim',
          'kush sample --output sample.json',
          'kush assess --sample sample.json',
          'kush findings',
          'kush evidence',
          'kush report -f json --out report.json',
        ],
      },
    ],
    links: [{ label: 'sundiata', href: '/sundiata' }],
  },
  '/imhotep': {
    h1: 'imhotep',
    lead: 'Offline cloud snapshot analysis from the terminal. Analyze recorded cloud snapshots for IAM posture, storage exposure, network exposure, container posture and misconfigurations — without touching live provider APIs.',
    sections: [
      {
        heading: 'Guarantees',
        bullets: [
          'Offline by design — reads recorded snapshots only; live provider collection is refused honestly',
          'Secret material is redacted at collection time and never stored or printed',
          'Deterministic rule engine (IAM/STG/NET/DBE/CNT/SEC) across the snapshot surface',
          'Risk scores are transparent: severity_weight × confidence × exposure, capped at 100',
        ],
      },
      {
        heading: 'Install',
        body: 'git clone --depth 1 https://github.com/QYVORA/qyvora-imhotep && cd qyvora-imhotep && go build ./cmd/imhotep',
      },
      {
        heading: 'Usage',
        bullets: [
          'imhotep assess --sim',
          'imhotep snapshot --output snapshot.json',
          'imhotep assess --snapshot snapshot.json',
          'imhotep providers',
          'imhotep findings',
          'imhotep report -f json --out report.json',
        ],
      },
    ],
    links: [{ label: 'amanirenas', href: '/amanirenas' }],
  },
  '/shaka': {
    h1: 'shaka',
    lead: 'Windows & Microsoft Active Directory security assessment from the terminal. Domain discovery, directory enumeration, relationship graphs, privilege analysis and evidence-driven findings with an offline simulator.',
    sections: [
      {
        heading: 'The seven stages',
        bullets: [
          'DISCOVER, discover domains, domain controllers, forest topology, and directory boundaries',
          'ENUMERATE, enumerate users, groups, computers, organizational units, and trust relationships',
          'GRAPH, build typed relationship graph modeling principals, group memberships, and delegation paths',
          'ANALYZE, evaluate identity posture, Kerberos pre-auth, delegation configurations, and trust surfaces',
          'FINDINGS, execute deterministic rule engine with fingerprint deduplication and evidence-backed severity',
          'RISK, compute risk score (0-100) and risk level across directory findings',
          'REPORT, render terminal tables, schema-versioned JSON, Markdown, HTML, YAML, and JSONL event streams',
        ],
      },
      {
        heading: 'Authorization guarantee',
        body: 'shaka requires explicit authorization (--authorized / -y, config, or QYVORA_AUTHORIZED=true) before probing live Active Directory infrastructure. The built-in simulator (--sim) runs completely offline without touching a live network.',
      },
      {
        heading: 'Install',
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.sh | bash',
      },
      {
        heading: 'Usage',
        bullets: [
          'shaka assess --sim',
          'shaka discover --sim',
          'shaka enumerate users --sim',
          'shaka graph --sim',
          'shaka assess --endpoint dc01:389 --user audit --password secret --authorized',
          'shaka assess --sim --output json',
        ],
      },
    ],
    links: [
      { label: 'aksum', href: '/aksum' },
      { label: 'nzinga', href: '/nzinga' },
    ],
  },
  '/nzinga': {
    h1: 'nzinga',
    lead: 'Authorized open-source intelligence from the terminal. Public-source collection, cross-source correlation, and evidence-backed reporting with an offline simulator.',
    sections: [
      {
        heading: 'The seven stages',
        bullets: [
          'DISCOVER, validate and normalize the target, recording honest discovery hints without fabricating observations',
          'COLLECT, run enabled public sources (crt.sh CT logs, WHOIS, infrastructure, org, relationships) with bounded concurrency',
          'NORMALIZE, normalize source payloads into typed observations with provenance: source, observed_at, collected_at, raw_reference',
          'CORRELATE, link observations across sources into entities and a typed relationship graph',
          'ANALYZE, evaluate evidence-backed claims against deterministic rules (OSINT-001..004) with confidence and severity',
          'VALIDATE, confirm every finding traces to collected evidence; no absence is ever reported as absence-proof',
          'REPORT, render terminal tables plus schema-versioned JSON, Markdown, HTML, YAML, and JSONL event streams',
        ],
      },
      {
        heading: 'Authorization guarantee',
        body: 'nzinga collects only from public, open sources and performs authorized reconnaissance only. Live collection requires explicit authorization (--authorized / -y, config, or QYVORA_AUTHORIZED=true); the built-in simulator (--sim) runs offline against a deterministic dataset without network activity.',
      },
      {
        heading: 'Install',
        body: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash',
      },
      {
        heading: 'Usage',
        bullets: [
          'nzinga assess --sim',
          'nzinga assess -y domain:example.com --profile standard -o json',
          'nzinga sources list',
          'nzinga findings -f json',
          'nzinga relationship graph',
        ],
      },
    ],
    links: [
      { label: 'anansi', href: '/anansi' },
      { label: 'toha3ee', href: '/toha3ee' },
    ],
  },
  '/cp': {
    title: 'Cyber Coin (CP) | QYVORA',
    description: 'CP, the QYVORA Cyber Coin. The reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem.',
    h1: 'CP | QYVORA Cyber Coin',
    lead: 'Earn Your Progress. CP is the reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem. Learn. Execute. Earn.',
    sections: [
      {
        heading: 'A reward system built around capability',
        body: 'Instead of rewarding passive engagement, QYVORA rewards operators for actually progressing through its ecosystem, completing labs, passing quizzes, finishing bootcamp phases, clearing attack challenges, and reaching defined milestones.',
      },
      {
        heading: 'The philosophy',
        body: 'Knowledge is only the beginning. QYVORA is designed around the transition from consuming cybersecurity knowledge to actually executing it: KNOWLEDGE → PRACTICE → EXECUTION → VERIFICATION → REWARD.',
      },
      {
        heading: 'How you earn CP',
        bullets: [
          'Lab Completed - + CP',
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
      { label: 'Learn', href: '/learn' },
      { label: 'anansi', href: '/anansi' },
      { label: 'Leaderboard', href: '/leaderboard' },
    ],
  },
  '/team': {
    title: 'Team | QYVORA',
    description: 'Meet the complete QYVORA team - leadership, security operators, and engineers building Africa\'s offensive security platform.',
    h1: 'Our Team',
    lead: 'The complete QYVORA team directory — leadership, security operators, and engineers.',
    sections: [
      {
        heading: 'Three organizational sections',
        bullets: [
          'Founding & Leadership — Five executive positions steering the company',
          'QYVORA Security Team — Offensive security operators and researchers',
          'QYVORA Tech Team — Engineers and designers building the platform',
        ],
      },
    ],
    links: [
      { label: 'Leadership', href: '/leadership' },
      { label: 'Quiteroot', href: '/quiteroot' },
    ],
  },
  '/leadership': {
    title: 'Leadership | QYVORA',
    description: 'QYVORA\'s founding and executive leadership team - the five core positions driving the company\'s vision and operations.',
    h1: 'Founding & Executive Team',
    lead: 'The five founding and executive leaders steering QYVORA across Africa\'s cybersecurity landscape.',
    sections: [
      {
        heading: 'Leadership positions',
        bullets: [
          'CEO - Chief Executive Officer',
          'COO - Chief Operating Officer',
          'CMO - Chief Marketing Officer',
          'HRM - Human Resources Manager',
          'CM - Community Manager',
        ],
      },
    ],
    links: [
      { label: 'Full Team Directory', href: '/team' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/leaderboard': {
    title: 'Leaderboard | QYVORA',
    description: 'Top offensive security operators ranked by CP earnings.',
    h1: 'Operator Leaderboard',
    lead: 'Top offensive security operators ranked by CP earnings.',
    sections: [
      {
        heading: 'How it works',
        body: 'Operators earn CP through bootcamp phases, content labs, attack labs, and competitive events. The leaderboard ranks them by total CP earned.',
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
        body: 'Operators earn CP through bootcamp phases, content labs, attack labs, and competitive events. The leaderboard ranks them by total CP earned.',
      },
    ],
    links: [{ label: 'Zero Day Market', href: '/zero-day-market' }],
  },
  '/faq': {
    title: 'FAQ | QYVORA',
    description: 'Answers about QYVORA bootcamps, services, platform access, credentials, and support.',
    h1: 'Frequently Asked Questions',
    lead: 'Answers about QYVORA bootcamps, services, platform access, credentials, and support.',
    sections: [
      {
        heading: 'Bootcamps and registration',
        // Keep prerendered FAQ copy aligned with the live registration window.
        body: 'QOSE registration opens 10 November and closes 14 November 2026 at 23:59 GMT; classes begin 15 November. Tuition is GH\u20b5800, payable in full or as GH\u20b5300 followed by GH\u20b5250 in each of the next two months. The form starts a secure Paystack checkout; a seat is confirmed only after the first payment is verified.',
      },
      {
        heading: 'Credentials and verification',
        body: 'Every QYVORA certificate carries a credential ID that can be checked publicly at /verify against the issuing registry and its QYVORA Chain anchor.',
      },
      {
        heading: 'Services and support',
        body: 'Professional pentest and training engagements start from the services page or a request-a-call form on the contact page. Support and privacy requests go to the operations desk.',
      },
    ],
    links: [
      { label: 'QOSE', href: '/qose' },
      { label: 'Hacker Protocol Bootcamp', href: '/hpb' },
      { label: 'Credentials', href: '/credentials' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/resources': {
    title: 'Cheat Sheets & Resources | QYVORA',
    description: 'QYVORA framework cheat sheets and practical command references for recon, web, network, exploitation, post-exploitation, and reversing work.',
    h1: 'Cheat Sheets & Resources',
    lead: 'QYVORA framework cheat sheets and practical command references for recon, web, network, exploitation, post-exploitation, and reversing work.',
    sections: [
      {
        heading: 'QYVORA framework sheets',
        body: 'Quick-reference sheets for anansi, toha3ee, shaka, nzinga, jabari, aksum, sekhmet, mansa, amanirenas, imhotep, sundiata, timbuktu, and kush.',
      },
      {
        heading: 'Popular tool references',
        body: 'Grouped command references covering reconnaissance and OSINT, web testing, network assessment, exploitation, post-exploitation, reversing, wireless, and general operator workflows.',
      },
      {
        heading: 'Authorized use',
        body: 'These references are for authorized security testing, labs, and education only. Never run them against systems you do not own or have written permission to test.',
      },
    ],
    links: [
      { label: 'All tools', href: '/tools' },
      { label: 'Tool changelog', href: '/changelog' },
      { label: 'Learn', href: '/learn' },
    ],
  },
  '/changelog': {
    title: 'Tool Changelog | QYVORA',
    description: 'Release notes and recent changes across the QYVORA offensive security framework collection.',
    h1: 'Tool Changelog',
    lead: 'Release notes and recent changes across the QYVORA offensive security framework collection.',
    sections: [
      {
        heading: 'Release tracker',
        body: 'Current releases are tracked per framework, with version, release date, and highlights. Detailed notes link to each repository CHANGELOG.md.',
      },
      {
        heading: 'Recent changes',
        body: 'Highlights cover new capabilities, reliability fixes, documentation updates, and compatibility changes across the collection.',
      },
    ],
    links: [
      { label: 'Cheat sheets', href: '/resources' },
      { label: 'All tools', href: '/tools' },
    ],
  },
  '/credentials': {
    title: 'Credentials | QYVORA',
    description: 'How QYVORA bootcamp credentials work: what they record, how public verification checks the registry and chain, and how revocation is handled.',
    h1: 'Credentials that can be checked',
    lead: 'A QYVORA credential is more than a PDF. Each one has a public ID, a registry record, and a chain anchor that anyone can verify.',
    sections: [
      {
        heading: 'What is recorded',
        body: 'Issued credentials record the recipient, programme, cohort, completion date, result, and a unique credential ID.',
      },
      {
        heading: 'Registry and chain anchoring',
        body: 'The registry record is the source of truth. A hash anchor on QYVORA Chain detects tampering or substitution, while revocation takes effect immediately without reissuing the certificate file.',
      },
      {
        heading: 'Public verification',
        body: 'Anyone can paste a credential ID at /verify to get a clear verdict: valid, revoked, suspended, or not found. No account is required.',
      },
    ],
    links: [
      { label: 'Verify a credential', href: '/verify' },
      { label: 'QOSE', href: '/qose' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  '/status': {
    title: 'System Status | QYVORA',
    description: 'Live status for the QYVORA API, database and chain, plus published incident updates.',
    h1: 'System Status',
    lead: 'Live health for the QYVORA platform services, plus incident updates published by the operations desk.',
    sections: [
      {
        heading: 'Live health checks',
        body: 'The page checks the API, database connection, and QYVORA Chain health probe, refreshing every 60 seconds.',
      },
      {
        heading: 'Published incidents',
        body: 'Only incidents explicitly published by an administrator appear here. Internal incidents, creator identities, and correlation IDs are never exposed.',
      },
    ],
    links: [
      { label: 'Contact the desk', href: '/contact' },
      { label: 'Security', href: '/security' },
    ],
  },
  '/sitemap': {
    title: 'Sitemap | QYVORA',
    description: 'A human-readable index of every public QYVORA page, including learning, tools, services, credentials, status, and legal documents.',
    h1: 'Every public page',
    lead: 'A human-readable index of the public site. Search engines can use the machine-readable version at /sitemap.xml.',
    sections: [
      {
        heading: 'Start here',
        bullets: ['Home', 'Learn', 'Hacker Protocol Bootcamp', 'QOSE', 'Simulations', 'Tools', 'Cheat sheets', 'Changelog'],
      },
      {
        heading: 'Company and trust',
        bullets: ['About', 'Team', 'Leadership', 'Services', 'Contact', 'FAQ', 'Credentials', 'Verify a credential', 'System status', 'Security and responsible disclosure', 'Compliance posture'],
      },
      {
        heading: 'Legal',
        bullets: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund and cancellation', 'Acceptable use', 'Security policy', 'Accessibility statement'],
      },
    ],
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

  const content =
    routeContent[url] || {
      title: 'QYVORA | Africa\'s Offensive Security Platform',
      description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training.',
      h1: 'QYVORA',
      lead: 'Building a strong cybersecurity ecosystem in Africa.',
    };

  // Tool pages take their head metadata from the tool registry + doc data so
  // the static head a crawler reads and the client head a visitor sees can
  // never drift apart.
  const toolSeo = await loadToolSeoByPath(url);

  const title = toolSeo?.fullTitle ?? content.title;
  const description = toolSeo?.description ?? content.description;
  const canonical = canonicalUrl(content.canonical || url);
  const ogImage = toolSeo?.image
    ? `${SITE_URL}${toolSeo.image}`
    : DEFAULT_OG_IMAGE;

  const html = `
    <div data-prerender="true">
      ${renderBody(content)}
    </div>
  `;

  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonical,
      isPartOf: {
        '@type': 'WebSite',
        name: 'QYVORA',
        url: SITE_URL,
      },
    },
    buildOrganization(),
  ];
  if (toolSeo) schemas.push(toolSeo.schema);

  // Check if this is a tool page
  const currentTool = TOOLS.find(tool => tool.path === url);
  
  // Build social media rel="me" links
  const socialLinks = SITE_CONFIG.social.map(social => ({
    type: 'link' as const,
    props: { rel: 'me', href: social.href }
  }));
  
  // Build tool-specific meta tags if this is a tool page
  const toolMetaTags = currentTool ? [
    { type: 'meta' as const, props: { name: 'keywords', content: `${currentTool.name}, cybersecurity tool, penetration testing, security assessment, ${currentTool.domain}, offensive security, QYVORA` } },
    { type: 'meta' as const, props: { name: 'github:repo', content: currentTool.repo } },
    { type: 'meta' as const, props: { name: 'github:url', content: currentTool.github } },
    { type: 'meta' as const, props: { property: 'article:author', content: SITE_CONFIG.contact.opsEmail } },
  ] : [];

  return {
    html,
    head: {
      lang: 'en',
      title,
      elements: new Set([
        { type: 'meta', props: { name: 'description', content: description } },
        { type: 'meta', props: { name: 'robots', content: 'index, follow, max-image-preview:large' } },
        { type: 'link', props: { rel: 'canonical', href: canonical } },
        { type: 'meta', props: { property: 'og:type', content: 'website' } },
        { type: 'meta', props: { property: 'og:title', content: title } },
        { type: 'meta', props: { property: 'og:description', content: description } },
        { type: 'meta', props: { property: 'og:url', content: canonical } },
        { type: 'meta', props: { property: 'og:image', content: ogImage } },
        { type: 'meta', props: { property: 'og:image:type', content: 'image/png' } },
        { type: 'meta', props: { property: 'og:image:width', content: '1200' } },
        { type: 'meta', props: { property: 'og:image:height', content: '630' } },
        { type: 'meta', props: { property: 'og:image:alt', content: title } },
        { type: 'meta', props: { property: 'og:site_name', content: 'QYVORA' } },
        { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
        { type: 'meta', props: { name: 'twitter:site', content: '@qyvorasec' } },
        { type: 'meta', props: { name: 'twitter:title', content: title } },
        { type: 'meta', props: { name: 'twitter:description', content: description } },
        { type: 'meta', props: { name: 'twitter:image', content: ogImage } },
        ...socialLinks,
        ...toolMetaTags,
        {
          type: 'script',
          props: {
            type: 'application/ld+json',
          },
          children: JSON.stringify(schemas),
        },
      ]),
    },
  };
}
