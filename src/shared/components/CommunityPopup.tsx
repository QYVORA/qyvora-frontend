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
    const hasJoined = localStorage.getItem('qyvora_community_joined');
    const hasClosed = localStorage.getItem('qyvora_community_popup_closed');
    
    if (hasJoined || hasClosed) return;

    // Show after 30 seconds for all users (guests and students)
    const timer = setTimeout(() => {
      // Check if any other modal/dialog is already open to prevent clutter
      const isOtherDialogOpen = !!document.querySelector('[role="dialog"], [data-radix-portal]');
      if (!isOtherDialogOpen) {
        setIsVisible(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Monitor for other dialogs while visible - if one opens, hide this popup
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      const isOtherDialogOpen = !!document.querySelector('[role="dialog"], [data-radix-portal]');
      if (isOtherDialogOpen) {
        setIsVisible(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // Persist closed state for 7 days (simplified logic using localStorage)
    localStorage.setItem('qyvora_community_popup_closed', '1');
  };

  const handleJoin = () => {
    localStorage.setItem('qyvora_community_joined', '1');
    setIsVisible(false);
    const whatsappUrl = SITE_CONFIG.social.find(s => s.key === 'whatsapp')?.href || 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5';
    window.open(whatsappUrl, '_blank', 'noreferrer');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 md:bottom-10 right-4 left-4 md:left-auto md:right-10 z-[145] lg:w-[520px]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-bg-card/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row">
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/30 transition-all z-20"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Section - Broad Horizontal Design */}
            <div className="relative h-44 sm:h-auto sm:w-52 shrink-0 overflow-hidden bg-bg">
              <img
                src="/qyvora-single-logo.png"
                alt="Community"
                className="w-full h-full object-contain p-8 bg-bg-card transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-bg-card/40 via-transparent to-transparent opacity-0 dark:opacity-60" />
              
              {/* Icon badge */}
              <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent-dim text-accent shadow-lg">
                <Users className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-bg border-2 border-bg-card">
                  <Zap className="h-2.5 w-2.5 fill-current" />
                </div>
              </div>
            </div>

            {/* Content Section */}
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
                <button
                  onClick={handleJoin}
                  className="
                    group relative flex-1 flex items-center justify-center gap-2 overflow-hidden
                    rounded-2xl bg-[#66B870] py-3.5 text-[10px] font-black uppercase tracking-[0.15em]
                    text-white shadow-lg shadow-[#66B870]/20 transition-all
                    hover:scale-[1.02] hover:shadow-[#66B870]/40 active:scale-[0.98]
                  "
                >
                  <BrandWhatsAppIcon className="h-4 h-4" />
                  <span>Join Now</span>
                </button>
                
                <button
                  onClick={handleClose}
                  className="
                    px-5 flex items-center justify-center rounded-2xl
                    border border-border bg-transparent py-3
                    text-[9px] font-black uppercase tracking-[0.2em]
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
