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
    image: '/assets/bootcamp/hpb-cover.webp', // Updated correct bootcamp image
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
    const dismissed = localStorage.getItem('qyvora_promo_dismissed');
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
    localStorage.setItem('qyvora_promo_dismissed', '1');
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
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-4 right-4 sm:left-6 sm:right-auto md:bottom-10 z-[140] lg:w-[600px]"
        >
          <div className="relative overflow-hidden rounded-3xl bg-bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row">
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg/80 transition-all z-20"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Section - Vertical on Mobile, Horizontal on Desktop */}
            <div className="relative h-48 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-bg">
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
              <h4 className="text-base font-black text-text-primary uppercase tracking-tight mb-1">
                {activePromo.title}
              </h4>
              <p className="text-[11px] font-bold text-accent uppercase tracking-wider mb-3">
                {activePromo.subtitle}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed mb-6 font-mono opacity-80">
                {activePromo.description}
              </p>

              <button
                onClick={handleCta}
                className="w-full sm:w-fit px-7 py-3.5 rounded-2xl bg-accent text-bg font-bold uppercase tracking-widest text-[11px] transition-all hover:brightness-110 hover:shadow-[0_8px_20px_rgba(var(--color-accent-rgb),0.3)] active:scale-95"
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
