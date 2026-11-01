import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, GraduationCap, Users } from 'lucide-react';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { Skeleton, ErrorState, EmptyState } from '@/shared/components/ui';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import {
  type InstructorRisk,
  type InstructorEscalationReason,
  type InstructorEscalationStatus,
  type InstructorLearner,
  type InstructorCohortSummary,
  type InstructorCohortDetail,
  INPUT_CLS,
  BTN_CLS,
} from '../../types/admin.types';

const RISK_META: Record<InstructorRisk, { label: string; className: string }> = {
  blocked: { label: 'Blocked', className: 'bg-danger/10 text-danger border-danger/20' },
  stalled: { label: 'Stalled', className: 'bg-danger/5 text-danger/80 border-danger/15' },
  on_track: { label: 'On track', className: 'bg-accent/10 text-accent border-accent/20' },
  completed: { label: 'Completed', className: 'bg-surface-raised text-text-muted border-border-subtle' },
};

const REASON_LABELS: Record<InstructorEscalationReason, string> = {
  blocked_access: 'Access blocked',
  no_progress: 'No progress',
  missed_sessions: 'Missed sessions',
  technical_issue: 'Technical issue',
  other: 'Other',
};

const REASONS = Object.keys(REASON_LABELS) as InstructorEscalationReason[];

const formatLastActivity = (learner: InstructorLearner) => {
  if (!learner.lastActivityAt) return 'No activity yet';
  if (learner.daysSinceActivity === 0) return 'Today';
  if (learner.daysSinceActivity === 1) return 'Yesterday';
  return `${learner.daysSinceActivity} days ago`;
};

const Stat = ({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'danger' | 'accent' }) => (
  <div className="min-w-[92px]">
    <div className={`font-mono text-lg font-black leading-none tabular-nums ${
      tone === 'danger' ? 'text-danger' : tone === 'accent' ? 'text-accent' : 'text-text-primary'
    }`}>
      {value}
    </div>
    <div className="mt-1 text-xs font-black uppercase tracking-widest text-text-muted">{label}</div>
  </div>
);

