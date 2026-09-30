import { EmptyState } from '@/shared/components/ui';
import type { StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import StudentBootcampCard from '@/features/student/components/StudentBootcampCard';
import { BookOpen } from 'lucide-react';

interface ActiveDeploymentsProps {
  bootcamps: StudentBootcampCardData[];
  /** Cap the number of cards so the catalogue row stays predictable. */
  limit?: number;
  className?: string;
}

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5';

/**
 * ActiveDeployments — the bootcamp row of the dashboard catalogue.
 *
 * Owns its own grid (or the empty state) but deliberately renders no section
 * title or "View all" link: the dashboard page owns those, so a second header
 * inside would duplicate it.
 */
const ActiveDeployments = ({ bootcamps, limit = 3, className = '' }: ActiveDeploymentsProps) => {
  const visible = bootcamps.slice(0, limit);

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
        title={"No active deployments."}
        description={"Enrol in the Hacker Protocol Bootcamp to begin your first mission."}
      />
    );
  }

  return (
    <div className={`${GRID} ${className}`}>
      {visible.map((item, idx) => (
        <StudentBootcampCard key={item.id} data={item} index={idx} />
      ))}
    </div>
  );
};

export default ActiveDeployments;
