import React from 'react';
import { tokenizeCode, codeTokenClass, type CodeLang } from '@/shared/components/CodeBlock';
import { cn } from '@/shared/utils/cn';

interface InlineCodeProps {
  code: string;
  lang?: CodeLang;
  className?: string;
}

/**
 * InlineCode — syntax colouring for code that is not in a block.
 *
 * Commands rendered as a single row, and commands or flags quoted inside prose,
 * tables, and definition lists, all need the same colouring a `CodeBlock`
 * would give them. This renders one highlighted run so those surfaces read as
 * part of the same system instead of flat monospace text.
 */
const InlineCode: React.FC<InlineCodeProps> = ({ code, lang = 'text', className }) => {
  const tokens = React.useMemo(() => tokenizeCode(code, lang), [code, lang]);

  return (
    <code className={cn('font-mono', className)}>
      {tokens.map((token, i) => (
        <span key={i} className={codeTokenClass(token.cls)}>
          {token.text}
        </span>
      ))}
    </code>
  );
};

export default InlineCode;
