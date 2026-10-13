import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Coins, ListOrdered, Target } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import CourseBadge from '@/shared/components/CourseBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { getCourseById, getCategoryById } from '@/features/student/data/courses';
import type { SkillLevel, Course } from '@/features/student/data/courses';
import { buildCourse } from '@/shared/seo/schema';

const SKILL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/**
 * Resolves a prerequisite entry back to its course page when the value is a
 * course id (the convention in the course data), falling back to the raw text
 * so an unlinked prerequisite is still readable.
 */
const resolvePrerequisite = (value: string): { label: string; to?: string } => {
  const course = getCourseById(value);
  return course ? { label: course.title, to: `/courses/${course.id}` } : { label: value };
};

/**
 * CourseNotFound — real not-found state for unknown course ids. Indexable
 * surfaces keep `noindex` so the 404 never competes with the course index.
 */
const CourseNotFound = () => (
  <div className="w-full bg-canvas">
    <SEO title="Course Not Found" description="The requested course could not be located on the QYVORA network." noindex />
    <PublicContainer className="flex min-h-dvh flex-col pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
      <div className="my-auto flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-surface-raised text-accent" aria-hidden="true">
          <BookOpen className="h-8 w-8" />
        </span>
        <p className="mt-6 text-kicker font-black uppercase tracking-[0.3em] text-accent">
          {"Course not found"}
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
          {"No such transmission"}
        </h1>
        <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-text-secondary md:text-base">
          {"The course you requested does not exist, or it has moved to a new address. Browse the full course catalogue to find where you are going."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/learn" size="lg">
            {"Browse all courses"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button to="/" variant="secondary" size="lg">
            {"Return to base"}
          </Button>
        </div>
      </div>
    </PublicContainer>
  </div>
);

interface CourseFactProps {
  label: string;
  value: string;
}

/**
 * CourseFact — one labelled stat tile in the facts strip. The strip is a
 * single filled card so the page never collapses into isolated fragments.
 */
const CourseFact: React.FC<CourseFactProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="font-mono text-xl font-black tabular-nums leading-none text-text-primary md:text-2xl">
      {value}
    </span>
    <span className="text-xs font-bold uppercase tracking-widest text-text-tertiary">{label}</span>
  </div>
);

const sectionHeading = 'text-kicker font-black uppercase tracking-[0.3em] text-accent';

/**
 * CoursePage — the public course info page for `/courses/:courseId`.
 *
 * Every published course renders real content pulled straight from the course
 * record. Only public-facing fields are shown: overview, key facts, learning
 * objectives, prerequisites and the lesson titles in the syllabus. Lesson
 * bodies, quizzes, answer keys and playground solutions are never rendered
 * here — that material stays behind the authenticated dashboard.
 */
const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourseById(courseId) : undefined;

  if (!course) return <CourseNotFound />;

  const category = getCategoryById(course.categoryId);
  const lessonCount = course.lessons.length || course.lessonCount || 0;
  const prerequisites = (course.prerequisites ?? []).map(resolvePrerequisite);

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={course.title}
        description={course.description || course.overview}
        canonical={`/courses/${course.id}`}
        breadcrumbName={course.title}
        schemaData={buildCourse(course)}
      />

      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section aria-labelledby="course-hero-title" className="border-b border-border-subtle pb-10 md:pb-14">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="flex items-center justify-center lg:col-span-4 lg:justify-start">
              <CourseBadge courseId={course.id} className="h-40 w-40 md:h-56 md:w-56" />
            </div>

            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                {category && <Badge variant="accent">{category.name}</Badge>}
                <DifficultyBadge difficulty={course.skillLevel} />
                {course.popular && <Badge variant="info">{"Popular"}</Badge>}
              </div>

              <h1
                id="course-hero-title"
                className="mt-4 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl lg:text-6xl"
              >
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3 font-mono text-sm text-text-muted">
                <Button to="/register" size="lg">
                  {"Enroll now"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button to="/learn" variant="ghost" size="lg">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {"Back to learn"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key facts ────────────────────────────────────────── */}
        <section aria-label="Course facts" className="mt-10">
          <Card className="p-6 md:p-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <CourseFact label="Estimated time" value={`${course.estimatedMinutes} min`} />
              <CourseFact label="Lessons" value={String(lessonCount)} />
              <CourseFact label="Cost" value={`${course.cpCost} CP`} />
              <CourseFact label="Skill level" value={SKILL_LABELS[course.skillLevel]} />
            </div>
          </Card>
        </section>

        {/* ── Overview ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section aria-labelledby="course-overview-title" className="mt-14 md:mt-20">
            <div className="mb-6 grid gap-6 md:mb-8 lg:grid-cols-2 lg:gap-5">
              <Card className="flex flex-col gap-3 p-6 md:p-8">
                <span className={sectionHeading}>{"Overview"}</span>
                <p className="type-body text-text-secondary">{course.overview}</p>
              </Card>

              <Card className="flex flex-col gap-4 p-6 md:p-8">
                <span className={sectionHeading}>{"What you will learn"}</span>
                <ul className="flex flex-col gap-3">
                  {course.learningObjectives.map((objective) => (
                    <li key={objective} className="flex gap-3">
                      <Target
                        className="mt-1.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span className="type-body-sm text-text-secondary">{objective}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Prerequisites ────────────────────────────────────── */}
        <ScrollReveal>
          <section aria-labelledby="course-prerequisites-title" className="mt-10 md:mt-14">
            <Card className="p-6 md:p-8">
              <span id="course-prerequisites-title" className="block font-mono text-sm font-black uppercase tracking-widest text-accent">
                {"Prerequisites"}
              </span>
              {prerequisites.length > 0 ? (
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {prerequisites.map(({ label, to }) => (
                    <li key={label}>
                      {to ? (
                        <Link
                          to={to}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-raised px-4 py-3 transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          <span className="type-body-sm text-text-secondary group-hover:text-text-primary">{label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        </Link>
                      ) : (
                        <span className="type-body-sm flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-raised px-4 py-3 text-text-secondary">
                          {label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 type-body-sm text-text-secondary">
                  {"None — you can start this course with no prior knowledge."}
                </p>
              )}
            </Card>
          </section>
        </ScrollReveal>

        {/* ── Syllabus (titles only) ───────────────────────────── */}
        <ScrollReveal>
          <section aria-labelledby="course-syllabus-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className={sectionHeading}>{"Syllabus"}</span>
              <h2
                id="course-syllabus-title"
                className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
              >
                {"What the course covers"}
              </h2>
              <p className="type-body mt-3 max-w-2xl text-text-secondary">
                {"A structured path through every lesson. The full instruction, checkpoints and exercises live inside the course once you enroll."}
              </p>
            </div>

            <Card className="overflow-hidden">
              <ol className="divide-y divide-border-subtle">
                {course.lessons.map((lesson, index) => (
                  <li key={lesson.id} className="flex items-center gap-4 px-5 py-4 md:px-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 font-mono text-sm font-black tabular-nums text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-sm text-text-primary md:text-base">
                      {lesson.title}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </ScrollReveal>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <ScrollReveal>
          <section aria-labelledby="course-cta-title" className="mt-14 md:mt-20">
            <Card className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 font-mono text-sm font-black uppercase tracking-widest text-accent">
                  <Coins className="h-4 w-4" aria-hidden="true" />
                  <ListOrdered className="h-4 w-4" aria-hidden="true" />
                  {"Start this course"}
                </span>
                <h2 id="course-cta-title" className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {"Unlock it for "}
                  {course.cpCost}
                  {" CP"}
                </h2>
                <p className="type-body-sm max-w-xl text-text-secondary">
                  {"Create a free QYVORA account and begin learning. Every completed lesson and passed checkpoint earns CP on your verified profile."}
                </p>
              </div>
              <Button to="/register" size="lg" className="shrink-0">
                {"Create account"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Card>
          </section>
        </ScrollReveal>
      </PublicContainer>
    </div>
  );
};

export default CoursePage;