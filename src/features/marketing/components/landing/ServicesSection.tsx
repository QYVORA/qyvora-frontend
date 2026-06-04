import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import SimpleHeading from '../../../../shared/components/ui/SimpleHeading';
import { openServiceRequestModal } from '../ServiceRequestModal';

const SERVICES_DATA = [
  {
    id: 'Basic WebApp Pentest',
    title: 'Basic Web-App Penetrtion Testing',
    price: 'GH₵ 4,000+',
    subtitle: 'Essential Web Pentest',
    image: '/assets/sections/services/basic-package.webp',
    features: [
      'OWASP Top 10 Coverage',
      'Authentication Testing',
      'XSS & SQLi Discovery',
      'Basic Vulnerability Report',
    ],
    accent: false,
  },
  {
    id: 'Standard WebApp Pentest',
    title: 'Standard Web-App Penetration Test',
    price: 'GH₵ 8,000+',
    subtitle: 'Full Pentest Suite',
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

const ServicesSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
        
        {/* Left: Cards Grid (Full width on mobile, compact on desktop) */}
        <div className="w-full lg:flex-1 order-2 lg:order-1 flex justify-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:max-w-3xl">
            {SERVICES_DATA.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border-2 bg-bg-card transition-all duration-300 ${
                  service.accent 
                    ? 'border-accent/30 hover:border-accent/50' 
                    : 'border-border hover:border-accent/30'
                } w-full lg:max-w-[360px]`}
                style={{ 
                  boxShadow: 'var(--card-shimmer)'
                }}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-bg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Price badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-bg/90 backdrop-blur-sm border border-border/80 rounded-lg text-xs font-black text-accent uppercase tracking-wider">
                      {service.price}
                    </span>
                  </div>

                  {/* Accent badge for featured service */}
                  {service.accent && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-accent/20 backdrop-blur-sm border border-accent/40 rounded-lg text-[9px] font-black text-accent uppercase tracking-wider">
                        Popular
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Title */}
                  <h3 className="text-base font-black text-text-primary uppercase tracking-tight leading-tight mb-1 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-4">
                    {service.subtitle}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-5 flex-1">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                        <span className="text-[11px] text-text-muted leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openServiceRequestModal(service.id)}
                    className={`w-full px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all duration-300 flex items-center justify-center gap-2 ${
                      service.accent
                        ? 'bg-accent text-bg hover:brightness-110 hover:shadow-[0_6px_20px_rgba(var(--color-accent-rgb),0.3)]'
                        : 'bg-bg border-2 border-border text-text-primary hover:border-accent/40 hover:bg-accent-dim/10'
                    } active:scale-95`}
                  >
                    <Lock className="w-3 h-3" />
                    Request Assessment
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-1.5 mt-3 opacity-40">
                    <ShieldCheck className="w-2.5 h-2.5 text-accent" />
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider">
                      ISO Standard Reports
                    </span>
                  </div>
                </div>

                {/* Accent glow */}
                {service.accent && (
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-accent/10 blur-3xl pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Heading (Now on the right on desktop, right-aligned. Left-aligned on mobile.) */}
        <div className="w-full lg:w-[340px] xl:w-[400px] order-1 lg:order-2 flex flex-col items-start lg:items-end text-left lg:text-right">
          <div className="flex items-center gap-3 mb-4 justify-start lg:justify-end">
            <div className="h-[1px] w-8 bg-accent/40" />
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
              Professional Services
            </span>
            <div className="h-[1px] w-8 bg-accent/40 hidden lg:block" />
          </div>

          <SimpleHeading
            text="SERVICES"
            align="left"
            accentWords={0}
            compact
            className="mb-5 lg:text-right"
          />

          <p className="text-text-secondary text-sm leading-relaxed font-mono opacity-80 max-w-sm">
            Low Cost Security Audits and Penetration Testing for Modern Companies and Startups in Africa
          </p>

          {/* Bottom illustration - now integrated into right column for desktop */}
          <div className="mt-10 hidden lg:block w-full max-w-[200px]">
            <img
              src="/assets/illustrations/bootcamp-operator.webp"
              alt="Security operator"
              className="w-full h-auto object-contain opacity-20 hover:opacity-40 transition-opacity duration-500 select-none pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesSection;
