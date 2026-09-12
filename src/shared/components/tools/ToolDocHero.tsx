import React from 'react';

interface ToolDocHeroProps {
  toolName: string;
  accentWord?: string;
  description: string;
  stats?: { label: string; value: string | number }[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * DocHeader — compact page header for tool documentation.
 * Small logo mark, reading-scale headline and inline stats/actions.
 * Contrasts with the marketing hero scale so docs read as documentation.
 */
const ToolDocHero: React.FC<ToolDocHeroProps> = ({
  toolName,
  accentWord,
  description,
  stats,
  logo,
  actions,
}) => (
  <section className="relative w-full bg-bg pt-20 md:pt-24 pb-12 md:pb-14 overflow-hidden">
    <div className="relative z-10 px-3 md:px-4 lg:px-6 flex flex-col gap-5 md:gap-6">
      {logo && (
        <div className="w-14 md:w-20 shrink-0">
          {logo}
        </div>
      )}

      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text-primary leading-[1.05]">
        {toolName}{' '}
        {accentWord && <span className="text-accent">{accentWord}</span>}
      </h1>

      <p className="max-w-2xl text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2]">
        {description}
      </p>

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black text-accent font-mono">
                {stat.value}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  </section>
);

export default ToolDocHero;