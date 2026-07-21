import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { FlaskConical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CompletedRoom } from '@/shared/types/profile';
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
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const displayRooms = completedRooms.slice(-8).reverse();
  const totalLabs = labsCompleted || completedRooms.length;

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
      <ModuleHeader
        icon={<FlaskConical className="w-4 h-4 text-red-400" />}
        iconClassName="bg-red-400/10"
        title={t('profile.labs.title', 'Labs')}
        trailing={
          totalLabs > 0 ? (
            <span className="px-2 py-1 bg-red-400/10 text-red-400 text-[9px] font-black rounded-lg">
              {totalLabs}
            </span>
          ) : undefined
        }
      />

      <div className="p-5">
        {displayRooms.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">
            {t('profile.labs.empty', 'No labs completed yet.')}
          </p>
        ) : (
          <div className="space-y-2">
            {displayRooms.map((room, idx) => (
              <motion.div
                key={room.roomId}
                initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : idx * 0.04 }}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-red-400/10 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-3.5 h-3.5 text-red-400" />
                </div>
                <span className="text-sm text-text-primary font-bold truncate flex-1">
                  {room.title}
                </span>
                <Link
                  to={`/labs/${room.roomId}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-accent"
                  aria-label={`Open ${room.title}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabsModule;