const InstructorTab = () => {
  const { addToast } = useToast();
  const [cohorts, setCohorts] = useState<InstructorCohortSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<InstructorCohortDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState<InstructorLearner | null>(null);
  const [reason, setReason] = useState<InstructorEscalationReason>('no_progress');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCohorts = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/admin/instructor/cohorts');
      const next = (response.data?.cohorts || []) as InstructorCohortSummary[];
      setCohorts(next);
      setSelectedId((current) => {
        if (current && next.some((cohort) => cohort.id === current)) return current;
        return next[0]?.id || null;
      });
    } catch {
      setError(true);
      addToast('Failed to load cohorts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (cohortId: string) => {
    setDetailLoading(true);
    try {
      const response = await api.get(`/admin/instructor/cohorts/${cohortId}`);
      setDetail((response.data?.cohort || null) as InstructorCohortDetail | null);
    } catch {
      setDetail(null);
      addToast('Failed to load cohort progress', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    void loadCohorts();
  }, []);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId]);

  const openEscalate = (learner: InstructorLearner) => {
    setTarget(learner);
    setReason(learner.risk === 'blocked' ? 'blocked_access' : 'no_progress');
    setNote('');
  };

  const submitEscalation = async () => {
    if (!target || !selectedId) return;
    setSubmitting(true);
    try {
      await api.post(
        `/admin/instructor/cohorts/${selectedId}/students/${target.id}/escalate`,
        { reason, note: note.trim() }
      );
      addToast('Escalation recorded', 'success');
      setTarget(null);
      setNote('');
      await Promise.all([loadDetail(selectedId), loadCohorts()]);
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed to record escalation', 'error');
      if (e?.response?.status === 409) {
        setTarget(null);
        await loadDetail(selectedId);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updateEscalation = async (escalationId: string, status: InstructorEscalationStatus) => {
    try {
      await api.patch(`/admin/instructor/escalations/${escalationId}`, { status });
      addToast(`Escalation ${status}`, 'success');
      if (selectedId) await loadDetail(selectedId);
      await loadCohorts();
    } catch {
      addToast('Failed to update escalation', 'error');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]" role="status">
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <Skeleton key={i} variant="card" className="h-24" />)}
        </div>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} variant="card" className="h-28" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Cohorts could not be loaded" message="Check the backend connection and try again." />;
  }

  if (cohorts.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-5 w-5" />}
        title="No cohorts yet"
        description="Create a cohort and add learners; their progress and escalations will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <GraduationCap className="h-4 w-4 text-text-muted" />
            <h2 className="text-xs font-black uppercase tracking-widest text-text-muted">Cohorts</h2>
            <span className="ml-auto font-mono text-xs text-text-muted">{cohorts.length}</span>
          </div>
          {cohorts.map((cohort) => {
            const active = cohort.id === selectedId;
            return (
              <button
                key={cohort.id}
                type="button"
                onClick={() => setSelectedId(cohort.id)}
                aria-pressed={active}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-border-subtle bg-surface hover:border-accent/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-text-primary">{cohort.name}</span>
                  <span className="shrink-0 font-mono text-xs text-text-muted">
                    {cohort.memberCount}{cohort.capacity ? `/${cohort.capacity}` : ''}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                  <span>{cohort.averageProgress}% avg</span>
                  {cohort.blockedCount > 0 && <span className="text-danger">{cohort.blockedCount} blocked</span>}
                  {cohort.stalledCount > 0 && <span className="text-danger/80">{cohort.stalledCount} stalled</span>}
                  {cohort.openEscalations > 0 && <span className="text-accent">{cohort.openEscalations} open</span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="min-w-0 space-y-3">
          {detailLoading ? (
            <div className="space-y-2" role="status">
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} variant="card" className="h-28" />)}
            </div>
          ) : !detail ? (
            <EmptyState title="Select a cohort" description="Choose a cohort to see learner progress and interventions." />
          ) : (
            <>
              <div className="rounded-xl border border-border-subtle bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-text-primary">{detail.name}</h2>
                    {detail.description && (
                      <p className="mt-1 text-xs text-text-muted">{detail.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-5">
                    <Stat label="Avg progress" value={`${detail.averageProgress}%`} tone="accent" />
                    <Stat label="Blocked" value={detail.blockedCount} tone={detail.blockedCount ? 'danger' : 'default'} />
                    <Stat label="Stalled" value={detail.stalledCount} tone={detail.stalledCount ? 'danger' : 'default'} />
                    <Stat label="Open" value={detail.openEscalations} />
                  </div>
                </div>
              </div>

              {detail.members.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-5 w-5" />}
                  title="No learners in this cohort"
                  description="Add learners to the cohort to begin monitoring their progress."
                />
              ) : (
                <div className="space-y-2">
                  {detail.members.map((learner) => {
                    const risk = RISK_META[learner.risk];
                    const activeEscalation = learner.escalations.find((item) => item.status !== 'resolved');
                    return (
                      <div key={learner.id} className="rounded-xl border border-border-subtle bg-surface p-4">
                        <div className="flex flex-wrap items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="truncate text-sm font-bold text-text-primary">
                                {learner.name || learner.email}
                              </span>
                              <span className={`rounded-lg border px-2 py-0.5 text-xs font-black uppercase tracking-widest ${risk.className}`}>
                                {risk.label}
                              </span>
                              {activeEscalation && (
                                <span className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-accent">
                                  Escalated · {REASON_LABELS[activeEscalation.reason]}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 truncate font-mono text-xs text-text-muted">{learner.email}</div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                              <span>{learner.completedRooms}/{learner.totalRooms} rooms · {learner.completedModules}/{learner.totalModules} modules</span>
                              <span>
                                {learner.currentModule
                                  ? `Now: M${learner.currentModule.moduleId} ${learner.currentModule.title}`
                                  : 'No module started'}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatLastActivity(learner)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEscalate(learner)}
                            className={`${BTN_CLS} border-accent/40 bg-accent/10 text-accent hover:bg-accent/20`}
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Escalate
                          </button>
                        </div>

                        <div
                          className="mt-3 h-2 overflow-hidden rounded-full bg-surface-raised"
                          role="progressbar"
                          aria-label={`${learner.name || learner.email} progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={learner.progressPercent}
                        >
                          <div className="h-full bg-accent" style={{ width: `${learner.progressPercent}%` }} />
                        </div>

                        {learner.escalations.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            {learner.escalations.map((escalation) => (
                              <div
                                key={escalation.id}
                                className="flex flex-wrap items-center gap-2 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-xs"
                              >
                                {escalation.status === 'resolved' ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                                ) : (
                                  <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                                )}
                                <span className="font-black uppercase tracking-widest text-text-muted">{escalation.status}</span>
                                <span className="text-text-secondary">{REASON_LABELS[escalation.reason]}</span>
                                {escalation.note && (
                                  <span className="min-w-0 flex-1 truncate text-text-muted">{escalation.note}</span>
                                )}
                                {escalation.status !== 'resolved' && (
                                  <div className="ml-auto flex items-center gap-1.5">
                                    {escalation.status === 'open' && (
                                      <button
                                        type="button"
                                        onClick={() => void updateEscalation(escalation.id, 'acknowledged')}
                                        className="rounded-lg border border-border-subtle px-2.5 py-1 font-bold uppercase tracking-wider text-text-muted transition-colors hover:border-accent/30 hover:text-accent"
                                      >
                                        Acknowledge
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => void updateEscalation(escalation.id, 'resolved')}
                                      className="rounded-lg border border-accent/30 px-2.5 py-1 font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent/10"
                                    >
                                      Resolve
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={target !== null} onOpenChange={(open) => { if (!open) setTarget(null); }}>
        <DialogContent
          title={target ? `Escalate ${target.name || target.email}` : 'Escalate learner'}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Record the intervention so the next instructor sees why this learner needs attention.
            </p>

            <label className="block space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Reason</span>
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value as InstructorEscalationReason)}
                className={INPUT_CLS}
              >
                {REASONS.map((value) => (
                  <option key={value} value={value}>{REASON_LABELS[value]}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">Note (optional)</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="What did you observe, and what happens next?"
                className={INPUT_CLS}
              />
            </label>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTarget(null)}
                className={`${BTN_CLS} border-border-subtle text-text-muted hover:text-text-primary`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitEscalation()}
                disabled={submitting}
                className={`${BTN_CLS} border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {submitting ? 'Recording…' : 'Record escalation'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorTab;
