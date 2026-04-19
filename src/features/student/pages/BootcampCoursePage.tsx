import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen, Lock, CheckCircle2, ChevronDown, ChevronRight,
  Loader2, Flag, ArrowLeft, CreditCard, Smartphone, Zap
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';

interface Room { roomId: number; title: string; overview: string; locked: boolean; }
interface Module {
  moduleId: number; title: string; description: string; codename: string;
  roleTitle: string; badge: string; ctf: string; locked: boolean;
  rooms: Room[]; progress?: number; roomsCompleted?: number; roomsTotal?: number; ctfCompleted?: boolean;
}
interface Course { id: string; title: string; modules: Module[]; }

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const { user, refreshMe } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'btc'>('momo');
  const [btcHash, setBtcHash] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const load = async () => {
    try {
      const [ovRes, courseRes] = await Promise.all([
        api.get('/student/overview'),
        api.get('/student/course').catch(() => null),
      ]);
      setOverview(ovRes.data || null);
      setBootcampStatus(ovRes.data?.bootcampStatus || 'not_enrolled');
      setPaymentStatus(ovRes.data?.bootcampPaymentStatus || 'unpaid');
      if (courseRes?.data) setCourse(courseRes.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const enroll = async () => {
    setEnrolling(true);
    try {
      const res = await api.post('/student/bootcamp', { bootcampId: bootcampId || '' });
      setBootcampStatus(res.data?.bootcampStatus || 'enrolled');
      setPaymentStatus(res.data?.bootcampPaymentStatus || 'unpaid');
      await refreshMe();
      addToast('Enrolled in bootcamp.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Enrollment failed.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const initPayment = async () => {
    if (paymentMethod === 'btc') {
      if (!btcHash.trim()) { addToast('Enter your BTC transaction hash.', 'error'); return; }
      setPaymentLoading(true);
      try {
        await api.post('/student/bootcamp/payments/btc', { txHash: btcHash.trim() });
        setPaymentStatus('pending');
        addToast('BTC payment submitted. Awaiting admin approval.', 'success');
        setShowPayment(false);
      } catch (err: any) {
        addToast(err?.response?.data?.error || 'BTC submission failed.', 'error');
      } finally {
        setPaymentLoading(false);
      }
      return;
    }
    setPaymentLoading(true);
    try {
      const res = await api.post('/student/bootcamp/payments/initialize', { method: paymentMethod });
      if (res.data?.authorizationUrl) {
        window.location.href = res.data.authorizationUrl;
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Payment initialization failed.', 'error');
      setPaymentLoading(false);
    }
  };

  const completeRoom = async (moduleId: number, roomId: number) => {
    const key = `${moduleId}-${roomId}`;
    setCompleting(key);
    try {
      await api.post(`/student/modules/${moduleId}/rooms/${roomId}/complete`, {});
      addToast('Room marked as complete.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not complete room.', 'error');
    } finally {
      setCompleting(null);
    }
  };

  const completeCtf = async (moduleId: number) => {
    const key = `ctf-${moduleId}`;
    setCompleting(key);
    try {
      await api.post(`/student/modules/${moduleId}/ctf/complete`, {});
      addToast('CTF marked as complete.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not complete CTF.', 'error');
    } finally {
      setCompleting(null);
    }
  };

  const completeModule = async (moduleId: number) => {
    const key = `module-${moduleId}`;
    setCompleting(key);
    try {
      await api.post(`/student/modules/${moduleId}/complete`, {});
      addToast('Module completed.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not complete module.', 'error');
    } finally {
      setCompleting(null);
    }
  };

  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any) => [Number(m.id), m])
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  // Not enrolled
  if (bootcampStatus === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-8">
          <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-6 opacity-60" />
            <h1 className="text-2xl font-black text-text-primary mb-3">Enroll to Access</h1>
            <p className="text-text-muted text-sm mb-8">Register for this bootcamp to unlock the curriculum.</p>
            <button
              onClick={enroll}
              disabled={enrolling}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              {enrolling ? <><Loader2 className="w-4 h-4 animate-spin" /> Enrolling...</> : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enrolled but unpaid
  if (paymentStatus !== 'paid') {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-8">
          <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl">
            <h1 className="text-2xl font-black text-text-primary mb-2">Complete Payment</h1>
            <p className="text-text-muted text-sm mb-2">
              {paymentStatus === 'pending'
                ? 'Your payment is pending verification. If you paid via BTC, an admin will approve it shortly.'
                : 'Payment is required to access the full bootcamp curriculum.'}
            </p>

            {paymentStatus === 'pending' ? (
              <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-sm text-yellow-400 font-bold">
                ⏳ Payment pending — awaiting confirmation.
              </div>
            ) : (
              <>
                {!showPayment ? (
                  <button onClick={() => setShowPayment(true)} className="btn-primary mt-6 inline-flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Pay Now
                  </button>
                ) : (
                  <div className="mt-6 space-y-5">
                    <div className="flex gap-3">
                      {(['momo', 'card', 'btc'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`flex-1 py-2.5 rounded-lg border text-xs font-bold uppercase transition-all ${
                            paymentMethod === m
                              ? 'bg-accent text-bg border-accent'
                              : 'bg-bg border-border text-text-muted hover:border-accent/40'
                          }`}
                        >
                          {m === 'momo' ? <><Smartphone className="w-3 h-3 inline mr-1" />MoMo</> : m === 'card' ? <><CreditCard className="w-3 h-3 inline mr-1" />Card</> : '₿ BTC'}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'btc' && (
                      <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">BTC Transaction Hash</label>
                        <input
                          type="text"
                          value={btcHash}
                          onChange={(e) => setBtcHash(e.target.value)}
                          placeholder="Paste your BTC txid here"
                          className="w-full bg-bg border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none font-mono"
                        />
                        <p className="text-[10px] text-text-muted mt-1">Send payment to the BTC address provided by admin, then paste the transaction hash above.</p>
                      </div>
                    )}

                    <button
                      onClick={initPayment}
                      disabled={paymentLoading}
                      className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {paymentLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Zap className="w-4 h-4" /> Proceed to Payment</>}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Paid — show course
  return (
    <div className="min-h-screen bg-bg pb-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
        <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
        </Link>

        <ScrollReveal className="mb-8">
          <div className="p-6 md:p-8 bg-bg-card border border-border rounded-2xl">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// CURRICULUM</span>
            <h1 className="text-3xl font-black text-text-primary mb-4">{course?.title || 'Bootcamp'}</h1>
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

        {/* Modules */}
        <div className="space-y-4">
          {(course?.modules || []).map((mod, idx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const ctfDone = Boolean(prog?.ctfCompleted);
            const isExpanded = expandedModule === mod.moduleId;
            const isLocked = mod.locked;

            return (
              <ScrollReveal key={mod.moduleId} delay={idx * 0.05}>
                <div className={`bg-bg-card border rounded-xl overflow-hidden transition-all ${isLocked ? 'border-border opacity-60' : 'border-border hover:border-accent/30'}`}>
                  <button
                    onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.moduleId)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    disabled={isLocked}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none text-sm font-black font-mono ${
                      progress === 100 ? 'bg-accent text-bg' : isLocked ? 'bg-bg border border-border text-text-muted' : 'bg-accent-dim text-accent border border-accent/20'
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-text-primary truncate">{mod.title}</h3>
                        {mod.roleTitle && <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest hidden md:block">{mod.roleTitle}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase">
                        <span>{roomsDone}/{roomsTotal} rooms</span>
                        {mod.ctf && <span className={ctfDone ? 'text-accent' : ''}>CTF {ctfDone ? '✓' : '○'}</span>}
                        {progress > 0 && <span className="text-accent">{progress}%</span>}
                      </div>
                    </div>
                    {!isLocked && (
                      isExpanded ? <ChevronDown className="w-4 h-4 text-text-muted flex-none" /> : <ChevronRight className="w-4 h-4 text-text-muted flex-none" />
                    )}
                  </button>

                  {isExpanded && !isLocked && (
                    <div className="border-t border-border">
                      {mod.description && (
                        <p className="px-5 py-3 text-xs text-text-muted border-b border-border/50">{mod.description}</p>
                      )}

                      {/* Rooms */}
                      {(mod.rooms || []).map((room) => {
                        const roomDone = Boolean(
                          (overview?.modules || [])
                            .find((m: any) => Number(m.id) === mod.moduleId)
                        );
                        const completingKey = `${mod.moduleId}-${room.roomId}`;
                        const isRoomLocked = room.locked;
                        return (
                          <div key={room.roomId} className={`px-5 py-3 flex items-center justify-between border-b border-border/30 ${isRoomLocked ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded flex items-center justify-center flex-none ${isRoomLocked ? 'bg-bg border border-border' : 'bg-accent-dim border border-accent/20'}`}>
                                {isRoomLocked ? <Lock className="w-3 h-3 text-text-muted" /> : <BookOpen className="w-3 h-3 text-accent" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-text-primary">{room.title}</div>
                                {room.overview && <div className="text-[10px] text-text-muted line-clamp-1">{room.overview}</div>}
                              </div>
                            </div>
                            {!isRoomLocked && (
                              <button
                                onClick={() => completeRoom(mod.moduleId, room.roomId)}
                                disabled={completing === completingKey}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-dim border border-accent/20 hover:bg-accent/20 rounded text-[10px] font-bold text-accent uppercase transition-all disabled:opacity-50 flex-none"
                              >
                                {completing === completingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                Complete
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* CTF */}
                      {mod.ctf && (
                        <div className="px-5 py-3 flex items-center justify-between border-b border-border/30">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-none">
                              <Flag className="w-3 h-3 text-yellow-500" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-text-primary">CTF Challenge</div>
                              <div className="text-[10px] text-text-muted">{mod.ctf}</div>
                            </div>
                          </div>
                          {!ctfDone ? (
                            <button
                              onClick={() => completeCtf(mod.moduleId)}
                              disabled={completing === `ctf-${mod.moduleId}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 rounded text-[10px] font-bold text-yellow-500 uppercase transition-all disabled:opacity-50 flex-none"
                            >
                              {completing === `ctf-${mod.moduleId}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flag className="w-3 h-3" />}
                              Complete CTF
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-accent flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>
                          )}
                        </div>
                      )}

                      {/* Complete module button */}
                      {progress < 100 && (
                        <div className="px-5 py-4">
                          <button
                            onClick={() => completeModule(mod.moduleId)}
                            disabled={completing === `module-${mod.moduleId}`}
                            className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {completing === `module-${mod.moduleId}` ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Completing...</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Mark Module Complete</>}
                          </button>
                        </div>
                      )}
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
