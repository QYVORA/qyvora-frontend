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
 * DocHeader — reading-scale page header for tool documentation.
 * Small logo mark, reading headline, inline stats/actions. Matches the shared
 * PageHeader layout (title left, actions right, metadata row beneath).
 */
const ToolDocHero: React.FC<ToolDocHeroProps> = ({
  toolName,
  accentWord,
  description,
  stats,
  logo,
  actions,
}) => (
  <section className="relative w-full pb-12 md:pb-16">
    <div className="w-full px-3 md:px-4 lg:px-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {logo && (
            <div className="mb-5 w-16 shrink-0 md:w-20" aria-hidden="true">
              {logo}
            </div>
          )}
          <h1 className="text-3xl font-black uppercase tracking-tight text-text-primary md:text-4xl lg:text-5xl">
            {toolName}
            {accentWord && (
              <>
                {' '}
                <span className="text-accent">{accentWord}</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-mono text-text-secondary leading-[2] md:text-base md:leading-[2.2]">
            {description}
          </p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>

      {stats && stats.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-border-subtle pt-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-accent md:text-lg">
                {stat.value}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default ToolDocHero;