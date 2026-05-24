import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Shield, Rocket, GraduationCap } from 'lucide-react';
import { CardBase } from '../../../shared/components/ui/Card';
import { useAuth } from '../../../core/contexts/AuthContext';
import { openServiceRequestModal } from './ServiceRequestModal';

const PROMOTIONS = [
  {
    id: 'bootcamp-promo',
    type: 'bootcamp',
    title: 'Hacker Protocol Bootcamp',
    subtitle: 'Next-Gen Offensive Security',
    description: 'Master advanced penetration testing techniques with our flagship bootcamp.',
    cta: 'Explore Bootcamp',
    href: '#bootcamps',
    icon: GraduationCap,
    color: 'accent',
  },
  {
    id: 'services-promo',
    type: 'service',
    title: 'Security Assessment',
    subtitle: 'Professional Web Pentesting',
    description: 'Protect your infrastructure with our high-end application security audits.',
    cta: 'Get Started',
    action: () => openServiceRequestModal('Standard Package'),
    icon: Shield,
    color: 'accent',
  },
  {
    id: 'market-promo',
    type: 'market',
    title: 'Zero-Day Market',
    subtitle: 'Exclusive CP Offerings',
    description: 'Redeem your Cyber Points for high-value exploits and research papers.',
    cta: 'Visit Market',
    href: '#market',
    icon: Rocket,
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

    // Wait 10 seconds before showing a random promo
    const timer = setTimeout(() => {
      const randomPromo = PROMOTIONS[Math.floor(Math.random() * PROMOTIONS.length)];
      setActivePromo(randomPromo);
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [user]);

  if (user || !isVisible || !activePromo) return null;

  const handleCta = () => {
    if (activePromo.action) {
      activePromo.action();
    } else if (activePromo.href) {
      const el = document.querySelector(activePromo.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
          className="fixed bottom-24 md:bottom-8 left-6 right-6 md:right-auto md:w-80 z-[140]"
        >
          <CardBase className="border-accent/30 shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.15)] bg-bg-card/90 backdrop-blur-md">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 p-1 rounded-md text-text-muted hover:text-accent hover:bg-accent-dim/50 transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-dim text-accent">
                  <activePromo.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-text-primary uppercase tracking-tight">
                    {activePromo.title}
                  </h4>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                  {activePromo.subtitle}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {activePromo.description}
                </p>
              </div>

              <button
                onClick={handleCta}
                className="w-full btn-primary !py-2.5 !text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(var(--color-accent-rgb),0.2)]"
              >
                {activePromo.cta}
              </button>
            </div>
          </CardBase>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionalSystem;
