import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Zap } from 'lucide-react';
import BrandWhatsAppIcon from './icons/BrandWhatsAppIcon';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';
import { QyvoraMark } from './brand/QyvoraMark';
import { usePopupManager } from '../../core/hooks/usePopupManager';

const COMMUNITY_CLOSE_KEY = 'qyvora_community_dismissed';
const COMMUNITY_CLOSE_LEGACY = 'qyvora_community_popup_closed';
const COMMUNITY_JOINED_KEY = 'qyvora_community_joined';

const CommunityPopup: React.FC = () => {
  const [delayReady, setDelayReady] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager('community', 3);

  useEffect(() => {
    const hasJoined = (() => { try { return localStorage.getItem(COMMUNITY_JOINED_KEY); } catch { return null; } })();
    const hasClosed = (() => {
      try {
        return localStorage.getItem(COMMUNITY_CLOSE_KEY) === '1'
          || localStorage.getItem(COMMUNITY_CLOSE_LEGACY) === '1';
      } catch { return false; }
    })();
    if (hasJoined || hasClosed) return;

    const timer = setTimeout(() => setDelayReady(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const isVisible = delayReady && managerVisible;

  useEffect(() => {
    if (!isVisible) return;

    const observer = new MutationObserver(() => {
      const isOtherDialogOpen = !!document.querySelector('[role="dialog"], [data-radix-portal]');
      if (isOtherDialogOpen) managerDismiss();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [isVisible, managerDismiss]);

  const handleClose = () => {
    try { localStorage.setItem(COMMUNITY_CLOSE_KEY, '1'); } catch {}
    managerDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 md:bottom-10 right-4 left-4 md:left-auto md:right-10 z-[145] lg:w-[640px]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row">

            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg/80 transition-all z-20"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-44 sm:h-auto sm:w-52 shrink-0 overflow-hidden bg-bg">
              <QyvoraMark
                aria-label="Community"
                className="w-full h-full object-contain p-8 bg-bg-card transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-bg-card/40 via-transparent to-transparent opacity-0 dark:opacity-60" />

              <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent-dim text-accent shadow-lg">
                <Users className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-bg border-2 border-bg-card">
                  <Zap className="h-2.5 w-2.5 fill-current" />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
              <div>
                <h4 className="text-lg font-black text-text-primary uppercase tracking-tight leading-none mb-1.5">
                  Hacker Community
                </h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#66B870] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
                    Live Operations
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-text-secondary leading-relaxed font-mono opacity-80">
                  Join Africa's elite offensive security circle. Collaborate on missions and learn from the best in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={SITE_CONFIG.social.find(s => s.key === 'whatsapp')?.href || 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    try { localStorage.setItem(COMMUNITY_JOINED_KEY, '1'); } catch {}
                    managerDismiss();
                  }}
                  className="
                    group relative flex-1 flex items-center justify-center gap-2 overflow-hidden
                    rounded-2xl bg-[#66B870] py-3.5 text-[10px] font-black uppercase tracking-widest
                    text-white shadow-lg shadow-[#66B870]/20 transition-all
                    hover:scale-[1.02] hover:shadow-[#66B870]/40 active:scale-[0.98]
                  "
                >
                  <BrandWhatsAppIcon className="h-4 w-4" />
                  <span>Join Now</span>
                </a>

                <button
                  onClick={handleClose}
                  className="
                    px-5 flex items-center justify-center rounded-2xl
                    border border-border bg-transparent py-3
                    text-[10px] font-black uppercase tracking-widest
                    text-text-muted transition-all hover:border-accent/30 hover:text-accent
                  "
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommunityPopup;
