import React, { useEffect, useState } from 'react';
import { Shield, Key, Eye, EyeOff, Loader2, Save, Copy, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { getDataSaverEnabled, setDataSaverEnabled } from '../utils/studentExperience';

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

  // Recovery token state
  // `liveToken` holds the plaintext only right after generation — cleared on ack or page reload
  const [liveToken, setLiveToken] = useState('');
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [recoveryAcked, setRecoveryAcked] = useState(false);
  const [recoveryCreatedAt, setRecoveryCreatedAt] = useState<string | null>(null);
  const [loadingRecovery, setLoadingRecovery] = useState(true);
  const [copied, setCopied] = useState(false);
  const [acking, setAcking] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [dataSaver, setDataSaver] = useState(getDataSaverEnabled());

  useEffect(() => {
    let mounted = true;
    api.get('/profile/recovery-token')
      .then((res) => {
        if (!mounted) return;
        // Backend never re-exposes the plaintext — token field is always ''
        // We only get metadata: available, createdAt, acknowledgedAt
        setTokenAvailable(Boolean(res.data?.available));
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
    if (!liveToken) return;
    try {
      await navigator.clipboard.writeText(liveToken);
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
      setLiveToken(''); // clear plaintext from memory after ack
      addToast('Recovery token acknowledged. Keep it somewhere safe.', 'success');
    } catch {
      addToast('Could not acknowledge token.', 'error');
    } finally {
      setAcking(false);
    }
  };

  const regenerateToken = async () => {
    setRegenerating(true);
    setConfirmRegenerate(false);
    try {
      const res = await api.post('/profile/recovery-token/regenerate', {});
      setLiveToken(res.data?.token || '');
      setTokenAvailable(true);
      setRecoveryAcked(false);
      setRecoveryCreatedAt(res.data?.createdAt || new Date().toISOString());
      addToast('New recovery token generated. Copy it now — it will not be shown again.', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Failed to generate token.', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-10">
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-10 md:pt-10">
        <ScrollReveal className="mb-10">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">Security</span>
          <h1 className="text-4xl font-black text-text-primary md:text-5xl">Account settings</h1>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <ScrollReveal className="mb-0 lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
              <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
                <Shield className="h-5 w-5 text-accent" />
                <h2 className="text-base font-black uppercase tracking-widest text-text-primary">Mobile Data Saver</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-text-secondary mb-4">
                  Reduce image-heavy visuals and decorative assets for lower bandwidth and smoother performance on mobile networks.
                </p>
                <button
                  onClick={() => {
                    const next = !dataSaver;
                    setDataSaver(next);
                    setDataSaverEnabled(next);
                    addToast(next ? 'Data Saver enabled.' : 'Data Saver disabled.', 'success');
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                    dataSaver
                      ? 'bg-accent-dim border-accent/40 text-accent'
                      : 'bg-bg border-border text-text-muted hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  {dataSaver ? 'Data Saver: ON' : 'Data Saver: OFF'}
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* ── CHANGE PASSWORD ── */}
          <ScrollReveal className="mb-0">
            <div className="overflow-hidden rounded-3xl border-2 border-border bg-bg-card">
              <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
                <Shield className="h-5 w-5 text-accent" />
                <h2 className="text-base font-black uppercase tracking-widest text-text-primary">Change password</h2>
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
                  {changingPwd
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                    : <><Save className="w-4 h-4" /> Update Password</>}
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
              <div className="p-6 space-y-5">

                {/* Explanation */}
                <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-none mt-0.5" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Your recovery token lets you reset your password without email access. Store it in a password manager or somewhere safe. It is shown <strong className="text-text-primary">only once</strong> after generation.
                  </p>
                </div>

                {loadingRecovery ? (
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </div>
                ) : liveToken ? (
                  /* ── Token just generated — show it once ── */
                  <div className="space-y-4">
                    <div className="p-3 bg-accent-dim/30 border border-accent/30 rounded-lg">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">
                        ⚠ Copy this now — it won't be shown again
                      </p>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={liveToken}
                          className={`${INPUT_CLS} pr-12 select-all cursor-text bg-bg`}
                          onFocus={e => e.target.select()}
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
                        <p className="text-[10px] text-text-muted mt-1.5 font-mono">
                          Generated: {new Date(recoveryCreatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={acknowledgeToken}
                      disabled={acking}
                      className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {acking
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Acknowledging...</>
                        : <><CheckCircle2 className="w-4 h-4" /> I've saved my recovery token</>}
                    </button>
                  </div>
                ) : tokenAvailable ? (
                  /* ── Token exists but plaintext not available (already acked or old token) ── */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-bg border border-border rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center flex-none">
                        <Key className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-text-primary">
                          {recoveryAcked ? 'Token saved and acknowledged' : 'Token exists'}
                        </div>
                        {recoveryCreatedAt && (
                          <div className="text-[10px] text-text-muted font-mono mt-0.5">
                            Created: {new Date(recoveryCreatedAt).toLocaleString()}
                          </div>
                        )}
                        {recoveryAcked && (
                          <div className="flex items-center gap-1 text-[10px] text-accent font-bold mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Acknowledged
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-text-muted">
                      The token is stored securely and cannot be retrieved. If you've lost it, generate a new one below — this will invalidate the old token.
                    </p>

                    {!confirmRegenerate ? (
                      <button
                        onClick={() => setConfirmRegenerate(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm text-text-muted hover:border-accent/30 hover:text-accent transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" /> Generate New Token
                      </button>
                    ) : (
                      <div className="p-4 border border-yellow-500/30 rounded-xl bg-yellow-500/5 space-y-3">
                        <p className="text-xs text-yellow-400 font-bold">
                          This will invalidate your current recovery token. Are you sure?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmRegenerate(false)}
                            className="flex-1 px-3 py-2 border border-border rounded-xl text-xs text-text-muted hover:border-accent/30 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => void regenerateToken()}
                            disabled={regenerating}
                            className="flex-1 px-3 py-2 border border-yellow-500/40 rounded-xl text-xs text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {regenerating
                              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                              : <><RefreshCw className="w-3.5 h-3.5" /> Yes, regenerate</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── No token at all — generate first one ── */
                  <div className="space-y-4">
                    <p className="text-sm text-text-muted">
                      You don't have a recovery token yet. Generate one to protect your account.
                    </p>
                    <button
                      onClick={() => void regenerateToken()}
                      disabled={regenerating}
                      className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {regenerating
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                        : <><Key className="w-4 h-4" /> Generate Recovery Token</>}
                    </button>
                  </div>
                )}

                {/* How to use */}
                <div className="pt-2 border-t border-border/50">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">How to use</p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    If you lose access to your account, go to the login page and use <span className="text-text-primary font-mono">Forgot Password</span>. Enter your email and recovery token to set a new password. The token is single-use — a new one will be needed after recovery.
                  </p>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Settings;
