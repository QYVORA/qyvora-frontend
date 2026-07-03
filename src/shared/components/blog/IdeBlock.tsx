import React from 'react';

const KEYWORDS = /\b(const|let|var|function|return|import|export|if|else|for|while|class|extends|new|this|async|await|def|from|try|catch|throw|switch|case|default)\b/g;
const COMMENTS = /(\/\/.*$)|(#.*$)/gm;
const STRINGS = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;

function highlightLine(line: string, lineIndex: number): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const commentMatch = COMMENTS.exec(line);
  const codePart = commentMatch ? line.slice(0, commentMatch.index) : line;
  const commentPart = commentMatch ? line.slice(commentMatch.index) : null;

  const parts: { text: string; type: 'code' | 'string' | 'keyword' | 'comment' }[] = [];
  let lastIndex = 0;

  const stringMatches: { index: number; text: string }[] = [];
  let sm: RegExpExecArray | null;
  const stringRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
  while ((sm = stringRe.exec(codePart)) !== null) {
    stringMatches.push({ index: sm.index, text: sm[0] });
  }

  const keywordMatches: { index: number; text: string }[] = [];
  let km: RegExpExecArray | null;
  const keywordRe = /\b(const|let|var|function|return|import|export|if|else|for|while|class|extends|new|this|async|await|def|from|try|catch|throw|switch|case|default)\b/g;
  while ((km = keywordRe.exec(codePart)) !== null) {
    keywordMatches.push({ index: km.index, text: km[0] });
  }

  const allMatches = [
    ...stringMatches.map(m => ({ ...m, type: 'string' as const })),
    ...keywordMatches.map(m => ({ ...m, type: 'keyword' as const })),
  ].sort((a, b) => a.index - b.index);

  let cursor = 0;
  for (const match of allMatches) {
    if (match.index > cursor) {
      parts.push({ text: codePart.slice(cursor, match.index), type: 'code' });
    }
    parts.push({ text: match.text, type: match.type });
    cursor = match.index + match.text.length;
  }
  if (cursor < codePart.length) {
    parts.push({ text: codePart.slice(cursor), type: 'code' });
  }

  if (commentPart) {
    if (parts.length > 0 || codePart.trim()) {
      parts.push({ text: commentPart, type: 'comment' });
    } else {
      parts.push({ text: commentPart, type: 'comment' });
    }
  }

  return parts.map((part, i) => {
    const colorClass =
      part.type === 'string' ? 'text-amber-300/90' :
      part.type === 'keyword' ? 'text-blue-400/90' :
      part.type === 'comment' ? 'text-emerald-400/50' :
      'text-gray-200/80';
    return <span key={i} className={colorClass}>{part.text}</span>;
  });
}

const IdeBlock: React.FC<{
  code: string;
  language?: string;
}> = ({ code, language = 'code' }) => {
  const lines = code.split('\n');
  const lineDigits = String(lines.length).length;

  return (
    <div className="relative bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden my-8 shadow-2xl shadow-black/40">
      {/* ── Title Bar ── */}
      <div className="relative bg-[#252526] border-b border-[#333] px-4 py-2.5 flex items-center gap-3 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-2 ml-2 text-[11px] text-gray-400 font-mono">
          <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {language}
        </div>
      </div>

      {/* ── Editor Area ── */}
      <div className="relative flex">
        {/* Line Number Gutter */}
        <div className="select-none py-4 pr-3 pl-4 text-right text-[13px] leading-relaxed font-mono text-[#858585] bg-[#1e1e1e] border-r border-[#333]/50 min-w-[var(--gutter-width)]" style={{ '--gutter-width': `${lineDigits + 3}ch` } as React.CSSProperties}>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <pre className="py-4 px-4 font-mono leading-relaxed whitespace-pre text-[13px]">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {highlightLine(line, i)}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="bg-[#007acc] px-4 py-1 flex items-center justify-between text-[11px] text-white/80 font-mono select-none">
        <div className="flex items-center gap-4">
          <span>Ln {lines.length}, Col 1</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="text-white/60">|</span>
          <span>{language}</span>
        </div>
      </div>
    </div>
  );
};

export default IdeBlock;
export { IdeBlock };
