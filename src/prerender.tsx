import type { PrerenderArguments, PrerenderResult } from 'vite-prerender-plugin';

const SITE_URL = 'https://qyvora.netlify.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'QYVORA | Africa\'s Offensive Security Platform',
    description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training, penetration testing, and advanced intelligence tools.',
  },
  '/hpb': {
    title: 'Hacker Protocol Bootcamp | QYVORA',
    description: 'Learn offensive security techniques with the Hacker Protocol Bootcamp - comprehensive training for cybersecurity professionals.',
  },
  '/services': {
    title: 'Services | QYVORA',
    description: 'Professional penetration testing, security auditing, and cybersecurity consulting services.',
  },
  '/services/basic-web-application-pentest': {
    title: 'Basic Web Application Penetration Testing | QYVORA',
    description: 'A focused assessment of your application\u2019s most critical pages \u2014 fast, thorough, and built around the OWASP Top 10.',
  },
  '/services/standard-web-application-pentest': {
    title: 'Standard Web Application Penetration Testing | QYVORA',
    description: 'A deep, full-application assessment covering authentication, authorization, business logic, and everything in between.',
  },
  '/services/employee-cybersecurity-bootcamp': {
    title: 'Employee Cybersecurity Bootcamp | QYVORA',
    description: 'Build a security-aware workforce with hands-on training your employees will actually retain.',
  },
  '/hpb/phase1': {
    title: 'Hacker Mindset - Hacker Protocol Bootcamp | QYVORA',
    description: 'Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
  },
  '/hpb/phase2': {
    title: 'Linux Foundations - Hacker Protocol Bootcamp | QYVORA',
    description: 'Master navigation, user privilege escalation, file permissions, and directory structures on the Linux terminal.',
  },
  '/hpb/phase3': {
    title: 'Networking - Hacker Protocol Bootcamp | QYVORA',
    description: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
  },
  '/hpb/phase4': {
    title: 'Web & Backend Systems - Hacker Protocol Bootcamp | QYVORA',
    description: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
  },
  '/hpb/phase5': {
    title: 'Social Engineering - Hacker Protocol Bootcamp | QYVORA',
    description: 'Learn the human element of security through persuasion, pretexting, and awareness-building techniques.',
  },
  '/blogs': {
    title: 'Blog | QYVORA',
    description: 'Latest insights on cybersecurity, ethical hacking, and offensive security in Africa.',
  },
  '/labs': {
    title: 'Labs | QYVORA',
    description: 'Hands-on penetration testing labs and offensive security challenges.',
  },
  '/courses': {
    title: 'Courses | QYVORA',
    description: 'Cybersecurity courses and training programs for aspiring security professionals.',
  },
  '/zero-day-market': {
    title: 'Zero Day Market | QYVORA',
    description: 'Vulnerability marketplace for responsible disclosure and bug bounty programs.',
  },
  '/quiteroot': {
    title: 'QuiteRoot | QYVORA',
    description: 'Advanced security tools and utilities for penetration testers.',
  },
  '/anansi': {
    title: 'Anansi CLI | QYVORA',
    description: 'Command-line interface for security reconnaissance and automation.',
  },
  '/team': {
    title: 'Team | QYVORA',
    description: 'Meet the team behind QYVORA - cybersecurity experts building Africa\'s security ecosystem.',
  },
  '/leaderboard': {
    title: 'Leaderboard | QYVORA',
    description: 'Top cybersecurity talent and contributors in the QYVORA community.',
  },
  '/terms': {
    title: 'Terms of Service | QYVORA',
    description: 'QYVORA terms of service and usage policies.',
  },
  '/blogs/hpb-2026-cohort-case-study': {
    title: 'HPB 2026 Cohort Case Study | QYVORA Blog',
    description: 'Case study of the Hacker Protocol Bootcamp 2026 cohort achievements.',
  },
  '/blogs/hacker-protocol-bootcamp': {
    title: 'Hacker Protocol Bootcamp | QYVORA Blog',
    description: 'Introduction to the Hacker Protocol Bootcamp - offensive security training.',
  },
  '/blogs/anansi-cli': {
    title: 'Anansi CLI | QYVORA Blog',
    description: 'Guide to using the Anansi CLI for security reconnaissance.',
  },
  '/blogs/africa-cybersecurity-ecosystem': {
    title: 'Africa\'s Cybersecurity Ecosystem | QYVORA Blog',
    description: 'Overview of the growing cybersecurity ecosystem in Africa.',
  },
  '/blogs/attackers-discover-companies': {
    title: 'How Attackers Discover Companies | QYVORA Blog',
    description: 'Understanding how attackers identify and target organizations.',
  },
  '/blogs/africa-needs-cybersecurity-professionals': {
    title: 'Africa Needs Cybersecurity Professionals | QYVORA Blog',
    description: 'Why Africa urgently needs more cybersecurity professionals.',
  },
  '/blogs/mapping-attack-surfaces': {
    title: 'Mapping Attack Surfaces | QYVORA Blog',
    description: 'Techniques for identifying and mapping organizational attack surfaces.',
  },
  '/blogs/future-cybersecurity-africa': {
    title: 'The Future of Cybersecurity in Africa | QYVORA Blog',
    description: 'Predictions and trends for cybersecurity across the African continent.',
  },
};

export async function prerender(data: PrerenderArguments): Promise<PrerenderResult> {
  const { url } = data;

  const meta = routeMetadata[url] || {
    title: 'QYVORA | Africa\'s Offensive Security Platform',
    description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training.',
  };

  const canonical = `${SITE_URL}${url}`;

  const html = `
    <div data-prerender="true">
      <noscript>
        <h1>${meta.title}</h1>
        <p>${meta.description}</p>
        <p>Please enable JavaScript to use this application.</p>
      </noscript>
    </div>
  `;

  return {
    html,
    head: {
      lang: 'en',
      title: meta.title,
      elements: new Set([
        { type: 'meta', props: { name: 'description', content: meta.description } },
        { type: 'meta', props: { name: 'robots', content: 'index, follow, max-image-preview:large' } },
        { type: 'link', props: { rel: 'canonical', href: canonical } },
        { type: 'meta', props: { property: 'og:type', content: 'website' } },
        { type: 'meta', props: { property: 'og:title', content: meta.title } },
        { type: 'meta', props: { property: 'og:description', content: meta.description } },
        { type: 'meta', props: { property: 'og:url', content: canonical } },
        { type: 'meta', props: { property: 'og:image', content: DEFAULT_OG_IMAGE } },
        { type: 'meta', props: { property: 'og:image:type', content: 'image/png' } },
        { type: 'meta', props: { property: 'og:image:width', content: '1200' } },
        { type: 'meta', props: { property: 'og:image:height', content: '630' } },
        { type: 'meta', props: { property: 'og:image:alt', content: meta.title } },
        { type: 'meta', props: { property: 'og:site_name', content: 'QYVORA' } },
        { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
        { type: 'meta', props: { name: 'twitter:site', content: '@qyvorasec' } },
        { type: 'meta', props: { name: 'twitter:title', content: meta.title } },
        { type: 'meta', props: { name: 'twitter:description', content: meta.description } },
        { type: 'meta', props: { name: 'twitter:image', content: DEFAULT_OG_IMAGE } },
        {
          type: 'script',
          props: {
            type: 'application/ld+json',
          },
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: meta.title,
            description: meta.description,
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
