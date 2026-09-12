import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';

interface SyncIndicatorProps {
  lastSync: string | null;
  error?: string;
  onRetry?: () => void;
}

const SyncIndicator = ({ lastSync, error, onRetry }: SyncIndicatorProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-3">
      <p className={`flex items-center gap-1.5 text-[11px] ${error ? 'text-danger' : 'text-text-muted'}`}>
        <RefreshCw className="h-3 w-3 shrink-0" />
        {error || (lastSync
          ? t('components.syncIndicator.lastUpdated', { time: lastSync })
          : t('components.syncIndicator.noData'))}
      </p>
      {error && onRetry && (
        <button onClick={onRetry} className="text-[11px] font-bold text-accent hover:underline">
          {t('components.syncIndicator.retry')}
        </button>
      )}
    </div>
  );
};

export default SyncIndicator;