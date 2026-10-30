import { useMemo } from 'react';
import { BookOpen, ChevronDown, ShieldAlert } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { explainCommand, type CommandExplanation as CommandExplanationData } from '@/shared/learning/utils/explainCommand';

interface CommandExplanationProps {
  command: string;
  collapsible?: boolean;
  className?: string;
}

function ExplanationBody({ explanation }: { explanation: CommandExplanationData }) {
  return (
    <div className="space-y-4">
      <p className="text-base font-mono leading-relaxed text-text-secondary md:text-lg">
        {explanation.overview}
      </p>

      <div className="space-y-3">
        {explanation.parts.map((part, index) => (
          <div
            key={`${part.command}-${index}`}
            className="rounded-xl border border-border/30 bg-bg/60 px-4 py-3"
          >
            <code className="block overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm font-bold text-accent md:text-base">
              {part.command}
            </code>
            <p className="mt-2 text-base font-mono leading-relaxed text-text-secondary">
              {part.summary}
            </p>
            {part.flags.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" role="list">
                {part.flags.map((flag) => (
                  <li
                    key={`${part.command}-${flag.flag}`}
                    className="flex items-center gap-1.5 rounded-lg border border-border/30 bg-bg-elevated px-2 py-1 font-mono text-xs text-text-secondary"
                  >
                    <code className="font-bold text-accent">{flag.flag}</code>
                    <span>{flag.meaning}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {explanation.caution && (
        <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          <p className="font-mono text-sm leading-relaxed text-warning md:text-base">
            {explanation.caution}
          </p>
        </div>
      )}
    </div>
  );
}

export function CommandExplanation({ command, collapsible = false, className }: CommandExplanationProps) {
  const explanation = useMemo(() => explainCommand(command), [command]);
  if (!explanation) return null;

  if (collapsible) {
    return (
      <details className={cn('group border-t border-border/30 bg-bg-elevated/60', className)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest text-text-secondary transition-colors hover:text-accent">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
            Explain these commands
          </span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="px-4 pb-4">
          <ExplanationBody explanation={explanation} />
        </div>
      </details>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border/40 bg-bg-elevated/60 px-4 py-4', className)}>
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">Command breakdown</p>
      </div>
      <ExplanationBody explanation={explanation} />
    </div>
  );
}

export default CommandExplanation;
