import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import { User, AlertCircle } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import HandleSuggestions from '@/shared/components/HandleSuggestions';

const HANDLE_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}[a-zA-Z0-9]$/;

const UsernameChangeModal = () => {
  const { t } = useTranslation();
  const { user, refreshMe } = useAuth();
  const [open, setOpen] = useState(false);
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.handleNeedsUpdate) {
      setOpen(true);
    }
  }, [user?.handleNeedsUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().toLowerCase();
    if (!clean) { setError('Handle is required.'); return; }
    if (!HANDLE_PATTERN.test(clean) || clean.includes('--')) {
      setError('Use only letters, numbers, and hyphens. No spaces or consecutive hyphens.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/auth/update-handle', { handle: clean });
      await refreshMe();
      setOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to update handle. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title={t('student.usernameChange.title')} description={t('student.usernameChange.description')}>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-text-primary">
                {t('student.usernameChange.title')}
              </h2>
              <p className="text-sm text-text-muted">
                {t('student.usernameChange.description')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username-change" className="text-xs font-bold text-text-muted uppercase tracking-widest">
                Username
              </label>
              <input
                id="username-change"
                type="text"
                value={handle}
                onChange={(e) => { setHandle(e.target.value); setError(''); }}
                placeholder={t('student.usernameChange.placeholder')}
                maxLength={40}
                autoFocus
                className="w-full bg-bg-card border border-border rounded-xl py-3 px-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-base"
              />
              <HandleSuggestions
                name={user?.username || user?.email?.split('@')[0] || ''}
                email={user?.email || ''}
                onSelect={(h) => { setHandle(h); setError(''); }}
                selectedHandle={handle}
              />
              <p className="text-[10px] text-text-muted/60">
                Letters, numbers, and hyphens only. No spaces. Must be unique.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-400/5 border border-red-400/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-accent text-bg font-bold uppercase tracking-wider rounded-xl py-3.5 text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? t('button.signingIn') : <><IconCheck size={16} /> {t('student.usernameChange.save')}</>}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameChangeModal;
