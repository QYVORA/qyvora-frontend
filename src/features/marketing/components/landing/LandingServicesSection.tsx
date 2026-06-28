import React from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
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
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-accent block mb-4">
            // Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Penetration <span className="text-accent">Testing</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-text-muted leading-relaxed max-w-sm">
            Structured security assessments for web applications and infrastructure
          </p>
        </div>

        <div className="md:w-[65%] lg:w-[62%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {SERVICES_DATA.map((s, i) => (
              <ScrollReveal key={s.id} direction="up" amount={0.1} delay={i * 0.1}>
                <div className="rounded-lg border border-border bg-bg-card overflow-hidden flex flex-col h-full group">
                  <div className="relative aspect-video overflow-hidden bg-bg-elevated">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <div className="px-2 py-0.5 bg-bg-card border border-white/10 rounded-md">
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest whitespace-nowrap">
                          {s.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 flex flex-col flex-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-0.5">
                      {s.subtitle}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-tight leading-tight mb-1.5">
                      {s.title}
                    </h3>
                    <div className="space-y-0.5 mb-2">
                      {s.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-accent/60 mt-0.5 flex-shrink-0" />
                          <span className="text-[10px] sm:text-[11px] text-text-secondary leading-normal font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => openServiceRequestModal(s.title)}
                      className="w-full mt-auto px-2.5 py-1.5 bg-accent text-bg rounded-lg font-black uppercase tracking-[0.15em] text-[9px] sm:text-[10px] transition-all hover:brightness-110 flex items-center justify-center gap-1"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      Request Assessment
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LandingServicesSection);
