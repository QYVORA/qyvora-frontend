import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { isInstallable, showInstallPrompt } from '../../services/pwa';

const InstallBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable() || dismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-bg-card border border-border rounded-xl p-4 shadow-xl shadow-black/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary">Install QYVORA</p>
          <p className="text-xs text-text-muted mt-0.5">Add to home screen for faster access.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={async () => {
              const accepted = await showInstallPrompt();
              if (accepted) setDismissed(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-accent text-bg text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
