import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { CardMedia } from '@/shared/components/ui/Card';
import { CardGrid } from '@/shared/components/card-grid';
import { openServiceRequestModal } from '../ServiceRequestModal';

const SERVICES_DATA = [
  {
    id: 'basic-pentest',
    title: 'Basic Web-App Pentesting',
    price: 'GH₵ 4,000+',
    subtitle: 'Essential Security Audit',
    image: '/assets/sections/services/basic-package.webp',
    features: [
      'OWASP Top 10 Coverage',
      'Authentication Testing',
      'XSS & SQLi Discovery',
      'Vulnerability Report',
    ],
    accent: false,
  },
  {
    id: 'standard-pentest',
    title: 'Standard Penetration Test',
    price: 'GH₵ 8,000+',
    subtitle: 'Full Stack Assessment',
    image: '/assets/sections/services/standard-package.webp',
    features: [
      'Authenticated Pentesting',
      'Business Logic Analysis',
      'IDOR & JWT Security',
      'Remediation Retest',
    ],
    accent: true,
  },
];

const LandingServicesSection: React.FC = () => {
  return (
    <CardGrid
      slides={SERVICES_DATA}
      cols={2}
      renderCard={(s) => (
        <CardMedia
          image={s.image}
          imageAspect="aspect-video"
          imageBadges={
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
              <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-bg-card/90 dark:backdrop-blur-xl backdrop-blur-none dark:border border-white/10 border-none rounded-xl dark:shadow-2xl shadow-none">
                <span className="text-sm sm:text-base font-black text-accent uppercase tracking-widest whitespace-nowrap">
                  {s.price}
                </span>
              </div>
            </div>
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
              {s.subtitle}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-text-primary uppercase tracking-tight leading-tight mb-3">
            {s.title}
          </h3>

          <div className="space-y-1 mb-4">
            {s.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent/60 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-text-secondary leading-normal font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-auto">
            <button
              onClick={() => openServiceRequestModal(s.title)}
              className="w-full px-5 py-2.5 bg-accent text-bg rounded-xl font-black uppercase tracking-[0.15em] text-[11px] sm:text-xs transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent/10 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Request Assessment
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 opacity-40">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
              <span className="text-[9px] sm:text-[10px] font-bold text-text-muted uppercase tracking-widest">
                ISO COMPLIANT
              </span>
            </div>
          </div>
        </CardMedia>
      )}
    />
  );
};

export default React.memo(LandingServicesSection);
