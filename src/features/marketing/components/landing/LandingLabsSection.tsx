import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

import { IconArrowRight } from '@/shared/components/icons';
import { DottedMapOverlay } from '@/shared/components/ui';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
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

/* ── Lab card for the horizontal marquee — fixed height, stable content ──── */
const LabCard: React.FC<{ lab: Lab }> = ({ lab }) => {
  const { t } = useTranslation();

  return (
    <Link
      to="/dashboard/labs"
      className="group relative block h-[280px] sm:h-[320px] w-[min(80vw,340px)] sm:w-[min(52vw,380px)] md:w-[min(42vw,430px)] lg:w-[min(36vw,470px)] xl:w-[min(31vw,520px)] shrink-0 card-accent bg-bg-card overflow-hidden transition-colors duration-300"
    >
      <DottedMapOverlay className="rounded-2xl" />
      <div className="relative z-10 h-full flex flex-col p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="self-start text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/50 bg-bg-elevated text-text-muted">
            {t(`landing.labs.list.${lab.id}.cp`)}
          </span>
          <LabBadge labId={lab.id} accentColor={lab.accentColor} className="w-14 h-14 shrink-0" />
        </div>

        <div className="mt-auto">
          <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tighter leading-none">
            {t(`landing.labs.list.${lab.id}.title`)}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 min-h-[2.6em]">
            {t(`landing.labs.list.${lab.id}.desc`)}
          </p>

          <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.labs.launchLab')}</span>
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const LandingLabsSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-x-clip overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col gap-8 lg:gap-12">
        <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tighter leading-none shrink-0">
          {t('landing.labs.heading1')} <span className="text-accent">{t('landing.labs.heading2')}</span>
        </h2>

        {shouldReduceMotion ? (
          /* Reduced motion — static responsive grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LABS.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          /* Infinite horizontal marquee — grabbable strip, cards fill it fully */
          <div className="relative -mx-3 md:-mx-4 lg:-mx-6 flex-1 min-h-[360px] sm:min-h-0 min-w-0 overflow-x-clip overflow-y-visible flex items-center py-3">
            <DragMarquee speed={22} trackClassName="gap-4 md:gap-5 pr-4 md:pr-5" className="w-full">
              {LABS.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </DragMarquee>
          </div>
        )}

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
