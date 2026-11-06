import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { FadeIn, EmptyState } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import { getCourseById, getCategoryById } from '@/features/student/data/courses';
import { LearningContentRenderer, parseMarkdownToBlocks } from '@/shared/learning';
import type { LearningBlock } from '@/shared/learning';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import { LearningTaskAccordion } from '@/shared/components/learning/LearningTaskAccordion';
import type { LearningTask } from '@/shared/components/learning/LearningTaskAccordion';
import { CourseLessonSkeleton } from '@/features/student/components/StudentSkeletons';
import api from '@/core/services/api';
import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';
import Button from '@/shared/components/ui/Button';
import type { Lesson } from '@/features/student/data/courses';

const STORAGE_KEY = 'qyvora_course_progress';

function buildLessonBlocks(lesson: Lesson, courseId?: string): LearningBlock[] {
  const parts: LearningBlock[] = parseMarkdownToBlocks(
    lesson.instruction ?? '',
    `course-${courseId}-lesson-${lesson.id}`,
    { continuous: true },
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
}

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

  const currentLesson = course?.lessons[currentLessonIdx];

  const lessonBlocksById = useMemo(() => {
    const entries = (course?.lessons ?? []).map((lesson) => [
      lesson.id,
      buildLessonBlocks(lesson, courseId),
    ] as const);
    return new Map(entries);
  }, [course, courseId]);

  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allComplete = totalLessons > 0 && completedLessons.size === totalLessons;
  const nextIncompleteIdx = course?.lessons.findIndex((lesson) => !completedLessons.has(lesson.id)) ?? -1;
  const [celebrationOpen, setCelebrationOpen] = useCelebrationTrigger(allComplete);

  const selectLesson = useCallback((idx: number) => {
    if (totalLessons === 0) return;
    const clamped = Math.max(0, Math.min(idx, totalLessons - 1));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('lesson', String(clamped));
      return next;
    }, { replace: true });
  }, [totalLessons, setSearchParams]);

  const saveProgress = useCallback((lessons: Set<string>, idx: number) => {
    if (!courseId) return;
    localStorage.setItem(`${STORAGE_KEY}_${courseId}`, JSON.stringify({
      completedLessons: [...lessons],
      lastLesson: idx,
    }));
  }, [courseId]);

  const markLessonComplete = useCallback((lesson: Lesson, idx: number) => {
    const next = new Set([...completedLessons, lesson.id]);
    setCompletedLessons(next);
    saveProgress(next, idx);
    if (courseId && next.size === totalLessons) {
      api.post(`/student/courses/${encodeURIComponent(courseId)}/complete`).catch(() => {});
    }
  }, [completedLessons, saveProgress, courseId, totalLessons]);

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

  const tasks: LearningTask[] = course.lessons.map((lesson, index) => {
    const isCompleted = completedLessons.has(lesson.id);
    const blocks = lessonBlocksById.get(lesson.id) ?? [];

    return {
      id: `lesson-${lesson.id}`,
      title: lesson.title,
      description: isCompleted
        ? 'Completed'
        : index === currentLessonIdx
          ? `Lesson ${index + 1} of ${totalLessons} · current`
          : `Lesson ${index + 1} of ${totalLessons}`,
      completed: isCompleted,
      meta: (
        <span className="flex items-center gap-1.5">
          {lesson.hasQuiz && (
            <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">Quiz</span>
          )}
          {lesson.hasCodePlayground && (
            <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">Code</span>
          )}
        </span>
      ),
      content: (
        <div className="space-y-8">
          <LearningContentRenderer
            unit={{
              id: lesson.id,
              number: index + 1,
              title: lesson.title,
              blocks,
              completionType: lesson.hasQuiz ? 'checkpoint' : 'view',
            }}
            context={{
              surface: 'course',
              sequenceId: lesson.id,
              unitId: lesson.id,
              onComplete: () => markLessonComplete(lesson, index),
            }}
          />

          <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6">
            <Button
              onClick={() => markLessonComplete(lesson, index)}
              variant={isCompleted ? 'secondary' : 'primary'}
            >
              {isCompleted ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {"Completed"}
                </>
              ) : (
                "Mark complete"
              )}
            </Button>
            {index < totalLessons - 1 && (
              <Button variant="secondary" onClick={() => selectLesson(index + 1)}>
                {"Next lesson"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      ),
    };
  });

  const activeTaskId = currentLesson ? `lesson-${currentLesson.id}` : undefined;

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
          actions={
            <Button onClick={() => selectLesson(nextIncompleteIdx >= 0 ? nextIncompleteIdx : 0)}>
              {allComplete ? "Review course" : completedCount > 0 ? "Continue learning" : "Start learning"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        >
          <LearningTaskAccordion
            tasks={tasks}
            activeId={activeTaskId}
            onActiveChange={(id) => {
              const index = tasks.findIndex((task) => task.id === id);
              if (index >= 0) selectLesson(index);
            }}
          />
        </LearningWorkspaceShell>
      </div>
    </FadeIn>
  );
};

export default CourseLessonPage;
