import { describe, it, expect } from 'vitest';
import type { ServiceConfig } from '@/features/marketing/content/servicesConfig';
import {
  buildAutoBreadcrumbs,
  buildBlogPosting,
  buildCourse,
  buildOrganization,
  buildService,
  SITE_URL,
} from '../schema';
import type { Course } from '@/features/student/data/courses';

describe('buildAutoBreadcrumbs', () => {
  it('returns null for the home page', () => {
    expect(buildAutoBreadcrumbs('/')).toBeNull();
    expect(buildAutoBreadcrumbs('')).toBeNull();
  });

  it('builds a trail for top-level routes', () => {
    expect(buildAutoBreadcrumbs('/blogs')).toEqual([
      { name: 'Home', item: '/' },
      { name: 'Blogs', item: '/blogs' },
    ]);
    expect(buildAutoBreadcrumbs('/learn')).toEqual([
      { name: 'Home', item: '/' },
      { name: 'Learn', item: '/learn' },
    ]);
    expect(buildAutoBreadcrumbs('/hpb')).toEqual([
      { name: 'Home', item: '/' },
      { name: 'Hacker Protocol Bootcamp', item: '/hpb' },
    ]);
  });

  it('uses the leaf label for child routes', () => {
    expect(buildAutoBreadcrumbs('/blogs/anansi-cli', 'Anansi CLI: Attack Surface Intelligence')).toEqual([
      { name: 'Home', item: '/' },
      { name: 'Blogs', item: '/blogs' },
      { name: 'Anansi CLI: Attack Surface Intelligence', item: '/blogs/anansi-cli' },
    ]);
    expect(buildAutoBreadcrumbs('/simulations/terminal', 'Browser Terminal')).toEqual([
      { name: 'Home', item: '/' },
      { name: 'Simulations', item: '/simulations' },
      { name: 'Browser Terminal', item: '/simulations/terminal' },
    ]);
  });

  it('builds nested trails for service detail pages', () => {
    expect(buildAutoBreadcrumbs('/services/standard-web-application-pentest', 'Standard Web Application Penetration Testing')).toEqual([
      { name: 'Home', item: '/' },
      { name: 'Services', item: '/services' },
      { name: 'Standard Web Application Penetration Testing', item: '/services/standard-web-application-pentest' },
    ]);
  });

  it('returns null for unknown routes', () => {
    expect(buildAutoBreadcrumbs('/does-not-exist')).toBeNull();
    expect(buildAutoBreadcrumbs('/dashboard')).toBeNull();
  });
});

describe('buildOrganization', () => {
  it('excludes non-profile social links from sameAs', () => {
    const schema = buildOrganization();
    expect(schema['@type']).toBe('Organization');
    expect(schema.sameAs).toContain('https://x.com/qyvorasec');
    expect(schema.sameAs).toContain('https://github.com/QYVORA');
    expect(schema.sameAs).toContain('https://www.tiktok.com/@qyvorasecurity');
    expect(schema.sameAs.some((url: string) => url.includes('whatsapp'))).toBe(false);
  });
});

describe('buildBlogPosting', () => {
  const post = {
    slug: 'anansi-cli',
    title: 'Anansi CLI',
    excerpt: 'A recon engine for operators.',
    image: '/assets/blog-anansi.webp',
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-20',
    readTime: '8 min read',
    tags: ['Tooling', 'Recon'],
  };

  it('emits a valid BlogPosting with absolute URLs', () => {
    const schema = buildBlogPosting(post);
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.image).toEqual([`${SITE_URL}/assets/blog-anansi.webp`]);
    expect(schema.mainEntityOfPage['@id']).toBe(`${SITE_URL}/blogs/anansi-cli`);
    expect(schema.author).toEqual({ '@type': 'Person', name: 'WSUITS6', alternateName: 'Alhassan Osman Wunpini' });
    expect(schema.keywords).toBe('Tooling, Recon');
    expect(schema.datePublished).toBe('2026-06-20');
  });
});

describe('buildService', () => {
  const svc = {
    id: 'standard',
    key: 'standard',
    path: '/services/standard-web-application-pentest',
    title: 'Standard Web Application Penetration Testing',
    accentWord: 'Testing',
    badge: 'Comprehensive',
    icon: null as unknown as ServiceConfig['icon'],
    overview: 'A deep, full-application assessment.',
    price: '$600 - $1,000 USD',
    priceLocal: 'GH₵8,000 - GH₵14,000',
    scope: 'Full application.',
    included: [],
    benefits: [],
    deliverables: [],
    featured: true,
  } as ServiceConfig;

  it('parses a USD price range into an AggregateOffer', () => {
    const schema = buildService(svc);
    expect(schema['@type']).toBe('Service');
    expect(schema.serviceType).toBe('Penetration Testing');
    expect(schema.offers).toEqual({
      '@type': 'AggregateOffer',
      lowPrice: '600',
      highPrice: '1000',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    });
  });

  it('omits offers for custom-quotation services', () => {
    const schema = buildService({ ...svc, price: 'Custom quotation', id: 'bootcamp', badge: 'Training' });
    expect(schema.offers).toBeUndefined();
    expect(schema.serviceType).toBe('Security Training');
  });
});

describe('buildCourse', () => {
  const course = {
    id: 'linux-terminal-101',
    title: 'Linux Terminal 101',
    categoryId: 'terminal',
    description: 'Learn to navigate, control, and exploit the Linux command line.',
    overview: 'The terminal is the hacker’s cockpit.',
    estimatedMinutes: 70,
    cpCost: 75,
    lessons: [{ id: 'lt-1', title: 'What is the Terminal?', instruction: '', image: null }],
    learningObjectives: ['Navigate the Linux filesystem', 'Use pipes and redirects'],
    skillLevel: 'beginner',
    prerequisites: ['networking-101'],
    popular: true,
  } as Course;

  it('emits a Course schema with absolute URL and provider', () => {
    const schema = buildCourse(course);
    expect(schema['@type']).toBe('Course');
    expect(schema.url).toBe(`${SITE_URL}/courses/linux-terminal-101`);
    expect(schema.name).toBe('Linux Terminal 101');
    expect(schema.description).toBe('Learn to navigate, control, and exploit the Linux command line.');
    expect(schema.provider['@type']).toBe('Organization');
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it('derives timeRequired and numberOfLessons from the record', () => {
    const schema = buildCourse(course);
    expect(schema.timeRequired).toBe('PT70M');
    expect(schema.numberOfLessons).toBe(1);
  });

  it('maps learning objectives to teaches terms and prerequisites verbatim', () => {
    const schema = buildCourse(course);
    expect(schema.teaches).toEqual([
      { '@type': 'DefinedTerm', name: 'Navigate the Linux filesystem' },
      { '@type': 'DefinedTerm', name: 'Use pipes and redirects' },
    ]);
    expect(schema.coursePrerequisites).toEqual(['networking-101']);
  });

  it('omits optional arrays when absent', () => {
    const schema = buildCourse({ ...course, prerequisites: undefined, learningObjectives: [] });
    expect(schema.coursePrerequisites).toBeUndefined();
    expect(schema.teaches).toBeUndefined();
  });
});
