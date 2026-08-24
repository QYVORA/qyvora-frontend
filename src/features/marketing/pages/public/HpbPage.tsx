import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { PHASES } from '@/features/marketing/data/learnData';

const HpbPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title="Hacker Protocol Bootcamp"
        description="Train as an offensive security operator across 5 phases, hacker mindset, Linux foundations, networking, web & backend, and social engineering."
      />
      <PublicSnapLayout>
        {/* Hero */}
        <section id="hero" className="relative w-full min-h-dvh snap-section bg-bg">
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
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Zap className="w-4 h-4" /> Enroll Now <IconArrowRight size={14} />
            </Link>
          </StudentHeroSection>
        </section>

        {/* One full-viewport section per phase */}
        {phases.map((phase, idx) => {
          const learnPhase = PHASES.find((p) => p.id === phase.id.replace('phase', '').padStart(2, '0'));
          const minutes = (phase.rooms || []).reduce((sum, room) => sum + (room.estimatedMinutes || 0), 0);
          const hours = Math.max(1, Math.round((minutes / 60) * 10) / 10);

          return (
            <section
              key={phase.id}
              id={phase.id}
              className={`relative w-full min-h-dvh snap-section flex items-center ${
                idx % 2 === 0 ? 'bg-bg-alt' : 'bg-bg'
              }`}
            >
              <div className="w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-6 lg:gap-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                    Phase {idx + 1}
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-tight mt-2">
                    {phase.title}
                  </h2>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 max-w-xl">
                    {learnPhase?.desc ?? phase.codename}
                  </p>

                  <div className="flex items-center gap-4 sm:gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl md:text-2xl font-black text-text-primary">
                        {phase.rooms?.length || 0}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                        Rooms
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl md:text-2xl font-black text-text-primary">
                        {hours}h
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                        Est. Time
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/hpb/${phase.id}`}
                    className="btn-primary inline-flex items-center gap-2 mt-8 self-start px-6 py-2.5"
                  >
                    Explore Phase {idx + 1} <IconArrowRight size={14} />
                  </Link>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                  <HpbAvatar variant={phase.id as HpbVariant} className="w-full max-w-[320px] h-auto" />
                </div>
              </div>
            </section>
          );
        })}

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

export default HpbPage;
