import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { GraduationCap, BookOpen } from 'lucide-react';
import ModuleHeader from './ModuleHeader';

interface CoursesModuleProps {
  coursesCompleted: number;
  className?: string;
}

const CoursesModule: React.FC<CoursesModuleProps> = ({
  coursesCompleted,
  className = '',
}) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
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

      <div className="p-5">
        {coursesCompleted === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">
            {t('profile.courses.empty', 'No courses completed yet.')}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: Math.min(coursesCompleted, 6) }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-elevated/50 border border-border/20"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-primary truncate">
                    Course {idx + 1}
                  </p>
                  <p className="text-[9px] text-text-muted">Completed</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesModule;
