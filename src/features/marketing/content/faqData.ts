export interface FaqLink {
  label: string;
  to: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  links?: FaqLink[];
}

export interface FaqGroup {
  id: string;
  title: string;
  intro: string;
  items: FaqItem[];
}

/**
 * Public FAQ content. Answers link to the canonical page instead of repeating
 * policy or programme details that live elsewhere in the app.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    intro: 'What QYVORA does and where to begin.',
    items: [
      {
        id: 'what-is-qyvora',
        question: 'What is QYVORA?',
        answer:
          'QYVORA is a cybersecurity training and services organisation based in Tamale, Ghana. We run bootcamps, simulations and open-source security tooling, and we deliver authorized security assessments for organisations.',
        links: [
          { label: 'About QYVORA', to: '/about' },
          { label: 'Explore the tools', to: '/tools' },
        ],
      },
      {
        id: 'where-to-start',
        question: 'Which programme should I start with?',
        answer:
          'Start with the Hacker Protocol Bootcamp if you are new to security. QOSE begins where HPB ends, so it is the next step after HPB or equivalent foundational experience.',
        links: [
          { label: 'Hacker Protocol Bootcamp', to: '/hpb' },
          { label: 'QOSE', to: '/qose' },
        ],
      },
      {
        id: 'prior-experience',
        question: 'Do I need prior experience?',
        answer:
          'No experience is needed for HPB — it starts from how systems, networks and the web actually work. QOSE requires HPB or equivalent grounding in Linux, networking, scripting, reconnaissance and web security.',
        links: [{ label: 'Compare the programmes', to: '/learn' }],
      },
      {
        id: 'online-delivery',
        question: 'Are the programmes online?',
        answer:
          'Yes. Programmes are delivered online, with live sessions, labs and assignments. QOSE students work in Kali Linux with virtual machines and containerized labs.',
      },
      {
        id: 'location',
        question: 'Where is QYVORA based?',
        answer:
          'QYVORA is based in Tamale, Ghana, and our programmes are delivered online so learners can join from anywhere.',
        links: [{ label: 'Contact the desk', to: '/contact' }],
      },
    ],
  },
  {
    id: 'bootcamps',
    title: 'Bootcamps & enrolment',
    intro: 'HPB, QOSE and how registration works.',
    items: [
      {
        id: 'hpb-free',
        question: 'Is the Hacker Protocol Bootcamp free?',
        answer:
          'Yes. HPB is free. It runs for six weeks across five modules and nineteen rooms, with live sessions, labs, assignments and a CTF.',
        links: [{ label: 'See the HPB curriculum', to: '/hpb' }],
      },
      {
        id: 'hpb-enrol',
        question: 'How do I enrol in HPB?',
        answer:
          'Open the HPB page and choose “Enroll now”. The enrollment dialog takes you to the platform registration flow, and the community group carries the schedule and session links.',
        links: [{ label: 'Go to HPB', to: '/hpb' }],
      },
      {
        id: 'qose-dates',
        question: 'When does the next QOSE cohort start?',
        answer:
          'Registration opens in November 2026 for the cohort starting on 1 December 2026. QOSE runs for three months.',
        links: [{ label: 'QOSE dates and tuition', to: '/qose#qose-tuition-title' }],
      },
      {
        id: 'qose-fee',
        question: 'How much does QOSE cost?',
        answer:
          'QOSE tuition is GH₵800, paid in three instalments: GH₵300 in month one, then GH₵250 in months two and three. The first instalment confirms your seat.',
        links: [{ label: 'See the QOSE breakdown', to: '/qose#qose-tuition-title' }],
      },
      {
        id: 'qose-payment',
        question: 'Does the QOSE registration form take payment?',
        answer:
          'No. The form records your seat request. We then send payment instructions for the GH₵300 first instalment and confirm your place once it is received.',
        links: [{ label: 'Reserve a QOSE seat', to: '/qose#qose-enrol' }],
      },
      {
        id: 'qose-prerequisite',
        question: 'Can I join QOSE without HPB?',
        answer:
          'You can join with equivalent grounding in the Linux terminal, networking, scripting, reconnaissance, web security, OSINT and basic privilege escalation. If you are starting from zero, take HPB first.',
        links: [
          { label: 'Start with HPB', to: '/hpb' },
          { label: 'QOSE requirements', to: '/qose' },
        ],
      },
      {
        id: 'certificate',
        question: 'Do I get a certificate?',
        answer:
          'Where QYVORA issues a certificate, it carries a credential ID that anyone can verify publicly. Verification checks the issuing registry and its chain anchor and requires no account.',
        links: [{ label: 'Verify a credential', to: '/verify' }],
      },
    ],
  },
  {
    id: 'services',
    title: 'Security services',
    intro: 'Assessments, training and how engagements work.',
    items: [
      {
        id: 'what-services',
        question: 'What services does QYVORA offer?',
        answer:
          'We offer Basic and Standard web application penetration tests and a custom Employee Cybersecurity Bootcamp. Pricing and deliverables are listed on the services page.',
        links: [{ label: 'See services and pricing', to: '/services' }],
      },
      {
        id: 'basic-vs-standard',
        question: 'What is the difference between Basic and Standard testing?',
        answer:
          'Basic covers up to five application pages or endpoints with a focused OWASP Top 10 assessment. Standard covers the entire application in more depth, including authorization, business logic and file handling, and includes one free retest after remediation.',
        links: [{ label: 'Compare the assessments', to: '/services' }],
      },
      {
        id: 'request-assessment',
        question: 'How do I request an assessment?',
        answer:
          'Start from the services page and choose “Secure Your Company”, or contact the operations desk directly. We confirm scope and rules of engagement before any testing begins.',
        links: [
          { label: 'Request an assessment', to: '/services' },
          { label: 'Contact the desk', to: '/contact' },
        ],
      },
      {
        id: 'authorization',
        question: 'Do you test without authorization?',
        answer:
          'No. All assessment work is carried out inside written authorization and agreed rules of engagement. We do not test systems without permission.',
        links: [
          { label: 'Community guidelines', to: '/acceptable-use' },
          { label: 'Security policy', to: '/security' },
        ],
      },
    ],
  },
  {
    id: 'platform',
    title: 'Platform, tools & credentials',
    intro: 'Accounts, tooling and public verification.',
    items: [
      {
        id: 'verify-credential',
        question: 'How does credential verification work?',
        answer:
          'Paste the credential ID printed on a QYVORA certificate into the verification page. It checks the issuing registry and chain anchor and shows the recipient, programme and completion details. No account is needed.',
        links: [{ label: 'Verify a credential', to: '/verify' }],
      },
      {
        id: 'tools',
        question: 'Where can I find QYVORA’s security tools?',
        answer:
          'Every tool has a documentation page linked from the tools index, including installation, commands and usage guidance.',
        links: [{ label: 'Browse all tools', to: '/tools' }],
      },
      {
        id: 'cheatsheets',
        question: 'Do you publish cheat sheets?',
        answer:
          'Yes. The resources page collects QYVORA and popular-tool cheat sheets, linked to their maintained source files.',
        links: [{ label: 'Open resources', to: '/resources' }],
      },
      {
        id: 'changelog',
        question: 'Where can I see what changed in a tool?',
        answer:
          'The tool changelog page tracks releases and notable changes across the QYVORA frameworks, with links to each project’s changelog.',
        links: [{ label: 'Read the changelog', to: '/changelog' }],
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & policies',
    intro: 'Getting help and understanding the rules.',
    items: [
      {
        id: 'contact',
        question: 'How do I contact QYVORA?',
        answer:
          'Use the contact form or email the operations desk. We also run a WhatsApp community channel. The desk aims to reply within 24 hours.',
        links: [{ label: 'Contact QYVORA', to: '/contact' }],
      },
      {
        id: 'book-call',
        question: 'Can I book a call?',
        answer:
          'Yes. Use the request-a-call form on the contact page. Tell us what you want to discuss and a preferred date and time, and the desk will confirm a slot.',
        links: [{ label: 'Request a call', to: '/contact#book-a-call' }],
      },
      {
        id: 'report-vulnerability',
        question: 'How do I report a security vulnerability?',
        answer:
          'Follow the responsible disclosure process on the security page and use the published security contact. Do not test systems without authorization.',
        links: [{ label: 'Security & disclosure', to: '/security' }],
      },
      {
        id: 'privacy',
        question: 'How is my personal data handled?',
        answer:
          'The privacy policy explains what we collect, why we collect it and the rights available to you. The cookie policy explains analytics and preference storage.',
        links: [
          { label: 'Privacy policy', to: '/privacy' },
          { label: 'Cookie policy', to: '/cookies' },
        ],
      },
      {
        id: 'refunds',
        question: 'What is the refund and cancellation policy?',
        answer:
          'Refunds and cancellations are governed by the refund and cancellation policy. It sets out the rules for programme fees and paid services.',
        links: [{ label: 'Refund & cancellation policy', to: '/refund-policy' }],
      },
      {
        id: 'accessibility',
        question: 'What accessibility support is available?',
        answer:
          'The accessibility statement describes the standard we work to and how to request an adjustment or report a barrier.',
        links: [{ label: 'Accessibility statement', to: '/accessibility' }],
      },
    ],
  },
];
