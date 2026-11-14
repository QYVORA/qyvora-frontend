import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, FlaskConical, PhoneCall, ScrollText, Shield, ShieldCheck } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import SEO from '@/shared/components/SEO';

/**
 * AboutPage — calm discovery hub for the team, the research collective,
 * contact, and legal. One tile per destination, all within the public shell.
 */
const AboutPage: React.FC = () => {

  const tiles = [
    { key: 'team', to: '/team', icon: <Users className="h-5 w-5" aria-hidden="true" />, title: 'The team', desc: 'Discover everyone working at QYVORA across leadership, security, and engineering.', cta: 'Meet the team' },
    { key: 'leadership', to: '/leadership', icon: <Shield className="h-5 w-5" aria-hidden="true" />, title: 'Leadership', desc: 'The five founding and executive leaders steering QYVORA\'s mission and operations.', cta: 'Meet the leadership' },
    { key: 'quiteroot', to: '/quiteroot', icon: <FlaskConical className="h-5 w-5" aria-hidden="true" />, title: 'Quiteroot', desc: 'QYVORA\'s technical team — a Tech Team and a Security Team, with every role published.', cta: 'Explore Quiteroot' },
    { key: 'contact', to: '/contact', icon: <PhoneCall className="h-5 w-5" aria-hidden="true" />, title: 'Contact', desc: 'Reach the desk directly: partnerships, services, and research inquiries.', cta: 'Contact the desk' },
    { key: 'security', to: '/security', icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />, title: 'Security & compliance', desc: 'Responsible disclosure, our privacy commitments, and the standards we are evaluating.', cta: 'Review our posture' },
    { key: 'legal', to: '/terms', icon: <ScrollText className="h-5 w-5" aria-hidden="true" />, title: 'Legal', desc: 'Terms of service governing use of the platform.', cta: 'Read the terms' },
  ];

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"About | QYVORA"}
        description={"The team, research collective, security practices, and mission behind QYVORA."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"About QYVORA"}
          title={"Built in Africa, for African defenders."}
          description={"QYVORA is an offensive security training platform and services team. Get to know the people and mission driving it."}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tiles.map((tile) => (
            <Card key={tile.key} to={tile.to} interactive className="flex h-full min-h-[160px] flex-col gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center text-accent">
                {tile.icon}
              </span>
              <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                {tile.title}
              </h3>
              <p className="type-body-sm flex-1">{tile.desc}</p>
              <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
                {tile.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Card>
          ))}
        </div>

        <section
          aria-labelledby="about-trust-heading"
          className="mt-16 border-t border-border-subtle pt-10 md:pt-12"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
            <div>
              <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-accent">
                Security, privacy & responsible technology
              </p>
              <h2
                id="about-trust-heading"
                className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
              >
                We publish our posture, not badges.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                QYVORA trains defenders and sells security work, so we hold our own platform
                to the same standard. We are still building our formal security and privacy
                programme. Until certifications are earned, we describe our status plainly
                instead of implying assurance we cannot prove.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link
                  to="/security#compliance"
                  className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Read our compliance posture
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/privacy"
                  className="inline-flex min-h-[44px] items-center text-sm font-bold text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            <Card as="div" className="p-6">
              <h3 className="text-lg font-bold text-text-primary">What that means in practice</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  Security reports are handled through our responsible disclosure process.
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  Personal data is handled under our Privacy Policy and applicable data-protection law.
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  Framework status is published on our Security page, with no unverified certification claims.
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </PublicContainer>
    </div>
  );
};

export default AboutPage;