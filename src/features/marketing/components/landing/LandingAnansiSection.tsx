import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { PHASES } from '@/features/marketing/data/anansiData';
import { Carousel } from '@/shared/components/carousel';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import { useTranslation } from 'react-i18next';

const LandingAnansiSection = () => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-6 overflow-hidden">
            <img src={anansiLogo} alt="Anansi logo" width={623} height={576} className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-6">
            {t('landing.anansi.title')} <span className="text-accent">{t('landing.anansi.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-8">
            {t('landing.anansi.description')}
          </p>
          <Link
            to="/anansi"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border/30 bg-bg-elevated text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-card transition-colors w-fit"
          >
            {t('landing.anansi.explore')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Content column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col gap-6 lg:justify-center">
          {/* Pipeline carousel */}
          <ScrollReveal direction="up">
            <Carousel
              slides={PHASES}
              showArrows={false}
              renderCard={(item) => (
                <div className="relative min-h-[300px] md:min-h-[440px] overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10 bg-bg rounded-2xl border border-border/30">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-accent">
                      {t('landing.anansi.phaseLabel')} {item.id}
                    </span>
                  </div>
                  <h3 className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-text-primary">
                    {item.name}
                  </h3>
                  <p className="max-w-xl text-xs sm:text-sm md:text-base text-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )}
            />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default LandingAnansiSection;
