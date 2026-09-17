import { RefreshCw } from 'lucide-react';

interface SyncIndicatorProps {
  lastSync: string | null;
  error?: string;
  onRetry?: () => void;
}

const SyncIndicator = ({ lastSync, error, onRetry }: SyncIndicatorProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className={`flex items-center gap-1.5 text-xs ${error ? 'text-danger' : 'text-text-muted'}`}>
        <RefreshCw className="h-3 w-3 shrink-0" />
        {error || (lastSync
          ? `Last updated: ${lastSync}`
          : "No data yet")}
      </p>
      {error && onRetry && (
        <button onClick={onRetry} className="text-xs font-bold text-accent hover:underline">
          {"Retry"}
        </button>
      )}
    </div>
  );
};

export default SyncIndicator;