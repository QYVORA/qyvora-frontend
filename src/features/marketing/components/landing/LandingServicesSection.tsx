import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Shield, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { openServiceRequestModal } from '../ServiceRequestModal';
import basicPackageImg from '@/assets/sections/services/basic-package.webp';
import standardPackageImg from '@/assets/sections/services/standard-package.webp';
import DotMapBackground from '@/shared/components/DotMapBackground';

const SERVICES = [
  {
    id: 'basic',
    tier: 'Basic',
    price: 'GH₵ 4,000+',
    subtitle: 'Essential Security Audit',
    image: basicPackageImg,
    featured: false,
    features: [
      'Web Application Assessment (up to 5 endpoints)',
      'Automated + Manual Vulnerability Scanning',
      'OWASP Top 10 Coverage',
      'Single PDF Report with Executive Summary',
    ],
  },
  {
    id: 'standard',
    tier: 'Standard',
    price: 'GH₵ 8,000+',
    subtitle: 'Full Stack Assessment',
    image: standardPackageImg,
    featured: true,
    features: [
      'Web App + Mobile API Assessment',
      'Authenticated & Role-Based Testing',
      'Business Logic & Workflow Analysis',
      'Detailed Report with PoC Walkthroughs',
    ],
  },
  {
    id: 'bootcamp',
    tier: 'Employee Bootcamp',
    price: 'Custom',
    subtitle: 'Team Training',
    featured: false,
    features: [
      'Tailored Curriculum Design',
      'Hands-on Simulated Exercises',
      'Phishing & Social Engineering Drills',
      'Progress Tracking & Reporting',
    ],
  },
];

const LandingServicesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const featured = SERVICES.find((s) => s.featured)!;
  const supporting = SERVICES.filter((s) => !s.featured);

  return (
    <div className="relative overflow-hidden">
      <DotMapBackground />
      <div className="relative w-full px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="w-full lg:max-w-6xl lg:mx-auto">
          {/* Heading — left aligned */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/30 bg-bg-elevated text-[10px] font-black uppercase tracking-[0.25em] text-text-primary mb-4">
              <Shield className="h-3 w-3" /> Enterprise Services
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none mb-4">
              Penetration <span className="text-text-secondary">Testing</span>
            </h2>
            <p className="text-sm md:text-base text-text-secondary max-w-xl">
              Structured security assessments for web applications, APIs, and infrastructure. Report-driven, remediation-focused.
            </p>
          </motion.div>

          {/* Featured layout: Supporting cards left, featured card right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Supporting cards — stacked vertically, 2 columns */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              {supporting.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="group relative rounded-2xl border border-border/30 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 h-full flex flex-col">
                    {service.image ? (
                      <div className="relative h-36 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${service.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
                        <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">{service.subtitle}</span>
                            <h3 className="text-xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                          </div>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-bg-elevated backdrop-blur-sm border border-border/30">
                            {service.price}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 pb-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">{service.subtitle}</span>
                        <div className="flex items-end justify-between mb-2">
                          <h3 className="text-xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-bg-elevated border border-border/30">
                            {service.price}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      <ul className="space-y-2.5 flex-1">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                            <span className="text-xs text-text-secondary leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => openServiceRequestModal(service.tier)}
                        className="mt-5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 btn-primary !border-accent/30"
                      >
                        Request Assessment
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Featured card — Standard tier, takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3"
            >
              <div className="group relative rounded-2xl border border-border/50 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30 h-full flex flex-col shadow-lg">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-accent" />

                {featured.image ? (
                  <div className="relative h-52 lg:h-64 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${featured.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{featured.subtitle}</span>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[8px] font-black uppercase tracking-widest text-accent">
                            <Sparkles className="w-2.5 h-2.5" /> Most Popular
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-text-primary tracking-tight">{featured.tier}</h3>
                      </div>
                      <span className="text-lg font-black text-accent px-4 py-2 rounded-xl bg-bg-elevated backdrop-blur-sm border border-border/30">
                        {featured.price}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{featured.subtitle}</span>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[8px] font-black uppercase tracking-widest text-accent">
                        <Sparkles className="w-2.5 h-2.5" /> Most Popular
                      </span>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                      <h3 className="text-3xl font-black text-text-primary tracking-tight">{featured.tier}</h3>
                      <span className="text-lg font-black text-accent px-4 py-2 rounded-xl bg-bg-elevated border border-border/30">
                        {featured.price}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {featured.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                        <span className="text-sm text-text-secondary leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openServiceRequestModal(featured.tier)}
                    className="mt-6 w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 btn-primary !border-accent/30 text-base"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Request Assessment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <a
              href="/services"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
            >
              View All Services <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingServicesSection;
