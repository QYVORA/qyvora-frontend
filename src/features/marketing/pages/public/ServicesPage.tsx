import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Building2, Send, ShieldCheck } from 'lucide-react';
import { IconShield, IconCheck, IconArrowRight, IconLock } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { getDottedMapBg } from '@/shared/utils/dottedMap';

const SERVICES = [
  { id: 'basic', tKey: 'basic', featured: false, featureKeys: ['webAppAssessment', 'scanning', 'owasp', 'report'] },
  { id: 'standard', tKey: 'standard', featured: true, featureKeys: ['webMobile', 'authTesting', 'businessLogic', 'report'] },
  { id: 'bootcamp', tKey: 'bootcamp', featured: false, featureKeys: ['curriculum', 'exercises', 'phishing', 'progress'] },
];

const ServicesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
        <StudentHeroSection
          icon={<ShieldCheck className="w-8 h-8 text-accent" />}
          title="Security Services"
          description="Enterprise penetration testing, vulnerability assessments, and custom security training for your organization."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((svc) => (
            <ScrollReveal key={svc.id} amount={0.05}>
              <div
                className={`rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 h-full ${
                  svc.featured
                    ? 'border-accent/30 bg-accent/5 shadow-lg shadow-accent/5'
                    : 'border-border/30 bg-bg-card hover:border-accent/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    svc.featured ? 'bg-accent text-bg' : 'bg-bg-elevated text-accent'
                  }`}>
                    <IconShield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary">{t(`landing.services.${svc.tKey}.tier`)}</h3>
                    <p className="text-[10px] font-mono text-text-muted">{t(`landing.services.${svc.tKey}.price`)}</p>
                  </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed">{t(`landing.services.${svc.tKey}.subtitle`)}</p>

                <ul className="space-y-2 flex-1">
                  {svc.featureKeys.map((fk) => (
                    <li key={fk} className="flex items-start gap-2 text-xs text-text-secondary">
                      <IconCheck className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      {t(`landing.services.${svc.tKey}.features.${fk}`)}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openServiceRequestModal(svc.id.charAt(0).toUpperCase() + svc.id.slice(1))}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                    svc.featured
                      ? 'bg-accent text-bg shadow-lg shadow-accent/20 hover:brightness-110'
                      : 'border border-border/40 text-text-primary hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  {t('landing.services.requestAssessment')}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Custom inquiry */}
        <div
          onClick={() => openServiceRequestModal('Custom Inquiry')}
          className="rounded-2xl border-2 border-dashed border-border/20 p-8 text-center cursor-pointer hover:border-accent/20 transition-colors group"
        >
          <Building2 className="h-10 w-10 text-text-muted/30 mx-auto mb-3 group-hover:text-accent/50 transition-colors" />
          <h3 className="text-sm font-black text-text-primary mb-1">{t('landing.services.customInquiry')}</h3>
          <p className="text-xs text-text-muted">{t('landing.services.customDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
