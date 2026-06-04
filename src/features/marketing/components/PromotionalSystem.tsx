import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { openServiceRequestModal } from './ServiceRequestModal';

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
    image: '/assets/sections/bootcamps/hacker-protocol.webp', // Bootcamp image
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
    image: '/assets/sections/services/standard-package.webp', // Services image
    color: 'accent',
  },
];

const PromotionalSystem: React.FC = () => {
  const { user } = useAuth();
  const [activePromo, setActivePromo] = useState<typeof PROMOTIONS[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show to non-logged in users
    if (user) return;

    // Check if dismissed in this session (or for 24h)
    const dismissed = localStorage.getItem('hsociety_promo_dismissed');
    if (dismissed) {
      return;
    }

    // Wait 15 seconds before showing a random promo
    const timer = setTimeout(() => {
      const randomPromo = PROMOTIONS[Math.floor(Math.random() * PROMOTIONS.length)];
      setActivePromo(randomPromo);
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [user]);

  if (user || !isVisible || !activePromo) return null;

  const handleDismiss = () => {
    localStorage.setItem('hsociety_promo_dismissed', '1');
    setIsVisible(false);
  };

  const handleCta = () => {
    if (activePromo.action) {
      activePromo.action();
    } else if (activePromo.href) {
      const el = document.querySelector(activePromo.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 md:bottom-8 z-[140]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg/80 transition-colors z-20"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Image */}
            <div className="relative h-32 overflow-hidden bg-bg">
              <img
                src={activePromo.image}
                alt={activePromo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 to-transparent" />
              
              {/* Icon badge */}
              <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-bg-card/80 backdrop-blur-sm text-accent">
                <activePromo.icon className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-sm font-black text-text-primary uppercase tracking-tight mb-1">
                {activePromo.title}
              </h4>
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">
                {activePromo.subtitle}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {activePromo.description}
              </p>

              <button
                onClick={handleCta}
                className="w-full px-4 py-2.5 rounded-xl bg-accent text-bg font-bold uppercase tracking-wider text-[10px] transition-all hover:brightness-110 hover:shadow-[0_4px_16px_rgba(var(--color-accent-rgb),0.3)] active:scale-95"
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
