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
import { COURSES } from '@/features/student/data/courses';
import { BatchPagination } from '@/shared/components/ui';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import CourseCard from './cards/CourseCard';

const BATCH_SIZE = 3;

const CoursesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [view, setView] = useState<ViewMode>('grid');

  const totalPages = Math.ceil(COURSES.length / BATCH_SIZE);
  const currentBatch = COURSES.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Courses - QYVORA" description="Master offensive security with QYVORA's structured courses." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
        <StudentHeroSection
          title="Offensive"
          accentWord="Courses"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Structured offensive security courses from terminal mastery to web exploitation."
        />
        </section>

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0">
            <div className="flex items-center justify-end pb-3 shrink-0">
              <ViewToggle value={view} onChange={setView} label="Courses view mode" />
            </div>
            <CardCollection
              view={view}
              items={currentBatch}
              keyOf={(course) => course.id}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch"
              renderItem={(course) => (
                <ScrollReveal amount={0.05} className="h-full">
                  <CourseCard course={course} view={view} />
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

export default CoursesPage;
