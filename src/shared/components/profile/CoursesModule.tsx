import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLabBadgeAsset } from '@/shared/learning/labBadges';
import SectionCard from '@/shared/components/ui/SectionCard';

interface CoursesModuleProps {
  labsCompleted: number;
  labIds: string[];
  showAllHref?: string;
  className?: string;
}

const VISIBLE_LABS = 6;

const CoursesModule: React.FC<CoursesModuleProps> = ({
  labsCompleted,
  labIds,
  showAllHref = '/dashboard/labs',
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const completed = [...new Set(labIds)]
    .map((id) => ({ id, badge: getLabBadgeAsset(id) }))
    .filter((entry): entry is { id: string; badge: NonNullable<typeof entry.badge> } => Boolean(entry.badge))
    .slice(0, VISIBLE_LABS);

  return (
    <SectionCard
      title="Labs"
      icon={<BookOpen />}
      actions={
        <Link
          to={showAllHref}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Show all
        </Link>
      }
      className={className}
    >
      {completed.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">
          {labsCompleted > 0 ? `${labsCompleted} Labs completed` : 'No Labs completed yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {completed.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.04 }}
            >
              <Link
                to={`/dashboard/labs/${entry.id}`}
                className="group flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-md border border-border-subtle bg-surface-raised/40 p-3 text-center transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <img
                  src={entry.badge.image}
                  alt=""
                  aria-hidden="true"
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                  loading="lazy"
                />
                <p className="line-clamp-2 text-sm font-medium leading-snug text-text-primary group-hover:text-accent">
                  {entry.badge.title}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default CoursesModule;
