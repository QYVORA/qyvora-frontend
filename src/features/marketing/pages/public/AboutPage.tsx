import React from 'react';
import { ArrowRight, Users, FlaskConical, PhoneCall, ScrollText } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import PageHeader from '@/shared/components/ui/PageHeader';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';

/**
 * AboutPage — calm discovery hub for the team, the research collective,
 * contact, and legal. One tile per destination, all within the public shell.
 */
const AboutPage: React.FC = () => {

  const tiles = [
    { key: 'team', to: '/team', icon: <Users className="h-5 w-5" aria-hidden="true" />, title: 'The team', desc: 'Meet the operators and engineers building QYVORA.', cta: 'Meet the team' },
    { key: 'quiteroot', to: '/quiteroot', icon: <FlaskConical className="h-5 w-5" aria-hidden="true" />, title: 'QuiteRoot', desc: 'The intelligence and engineering collective behind our tooling and research.', cta: 'Explore QuiteRoot' },
    { key: 'contact', to: '/services', icon: <PhoneCall className="h-5 w-5" aria-hidden="true" />, title: 'Contact', desc: 'Reach the desk directly — partnerships, services, and research inquiries.', cta: 'Contact the desk' },
    { key: 'legal', to: '/terms', icon: <ScrollText className="h-5 w-5" aria-hidden="true" />, title: 'Legal', desc: 'Terms of service governing use of the platform.', cta: 'Read the terms' },
  ];

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"About | QYVORA"}
        description={"The team, the research collective, and the mission behind QYVORA."}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={"About QYVORA"}
          title={"Built in Africa, for African defenders."}
          description={"QYVORA is an offensive security training platform and services team. Get to know the people and mission driving it."}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((tile, i) => (
            <ScrollReveal key={tile.key} delay={(i % 2) * 80}>
              <Card to={tile.to} interactive className="flex min-h-[160px] flex-col gap-3 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;