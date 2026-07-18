import { useState } from 'react';
import { Send, Megaphone, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconWarning } from '@/shared/components/icons';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { ConfirmDialog } from '@/shared/components/ui/Dialog';
import { INPUT_CLS, BTN_CLS } from '../../types/admin.types';

const BroadcastTab = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetFilter, setTargetFilter] = useState<'all' | 'bootcamp_enrolled' | 'by_role'>('all');
  const [role, setRole] = useState('');
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    try {
      const payload: Record<string, unknown> = { title: title.trim(), message: message.trim(), targetFilter };
      if (targetFilter === 'by_role') payload.role = role;
      const res = await api.post('/admin/announcements', payload);
      addToast(t('admin.broadcast.sent', { count: res.data?.sentCount || 0 }), 'success');
      setTitle('');
      setMessage('');
      setTargetFilter('all');
      setRole('');
    } catch (e: any) {
      addToast(e?.response?.data?.error || t('admin.broadcast.sendFailed'), 'error');
    } finally {
      setSending(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-border/30 bg-bg-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-text-primary">{t('admin.broadcast.newAnnouncement')}</h3>
            <p className="text-xs text-text-muted">{t('admin.broadcast.description')}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('form.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('admin.broadcast.titlePlaceholder')}
            className={INPUT_CLS}
            maxLength={200}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('form.message')}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('admin.broadcast.messagePlaceholder')}
            className={`${INPUT_CLS} min-h-[120px] resize-none`}
            maxLength={5000}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('admin.broadcast.targetAudience')}</label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: 'all', label: t('admin.broadcast.allUsers'), icon: Users },
              { value: 'bootcamp_enrolled', label: t('admin.broadcast.bootcampEnrolled'), icon: Users },
              { value: 'by_role', label: t('admin.broadcast.byRole'), icon: IconWarning },
            ] as const).map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTargetFilter(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                    targetFilter === opt.value
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  <Icon size={14} /> {opt.label}
                </button>
              );
            })}
          </div>
          {targetFilter === 'by_role' && (
            <div className="mt-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">{t('admin.broadcast.selectRole')}</option>
                <option value="student">{t('admin.broadcast.student')}</option>
                <option value="admin">{t('admin.broadcast.admin')}</option>
              </select>
            </div>
          )}
        </div>

        {/* Preview */}
        {title.trim() && (
          <div className="rounded-xl border border-border bg-bg p-4 space-y-2">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('admin.broadcast.preview')}</div>
            <div className="rounded-lg border border-accent/20 bg-accent-dim/5 p-3 space-y-1">
              <div className="text-sm font-bold text-text-primary">{title}</div>
              {message.trim() && <div className="text-xs text-text-secondary leading-relaxed">{message}</div>}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!title.trim() || !message.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" /> {t('button.send')}
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('admin.broadcast.confirmTitle')}
        description={t('admin.broadcast.confirmDescription', { title: title.slice(0, 80), audience: targetFilter === 'all' ? t('admin.broadcast.allUsers').toLowerCase() : targetFilter === 'bootcamp_enrolled' ? t('admin.broadcast.bootcampEnrolled').toLowerCase() : `${role} ${t('admin.broadcast.users').toLowerCase()}` })}
        confirmLabel={sending ? t('admin.broadcast.sending') : t('button.send')}
        cancelLabel={t('button.cancel')}
        onConfirm={handleSend}
      />
    </div>
  );
};

export default BroadcastTab;
