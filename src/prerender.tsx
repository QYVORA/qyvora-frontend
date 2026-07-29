import type { PrerenderArguments, PrerenderResult } from 'vite-prerender-plugin';

const SITE_URL = 'https://qyvora.netlify.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'QYVORA | Africa\'s Offensive Security Platform',
    description: 'Building a strong cybersecurity ecosystem in Africa through offensive security training, penetration testing, and advanced intelligence tools.',
  },
  '/hpb': {
    title: 'Hacker Protocol Book | QYVORA',
    description: 'Learn offensive security techniques with the Hacker Protocol Book - comprehensive training for cybersecurity professionals.',
  },
  '/services': {
    title: 'Services | QYVORA',
    description: 'Professional penetration testing, security auditing, and cybersecurity consulting services.',
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
    description: 'Case study of the Hacker Protocol Book 2026 cohort achievements.',
  },
  '/blogs/hacker-protocol-book': {
    title: 'Hacker Protocol Book | QYVORA Blog',
    description: 'Introduction to the Hacker Protocol Book - offensive security training.',
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
            innerHTML: JSON.stringify({
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
        },
      ]),
    },
  };
}
