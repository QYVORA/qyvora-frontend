import React from 'react';
import { ArrowRight, Users, FlaskConical, PhoneCall, ScrollText } from 'lucide-react';
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
    { key: 'team', to: '/team', icon: <Users className="h-5 w-5" aria-hidden="true" />, title: 'The team', desc: 'Meet the operators and engineers building QYVORA.', cta: 'Meet the team' },
    { key: 'quiteroot', to: '/quiteroot', icon: <FlaskConical className="h-5 w-5" aria-hidden="true" />, title: 'QuiteRoot', desc: 'QYVORA\u2019s technical team — currently no active members, open to applications.', cta: 'Explore QuiteRoot' },
    { key: 'contact', to: '/contact', icon: <PhoneCall className="h-5 w-5" aria-hidden="true" />, title: 'Contact', desc: 'Reach the desk directly: partnerships, services, and research inquiries.', cta: 'Contact the desk' },
    { key: 'legal', to: '/terms', icon: <ScrollText className="h-5 w-5" aria-hidden="true" />, title: 'Legal', desc: 'Terms of service governing use of the platform.', cta: 'Read the terms' },
  ];

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"About | QYVORA"}
        description={"The team, the research collective, and the mission behind QYVORA."}
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
          ))}
        </div>
      </PublicContainer>
    </div>
  );
};

export default AboutPage;