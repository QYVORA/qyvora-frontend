import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { useToast } from '@/core/contexts/ToastContext';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        addToast(t('toast.copyFailed'), 'error');
      });
  };

  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                 px-2.5 py-1.5 rounded-lg border border-border bg-bg-card text-xs font-bold
                 hover:border-accent/40 hover:text-accent active:scale-95 flex items-center gap-1.5 z-10"
      title={t('button.copyToClipboard')}
    >
      {copied ? (
        <><IconCheck size={12} />{t('button.copied')}</>
      ) : (
        <><Copy className="h-3 w-3" />{t('button.copy')}</>
      )}
    </button>
  );
};

export default CopyButton;
