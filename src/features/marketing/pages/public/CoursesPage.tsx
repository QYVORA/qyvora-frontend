import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { COURSES } from '@/features/student/data/courses';
import CoursesCarousel from '@/features/marketing/components/CoursesCarousel';

const CoursesPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Courses - QYVORA" description="Master offensive security with QYVORA's structured courses." />
      <PublicSnapLayout>
        {/* Hero */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
          <StudentHeroSection
            title="Offensive"
            accentWord="Courses"
            titleClassName={PUBLIC_HERO_TITLE_CLASS}
            showGlobe
            typewrite
            description="Structured offensive security courses from terminal mastery to web exploitation."
          >
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Zap className="w-4 h-4" /> Get Started <IconArrowRight size={14} />
            </Link>
          </StudentHeroSection>
        </section>

        {/* Courses Carousel — one full section per course */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <CoursesCarousel courses={COURSES} />
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

export default CoursesPage;
