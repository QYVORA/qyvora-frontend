import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { LegalDocument } from '../legalTypes';

const SECURITY_EMAIL = SITE_CONFIG.contact.securityDeskEmail;

export const securityPolicy: LegalDocument = {
  slug: 'security',
  kicker: 'Trust · Security',
  title: 'Security & Responsible Disclosure',
  summary:
    'How to report a security vulnerability to QYVORA, what is in scope, our safe-harbour commitment, and what you can expect from us.',
  effectiveDate: '5 November 2026',
  lastUpdated: 'November 2026',
  jurisdiction: 'Republic of Ghana',
  sections: [
    {
      title: 'Our commitment',
      shortTitle: 'Commitment',
      body: 'QYVORA builds offensive security tools and trains operators, so we hold our own platform to the same standard we ask of others. We welcome good-faith security research and will work with you to validate and fix issues quickly. Please do not test against data, accounts, or systems that are not yours.',
      bullets: [
        'Report suspected vulnerabilities privately. Do not open a public issue, post proof-of-concept details, or disclose the issue before we have had a reasonable chance to fix it.',
        'If you are unsure whether something is in scope, contact us before testing.',
      ],
    },
    {
      title: 'Scope',
      shortTitle: 'Scope',
      body: 'This policy applies to internet-facing QYVORA systems that we own and operate.',
      bullets: [
        'In scope: qyvora.org and its public pages, the QYVORA API, the QYVORA credential registry and verification flow, authentication and account flows, and the public QYVORA tool documentation.',
        'Also in scope: vulnerabilities in QYVORA-owned open-source tools, reported privately to the QYVORA maintainers.',
        'Out of scope: third-party services we integrate with, including GitHub and hosting or payment providers; report those issues to the relevant provider.',
      ],
    },
    {
      title: 'Out-of-scope testing',
      shortTitle: 'Not allowed',
      body: 'The following activities are not authorised under this policy, even if you believe they demonstrate a vulnerability.',
      bullets: [
        'Social engineering, phishing, or pretexting against QYVORA staff, users, or partners.',
        'Physical attacks, access to premises, or theft of devices.',
        'Denial-of-service, stress testing, or any activity that degrades the service for others.',
        'Automated high-volume scanning, brute force, or spam that disrupts the platform.',
        'Accessing, modifying, deleting, or exfiltrating another person\'s data or account.',
        'Testing third-party systems, subdomains not operated by QYVORA, or user-owned content without permission.',
        'Publicly disclosing a vulnerability, or using it for extortion, intimidation, or any unlawful purpose.',
      ],
    },
    {
      title: 'How to report',
      shortTitle: 'Report',
      body: `Send reports to ${SECURITY_EMAIL} with the subject line "Security report". If you need an encrypted channel, say so in a first message without sensitive details and we will arrange one. Do not include live credentials, personal data, or destructive payloads in your report.`,
      bullets: [
        'A clear description of the vulnerability and the affected URL or component.',
        'Reproduction steps, including the minimum request or interaction needed.',
        'The security impact you believe it has, and any conditions required to exploit it.',
        'Screenshots, logs, or a short proof of concept that does not damage data or disrupt service.',
        'Your name or handle and whether you want credit, if you are willing to share them.',
      ],
    },
    {
      title: 'Safe harbour',
      shortTitle: 'Safe harbour',
      body: 'If you make a good-faith effort to follow this policy, we will not initiate legal action against you or report you to law enforcement for the research itself. This commitment does not bind third parties, does not waive any rights, and does not apply to activity that is unlawful, harmful, or outside the scope above.',
      bullets: [
        'Do not access, retain, or share data that does not belong to you beyond what is necessary to demonstrate the issue.',
        'Stop testing and contact us immediately if you encounter personal data, credentials, or anything that suggests an active compromise.',
        'Give us a reasonable opportunity to investigate and fix the issue before any disclosure.',
      ],
    },
    {
      title: 'What you can expect from us',
      shortTitle: 'Our response',
      body: 'We aim to respond promptly and keep you informed. These are targets, not guarantees, and complex issues may take longer.',
      bullets: [
        'Acknowledgement of your report within 3 business days.',
        'An initial assessment and severity triage within 10 business days where the report is complete.',
        'Updates when we have a fix or a material change in status.',
        'Credit on this page or in release notes if you ask for it and the issue is resolved.',
      ],
    },
    {
      title: 'Coordinated disclosure',
      shortTitle: 'Disclosure',
      body: 'We prefer coordinated disclosure. We will work with you on a disclosure date, normally after a fix is available and affected users have had a reasonable time to update. If we cannot agree on a date, we may publish a security advisory that credits the report while protecting users.',
      bullets: [
        'Please do not publish technical details before a coordinated date.',
        'We will not ask you to hide a vulnerability indefinitely; we will agree a realistic timeline with you.',
      ],
    },
    {
      title: 'Recognition',
      shortTitle: 'Recognition',
      body: 'We do not currently run a paid bug-bounty programme. We do recognise responsible reports, with your permission, and we are happy to confirm your contribution in writing for your own records.',
      bullets: [
        'Recognition is at our discretion and does not create a contractual or employment relationship.',
        'We will not use your report or identity for marketing without your consent.',
      ],
    },
    {
      title: 'Contact',
      shortTitle: 'Contact',
      body: `Security reports: ${SECURITY_EMAIL} with the subject "Security report". General privacy questions belong on the Privacy Policy; cookie questions belong on the Cookie Policy.`,
      bullets: [
        'A machine-readable copy of this policy is published at /.well-known/security.txt.',
      ],
    },
  ],
};
