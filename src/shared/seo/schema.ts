import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import type { ServiceConfig } from '@/features/marketing/content/servicesConfig';

/**
 * Centralized JSON-LD structured data builders for QYVORA.
 *
 * Every builder is a pure function — no DOM access, no side effects — so the
 * output is safe to serialize both at build time (prerender) and at runtime.
 * SITE_CONFIG is the single source of truth for brand, URL, and social profiles.
 */

export const SITE_URL = SITE_CONFIG.brand.siteUrl;

export const SITE_NAME = SITE_CONFIG.brand.name;

/** Public QYVORA properties. WhatsApp is a community invite link, not a profile — excluded from sameAs. */
const REAL_SOCIAL_PROFILES = new Set(['x', 'linkedin', 'github', 'youtube', 'medium', 'tiktok']);

export const toAbsoluteUrl = (pathOrUrl: string): string =>
  pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;

export interface BreadcrumbEntry {
  name: string;
  item: string;
}

function organizationNode() {
  return {
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.webp`,
    description: SITE_CONFIG.brand.description,
    email: SITE_CONFIG.contact.opsEmail,
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.contact.opsEmail,
      contactType: 'customer support',
    },
    sameAs: SITE_CONFIG.social
      .filter((s) => REAL_SOCIAL_PROFILES.has(s.key))
      .map((s) => s.href),
  };
}

export function buildOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...organizationNode(),
  };
}

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_CONFIG.brand.description,
  };
}

export function buildBreadcrumbList(breadcrumbs: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: toAbsoluteUrl(crumb.item),
    })),
  };
}

/**
 * Known navigable route prefixes and their human-readable labels.
 * Used to derive BreadcrumbList trails automatically from the current pathname.
 */
const ROUTE_LABELS: ReadonlyArray<readonly [string, string]> = [
  ['/services/basic-web-application-pentest', 'Basic Web Application Pentest'],
  ['/services/standard-web-application-pentest', 'Standard Web Application Pentest'],
  ['/services/employee-cybersecurity-bootcamp', 'Employee Cybersecurity Bootcamp'],
  ['/services', 'Services'],
  ['/hpb', 'Hacker Protocol Bootcamp'],
  ['/courses', 'Courses'],
  ['/labs', 'Labs'],
  ['/blogs', 'Blogs'],
  ['/anansi', 'anansi'],
  ['/toha3ee', 'toha3ee'],
  ['/shaka', 'shaka'],
  ['/nzinga', 'nzinga'],
  ['/jabari', 'jabari'],
  ['/aksum', 'aksum'],
  ['/quiteroot', 'QuiteRoot'],
  ['/leaderboard', 'Leaderboard'],
  ['/zero-day-market', 'Zero Day Market'],
  ['/team', 'Team'],
  ['/terms', 'Terms of Service'],
];

/**
 * Derives a breadcrumb trail from the current pathname.
 * Returns null for the home page and for routes without a known parent.
 * Leaf segments (blog slugs, HPB phases, profiles) use `leafLabel` when provided.
 */
export function buildAutoBreadcrumbs(
  pathname: string,
  leafLabel?: string
): BreadcrumbEntry[] | null {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') return null;

  const match = [...ROUTE_LABELS]
    .sort((a, b) => b[0].length - a[0].length)
    .find(([route]) => normalized === route || normalized.startsWith(`${route}/`));
  if (!match) return null;

  const [route, label] = match;
  const crumbs: BreadcrumbEntry[] = [{ name: 'Home', item: '/' }];

  // Emit every known ancestor segment of the matched route.
  let prefix = '';
  for (const segment of route.split('/').filter(Boolean)) {
    prefix += `/${segment}`;
    const known = ROUTE_LABELS.find(([r]) => r === prefix);
    crumbs.push({ name: known ? known[1] : segment, item: prefix });
  }

  const leafName = leafLabel ?? label;
  if (normalized === route) {
    crumbs[crumbs.length - 1] = { name: leafName, item: route };
  } else {
    crumbs.push({ name: leafName, item: normalized });
  }
  return crumbs;
}

export interface BlogPostingMeta {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: { name: string; handle: string };
  date: string;
  readTime: string;
  tags: string[];
}

export function buildBlogPosting(post: BlogPostingMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [toAbsoluteUrl(post.image)],
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.tags[0],
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': toAbsoluteUrl(`/blogs/${post.slug}`),
    },
    author: {
      '@type': 'Person',
      name: post.author.name,
      alternateName: post.author.handle,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.webp`,
      },
    },
  };
}

const SERVICE_TYPE_BY_ID: Record<string, string> = {
  basic: 'Penetration Testing',
  standard: 'Penetration Testing',
  bootcamp: 'Security Training',
};

export function buildService(svc: ServiceConfig) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.title,
    serviceType: SERVICE_TYPE_BY_ID[svc.id] ?? 'Cybersecurity Service',
    category: 'Cybersecurity',
    description: svc.overview,
    url: toAbsoluteUrl(svc.path),
    provider: {
      '@type': 'Organization',
      ...organizationNode(),
    },
    areaServed: 'Africa',
  };

  const range = svc.price.match(/^\$([\d,]+)\s*-\s*\$([\d,]+)\s*USD$/);
  if (range) {
    schema.offers = {
      '@type': 'AggregateOffer',
      lowPrice: range[1].replace(/,/g, ''),
      highPrice: range[2].replace(/,/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    };
  }
  return schema;
}
