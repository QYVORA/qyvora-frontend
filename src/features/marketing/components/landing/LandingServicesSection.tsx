import React from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';
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
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[65%] lg:w-[62%] md:order-1">
          <Carousel
            slides={SERVICES_DATA}
            renderCard={(s) => (
              <div className="relative min-h-[340px] md:min-h-[400px]">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden dark:block"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[340px] md:min-h-[400px]">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
                      {s.subtitle}
                    </span>
                    <div className="px-2.5 py-1 bg-bg-card/80 backdrop-blur-sm border border-white/10 rounded-md">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest whitespace-nowrap">
                        {s.price}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-text-primary uppercase tracking-tight leading-tight mb-3">
                    {s.title}
                  </h3>
                  <div className="space-y-1 mb-3">
                    {s.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-accent/60 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-text-secondary leading-normal font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openServiceRequestModal(s.title)}
                    className="w-full mt-auto px-3 py-2 bg-accent text-bg rounded-lg font-black uppercase tracking-[0.15em] text-[10px] sm:text-xs transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" />
                    Request Assessment
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          />
        </div>

        <div className="md:w-[35%] lg:w-[38%] text-center md:text-right mb-8 md:mb-0 md:sticky md:top-32 md:order-2">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-accent block mb-4">
            // Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Penetration <span className="text-accent">Testing</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-text-muted leading-relaxed max-w-sm md:ml-auto">
            Structured security assessments for web applications and infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LandingServicesSection);
