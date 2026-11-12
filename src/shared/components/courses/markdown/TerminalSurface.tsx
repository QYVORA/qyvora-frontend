import React from 'react';
import { cn } from '@/shared/utils/cn';
import { tokeniseBash } from './bashTokenizer';
import {
  CODE_TOKEN_CLASS,
  createTokenizerState,
  tokenizeLine,
  type CodeToken,
  type CodeTokenType,
} from './codeTokenizer';
import type { ShellKind } from '@/shared/learning/utils/markdownChunker';

export interface TerminalEntry {
  command?: string;
  output?: string;
}

export interface TerminalSurfaceProps {
  /** Ordered command/output pairs of the terminal session. */
  session: TerminalEntry[];
  /** Shell family that determines the rendered prompt. */
  shell?: ShellKind;
  className?: string;
}

const SHELL_LANG: Record<ShellKind, string> = {
  bash: 'bash',
  cmd: 'cmd',
  powershell: 'powershell',
};

const shellTokensToCodeTokens = (line: string, shell: ShellKind): CodeToken[] => {
  if (shell === 'bash') {
    return tokeniseBash(line).map((token) => ({ type: token.type as CodeTokenType, value: token.value }));
  }
  return tokenizeLine(line, SHELL_LANG[shell], createTokenizerState());
};

/** Prompt rendered as separate muted/accent segments; never copied. */
const Prompt: React.FC<{ shell: ShellKind }> = ({ shell }) => {
  if (shell === 'cmd') {
    return (
      <span className="select-none">
        <span className="text-code-flag">C:\Users\student</span>
        <span className="text-text-muted">&gt;</span>
        <span className="text-text-muted"> </span>
      </span>
    );
  }
  if (shell === 'powershell') {
    return (
      <span className="select-none">
        <span className="text-accent">PS</span>
        <span className="text-text-muted"> </span>
        <span className="text-code-flag">C:\Users\student</span>
        <span className="text-text-muted">&gt;</span>
        <span className="text-text-muted"> </span>
      </span>
    );
  }
  return (
    <span className="select-none">
      <span className="text-accent">student@kali</span>
      <span className="text-text-muted">:</span>
      <span className="text-code-flag">~</span>
      <span className="text-text-muted">$ </span>
    </span>
  );
};

export const TerminalSurface: React.FC<TerminalSurfaceProps> = ({ session, shell = 'bash', className }) => {
  if (!session.length) return null;

  return (
    <pre
      className={cn(
        'overflow-x-auto bg-code-bg px-3 py-3 font-mono text-[12px] leading-6 text-text-primary',
        'sm:px-4 sm:text-[13px]',
        className,
      )}
    >
      <code className="block">
        {session.map((entry, entryIndex) => {
          const commandLines = entry.command?.split('\n') ?? [];
          const outputLines = entry.output?.split('\n') ?? [];
          return (
            <React.Fragment key={entryIndex}>
              {commandLines.map((line, lineIndex) => (
                <span key={`c${lineIndex}`} className="flex min-w-max">
                  {lineIndex === 0 ? (
                    <Prompt shell={shell} />
                  ) : (
                    <span className="select-none text-text-muted/0">{'  '}</span>
                  )}
                  <span className="whitespace-pre">
                    {shellTokensToCodeTokens(line, shell).map((token, tokenIndex) => (
                      <span key={tokenIndex} className={CODE_TOKEN_CLASS[token.type]}>
                        {token.value}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
              {outputLines.length > 0 && (
                <span
                  className={cn(
                    'my-1 block whitespace-pre border-l border-border/60 pl-3 text-text-muted',
                    entryIndex > 0 && 'mt-2',
                  )}
                >
                  {outputLines.join('\n')}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </code>
    </pre>
  );
};

export default TerminalSurface;
