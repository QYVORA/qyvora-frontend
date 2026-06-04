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
    <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 w-full">
      
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-accent/40" />
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
            Professional Services
          </span>
          <div className="h-[1px] w-8 bg-accent/40" />
        </div>

        <SimpleHeading
          text="SERVICES"
          align="center"
          compact
          className="mb-5"
        />

        <p className="text-text-secondary text-sm leading-relaxed font-mono opacity-80">
          Low Cost Security Audits and Penetration Testing for Modern Companies and Startups in Africa
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            }`}
            style={{ boxShadow: 'var(--card-shimmer)' }}
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-bg">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
              
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
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight leading-tight mb-1 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-4">
                {service.subtitle}
              </p>

              {/* Features */}
              <div className="space-y-2.5 mb-5 flex-1">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span className="text-xs text-text-muted leading-tight">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => openServiceRequestModal(service.id)}
                className={`w-full px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2 ${
                  service.accent
                    ? 'bg-accent text-bg hover:brightness-110 hover:shadow-[0_6px_20px_rgba(var(--color-accent-rgb),0.3)]'
                    : 'bg-bg border-2 border-border text-text-primary hover:border-accent/40 hover:bg-accent-dim/10'
                } active:scale-95`}
              >
                <Lock className="w-3.5 h-3.5" />
                Request Assessment
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-1.5 mt-3 opacity-40">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
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

      {/* Bottom illustration - centered */}
      <div className="mt-12 flex justify-center">
        <div className="max-w-md w-full px-8">
          <img
            src="/assets/illustrations/bootcamp-operator.webp"
            alt="Security operator"
            className="w-full h-auto object-contain opacity-30 hover:opacity-50 transition-opacity duration-500 select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
