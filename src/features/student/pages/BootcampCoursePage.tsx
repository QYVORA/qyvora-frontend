import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  BookOpen, Loader2, ArrowRight, Play, ListChecks,
} from 'lucide-react';
import { BOOTCAMP_CONFIG } from '../constants/bootcampConfig';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';
import { formatSyncLabel, getDataSaverEnabled, getLastSync, resolveNextRoomPath, setLastSyncNow } from '../utils/studentExperience';

// Per-phase room card images — one image per phase, shown on every room card in that phase
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

  const [course, setCourse] = useState<Course | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');
  const [enrolling, setEnrolling] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(getLastSync('bootcamp-course'));
  const [dataSaver] = useState(getDataSaverEnabled());

  const load = async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const [ovRes, courseRes] = await Promise.all([
        api.get('/student/overview'),
        api.get(`/student/course${query}`).catch(() => null),
      ]);
      const ov = ovRes.data || null;
      setOverview(ov);

      // Determine enrollment for THIS specific bootcamp
      // Check 1: overview.bootcampId matches (single-bootcamp model)
      // Check 2: overview.modules contains an entry for this bootcamp
      const enrolledViaStatus =
        ov?.bootcampStatus && ov.bootcampStatus !== 'not_enrolled' &&
        String(ov?.bootcampId || '') === String(bootcampId || '');
      const enrolledViaModules = (Array.isArray(ov?.modules) ? ov.modules : []).some(
        (m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || '')
      );
      const enrolled = enrolledViaStatus || enrolledViaModules;
      setBootcampStatus(enrolled ? 'enrolled' : 'not_enrolled');

      if (courseRes?.data) {
        const nextCourse = courseRes.data as Course;
        setCourse(nextCourse);
      }
      setLastSync(setLastSyncNow('bootcamp-course'));
      setSyncError('');
    } catch {
      setSyncError('Could not sync full course state. Displaying available data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [bootcampId]);

  const enroll = async () => {
    setEnrolling(true);
    try {
      const res = await api.post('/student/bootcamp', { bootcampId: bootcampId || '' });
      setBootcampStatus(res.data?.bootcampStatus || 'enrolled');
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
  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any) => [Number(m.id), m])
  );

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-12">
        <div className="mx-auto max-w-6xl px-4 pt-20 md:px-8 md:pt-24">
          <div className="mb-6 h-6 w-40 animate-pulse rounded-lg bg-accent-dim/40" />
          <div className="mb-8 animate-pulse overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-8 md:p-10">
            <div className="mb-6 h-4 w-36 rounded-lg bg-accent/20" />
            <div className="mb-4 h-10 max-w-xl rounded-xl bg-accent-dim/30" />
            <div className="mb-8 h-3.5 w-full max-w-xl rounded-full bg-accent-dim" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-4 h-20 animate-pulse rounded-2xl border border-border bg-bg-card" />
          ))}
        </div>
      </div>
    );
  }

  // ── Not enrolled ──
  if (bootcampStatus === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-bg pb-12">
        <div className="mx-auto max-w-2xl px-4 pt-20 md:px-10 md:pt-24">
          <Link
            to="/bootcamps"
            className="mb-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to bootcamps
          </Link>
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card px-8 py-12 text-center md:px-12 md:py-14">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
            </div>
            <OptionalDecorImage
              src={STUDENT_DECOR.courseCurriculumMascot}
              className="pointer-events-none absolute -bottom-4 right-4 z-[1] hidden max-h-[140px] w-auto opacity-90 md:block"
            />
            <div className="relative z-10">
              <BookOpen className="mx-auto mb-6 h-14 w-14 text-accent opacity-80 md:h-16 md:w-16" />
              <h1 className="mb-3 text-3xl font-black text-text-primary md:text-4xl">Enroll to unlock</h1>
              <p className="mb-10 text-base text-text-muted md:text-lg">Join this bootcamp to open the full curriculum map.</p>
              <button onClick={enroll} disabled={enrolling} className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-base font-black uppercase disabled:opacity-50">
                {enrolling ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Enrolling…
                  </>
                ) : (
                  'Enroll now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Enrolled ──
  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:px-8 md:pt-24">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <Link
            to="/bootcamps"
            className="inline-flex items-center gap-1 font-black uppercase tracking-widest transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Bootcamps
          </Link>
          <ChevronRight className="h-4 w-4 opacity-40" />
          <span className="truncate font-black uppercase tracking-wide text-text-primary">{course?.title || 'Course'}</span>
        </div>

        {/* Hero card */}
        <ScrollReveal className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-6 sm:p-8 md:p-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-accent/14 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            </div>
            <OptionalDecorImage
              src={dataSaver ? undefined : STUDENT_DECOR.courseCurriculumMascot}
              className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden max-h-[200px] w-auto opacity-95 md:block md:max-h-[240px]"
            />
            <div className="relative z-10 max-w-2xl">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.35em] text-accent">// Curriculum map</span>
              <h1 className="mb-5 text-2xl font-black text-text-primary sm:text-3xl md:text-4xl">{course?.title || 'Bootcamp'}</h1>

              {/* Progress */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Overall progress</span>
                <span className="font-mono text-xl font-black text-accent">{progressValue}</span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-accent-dim">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: progressValue }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-accent"
                  style={{ boxShadow: '0 0 16px var(--color-accent-glow)' }}
                />
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  to={resolveNextRoomPath(String(bootcampId || '')) || '#'}
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-black"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Resume mission
                </Link>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`My next HSOCIETY mission: ${resolveNextRoomPath(String(bootcampId || '')) || '/bootcamps'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
                >
                  Share on WhatsApp
                </a>
              </div>

              <p className={`mt-3 text-[11px] ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
                {syncError || formatSyncLabel(lastSync)}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Phase sections with room cards ── */}
        <div className="space-y-10">
          {(course?.modules || []).map((mod, modIdx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const isLocked = mod.locked;
            const isComplete = progress === 100;

            // Map API module index → config phase
            const configPhase = BOOTCAMP_CONFIG.phases.find((p) => p.title.toLowerCase() === String(mod.title || '').toLowerCase())
              || BOOTCAMP_CONFIG.phases[modIdx];

            return (
              <ScrollReveal key={mod.moduleId} delay={modIdx * 0.05}>
                {/* Phase header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-sm font-black ${
                      isComplete
                        ? 'border-accent/30 bg-accent text-bg'
                        : isLocked
                        ? 'border-border bg-bg text-text-muted'
                        : 'border-accent/30 bg-accent-dim text-accent'
                    }`}>
                      {isComplete ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-3.5 w-3.5" /> : String(modIdx + 1).padStart(2, '0')}
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                )}

                {/* Room cards grid */}
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
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(mod.rooms || []).map((room, roomIdx) => {
                      const isRoomLocked = room.locked;
                      const roomDone = Boolean(room.completed);

                      const configRoom = configPhase?.rooms.find((r) => r.title.toLowerCase() === String(room.title || '').toLowerCase())
                        || configPhase?.rooms[roomIdx];
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
                          className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card transition-all duration-200 ${
                            isRoomLocked
                              ? 'border-border opacity-45 cursor-not-allowed pointer-events-none'
                              : roomDone
                              ? 'border-accent/30 hover:border-accent/60 hover:shadow-[0_0_24px_rgba(183,255,153,0.07)]'
                              : 'border-border hover:border-accent/40 hover:shadow-[0_0_20px_rgba(183,255,153,0.05)]'
                          }`}
                        >
                          {/* Room image */}
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={roomImg}
                              alt={room.title}
                              loading="lazy"
                              className={`w-full h-full object-cover transition-all duration-500 ${
                                isRoomLocked ? 'grayscale brightness-50' : 'group-hover:scale-[1.04]'
                              }`}
                            />
                            {/* Gradient */}
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-0"
                              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }}
                            />
                            {/* Badges */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <div className={`flex h-6 w-6 items-center justify-center rounded-lg border font-mono text-[10px] font-black ${
                                roomDone
                                  ? 'border-accent/40 bg-accent text-bg'
                                  : isRoomLocked
                                  ? 'border-border bg-bg/80 text-text-muted'
                                  : 'border-accent/25 bg-bg/80 backdrop-blur-sm text-accent'
                              }`}>
                                {roomDone ? <CheckCircle2 className="h-3 w-3" /> : isRoomLocked ? <Lock className="h-2.5 w-2.5" /> : String(roomIdx + 1).padStart(2, '0')}
                              </div>
                              {roomDone && (
                                <span className="px-1.5 py-0.5 bg-accent text-bg rounded text-[8px] font-black uppercase tracking-widest">
                                  Done
                                </span>
                              )}
                            </div>
                            {/* Step count pill — bottom right of image */}
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

                            {/* Enter arrow */}
                            {!isRoomLocked && (
                              <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 transition-all group-hover:opacity-100">
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
