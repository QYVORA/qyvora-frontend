import { useTranslation } from 'react-i18next';
import { Unplug, Loader2 } from 'lucide-react';
import { IconTerminal } from '@/shared/components/icons';
import { useLabConnection } from '@/features/student/hooks/useLabConnection';

interface LabConnectButtonProps {
  labId: string;
  scenarioId: string;
}

export function LabConnectButton({ labId, scenarioId }: LabConnectButtonProps) {
  const { t } = useTranslation();
  const { connection, isConnected, isLoading, error, connect, disconnect } = useLabConnection();

  const handleConnect = async () => {
    await connect(labId, scenarioId);
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-[9px] font-black uppercase tracking-widest text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {connection?.targetIp ?? t('components.labConnectButton.connected')}
          </span>
          <button
            onClick={disconnect}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unplug className="w-3 h-3" />}
            {t('components.labConnectButton.disconnect')}
          </button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <IconTerminal size={12} />}
          {t('components.labConnectButton.connect')}
        </button>
      )}
      {error && (
        <span className="text-[9px] text-red-400">{error}</span>
      )}
    </div>
  );
}
