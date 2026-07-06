import React from 'react';
import { Shield, Lock, ArrowRight, Building2, Send, CheckCircle2 } from 'lucide-react';
import HeroBackground from '@/shared/components/backgrounds/HeroBackground';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { useAuth } from '@/core/contexts/AuthContext';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import basicPackageImg from '@/assets/sections/services/basic-package.webp';
import standardPackageImg from '@/assets/sections/services/standard-package.webp';

const SERVICES_DATA = [
  {
    id: 'basic',
    tier: 'Basic',
    price: 'GH₵ 4,000+',
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
    price: 'Negotiation',
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
      <HeroBackground className="opacity-70" />

      {/* ══ HERO ══ */}
      <section className="relative bg-transparent overflow-hidden min-h-dvh md:min-h-screen flex flex-col justify-center pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6 text-accent text-xs font-black uppercase tracking-[0.3em]">
              <Shield className="w-4 h-4" />
              Offensive Security Assessments
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-6">
              Test Your <br />
              <span className="text-accent">Defenses</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-mono leading-relaxed max-w-2xl">
              Professional penetration testing services tailored for African organizations.
              From startups to enterprises — we assess your attack surface before adversaries do.
            </p>
          </div>
        </div>
      </section>

      {/* ══ SERVICES CARDS ══ */}
      <section className="relative w-full py-20 md:py-28">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-4">
              Engagement <span className="text-accent">Packages</span>
            </h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
              Fixed-scope packages with optional add-ons. Every engagement includes a detailed report with actionable findings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SERVICES_DATA.map((service) => {
              const isFeatured = 'featured' in service && service.featured;
              return (
                <div
                  key={service.id}
                  className={`relative rounded-2xl border-2 flex flex-col transition-all duration-300 ${
                    isFeatured
                      ? 'border-accent/50 shadow-[0_0_30px_-8px] shadow-accent/25'
                      : 'border-border hover:border-accent/40'
                  }`}
                >
                  {service.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-bg-card/95 via-bg-card/90 to-bg-card" />
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-bg text-[10px] font-black uppercase tracking-[0.2em] rounded-full z-10">
                      Most Popular
                    </div>
                  )}
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="mb-5">
                      <h3 className="text-xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-accent">{service.price}</span>
                        {service.price === 'Negotiation' && (
                          <span className="text-xs font-bold text-text-muted">per engagement</span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted mt-2 leading-relaxed">{service.desc}</p>
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openServiceRequestModal(service.tier)}
                      className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        isFeatured
                          ? 'bg-accent text-bg hover:brightness-110'
                          : 'border-2 border-accent/50 text-accent hover:bg-accent/10'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Request Assessment <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CUSTOM INQUIRIES ══ */}
      <section className="relative w-full py-20 md:py-28 border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
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
      <section id="cta" className="relative w-full">
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
