import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { getCookiePreferences, setCookiePreferences, type CookiePreferences } from '../utils/storageConsent';

/**
 * CookieConsent
 * ─────────────────────────────────────────────────────────────────────────────
 * A non-intrusive, clean cookie consent banner that appears at the bottom
 * of the screen for users who haven't made a choice.
 * 
 * Design: Clean, modern, matches qyvora colors but avoids terminal ASCII.
 */
const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Omit<CookiePreferences, 'consentedAt'>>({
    strictly_necessary: true,
    functional: true,
    analytics: true,
  });

  useEffect(() => {
    // Show after a short delay if no choice exists
    const existing = getCookiePreferences();
    const dismissed = localStorage.getItem('qyvora_cookie_dismissed');
    if (!existing && !dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookiePreferences({ strictly_necessary: true, functional: true, analytics: true });
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // If they just close it, we still want to remember they saw it.
    // We'll set a "dismissed" flag in localStorage.
    localStorage.setItem('qyvora_cookie_dismissed', '1');
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setCookiePreferences(prefs);
    setIsVisible(false);
  };

  const toggleCategory = (cat: keyof typeof prefs) => {
    if (cat === 'strictly_necessary') return; // Cannot toggle
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
          className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto z-[150] md:max-w-xl sm:max-w-md w-full"
        >
          <div className="bg-bg-card/95 backdrop-blur-xl border-t sm:border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent flex-none">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider mb-1.5">
                  Privacy & Cookies
                </h3>
                <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">
                  We use cookies to secure your session and optimize performance. No 3rd-party tracking.
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-text-muted hover:text-text-primary transition-colors p-1"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
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
                    <div className="text-[10px] sm:text-xs font-bold text-text-primary uppercase tracking-wide">Strictly Necessary</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted">Authentication & Security (Always Required)</div>
                  </div>
                  <div className="w-9 h-5 bg-accent/40 rounded-full relative opacity-50 cursor-not-allowed">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleCategory('functional')}>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-text-primary uppercase tracking-wide group-hover:text-accent transition-colors">Functional</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted">Remembers your theme and UI preferences</div>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${prefs.functional ? 'bg-accent' : 'bg-border'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${prefs.functional ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleCategory('analytics')}>
                  <div>
                    <div className="text-[10px] sm:text-xs font-bold text-text-primary uppercase tracking-wide group-hover:text-accent transition-colors">Analytics</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted">Anonymized performance and caching</div>
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-bg font-bold uppercase tracking-wider text-[10px] transition-all hover:brightness-110 active:scale-95"
                >
                  Save My Choices
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-bg font-bold uppercase tracking-wider text-[10px] transition-all hover:brightness-110 active:scale-95"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-bg border border-border text-text-primary font-bold uppercase tracking-wider text-[10px] transition-all hover:border-accent/40 hover:bg-accent-dim/20 active:scale-95 inline-flex items-center justify-center gap-2"
                  >
                    <Info className="w-3.5 h-3.5" /> Customize
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
