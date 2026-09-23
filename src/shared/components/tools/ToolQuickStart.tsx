import React from 'react';
import CodeBlock from '@/shared/components/CodeBlock';

export interface ToolSampleLine {
  label: string;
  text: string;
}

interface ToolQuickStartProps {
  /** Primary invocation, e.g. "anansi target.com --deep". */
  command: string;
  /** Optional note rendered under the command. */
  commandNote?: string;
  /** Structured sample-output lines rendered as a flat text block. */
  output?: ToolSampleLine[];
  /** Interactive REPL/session lines rendered as a flat text block. */
  session?: string[];
  /** Usage commands (prefixed with `$` and rendered one per line). */
  usage: string[];
  /** Actionable footnote under the usage commands (e.g. authorisation warning). */
  footer?: React.ReactNode;
}

/**
 * ToolQuickStart — reader-centred command + sample-output block for tool
 * documentation pages. Real copyable CodeBlocks, flat hierarchy: no decorative
 * terminal chrome and no cards-in-cards. Structured output renders as labelled
 * plain-text lines so the section reads like documentation, not a mock window.
 */
const ToolQuickStart: React.FC<ToolQuickStartProps> = ({
  command,
  commandNote,
  output,
  session,
  usage,
  footer,
}) => {
  const outputLines = output?.map((line) => `[${line.label.toLowerCase()}] ${line.text}`);
  const sessionLines = session ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6">
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Run it</p>
          <CodeBlock code={command} lang="sh" copyable />
          {commandNote && (
            <p className="text-xs font-mono text-text-muted leading-relaxed">{commandNote}</p>
          )}
        </div>

        {outputLines.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Sample output</p>
            <CodeBlock code={outputLines.join('\n')} lang="text" badge="output" />
          </div>
        )}

        {sessionLines.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Interactive session</p>
            <CodeBlock code={sessionLines.join('\n')} lang="text" badge="interactive" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Usage</p>
        <CodeBlock code={usage.map((cmd) => `$ ${cmd}`).join('\n')} lang="sh" copyable />
        {footer && (
          <p className="text-xs font-mono text-text-muted leading-relaxed">{footer}</p>
        )}
      </div>
    </div>
  );
};

export default ToolQuickStart;