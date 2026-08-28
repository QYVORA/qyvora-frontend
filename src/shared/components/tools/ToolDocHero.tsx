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
 * Hero section for tool documentation pages.
 * Full-width, not a snap section — flows naturally at the top of the page.
 */
const ToolDocHero: React.FC<ToolDocHeroProps> = ({
  toolName,
  accentWord,
  description,
  stats,
  logo,
  actions,
}) => (
  <section className="relative w-full bg-bg pt-32 md:pt-28 lg:pt-32 pb-16 md:pb-24 overflow-hidden">
    {/* Background grid */}
    <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.05)_39px,rgba(255,255,255,0.05)_40px)] bg-[length:40px_40px]" />
    </div>

    <div className="relative z-10 px-3 md:px-4 lg:px-6">
      {/* Logo above text on mobile, centered */}
      {logo && (
        <div className="flex items-center justify-center shrink-0 mb-8 lg:hidden">
          <div className="w-40 sm:w-52">{logo}</div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
        {/* Left: text content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-text-primary leading-[0.95]">
            {toolName}{' '}
            {accentWord && <span className="text-accent">{accentWord}</span>}
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-text-secondary font-mono leading-relaxed max-w-xl">
            {description}
          </p>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 md:mt-8">
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

          {actions && <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-8">{actions}</div>}
        </div>

        {/* Right: logo/visual (desktop only) */}
        {logo && (
          <div className="hidden lg:flex items-center justify-center shrink-0 w-64 xl:w-80">
            {logo}
          </div>
        )}
      </div>
    </div>
  </section>
);

export default ToolDocHero;
