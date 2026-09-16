import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { LearningCatalogue } from '@/shared/components/learning';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import { COURSES, COURSE_ICON_MAP } from '@/features/student/data/courses';

const CoursesPage = () => {
  const { t } = useTranslation();

  const items: LearningCatalogueItem[] = COURSES.map((course) => {
    const cfg = COURSE_ICON_MAP[course.id];
    return {
      key: course.id,
      type: 'course',
      to: `/dashboard/courses/${course.id}`,
      icon: cfg ? <cfg.icon className="h-5 w-5" /> : undefined,
      title: course.title,
      description: course.overview,
      difficulty: course.skillLevel,
      duration: `${course.estimatedMinutes} min`,
      lessonsCount: course.lessons.length,
      price: `${course.cpCost} CP`,
      actionLabel: t('coursesPage.cardCta', 'Start Course'),
    };
  });

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={t('coursesPage.seo.title', 'Courses | QYVORA')}
        description={t('coursesPage.seo.description', "Master offensive security with QYVORA's structured courses.")}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={t('coursesPage.kicker', 'QYVORA · Learn')}
          title={t('coursesPage.title', 'Courses')}
          description={t(
            'coursesPage.description',
            'Structured offensive security courses from terminal mastery to web exploitation. Start free and progress with Cyber Coin.',
          )}
          actions={
            <Button to="/register">
              {t('coursesPage.cta', 'Start free')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <LearningCatalogue
          className="mt-10"
          items={items}
          showSearch
          searchPlaceholder={t('coursesPage.searchPlaceholder', 'Search courses...')}
          emptyTitle={t('coursesPage.empty.title', 'No courses match this filter')}
          emptyDescription={t(
            'coursesPage.empty.description',
            'Try a different difficulty or check back soon — new courses ship frequently.',
          )}
        />
      </div>
    </div>
  );
};

export default CoursesPage;