import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { LegalDocument } from '../legalTypes';

const CONTACT_EMAIL = SITE_CONFIG.contact.opsEmail;

export const acceptableUsePolicy: LegalDocument = {
  slug: 'acceptable-use',
  kicker: 'Legal · Community',
  title: 'Acceptable Use & Community Guidelines',
  summary:
    'The standards we expect from everyone using QYVORA\u2019s platform, labs, programmes, and community channels.',
  effectiveDate: '5 November 2026',
  lastUpdated: 'November 2026',
  jurisdiction: 'Republic of Ghana',
  sections: [
    {
      title: 'Scope',
      shortTitle: 'Scope',
      body: 'These guidelines apply to everyone who uses QYVORA services, including the website, student dashboard, labs, simulations, bootcamps, credential verification, community groups, and any channel we operate. They sit alongside our Terms of Service; if there is a conflict, the Terms control.',
      bullets: [
        'By using the services, you agree to follow these guidelines.',
        'Instructors, staff, and community moderators are expected to model the same standards.',
      ],
    },
    {
      title: 'Authorized use only',
      shortTitle: 'Authorization',
      body: 'QYVORA teaches offensive security. That makes authorization non-negotiable.',
      bullets: [
        'Only test systems you own or have explicit, written permission to test.',
        'Lab exercises must be performed only against the in-scope lab environment. Do not point lab tools at real third-party systems, public websites, or other learners.',
        'Do not use skills, tools, or knowledge from QYVORA to gain unauthorized access, cause damage, or commit any offence.',
        'Do not attack QYVORA infrastructure, other learners\u2019 accounts, or the credential registry.',
      ],
    },
    {
      title: 'Respect and privacy',
      shortTitle: 'Respect',
      body: 'The community works only if people can learn without being harassed, exposed, or undermined.',
      bullets: [
        'No harassment, threats, hate speech, discrimination, or targeted abuse.',
        'No doxxing, sharing private information, or publishing someone\u2019s personal data without permission.',
        'No sharing other learners\u2019 work, flags, solutions, or assessment answers in a way that undermines learning or assessment integrity.',
        'No impersonation of QYVORA staff, instructors, moderators, or other learners.',
      ],
    },
    {
      title: 'Prohibited conduct',
      shortTitle: 'Prohibited',
      body: 'The following are not permitted on or through QYVORA services:',
      bullets: [
        'Illegal activity, malware distribution, extortion, fraud, or trafficking in stolen data or access.',
        'Spam, unsolicited advertising, pyramid schemes, or repetitive low-value posting.',
        'Scraping, automated crawling, or bulk data collection without written permission.',
        'Circumventing access controls, paywalls, rate limits, or account restrictions.',
        'Sharing account credentials or allowing multiple people to use one account.',
        'Uploading content that infringes intellectual property, privacy, or other rights.',
        'Interfering with the platform, labs, or other learners\u2019 use, including denial-of-service activity.',
        'Using QYVORA tools or training in a way that violates the law or the rights of others.',
      ],
    },
    {
      title: 'Learning integrity',
      shortTitle: 'Integrity',
      body: 'Certificates and credentials are only meaningful if they reflect real work.',
      bullets: [
        'Do not complete assessments on behalf of another person.',
        'Do not forge, alter, or misrepresent a QYVORA certificate or credential.',
        'Do not share live assessment answers, flags, or solutions while an assessment is active.',
        'Collaboration is welcome where the exercise allows it; follow the instructions for each lab or assignment.',
      ],
    },
    {
      title: 'Confidentiality and responsible disclosure',
      shortTitle: 'Disclosure',
      body: 'If you discover a vulnerability in QYVORA systems, follow our Security and Responsible Disclosure policy. Do not test, exploit, or publish it without following that process.',
      bullets: [
        'Do not access, retain, or share other people\u2019s data beyond what is needed to demonstrate an issue.',
        'Report security issues privately and give us a reasonable opportunity to fix them.',
      ],
    },
    {
      title: 'Enforcement',
      shortTitle: 'Enforcement',
      body: 'We may investigate suspected violations and take action proportionate to the conduct and the risk.',
      bullets: [
        'Possible actions include a warning, content removal, a requirement to stop the conduct, temporary suspension, permanent termination, or removal from a programme without refund where the Terms allow.',
        'Serious conduct may be reported to law enforcement or affected parties.',
        'We may preserve relevant records where necessary for an investigation or legal obligation.',
        'If you believe an action was taken in error, contact us with the subject "Community appeal" and explain why.',
      ],
    },
    {
      title: 'Reporting a concern',
      shortTitle: 'Reporting',
      body: `Report abuse, harassment, or unsafe conduct to ${CONTACT_EMAIL} with the subject "Community report". Include links, screenshots, and any context that helps us investigate. Reports are handled as confidentially as practical.`,
      bullets: [
        'Do not retaliate against someone who reports a concern in good faith.',
        'Knowingly false or malicious reports may themselves be treated as a violation.',
      ],
    },
    {
      title: 'Changes and contact',
      shortTitle: 'Contact',
      body: `We may update these guidelines as the community and platform evolve. The updated version will appear on this page with a revised date. Questions can be sent to ${CONTACT_EMAIL} with the subject "Community guidelines".`,
      bullets: [],
    },
  ],
};
