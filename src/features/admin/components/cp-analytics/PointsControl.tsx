import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, ChevronDown } from 'lucide-react';

interface PointsControlProps {
  users: Array<{ id: string; hackerHandle?: string; name?: string; email?: string }>;
  cpUserId: string;
  setCpUserId: (id: string) => void;
  cpAction: 'grant' | 'deduct' | 'set';
  setCpAction: (action: 'grant' | 'deduct' | 'set') => void;
  cpValue: number;
  setCpValue: (val: number) => void;
  cpReason: string;
  setCpReason: (reason: string) => void;
  runCpAction: () => Promise<void>;
  saving: boolean;
}

const PointsControl: React.FC<PointsControlProps> = ({
  users,
  cpUserId,
  setCpUserId,
  cpAction,
  setCpAction,
  cpValue,
  setCpValue,
  cpReason,
  setCpReason,
  runCpAction,
  saving,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Coins className="w-4 h-4 text-accent" />
        <span className="text-sm font-black uppercase tracking-wide text-text-primary">{t('admin.cp.control')}</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] uppercase text-text-muted tracking-widest block mb-1.5">{t('admin.cp.user')}</label>
          <div className="relative">
            <select
              value={cpUserId}
              onChange={e => setCpUserId(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent appearance-none pr-8"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.hackerHandle || u.name || u.email}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['grant','deduct','set'] as const).map(a => (
            <button key={a} onClick={() => setCpAction(a)}
              className={`py-2 transition-colors ${
                cpAction === a
                  ? a === 'deduct' ? 'border border-red-400/40 text-red-400 bg-red-400/10 rounded-xl text-xs font-bold uppercase tracking-wide'
                    : 'btn-primary'
                  : 'btn-secondary'
              }`}>
              {t(`admin.cp.action.${a}`)}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={cpValue || ''}
          onChange={e => setCpValue(Number(e.target.value || 0))}
          placeholder={cpAction === 'set' ? t('admin.cp.targetValue') : t('admin.cp.pointsAmount')}
          className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
        />
        <input
          value={cpReason}
          onChange={e => setCpReason(e.target.value)}
          placeholder={t('admin.cp.reasonOptional')}
          className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
        />
        <button
          onClick={() => void runCpAction()}
          disabled={saving}
          className="btn-secondary w-full py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <><div className="w-4 h-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin" /> {t('admin.cp.processing')}</> : t('admin.cp.execute')}
        </button>
      </div>
    </div>
  );
};

export default PointsControl;
