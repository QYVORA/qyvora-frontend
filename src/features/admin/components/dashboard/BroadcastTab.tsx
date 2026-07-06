import { useState } from 'react';
import { Send, Megaphone, Users, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { ConfirmDialog } from '@/shared/components/ui/Dialog';
import { INPUT_CLS, BTN_CLS } from '../../types/admin.types';

const BroadcastTab = () => {
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
      addToast(`Announcement sent to ${res.data?.sentCount || 0} recipients`, 'success');
      setTitle('');
      setMessage('');
      setTargetFilter('all');
      setRole('');
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Failed to send announcement', 'error');
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
            <h3 className="text-sm font-black uppercase tracking-wide text-text-primary">New Announcement</h3>
            <p className="text-xs text-text-muted">Send a broadcast notification to platform users</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Platform Maintenance Tomorrow"
            className={INPUT_CLS}
            maxLength={200}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your announcement message..."
            className={`${INPUT_CLS} min-h-[120px] resize-none`}
            maxLength={5000}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Target Audience</label>
          <div className="flex flex-wrap gap-2">
            {([
              { value: 'all', label: 'All Users', icon: Users },
              { value: 'bootcamp_enrolled', label: 'Bootcamp Enrolled', icon: Users },
              { value: 'by_role', label: 'By Role', icon: AlertTriangle },
            ] as const).map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTargetFilter(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                    targetFilter === opt.value
                      ? 'bg-accent text-bg'
                      : 'border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {opt.label}
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
                <option value="">Select role...</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>

        {/* Preview */}
        {title.trim() && (
          <div className="rounded-xl border border-border bg-bg p-4 space-y-2">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Preview</div>
            <div className="rounded-lg border border-accent/20 bg-accent-dim/5 p-3 space-y-1">
              <div className="text-sm font-bold text-text-primary">{title}</div>
              {message.trim() && <div className="text-xs text-text-secondary leading-relaxed">{message}</div>}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!title.trim() || !message.trim()}
          className={`${BTN_CLS} w-full bg-accent text-bg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Send className="w-4 h-4" /> Send Announcement
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Broadcast"
        description={`Send "${title.slice(0, 80)}" to ${targetFilter === 'all' ? 'all users' : targetFilter === 'bootcamp_enrolled' ? 'bootcamp-enrolled users' : `${role} users`}?`}
        confirmLabel={sending ? 'Sending...' : 'Send'}
        cancelLabel="Cancel"
        onConfirm={handleSend}
      />
    </div>
  );
};

export default BroadcastTab;
