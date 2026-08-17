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
import LabsCarousel from '@/features/marketing/components/LabsCarousel';

const LABS = [
  { id: 'privesc', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400' },
  { id: 'passwords', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300' },
  { id: 'sqli', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400' },
  { id: 'osint', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'killchain', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600' },
];

const LabsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Attack Labs - QYVORA" description="Hands-on offensive security labs covering privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain." />
      <PublicSnapLayout>
        {/* Hero */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
          <StudentHeroSection
            title="Attack"
            accentWord="Labs"
            titleClassName={PUBLIC_HERO_TITLE_CLASS}
            showGlobe
            typewrite
            description="Real-world offensive security labs in a sandboxed environment. Practice privilege escalation, password attacks, SQL injection, OSINT, and full kill-chain operations."
            stats={[
              { label: 'Labs', value: LABS.length },
              { label: 'CP Range', value: '50-600' },
            ]}
          >
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
            >
              <Zap className="w-4 h-4" /> Start Training <IconArrowRight size={14} />
            </Link>
          </StudentHeroSection>
        </section>

        {/* Labs Carousel — one full section per lab */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <LabsCarousel
            labs={LABS}
            getLabTitle={(id) => t(`student.labs.list.${id}.title`)}
            getLabDescription={(id) => t(`student.labs.list.${id}.description`)}
          />
        </section>

        {/* CTA */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
          <LandingFinalCtaSection user={user} />
        </section>

        {/* Footer */}
        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default LabsPage;
