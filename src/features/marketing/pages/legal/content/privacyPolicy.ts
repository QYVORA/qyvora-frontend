import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { LegalDocument } from '../legalTypes';

const CONTACT_EMAIL = SITE_CONFIG.contact.opsEmail;

export const privacyPolicy: LegalDocument = {
  slug: 'privacy',
  kicker: 'Legal · Privacy',
  title: 'Privacy Policy',
  summary:
    'How QYVORA collects, uses, shares, and protects personal data across the platform, training programmes, and professional services.',
  effectiveDate: '5 November 2026',
  lastUpdated: 'November 2026',
  jurisdiction: 'Republic of Ghana',
  sections: [
    {
      title: 'Who we are',
      shortTitle: 'Who we are',
      body: `QYVORA OFFSEC ("QYVORA", "we", "us", or "our") is an offensive security company based in Tamale, Ghana. We operate qyvora.org, the QYVORA platform, the QYVORA credential registry, our open-source tools, and our training and professional-service engagements. This policy explains how we handle personal data when you use those services.`,
      bullets: [
        `Privacy contact: ${CONTACT_EMAIL} (use the subject line "Privacy request").`,
        'This policy does not cover third-party websites or services that we link to; their own privacy policies apply.',
      ],
    },
    {
      title: 'Data we collect',
      shortTitle: 'Data we collect',
      body: 'We collect only the data needed to run the platform, deliver training, issue and verify credentials, provide services, and keep the service secure.',
      bullets: [
        'Account data: name, email address, username or handle, avatar, and profile details you provide; GitHub account identifiers and profile data when you sign in with GitHub.',
        'Authentication and security data: password hash, session and refresh tokens, CSRF tokens, IP address, user agent, timestamps, rate-limit counters, and security-event logs.',
        'Learning data: lab, simulation, and bootcamp progress; answers, submissions, and results; CyberPoints and leaderboard activity; certificates and credentials.',
        'Programme and payment data: registration details and payment-confirmation references for paid programmes. Card and mobile-money details are processed by the payment provider you use; we do not store full card numbers.',
        'Credential data: the credential identifier, programme, issue and expiry dates, and revocation status needed to issue and verify credentials.',
        'Communications: messages you send through the contact form, email, WhatsApp, or support channels.',
        'Usage and device data: pages viewed, features used, approximate location derived from IP, browser and device type, and performance diagnostics.',
      ],
    },
    {
      title: 'How we use personal data',
      shortTitle: 'How we use it',
      body: 'We use personal data for the purposes below and only where we have a lawful basis to do so.',
      bullets: [
        'To create and secure your account, authenticate you, and prevent fraud, abuse, and unauthorised access.',
        'To deliver labs, simulations, bootcamps, certificates, credentials, and community features.',
        'To process registrations, confirm payments, and administer paid programmes and professional engagements.',
        'To issue, publish, and verify credentials, including displaying the credential information you choose to make public.',
        'To respond to enquiries, provide support, and send operational notices such as security alerts or programme updates.',
        'To maintain, troubleshoot, and improve the platform, including aggregated and anonymised analytics.',
        'To comply with legal obligations, enforce our Terms, and protect the rights, safety, and property of QYVORA, our users, and the public.',
      ],
    },
    {
      title: 'Lawful bases',
      shortTitle: 'Lawful bases',
      body: 'Where the Ghana Data Protection Act 2012 (Act 843) or other applicable law requires a lawful basis, we rely on the following:',
      bullets: [
        'Performance of a contract: providing the platform, programmes, and services you request.',
        'Legitimate interests: securing the platform, preventing abuse, improving our services, and communicating with you, balanced against your rights.',
        'Consent: optional analytics, marketing communications, and any other processing for which we ask your permission. You can withdraw consent at any time.',
        'Legal obligation: keeping records, responding to lawful requests, and meeting tax, accounting, and security requirements.',
      ],
    },
    {
      title: 'Cookies and similar technologies',
      shortTitle: 'Cookies',
      body: 'We use cookies and browser storage for authentication, security, preferences, and consent-gated performance measurement. Our Cookie Policy lists the categories and examples, and explains how to change your choices.',
      bullets: [
        'You can accept all cookies, customise categories, or manage preferences at any time from the Cookie Policy page.',
        'We do not use third-party advertising trackers.',
      ],
    },
    {
      title: 'Sharing personal data',
      shortTitle: 'Sharing',
      body: 'We do not sell personal data. We share it only with providers and parties that help us operate the services, or where the law requires it.',
      bullets: [
        'Infrastructure and service providers: hosting, database, email delivery, authentication, error monitoring, and payment processing, each under contractual confidentiality and security obligations.',
        'Professional advisers: lawyers, auditors, and insurers where necessary.',
        'Authorities and legal processes: where required by law, or to protect rights, safety, and security.',
        'Business transfers: in connection with a merger, acquisition, restructuring, or sale of assets, subject to this policy.',
        'With your direction or consent: for example, when you choose to make credential or profile information public.',
      ],
    },
    {
      title: 'International transfers',
      shortTitle: 'Transfers',
      body: 'Some providers may process personal data outside Ghana. Where we transfer data internationally, we use appropriate safeguards required by applicable law, such as contractual protections and provider security commitments.',
      bullets: [],
    },
    {
      title: 'Retention',
      shortTitle: 'Retention',
      body: 'We keep personal data for as long as needed for the purposes described in this policy, including while your account is active, to provide services, to maintain security and audit logs, to resolve disputes, and to meet legal, tax, and accounting obligations. When data is no longer needed, we delete or anonymise it.',
      bullets: [
        'Credentials and public verification records may be retained after an account closes so third parties can verify their authenticity and revocation status.',
        'Security and audit logs are retained for a limited period appropriate to security and legal needs.',
      ],
    },
    {
      title: 'Security',
      shortTitle: 'Security',
      body: 'We use technical and organisational measures designed to protect personal data, including encrypted transport, hashed passwords, HTTP-only refresh tokens, CSRF protection, access controls, rate limiting, security logging, and least-privilege access. No system is completely secure; if you believe your account or data has been compromised, contact us immediately.',
      bullets: [
        'See our Security and Responsible Disclosure page for how to report a vulnerability.',
      ],
    },
    {
      title: 'Your rights',
      shortTitle: 'Your rights',
      body: `Subject to applicable law, you may have the right to access, correct, delete, restrict, or object to our processing of your personal data, to receive a portable copy, and to withdraw consent. To exercise a right, email ${CONTACT_EMAIL} with the subject "Privacy request". We may need to verify your identity before acting.`,
      bullets: [
        'You can update most account information directly from your dashboard settings.',
        'You can opt out of non-essential communications using the unsubscribe link or by contacting us.',
        'You can change cookie preferences at any time from the Cookie Policy page.',
        'If you are in Ghana, you may also complain to the Data Protection Commission of Ghana. If you are elsewhere, you may contact your local data-protection authority.',
      ],
    },
    {
      title: 'Children',
      shortTitle: 'Children',
      body: 'The platform and programmes are intended for people aged 18 or older, or the age of legal majority in their jurisdiction, whichever is greater. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us and we will delete it.',
      bullets: [],
    },
    {
      title: 'Changes to this policy',
      shortTitle: 'Changes',
      body: 'We may update this policy to reflect changes to our services, technology, or legal requirements. We will post the updated policy on this page and revise the "last updated" date. Where changes are material, we will provide additional notice as required by law.',
      bullets: [],
    },
    {
      title: 'Contact us',
      shortTitle: 'Contact',
      body: `Questions, requests, or concerns about this policy or our handling of personal data can be sent to ${CONTACT_EMAIL} with the subject "Privacy request". You can also reach us through the contact page.`,
      bullets: [],
    },
  ],
};
