import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { LegalDocument } from '../legalTypes';

const CONTACT_EMAIL = SITE_CONFIG.contact.opsEmail;

export const accessibilityPolicy: LegalDocument = {
  slug: 'accessibility',
  kicker: 'Trust · Accessibility',
  title: 'Accessibility Statement',
  summary:
    'QYVORA\u2019s commitment to making the platform and learning materials usable by as many people as possible.',
  effectiveDate: '5 November 2026',
  lastUpdated: 'November 2026',
  jurisdiction: 'Republic of Ghana',
  sections: [
    {
      title: 'Our commitment',
      shortTitle: 'Commitment',
      body: 'QYVORA wants its platform, programmes, and public information to be usable by people with different abilities, devices, and connection speeds. We treat accessibility as part of building a serious security platform, not as an afterthought.',
      bullets: [
        'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA for our public pages and core learning flows.',
        'Accessibility work is ongoing. Where we fall short, we want to hear about it so we can fix it.',
      ],
    },
    {
      title: 'What we do',
      shortTitle: 'What we do',
      body: 'Our current practices include the following.',
      bullets: [
        'Semantic HTML, labelled form controls, and logical heading structure.',
        'Keyboard navigation for interactive controls, with visible focus indicators and a skip link to main content.',
        'Colour contrast checks and a design system that does not rely on colour alone to convey meaning.',
        'Support for reduced-motion preferences, with animation reduced or removed where requested.',
        'Responsive layouts that work on small screens and at increased text sizes.',
        'Alternative text for meaningful images and accessible names for icon-only controls.',
        'Captions or transcripts for recorded sessions where they are available; live-session support can be arranged on request.',
      ],
    },
    {
      title: 'Known limitations',
      shortTitle: 'Limitations',
      body: 'We are still improving. Areas that may have limitations include:',
      bullets: [
        'Some older PDFs, slide decks, and downloadable materials may not yet be fully tagged or screen-reader friendly.',
        'Third-party content and embedded services are outside our direct control, though we try to choose accessible providers.',
        'Complex interactive labs and terminal simulations may require additional assistance for some users.',
        'Live sessions may not always have live captions, depending on the platform and the session format.',
      ],
    },
    {
      title: 'Assistance and feedback',
      shortTitle: 'Feedback',
      body: `If you encounter a barrier, need material in another format, or need an accommodation for a programme, contact ${CONTACT_EMAIL} with the subject "Accessibility". Tell us the page or feature, what happened, and the assistive technology or device you were using if you are comfortable sharing it.`,
      bullets: [
        'We aim to acknowledge accessibility reports within 5 business days.',
        'We will work with you on a reasonable alternative or accommodation while we fix the underlying issue.',
        'We welcome feedback even when you are not blocked; it helps us prioritise.',
      ],
    },
    {
      title: 'Compatibility',
      shortTitle: 'Compatibility',
      body: 'The platform is designed for current versions of major browsers on desktop and mobile, and for common screen readers and keyboard-only navigation. Older browsers or unusual configurations may not provide the full experience.',
      bullets: [
        'If you need a specific format, such as a plain-text or large-print version of a policy or programme document, ask us and we will try to provide it.',
      ],
    },
    {
      title: 'Enforcement and review',
      shortTitle: 'Review',
      body: 'We review accessibility as part of product changes and aim to test new public surfaces with keyboard navigation, reduced motion, and mobile layouts before release. This statement will be updated as our practices and known limitations change.',
      bullets: [],
    },
    {
      title: 'Contact',
      shortTitle: 'Contact',
      body: `Accessibility questions and requests: ${CONTACT_EMAIL} with the subject "Accessibility". You can also use the contact page.`,
      bullets: [],
    },
  ],
};
