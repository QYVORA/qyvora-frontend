import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { IconShield, IconInfo, IconX } from '@/shared/components/icons';
import { getCookiePreferences, setCookiePreferences, type CookiePreferences } from '../utils/storageConsent';
import { usePopupManager } from '../../core/hooks/usePopupManager';

const CONSENT_DISMISS_KEY = 'qyvora_consent_dismissed';
const CONSENT_DISMISS_LEGACY = 'qyvora_cookie_dismissed';

const ConsentBanner: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const existing = useMemo(() => getCookiePreferences(), []);
  const dismissed = useMemo(() => {
    try {
      return localStorage.getItem(CONSENT_DISMISS_KEY) === '1'
        || localStorage.getItem(CONSENT_DISMISS_LEGACY) === '1';
    } catch { return false; }
  }, []);
  const needsConsent = !existing && !dismissed;

  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager('consent-banner', 1);

  const [delayReady, setDelayReady] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Omit<CookiePreferences, 'consentedAt'>>({
    strictly_necessary: true,
    functional: true,
    analytics: true,
  });

  useEffect(() => {
    if (!needsConsent) return;
    const timer = setTimeout(() => setDelayReady(true), 1500);
    return () => clearTimeout(timer);
  }, [needsConsent]);

  const isVisible = needsConsent && delayReady && managerVisible;

  const handleAcceptAll = () => {
    setCookiePreferences({ strictly_necessary: true, functional: true, analytics: true });
    managerDismiss();
  };

  const handleDismiss = () => {
    try { localStorage.setItem(CONSENT_DISMISS_KEY, '1'); } catch {}
    managerDismiss();
  };

  const handleSavePreferences = () => {
    setCookiePreferences(prefs);
    managerDismiss();
  };

  const toggleCategory = (cat: keyof typeof prefs) => {
    if (cat === 'strictly_necessary') return;
    setPrefs(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto z-[150] md:max-w-2xl sm:max-w-lg w-full"
        >
          <div className="bg-bg-card/95 backdrop-blur-xl border-t sm:border border-border rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent flex-none">
                <IconShield size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider mb-1.5">
                  {t('components.consent.title')}
                </h3>
                <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
                  {t('components.consent.description')}
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg/80 transition-all"
                aria-label="Dismiss"
              >
                <IconX size={16} />
              </button>
            </div>

            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-3 mb-6 pt-4 border-t border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-text-primary uppercase tracking-wide">{t('components.consent.strictlyNecessary')}</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted">{t('components.consent.strictlyNecessaryDesc')}</div>
                  </div>
                  <div className="w-9 h-5 bg-accent/40 rounded-full relative opacity-50 cursor-not-allowed">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleCategory('functional')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCategory('functional'); } }}
                  role="switch"
                  aria-checked={prefs.functional}
                  tabIndex={0}
                >
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-text-primary uppercase tracking-wide group-hover:text-accent transition-colors">{t('components.consent.functional')}</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted">{t('components.consent.functionalDesc')}</div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${prefs.functional ? 'bg-accent' : 'bg-border'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${prefs.functional ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleCategory('analytics')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCategory('analytics'); } }}
                  role="switch"
                  aria-checked={prefs.analytics}
                  tabIndex={0}
                >
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-text-primary uppercase tracking-wide group-hover:text-accent transition-colors">{t('components.consent.analytics')}</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted">{t('components.consent.analyticsDesc')}</div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${prefs.analytics ? 'bg-accent' : 'bg-border'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${prefs.analytics ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              {showDetails ? (
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-accent text-bg font-black uppercase tracking-widest text-[10px] transition-all hover:brightness-110 active:scale-95"
                >
                  {t('components.consent.saveChoices')}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-accent text-bg font-black uppercase tracking-widest text-[10px] transition-all hover:brightness-110 active:scale-95"
                  >
                    {t('components.consent.acceptAll')}
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-bg border border-border text-text-primary font-black uppercase tracking-widest text-[10px] transition-all hover:border-accent/40 hover:bg-accent-dim/20 active:scale-95 inline-flex items-center justify-center gap-2"
                  >
                    <IconInfo size={14} /> {t('components.consent.customize')}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ConsentBanner.displayName = 'ConsentBanner';

export default ConsentBanner;
