import { Copy } from 'lucide-react';

const CodeBlockRenderer: React.FC<{ text: string }> = ({ text }) => {
  const codePattern = /`([^`]+)`/g;
  const parts: Array<{ type: 'text' | 'code'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  if (parts.length === 0 || (parts.length === 1 && parts[0].type === 'text')) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return (
            <span key={idx} className="relative inline-block group/code mx-0.5">
              <code className="inline-block bg-bg border border-border rounded px-2 py-0.5 font-mono text-sm text-accent">
                {part.content}
              </code>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(part.content);
                }}
                className="absolute -top-1 -right-1 opacity-0 group-hover/code:opacity-100 transition-opacity
                           p-1 rounded border border-border bg-bg-card hover:border-accent/40 hover:text-accent"
                title="Copy code"
              >
                <Copy className="h-2.5 w-2.5" />
              </button>
            </span>
          );
        }
        return <span key={idx}>{part.content}</span>;
      })}
    </>
  );
};

export default CodeBlockRenderer;
