import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/core/contexts/ToastContext';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        addToast('Failed to copy', 'error');
      });
  };

  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                 px-2.5 py-1.5 rounded-lg border border-border bg-bg-card text-xs font-bold
                 hover:border-accent/40 hover:text-accent flex items-center gap-1.5 z-10"
      title="Copy to clipboard"
    >
      {copied ? (
        <><Check className="h-3 w-3" />Copied</>
      ) : (
        <><Copy className="h-3 w-3" />Copy</>
      )}
    </button>
  );
};

export default CopyButton;
