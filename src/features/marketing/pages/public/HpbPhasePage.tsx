import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { IconArrowLeft, IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { PHASES } from '@/features/marketing/data/learnData';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import RoomCard from './cards/RoomCard';

const HpbPhasePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { phaseId } = useParams<{ phaseId: string }>();
  const [view, setView] = React.useState<ViewMode>('grid');

  const phase = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
  const learnPhase = PHASES.find((p) => p.id === phaseId?.replace('phase', '').padStart(2, '0'));

  if (!phase) return <Navigate to="/hpb" replace />;

  const roomCount = phase.rooms?.length || 0;
  const totalMinutes = (phase.rooms || []).reduce((sum, room) => sum + (room.estimatedMinutes || 0), 0);
  const totalHours = Math.max(1, Math.round((totalMinutes / 60) * 10) / 10);

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${phase.title} - Hacker Protocol Bootcamp`}
        description={learnPhase?.desc ?? `${phase.title} — Hacker Protocol Bootcamp.`}
        breadcrumbName={phase.title}
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
            <div className="md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <div className="relative w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
                <HpbAvatar variant={phase.id as HpbVariant} className="w-full h-auto object-contain" />
              </div>
            </div>
          }
        >
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
            <Zap className="w-4 h-4" /> Enroll Now <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        <PublicSnapSection>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">
                  {t('landing.bootcamp.viewCurriculum')}
                </h3>
                <div className="flex items-center gap-3 shrink-0">
                  <ViewToggle value={view} onChange={setView} label="Rooms view mode" />
                  <Link
                    to="/hpb"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
                  >
                    <IconArrowLeft size={14} /> All Phases
                  </Link>
                </div>
              </div>

              <CardCollection
                view={view}
                items={phase.rooms}
                keyOf={(room) => room.id}
                gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                renderItem={(room, itemView, index) => (
                  <ScrollReveal amount={0.05}>
                    <RoomCard room={room} roomIndex={index} view={itemView} />
                  </ScrollReveal>
                )}
              />
            </div>
        </PublicSnapSection>

        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default HpbPhasePage;
