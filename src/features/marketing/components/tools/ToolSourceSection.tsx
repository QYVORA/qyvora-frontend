import React from 'react';
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

const ToolSourceSection: React.FC<ToolSourceSectionProps> = ({
  id,
  kicker,
  title,
  accent,
  description,
  examples,
}) => {
  if (!examples.length) return null;

  return (
    <div id={id} className="relative w-full border-t border-border/10 py-16 md:py-24">
      <div className="w-full px-3 md:px-4 lg:px-6">
        <div className="flex flex-col gap-8 md:gap-10">
          <ToolSectionHeader kicker={kicker} title={title} accent={accent} description={description} />

          <div className="flex flex-col gap-4">
            {examples.map((example) => (
              <div
                key={example.id}
                className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5"
              >
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                  {example.label}
                </p>
                <p className="mt-2 max-w-2xl text-xs font-mono leading-relaxed text-text-muted">
                  {example.description}
                </p>
                <div className="mt-4">
                  <CodeBlock
                    code={example.code}
                    lang="go"
                    filename={example.filename}
                    maxHeight="max-h-[45vh]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolSourceSection;