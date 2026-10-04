import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconX } from '@/shared/components/icons';
import BrandWhatsAppIcon from './icons/BrandWhatsAppIcon';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';
import { QyvoraMark } from './brand/QyvoraMark';
import { usePopupManager } from '../../core/hooks/usePopupManager';
import { useAuth } from '../../core/contexts/AuthContext';

const COMMUNITY_CLOSE_KEY = 'qyvora_community_dismissed';
const COMMUNITY_CLOSE_LEGACY = 'qyvora_community_popup_closed';
const COMMUNITY_JOINED_KEY = 'qyvora_community_joined';

/**
 * The promo is an interruption, so it waits for the visitor to actually be
 * engaged: either they have scrolled a real distance into the page, or they have
 * spent a long time reading it. An 8s timer fired while someone was still on the
 * first screen, which is why it felt early and intrusive.
 */
const APPEAR_AFTER_MS = 45_000;
const APPEAR_AFTER_SCROLL_RATIO = 0.6;

/**
 * CommunityPopup — compact public-only nudge into the WhatsApp hacker community.
 *
 * Deliberately a single narrow column (~360px, no image panel): it sits in the
 * corner as a quiet aside rather than a 640px panel competing with the hero.
 */
const CommunityPopup: React.FC = () => {
  const { user } = useAuth();
  const [engaged, setEngaged] = useState(false);

  // Public visitors only. The moment a user signs in the promo must never float
  // over the dashboard mid-session — release the popup slot and disable it.
  const authed = Boolean(user);
  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager(
    'community',
    3,
    !authed,
  );

  useEffect(() => {
    const hasJoined = (() => {
      try {
        return localStorage.getItem(COMMUNITY_JOINED_KEY);
      } catch {
        return null;
      }
    })();
    const hasClosed = (() => {
      try {
        return (
          localStorage.getItem(COMMUNITY_CLOSE_KEY) === '1' ||
          localStorage.getItem(COMMUNITY_CLOSE_LEGACY) === '1'
        );
      } catch {
        return false;
      }
    })();
    if (authed || hasJoined || hasClosed) return;

    // Scroll arm — enough of the page has been read to be worth interrupting.
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= APPEAR_AFTER_SCROLL_RATIO) {
        setEngaged(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Time arm — a short landing page never scrolls, so fall back to dwell time.
    const timer = setTimeout(() => setEngaged(true), APPEAR_AFTER_MS);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [authed]);

  const isVisible = engaged && managerVisible;

  const handleClose = () => {
    try {
      localStorage.setItem(COMMUNITY_CLOSE_KEY, '1');
    } catch {
      /* storage unavailable — dismiss for this session only */
    }
    managerDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-24 right-4 left-4 z-[145] sm:left-auto sm:w-[360px] md:bottom-10 md:right-10"
        >
          <div className="pointer-events-auto relative overflow-hidden rounded-2xl border border-border bg-bg-card p-5">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 rounded-lg p-1.5 text-text-muted transition-[color,background-color] hover:bg-bg-elevated hover:text-text-primary"
              aria-label="Dismiss"
            >
              <IconX size={16} />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent-dim">
                <QyvoraMark aria-label="Community" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h4 className="text-sm font-black uppercase tracking-tight text-text-primary">
                  {"Hacker Community"}
                </h4>
                <span className="type-meta inline-flex items-center gap-2 text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {"Live Operations"}
                </span>
              </div>
            </div>

            <p className="type-body-sm mt-3 text-text-secondary">
              {"Join the offensive security circle — missions, labs and operators, in real time."}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <a
                href={
                  SITE_CONFIG.social.find((s) => s.key === 'whatsapp')?.href ||
                  'https://whatsapp.com/channel/0029Vb8Aw6L5EjxzLY6L2m1V'
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    localStorage.setItem(COMMUNITY_JOINED_KEY, '1');
                  } catch {
                    /* storage unavailable */
                  }
                  managerDismiss();
                }}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-on-accent bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-on-accent transition-[filter] hover:brightness-110"
              >
                <BrandWhatsAppIcon className="h-4 w-4" />
                {"Join Now"}
              </a>
              <button
                onClick={handleClose}
                className="min-h-[44px] rounded-xl border border-border px-4 py-2 text-xs font-black uppercase tracking-widest text-text-muted transition-[color,border-color] hover:border-accent/50 hover:text-accent"
              >
                {"Dismiss"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommunityPopup;