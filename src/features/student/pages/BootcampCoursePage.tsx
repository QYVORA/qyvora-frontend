import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  BookOpen, Loader2, ArrowRight,
} from 'lucide-react';
import { BOOTCAMP_CONFIG } from '../constants/bootcampConfig';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';

// Per-phase room card images — one image per phase, shown on every room card in that phase
const PHASE_ROOM_IMAGES: Record<string, string> = {
  phase1: '/images/bootcamp-room-images/hackermindset.png',
  phase2: '/images/bootcamp-room-images/networking.png',
  phase3: '/images/bootcamp-room-images/LinuxFoundations.png',
  phase4: '/images/bootcamp-room-images/webandbackendsystems.png',
  phase5: '/images/bootcamp-room-images/socialengineering.png',
  phase6: '/images/bootcamp-room-images/hackermindset.png',
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
    } catch {
      // silently fail
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
        <ScrollReveal className="mb-12">
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-6 sm:p-8 md:p-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-accent/14 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            </div>
            <OptionalDecorImage
              src={STUDENT_DECOR.courseCurriculumMascot}
              className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden max-h-[200px] w-auto opacity-95 md:block md:max-h-[240px]"
            />
            <div className="relative z-10 max-w-3xl">
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Curriculum map</span>
              <h1 className="mb-6 text-3xl font-black text-text-primary sm:text-4xl md:text-5xl">{course?.title || 'Bootcamp'}</h1>
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                <span className="text-base font-black uppercase tracking-tight text-text-primary md:text-lg">Overall progress</span>
                <span className="font-mono text-2xl font-black text-accent md:text-3xl">{progressValue}</span>
              </div>
              <div className="relative h-3.5 w-full max-w-2xl overflow-hidden rounded-full bg-accent-dim md:h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: progressValue }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-accent"
                  style={{ boxShadow: '0 0 20px var(--color-accent-glow)' }}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Phase sections with room cards ── */}
        <div className="space-y-12">
          {(course?.modules || []).map((mod, modIdx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const isLocked = mod.locked;

            // Map API module index → config phase
            const configPhase = BOOTCAMP_CONFIG.phases[modIdx];

            return (
              <ScrollReveal key={mod.moduleId} delay={modIdx * 0.05}>
                {/* Phase header */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 font-mono text-sm font-black ${
                      progress === 100
                        ? 'border-accent/30 bg-accent text-bg'
                        : isLocked
                        ? 'border-border bg-bg text-text-muted'
                        : 'border-accent/30 bg-accent-dim text-accent'
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-4 w-4" /> : String(modIdx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                        {configPhase?.codename || `Phase ${modIdx + 1}`}
                      </p>
                      <h2 className="text-lg font-black text-text-primary md:text-xl">{mod.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                      {roomsDone}/{roomsTotal} rooms
                    </span>
                    {progress > 0 && (
                      <span className="font-mono text-sm font-black text-accent">{progress}%</span>
                    )}
                  </div>
                </div>

                {/* Phase progress bar */}
                {progress > 0 && (
                  <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-accent-dim">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Room cards grid */}
                {isLocked ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card/60 p-5 opacity-60">
                    <Lock className="h-5 w-5 shrink-0 text-text-muted" />
                    <p className="text-sm text-text-muted">This phase is locked. Your instructor will unlock it when it's time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(mod.rooms || []).map((room, roomIdx) => {
                      const isRoomLocked = room.locked;
                      const roomDone = Boolean(room.completed);

                      const configRoom = configPhase?.rooms[roomIdx];
                      const roomPath = configPhase && configRoom
                        ? `/bootcamps/${bootcampId}/phases/${configPhase.id}/rooms/${configRoom.id}`
                        : null;

                      const roomImg = configPhase
                        ? PHASE_ROOM_IMAGES[configPhase.id] ?? '/images/HPB-image.png'
                        : '/images/HPB-image.png';

                      return (
                        <div
                          key={room.roomId}
                          onClick={() => { if (!isRoomLocked && roomPath) navigate(roomPath); }}
                          className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card transition-all duration-200 ${
                            isRoomLocked
                              ? 'border-border opacity-50 cursor-not-allowed'
                              : roomDone
                              ? 'border-accent/30 cursor-pointer hover:border-accent/60 hover:shadow-[0_0_20px_rgba(183,255,153,0.06)]'
                              : 'border-border cursor-pointer hover:border-accent/40 hover:shadow-[0_0_20px_rgba(183,255,153,0.05)]'
                          }`}
                        >
                          {/* Room image */}
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={roomImg}
                              alt={room.title}
                              className={`w-full h-full object-cover transition-all duration-500 ${
                                isRoomLocked
                                  ? 'grayscale brightness-50'
                                  : 'group-hover:scale-105'
                              }`}
                            />
                            {/* Overlay badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-xs font-black ${
                                roomDone
                                  ? 'border-accent/40 bg-accent text-bg'
                                  : isRoomLocked
                                  ? 'border-border bg-bg/80 text-text-muted'
                                  : 'border-accent/25 bg-bg/80 backdrop-blur-sm text-accent'
                              }`}>
                                {roomDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : isRoomLocked ? <Lock className="h-3 w-3" /> : String(roomIdx + 1).padStart(2, '0')}
                              </div>
                              {roomDone && (
                                <span className="px-2 py-0.5 bg-accent text-bg rounded text-[9px] font-bold uppercase tracking-widest">
                                  Complete
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card body */}
                          <div className="flex flex-1 flex-col p-5">
                            {/* Room title — always from config (source of truth) */}
                            <h3 className={`mb-2 text-base font-black leading-snug transition-colors ${
                              isRoomLocked ? 'text-text-muted' : 'text-text-primary group-hover:text-accent'
                            }`}>
                              {configRoom?.title || room.title || `Room ${roomIdx + 1}`}
                            </h3>

                            {/* Room overview — prefer config overview */}
                            {(configRoom?.overview || room.overview) && (
                              <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-text-muted">
                                {configRoom?.overview || room.overview}
                              </p>
                            )}

                            {/* Step count from config */}
                            {configRoom && (
                              <p className="mt-auto text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                {configRoom.steps.length} {configRoom.steps.length === 1 ? 'step' : 'steps'}
                              </p>
                            )}

                            {/* Arrow */}
                            {!isRoomLocked && (
                              <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                            )}
                          </div>
                        </div>
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
