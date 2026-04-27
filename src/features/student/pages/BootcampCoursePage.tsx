import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, ChevronRight, ChevronDown, Lock, CheckCircle2,
  BookOpen, Loader2, Video,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';

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
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
          <div className="mb-6 h-4 w-36 rounded bg-bg-card border border-border animate-pulse" />
          <div className="p-6 bg-bg-card border border-border rounded-2xl animate-pulse mb-6">
            <div className="h-3 w-28 rounded bg-accent/20 mb-4" />
            <div className="h-8 w-64 rounded bg-bg mb-4" />
            <div className="h-2 w-full rounded bg-accent-dim" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-bg-card border border-border animate-pulse mb-3" />
          ))}
        </div>
      </div>
    );
  }

  // ── Not enrolled ──
  if (bootcampStatus === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
          <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-6 opacity-60" />
            <h1 className="text-2xl font-black text-text-primary mb-3">Enroll to Access</h1>
            <p className="text-text-muted text-sm mb-8">Register for this bootcamp to unlock the curriculum.</p>
            <button onClick={enroll} disabled={enrolling} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {enrolling ? <><Loader2 className="w-4 h-4 animate-spin" /> Enrolling...</> : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Enrolled ──
  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-20 md:pt-24">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link to="/bootcamps" className="hover:text-accent transition-colors flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Bootcamps
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-text-primary font-bold uppercase tracking-widest truncate">{course?.title || 'Course'}</span>
        </div>

        {/* Progress header */}
        <ScrollReveal className="mb-8">
          <div className="p-6 md:p-8 bg-bg-card border border-border rounded-2xl">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// CURRICULUM</span>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary mb-4">{course?.title || 'Bootcamp'}</h1>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-text-primary">Overall Progress</span>
              <span className="text-sm font-mono text-accent">{progressValue}</span>
            </div>
            <div className="h-2 w-full bg-accent-dim rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressValue }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Phases (modules) */}
        <div className="space-y-3">
          {(course?.modules || []).map((mod, idx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const isExpanded = expandedModule === mod.moduleId;
            const isLocked = mod.locked;

            return (
              <ScrollReveal key={mod.moduleId} delay={idx * 0.04}>
                <div className={`w-full bg-bg-card border rounded-xl overflow-hidden transition-all ${
                  isLocked ? 'border-border opacity-60' : isExpanded ? 'border-accent/30' : 'border-border hover:border-accent/20'
                }`}>
                  {/* Phase header — clickable */}
                  <button
                    onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.moduleId)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    disabled={isLocked}
                  >
                    {/* Phase number / status icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none text-sm font-black font-mono shrink-0 ${
                      progress === 100 ? 'bg-accent text-bg' : isLocked ? 'bg-bg border border-border text-text-muted' : 'bg-accent-dim text-accent border border-accent/20'
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1">
                        <h3 className="text-sm font-bold text-text-primary">{mod.title}</h3>
                        {mod.roleTitle && (
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{mod.roleTitle}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase">
                        <span>{roomsDone}/{roomsTotal} rooms</span>
                        {progress > 0 && <span className="text-accent">{progress}%</span>}
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    {!isLocked && progress > 0 && progress < 100 && (
                      <div className="hidden sm:block w-20 h-1.5 bg-accent-dim rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    )}

                    {isLocked
                      ? <Lock className="w-4 h-4 text-text-muted shrink-0" />
                      : isExpanded
                        ? <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
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
                              className={`flex items-center gap-4 px-5 py-4 transition-colors ${
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
                                <div className="text-sm font-bold text-text-primary truncate">{room.title || `Room ${room.roomId}`}</div>
                                {room.overview && (
                                  <div className="text-[11px] text-text-muted truncate mt-0.5">{room.overview}</div>
                                )}
                              </div>

                              {/* Indicators */}
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-accent/70 uppercase tracking-widest">
                                  <Video className="w-3 h-3" /> WhatsApp
                                </span>
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
