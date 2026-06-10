export const SITE_CONFIG = {
  brand: {
    name: 'QYVORA',
    description:
      'Building a strong cybersecurity ecosystem in Africa.',
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
      key: 'linkedin',
      label: 'Connect on LinkedIn',
      handle: 'QYVORA',
      desc: 'Company updates and operator wins.',
      href: 'https://www.linkedin.com/company/qyvora/',
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
      handle: 'QYVORA',
      desc: 'Tutorials, walkthroughs, and operator content.',
      href: 'https://www.youtube.com/@QYVORASEC',
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
     platform: [
       { key: 'contact', label: 'Contact', path: '/contact', desc: 'Get in touch' },
     ],
     company: [{ key: 'contact', label: 'Contact', path: '/contact', desc: 'Open secure contact modal' }],
   },
   
  footer: {
    links: [
      { label: 'Terms of Service', path: '/terms' },
    ],
  },
} as const;
