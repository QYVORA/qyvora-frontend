import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { IconX } from '@/shared/components/icons';
import { Users, Zap } from 'lucide-react';
import BrandWhatsAppIcon from './icons/BrandWhatsAppIcon';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';
import { QyvoraMark } from './brand/QyvoraMark';
import { usePopupManager } from '../../core/hooks/usePopupManager';
import { useAuth } from '../../core/contexts/AuthContext';

const COMMUNITY_CLOSE_KEY = 'qyvora_community_dismissed';
const COMMUNITY_CLOSE_LEGACY = 'qyvora_community_popup_closed';
const COMMUNITY_JOINED_KEY = 'qyvora_community_joined';
const APPEAR_DELAY_MS = 8000;

const CommunityPopup: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [delayReady, setDelayReady] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Public visitors only. The moment a user signs in the promo must never float
  // over the dashboard mid-session — release the popup slot and disable it.
  const authed = Boolean(user);
  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager('community', 3, !authed);

  useEffect(() => {
    const hasJoined = (() => { try { return localStorage.getItem(COMMUNITY_JOINED_KEY); } catch { return null; } })();
    const hasClosed = (() => {
      try {
        return localStorage.getItem(COMMUNITY_CLOSE_KEY) === '1'
          || localStorage.getItem(COMMUNITY_CLOSE_LEGACY) === '1';
      } catch { return false; }
    })();
    if (authed || hasJoined || hasClosed) return;

    const timer = setTimeout(() => setDelayReady(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [authed]);

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
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card flex flex-col sm:flex-row">

            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg/80 transition-[color,background-color] z-20"
              aria-label="Dismiss"
            >
              <IconX size={16} />
            </button>

            <div className="relative h-44 sm:h-auto sm:w-52 shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-r border-border/50 bg-bg-alt">
              <QyvoraMark
                aria-label="Community"
                className="w-full h-full object-contain p-8 bg-bg-alt transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent-dim text-accent">
                <Users className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-on-accent border-2 border-bg-card">
                  <Zap className="h-2.5 w-2.5 fill-current" />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
              <div>
                <h4 className="text-lg font-black text-text-primary uppercase tracking-tight leading-none mb-1.5">
                  {t('components.community.title')}
                </h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
                    {t('components.community.liveOps')}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-text-secondary leading-relaxed font-mono opacity-80">
                  {t('components.community.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={SITE_CONFIG.social.find(s => s.key === 'whatsapp')?.href || 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5'}
                  target="_blank"
                   rel="noopener noreferrer"
                  onClick={() => {
                    try { localStorage.setItem(COMMUNITY_JOINED_KEY, '1'); } catch {}
                    managerDismiss();
                  }}
                  className="
                    group relative flex-1 flex items-center justify-center gap-2 overflow-hidden
                    rounded-2xl bg-accent py-3.5 text-[10px] font-black uppercase tracking-widest
                    text-on-accent transition-[background-color] hover:bg-accent/90
                  "
                >
                  <BrandWhatsAppIcon className="h-4 w-4" />
                  <span>{t('components.community.joinNow')}</span>
                </a>

                <button
                  onClick={handleClose}
                  className="
                    px-5 flex items-center justify-center rounded-2xl
                    border border-border bg-transparent py-3
                    text-[10px] font-black uppercase tracking-widest
                    text-text-muted transition-[color,border-color] hover:border-accent/50 hover:text-accent
                  "
                >
                  {t('button.dismiss')}
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
