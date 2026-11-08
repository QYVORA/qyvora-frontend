import React from 'react';
import { cn } from '@/shared/utils/cn';
import { tokeniseBash, TOKEN_CLASS } from './bashTokenizer';
import { isShellLanguage } from './shellComments';

interface ShellCodeProps {
  /** Comment-free code. Run it through extractShellComments first. */
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlights?: number[];
  /** Prefix non-empty lines with a terminal prompt. */
  prompt?: boolean;
  className?: string;
}

export const ShellCode: React.FC<ShellCodeProps> = ({
  code,
  language,
  showLineNumbers = false,
  highlights = [],
  prompt = false,
  className,
}) => {
  if (!code.trim()) return null;

  const isShell = isShellLanguage(language);
  const lines = code.split('\n');
  const highlightSet = new Set(highlights);

  return (
    <pre
      className={cn(
        'overflow-x-auto px-3 py-3 font-mono text-[12px] leading-6 text-text-primary',
        'sm:px-4 sm:text-[13px] md:text-sm md:leading-7',
        className,
      )}
    >
      <code>
        {lines.map((line, index) => (
          <span
            key={index}
            className={cn(
              'flex min-w-max rounded-sm',
              highlightSet.has(index + 1) && 'bg-accent-dim',
            )}
          >
            {showLineNumbers && (
              <span className="mr-3 w-5 shrink-0 select-none text-right text-[10px] leading-6 text-text-muted/35 sm:text-[11px] md:leading-7">
                {index + 1}
              </span>
            )}
            <span className="whitespace-pre">
              {prompt && line.trim() && <span className="select-none text-accent">$ </span>}
              {isShell ? (
                tokeniseBash(line).map((token, tokenIndex) => (
                  <span key={tokenIndex} className={TOKEN_CLASS[token.type]}>
                    {token.value}
                  </span>
                ))
              ) : (
                <span className="text-text-primary">{line || ' '}</span>
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
};

export default ShellCode;
