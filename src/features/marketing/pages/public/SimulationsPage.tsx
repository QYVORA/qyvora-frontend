import React from 'react';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';

type SimKey = 'terminal' | 'ide' | 'network';

export const SIMULATIONS: {
  id: SimKey;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
}[] = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal, title: 'Browser Terminal', description: 'A full Linux shell running in your browser. Navigate a realistic filesystem, inspect permissions, and chain commands with pipes and redirects.', features: ['Realistic Linux filesystem', 'Pipes, redirects, and environment variables', 'Persistent session state', 'Typed output with realistic timing'] },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork, title: 'Network', description: 'Map live network topologies: hosts, subnets, ports, and services, the same way operators build a picture of a target environment.', features: ['Interactive topology canvas', 'Host and service discovery', 'Subnet grouping', 'Drag and connect nodes'] },
];

const SimulationsPage = () => {

  return (
    <div className="w-full bg-canvas">
      <SEO title={"Simulations - QYVORA"} description={"Try QYVORA's simulation tools live: a browser terminal, a code playground, and a network visualizer. No account required."} />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Tools"}
          title={"Simulation"}
          description={"Try the tools before you commit. Every simulation runs live in your browser, with no account and no setup."}
          actions={
            <Button to="/register">
              {"Start Training"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SIMULATIONS.map((sim) => {
            const Icon = sim.icon;
            const features = sim.features;
            return (
              <Card key={sim.id} interactive className="flex h-full min-h-[240px] flex-col gap-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {sim.title}
                </h3>
                <p className="type-body-sm flex-1">{sim.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="type-meta rounded-md border border-border-subtle bg-surface-raised px-2 py-1">
                      {feature}
                    </span>
                  ))}
                </div>
                <Button to={sim.slug} variant="secondary" size="sm">
                  {"Run the Demo"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Card>
            );
          })}
        </div>
      </PublicContainer>
    </div>
  );
};

export default SimulationsPage;