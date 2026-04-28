import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, ChevronRight, ChevronDown, Lock, CheckCircle2,
  BookOpen, Loader2,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';

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
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
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
        if (Array.isArray(nextCourse.modules) && nextCourse.modules.length > 0) {
          setExpandedModule((prev) => (prev === null ? Number(nextCourse.modules[0].moduleId) : prev));
        }
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
        <div className="mx-auto max-w-5xl px-4 pt-20 md:px-10 md:pt-24">
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
      <div className="mx-auto max-w-5xl px-4 pt-20 sm:px-6 md:px-10 md:pt-24">

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

        <ScrollReveal className="mb-10 md:mb-12">
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

        <h2 className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-text-muted md:text-sm">Phases & rooms</h2>

        <div className="space-y-4 md:space-y-5">
          {(course?.modules || []).map((mod, idx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const isExpanded = expandedModule === mod.moduleId;
            const isLocked = mod.locked;

            return (
              <ScrollReveal key={mod.moduleId} delay={idx * 0.04}>
                <div className={`w-full overflow-hidden rounded-2xl border-2 transition-all ${
                  isLocked ? 'border-border bg-bg-card/80 opacity-60' : isExpanded ? 'border-accent/35 bg-bg-card shadow-[inset_0_1px_0_rgba(183,255,153,0.05)]' : 'border-border bg-bg-card hover:border-accent/25'
                }`}>
                  <button
                    onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.moduleId)}
                    className="flex w-full items-center gap-5 p-5 text-left md:gap-6 md:p-7"
                    disabled={isLocked}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-base font-black font-mono md:h-14 md:w-14 ${
                      progress === 100 ? 'border-accent/30 bg-accent text-bg' : isLocked ? 'border-border bg-bg text-text-muted' : 'border-accent/25 bg-accent-dim text-accent'
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="h-6 w-6" /> : isLocked ? <Lock className="h-5 w-5" /> : String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <h3 className="text-base font-black text-text-primary md:text-lg">{mod.title}</h3>
                        {mod.roleTitle && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{mod.roleTitle}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold uppercase text-text-muted">
                        <span>{roomsDone}/{roomsTotal} rooms</span>
                        {progress > 0 && <span className="text-accent">{progress}%</span>}
                      </div>
                    </div>

                    {!isLocked && progress > 0 && progress < 100 && (
                      <div className="hidden h-2 w-24 shrink-0 overflow-hidden rounded-full bg-accent-dim sm:block">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
                      </div>
                    )}

                    {isLocked
                      ? <Lock className="h-5 w-5 shrink-0 text-text-muted" />
                      : isExpanded
                        ? <ChevronDown className="h-5 w-5 shrink-0 text-text-muted" />
                        : <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" />
                    }
                  </button>

                  {/* Rooms list */}
                  {isExpanded && !isLocked && (
                    <div className="border-t border-border">
                      {mod.description && (
                        <p className="px-5 py-3 text-xs text-text-muted border-b border-border/50">{mod.description}</p>
                      )}

                      <div className="divide-y divide-border/50">
                        {(mod.rooms || []).map((room, roomIdx) => {
                          const isRoomLocked = room.locked;
                          const roomDone = Boolean(room.completed);
                          // MVP: no meeting links — all rooms have WhatsApp session

                          return (
                            <div
                              key={room.roomId}
                              className={`flex items-center gap-4 px-6 md:px-7 py-4 md:py-5 transition-colors ${
                                isRoomLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-dim/20 cursor-pointer'
                              }`}
                              onClick={() => {
                                if (!isRoomLocked) {
                                  navigate(`/bootcamps/${bootcampId}/modules/${mod.moduleId}/rooms/${room.roomId}`);
                                }
                              }}
                            >
                              {/* Room number */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black font-mono ${
                                roomDone ? 'bg-accent text-bg' : isRoomLocked ? 'bg-bg border border-border text-text-muted' : 'bg-bg border border-border text-text-muted'
                              }`}>
                                {roomDone ? <CheckCircle2 className="w-4 h-4" /> : isRoomLocked ? <Lock className="w-3.5 h-3.5" /> : `${roomIdx + 1}`}
                              </div>

                              {/* Room info */}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm md:text-base font-bold text-text-primary truncate">{room.title || `Room ${room.roomId}`}</div>
                                {room.overview && (
                                  <div className="text-xs text-text-muted truncate mt-0.5">{room.overview}</div>
                                )}
                              </div>

                              {/* Indicators */}
                              <div className="flex items-center gap-2 shrink-0">
                                {!isRoomLocked && (
                                  <ChevronRight className="w-4 h-4 text-text-muted" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BootcampCourse;
