import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CompletedRoom } from '@/shared/types/profile';
import { QyvoraMark } from '@/shared/components/brand';
import ModuleHeader from './ModuleHeader';

interface LabsModuleProps {
  completedRooms: CompletedRoom[];
  labsCompleted: number;
  className?: string;
}

const LabsModule: React.FC<LabsModuleProps> = ({
  completedRooms,
  labsCompleted,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const displayRooms = completedRooms.slice(-8).reverse();
  const totalLabs = labsCompleted || completedRooms.length;

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
      <ModuleHeader
        icon={<QyvoraMark className="h-4 w-4" />}
        title="Labs"
        trailing={
          totalLabs > 0 ? (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
              {totalLabs}
            </span>
          ) : undefined
        }
      />

      {displayRooms.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">No labs completed yet.</p>
      ) : (
        <div className="space-y-2">
          {displayRooms.map((room, idx) => (
            <motion.div
              key={room.roomId}
              initial={prefersReduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.04 }}
              className="group flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-raised/60 px-3 py-2.5 transition-colors hover:border-accent/30 hover:bg-surface-raised"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                <QyvoraMark className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 truncate text-sm font-bold text-text-primary">
                {room.title}
              </span>
              <Link
                to={`/labs/${room.roomId}`}
                className="text-text-muted opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
                aria-label={`Open ${room.title}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabsModule;