import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Send } from 'lucide-react';
import { IconShield, IconLock, IconArrowRight, IconCheck } from '@/shared/components/icons';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { useAuth } from '@/core/contexts/AuthContext';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import basicPackageImg from '@/assets/sections/services/basic-package.webp';
import standardPackageImg from '@/assets/sections/services/standard-package.webp';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { Carousel } from '@/shared/components/carousel';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const servicesData = [
    {
      id: 'basic',
      tier: t('landing.services.basic.tier'),
      price: t('landing.services.basic.price'),
      subtitle: t('landing.services.basic.subtitle'),
      desc: t('servicesPage.basic.desc'),
      image: basicPackageImg,
      features: [
        t('landing.services.basic.features.webAppAssessment'),
        t('landing.services.basic.features.scanning'),
        t('landing.services.basic.features.owasp'),
        t('landing.services.basic.features.report'),
      ],
    },
    {
      id: 'standard',
      tier: t('landing.services.standard.tier'),
      price: t('landing.services.standard.price'),
      subtitle: t('landing.services.standard.subtitle'),
      desc: t('servicesPage.standard.desc'),
      image: standardPackageImg,
      features: [
        t('landing.services.standard.features.webMobile'),
        t('landing.services.standard.features.authTesting'),
        t('landing.services.standard.features.businessLogic'),
        t('landing.services.standard.features.report'),
      ],
      featured: true,
    },
    {
      id: 'bootcamp',
      tier: t('landing.services.bootcamp.tier'),
      price: t('landing.services.bootcamp.price'),
      subtitle: t('landing.services.bootcamp.subtitle'),
      desc: t('servicesPage.bootcamp.desc'),
      features: [
        t('landing.services.bootcamp.features.curriculum'),
        t('landing.services.bootcamp.features.exercises'),
        t('landing.services.bootcamp.features.phishing'),
        t('landing.services.bootcamp.features.progress'),
      ],
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title={t('servicesPage.seo.title')}
        description={t('servicesPage.seo.description')}
        breadcrumbs={[
          { name: t('nav.home'), item: '/' },
          { name: t('nav.services'), item: '/services' },
        ]}
      />

      {/* ══ HERO ══ */}
      <PublicHeroSection mask="right" showGlobe>
        <div className="flex items-center gap-3 text-bg/70 text-xs font-black uppercase tracking-[0.3em]">
          <IconShield className="w-4 h-4" />
          {t('servicesPage.hero.badge')}
        </div>
        <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
          <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
            {t('servicesPage.hero.title')}{' '}
            <span className="text-bg/80">{t('servicesPage.hero.titleHighlight')}</span>
          </span>
        </h1>
        <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
          {t('servicesPage.hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
            {t('landing.services.requestAssessment')} <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </PublicHeroSection>

      {/* ══ SERVICES CARDS ══ */}
      <section id="services" className="w-full px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-28 lg:py-36">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
          <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4">
              {t('servicesPage.packages.heading')} <span className="text-accent">{t('servicesPage.packages.headingHighlight')}</span>
            </h2>
            <p className="text-text-muted text-sm md:text-base max-w-sm">
              {t('servicesPage.packages.description')}
            </p>
          </div>
          <div className="md:w-[65%] lg:w-[62%]">
            <Carousel
              slides={servicesData}
              autoPlayInterval={5000}
              renderCard={(service) => {
                const isFeatured = service.featured;
                return (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openServiceRequestModal(service.tier)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openServiceRequestModal(service.tier); } }}
                    className={`group relative flex flex-col md:flex-row min-h-[260px] md:min-h-[340px] cursor-pointer ${
                      isFeatured ? 'shadow-[0_0_30px_-8px] shadow-accent/20' : ''
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-accent z-20" />
                    )}
                    {service.image ? (
                      <div className="relative w-full md:w-[45%] h-48 md:h-auto overflow-hidden shrink-0">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${service.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-card md:bg-gradient-to-r md:from-transparent md:to-bg-card" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between md:hidden">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 block mb-1">{service.subtitle}</span>
                            <h3 className="text-2xl font-black text-white tracking-tight">{service.tier}</h3>
                          </div>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-border/30">
                            {service.price}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full md:w-[45%] h-48 md:h-auto overflow-hidden shrink-0 bg-accent/5 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-accent/30" />
                      </div>
                    )}
                    <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[340px]">
                      <div className="hidden md:block mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1">{service.subtitle}</span>
                        <div className="flex items-end justify-between gap-4">
                          <h3 className="text-2xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 whitespace-nowrap">
                            {service.price}
                          </span>
                        </div>
                      </div>
                      <div className="md:hidden mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1">{service.subtitle}</span>
                        <div className="flex items-end justify-between gap-4">
                          <h3 className="text-2xl font-black text-text-primary tracking-tight">{service.tier}</h3>
                          <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 whitespace-nowrap">
                            {service.price}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary font-mono leading-relaxed mb-4 line-clamp-3">{service.desc}</p>
                      <ul className="space-y-2.5 flex-1 mb-4">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <IconCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span className="text-sm text-text-secondary leading-relaxed break-words">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 text-accent/60 mt-auto">
                        <IconLock className="w-3 h-3" />
                        <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                          {t('landing.services.requestAssessment')}
                        </span>
                        <IconArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </section>

      {/* ══ CUSTOM INQUIRIES ══ */}
      <section className="w-full px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-28 lg:py-36 border-t border-border/20">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
          <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                {t('servicesPage.custom.title')} <span className="text-accent">{t('servicesPage.custom.titleHighlight')}</span>
              </h2>
          </div>
          <div className="md:w-[65%] lg:w-[62%]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => openServiceRequestModal('Custom Inquiry')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openServiceRequestModal('Custom Inquiry'); } }}
              className="group relative flex flex-col md:flex-row min-h-[260px] md:min-h-[340px] rounded-2xl border border-border/30 bg-bg-card overflow-hidden cursor-pointer hover:border-accent/30 transition-all duration-300"
            >
              <div className="relative w-full md:w-[45%] h-48 md:h-auto overflow-hidden shrink-0 bg-accent/5 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-accent/30 group-hover:text-accent/50 transition-colors" />
              </div>
              <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[340px]">
                <div className="mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block mb-1">{t('servicesPage.custom.subtitle')}</span>
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="text-2xl font-black text-text-primary tracking-tight">{t('servicesPage.custom.heading')}</h3>
                      <span className="text-sm font-black text-accent px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 whitespace-nowrap">
                        {t('servicesPage.custom.price')}
                      </span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-mono leading-relaxed mb-4 line-clamp-3">
                  {t('servicesPage.custom.description')}
                </p>
                <ul className="space-y-2.5 flex-1 mb-4">
                  {[
                    t('servicesPage.custom.features.redTeam'),
                    t('servicesPage.custom.features.compliance'),
                    t('servicesPage.custom.features.infrastructure'),
                    t('servicesPage.custom.features.projectMgmt'),
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <IconCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary leading-relaxed break-words">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-accent/60 mt-auto">
                  <Send className="w-3 h-3" />
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                    {t('servicesPage.custom.cta')}
                  </span>
                  <IconArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
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
