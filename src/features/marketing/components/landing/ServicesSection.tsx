import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';
import { openServiceRequestModal } from '../ServiceRequestModal';

const SERVICES_DATA = [
  {
    id: 'basic-package',
    title: 'Basic Package',
    price: 'GH₵ 4,000+',
    subtitle: 'Essential Web Audit',
    image: '/assets/sections/services/basic-package.png',
    features: [
      'OWASP Top 10 Coverage',
      'Authentication Testing',
      'XSS & SQLi Discovery',
      'Basic Vulnerability Report',
    ],
    accent: false,
  },
  {
    id: 'standard-package',
    title: 'Standard Package',
    price: 'GH₵ 8,000+',
    subtitle: 'Full Pentest Suite',
    image: '/assets/sections/services/standard-package.png',
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full h-full flex items-center overflow-hidden py-8 lg:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr] gap-8 lg:gap-12 items-center">

          {/* ── Left: Heading Column ── */}
          <div className="lg:pr-6">
            <div className="flex items-center gap-3 mb-4 lg:mb-3">
              <div className="h-[1px] w-8 bg-accent/40" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                Professional Services
              </span>
            </div>

            <AsciiHeading
              text="SERVICES"
              font="ANSI Shadow"
              align="left"
              animated
              compact
              className="mb-5 lg:mb-4"
            />

            {/* Description — visible on all sizes, smaller on desktop */}
            <p className="text-text-secondary text-base lg:text-sm leading-relaxed font-mono mb-6 lg:mb-0 max-w-sm opacity-80">
              High-fidelity security audits for modern infrastructure.
              Identify critical vectors before they are exploited.
            </p>

            {/* Trust badge — desktop only */}
            <div className="hidden lg:flex items-start gap-3 mt-4 opacity-35 hover:opacity-80 transition-opacity duration-500">
              <ShieldCheck className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-loose">
                Trusted for comprehensive offensive security assessments and technical reporting.
              </p>
            </div>
          </div>

          {/* ── Right: Cards ── */}
          <div className="flex flex-col gap-5 lg:gap-4">
            {SERVICES_DATA.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="terminal-card group relative overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-500 hover:border-accent/50
                  flex flex-col
                  lg:flex-row"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                {/* ── Image ──
                    Mobile:  full-width banner on top, tall enough to look good
                    Desktop: side column, auto height driven by card content     */}
                <div className="
                  relative overflow-hidden bg-bg flex-shrink-0
                  w-full h-52
                  lg:w-[32%] lg:h-auto
                ">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-70"
                  />
                  {/* Mobile: gradient fades bottom into card body */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/30 to-transparent opacity-90 lg:hidden" />
                  {/* Desktop: gradient fades right into card body */}
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-transparent to-transparent opacity-90 hidden lg:block" />

                  <div className="absolute top-3 left-3 bg-bg/80 backdrop-blur-md border border-border/50 px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-black text-text-primary uppercase tracking-wider">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="flex flex-col flex-1 justify-center gap-4 p-5 lg:p-5">
                  {/* Title */}
                  <div className="pb-3 border-b border-border/30">
                    <h3 className="text-xl lg:text-2xl font-black text-text-primary uppercase tracking-tight group-hover:text-white transition-colors leading-none mb-1.5">
                      {service.title}
                    </h3>
                    <span className="text-xs font-bold text-accent uppercase tracking-[0.2em]">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Features */}
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

                  {/* CTA */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      onClick={() => openServiceRequestModal(service.title)}
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

                {service.accent && (
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/10 blur-3xl pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServicesSection;