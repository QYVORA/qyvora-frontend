import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Lock, X, Github } from 'lucide-react';
import type { BootcampPhase } from '../../constants/bootcampConfig';
import { useScrollLock } from '../../../../core/hooks/useScrollLock';

interface Props {
  phases: BootcampPhase[];
  activePhaseId: string;
  activeRoomId: string;
  completedRooms: Set<string>;
  lockedRooms: Set<string>;
  bootcampId: string;
  onNavigate: (phaseId: string, roomId: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const RoomSidebar: React.FC<Props> = ({
  phases, activePhaseId, activeRoomId,
  completedRooms, lockedRooms, bootcampId,
  onNavigate, mobileOpen, onMobileClose,
}) => {
  useScrollLock(mobileOpen);
  const content = (
    <nav className="flex flex-col gap-1 p-3 pb-6">
      <div className="mb-3 px-1">
        <Link
          to={`/dashboard/bootcamps/${bootcampId}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
          onClick={onMobileClose}
        >
          <ArrowLeft className="h-3 w-3" /> Back to Curriculum
        </Link>
      </div>

      {phases.map((phase) => (
        <div key={phase.id} className="mb-3">
          <p className="mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-accent">
            {phase.codename} — {phase.title}
          </p>
          <div className="space-y-0.5 border-l border-border/50 ml-2 pl-2">
            {phase.rooms.map((room) => {
              const key = `${phase.id}:${room.id}`;
              const isActive = phase.id === activePhaseId && room.id === activeRoomId;
              const isCompleted = completedRooms.has(key);
              const isLocked = lockedRooms.has(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (!isLocked) { onNavigate(phase.id, room.id); onMobileClose(); }
                  }}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'text-accent font-semibold bg-accent-dim/20'
                      : isLocked
                      ? 'opacity-40 cursor-not-allowed text-text-muted'
                      : 'text-text-secondary hover:text-accent hover:bg-accent-dim/10'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[8px] font-bold font-mono ${
                      isCompleted
                        ? isActive ? 'border-accent/40 text-accent' : 'border-accent/40 text-accent'
                        : isActive
                        ? 'border-accent/40 text-accent'
                        : 'border-border text-text-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-2 w-2" /> : isLocked ? <Lock className="h-2 w-2" /> : null}
                  </span>
                  <span className="truncate text-xs flex-1">{room.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden">{content}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-20 bottom-0 z-[70] w-[92vw] max-w-[360px] flex flex-col bg-bg md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-bg/95 backdrop-blur-md shrink-0">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Curriculum</p>
                  <p className="text-xs font-black text-text-primary">Room Navigator</p>
                </div>
                <button
                  onClick={onMobileClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/10 transition-colors"
                  aria-label="Close curriculum"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">{content}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default RoomSidebar;
