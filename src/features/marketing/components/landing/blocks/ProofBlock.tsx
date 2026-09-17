import React from 'react';
import { Users, Bug, ShieldCheck, Coins } from 'lucide-react';
import { Metric } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';
import type { BackendStats } from '@/features/marketing/components/landing/types';

interface ProofBlockProps {
  stats: BackendStats | null;
}

const formatNumber = (value: number): string => {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}k`;
  return `${value}`;
};

/**
 * ProofBlock — actual platform outcomes only. Each metric maps to a live
 * backend figure; nothing is hardcoded marketing filler.
 */
const ProofBlock: React.FC<ProofBlockProps> = ({ stats }) => {
  const s = stats?.stats;
  const metrics = [
    { label: "Operators trained", value: formatNumber(s?.learnersTrained ?? 0), icon: <Users className="h-4 w-4" aria-hidden="true" />, accent: true },
    { label: "Vulnerabilities identified across engagements", value: formatNumber(s?.vulnerabilitiesIdentified ?? 0), icon: <Bug className="h-4 w-4" aria-hidden="true" /> },
    { label: "Bootcamp launches", value: formatNumber(s?.bootcampsCount ?? 0), icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
    { label: "CP distributed to operators", value: formatNumber(s?.cpPoolSize ?? 0), icon: <Coins className="h-4 w-4" aria-hidden="true" /> },
  ];

  return (
    <section className="w-full bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
              {"Proof, not promises"}
            </p>
            <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
              {"Built in Africa, for real defenders."}
            </h2>
            <p className="type-body mt-2">{"Every number below is earned by operators on the platform — not marketing filler."}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-border-subtle bg-canvas p-6">
                <Metric
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  accent={metric.accent}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProofBlock;