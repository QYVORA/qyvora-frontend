import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Lock, Loader2, Target, Zap } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { getCourseById } from '@/features/student/data/courses';
import CodeBlockRenderer from '@/shared/components/courses/CodeBlockRenderer';
import InlineQuiz from '@/shared/components/courses/InlineQuiz';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import { StepNumberHeader } from '@/shared/components/learning/StepNumberHeader';
import { WalkthroughSidebar } from '@/shared/components/walkthrough/WalkthroughSidebar';
import CodePlayground from '@/shared/components/courses/CodePlayground';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import api from '@/core/services/api';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';
import type { Lesson } from '@/features/student/data/courses';

const STORAGE_KEY = 'qyvora_course_progress';

const LessonViewer: React.FC<{ lesson: Lesson; number: number; courseId?: string; backUrl?: string }> = ({ lesson, number, courseId, backUrl }) => {
  return (
    <div className="w-full border-t border-border/10 first:border-t-0 py-12 md:py-16">
      <StepNumberHeader
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
      />

      <div className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap overflow-x-auto text-text-primary w-full mb-10 md:mb-14">
        <CodeBlockRenderer text={lesson.instruction} />
      </div>

      {lesson.hasTerminal && (
        <div className="mt-10 md:mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Try It Yourself</span>
          </div>
          <TerminalWrapper
            open
            onOpenChange={() => {}}
            mode="inline"
            context={{ type: 'course', courseId: courseId || '', lessonId: lesson.id }}
            initialCommands={lesson.terminalCommands || []}
            title={lesson.terminalTitle || 'lesson-terminal'}
          />
        </div>
      )}

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
    </div>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useScrollLock(sidebarOpen);

  const totalLessons = course?.lessons.length ?? 0;

  useEffect(() => {
    const sidebarHandler = () => setSidebarOpen(true);
    window.addEventListener('course:openSidebar', sidebarHandler);
    return () => {
      window.removeEventListener('course:openSidebar', sidebarHandler);
    };
  }, []);

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
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
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
    <div className="bg-bg">
      <SEO title={`${course.title} — ${lesson.title}`} description={course.description} noindex />

      <CelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        badge={t('student.celebration.courseBadge')}
        title={t('student.celebration.courseTitle')}
        description={t('student.celebration.courseDescription', { title: course.title })}
        ctaLabel={t('student.celebration.continue')}
      />

      <WalkthroughSidebar
        sections={[{
          label: 'Lessons',
          items: course.lessons.map((l, i) => ({
            id: l.id,
            title: l.title,
            isActive: i === currentLessonIdx,
            isCompleted: completedLessons.has(l.id),
            isLocked: false,
            onClick: () => {
              goToLesson(i);
            },
          })),
        }]}
        backHref="/dashboard/courses"
        backLabel="Back to Courses"
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        title="Lesson Navigator"
        subtitle="Course"
      />

      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
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

            <LessonViewer lesson={lesson} number={currentLessonIdx + 1} courseId={courseId} backUrl="/dashboard/courses" />

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pb-16 mt-10 md:mt-14 border-t border-border/5 pt-6">
              {currentLessonIdx > 0 && (
                <button
                  onClick={goPrev}
                  className="btn-secondary md:hidden inline-flex flex-1 items-center justify-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3.5 py-2 sm:flex-none"
                >
                  <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
                  <span>Prev</span>
                </button>
              )}

              <span className="md:hidden order-3 w-full text-center font-mono text-xs font-semibold text-text-muted sm:order-none sm:w-auto">
                {currentLessonIdx + 1} / {totalLessons}
              </span>

              {!isCompleted && !allComplete && (
                <button
                  onClick={markComplete}
                  className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3.5 py-2 w-full sm:w-auto"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Complete</span>
                </button>
              )}

              {!isLastLesson ? (
                <button
                  onClick={goNext}
                  className="btn-primary inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5 sm:flex-none"
                >
                  <span className="md:hidden">Next</span>
                  <span className="hidden md:inline">Next Lesson</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              ) : allComplete ? (
                <Link
                  to="/dashboard/courses"
                  className="btn-primary inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5 sm:flex-none"
                >
                  <span>Back to Courses</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              ) : null}
            </div>
      </div>
    </div>
  );
};

export default CourseLessonPage;
