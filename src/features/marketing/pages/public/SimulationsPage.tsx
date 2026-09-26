import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { SIMULATIONS } from '@/features/marketing/data/simulationsData';

/**
 * Re-exported for backwards compatibility: LearnPage imports the catalogue
 * from this module. The data itself now lives in `simulationsData.ts` so the
 * listing and `/simulations/:slug` cannot drift apart.
 */
export { SIMULATIONS };

const SimulationsPage = () => {
  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Simulations - QYVORA"}
        description={`Try QYVORA's simulation tools live in your browser: ${SIMULATIONS
          .map((sim) => sim.title.toLowerCase())
          .join(' and a ')}. No account required.`}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Tools"}
          title={"Simulations"}
          description={"Try the tools before you commit. Every simulation runs live in your browser, with no account and no setup."}
          actions={
            <Button to="/register">
              {"Start Training"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        {SIMULATIONS.length === 0 ? (
          <div
            role="status"
            className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-subtle px-6 py-16 text-center"
          >
            <p className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {"No simulations published yet"}
            </p>
            <p className="type-body-sm max-w-md text-text-muted">
              {"The catalogue is empty. Check back shortly, or browse the full tool list in the meantime."}
            </p>
            <Button to="/tools" variant="secondary" size="sm">
              {"Browse all tools"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {SIMULATIONS.map((sim) => {
              const Icon = sim.icon;
              return (
                <Card
                  key={sim.id}
                  to={sim.slug}
                  interactive
                  className="flex h-full min-h-[240px] flex-col gap-3 p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                    {sim.title}
                  </h2>
                  <p className="type-body-sm flex-1">{sim.description}</p>
                  <ul className="flex flex-col gap-1.5">
                    {sim.features.map((feature) => (
                      <li key={feature} className="type-meta flex items-start gap-2 text-text-muted">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
                    <span className="type-meta text-accent">{"No account required"}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-accent">
                      {"Open simulation"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </PublicContainer>
    </div>
  );
};

export default SimulationsPage;
