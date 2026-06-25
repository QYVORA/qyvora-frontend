import React from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-accent block mb-4">
            // Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Penetration <span className="text-accent">Testing</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-text-muted max-w-xl mx-auto">
            Structured security assessments for web applications and infrastructure
          </p>
        </div>

        <CardGrid
          slides={SERVICES_DATA}
          cols={2}
          containerClassName="w-full"
          renderCard={(s) => (
            <div className="rounded-2xl border border-border bg-bg-card overflow-hidden flex flex-col h-full group">
              <div className="relative aspect-[21/9] overflow-hidden bg-bg-elevated">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-bg-card/90 border border-white/10 rounded-lg">
                    <span className="text-xs sm:text-sm font-black text-accent uppercase tracking-widest whitespace-nowrap">
                      {s.price}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em] mb-1">
                  {s.subtitle}
                </span>
                <h3 className="text-sm sm:text-base lg:text-lg font-black text-text-primary uppercase tracking-tight leading-tight mb-2">
                  {s.title}
                </h3>
                <div className="space-y-0.5 mb-3">
                  {s.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-accent/60 mt-0.5 flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs text-text-secondary leading-normal font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => openServiceRequestModal(s.title)}
                  className="w-full mt-auto px-3 py-2 sm:px-4 sm:py-2.5 bg-accent text-bg rounded-lg font-black uppercase tracking-[0.15em] text-[10px] sm:text-xs transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent/10 flex items-center justify-center gap-1.5"
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
    </div>
  );
};

export default React.memo(LandingServicesSection);
