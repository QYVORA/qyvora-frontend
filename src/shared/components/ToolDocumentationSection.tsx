import type { ElementType } from 'react';
import { FolderTree } from 'lucide-react';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import CodeBlock from '@/shared/components/CodeBlock';

export interface ToolDocumentationSectionProps {
  id: string;
  index: string;
  icon: ElementType;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  why: string;
  bullets?: string[];
  code?: string;
  codeLabel?: string;
  tree?: string[];
}

/** A compact, source-backed documentation chapter that flows naturally. */
const ToolDocumentationSection = ({
  id, index, icon: Icon, eyebrow, title, accent, description, why, bullets = [], code, codeLabel = 'Example', tree,
}: ToolDocumentationSectionProps) => {
  const numericIndex = Number.parseInt(index, 36) || 0;
  const reverseDesktop = numericIndex % 2 === 0;
  const splitDesktop = numericIndex % 3 === 0;

  return (
  <PublicSnapSection id={id}>
    <article className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10 lg:gap-x-14">
      <div className={`flex flex-col ${reverseDesktop ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-[9px] font-black tracking-widest text-accent">{index}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{eyebrow}</span>
        </div>
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" />
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[.95] text-text-primary">
              {title} <span className="text-accent">{accent}</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base lg:mt-5 lg:text-lg">{description}</p>
          </div>
        </div>
        <div className="mt-4 border-l-2 border-accent/50 pl-3 lg:mt-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-accent">Why it exists</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">{why}</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${splitDesktop ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} ${reverseDesktop ? 'lg:order-1' : 'lg:order-2'} lg:content-center`}>
        {bullets.length > 0 && (
          <div className={`rounded-2xl border border-border/30 bg-bg-card p-4 sm:p-5 ${splitDesktop ? 'lg:translate-y-6' : ''}`}>
            <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-text-muted">What it does</p>
            <ul className="space-y-1.5">
              {bullets.slice(0, 3).map((bullet) => <li key={bullet} className="flex gap-2 text-xs leading-relaxed text-text-secondary sm:text-sm"><span className="text-accent">›</span>{bullet}</li>)}
            </ul>
          </div>
        )}
        {code && (
          <div className={`${splitDesktop ? 'lg:-translate-y-5' : ''}`}>
            <CodeBlock code={code} lang="sh" badge={codeLabel} className="h-full" />
          </div>
        )}
        {tree && (
          <div className="overflow-hidden rounded-2xl border border-border/30 bg-bg-card p-3 sm:p-4">
            <p className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-muted"><FolderTree className="h-3.5 w-3.5 text-accent" /> Source layout</p>
            <pre className="font-mono text-[10px] leading-relaxed text-text-secondary"><code>{tree.slice(0, 7).join('\n')}</code></pre>
          </div>
        )}
      </div>
    </article>
  </PublicSnapSection>
  );
};

export default ToolDocumentationSection;
