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
                  className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-accent text-bg font-bold shadow-md shadow-accent/10'
                      : isLocked
                      ? 'opacity-40 cursor-not-allowed text-text-muted'
                      : 'hover:bg-accent-dim/30 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-black font-mono ${
                      isCompleted
                        ? isActive ? 'bg-white/20 text-white' : 'bg-accent text-bg'
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-bg-elevated text-text-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-2.5 w-2.5" /> : isLocked ? <Lock className="h-2.5 w-2.5" /> : null}
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
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-20 bottom-0 z-[70] w-[92vw] max-w-[360px] flex flex-col bg-bg-card shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-bg-card/95 backdrop-blur-md shrink-0">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Curriculum</p>
                  <p className="text-xs font-black text-text-primary">Room Navigator</p>
                </div>
                <button
                  onClick={onMobileClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg text-text-muted hover:text-text-primary transition-colors shadow-sm"
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
