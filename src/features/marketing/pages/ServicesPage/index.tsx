import React from 'react';
import { Building2, Send } from 'lucide-react';
import { IconShield, IconLock, IconArrowRight, IconCheck } from '@/shared/components/icons';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { useAuth } from '@/core/contexts/AuthContext';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import basicPackageImg from '@/assets/sections/services/basic-package.webp';
import standardPackageImg from '@/assets/sections/services/standard-package.webp';
import ScrollReveal from '@/shared/components/ScrollReveal';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

const SERVICES_DATA = [
  {
    id: 'basic',
    tier: 'Basic',
    price: 'GH₵ 4,000+',
    subtitle: 'Essential Security Audit',
    desc: 'Essential penetration testing for startups and small teams.',
    image: basicPackageImg,
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
    desc: 'Comprehensive testing for growing organizations.',
    image: standardPackageImg,
    features: [
      'Web App + Mobile API Assessment',
      'Authenticated & Role-Based Testing',
      'Business Logic & Workflow Analysis',
      'Detailed Report with PoC Walkthroughs',
    ],
    featured: true,
  },
  {
    id: 'bootcamp',
    tier: 'Employee Bootcamp',
    price: 'Custom',
    subtitle: 'Team Training',
    desc: 'Custom security awareness training for your team.',
    features: [
      'Tailored Curriculum Design',
      'Hands-on Simulated Exercises',
      'Phishing & Social Engineering Drills',
      'Progress Tracking & Reporting',
    ],
  },
];

const ServicesPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title="Offensive Security Services"
        description="Professional penetration testing services for African organizations — web, mobile, network, and social engineering assessments."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Services', item: '/services' },
        ]}
      />

      {/* ══ HERO ══ */}
      <PublicHeroSection mask="none">
        <div className="flex items-center gap-3 text-bg/70 text-xs font-black uppercase tracking-[0.3em]">
          <IconShield className="w-4 h-4" />
          Offensive Security Assessments
        </div>
        <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
          <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
            Test Your{' '}
            <span className="text-bg/80">Defenses</span>
          </span>
        </h1>
        <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
          Professional penetration testing services tailored for African organizations.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
            Request Assessment <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </PublicHeroSection>

      {/* ══ SERVICES CARDS — dark bg ══ */}
      <section id="services" className="relative w-full py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-4">
              Engagement <span className="text-accent">Packages</span>
            </h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
              Fixed-scope packages with optional add-ons. Every engagement includes a detailed report with actionable findings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SERVICES_DATA.map((service, idx) => {
              const isFeatured = service.featured;
              return (
                <ScrollReveal key={service.id} delay={idx * 0.1}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openServiceRequestModal(service.tier)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openServiceRequestModal(service.tier); } }}
                    className={`group relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 cursor-pointer h-full ${
                      isFeatured
                        ? 'border-accent/40 bg-bg-card shadow-[0_0_30px_-8px] shadow-accent/20'
                        : 'border-border/30 bg-bg-card hover:border-accent/30'
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-bg" />
                    )}
                    {/* Image */}
                    {service.image && (
                      <div className="relative h-44 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${service.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1">{service.subtitle}</span>
                            <h3 className="text-xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                          </div>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-bg-card/80 backdrop-blur-sm border border-border/30">
                            {service.price}
                          </span>
                        </div>
                      </div>
                    )}
                    {!service.image && (
                      <div className="p-5 pb-0">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1">{service.subtitle}</span>
                        <div className="flex items-end justify-between mb-2">
                          <h3 className="text-xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-bg-elevated border border-border/30">
                            {service.price}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Features */}
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs text-text-muted mb-4">{service.desc}</p>
                      <ul className="space-y-2.5 flex-1">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <IconCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span className="text-xs text-text-secondary leading-relaxed break-words">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => openServiceRequestModal(service.tier)}
                        className="mt-5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 btn-primary"
                      >
                        <IconLock className="w-3 h-3" />
                        Request Assessment
                        <IconArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CUSTOM INQUIRIES ══ */}
      <section className="relative w-full py-20 md:py-28 border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-4">
              Need Something <span className="text-accent">Custom?</span>
            </h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto mb-8">
              Not sure which package fits? Let's talk. We design custom engagement scopes for unique infrastructure, compliance requirements, and multi-team Red Team exercises.
            </p>
            <button
              onClick={() => openServiceRequestModal('Custom Inquiry')}
              className="btn-primary !px-10 !py-4 inline-flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.15em]"
            >
              <Send className="w-4 h-4" /> Contact Our Team
            </button>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section id="cta" className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ══ FOOTER ══ */}
      <section className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default ServicesPage;
