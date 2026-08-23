import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { IconArrowLeft, IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { PHASES } from '@/features/marketing/data/learnData';
import RoomSection from './cards/RoomSection';

const HpbPhasePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { phaseId } = useParams<{ phaseId: string }>();

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
        {/* Phase hero */}
        <section id={phase.id} className="relative w-full min-h-dvh snap-section bg-bg">
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
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
                <Zap className="w-4 h-4" /> Enroll Now <IconArrowRight size={14} />
              </Link>
              <Link to="/hpb" className="btn-secondary inline-flex items-center gap-2 px-6 py-2.5">
                <IconArrowLeft size={14} /> All Phases
              </Link>
            </div>
          </StudentHeroSection>
        </section>

        {/* One full-viewport section per room */}
        {phase.rooms.map((room, index) => (
          <section
            key={room.id}
            id={room.id}
            className={`relative w-full min-h-dvh snap-section flex items-center ${
              index % 2 === 0 ? 'bg-bg-alt' : 'bg-bg'
            }`}
          >
            <RoomSection room={room} roomIndex={index} />
          </section>
        ))}

        {/* CTA */}
        <section id="cta" className="relative w-full min-h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        {/* Footer */}
        <section id="footer" className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default HpbPhasePage;
