import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Key, Eye, EyeOff, Loader2, Save, Copy, CheckCircle2, AlertTriangle, RefreshCw, Trash2, ChevronDown } from 'lucide-react';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { getDataSaverEnabled, setDataSaverEnabled } from '../utils/studentExperience';
import SEO from '../../../shared/components/SEO';
import Button from '../../../shared/components/ui/Button';
import FadeIn from '../../../shared/components/ui/FadeIn';
import PageHeader from '../../../shared/components/ui/PageHeader';
import SectionHeader from '../../../shared/components/ui/SectionHeader';
import { SettingsSkeleton } from '../components/StudentSkeletons';
import { usePreferences } from '../../../shared/hooks/usePreferences';
import { useThemeContext } from '../../../core/contexts/ThemeContext';
import { SETTINGS_SECTIONS, type SettingsSectionId } from '../constants/settingsSections';

const INPUT_CLS = 'w-full bg-surface-raised border border-border-subtle rounded-xl py-3 px-4 text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none outline-none transition-colors';

const LABEL_CLS = 'type-label text-text-muted uppercase tracking-widest block mb-1.5';

const PasswordField: React.FC<{ name: string; placeholder?: string; label: string; shake?: boolean; onAnimationEnd?: () => void; id: string }> = ({ name, placeholder = '••••••••', label, shake = false, onAnimationEnd, id }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLS}>{label}</label>
      <div className={`relative${shake ? ' animate-shake-x' : ''}`} onAnimationEnd={onAnimationEnd}>
        <input id={id} type={show ? 'text' : 'password'} name={name} required placeholder={placeholder} className={`${INPUT_CLS} pr-11${shake ? ' input-error' : ''}`} />
        <button type="button" onClick={() => setShow((s) => !s)}
          aria-label={"Toggle password visibility"} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors" tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ label, checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    aria-disabled={disabled}
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 transition-transform duration-200"
  >
    <span
      className={`pointer-events-none relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-accent' : 'bg-border'
      }`}
    >
      <span
        className={`inline-block rounded-full bg-surface shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        style={{ width: '20px', height: '20px' }}
      />
    </span>
  </button>
);

const SettingsRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 py-4">
    <div className="min-w-0 sm:flex-1">
      <p className="text-sm font-bold text-text-primary">{label}</p>
      {description && <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <div className="shrink-0 w-full sm:w-auto sm:flex sm:justify-end">{children}</div>
  </div>
);

const SelectField: React.FC<{ id: string; ariaLabel: string; value: string; onChange: (v: string) => void; children: React.ReactNode }> = ({ id, ariaLabel, value, onChange, children }) => (
  <div className="relative">
    <select id={id} aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full sm:w-auto min-w-[9rem] bg-surface-raised border border-border-subtle rounded-xl py-2.5 pl-3.5 pr-9 text-sm font-bold text-text-primary focus:border-accent outline-none transition-colors cursor-pointer">
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
  </div>
);

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const { preferences, loading: prefsLoading, saving: prefsSaving, updatePreferences, updateNotification, updateLearning, updateDisplay } = usePreferences();
  const { theme, setTheme } = useThemeContext();
  const { section: sectionParam } = useParams<{ section?: string }>();

  const activeSection: SettingsSectionId = SETTINGS_SECTIONS.some((s) => s.id === sectionParam)
    ? (sectionParam as SettingsSectionId)
    : 'appearance';

  const sectionHeader: Record<SettingsSectionId, { title: string; description: string }> = {
    appearance: { title: "Appearance", description: "Customize the visual appearance of your dashboard." },
    notifications: { title: "Notification Preferences", description: "Control how and when you receive notifications." },
    learning: { title: "Learning Preferences", description: "Customize your learning experience and goals." },
    security: { title: "Security", description: "Manage your account security and authentication." },
    account: { title: "Danger Zone", description: "Permanent account actions." },
  };

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
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-saver', dataSaver ? 'true' : 'false');
  }, [dataSaver]);

  useEffect(() => {
    if (prefsLoading) return;
    const root = document.documentElement;
    root.setAttribute('data-font-size', preferences.display.fontSize);
    root.setAttribute('data-animations', preferences.display.showAnimations ? 'on' : 'off');
  }, [prefsLoading, preferences.display.fontSize, preferences.display.showAnimations]);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/recovery-token')
      .then((res) => {
        if (!mounted) return;
        setTokenAvailable(Boolean(res.data?.available));
        setRecoveryAcked(Boolean(res.data?.acknowledgedAt));
        setRecoveryCreatedAt(res.data?.createdAt || null);
      })
      .catch((err) => { console.warn('[Settings] recovery token failed:', err?.response?.status || err?.message); })
      .finally(() => { if (mounted) setLoadingRecovery(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/sessions')
      .then((res) => { if (mounted) setSessions(res.data?.sessions || []); })
      .catch((err) => { console.warn('[Settings] sessions failed:', err?.response?.status || err?.message); })
      .finally(() => { if (mounted) setLoadingSessions(false); });
    return () => { mounted = false; };
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const currentPassword = String(fd.get('current_password') || '');
    const newPassword = String(fd.get('new_password') || '');
    const confirmPassword = String(fd.get('confirm_password') || '');
    if (newPassword !== confirmPassword) { addToast("Passwords do not match.", 'error'); return; }
    if (newPassword.length < 8) { addToast("Password must be at least 8 characters.", 'error'); return; }
    setChangingPwd(true);
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      addToast("Password updated successfully.", 'success');
      form.reset();
    } catch (err: any) {
      setShakeCurrentPwd(true);
      addToast(err?.response?.data?.error || "Password change failed.", 'error');
    } finally { setChangingPwd(false); }
  };

  const copyToken = async () => {
    if (!liveToken) return;
    try {
      await navigator.clipboard.writeText(liveToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { addToast("Failed to copy to clipboard.", 'error'); }
  };

  const acknowledgeToken = async () => {
    setAcking(true);
    try {
      await api.post('/profile/recovery-token/ack', {});
      setRecoveryAcked(true);
      setLiveToken('');
      addToast("Recovery token acknowledged.", 'success');
    } catch { addToast("Could not acknowledge token.", 'error'); }
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
      addToast("New recovery token generated.", 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.error || "Failed to generate token.", 'error');
    } finally { setRegenerating(false); }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.post(`/profile/sessions/${sessionId}/revoke`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      addToast("Session revoked.", 'success');
    } catch { addToast("Failed to revoke session.", 'error'); }
  };

  const handleRevokeAll = async () => {
    try {
      await api.post('/profile/sessions/revoke-all');
      const currentUA = navigator.userAgent;
      setSessions((prev) => prev.filter((s) => s.userAgent === currentUA));
      addToast("All other sessions revoked.", 'success');
    } catch { addToast("Failed to revoke sessions.", 'error'); }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/profile/account');
      addToast("Account deleted successfully.", 'success');
      window.location.href = '/';
    } catch (err: any) {
      addToast(err?.response?.data?.error || "Failed to delete account.", 'error');
    } finally { setDeleting(false); setConfirmDelete(false); }
  };

  const handleThemeChange = async (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    await updateDisplay('theme', newTheme);
  };

  const handleDataSaverToggle = (enabled: boolean) => {
    setDataSaver(enabled);
    setDataSaverEnabled(enabled);
  };

  if (prefsLoading || loadingRecovery) return <SettingsSkeleton />;

  return (
    <FadeIn>
    <>
      <SEO title={"Settings"} description={"Account and learning preferences."} noindex />

      <div className="bg-canvas min-h-full px-3 md:px-4 lg:px-6 pt-8 pb-16 md:pb-20">

        {/* Page header */}
        <PageHeader
          kicker={"Configure"}
          title={sectionHeader[activeSection].title}
          description={sectionHeader[activeSection].description}
        />

        <div className="w-full space-y-6 md:space-y-8">

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-8">
              <div>
                <SettingsRow label={"Theme"} description={"Choose between dark and light mode"}>
                  <div className="flex gap-1 bg-surface-raised rounded-xl p-1 border border-border-subtle">
                    <button onClick={() => handleThemeChange('dark')} aria-pressed={theme === 'dark'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-accent text-on-accent' : 'text-text-muted hover:text-text-primary'}`}>
                      {"Dark"}
                    </button>
                    <button onClick={() => handleThemeChange('light')} aria-pressed={theme === 'light'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'light' ? 'bg-accent text-on-accent' : 'text-text-muted hover:text-text-primary'}`}>
                      {"Light"}
                    </button>
                  </div>
                </SettingsRow>
                <SettingsRow label={"Compact Mode"} description={"Reduce spacing and padding throughout the interface"}>
                  <Toggle label={"Compact Mode"} checked={preferences.display.compactMode} onChange={(v) => updateDisplay('compactMode', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Animations"} description={"Enable motion and transition effects"}>
                  <Toggle label={"Animations"} checked={preferences.display.showAnimations} onChange={(v) => updateDisplay('showAnimations', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Font Size"}>
                  <SelectField id="settings-font-size" ariaLabel={"Font Size"} value={preferences.display.fontSize} onChange={(v) => updateDisplay('fontSize', v)}>
                    <option value="small">{"Small"}</option>
                    <option value="medium">{"Medium"}</option>
                    <option value="large">{"Large"}</option>
                  </SelectField>
                </SettingsRow>
                <SettingsRow label={"Data Saver"} description={"Limit API responses to reduce bandwidth usage"}>
                  <Toggle label={"Data Saver"} checked={dataSaver} onChange={handleDataSaverToggle} />
                </SettingsRow>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-8">
              <div>
                <SettingsRow label={"Email notifications"} description={"Receive email notifications"}>
                  <Toggle label={"Email notifications"} checked={preferences.notifications.email} onChange={(v) => updateNotification('email', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Push notifications"} description={"Receive push notifications"}>
                  <Toggle label={"Push notifications"} checked={preferences.notifications.push} onChange={(v) => updateNotification('push', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Mission updates"} description={"Course and mission updates"}>
                  <Toggle label={"Mission updates"} checked={preferences.notifications.courseUpdates} onChange={(v) => updateNotification('courseUpdates', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"CP alerts"} description={"CyberPoints alerts"}>
                  <Toggle label={"CP alerts"} checked={preferences.notifications.competitiveEvents} onChange={(v) => updateNotification('competitiveEvents', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Marketing emails"} description={"Product and service updates"}>
                  <Toggle label={"Marketing emails"} checked={preferences.notifications.newBlogs} onChange={(v) => updateNotification('newBlogs', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"System updates"} description={"Platform and system notifications"}>
                  <Toggle label={"System updates"} checked={preferences.notifications.systemUpdates} onChange={(v) => updateNotification('systemUpdates', v)} disabled={prefsSaving} />
                </SettingsRow>
              </div>
            </div>
          )}

          {/* Learning Section */}
          {activeSection === 'learning' && (
            <div className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-8">
              <div>
                <SettingsRow label={"Preferred Difficulty"}>
                  <SelectField id="settings-preferred-difficulty" ariaLabel={"Preferred Difficulty"} value={preferences.learning.preferredDifficulty} onChange={(v) => updateLearning('preferredDifficulty', v)}>
                    <option value="beginner">{"Beginner"}</option>
                    <option value="intermediate">{"Intermediate"}</option>
                    <option value="advanced">{"Advanced"}</option>
                  </SelectField>
                </SettingsRow>
                <SettingsRow label={"Weekly Study Goal (hours)"}>
                  <input id="settings-weekly-goal" type="number" min={0} max={80} value={preferences.learning.weeklyGoalHours}
                    onChange={(e) => updateLearning('weeklyGoalHours', Number(e.target.value))}
                    aria-label={"Weekly Study Goal (hours)"}
                    className="w-24 bg-surface-raised border border-border-subtle rounded-xl px-3 py-2.5 text-sm font-bold text-text-primary text-center focus:border-accent outline-none" />
                </SettingsRow>
                <SettingsRow label={"Show Hints"} description={"Display hints and suggestions during learning"}>
                  <Toggle label={"Show Hints"} checked={preferences.learning.showHints} onChange={(v) => updateLearning('showHints', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Auto-play Videos"} description={"Automatically play video content"}>
                  <Toggle label={"Auto-play Videos"} checked={preferences.learning.autoPlayVideos} onChange={(v) => updateLearning('autoPlayVideos', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={"Show Code Examples"} description={"Display code examples alongside explanations"}>
                  <Toggle label={"Show Code Examples"} checked={preferences.learning.showCodeExamples} onChange={(v) => updateLearning('showCodeExamples', v)} disabled={prefsSaving} />
                </SettingsRow>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6 md:space-y-8">
              {/* Password */}
              <div className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-8">
                <SectionHeader 
                  title={"Change Password"}
                />
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <PasswordField name="current_password" id="settings-current-password" label={"Current Password"} placeholder={"Enter current password"} shake={shakeCurrentPwd} onAnimationEnd={() => setShakeCurrentPwd(false)} />
                  <PasswordField name="new_password" id="settings-new-password" label={"New Password"} placeholder={"Enter new password"} />
                  <PasswordField name="confirm_password" id="settings-confirm-password" label={"Confirm Password"} placeholder={"Confirm new password"} />
                  <Button type="submit" loading={changingPwd}
                    className="w-full sm:w-auto !py-2.5 text-sm px-6">
                    {changingPwd ? "Updating..." : <><Save className="w-4 h-4" /> {"Update Password"}</>}
                  </Button>
                </form>
              </div>

              {/* Recovery Token */}
              <div className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-8">
                <SectionHeader 
                  title={"Recovery Token"}
                />
                <div className="space-y-5">
                  <div className="flex items-start gap-3 p-4 bg-warning/5 border border-warning/20 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-warning flex-none mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">{"Your recovery token is used to restore access to your account."}</p>
                  </div>
                  {liveToken ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent-dim/30 border border-accent/30 rounded-xl">
                        <p className="text-xs font-black text-accent uppercase tracking-widest mb-2">{"Copy this now. It won't be shown again"}</p>
                        <div className="relative">
                          <input id="settings-recovery-token" type="text" readOnly value={liveToken} aria-label={"Copy this now. It won't be shown again"} className={`${INPUT_CLS} pr-12 select-all cursor-text bg-bg`} onFocus={(e) => e.target.select()} />
                          <button type="button" onClick={copyToken} aria-label={"Copy token"} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent active:scale-95 transition-colors">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button onClick={acknowledgeToken} loading={acking} className="w-full sm:w-auto !py-2.5 text-sm px-6">
                        {acking ? "Acknowledging..." : <><CheckCircle2 className="w-4 h-4" /> {"I've saved my token"}</>}
                      </Button>
                    </div>
                  ) : tokenAvailable ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-surface-raised border border-border-subtle rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center shrink-0"><Key className="w-4 h-4 text-accent" /></div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-text-primary">{recoveryAcked ? "Token saved" : "Token exists"}</div>
                          {recoveryAcked && <div className="flex items-center gap-1 text-xs text-accent font-bold mt-0.5"><CheckCircle2 className="w-3 h-3" /> {"Acknowledged"}</div>}
                        </div>
                      </div>
                      {!confirmRegenerate ? (
                        <button onClick={() => setConfirmRegenerate(true)} className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 !text-sm">
                          <RefreshCw className="w-4 h-4" /> {"Generate New Token"}
                        </button>
                      ) : (
                        <div className="p-4 border border-warning/30 rounded-xl bg-warning/5 space-y-3">
                          <p className="text-xs text-warning font-bold">{"This will invalidate your current token. Are you sure?"}</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={() => setConfirmRegenerate(false)} className="flex-1 btn-secondary !text-xs">{"Cancel"}</button>
                            <button onClick={() => void regenerateToken()} disabled={regenerating} className="flex-1 btn-danger !text-xs disabled:opacity-50 flex items-center justify-center gap-1.5">
                              {regenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {"Generating..."}</> : <><RefreshCw className="w-3.5 h-3.5" /> {"Regenerate"}</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-text-muted">{"No recovery token yet. Generate one to protect your account."}</p>
                      <Button onClick={() => void regenerateToken()} loading={regenerating} className="w-full sm:w-auto !py-2.5 text-sm px-6">
                        {regenerating ? "Generating..." : <><Key className="w-4 h-4" /> {"Generate New Token"}</>}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sessions */}
              <div className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary mb-2">{"Active Sessions"}</h2>
                    <p className="type-meta mt-1.5">{"Devices currently logged into your account."}</p>
                  </div>
                  {sessions.length > 1 && (
                    <button onClick={handleRevokeAll} className="shrink-0 text-xs font-black uppercase tracking-widest text-danger hover:text-danger active:opacity-70 transition-colors">
                      {"Revoke All Others"}
                    </button>
                  )}
                </div>
                {loadingSessions ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-accent" /></div>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-4">{"No active sessions found."}</p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between gap-3 p-3 bg-surface-raised border border-border-subtle rounded-xl">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-text-primary truncate">{session.userAgent || "Unknown device"}</p>
                            {session.isCurrent && <span className="text-xs font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-lg">{"Current"}</span>}
                          </div>
                          <p className="text-xs text-text-muted font-mono mt-0.5">{session.ipAddress} · {new Date(session.createdAt).toLocaleDateString()}</p>
                        </div>
                        {!session.isCurrent && (
                          <button onClick={() => handleRevokeSession(session.id)} className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-danger active:opacity-70 transition-colors shrink-0">
                            {"Revoke"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account / Danger Zone */}
          {activeSection === 'account' && (
            <div className="bg-surface border border-danger/20 rounded-2xl p-5 md:p-8">
              <div className="bg-danger/5 border border-danger/20 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger flex-none mt-0.5" />
                  <div>
                    <h3 className="text-base font-black text-danger mb-2">{"Delete Account"}</h3>
                    <p className="text-sm text-text-muted mb-4">{"This action is irreversible. All your data will be permanently deleted."}</p>
                    {!confirmDelete ? (
                      <button onClick={() => setConfirmDelete(true)} className="btn-danger !py-2.5 text-sm flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> {"Delete Account"}
                      </button>
                    ) : (
                      <div className="p-4 border border-danger/30 rounded-xl bg-danger/5 space-y-3">
                        <p className="text-xs text-danger font-bold">{"This will permanently delete your account and all associated data. This action cannot be undone."}</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button onClick={() => setConfirmDelete(false)} className="flex-1 btn-secondary !text-xs">{"Cancel"}</button>
                          <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 px-3 py-2 btn-danger !text-xs disabled:opacity-50 flex items-center justify-center gap-1.5">
                            {deleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {"Deleting..."}</> : <><Trash2 className="w-3.5 h-3.5" /> {"I understand, delete my account"}</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
    </FadeIn>
  );
};

export default Settings;
