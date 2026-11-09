import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { BookOpen } from 'lucide-react';
import { getLabBadgeAsset } from '@/shared/learning/labBadges';
import ModuleHeader from './ModuleHeader';

interface CoursesModuleProps {
  labsCompleted: number;
  labIds: string[];
  className?: string;
}

const VISIBLE_LABS = 6;

const CoursesModule: React.FC<CoursesModuleProps> = ({
  labsCompleted,
  labIds,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const completed = [...new Set(labIds)]
    .map((id) => ({ id, badge: getLabBadgeAsset(id) }))
    .filter((entry): entry is { id: string; badge: NonNullable<typeof entry.badge> } => Boolean(entry.badge))
    .slice(0, VISIBLE_LABS);

  const renderItem = (entry: (typeof completed)[number], idx: number) => (
    <motion.div
      key={entry.id}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.05 }}
      className="flex min-w-0 items-center gap-4 rounded-xl border border-border-subtle bg-surface-raised/60 px-3 py-2.5"
    >
      <img
        src={entry.badge.image}
        alt=""
        className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
      />
      <p className="min-w-0 truncate text-xs font-black uppercase tracking-widest text-text-primary">
        {entry.badge.title}
      </p>
    </motion.div>
  );

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
      <ModuleHeader
        icon={<BookOpen className="h-4 w-4" />}
        title="Labs"
        trailing={
          labsCompleted > 0 ? (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
              {labsCompleted}
            </span>
          ) : undefined
        }
      />

      {labsCompleted === 0 && completed.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">No Labs completed yet.</p>
      ) : completed.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {completed.map(renderItem)}
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-accent sm:h-14 sm:w-14">
            <BookOpen className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-widest text-text-primary">
              {`${labsCompleted} Labs completed`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesModule;