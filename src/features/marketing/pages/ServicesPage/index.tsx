import React from 'react';
import { Shield, Smartphone, Globe, Network, Users, CheckCircle2, Lock, ArrowRight, Building2, Send } from 'lucide-react';
import HeroBackground from '@/shared/components/backgrounds/HeroBackground';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Carousel } from '@/shared/components/carousel';
import { useAuth } from '@/core/contexts/AuthContext';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import basicPackageImg from '@/assets/sections/services/basic-package.webp';
import standardPackageImg from '@/assets/sections/services/standard-package.webp';

const PACKAGES = [
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

const ASSESSMENT_SERVICES = [
  {
    id: 'web',
    icon: Globe,
    title: 'Web Application Pentesting',
    desc: 'Deep-dive security assessments of web applications, APIs, and microservices. We test for OWASP Top 10, business logic flaws, authentication bypasses, and server-side vulnerabilities.',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Application Pentesting',
    desc: 'Android and iOS application security testing including static analysis, dynamic instrumentation, API interception, and data-at-rest assessment.',
  },
  {
    id: 'network',
    icon: Network,
    title: 'Network Penetration Testing',
    desc: 'External and internal network infrastructure assessments covering service enumeration, vulnerability exploitation, pivot paths, and Active Directory security reviews.',
  },
  {
    id: 'social',
    icon: Users,
    title: 'Social Engineering',
    desc: 'Phishing simulations, pretexting campaigns, and physical security assessments to evaluate human-layer security controls and awareness.',
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
      <section className="relative bg-transparent overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24">
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

      {/* ══ WHAT WE ASSESS — Carousel ══ */}
      <section className="relative w-full py-20 md:py-28 border-t border-border/20">
        <div className="w-full px-4 md:px-12 lg:px-16">
          <div className="w-full lg:max-w-6xl lg:mx-auto flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
            <div className="md:w-[35%] lg:w-[38%] mb-6 md:mb-0 md:sticky md:top-32 md:order-2 md:text-right md:self-start">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                What We <span className="text-accent">Assess</span>
              </h2>
              <p className="mt-4 text-sm md:text-base text-text-muted leading-relaxed max-w-sm md:ml-auto">
                Comprehensive offensive security testing across the full attack surface.
              </p>
            </div>
            <div className="md:w-[65%] lg:w-[62%] md:order-1">
              <Carousel
                slides={ASSESSMENT_SERVICES}
                renderCard={(s) => {
                  const Icon = s.icon;
                  return (
                    <div className="relative min-h-[260px] md:min-h-[360px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                      <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[360px]">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mb-3">{s.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ PACKAGES ══ */}
      <section className="relative w-full py-20 md:py-28 border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none mb-4">
              Engagement <span className="text-accent">Packages</span>
            </h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
              Fixed-scope packages with optional add-ons. Every engagement includes a detailed report with actionable findings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {PACKAGES.map((pkg, i) => {
              const isFeatured = pkg.featured;
              return (
                <ScrollReveal key={pkg.id} direction="up" amount={0.05} delay={i * 0.05}>
                  <div
                    className={`card-qyvora border flex flex-col h-full transition-all duration-300 ${
                      isFeatured
                        ? 'border-accent/40 shadow-[0_0_30px_-12px] shadow-accent/20'
                        : 'border-border hover:border-accent/35'
                    }`}
                  >
                    {pkg.image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${pkg.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                    {isFeatured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-bg text-[10px] font-black uppercase tracking-[0.2em] rounded-full z-10">
                        Most Popular
                      </div>
                    )}
                    <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-text-primary tracking-tight">{pkg.tier}</h3>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-4xl font-black text-accent">
                            {pkg.price}
                          </span>
                          {pkg.price === 'Negotiation' && (
                            <span className="text-xs font-bold text-text-muted">per engagement</span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted mt-3 leading-relaxed">{pkg.desc}</p>
                      </div>
                      <ul className="space-y-3 mb-8 flex-1">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => openServiceRequestModal(pkg.tier)}
                        className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 z-10 ${
                          isFeatured
                            ? 'bg-accent text-bg hover:brightness-110'
                            : 'border border-accent/50 text-accent hover:bg-accent/10'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Request Assessment <ArrowRight className="w-3.5 h-3.5" />
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
