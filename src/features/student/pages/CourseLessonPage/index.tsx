import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Lock, Target, Minimize2, Maximize2 } from 'lucide-react';
import { FadeIn } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import { getCourseById } from '@/features/student/data/courses';
import CodeBlockRenderer from '@/shared/components/courses/CodeBlockRenderer';
import InlineQuiz from '@/shared/components/courses/InlineQuiz';
import CodePlayground from '@/shared/components/courses/CodePlayground';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import StepRenderer from '@/shared/components/learning/StepRenderer';
import LearningNav from '@/shared/components/learning/LearningNav';
import LearningToolbar from '@/shared/components/learning/LearningToolbar';
import { CourseLessonSkeleton } from '@/features/student/components/StudentSkeletons';
import api from '@/core/services/api';
import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';
import type { Lesson } from '@/features/student/data/courses';

const STORAGE_KEY = 'qyvora_course_progress';

const LessonViewer: React.FC<{ lesson: Lesson; number: number; courseId?: string; backUrl?: string }> = ({ lesson, number, courseId, backUrl }) => {
  return (
    <StepRenderer
      stepNumber={number}
      title={lesson.title}
      isActive
      backUrl={backUrl}
      backLabel="Back to Courses"
      badges={
        <>
          {lesson.hasQuiz && (
            <span className="px-1.5 py-0.5 rounded-lg bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">QUIZ</span>
          )}
          {lesson.hasTerminal && (
            <span className="px-1.5 py-0.5 rounded-lg bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">TERM</span>
          )}
          {lesson.hasCodePlayground && (
            <span className="px-1.5 py-0.5 rounded-lg bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">CODE</span>
          )}
        </>
      }
    >
      <div className="wc-prose text-base sm:text-lg leading-relaxed whitespace-pre-wrap overflow-x-auto text-text-primary w-full mb-10 md:mb-14">
        <CodeBlockRenderer text={lesson.instruction} />
      </div>

      {lesson.hasCodePlayground && (
        <div className="mt-8 md:mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Code Playground</span>
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
            title={`Lesson Quiz: ${lesson.title}`}
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
  const { t } = useTranslation();

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

  const lesson = course?.lessons[currentLessonIdx];
  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allComplete = totalLessons > 0 && completedLessons.size === totalLessons;
  const [celebrationOpen, setCelebrationOpen] = useCelebrationTrigger(allComplete);
  const { fullscreen, toggleFullscreen } = useRoomSession();

  const saveProgress = useCallback((lessons: Set<string>, idx: number) => {
    if (!courseId) return;
    localStorage.setItem(`${STORAGE_KEY}_${courseId}`, JSON.stringify({
      completedLessons: [...lessons],
      lastLesson: idx,
    }));
  }, [courseId]);

  const goToLesson = useCallback((idx: number) => {
    if (totalLessons === 0) return;
    const clamped = Math.max(0, Math.min(idx, totalLessons - 1));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('lesson', String(clamped));
      return next;
    }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalLessons, setSearchParams]);

  const markComplete = useCallback(() => {
    if (!lesson) return;
    const next = new Set([...completedLessons, lesson.id]);
    setCompletedLessons(next);
    saveProgress(next, currentLessonIdx);
  }, [lesson, completedLessons, currentLessonIdx, saveProgress]);

  const goNext = useCallback(() => {
    if (currentLessonIdx < totalLessons - 1) goToLesson(currentLessonIdx + 1);
  }, [currentLessonIdx, totalLessons, goToLesson]);

  const goPrev = useCallback(() => {
    if (currentLessonIdx > 0) goToLesson(currentLessonIdx - 1);
  }, [currentLessonIdx, goToLesson]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('course:updateMeta', {
      detail: {
        currentLessonIdx,
        totalLessons,
        progress,
        lesson: lesson ? {
          hasTerminal: lesson.hasTerminal,
          hasCodePlayground: lesson.hasCodePlayground,
          quiz: lesson.quiz,
        } : null,
      },
    }));
  }, [currentLessonIdx, totalLessons, progress, lesson]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg font-mono">Course not found.</p>
          <Link to="/dashboard/courses" className="text-accent hover:underline mt-4 inline-block font-mono">← Back to My Courses</Link>
        </div>
      </div>
    );
  }

  if (checkingAccess) {
    return <CourseLessonSkeleton />;
  }

  if (!purchased) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <Lock className="h-12 w-12 text-text-muted/30 mx-auto" />
          <h1 className="text-3xl font-black text-text-primary font-mono">Course Not Unlocked</h1>
          <p className="text-sm text-text-muted leading-relaxed">
            You haven't unlocked {course.title} yet. Unlock it from the marketplace to start learning.
          </p>
          <Link
            to="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-on-accent rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 font-mono"
          >
            Unlock Course <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = completedLessons.has(lesson.id);
  const isLastLesson = currentLessonIdx === totalLessons - 1;

  return (
    <FadeIn>
    <div className="bg-bg">
      <SEO title={`${course.title} | ${lesson.title}`} description={course.description} noindex />

      <CelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        badge={t('student.celebration.courseBadge')}
        title={t('student.celebration.courseTitle')}
        description={t('student.celebration.courseDescription', { title: course.title })}
        ctaLabel={t('student.celebration.continue')}
      />

      <LearningToolbar
        actions={[
          {
            id: 'fullscreen',
            icon: fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />,
            label: fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
            onClick: toggleFullscreen,
          },
        ]}
      />

      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
        {currentLessonIdx === 0 && (
          <StudentHeroSection
            fullHeight={false}
            title={course.title}
            description={`${completedCount} of ${totalLessons} lessons completed`}
            stats={[
              { label: 'Progress', value: `${progress}%`, accent: true },
              { label: 'Lessons', value: `${completedCount}/${totalLessons}` },
            ]}
          />
        )}

        {/* Progress bar */}
        {totalLessons > 0 && (
          <div className="rounded-2xl border border-border/50 bg-bg-card px-4 py-4 md:px-6 md:py-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">{t('learning.progress.title')}</span>
              <span className="font-mono text-base font-black text-accent">
                {completedCount}/{totalLessons}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-accent-dim border border-border/40">
              <div
                className="h-full bg-accent transition-all duration-700 ease-out rounded-full"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${progress}% complete`}
              />
            </div>
          </div>
        )}

        <LessonViewer lesson={lesson} number={currentLessonIdx + 1} courseId={courseId} backUrl="/dashboard/courses" />

        <LearningNav
          currentStep={currentLessonIdx}
          totalSteps={totalLessons}
          isLastStep={isLastLesson}
          isComplete={allComplete}
          onPrev={currentLessonIdx > 0 ? goPrev : undefined}
          onNext={!isLastLesson ? goNext : undefined}
          onComplete={!allComplete && !isCompleted ? markComplete : undefined}
          completeLabel={t('learning.nav.complete')}
          nextLabel="Next Lesson"
          nextLabelMobile="Next"
          finishContent={
            <Link
              to="/dashboard/courses"
              className="btn-primary inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5"
            >
              <span>Back to Courses</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
          }
        />
      </div>
    </div>
    </FadeIn>
  );
};

export default CourseLessonPage;
