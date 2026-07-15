import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Key, Eye, EyeOff, Loader2, Save, Copy, CheckCircle2, AlertTriangle, RefreshCw, Settings as SettingsIcon, User } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { getDataSaverEnabled, setDataSaverEnabled } from '../utils/studentExperience';
import SEO from '../../../shared/components/SEO';
import { SettingsSkeleton } from '../components/StudentSkeletons';
import LearningOverviewCard from '../components/learning/LearningOverviewCard';

const INPUT_CLS = 'w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono';

const PasswordField: React.FC<{ name: string; placeholder?: string; label: string; shake?: boolean; onAnimationEnd?: () => void }> = ({ name, placeholder = '••••••••', label, shake = false, onAnimationEnd }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">{label}</label>
      <div
        className={`relative${shake ? ' animate-shake-x' : ''}`}
        onAnimationEnd={onAnimationEnd}
      >
        <input type={show ? 'text' : 'password'} name={name} required placeholder={placeholder} className={`${INPUT_CLS} pr-11${shake ? ' input-error' : ''}`} />
        <button type="button" onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors" tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [changingPwd, setChangingPwd] = useState(false);
  const [shakeCurrentPwd, setShakeCurrentPwd] = useState(false);
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
    document.documentElement.setAttribute('data-saver', dataSaver ? 'true' : 'false');
  }, [dataSaver]);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/recovery-token')
      .then((res) => {
        if (!mounted) return;
        setTokenAvailable(Boolean(res.data?.available));
        setRecoveryAcked(Boolean(res.data?.acknowledgedAt));
        setRecoveryCreatedAt(res.data?.createdAt || null);
      })
      .catch(() => { addToast('Failed to load recovery token status', 'error'); })
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
    if (newPassword !== confirmPassword) { addToast('New passwords do not match.', 'error'); return; }
    if (newPassword.length < 8) { addToast('Password must be at least 8 characters.', 'error'); return; }
    setChangingPwd(true);
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      addToast('Password updated successfully.', 'success');
      form.reset();
    } catch (err: any) {
      setShakeCurrentPwd(true);
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
    } catch { addToast('Could not copy to clipboard.', 'error'); }
  };

  const acknowledgeToken = async () => {
    setAcking(true);
    try {
      await api.post('/profile/recovery-token/ack', {});
      setRecoveryAcked(true);
      setLiveToken('');
      addToast('Recovery token acknowledged. Keep it somewhere safe.', 'success');
    } catch { addToast('Could not acknowledge token.', 'error'); }
    finally { setAcking(false); }
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
    } finally { setRegenerating(false); }
  };

  if (loadingRecovery) return <SettingsSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title="Settings" description="Manage your password, recovery token, and account preferences on QYVORA." />

      <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">

        <LearningOverviewCard
          icon={<SettingsIcon className="w-6 h-6 text-bg" />}
          title={t('student.settings.title')}
          description={t('student.settings.description')}
          action={{
            label: t('student.profile.edit'),
            to: '/dashboard/profile',
            icon: <User className="w-4 h-4" />,
          }}
        />

            {/* Desktop: two-column layout | Mobile: single column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Change password */}
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border bg-bg-card h-full">
                <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
                  <Shield className="h-5 w-5 text-accent" />
                  <h2 className="text-base font-black uppercase tracking-widest text-text-primary">{t('student.settings.password.title')}</h2>
                </div>
                <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                  <PasswordField
                    name="current_password"
                    label={t('student.settings.password.currentLabel')}
                    placeholder={t('student.settings.password.currentPlaceholder')}
                    shake={shakeCurrentPwd}
                    onAnimationEnd={() => setShakeCurrentPwd(false)}
                  />
                  <PasswordField name="new_password" label={t('student.settings.password.newLabel')} placeholder={t('student.settings.password.newPlaceholder')} />
                  <PasswordField name="confirm_password" label={t('student.settings.password.confirmLabel')} placeholder={t('student.settings.password.confirmPlaceholder')} />
                  <button type="submit" disabled={changingPwd}
                    className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    {changingPwd
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                      : <><Save className="w-4 h-4" /> {t('student.settings.password.update')}</>}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Recovery token */}
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border bg-bg-card h-full">
                <div className="flex items-center gap-3 border-b border-border bg-accent-dim/5 px-6 py-4">
                  <Key className="h-5 w-5 text-accent" />
                  <h2 className="text-base font-black uppercase tracking-widest text-text-primary">{t('student.settings.recovery.title')}</h2>
                </div>
                <div className="p-6 space-y-5">

                  <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-none mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {t('student.settings.recovery.description')}
                    </p>
                  </div>

                  {liveToken ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent-dim/30 border border-accent/30 rounded-xl">
                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">
                          ⚠ Copy this now — it won't be shown again
                        </p>
                        <div className="relative">
                          <input type="text" readOnly value={liveToken}
                            className={`${INPUT_CLS} pr-12 select-all cursor-text bg-bg`}
                            onFocus={(e) => e.target.select()} />
                          <button type="button" onClick={copyToken}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors" title={t('student.settings.recovery.copy')}>
                            {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        {recoveryCreatedAt && (
                          <p className="text-[10px] text-text-muted mt-1.5 font-mono">
                            Generated: {new Date(recoveryCreatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button onClick={acknowledgeToken} disabled={acking}
                        className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                        {acking
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Acknowledging...</>
                          : <><CheckCircle2 className="w-4 h-4" /> I've saved my recovery token</>}
                      </button>
                    </div>
                  ) : tokenAvailable ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-bg border border-border rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center flex-none">
                          <Key className="w-4 h-4 text-accent" />
                        </div>
                        <div className="min-w-0">
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
                        The token is stored securely and cannot be retrieved. If you've lost it, generate a new one — this will invalidate the old token.
                      </p>
                      {!confirmRegenerate ? (
                        <button onClick={() => setConfirmRegenerate(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm text-text-muted hover:border-accent/30 hover:text-accent transition-colors">
                          <RefreshCw className="w-4 h-4" /> {t('student.settings.recovery.generate')}
                        </button>
                      ) : (
                        <div className="p-4 border border-yellow-500/30 rounded-xl bg-yellow-500/5 space-y-3">
                          <p className="text-xs text-yellow-400 font-bold">This will invalidate your current recovery token. Are you sure?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setConfirmRegenerate(false)}
                              className="flex-1 px-3 py-2 border border-border rounded-xl text-xs text-text-muted hover:border-accent/30 transition-colors">
                              Cancel
                            </button>
                            <button onClick={() => void regenerateToken()} disabled={regenerating}
                              className="flex-1 px-3 py-2 border border-yellow-500/40 rounded-xl text-xs text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                              {regenerating
                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                                : <><RefreshCw className="w-3.5 h-3.5" /> Yes, regenerate</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-text-muted">You don't have a recovery token yet. Generate one to protect your account.</p>
                      <button onClick={() => void regenerateToken()} disabled={regenerating}
                        className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                        {regenerating
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                          : <><Key className="w-4 h-4" /> {t('student.settings.recovery.generate')}</>}
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">How to use</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      If you lose access, go to the login page and use <span className="text-text-primary font-mono">Forgot Password</span>.
                      Enter your email and recovery token to set a new password.
                    </p>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>{/* end grid */}
      </div>
    </div>
  );
};

export default Settings;
