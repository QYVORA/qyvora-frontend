import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { GraduationCap } from 'lucide-react';
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
  const { t } = useTranslation();
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
      className="flex items-center gap-4 min-w-0"
    >
      <CourseBadge courseId={entry.id} className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-primary truncate">
          {entry.course?.title}
        </p>
        <p className="text-[9px] text-text-muted truncate">{entry.course?.categoryId}</p>
      </div>
    </motion.div>
  );

  return (
    <div className={className}>
      <ModuleHeader
        icon={<GraduationCap className="w-4 h-4 text-blue-400" />}
        iconClassName="bg-blue-400/10"
        title={t('profile.courses.title', 'Courses')}
        trailing={
          coursesCompleted > 0 ? (
            <span className="px-2 py-1 bg-blue-400/10 text-blue-400 text-[9px] font-black rounded-lg">
              {coursesCompleted}
            </span>
          ) : undefined
        }
      />

      <div className="mt-4">
        {coursesCompleted === 0 && completed.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">
            {t('profile.courses.empty', 'No courses completed yet.')}
          </p>
        ) : completed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completed.map(renderItem)}
          </div>
        ) : (
          <div className="flex items-center gap-4 min-w-0">
            <QyvoraMark className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-primary truncate">
                {t('profile.courses.completedCount', { count: coursesCompleted, defaultValue: '{{count}} courses completed' })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesModule;
