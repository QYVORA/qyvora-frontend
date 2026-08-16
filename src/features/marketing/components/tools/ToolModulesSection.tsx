import React from 'react';
import type { LucideIcon } from 'lucide-react';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSectionHeader from './ToolSectionHeader';

export interface ToolModuleItem {
  id: string;
  /** Zero-padded index badge, e.g. "01". */
  index: string;
  icon: LucideIcon | React.FC<{ size?: number | string; className?: string }>;
  title: string;
  description: string;
  /** Short label under the description, e.g. "11 modules". */
  meta?: string;
  /** Highlighted shell one-liner shown at the foot of the card. */
  code: string;
}

export interface ToolModulesSectionProps {
  id?: string;
  kicker: string;
  title: string;
  accent: string;
  description?: string;
  modules: ToolModuleItem[];
}

/**
 * Groups every module/category/stage of a tool into one card grid instead of
 * one full-viewport strip per item.
 */
const ToolModulesSection: React.FC<ToolModulesSectionProps> = ({
  id,
  kicker,
  title,
  accent,
  description,
  modules,
}) => {
  return (
    <PublicSnapSection id={id}>
      <div className="flex flex-col gap-6 lg:gap-8">
        <ToolSectionHeader kicker={kicker} title={title} accent={accent} description={description} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article
                key={module.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-bg-card p-5 transition-colors hover:border-accent/40 sm:p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="font-mono text-xs font-black tracking-widest text-accent/60">{module.index}</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-text-primary sm:text-base">{module.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-muted flex-1 sm:text-[13px]">{module.description}</p>
                {module.meta && (
                  <span className="mt-3 inline-flex w-fit items-center rounded-lg border border-accent/30 bg-accent/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-accent">
                    {module.meta}
                  </span>
                )}
                <div className="mt-4">
                  <CodeBlock code={module.code} lang="sh" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PublicSnapSection>
  );
};

export default ToolModulesSection;
