import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Zap } from 'lucide-react';
import { IconArrowLeft, IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { PHASES } from '@/features/marketing/data/learnData';

const HpbPhasePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { phaseId } = useParams<{ phaseId: string }>();

  const phase = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
  const learnPhase = PHASES.find((p) => p.id === phaseId?.replace('phase', ''));

  if (!phase) return <Navigate to="/hpb" replace />;

  const roomCount = phase.rooms?.length || 0;
  const totalMinutes = (phase.rooms || []).reduce((sum, room) => sum + (room.estimatedMinutes || 0), 0);
  const totalHours = Math.max(1, Math.round((totalMinutes / 60) * 10) / 10);

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${phase.title} - HPB - QYVORA`}
        description={learnPhase?.desc ?? `${phase.title} — Hacker Protocol Bootcamp.`}
      />
      <PublicSnapLayout>
        <StudentHeroSection
          title={phase.title}
          accentWord={phase.codename}
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description={learnPhase?.desc ?? `${phase.title} — Hacker Protocol Bootcamp.`}
          stats={[
            { label: 'Rooms', value: roomCount },
            { label: 'Est. Time', value: `${totalHours}h` },
          ]}
          rightContent={
            <div className="hidden lg:flex items-center justify-center w-full h-full">
              <div className="relative w-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
                <HpbAvatar variant={phase.id as HpbVariant} className="w-full h-auto object-contain" />
              </div>
            </div>
          }
        >
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
            <Zap className="w-4 h-4" /> Enroll Now <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">
                  {t('landing.bootcamp.viewCurriculum')}
                </h3>
                <Link
                  to="/hpb"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
                >
                  <IconArrowLeft size={14} /> All Phases
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                {phase.rooms.map((room, idx) => (
                  <ScrollReveal key={room.id} amount={0.05}>
                    <div className="relative h-full rounded-2xl border border-border/30 bg-bg-card p-3 md:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col">
                      <span className="self-start text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border border-accent/20 bg-accent/10 text-accent">
                        Room {idx + 1}
                      </span>

                      <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary tracking-tight leading-snug mb-1 mt-2">
                        {room.title}
                      </h4>

                      <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3">
                        {room.overview}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {room.estimatedMinutes} min
                        </span>
                        <Link
                          to="/register"
                          className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95"
                        >
                          {t('landing.bootcamp.startPhase')}
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

export default HpbPhasePage;
