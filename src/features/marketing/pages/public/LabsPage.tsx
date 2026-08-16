import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { BatchPagination } from '@/shared/components/ui';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import LabCard from './cards/LabCard';

const LABS = [
  { id: 'privesc', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400' },
  { id: 'passwords', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300' },
  { id: 'sqli', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400' },
  { id: 'osint', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'killchain', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600' },
];

const BATCH_SIZE = 3;

const LabsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [view, setView] = useState<ViewMode>('grid');

  const totalPages = Math.ceil(LABS.length / BATCH_SIZE);
  const currentBatch = LABS.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Attack Labs - QYVORA" description="Hands-on offensive security labs covering privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain." />
      <PublicSnapLayout>
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

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0">
            <div className="flex items-center justify-end pb-3 shrink-0">
              <ViewToggle value={view} onChange={setView} label="Labs view mode" />
            </div>
            <CardCollection
              view={view}
              items={currentBatch}
              keyOf={(lab) => lab.id}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch"
              renderItem={(lab) => (
                <ScrollReveal amount={0.05} className="h-full">
                  <LabCard
                    lab={{
                      ...lab,
                      title: t(`student.labs.list.${lab.id}.title`),
                      description: t(`student.labs.list.${lab.id}.description`),
                    }}
                    view={view}
                  />
                </ScrollReveal>
              )}
            />
            <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </PublicSnapSection>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default LabsPage;
