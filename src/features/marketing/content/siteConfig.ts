export const SITE_CONFIG = {
  brand: {
    name: 'QYVORA',
    description:
      'Building a strong cybersecurity ecosystem in Africa.',
    siteUrl: 'https://qyvora.netlify.app',
  },
  contact: {
    opsEmail: 'ops@qyvora.netlify.app',
    securityDeskEmail: 'ops@qyvora.netlify.app',
    whatsappUrl: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5',
    whatsappLabel: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5',
    headquarters: 'Remote',
    responseTime: 'within 24 hours',
  },
  contactPage: {
    heroTag: '// TRANSMISSION',
    heroTitle: 'Contact the Desk',
    heroSubtitle: 'Establishing a secure channel for inquiries, partnerships, and operational support.',
    emailHeading: 'Email Intelligence',
    emailDescription: 'Direct secure channel to our operations desk.',
    whatsappHeading: 'Website',
    whatsappDescription: 'Primary public platform URL.',
    hqHeading: 'Operations',
    hqDescriptionSuffix: 'Netlify-hosted infrastructure.',
    formTitle: 'Secure Message Form',
    sentTitle: 'Transmission Received',
    sentButtonLabel: 'Send Another',
    selectSubjectPlaceholder: 'Select Mission Type',
    errorPrefix: 'Transmission failed. Try emailing us directly at',
    submitLabel: 'Send Transmission',
    sendingLabel: 'Sending...',
    labels: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
    },
    placeholders: {
      name: 'Alhassan Boateng',
      email: 'operations@yourcompany.africa',
      message: 'Encrypted transmission here...',
    },
  },
  social: [
    {
      key: 'x',
      label: 'Follow on X',
      handle: '@qyvorasec',
      desc: 'Real-time ops, advisories, and updates.',
      href: 'https://x.com/qyvorasec',
      action: 'Follow',
    },
    {
      key: 'linkedin',
      label: 'Connect on LinkedIn',
      handle: 'QYVORA',
      desc: 'Company updates and operator wins.',
      href: 'https://linkedin.com/company/qyvora',
      action: 'Connect',
    },
    {
      key: 'github',
      label: 'View on GitHub',
      handle: 'QYVORA',
      desc: 'Open source tools, platform code, and public engineering updates.',
      href: 'https://github.com/QYVORA',
      action: 'View',
    },
    {
      key: 'youtube',
      label: 'Watch on YouTube',
      handle: '@QYVORA',
      desc: 'Tutorials, walkthroughs, and operator content.',
      href: 'https://www.youtube.com/@QYVORA',
      action: 'Subscribe',
    },
    {
      key: 'whatsapp',
      label: 'Join on WhatsApp',
      handle: 'QYVORA Community',
      desc: 'Live sessions, announcements, and operator comms.',
      href: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5',
      action: 'Join',
    },
  ],
  nav: {
    groups: [
      {
        key: 'learn',
        label: 'Learn',
        items: [
          { key: 'hpb', label: 'HPB', path: '/hpb', desc: 'Hacker Protocol Bootcamp' },
          { key: 'services', label: 'Services', path: '/services', desc: 'Pentesting services' },
        ],
      },
      {
        key: 'research',
        label: 'Research',
        items: [
          { key: 'anansi', label: 'Anansi', path: '/anansi', desc: 'Attack Surface Intelligence' },
          { key: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', desc: 'Top operators ranking' },
        ],
      },
    ],
    platform: [
      { key: 'hpb', label: 'HPB', path: '/hpb', desc: 'Hacker Protocol Bootcamp' },
      { key: 'anansi', label: 'Anansi', path: '/anansi', desc: 'Attack Surface Intelligence' },
      { key: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', desc: 'Top operators ranking' },
      { key: 'services', label: 'Services', path: '/services', desc: 'Pentesting services' },
    ],
    company: [
      { key: 'hpb', label: 'HPB', path: '/hpb', desc: 'Bootcamp phases' },
      { key: 'anansi', label: 'Anansi', path: '/anansi', desc: 'Attack Surface Intelligence' },
      { key: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', desc: 'Top operators ranking' },
      { key: 'contact', label: 'Contact', path: '/contact', desc: 'Open secure contact modal', modal: true }
    ],
  },
  
  footer: {
    links: [
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Courses', path: '/courses' },
      { label: 'Anansi', path: '/anansi' },
      { label: 'Learn', path: '/hpb' },
      { label: 'Leaderboard', path: '/leaderboard' },
      { label: 'Services', path: '/services' }
    ],
  },
} as const;
