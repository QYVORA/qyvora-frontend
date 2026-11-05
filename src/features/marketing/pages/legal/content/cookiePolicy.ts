import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { LegalDocument } from '../legalTypes';

const CONTACT_EMAIL = SITE_CONFIG.contact.opsEmail;

export const cookiePolicy: LegalDocument = {
  slug: 'cookies',
  kicker: 'Legal · Cookies',
  title: 'Cookie Policy',
  summary:
    'The cookies and browser storage QYVORA uses, why we use them, and how you can change your choices at any time.',
  effectiveDate: '5 November 2026',
  lastUpdated: 'November 2026',
  jurisdiction: 'Republic of Ghana',
  sections: [
    {
      title: 'Scope',
      shortTitle: 'Scope',
      body: 'This policy explains how QYVORA uses cookies and similar browser storage (including localStorage and sessionStorage) on qyvora.org and the QYVORA platform. It should be read with our Privacy Policy, which explains how we handle personal data more broadly.',
      bullets: [
        'Cookies are small text files stored by your browser. Browser storage works in a similar way but can hold more data and is not sent with every request.',
        'Some storage is essential for the platform to work. Other categories are optional and can be turned off.',
      ],
    },
    {
      title: 'Strictly necessary',
      shortTitle: 'Necessary',
      body: 'These are required to keep you signed in, protect your session, and remember your privacy choices. They cannot be switched off through our banner because the platform cannot work without them.',
      bullets: [
        'Authentication: an HTTP-only refresh-token cookie set by the API, plus the `qyvora_auth_session_hint` local-storage flag used to restore your session state.',
        'Security: the `qyvora_csrf_token` value used for cross-site request forgery protection, and server-side security and rate-limit records.',
        'Consent: `qyvora_cookie_preferences` stores your category choices and `qyvora_consent_dismissed` records that the banner was dismissed.',
        'These items may be set even before you interact with the consent banner because they are required to deliver the service you requested.',
      ],
    },
    {
      title: 'Functional',
      shortTitle: 'Functional',
      body: 'These remember choices that make the platform easier to use. They are optional, but turning them off may reset preferences or lose local progress.',
      bullets: [
        'Appearance and layout: `qyvora_theme` (light or dark mode), `qyvora:docs-rail-collapsed`, and `qyvora:admin-sidebar-collapsed`.',
        'Product preferences: `qyvora_install_dismissed` (PWA install prompt) and `qyvora_tour_acknowledged` (onboarding tour).',
        'Learning progress stored in your browser: `qyvora_course_progress_*`, `qyvora_lab_progress`, bootcamp "viewed steps" markers, simulated-terminal state, and card-deck progress. Account-linked progress is stored on our servers instead.',
      ],
    },
    {
      title: 'Analytics and performance',
      shortTitle: 'Analytics',
      body: 'These help us understand whether pages load correctly and improve performance. They are only used when you allow the analytics category.',
      bullets: [
        '`qyvora_landing_cache_v3` caches public landing-page content in your browser to speed up repeat visits.',
        'Aggregated performance diagnostics such as load timing and error rates. We do not use third-party advertising or cross-site tracking cookies.',
      ],
    },
    {
      title: 'How long items last',
      shortTitle: 'Duration',
      body: 'Session items last until you close your browser or sign out. Persistent items stay until they expire or you clear them. The refresh-token cookie is rotated when your session is refreshed and is cleared on sign-out.',
      bullets: [
        'Preference and consent items remain until you clear browser storage or change your choices.',
        'Performance cache entries are versioned and replaced when the site is updated or the cache expires.',
      ],
    },
    {
      title: 'Managing your preferences',
      shortTitle: 'Manage',
      body: 'You can change your choices at any time using the "Manage cookie preferences" button on this page, or the "Customize" option in the consent banner. You can also clear cookies and site data from your browser settings.',
      bullets: [
        'Blocking strictly necessary items will prevent sign-in and may break security protections.',
        'Clearing browser storage removes local preferences and any progress that is only stored in your browser.',
        'Your choices are stored on this device. If you use another browser or device, you will need to set them again.',
      ],
    },
    {
      title: 'Third-party services',
      shortTitle: 'Third parties',
      body: 'Some features rely on third-party services that may set their own cookies when you interact with them, such as GitHub when you choose to sign in with GitHub. We do not control those cookies; their providers\' policies apply.',
      bullets: [
        'We do not allow third-party advertising networks to set tracking cookies on our pages.',
      ],
    },
    {
      title: 'Do Not Track and Global Privacy Control',
      shortTitle: 'DNT / GPC',
      body: 'Browsers may send "Do Not Track" or Global Privacy Control signals. Because we already gate optional analytics behind your consent and do not run advertising trackers, we treat those signals as consistent with the choices you make in our banner.',
      bullets: [],
    },
    {
      title: 'Changes and contact',
      shortTitle: 'Contact',
      body: `We may update this policy when our use of cookies changes. The updated version will appear on this page with a revised date. Questions can be sent to ${CONTACT_EMAIL} with the subject "Cookie question".`,
      bullets: [],
    },
  ],
};
