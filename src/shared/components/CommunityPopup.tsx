import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Zap, MessageSquare } from 'lucide-react';
import BrandWhatsAppIcon from './icons/BrandWhatsAppIcon';
import { SITE_CONFIG } from '../../features/marketing/content/siteConfig';

/**
 * CommunityPopup
 * ─────────────────────────────────────────────────────────────────────────────
 * A non-intrusive floating popup that invites all users to join the 
 * WhatsApp community. Appears after a delay and persists its closed state.
 */
const CommunityPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already interacted
    const hasJoined = localStorage.getItem('hsociety_community_joined');
    const hasClosed = localStorage.getItem('hsociety_community_popup_closed');
    
    if (hasJoined || hasClosed) return;

    // Show after 30 seconds for all users (guests and students)
    const timer = setTimeout(() => setIsVisible(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Persist closed state for 7 days (simplified logic using localStorage)
    localStorage.setItem('hsociety_community_popup_closed', '1');
  };

  const handleJoin = () => {
    localStorage.setItem('hsociety_community_joined', '1');
    setIsVisible(false);
    const whatsappUrl = SITE_CONFIG.social.find(s => s.key === 'whatsapp')?.href || 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5';
    window.open(whatsappUrl, '_blank', 'noreferrer');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 md:bottom-10 right-4 left-4 md:left-auto md:right-10 z-[145] md:w-96"
        >
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-bg-card/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(var(--color-accent-rgb),0.1)]">
            
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/30 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent-dim text-accent">
                  <Users className="h-7 w-7" />
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-bg">
                    <Zap className="h-2.5 w-2.5 fill-current" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-black text-text-primary uppercase tracking-tight leading-none mb-1.5">
                    Hacker Community
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
                      Live Operations
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-text-secondary leading-relaxed font-mono">
                  Join Africa's elite offensive security circle. Get real-time updates, collaborate on missions, and learn from the best.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleJoin}
                  className="
                    group relative flex w-full items-center justify-center gap-3 overflow-hidden
                    rounded-2xl bg-[#25D366] py-4 text-xs font-black uppercase tracking-[0.15em]
                    text-white shadow-lg shadow-[#25D366]/20 transition-all
                    hover:scale-[1.02] hover:shadow-[#25D366]/40 active:scale-[0.98]
                  "
                >
                  <BrandWhatsAppIcon className="h-5 w-5" />
                  <span>Join the Community</span>
                </button>
                
                <button
                  onClick={handleClose}
                  className="
                    flex w-full items-center justify-center gap-2 rounded-2xl
                    border border-border bg-transparent py-3
                    text-[9px] font-black uppercase tracking-[0.2em]
                    text-text-muted transition-all hover:border-accent/30 hover:text-accent
                  "
                >
                  Maybe later
                </button>
              </div>
            </div>

            {/* Bottom Tech Bar */}
            <div className="bg-accent/5 border-t border-accent/10 px-6 py-2 flex items-center justify-between">
              <span className="text-[8px] font-mono text-accent/50 uppercase tracking-[0.2em]">Comm-Link: Active</span>
              <MessageSquare className="h-3 w-3 text-accent/30" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommunityPopup;
