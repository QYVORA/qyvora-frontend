import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

const HpbPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title="Hacker Protocol Bootcamp"
        description="Train as an offensive security operator across 5 phases — hacker mindset, Linux foundations, networking, web & backend, and social engineering."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Hacker Protocol Bootcamp', item: '/hpb' },
        ]}
      />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Hacker Protocol"
          accentWord="Bootcamp"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="A phased offensive security curriculum designed to take you from operator to expert."
          stats={[
            { label: 'Phases', value: phases.length },
            { label: 'Duration', value: '12 weeks' },
          ]}
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Zap className="w-4 h-4" /> Enroll Now <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Curriculum</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
            {phases.map((phase, idx) => (
              <ScrollReveal key={phase.id} amount={0.05}>
                <div className="group/card relative aspect-square rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-accent/20 bg-accent/10 text-accent">
                      Phase {idx + 1}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary tracking-tight mb-1 leading-snug">
                    {phase.title}
                  </h4>

                  <div className="flex-1 min-h-0 mb-2 flex flex-col">
                    <div className="flex-1 min-h-[72px] w-full flex items-center justify-center">
                      <HpbAvatar
                        variant={phase.id as HpbVariant}
                        className="h-full w-auto max-h-full max-w-full"
                      />
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3">
                      {phase.codename}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> {phase.rooms?.length || 0} rooms
                    </span>
                    <Link
                      to={`/hpb/${phase.id}`}
                      className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          </div>
          </div>
        </div>
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default HpbPage;
