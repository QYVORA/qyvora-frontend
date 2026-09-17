import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';

interface PathDef {
  key: 'learn' | 'practice' | 'work';
  to: string;
  title: string;
  desc: string;
  cta: string;
}

const PATHS: PathDef[] = [
  { key: 'learn', to: '/learn', title: 'Learn', desc: 'Master foundations with self-paced courses covering Linux, networking, web security, and exploitation — one skill at a time.', cta: 'Browse learning' },
  { key: 'practice', to: '/labs', title: 'Practice', desc: 'Execute real exploits in simulated attack labs. Capture flags and chain vulnerabilities in production-mirror environments.', cta: 'Open the labs' },
  { key: 'work', to: '/services', title: 'Work with us', desc: 'Penetration testing, red team exercises, and security awareness training for African organizations — scoped to your stack.', cta: 'Start an engagement' },
];

/**
 * PathBlock — the three ways into the platform. One card each, no filler
 * tiles, whole card is the interactive target.
 */
const PathBlock: React.FC = () => {

  return (
    <section className="w-full bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
                {"Choose your path"}
              </p>
              <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {"Learn. Practice. Prove."}
              </h2>
              <p className="type-body mt-2 max-w-prose">{"Three ways in. Your journey through the platform depends on what you want out of it."}</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {PATHS.map((path, i) => (
            <ScrollReveal key={path.key} delay={i * 80}>
              <Card to={path.to} interactive className="flex min-h-[220px] flex-col gap-3 p-6">
                <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {path.title}
                </h3>
                <p className="type-body-sm flex-1">{path.desc}</p>
                <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
                  {path.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PathBlock;