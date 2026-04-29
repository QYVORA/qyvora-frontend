/**
 * WalkthroughPage — Hacker Protocol Bootcamp
 *
 * Content-driven: all phases, rooms, and steps come from walkthroughContent.ts.
 * Image paths are constructed dynamically:
 *   /HPB-Walkthrough-images/{phaseId}/{roomId}/{image}
 *
 * To add new phases or rooms, edit walkthroughContent.ts only.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, ImageOff, Menu, X, ArrowLeft,
} from 'lucide-react';
import {
  WALKTHROUGH_PHASES,
  type WalkthroughPhase,
  type WalkthroughRoom,
} from '../constants/walkthroughContent';

// ── Image path builder ────────────────────────────────────────────────────────
function buildImagePath(phaseId: string, roomId: string, image: string): string {
  return `/HPB-Walkthrough-images/${phaseId}/${roomId}/${image}`;
}

// ── Step image with fallback ──────────────────────────────────────────────────
const StepImage: React.FC<{ src: string; alt: string; stepNum: number }> = ({ src, alt, stepNum }) => {
  const [errored, setErrored] = useState(false);

  return errored ? (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-bg py-12 text-text-muted">
      <ImageOff className="h-8 w-8 opacity-40" />
      <span className="text-xs font-bold uppercase tracking-widest opacity-50">
        Step {stepNum} image not yet available
      </span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="w-full rounded-xl border border-border object-contain bg-bg"
      loading="lazy"
    />
  );
};

// ── Walkthrough text renderer (preserves newlines) ────────────────────────────
const WalkthroughText: React.FC<{ text: string }> = ({ text }) => (
  <div className="space-y-3">
    {text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      // Bullet lines
      if (trimmed.startsWith('•')) {
        return (
          <div key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{trimmed.slice(1).trim()}</span>
          </div>
        );
      }
      // Quoted / emphasis lines (wrapped in quotes)
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return (
          <p key={i} className="border-l-2 border-accent pl-4 text-sm italic text-accent leading-relaxed">
            {trimmed}
          </p>
        );
      }
      return (
        <p key={i} className="text-sm text-text-secondary leading-relaxed">
          {trimmed}
        </p>
      );
    })}
  </div>
);

// ── Sidebar ───────────────────────────────────────────────────────────────────
interface SidebarProps {
  phases: WalkthroughPhase[];
  activePhaseId: string;
  activeRoomId: string;
  onSelect: (phaseId: string, roomId: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ phases, activePhaseId, activeRoomId, onSelect, onClose }) => {
  const [expandedPhase, setExpandedPhase] = useState<string>(activePhaseId);

  // Keep expanded phase in sync when active changes
  useEffect(() => {
    setExpandedPhase(activePhaseId);
  }, [activePhaseId]);

  return (
    <nav className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-none">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Walkthrough</p>
          <p className="text-sm font-black text-text-primary mt-0.5">Hacker Protocol</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-accent transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Phase list */}
      <div className="flex-1 overflow-y-auto py-3">
        {phases.map((phase) => {
          const isPhaseExpanded = expandedPhase === phase.phaseId;
          const isPhaseActive = activePhaseId === phase.phaseId;

          return (
            <div key={phase.phaseId}>
              {/* Phase header */}
              <button
                onClick={() => setExpandedPhase(isPhaseExpanded ? '' : phase.phaseId)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  isPhaseActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black border transition-colors ${
                  isPhaseActive
                    ? 'border-accent/40 bg-accent-dim text-accent'
                    : 'border-border bg-bg text-text-muted'
                }`}>
                  {phase.phaseId.replace('phase', '')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{phase.label}</div>
                  <div className="text-xs font-black truncate">{phase.title}</div>
                </div>
                {isPhaseExpanded
                  ? <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  : <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                }
              </button>

              {/* Room list */}
              {isPhaseExpanded && (
                <div className="pb-1">
                  {phase.rooms.map((room) => {
                    const isActive = isPhaseActive && activeRoomId === room.roomId;
                    return (
                      <button
                        key={room.roomId}
                        onClick={() => { onSelect(phase.phaseId, room.roomId); onClose?.(); }}
                        className={`w-full flex items-center gap-3 pl-[52px] pr-5 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'bg-accent-dim/40 text-accent'
                            : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/20'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          isActive ? 'bg-accent' : 'bg-border'
                        }`} />
                        <span className="text-xs font-bold truncate">{room.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex-none px-5 py-4 border-t border-border">
        <Link
          to="/bootcamps"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Bootcamp
        </Link>
      </div>
    </nav>
  );
};

// ── Main content ──────────────────────────────────────────────────────────────
interface MainContentProps {
  phase: WalkthroughPhase;
  room: WalkthroughRoom;
}

const MainContent: React.FC<MainContentProps> = ({ phase, room }) => {
  const isEmpty = room.steps.length === 0;

  return (
    <div className="space-y-10">
      {/* Room header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
          <span>{phase.label}</span>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="text-accent">{room.title}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary leading-tight">
          {room.title}
        </h1>
      </header>

      {/* Walkthrough text */}
      <section
        className="rounded-2xl border border-border bg-bg-card p-6 md:p-8"
        aria-label="Room overview"
      >
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Overview</span>
        </div>
        <WalkthroughText text={room.walkthroughText} />
      </section>

      {/* Steps */}
      {isEmpty ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-bg-card/50 p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-30" />
          <p className="text-sm text-text-muted">Steps will be added when this phase launches.</p>
        </div>
      ) : (
        <section aria-label="Walkthrough steps">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6">
            Steps — {room.steps.length} total
          </h2>
          <div className="space-y-10">
            {room.steps.map((step, idx) => {
              const stepNum = idx + 1;
              const imageSrc = buildImagePath(phase.phaseId, room.roomId, step.image);

              return (
                <div
                  key={idx}
                  className="relative pl-10 sm:pl-14"
                >
                  {/* Step number badge */}
                  <div className="absolute left-0 top-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent-dim text-accent font-black font-mono text-sm">
                    {String(stepNum).padStart(2, '0')}
                  </div>

                  {/* Connector line (not on last step) */}
                  {idx < room.steps.length - 1 && (
                    <div
                      className="absolute left-[15px] sm:left-[17px] top-10 bottom-[-28px] w-px bg-border"
                      aria-hidden
                    />
                  )}

                  <div className="space-y-4">
                    {/* Instruction */}
                    <p className="text-sm sm:text-base font-bold text-text-primary leading-relaxed pt-1">
                      {step.instruction}
                    </p>

                    {/* Image */}
                    <StepImage
                      src={imageSrc}
                      alt={`Step ${stepNum}: ${step.instruction}`}
                      stepNum={stepNum}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const WalkthroughPage: React.FC = () => {
  const firstPhase = WALKTHROUGH_PHASES[0];
  const firstRoom = firstPhase?.rooms[0];

  const [activePhaseId, setActivePhaseId] = useState<string>(firstPhase?.phaseId ?? '');
  const [activeRoomId, setActiveRoomId] = useState<string>(firstRoom?.roomId ?? '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const activePhase = WALKTHROUGH_PHASES.find((p) => p.phaseId === activePhaseId) ?? firstPhase;
  const activeRoom = activePhase?.rooms.find((r) => r.roomId === activeRoomId) ?? activePhase?.rooms[0];

  const handleSelect = (phaseId: string, roomId: string) => {
    setActivePhaseId(phaseId);
    setActiveRoomId(roomId);
    // Scroll main content to top on selection
    setTimeout(() => {
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  // Close sidebar on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!activePhase || !activeRoom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-text-muted text-sm">No walkthrough content available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100svh-5rem)] md:h-[calc(100svh-6rem)] bg-bg overflow-hidden">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col border-r border-border bg-bg-card overflow-hidden">
        <Sidebar
          phases={WALKTHROUGH_PHASES}
          activePhaseId={activePhaseId}
          activeRoomId={activeRoomId}
          onSelect={handleSelect}
        />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-border bg-bg-card lg:hidden overflow-hidden">
            <Sidebar
              phases={WALKTHROUGH_PHASES}
              activePhaseId={activePhaseId}
              activeRoomId={activeRoomId}
              onSelect={handleSelect}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ── Main content area ── */}
      <div ref={mainRef} className="flex-1 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-bg-card/95 backdrop-blur-md px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted truncate">
              {activePhase.label} · {activeRoom.title}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 pb-24">
          <MainContent phase={activePhase} room={activeRoom} />

          {/* Room navigation — prev / next */}
          <RoomNav
            phases={WALKTHROUGH_PHASES}
            activePhaseId={activePhaseId}
            activeRoomId={activeRoomId}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
};

// ── Prev / Next room navigation ───────────────────────────────────────────────
interface RoomNavProps {
  phases: WalkthroughPhase[];
  activePhaseId: string;
  activeRoomId: string;
  onSelect: (phaseId: string, roomId: string) => void;
}

const RoomNav: React.FC<RoomNavProps> = ({ phases, activePhaseId, activeRoomId, onSelect }) => {
  // Flatten all rooms into a linear list
  const flat = phases.flatMap((phase) =>
    phase.rooms.map((room) => ({ phaseId: phase.phaseId, phaseLabel: phase.label, roomId: room.roomId, roomTitle: room.title }))
  );

  const currentIdx = flat.findIndex(
    (item) => item.phaseId === activePhaseId && item.roomId === activeRoomId
  );

  const prev = currentIdx > 0 ? flat[currentIdx - 1] : null;
  const next = currentIdx < flat.length - 1 ? flat[currentIdx + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="mt-14 pt-8 border-t border-border flex items-center justify-between gap-4">
      {prev ? (
        <button
          onClick={() => onSelect(prev.phaseId, prev.roomId)}
          className="flex items-center gap-3 group text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted group-hover:border-accent/40 group-hover:text-accent transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Previous</div>
            <div className="text-sm font-black text-text-primary group-hover:text-accent transition-colors truncate max-w-[160px]">
              {prev.roomTitle}
            </div>
          </div>
        </button>
      ) : <div />}

      {next ? (
        <button
          onClick={() => onSelect(next.phaseId, next.roomId)}
          className="flex items-center gap-3 group text-right ml-auto"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Next</div>
            <div className="text-sm font-black text-text-primary group-hover:text-accent transition-colors truncate max-w-[160px]">
              {next.roomTitle}
            </div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted group-hover:border-accent/40 group-hover:text-accent transition-all">
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      ) : <div />}
    </div>
  );
};

export default WalkthroughPage;
