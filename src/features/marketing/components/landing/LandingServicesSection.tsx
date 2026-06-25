import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { SharedCarousel } from '@/shared/components/carousel';
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
    <SharedCarousel
      slides={SERVICES_DATA}
      getImage={(s) => s.image}
      getImageAlt={(s) => s.title}
      cardClassName="min-h-[320px] sm:min-h-[360px] lg:min-h-[380px] xl:min-h-[420px]"
      imageHeightClasses="h-[200px] sm:h-[260px] lg:h-auto"
      containerClassName="w-full md:h-screen md:overflow-hidden flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 py-20 sm:py-24 md:py-20 lg:pt-36 xl:pt-40 lg:pb-20"
      renderImageOverlay={(s) => (
        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10">
          <div className="px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 bg-bg-card/90 dark:backdrop-blur-xl backdrop-blur-none dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
            <span className="text-[clamp(1rem,2.5vw,1.5rem)] sm:text-xl lg:text-2xl font-black text-accent uppercase tracking-widest whitespace-nowrap">
              {s.price}
            </span>
          </div>
        </div>
      )}
      renderContent={(s) => (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[clamp(0.6rem,1.2vw,0.75rem)] sm:text-xs font-bold text-accent uppercase tracking-[0.2em]">
              {s.subtitle}
            </span>
          </div>

          <h2 className="text-[clamp(1.25rem,4vw,2rem)] sm:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-6 sm:mb-8">
            {s.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-5 gap-x-6 sm:gap-x-10 mb-8 sm:mb-10">
            {s.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 sm:gap-4">
                <CheckCircle2 className="w-5 h-5 text-accent/60 mt-0.5 flex-shrink-0" />
                <span className="text-[clamp(0.8rem,1.8vw,1rem)] sm:text-base text-text-secondary leading-normal font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <button
              onClick={() => openServiceRequestModal(s.title)}
              className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-accent text-bg rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] text-[clamp(0.7rem,1.5vw,0.875rem)] transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent/10 flex items-center justify-center gap-3 sm:gap-4"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              Request Assessment
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center justify-center sm:justify-start gap-2 opacity-40">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              <span className="text-[clamp(0.5rem,1vw,0.65rem)] sm:text-[11px] font-bold text-text-muted uppercase tracking-widest">
                ISO COMPLIANT
              </span>
            </div>
          </div>
        </>
      )}
      showMobileNav
    />
  );
};

export default React.memo(LandingServicesSection);
