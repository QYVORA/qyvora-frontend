import React, { useEffect, useState } from 'react';
import { Shield, Key, Eye, EyeOff, Loader2, Save, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';

const INPUT_CLS = 'w-full bg-bg border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono';

const PasswordField: React.FC<{ name: string; placeholder?: string; label: string }> = ({ name, placeholder = '••••••••', label }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          required
          placeholder={placeholder}
          className={`${INPUT_CLS} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const [changingPwd, setChangingPwd] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState('');
  const [recoveryAcked, setRecoveryAcked] = useState(false);
  const [recoveryCreatedAt, setRecoveryCreatedAt] = useState<string | null>(null);
  const [loadingRecovery, setLoadingRecovery] = useState(true);
  const [copied, setCopied] = useState(false);
  const [acking, setAcking] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/recovery-token')
      .then((res) => {
        if (!mounted) return;
        setRecoveryToken(res.data?.token || '');
        setRecoveryAcked(Boolean(res.data?.acknowledgedAt));
        setRecoveryCreatedAt(res.data?.createdAt || null);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingRecovery(false); });
    return () => { mounted = false; };
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const currentPassword = String(fd.get('current_password') || '');
    const newPassword = String(fd.get('new_password') || '');
    const confirmPassword = String(fd.get('confirm_password') || '');

    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return;
    }

    setChangingPwd(true);
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      addToast('Password updated successfully.', 'success');
      form.reset();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Password change failed.', 'error');
    } finally {
      setChangingPwd(false);
    }
  };

  const copyToken = async () => {
    if (!recoveryToken) return;
    try {
      await navigator.clipboard.writeText(recoveryToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Could not copy to clipboard.', 'error');
    }
  };

  const acknowledgeToken = async () => {
    setAcking(true);
    try {
      await api.post('/profile/recovery-token/ack', {});
      setRecoveryAcked(true);
      addToast('Recovery token acknowledged. Store it somewhere safe.', 'success');
    } catch {
      addToast('Could not acknowledge token.', 'error');
    } finally {
      setAcking(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-4">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
        <ScrollReveal className="mb-8">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// SECURITY</span>
          <h1 className="text-3xl font-black text-text-primary">Account Settings</h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* ── CHANGE PASSWORD ── */}
        <ScrollReveal className="mb-0">
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-accent-dim/5 flex items-center gap-3">
              <Shield className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <PasswordField name="current_password" label="Current Password" placeholder="Your current password" />
              <PasswordField name="new_password" label="New Password" placeholder="Min 8 characters" />
              <PasswordField name="confirm_password" label="Confirm New Password" />
              <button
                type="submit"
                disabled={changingPwd}
                className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {changingPwd ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><Save className="w-4 h-4" /> Update Password</>}
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* ── RECOVERY TOKEN ── */}
        <ScrollReveal className="mb-0">
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-accent-dim/5 flex items-center gap-3">
              <Key className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Recovery Token</h2>
            </div>
            <div className="p-6">
              {!recoveryAcked && (
                <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg mb-5">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-none mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    This is your account recovery token. Copy it and store it somewhere safe — it can be used to reset your password if you lose access. You will only see it once after acknowledging.
                  </p>
                </div>
              )}

              {loadingRecovery ? (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading recovery token...
                </div>
              ) : recoveryToken ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">Your Recovery Token</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={recoveryToken}
                        className={`${INPUT_CLS} pr-12 select-all cursor-text`}
                      />
                      <button
                        type="button"
                        onClick={copyToken}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                        title="Copy token"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {recoveryCreatedAt && (
                      <p className="text-[10px] text-text-muted mt-1 font-mono">
                        Generated: {new Date(recoveryCreatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {!recoveryAcked && (
                    <button
                      onClick={acknowledgeToken}
                      disabled={acking}
                      className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {acking ? <><Loader2 className="w-4 h-4 animate-spin" /> Acknowledging...</> : <><CheckCircle2 className="w-4 h-4" /> I've saved my recovery token</>}
                    </button>
                  )}

                  {recoveryAcked && (
                    <div className="flex items-center gap-2 text-xs text-accent font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Token acknowledged and stored.
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No recovery token available.</p>
              )}
            </div>
          </div>
        </ScrollReveal>
        </div>{/* end grid */}
      </div>
    </div>
  );
};

export default Settings;
