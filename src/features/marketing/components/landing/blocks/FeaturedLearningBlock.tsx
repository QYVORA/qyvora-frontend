import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getCourseById } from '@/features/student/data/courses/courseData';
import { LABS } from '@/features/student/constants/labs';
import { Card } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';
import Button from '@/shared/components/ui/Button';

const FEATURED_COURSE_ID = 'linux-terminal-101';
const FEATURED_LAB_IDS = ['sqli', 'privesc'];

/**
 * FeaturedLearningBlock — one flagship course and two attack labs, each a
 * filled Card. Links to the public catalogue pages, not gated routes.
 */
const FeaturedLearningBlock: React.FC = () => {
  const course = getCourseById(FEATURED_COURSE_ID);
  const featuredLabs = LABS.filter((lab) => FEATURED_LAB_IDS.includes(lab.id));

  return (
    <section className="w-full bg-canvas">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
                {"Featured learning"}
              </p>
              <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {"Start where foundations begin."}
              </h2>
              <p className="type-body mt-2 max-w-prose">{"A proven first course and two attack labs to get you operating fast."}</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {course && (
            <ScrollReveal className="lg:col-span-2">
              <Card to="/courses" interactive className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
                <div className="flex-1">
                  <p className="type-label mb-2 uppercase tracking-[0.12em] text-text-tertiary">
                    {"Self-Paced Learning"}
                  </p>
                  <h3 className="type-h2 mb-2 font-black uppercase tracking-tight text-text-primary">
                    {course.title}
                  </h3>
                  <p className="type-body-sm">{course.overview}</p>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    <span className="type-meta">{course.lessons.length} {"lessons"}</span>
                    <span className="type-meta">{course.estimatedMinutes} min</span>
                    <span className="type-meta text-accent">{course.cpCost} CP</span>
                  </div>
                </div>
                <span className="flex min-h-[48px] shrink-0 items-center gap-2 text-sm font-bold text-accent md:flex-col md:justify-center">
                  {"Browse courses"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </ScrollReveal>
          )}

          {featuredLabs.map((lab, i) => (
            <ScrollReveal key={lab.id} delay={i * 0.08}>
              <Card to="/labs" interactive className="flex min-h-[200px] flex-col gap-3 p-6">
                <p className="type-label mb-1 uppercase tracking-[0.12em] text-text-tertiary">
                  {"Labs"}
                </p>
                <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {lab.title}
                </h3>
                <p className="type-body-sm flex-1">{lab.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="type-meta">{lab.difficulty}</span>
                  <span className="type-meta text-accent">{lab.cpReward} CP</span>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8">
          <Button to="/learn" variant="ghost">
            {"Browse learning"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLearningBlock;