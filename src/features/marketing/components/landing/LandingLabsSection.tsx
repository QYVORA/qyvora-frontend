import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

import { IconArrowRight } from '@/shared/components/icons';
import { DottedMapOverlay } from '@/shared/components/ui';
import { Carousel } from '@/shared/components/carousel';
import { useTranslation } from 'react-i18next';
import LabBadge from '@/shared/components/LabBadge';

const LABS = [
  { id: 'privesc', accentColor: '#FBBF24' },
  { id: 'passwords', accentColor: '#F59E0B' },
  { id: 'sqli', accentColor: '#06B66F' },
  { id: 'osint', accentColor: '#0EA5E9' },
  { id: 'killchain', accentColor: '#DC2626' },
];

type Lab = (typeof LABS)[number];

/* ── Lab card for the single-card content-switch carousel — text left, badge right ── */
const LabCard: React.FC<{ lab: Lab }> = ({ lab }) => {
  const { t } = useTranslation();

  return (
    <Link
      to="/dashboard/labs"
      className="group relative flex flex-col md:flex-row bg-bg-card overflow-hidden h-full min-h-[520px] sm:min-h-[480px] lg:min-h-[460px] transition-[background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:bg-bg-elevated"
    >
      <DottedMapOverlay className="rounded-2xl" />

      {/* Text region */}
      <div className="relative z-10 flex flex-col items-start text-left p-5 sm:p-6 md:p-7 flex-1 min-w-0">
        <span className="self-start text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/50 bg-bg-elevated text-text-muted">
          {t(`landing.labs.list.${lab.id}.cp`)}
        </span>

        <div className="mt-auto pt-4 w-full">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-text-primary tracking-tighter leading-none">
            {t(`landing.labs.list.${lab.id}.title`)}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 md:line-clamp-3">
            {t(`landing.labs.list.${lab.id}.desc`)}
          </p>

          <div className="mt-3 pt-3 flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.labs.launchLab')}</span>
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Visual region — the lab insignia at meaningful scale, no glow */}
      <div className="relative z-10 shrink-0 flex items-center justify-center border-t md:border-t-0 md:border-l border-border/50 bg-bg-elevated min-h-[180px] md:min-h-0 md:w-[220px] lg:w-[260px] p-6 sm:p-8">
        <LabBadge labId={lab.id} accentColor={lab.accentColor} glow={false} className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0" />
      </div>
    </Link>
  );
};

const LandingLabsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative bg-bg min-h-dvh flex flex-col overflow-x-clip" >
      <div className="relative z-10 w-full flex-1 min-h-0 px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col gap-8 lg:gap-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-[0.95] shrink-0">
          {t('landing.labs.heading1')} <span className="text-accent">{t('landing.labs.heading2')}</span>
        </h2>

        {/* Single-card content-switch carousel — stable viewport while slides swap */}
        <div className="relative flex-1 min-h-0 min-w-0 flex items-center overflow-x-clip">
          <Carousel
            slides={LABS}
            className="w-full"
            renderCard={(lab) => (
              <LabCard lab={lab} />
            )}
          />
        </div>

        {/* Footer */}
        <div className="shrink-0">
          <Link
            to="/dashboard/labs"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
          >
            {t('landing.labs.viewAll')} <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LandingLabsSection);