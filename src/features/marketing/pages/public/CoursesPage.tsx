import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { LearningCatalogue } from '@/shared/components/learning';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import { COURSES } from '@/features/student/data/courses';
import CourseBadge from '@/shared/components/CourseBadge';

const CoursesPage = () => {

  const items: LearningCatalogueItem[] = COURSES.map((course) => ({
    key: course.id,
    type: 'course',
    to: `/dashboard/courses/${course.id}`,
    badge: <CourseBadge courseId={course.id} className="w-14 h-14 shrink-0" />,
    title: course.title,
    description: course.overview,
    difficulty: course.skillLevel,
    duration: `${course.estimatedMinutes} min`,
    lessonsCount: course.lessons.length,
    price: `${course.cpCost} CP`,
    actionLabel: "Start Course",
  }));

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Courses | QYVORA"}
        description={"Master offensive security with QYVORA"}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Learn"}
          title={"Courses"}
          description={"Structured offensive security courses from terminal mastery to web exploitation. Start free and progress with Cyber Coin."}
          actions={
            <Button to="/register">
              {"Start free"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <LearningCatalogue
          className="mt-10"
          items={items}
          showSearch
          searchPlaceholder={"Search courses..."}
          emptyTitle={"No courses match this filter"}
          emptyDescription={"Try a different difficulty or check back soon: new courses ship frequently."}
        />
      </PublicContainer>
    </div>
  );
};

export default CoursesPage;