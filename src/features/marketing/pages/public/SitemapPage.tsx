import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import { Card } from '@/shared/components/ui/Card';
import { TOOLS } from '@/features/marketing/data/tools/registry';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';

interface SitemapLink {
  label: string;
  to: string;
}

interface SitemapGroup {
  title: string;
  links: SitemapLink[];
}

const GROUPS: SitemapGroup[] = [
  {
    title: 'Start here',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Learn', to: '/learn' },
      { label: 'Hacker Protocol Bootcamp', to: '/hpb' },
      { label: 'QOSE', to: '/qose' },
      { label: 'Simulations', to: '/simulations' },
      { label: 'Tools', to: '/tools' },
      { label: 'Cheat sheets', to: '/resources' },
      { label: 'Changelog', to: '/changelog' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Leaderboard', to: '/leaderboard' },
      { label: 'Cyber Coin', to: '/cp' },
      { label: 'Zero-Day Market', to: '/zero-day-market' },
      { label: 'Community guidelines', to: '/acceptable-use' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Team', to: '/team' },
      { label: 'Leadership', to: '/leadership' },
      { label: 'Services', to: '/services' },
      { label: 'Basic web application pentest', to: '/services/basic-web-application-pentest' },
      { label: 'Standard web application pentest', to: '/services/standard-web-application-pentest' },
      { label: 'Employee cybersecurity bootcamp', to: '/services/employee-cybersecurity-bootcamp' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Trust and credentials',
    links: [
      { label: 'Credentials', to: '/credentials' },
      { label: 'Verify a credential', to: '/verify' },
      { label: 'System status', to: '/status' },
      { label: 'Security & responsible disclosure', to: '/security' },
      { label: 'Compliance posture', to: '/security#compliance' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Refund and cancellation', to: '/refund-policy' },
      { label: 'Acceptable use', to: '/acceptable-use' },
      { label: 'Security policy', to: '/security' },
      { label: 'Accessibility statement', to: '/accessibility' },
    ],
  },
];

const SitemapPage: React.FC = () => {
  return (
    <div className="w-full bg-canvas">
      <SEO
        title="Sitemap | QYVORA"
        description="A human-readable index of every public QYVORA page, including learning, tools, services, credentials, status, and legal documents."
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Sitemap"
          title="Every public page"
          description="A human-readable index of the public site. Search engines can use the machine-readable version at /sitemap.xml."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((group) => (
            <Card key={group.title} as="section" className="flex flex-col gap-4 p-6">
              <h2 className="type-label uppercase tracking-[0.12em] text-accent">{group.title}</h2>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.to}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          <Card as="section" className="flex flex-col gap-4 p-6">
            <h2 className="type-label uppercase tracking-[0.12em] text-accent">Research</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/blogs"
                  className="text-sm font-bold text-text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  All articles
                </Link>
              </li>
              {BLOG_POSTS.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="text-sm text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card as="section" className="flex flex-col gap-4 p-6 sm:col-span-2 lg:col-span-3">
            <h2 className="type-label uppercase tracking-[0.12em] text-accent">Tool documentation</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/${tool.slug}`}
                    className="text-sm text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </PublicContainer>
    </div>
  );
};

export default SitemapPage;
