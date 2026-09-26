import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Zap } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import CodeBlock from '@/shared/components/CodeBlock';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { SimpleHeading } from '@/shared/components/ui';
import { SimulationProvider } from '@/features/student/components/simulations';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';
import { getSimulationBySlug, SIMULATIONS } from '@/features/marketing/data/simulationsData';

const SimulationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  const sim = getSimulationBySlug(slug);
  if (!sim) return <Navigate to="/simulations" replace />;

  const Icon = sim.icon;

  // Sibling simulations for the related-content listing at the page bottom.
  const otherSimulations = SIMULATIONS.filter((s) => s.id !== sim.id).map((s) => ({
    to: s.slug,
    title: s.title,
    subtitle: s.description,
    badge: s.tag,
    icon: React.createElement(s.icon, { className: 'w-16 h-16' }),
  }));

  const openDemo = () => {
    setDemoError(null);
    setDemoOpen(true);
  };

  return (
    <div className="min-h-full w-full bg-canvas">
      <SEO
        title={`${sim.title} ${sim.titleAccent} - QYVORA`}
        description={sim.description}
      />
      <SimulationProvider>
        <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
          <PageHeader
            kicker={"QYVORA · Simulations"}
            title={`${sim.title} ${sim.titleAccent}`}
            description={sim.description}
            metadata={
              <span className="type-meta inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {sim.tag}
              </span>
            }
            actions={
              <>
                <Button to="/register">
                  <Zap className="h-4 w-4" /> {"Start Training"} <IconArrowRight size={14} />
                </Button>
                <Button to="/simulations" variant="secondary">
                  <ArrowLeft className="h-4 w-4" /> {"Back to All Simulations"}
                </Button>
              </>
            }
          />

          {/* Demo launcher — the live tool opens in a modal */}
          <section className="w-full py-10 md:py-14" aria-label={sim.demoTitle}>
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col gap-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 md:h-14 md:w-14">
                  <Icon className="h-6 w-6 text-accent md:h-7 md:w-7" aria-hidden="true" />
                </span>
                <div>
                  <span className="type-meta mb-2 block font-black uppercase tracking-[0.3em] text-accent">
                    {sim.tag}
                  </span>
                  <SimpleHeading
                    text={sim.demoTitle}
                    align="left"
                  />
                </div>
                <p className="wc-prose font-mono text-base leading-relaxed text-text-secondary sm:text-lg">
                  {sim.demoDescription}
                </p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button onClick={openDemo}>
                    <Play className="h-4 w-4" aria-hidden="true" /> {"Run the Demo"} <IconArrowRight size={14} />
                  </Button>
                  <span className="font-mono text-xs leading-snug text-text-muted">
                    {"No account"} · live in your browser
                  </span>
                </div>

                {demoError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-sm text-red-300"
                  >
                    {demoError}
                  </p>
                )}
              </div>

              <CodeBlock
                code={sim.reference.code}
                lang="text"
                filename={sim.reference.filename}
                maxHeight="max-h-[50vh]"
              />
            </div>
          </section>

          <section className="w-full py-10 md:py-14" aria-label="What you can do">
            <div className="flex flex-col gap-6 lg:gap-8">
              <SimpleHeading
                text={"What you can do"}
                align="left"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3">
                {sim.features.map((feature) => (
                  <div
                    key={feature}
                    className="card-accent flex items-center gap-3 bg-surface px-4 py-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
                      <Zap className="h-3 w-3 text-accent" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs leading-snug text-text-secondary md:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button to="/register" variant="secondary" className="w-fit">
                {"Start Training"} <IconArrowRight size={14} />
              </Button>
            </div>
          </section>

          <RelatedContentSection items={otherSimulations} />
        </PublicContainer>

        {/* Live tool modals */}
        {sim.kind === 'terminal' && (
          <TerminalWrapper
            open={demoOpen}
            onOpenChange={(open) => {
              setDemoOpen(open);
              if (!open) setDemoError(null);
            }}
            context={{ type: 'dashboard' }}
            mode="modal"
          />
        )}
        {sim.kind === 'network' && (
          <NetworkBuilder
            open={demoOpen}
            onOpenChange={(open) => {
              setDemoOpen(open);
              if (!open) setDemoError(null);
            }}
          />
        )}
      </SimulationProvider>
    </div>
  );
};

export default SimulationPage;
