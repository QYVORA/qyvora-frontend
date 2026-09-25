import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Target, Terminal } from 'lucide-react';
import { FadeIn, EmptyState } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import { getCourseById, getCategoryById } from '@/features/student/data/courses';
import { EducationalMarkdownRenderer } from '@/shared/components/courses/CodeBlockRenderer';
import InlineQuiz from '@/shared/components/courses/InlineQuiz';
import CodePlayground from '@/shared/components/courses/CodePlayground';
import { CommandBlock } from '@/shared/components/walkthrough/StepParts';
import StepRenderer from '@/shared/components/learning/StepRenderer';
import LearningNav from '@/shared/components/learning/LearningNav';
import FocusedStepList from '@/shared/components/learning/FocusedStepList';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import { CourseLessonSkeleton } from '@/features/student/components/StudentSkeletons';
import api from '@/core/services/api';
import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import Button from '@/shared/components/ui/Button';
import type { Lesson } from '@/features/student/data/courses';

const STORAGE_KEY = 'qyvora_course_progress';

const LessonViewer: React.FC<{
  lesson: Lesson;
  number: number;
  isActive: boolean;
  isCompleted: boolean;
  courseId?: string;
  backUrl?: string;
  showBack?: boolean;
}> = ({ lesson, number, isActive, isCompleted, courseId, backUrl, showBack }) => {
  return (
    <StepRenderer
      stepNumber={number}
      title={lesson.title}
      isActive={isActive}
      isCompleted={isCompleted}
      backUrl={showBack ? backUrl : undefined}
      backLabel="Back to Courses"
      badges={
        <>
          {lesson.hasQuiz && (
            <span className="px-1.5 py-0.5 rounded-lg bg-accent/10 text-xs font-black uppercase tracking-widest text-accent">CHECKPOINT</span>
          )}
          {lesson.hasCodePlayground && (
            <span className="px-1.5 py-0.5 rounded-lg bg-accent/10 text-xs font-black uppercase tracking-widest text-accent">CODE</span>
          )}
        </>
      }
    >
      <div className="text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 max-w-none overflow-x-auto">
        <EducationalMarkdownRenderer text={lesson.instruction} />
      </div>

      {lesson.hasTerminal && lesson.terminalCommands && lesson.terminalCommands.length > 0 && (
        <div className="mt-8 md:mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="h-4 w-4 text-accent" />
            <span className="text-xs font-black uppercase tracking-widest text-accent">Terminal</span>
          </div>
          <div className="space-y-3">
            {lesson.terminalCommands.map((cmd, ci) => (
              <CommandBlock key={ci} command={cmd} labId={courseId || 'course'} showConnect={false} />
            ))}
          </div>
        </div>
      )}

      {lesson.hasCodePlayground && (
        <div className="mt-8 md:mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-xs font-black uppercase tracking-widest text-accent">Code Playground</span>
          </div>
          <CodePlayground
            initialCode={lesson.codePlaygroundInitial || ''}
            language={lesson.codePlaygroundLanguage || 'python'}
            expectedOutput={lesson.codePlaygroundExpectedOutput}
            title={lesson.title}
          />
        </div>
      )}

      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="mt-10 md:mt-14">
          <InlineQuiz
            questions={lesson.quiz}
            title={`Checkpoint: ${lesson.title}`}
          />
        </div>
      )}
    </StepRenderer>
  );
};

const CourseLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const course = getCourseById(courseId || '');

  const [purchased, setPurchased] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [resumeIdx, setResumeIdx] = useState<number | null>(null);

  const totalLessons = course?.lessons.length ?? 0;

  useEffect(() => {
    if (!courseId) { setCheckingAccess(false); return; }
    const saved = localStorage.getItem(`${STORAGE_KEY}_${courseId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedLessons(new Set(parsed.completedLessons));
        setResumeIdx(Number(parsed.lastLesson) || 0);
      } catch {}
    }
    api.get('/cp/transactions?limit=100').then((r) => {
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      const purchasedIds = new Set(items.filter((tx: any) => tx.type === 'purchase').map((tx: any) => {
        return tx.metadata?.slug || tx.metadata?.courseId || String(tx.productId);
      }));
      setPurchased(purchasedIds.has(courseId || ''));
    }).catch(() => {
      setPurchased(false);
    }).finally(() => setCheckingAccess(false));
  }, [courseId]);

  const lessonParam = Number(searchParams.get('lesson'));
  const lessonParamValid = Number.isInteger(lessonParam) && lessonParam >= 0 && lessonParam < totalLessons;
  const currentLessonIdx = lessonParamValid
    ? lessonParam
    : resumeIdx !== null
      ? Math.min(resumeIdx, Math.max(totalLessons - 1, 0))
      : 0;

  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allComplete = totalLessons > 0 && completedLessons.size === totalLessons;
  const [celebrationOpen, setCelebrationOpen] = useCelebrationTrigger(allComplete);
  const prefersReducedMotion = useReducedMotion();

  const scrollToLesson = useCallback((idx: number) => {
    if (totalLessons === 0) return;
    const clamped = Math.max(0, Math.min(idx, totalLessons - 1));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('lesson', String(clamped));
      return next;
    }, { replace: true });
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    const attemptScroll = (tries = 0) => {
      if (tries > 20) return;
      const el = document.getElementById(`lesson-${clamped + 1}`);
      if (el) el.scrollIntoView({ behavior, block: 'start' });
      else window.setTimeout(() => attemptScroll(tries + 1), 50);
    };
    requestAnimationFrame(() => attemptScroll());
  }, [totalLessons, setSearchParams, prefersReducedMotion]);

  const saveProgress = useCallback((lessons: Set<string>, idx: number) => {
    if (!courseId) return;
    localStorage.setItem(`${STORAGE_KEY}_${courseId}`, JSON.stringify({
      completedLessons: [...lessons],
      lastLesson: idx,
    }));
  }, [courseId]);

  const markComplete = useCallback(() => {
    const lesson = course?.lessons[currentLessonIdx];
    if (!lesson) return;
    const next = new Set([...completedLessons, lesson.id]);
    setCompletedLessons(next);
    saveProgress(next, currentLessonIdx);
  }, [course, completedLessons, currentLessonIdx, saveProgress]);

  const goNext = useCallback(() => {
    if (currentLessonIdx < totalLessons - 1) scrollToLesson(currentLessonIdx + 1);
  }, [currentLessonIdx, totalLessons, scrollToLesson]);

  const goPrev = useCallback(() => {
    if (currentLessonIdx > 0) scrollToLesson(currentLessonIdx - 1);
  }, [currentLessonIdx, scrollToLesson]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, input, textarea, select, [role="button"], [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Scroll to initial lesson on mount
  useEffect(() => {
    if (lessonParamValid) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`lesson-${lessonParam + 1}`);
        if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lessonParamValid, lessonParam, prefersReducedMotion]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('course:updateMeta', {
      detail: {
        currentLessonIdx,
        totalLessons,
        progress,
      },
    }));
  }, [currentLessonIdx, totalLessons, progress]);

  if (!course) {
    return (
      <div className="min-h-dvh w-full bg-canvas px-3 py-16 md:px-4 lg:px-6">
        <EmptyState
          title={"Course not found."}
          description={"The course you are looking for does not exist or was removed."}
          action={
            <Button to="/dashboard/courses" variant="secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {"Back to My Courses"}
            </Button>
          }
        />
      </div>
    );
  }

  if (checkingAccess) {
    return <CourseLessonSkeleton />;
  }

  if (!purchased) {
    return (
      <div className="min-h-dvh w-full bg-canvas px-3 py-16 md:px-4 lg:px-6">
        <EmptyState
          icon={<Lock className="h-6 w-6" aria-hidden="true" />}
          title={"Course Not Unlocked"}
          description={`You have not unlocked ${course.title} yet. Unlock it from the marketplace to start learning.`}
          action={
            <Button to="/dashboard/marketplace">
              {"Unlock Course"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
      </div>
    );
  }

  const category = getCategoryById(course.categoryId);

  return (
    <FadeIn>
      <div className="w-full bg-canvas">
        <SEO title={course.title} description={course.description} noindex />

        <CelebrationModal
          open={celebrationOpen}
          onClose={() => setCelebrationOpen(false)}
          badge={"Course Complete"}
          title={"Course Complete"}
          description={`You completed every lesson in ${course.title}. Outstanding work.`}
          ctaLabel={"Continue"}
        />

        <LearningWorkspaceShell
          kicker={category?.name}
          title={course.title}
          description={course.description}
          backTo="/dashboard/courses"
          backLabel={"Back to My Courses"}
          stats={[
            { label: "Progress", value: `${progress}%`, accent: true },
            { label: "Lessons", value: `${completedCount}/${totalLessons}` },
            { label: "CP cost", value: `${course.cpCost} CP` },
            { label: "Level", value: course.skillLevel },
          ]}
          progress={{
            value: progress,
            label: `${completedCount}/${totalLessons}`,
          }}
        >
          {/* All lessons on one page — focused presentation */}
          <FocusedStepList
            idPrefix="lesson"
            items={course.lessons.map((lesson, i) => ({
              index: i,
              number: i + 1,
              title: lesson.title,
              isActive: i === currentLessonIdx,
              isCompleted: completedLessons.has(lesson.id),
              isLocked: false,
            }))}
            onSelect={(i) => scrollToLesson(i)}
            renderActive={(i) => (
              <LessonViewer
                lesson={course.lessons[i]}
                number={i + 1}
                isActive
                isCompleted={completedLessons.has(course.lessons[i].id)}
                courseId={courseId}
                backUrl="/dashboard/courses"
                showBack={i === 0}
              />
            )}
          />

          <LearningNav
            currentStep={currentLessonIdx}
            totalSteps={totalLessons}
            isLastStep={currentLessonIdx === totalLessons - 1}
            isComplete={allComplete}
            onPrev={currentLessonIdx > 0 ? goPrev : undefined}
            onNext={currentLessonIdx < totalLessons - 1 ? goNext : undefined}
            onComplete={!allComplete && !completedLessons.has(course.lessons[currentLessonIdx]?.id) ? markComplete : undefined}
            completeLabel={"Complete"}
            nextLabel="Next Lesson"
            nextLabelMobile="Next"
            finishContent={
              <Link
                to="/dashboard/courses"
                className="btn-primary inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none !rounded-xl !text-xs !font-black !uppercase !tracking-widest px-5 py-2.5"
              >
                <span>Back to Courses</span>
                <ArrowRight className="h-3.5 h-3.5 shrink-0" />
              </Link>
            }
          />
        </LearningWorkspaceShell>
      </div>
    </FadeIn>
  );
};

export default CourseLessonPage;
