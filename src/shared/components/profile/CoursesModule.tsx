import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import CourseBadge from '@/shared/components/CourseBadge';
import { QyvoraMark } from '@/shared/components/brand';
import { getCourseById } from '@/features/student/data/courses/courseData';
import ModuleHeader from './ModuleHeader';

interface CoursesModuleProps {
  coursesCompleted: number;
  courseIds?: string[];
  className?: string;
}

const VISIBLE_COURSES = 6;

const CoursesModule: React.FC<CoursesModuleProps> = ({
  coursesCompleted,
  courseIds = [],
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const completed = courseIds
    .map((id) => ({ id, course: getCourseById(id) }))
    .filter((entry) => Boolean(entry.course))
    .slice(0, VISIBLE_COURSES);

  const renderItem = (entry: { id: string; course?: { title: string; categoryId: string } }, idx: number) => (
    <motion.div
      key={entry.id}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
      className="flex min-w-0 items-center gap-4 rounded-xl border border-border-subtle bg-surface-raised/60 px-3 py-2.5"
    >
      <CourseBadge courseId={entry.id} className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
      <div className="min-w-0">
        <p className="truncate text-xs font-black uppercase tracking-widest text-text-primary">
          {entry.course?.title}
        </p>
        <p className="truncate text-xs text-text-muted">{entry.course?.categoryId}</p>
      </div>
    </motion.div>
  );

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
      <ModuleHeader
        icon={<QyvoraMark className="h-4 w-4" />}
        title="Courses"
        trailing={
          coursesCompleted > 0 ? (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
              {coursesCompleted}
            </span>
          ) : undefined
        }
      />

      {coursesCompleted === 0 && completed.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">No courses completed yet.</p>
      ) : completed.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {completed.map(renderItem)}
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-4">
          <QyvoraMark className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-widest text-text-primary">
              {`${coursesCompleted} courses completed`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesModule;