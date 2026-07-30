import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Sparkles, Building2, Send, ShieldCheck } from 'lucide-react';
import { IconCheck, IconArrowRight } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { getDottedMapBg } from '@/shared/utils/dottedMap';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';

const SERVICES = [
  { id: 'standard', tKey: 'standard', featured: true, featureKeys: ['webMobile', 'authTesting', 'businessLogic', 'report'] },
  { id: 'basic', tKey: 'basic', featured: false, featureKeys: ['webAppAssessment', 'scanning', 'owasp', 'report'] },
  { id: 'bootcamp', tKey: 'bootcamp', featured: false, featureKeys: ['curriculum', 'exercises', 'phishing', 'progress'] },
];

const dividerClass = 'border-b border-border/20';

const ServiceCard: React.FC<{
  svc: typeof SERVICES[number];
  t: (key: string) => string;
  index: number;
}> = ({ svc, t, index }) => {
  const content = (
    <div className="group relative h-full rounded-2xl border border-border/30 bg-bg-card p-5 sm:p-8 transition-all duration-300 hover:border-accent/30 flex flex-col">
      <div className="absolute inset-0 opacity-[0.04] text-accent rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />

      {svc.featured && (
        <span className="flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[8px] font-black uppercase tracking-widest text-accent mb-3 sm:mb-4">
          <Sparkles className="w-2.5 h-2.5" /> {t('landing.services.mostPopular')}
        </span>
      )}

      <h3 className={`font-black text-text-primary tracking-tighter leading-none mb-2 ${
        svc.featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg sm:text-xl md:text-2xl'
      }`}>
        {t(`landing.services.${svc.tKey}.tier`)}
      </h3>

      <span className="text-sm md:text-base font-black text-accent mb-4 md:mb-6 block">
        {t(`landing.services.${svc.tKey}.price`)}
      </span>

      <div className={dividerClass} />

      <p className="text-xs sm:text-sm text-text-muted leading-relaxed mt-3 mb-4 md:mb-5">
        {t(`landing.services.${svc.tKey}.subtitle`)}
      </p>

      <ul className="space-y-2.5 flex-1">
        {svc.featureKeys.map((fk) => (
          <li key={fk} className="flex items-start gap-2.5">
            <IconCheck size={16} className="text-accent mt-0.5 shrink-0" />
            <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {t(`landing.services.${svc.tKey}.features.${fk}`)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 md:pt-6">
        <button
          onClick={() => openServiceRequestModal(t(`landing.services.${svc.tKey}.tier`))}
          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            svc.featured
              ? 'bg-accent text-bg shadow-lg shadow-accent/20 hover:brightness-110'
              : 'border border-border/40 text-text-primary hover:border-accent/30 hover:text-accent'
          }`}
        >
          {t('landing.services.requestAssessment')}
          <IconArrowRight size={12} />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={svc.featured ? 'lg:col-span-2 lg:row-span-1' : ''}
    >
      {content}
    </motion.div>
  );
};

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {SERVICES.map((svc, idx) => (
            <ServiceCard key={svc.id} svc={svc} t={t} index={idx} />
          ))}
        </div>

        {/* Custom inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => openServiceRequestModal('Custom Inquiry')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openServiceRequestModal('Custom Inquiry'); } }}
            className="group relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-7 rounded-2xl border border-border/30 bg-bg-card cursor-pointer hover:border-accent/30 transition-all"
          >
            <div className="absolute inset-0 opacity-[0.04] text-accent rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <Building2 className="h-6 w-6 text-accent group-hover:text-accent/80 transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{t('landing.services.customInquiry.label')}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight mb-1">
                {t('landing.services.customInquiry.title')}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {t('landing.services.customInquiry.description')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-accent/60 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
              <Send className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                {t('landing.services.customInquiry.send')}
              </span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
