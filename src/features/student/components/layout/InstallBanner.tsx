import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { IconDownload, IconX } from '@/shared/components/icons';
import { isInstallable, showInstallPrompt } from '../../services/pwa';
import { usePopupManager } from '@/core/hooks/usePopupManager';

const DISMISS_KEY = 'qyvora_install_dismissed';

const InstallBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
  const [installing, setInstalling] = useState(false);
  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager('install', 5);

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setDismissed(true);
    managerDismiss();
  };

  const handleInstall = async () => {
    if (installing) return;
    setInstalling(true);
    const accepted = await showInstallPrompt();
    setInstalling(false);
    if (accepted) handleDismiss();
  };

  return (
    <AnimatePresence>
      {isInstallable() && !dismissed && managerVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[140]"
        >
          <div className="bg-bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                {installing ? (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                ) : (
                  <IconDownload size={20} className="text-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary">Install QYVORA</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {installing ? 'Opening install dialog…' : 'Add to home screen for faster access.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="px-3 py-1.5 rounded-2xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {installing ? 'Installing…' : 'Install'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg/80 transition-all"
                  aria-label="Dismiss"
                >
                  <IconX size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner;
