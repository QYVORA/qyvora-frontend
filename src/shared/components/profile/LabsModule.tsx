import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { ExternalLink, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CompletedRoom } from '@/shared/types/profile';
import SectionCard from '@/shared/components/ui/SectionCard';

interface LabsModuleProps {
  completedRooms: CompletedRoom[];
  className?: string;
}

const LabsModule: React.FC<LabsModuleProps> = ({
  completedRooms,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const displayRooms = completedRooms.slice(-8).reverse();

  return (
    <SectionCard
      title="Bootcamp"
      icon={<Bug />}
      actions={
        completedRooms.length > 0 ? (
          <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[12px] font-medium text-accent">
            {completedRooms.length}
          </span>
        ) : undefined
      }
      className={className}
    >
      {displayRooms.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">No Bootcamp rooms completed yet.</p>
      ) : (
        <div className="divide-y divide-border-subtle">
          {displayRooms.map((room, idx) => (
            <motion.div
              key={room.roomId}
              initial={prefersReduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.04 }}
              className="group flex w-full items-center gap-3 overflow-hidden py-3 transition-colors hover:text-accent"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center text-accent">
                <Bug className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 truncate text-sm font-medium text-text-primary group-hover:text-accent">
                {room.title}
              </span>
              <Link
                to={`/labs/${room.roomId}`}
                className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-muted transition-opacity transition-colors hover:bg-accent-dim/40 hover:text-accent sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                aria-label={`Open ${room.title}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default LabsModule;