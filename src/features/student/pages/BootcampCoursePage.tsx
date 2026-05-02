import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  BookOpen, Loader2, ArrowRight, Play, ListChecks,
} from 'lucide-react';
import { BOOTCAMP_CONFIG } from '../constants/bootcampConfig';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import { formatSyncLabel, getLastSync, resolveNextRoomPath, setLastSyncNow } from '../utils/studentExperience';

const PHASE_ROOM_IMAGES: Record<string, string> = {
  phase1: '/assets/bootcamp/rooms/hacker-mindset.png',
  phase2: '/assets/bootcamp/rooms/linux-foundations.png',
  phase3: '/assets/bootcamp/rooms/networking.png',
  phase4: '/assets/bootcamp/rooms/web-and-backend-systems.png',
  phase5: '/assets/bootcamp/rooms/social-engineering.png',
};

interface LiveClass { title: string; instructor?: string; time?: string; link: string; }
interface Room {
  roomId: number; title: string; overview: string; locked: boolean;
  completed?: boolean; readingContent?: string; bullets?: string[];
  meetingLink?: string; liveClass?: LiveClass;
}
interface Module {
  moduleId: number; title: string; description: string; codename: string;
  roleTitle: string; badge: string; ctf: string; locked: boolean;
  rooms: Room[]; progress?: number; roomsCompleted?: number; roomsTotal?: number; ctfCompleted?: boolean;
}
interface Course { id: string; title: string; modules: Module[]; }

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { refreshMe } = useAuth();

  const [course, setCourse]           = useState<Course | null>(null);
  const [overview, setOverview]       = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [bootcampStatus, setStatus]   = useState('not_enrolled');
  const [enrolling, setEnrolling]     = useState(false);
  const [syncError, setSyncError]     = useState('');
  const [lastSync, setLastSync]       = useState<string | null>(getLastSync('bootcamp-course'));

  const load = async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const [ovRes, courseRes] = await Promise.all([
        api.get('/student/overview'),
        api.get(`/student/course${query}`).catch(() => null),
      ]);
      const ov = ovRes.data || null;
      setOverview(ov);
      const enrolledViaStatus =
        ov?.bootcampStatus && ov.bootcampStatus !== 'not_enrolled' &&
        String(ov?.bootcampId || '') === String(bootcampId || '');
      const enrolledViaModules = (Array.isArray(ov?.modules) ? ov.modules : []).some(
        (m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || '')
      );
      setStatus(enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled');
      if (courseRes?.data) setCourse(courseRes.data as Course);
      setLastSync(setLastSyncNow('bootcamp-course'));
      setSyncError('');
    } catch {
      setSyncError('Could not sync. Displaying available data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [bootcampId]);

  const enroll = async () => {
    setEnrolling(true);
    try {
      const res = await api.post('/student/bootcamp', { bootcampId: bootcampId || '' });
      setStatus(res.data?.bootcampStatus || 'enrolled');
      await refreshMe();
      addToast('Enrolled in bootcamp.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Enrollment failed.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const progressNum   = parseInt(progressValue, 10) || 0;
  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any) => [Number(m.id), m])
  );

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-12">
        <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8 md:pt-10">
          <div className="mb-8 h-5 w-40 animate-pulse rounded bg-accent-dim/30" />
          <div className="mb-6 h-8 w-64 animate-pulse rounded bg-accent-dim/30" />
          <div className="mb-10 h-2 w-full animate-pulse rounded-full bg-accent-dim/20" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-4 h-20 animate-pulse rounded-2xl border border-border bg-bg-card" />
          ))}
        </div>
      </div>
    );
  }

  // ── Not enrolled ─────────────────────────────────────────────────────────
  if (bootcampStatus === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-bg pb-12">
        <div className="mx-auto max-w-2xl px-4 pt-8 md:px-8 md:pt-10">
          <Link
            to="/bootcamps"
            className="mb-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to bootcamps
          </Link>
          <div className="rounded-2xl border-2 border-border bg-bg-card px-8 py-12 text-center md:px-12 md:py-14">
            <BookOpen className="mx-auto mb-6 h-12 w-12 text-accent opacity-80" />
            <h1 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">Enroll to unlock</h1>
            <p className="mb-10 text-base text-text-muted">Join this bootcamp to open the full curriculum map.</p>
            <button
              onClick={enroll}
              disabled={enrolling}
              className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-base font-black uppercase disabled:opacity-50"
            >
              {enrolling ? <><Loader2 className="h-5 w-5 animate-spin" /> Enrolling…</> : 'Enroll now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Enrolled ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:px-8 md:pt-10">

        {/* ── HEADER — marketplace pattern ─────────────────────────── */}
        <ScrollReveal className="mb-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <Link
              to="/bootcamps"
              className="inline-flex items-center gap-1 font-black uppercase tracking-widest transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Bootcamps
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
            <span className="truncate font-black uppercase tracking-wide text-text-primary">
              {course?.title || 'Course'}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
                Curriculum map
              </span>
              <h1 className="text-4xl font-black text-text-primary md:text-6xl">
                {course?.title || 'Bootcamp'}
              </h1>
              <p className={`mt-2 text-sm ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
                {syncError || formatSyncLabel(lastSync)}
              </p>
            </div>

            {/* Progress pill + CTA */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="rounded-2xl border-2 border-accent/25 bg-accent-dim px-4 py-2.5 inline-flex items-center gap-2">
                <span className="font-mono text-xl font-black text-accent">{progressValue}</span>
              </div>
              <Link
                to={resolveNextRoomPath(String(bootcampId || '')) || '#'}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-black"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Resume mission
              </Link>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-accent-dim">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${progressNum}%` }}
            />
          </div>
        </ScrollReveal>

        {/* ── Phase sections ───────────────────────────────────────── */}
        <div className="space-y-10">
          {(course?.modules || []).map((mod, modIdx) => {
            const prog      = moduleProgressMap.get(Number(mod.moduleId));
            const progress  = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const isLocked  = mod.locked;
            const isComplete = progress === 100;

            const configPhase = BOOTCAMP_CONFIG.phases.find(
              (p) => p.title.toLowerCase() === String(mod.title || '').toLowerCase()
            ) || BOOTCAMP_CONFIG.phases[modIdx];

            return (
              <ScrollReveal key={mod.moduleId} delay={modIdx * 0.05}>
                {/* Phase header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-sm font-black ${
                      isComplete  ? 'border-accent/30 bg-accent text-bg'
                      : isLocked  ? 'border-border bg-bg text-text-muted'
                                  : 'border-accent/30 bg-accent-dim text-accent'
                    }`}>
                      {isComplete
                        ? <CheckCircle2 className="h-4 w-4" />
                        : isLocked
                        ? <Lock className="h-3.5 w-3.5" />
                        : String(modIdx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                        {configPhase?.codename || `Phase ${modIdx + 1}`}
                      </p>
                      <h2 className="text-base font-black text-text-primary md:text-lg">{mod.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                      <ListChecks className="h-3.5 w-3.5 opacity-50" />
                      {roomsDone}/{roomsTotal} rooms
                    </span>
                    {progress > 0 && (
                      <span className="rounded-lg border border-accent/25 bg-accent-dim px-2 py-0.5 font-mono text-xs font-black text-accent">
                        {progress}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Phase progress bar */}
                {progress > 0 && (
                  <div className="mb-4 h-1 overflow-hidden rounded-full bg-accent-dim">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Room cards */}
                {isLocked ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-bg-card/40 p-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg">
                      <Lock className="h-4 w-4 text-text-muted opacity-50" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-muted">Phase locked</p>
                      <p className="text-xs text-text-muted opacity-60">Your instructor will unlock this when it's time.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(mod.rooms || []).map((room, roomIdx) => {
                      const isRoomLocked = room.locked;
                      const roomDone     = Boolean(room.completed);

                      const configRoom = configPhase?.rooms.find(
                        (r) => r.title.toLowerCase() === String(room.title || '').toLowerCase()
                      ) || configPhase?.rooms[roomIdx];

                      const roomPath = configPhase && configRoom
                        ? `/bootcamps/${bootcampId}/phases/${configPhase.id}/rooms/${configRoom.id}`
                        : null;

                      const roomImg = configPhase
                        ? PHASE_ROOM_IMAGES[configPhase.id] ?? '/assets/bootcamp/hpb-cover.png'
                        : '/assets/bootcamp/hpb-cover.png';

                      return (
                        <Link
                          key={room.roomId}
                          to={!isRoomLocked && roomPath ? roomPath : '#'}
                          onClick={isRoomLocked ? (e) => e.preventDefault() : undefined}
                          className={`group flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card transition-colors duration-200 ${
                            isRoomLocked
                              ? 'border-border opacity-45 cursor-not-allowed pointer-events-none'
                              : roomDone
                              ? 'border-accent/30 hover:border-accent/55'
                              : 'border-border hover:border-accent/40'
                          }`}
                          style={{ boxShadow: 'var(--card-shimmer)' }}
                        >
                          {/* Room image */}
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={roomImg}
                              alt={room.title}
                              loading="lazy"
                              className={`w-full h-full object-cover transition-transform duration-500 ${
                                isRoomLocked ? 'grayscale brightness-50' : 'group-hover:scale-[1.03]'
                              }`}
                              onError={(e) => {
                                const el = e.currentTarget;
                                if (!el.dataset.fallbackApplied) {
                                  el.dataset.fallbackApplied = '1';
                                  el.src = '/assets/bootcamp/hpb-cover.png';
                                }
                              }}
                            />
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-0"
                              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }}
                            />
                            {/* Badges */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <div className={`flex h-6 w-6 items-center justify-center rounded-lg border font-mono text-[10px] font-black ${
                                roomDone      ? 'border-accent/40 bg-accent text-bg'
                                : isRoomLocked ? 'border-border bg-bg/80 text-text-muted'
                                              : 'border-accent/25 bg-bg/80 backdrop-blur-sm text-accent'
                              }`}>
                                {roomDone
                                  ? <CheckCircle2 className="h-3 w-3" />
                                  : isRoomLocked
                                  ? <Lock className="h-2.5 w-2.5" />
                                  : String(roomIdx + 1).padStart(2, '0')}
                              </div>
                              {roomDone && (
                                <span className="px-1.5 py-0.5 bg-accent text-bg rounded text-[8px] font-black uppercase tracking-widest">
                                  Done
                                </span>
                              )}
                            </div>
                            {configRoom && (
                              <div className="absolute bottom-2 right-2.5 rounded-md bg-bg/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/60">
                                {configRoom.steps.length} steps
                              </div>
                            )}
                          </div>

                          {/* Card body */}
                          <div className="flex flex-1 flex-col p-4">
                            <h3 className={`mb-1.5 text-sm font-black leading-snug transition-colors ${
                              isRoomLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'
                            }`}>
                              {configRoom?.title || room.title || `Room ${roomIdx + 1}`}
                            </h3>
                            {(configRoom?.overview || room.overview) && (
                              <p className="line-clamp-2 text-[11px] leading-relaxed text-text-muted">
                                {configRoom?.overview || room.overview}
                              </p>
                            )}
                            {!isRoomLocked && (
                              <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 transition-opacity group-hover:opacity-100">
                                Enter room <ArrowRight className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default BootcampCourse;
