import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { usePopupManager } from '../../../core/hooks/usePopupManager';
import { openServiceRequestModal } from './ServiceRequestModal';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';
import standardPackageImg from '@/assets/sections/services/standard-package.webp';

const PROMO_DISMISS_KEY = 'qyvora_promo_dismissed';

const PROMOTIONS = [
  {
    id: 'bootcamp-promo',
    type: 'bootcamp',
    title: 'Hacker Protocol',
    subtitle: 'Next-Gen Offensive Security Training',
    description: 'Master advanced penetration testing with hands-on bootcamps.',
    cta: 'Explore Bootcamp',
    href: '#bootcamps',
    icon: GraduationCap,
    image: hpbCoverImg,
    color: 'accent',
  },
  {
    id: 'services-promo',
    type: 'service',
    title: 'Web Pentesting',
    subtitle: 'Professional Security Audits',
    description: 'Protect your apps with our comprehensive penetration testing services.',
    cta: 'Request Assessment',
    action: () => openServiceRequestModal('Standard WebApp Pentest'),
    icon: Shield,
    image: standardPackageImg,
    color: 'accent',
  },
];

const PromotionalSystem: React.FC = () => {
  const { user } = useAuth();
  const [activePromo, setActivePromo] = useState<typeof PROMOTIONS[0] | null>(null);
  const [delayReady, setDelayReady] = useState(false);

  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager('promotional', 4);

  useEffect(() => {
    if (user) return;
    const dismissed = (() => { try { return localStorage.getItem(PROMO_DISMISS_KEY); } catch { return null; } })();
    if (dismissed) return;

    const timer = setTimeout(() => {
      setActivePromo(PROMOTIONS[Math.floor(Math.random() * PROMOTIONS.length)]);
      setDelayReady(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [user]);

  const isVisible = !user && delayReady && managerVisible && !!activePromo;

  const handleDismiss = () => {
    try { localStorage.setItem(PROMO_DISMISS_KEY, '1'); } catch {}
    managerDismiss();
  };

  const handleCta = () => {
    if (activePromo?.action) {
      activePromo.action();
    } else if (activePromo?.href) {
      const el = document.querySelector(activePromo.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto md:bottom-10 z-[140] lg:w-[600px]"
        >
          <div className="relative overflow-hidden rounded-2xl bg-bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row border border-border">
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg/80 transition-all z-20"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Section - Vertical on Mobile, Horizontal on Desktop */}
            <div className="relative h-36 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-bg">
              <img
                src={activePromo.image}
                alt={activePromo.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Icon badge */}
              <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-bg shadow-lg">
                <activePromo.icon className="w-5 h-5" />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-7 flex flex-col justify-center flex-1">
              <h4 className="text-base font-black text-text-primary uppercase tracking-tight mb-1 break-words">
                {activePromo.title}
              </h4>
              <p className="text-[11px] font-bold text-accent uppercase tracking-wider mb-3 break-words">
                {activePromo.subtitle}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed mb-6 font-mono opacity-80">
                {activePromo.description}
              </p>

              <button
                onClick={handleCta}
                className="w-full sm:w-fit px-7 py-3.5 rounded-2xl bg-accent text-bg font-black uppercase tracking-widest text-[10px] transition-all hover:brightness-110 hover:shadow-[0_8px_20px_rgba(var(--color-accent-rgb),0.3)] active:scale-95"
              >
                {activePromo.cta}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionalSystem;
