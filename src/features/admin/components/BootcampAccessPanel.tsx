import React from 'react';
import { CheckCircle2, Unlock } from 'lucide-react';
import api from '../../../core/services/api';
import { HACKER_PROTOCOL_ID, BOOTCAMP_MODULES } from '../constants/bootcampModules';

interface Props {
  addToast: (msg: string, type: string) => void;
}

const BootcampAccessPanel: React.FC<Props> = ({ addToast }) => {
  const [panel, setPanel] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/admin/bootcamp/control-panel?bootcampId=${HACKER_PROTOCOL_ID}`)
      .then(res => setPanel(res.data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { load(); }, []);

  const patch = async (body: Record<string, unknown>, msg: string) => {
    setSaving(true);
    try {
      const res = await api.patch('/admin/bootcamp/access', { bootcampId: HACKER_PROTOCOL_ID, ...body });
      setPanel((p: any) => ({
        ...p,
        ...res.data?.controlPanel,
        bootcampStarted: res.data?.access?.started,
        unlockedModules: res.data?.access?.unlockedModules,
      }));
      addToast(msg, 'success');
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-text-muted text-sm animate-pulse">Loading control panel…</div>;

  const started = Boolean(panel?.bootcampStarted);
  const unlockedModules: number[] = Array.isArray(panel?.unlockedModules) ? panel.unlockedModules : [];
  const enrolledStudents = Number(panel?.enrolledStudents || 0);
  const activeStudents = Number(panel?.activeStudents || 0);
  const currentModule = panel?.currentModule || null;
  const nextModule = panel?.nextModule || null;
  const engagement = Number(panel?.engagement?.studentsInCurrentModule || 0);

  return (
    <div className="w-full space-y-8">
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Enrolled students', value: enrolledStudents },
          { label: 'Active students', value: activeStudents },
          { label: 'Engaged in current phase', value: engagement },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border-2 border-border bg-bg-card p-5 md:p-6">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">{label}</div>
            <div className="text-3xl font-black tabular-nums text-text-primary md:text-4xl">{value}</div>
          </div>
        ))}
      </div>

      {/* Live toggle */}
      <div className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-6">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-base font-black uppercase tracking-wide text-text-primary md:text-lg">Bootcamp live</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${started ? 'bg-accent/20 text-accent' : 'bg-border text-text-muted'}`}>
              {started ? 'Live' : 'Paused'}
            </span>
          </div>
          <div className="text-sm text-text-muted md:text-base">When off, learners cannot open new phases.</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={started}
          onClick={() => void patch({ started: !started }, started ? 'Bootcamp paused' : 'Bootcamp started!')}
          disabled={saving}
          className={`relative flex h-7 w-12 flex-none cursor-pointer items-center rounded-full px-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 ${started ? 'bg-accent' : 'bg-border'}`}
        >
          <span className={`pointer-events-none block h-6 w-6 shrink-0 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${started ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Phase control */}
      <div className="space-y-5 rounded-2xl border-2 border-border bg-bg-card p-5 md:p-6">
        <div>
          <div className="mb-1 text-base font-black uppercase tracking-wide text-text-primary md:text-lg">Phase control</div>
          <div className="text-sm text-text-muted md:text-base">
            {unlockedModules.length} of {BOOTCAMP_MODULES.length} phases unlocked · unlock adds all rooms in that phase
          </div>
        </div>

        {currentModule && (
          <div className="flex items-center gap-4 rounded-2xl border border-accent/25 bg-accent-dim/40 p-4 md:p-5">
            <div className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-accent" />
<div className="min-w-0">
               <div className="text-base font-black uppercase tracking-wide text-text-primary">
                 {currentModule.title}
               </div>
               <div className="mt-1 text-sm text-text-muted">{currentModule.roomCount} rooms in this phase</div>
             </div>
          </div>
        )}

        {nextModule ? (
          <button
            type="button"
            onClick={() => void patch({ unlockNext: true }, `Module "${nextModule.title}" unlocked`)}
            disabled={saving || !started}
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border-2 border-border bg-bg p-4 transition-all hover:border-accent/40 hover:bg-accent-dim/20 disabled:opacity-40 md:p-5"
          >
<div className="min-w-0 text-left">
               <div className="mb-1 text-xs font-black uppercase tracking-widest text-text-muted">Unlock next phase</div>
               <div className="text-base font-black uppercase tracking-wide text-text-primary group-hover:text-accent transition-colors">
                 {nextModule.title}
               </div>
             </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent-dim">
              <Unlock className="h-5 w-5 text-accent" />
            </div>
          </button>
        ) : (
          <div className="rounded-2xl border border-border p-4 text-center text-sm text-text-muted md:text-base">
            All phases are unlocked
          </div>
        )}

        {/* Module list */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-black uppercase tracking-widest text-text-muted">All phases</div>
          {BOOTCAMP_MODULES.map(mod => {
            const unlocked = unlockedModules.includes(mod.moduleId);
            const isCurrent = currentModule?.moduleId === mod.moduleId;
            return (
              <div
                key={mod.moduleId}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors md:px-5 md:py-3.5 ${
                  isCurrent ? 'border-accent/30 bg-accent-dim/30' : unlocked ? 'border-border bg-bg' : 'border-border/50 bg-bg/80 opacity-50'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${unlocked ? 'bg-accent text-bg' : 'border border-border bg-bg text-text-muted'}`}>
                  {unlocked ? <CheckCircle2 className="h-4 w-4" /> : String(mod.moduleId).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-text-primary md:text-base">{mod.title}</div>
                  <div className="text-xs text-text-muted">{mod.rooms} rooms</div>
                </div>
                {unlocked && <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-accent">Unlocked</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BootcampAccessPanel;
