import React from 'react';
import { Code2 } from 'lucide-react';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSectionHeader from './ToolSectionHeader';

export interface ToolSourceExample {
  id: string;
  /** Path shown in the code block header. */
  filename: string;
  label: string;
  description: string;
  code: string;
}

export interface ToolSourceSectionProps {
  id?: string;
  kicker: string;
  title: string;
  accent: string;
  description: string;
  examples: ToolSourceExample[];
}

/**
 * Real Go source from the tool's repository, laid out as a non-carousel grid
 * so every example stays visible at once.
 */
const ToolSourceSection: React.FC<ToolSourceSectionProps> = ({
  id,
  kicker,
  title,
  accent,
  description,
  examples,
}) => {
  return (
    <PublicSnapSection id={id}>
      <div className="flex flex-col gap-6 lg:gap-8">
        <ToolSectionHeader kicker={kicker} title={title} accent={accent} description={description} />
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
          {examples.map((example) => (
            <article
              key={example.id}
              className="flex flex-col rounded-2xl border border-border/30 bg-bg-card p-5 sm:p-6"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                  <Code2 className="h-4 w-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent">
                    Go source example
                  </p>
                  <h3 className="mt-0.5 text-sm font-black text-text-primary">{example.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">{example.description}</p>
                </div>
              </div>
              <CodeBlock code={example.code} lang="go" filename={example.filename} className="mt-auto" />
            </article>
          ))}
        </div>
      </div>
    </PublicSnapSection>
  );
};

export default ToolSourceSection;
