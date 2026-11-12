import React from 'react';
import { cn } from '@/shared/utils/cn';
import { tokeniseBash } from './bashTokenizer';
import { isShellLanguage } from './shellComments';
import {
  CODE_TOKEN_CLASS,
  createTokenizerState,
  tokenizeLine,
  type CodeToken,
  type CodeTokenType,
} from './codeTokenizer';

export interface CodeSurfaceProps {
  /** Code to display. Comments are shown inline for shell languages. */
  code: string;
  language?: string;
  /** Force line numbers on/off. Defaults on for code snippets > 3 lines. */
  showLineNumbers?: boolean;
  /** 1-based line numbers to emphasize with a left accent. */
  highlights?: number[];
  /** Prefix non-empty lines with a `$` prompt (shell only). */
  prompt?: boolean;
  className?: string;
}

const shellTokensToCodeTokens = (line: string): CodeToken[] =>
  tokeniseBash(line).map((token) => ({ type: token.type as CodeTokenType, value: token.value }));

export const CodeSurface: React.FC<CodeSurfaceProps> = ({
  code,
  language,
  showLineNumbers,
  highlights = [],
  prompt = false,
  className,
}) => {
  if (!code.trim()) return null;

  const isShell = isShellLanguage(language);
  const lines = code.split('\n');
  const highlightSet = new Set(highlights);
  const state = createTokenizerState();
  const lineNumbers = showLineNumbers ?? (!prompt && lines.length > 3);

  return (
    <pre
      className={cn(
        'overflow-x-auto bg-code-bg px-3 py-3 font-mono text-[12px] leading-6 text-text-primary',
        'sm:px-4 sm:text-[13px]',
        className,
      )}
    >
      <code>
        {lines.map((line, index) => {
          const tokens = isShell ? shellTokensToCodeTokens(line) : tokenizeLine(line, language ?? '', state);
          const highlighted = highlightSet.has(index + 1);
          return (
            <span
              key={index}
              className={cn(
                'flex min-w-max rounded-sm',
                highlighted && 'border-l-2 border-accent bg-accent-dim pl-1',
              )}
            >
              {lineNumbers && (
                <span className="mr-3 w-5 shrink-0 select-none text-right text-[10px] leading-6 text-text-muted/35 sm:text-[11px]">
                  {index + 1}
                </span>
              )}
              <span className="whitespace-pre">
                {prompt && line.trim() && <span className="select-none text-accent">$ </span>}
                {tokens.length === 0 ? (
                  <span className="text-text-primary"> </span>
                ) : (
                  tokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={CODE_TOKEN_CLASS[token.type]}>
                      {token.value}
                    </span>
                  ))
                )}
              </span>
            </span>
          );
        })}
      </code>
    </pre>
  );
};

export default CodeSurface;
