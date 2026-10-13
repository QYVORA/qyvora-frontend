import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { FadeIn, EmptyState } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import { getCourseById, getCategoryById } from '@/features/student/data/courses';
import { CardDeckSurface, chunkMarkdown } from '@/shared/learning';
import type { LearningBlock } from '@/shared/learning';
import StepRenderer from '@/shared/components/learning/StepRenderer';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import { CourseLessonSkeleton } from '@/features/student/components/StudentSkeletons';
import api from '@/core/services/api';
import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import Button from '@/shared/components/ui/Button';
import type { Lesson } from '@/features/student/data/courses';

const STORAGE_KEY = 'qyvora_course_progress';

interface LessonViewerProps {
  lesson: Lesson;
  number: number;
  courseId?: string;
  isCompleted: boolean;
  onDeckComplete: () => void;
  continueLabel: string;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  number,
  courseId,
  isCompleted,
  onDeckComplete,
  continueLabel,
}) => {
  const blocks = useMemo<LearningBlock[]>(() => {
    const parts: LearningBlock[] = chunkMarkdown(
      lesson.instruction ?? '',
      `course-${courseId}-lesson-${lesson.id}`,
    );

    if (lesson.hasTerminal && lesson.terminalCommands && lesson.terminalCommands.length > 0) {
      lesson.terminalCommands.forEach((cmd, ci) => {
        parts.push({ type: 'command', id: `${lesson.id}-cmd-${ci}`, command: cmd });
      });
    }

    if (lesson.hasCodePlayground) {
      parts.push({
        type: 'playground',
        id: `${lesson.id}-playground`,
        language: lesson.codePlaygroundLanguage || 'python',
        initialCode: lesson.codePlaygroundInitial || '',
        expectedOutput: lesson.codePlaygroundExpectedOutput,
        title: lesson.title,
      });
    }

    if (lesson.hasQuiz && lesson.quiz && lesson.quiz.length > 0) {
      parts.push({
        type: 'checkpoint',
        id: `${lesson.id}-checkpoint`,
        checkpointType: 'quiz',
        title: `Checkpoint: ${lesson.title}`,
        quiz: { questions: lesson.quiz },
      });
    }

    return parts;
  }, [lesson, courseId]);

  return (
    <StepRenderer
      stepNumber={number}
      title={lesson.title}
      isCompleted={isCompleted}
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
      <CardDeckSurface
        deckId={`course-${courseId}-lesson-${lesson.id}`}
        surface="course"
        sequenceId={courseId || 'course'}
        unitId={lesson.id}
        blocks={blocks}
        onDeckComplete={onDeckComplete}
        continueLabel={continueLabel}
      />
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

  const selectLesson = useCallback((idx: number) => {
    if (totalLessons === 0) return;
    const clamped = Math.max(0, Math.min(idx, totalLessons - 1));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('lesson', String(clamped));
      return next;
    }, { replace: true });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
    if (courseId && next.size === totalLessons) {
      api.post(`/student/courses/${encodeURIComponent(courseId)}/complete`).catch(() => {});
    }
  }, [course, completedLessons, currentLessonIdx, saveProgress, courseId, totalLessons]);

  const goNext = useCallback(() => {
    if (currentLessonIdx < totalLessons - 1) selectLesson(currentLessonIdx + 1);
  }, [currentLessonIdx, totalLessons, selectLesson]);

  const goPrev = useCallback(() => {
    if (currentLessonIdx > 0) selectLesson(currentLessonIdx - 1);
  }, [currentLessonIdx, selectLesson]);

  const handleDeckComplete = useCallback(() => {
    markComplete();
    if (currentLessonIdx < totalLessons - 1) selectLesson(currentLessonIdx + 1);
  }, [markComplete, currentLessonIdx, totalLessons, selectLesson]);

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
          {/* One lesson at a time — the deck's Continue advances to the next lesson */}
          {course.lessons[currentLessonIdx] && (
            <LessonViewer
              key={course.lessons[currentLessonIdx].id}
              lesson={course.lessons[currentLessonIdx]}
              number={currentLessonIdx + 1}
              courseId={courseId}
              isCompleted={completedLessons.has(course.lessons[currentLessonIdx].id)}
              onDeckComplete={handleDeckComplete}
              continueLabel={currentLessonIdx < totalLessons - 1 ? 'Next Lesson' : 'Finish'}
            />
          )}
        </LearningWorkspaceShell>
      </div>
    </FadeIn>
  );
};

export default CourseLessonPage;
