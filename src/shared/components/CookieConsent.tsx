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
 * Design: Clean, modern, matches hsociety colors but avoids terminal ASCII.
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
    const dismissed = localStorage.getItem('hsociety_cookie_dismissed');
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
    localStorage.setItem('hsociety_cookie_dismissed', '1');
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
          className="fixed bottom-0 left-0 right-0 md:bottom-10 md:right-10 md:left-auto z-[150] md:w-96 w-full"
        >
          <div className="bg-bg-card border-t md:border border-border rounded-t-3xl md:rounded-2xl shadow-2xl p-6 md:p-10 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-8">
              <div className="p-3 rounded-xl bg-accent-dim/20 text-accent flex-none hidden md:block">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-accent md:hidden" />
                  <h3 className="text-sm md:text-base font-bold text-text-primary uppercase tracking-widest">
                    Privacy & Cookies
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                  We use cookies to secure your session, remember your theme, and optimize performance. We never use 3rd-party tracking or external pixels.
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showDetails && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 mb-8 pt-4 border-t border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-text-primary uppercase tracking-wider">Strictly Necessary</div>
                    <div className="text-[10px] md:text-xs text-text-muted">Authentication & Security (Always Required)</div>
                  </div>
                  <div className="w-10 h-5 bg-accent/40 rounded-full relative opacity-50 cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleCategory('functional')}>
                  <div>
                    <div className="text-xs font-bold text-text-primary uppercase tracking-wider group-hover:text-accent transition-colors">Functional</div>
                    <div className="text-[10px] md:text-xs text-text-muted">Remembers your theme and UI preferences</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${prefs.functional ? 'bg-accent' : 'bg-border'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.functional ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleCategory('analytics')}>
                  <div>
                    <div className="text-xs font-bold text-text-primary uppercase tracking-wider group-hover:text-accent transition-colors">Analytics</div>
                    <div className="text-[10px] md:text-xs text-text-muted">Anonymized performance and landing page caching</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${prefs.analytics ? 'bg-accent' : 'bg-border'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prefs.analytics ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {showDetails ? (
                <button 
                  onClick={handleSavePreferences}
                  className="flex-1 btn-primary !py-3 text-xs font-bold uppercase tracking-widest"
                >
                  Save My Choices
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleAcceptAll}
                    className="flex-1 btn-primary !py-3 text-xs font-bold uppercase tracking-widest"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="flex-1 btn-secondary !py-3 text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" /> Customize
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
