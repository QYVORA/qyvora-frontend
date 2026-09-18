import React from 'react';
import { ArrowRight, Wrench, FlaskConical } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';

/**
 * ToolsResearchBlock — one compact strip, two destinations: the open-source
 * tool index and the research feed. No eight-tool grid on the landing.
 */
const ToolsResearchBlock: React.FC = () => {

  const tiles = [
    {
      key: 'tools',
      to: '/tools',
      icon: <Wrench className="h-5 w-5" aria-hidden="true" />,
      cta: 'Browse the tools',
    },
    {
      key: 'research',
      to: '/blogs',
      icon: <FlaskConical className="h-5 w-5" aria-hidden="true" />,
      cta: 'Read the research',
    },
  ];

  return (
    <section className="w-full bg-canvas">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
              {"Tools and research"}
            </p>
            <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
              {"Combat-ready open-source tooling."}
            </h2>
            <p className="type-body mt-2">{"Thirteen offensive security tools, built in the open and documented for operators — plus research from the QuiteRoot collective."}</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2">
          {tiles.map((tile, i) => (
            <ScrollReveal key={tile.key} delay={i * 0.08}>
              <Card to={tile.to} interactive className="flex min-h-[120px] items-center gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                  {tile.icon}
                </span>
                <span className="flex flex-1 items-center justify-between gap-3">
                  <span className="type-meta text-text-secondary">/{tile.to.replace(/^\//, '')}</span>
                  <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
                    {tile.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </span>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsResearchBlock;