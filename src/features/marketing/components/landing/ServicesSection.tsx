import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';
import { openServiceRequestModal } from '../ServiceRequestModal';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

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
    <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr] gap-8 lg:gap-12 items-center">

          {/* ── Left: Heading Column ── */}
          <div className="lg:pr-6 flex flex-col">
            <ScrollReveal direction="left" delay={0.1}>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4 lg:mb-3">
                <div className="h-[1px] w-8 bg-accent/40" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                  Professional Services
                </span>
              </div>

              {/* Heading */}
              <AsciiHeading
                text="SERVICES"
                font="ANSI Shadow"
                align="left"
                animated
                compact
                className="mb-5 lg:mb-4"
              />

              {/* Description */}
              <p className="text-text-secondary text-base lg:text-sm leading-relaxed font-mono mb-6 lg:mb-4 max-w-sm opacity-80">
                Low Cost Security Audits and Pentest for Modern Companies and Startups in Africa.
              </p>

              {/* Trust badge — desktop only */}
              <div className="hidden lg:flex items-start gap-3 mb-5 opacity-35 hover:opacity-80 transition-opacity duration-500">
                <ShieldCheck className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-loose">
                  Trusted for comprehensive Penetration testing and Well Detailed Reports
                </p>
              </div>

              {/* ── Illustration — desktop only, no bg, no overlays ── */}
              <div className="hidden lg:block mt-auto">
                <img
                  src="/assets/illustrations/bootcamp-operator.webp"
                  alt="Operator illustration"
                  className="w-full max-h-98 object-contain object-bottom  select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right: Cards ── */}
          <ScrollReveal 
            direction="right" 
            staggerChildren={0.15} 
            className="flex flex-col gap-5 lg:gap-4"
          >
            {SERVICES_DATA.map((service) => (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, x: 50, filter: 'blur(10px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
                }}
                className="terminal-card group relative overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-500 hover:border-accent/50 flex flex-col lg:flex-row"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                {/* ── Card Image ── */}
                <div className="relative overflow-hidden bg-bg flex-shrink-0 w-full h-52 lg:w-[32%] lg:h-auto">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-1000 dark:group-hover:scale-110"
                  />

                  {/* Price badge — enlarged */}
                  <div className="absolute top-3 left-3 px-4 py-2">
                    <span className="text-base font-black text-white uppercase tracking-wider [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="flex flex-col flex-1 justify-center gap-4 p-5 lg:p-5">

                  {/* Title block */}
                  <div className="pb-3 border-b border-border/30">
                    <h3 className="text-xl lg:text-2xl font-black text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors leading-none mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-sm font-bold text-accent uppercase tracking-[0.2em]">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:gap-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 flex-shrink-0 ${
                            service.accent ? 'text-accent' : 'text-text-muted'
                          }`}
                        />
                        <span className="text-sm lg:text-xs text-text-muted font-medium leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      onClick={() => openServiceRequestModal(service.id)}
                      className={`px-7 py-3.5 lg:px-6 lg:py-3 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center gap-2.5 group/btn ${
                        service.accent
                          ? 'bg-accent text-bg hover:shadow-[0_0_24px_rgba(var(--color-accent-rgb),0.35)] hover:brightness-110 active:scale-95'
                          : 'bg-bg border border-border text-text-primary hover:border-accent/40 hover:bg-accent-dim/20 active:scale-95'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      Request Assessment
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 opacity-40">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.12em]">
                        ISO Standard Reports
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accent glow — standard package only */}
                {service.accent && (
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/10 blur-3xl pointer-events-none" />
                )}
              </motion.div>
            ))}
          </ScrollReveal>

        </div>
      </div>
  );
};

export default ServicesSection;
