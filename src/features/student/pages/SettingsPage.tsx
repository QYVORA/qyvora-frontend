import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Key, Eye, EyeOff, Loader2, Save, Copy, CheckCircle2, AlertTriangle, RefreshCw, Settings as SettingsIcon, User, Palette, Bell, BookOpen, Code, Database, Accessibility, Trash2, Monitor, Smartphone, Moon, Sun } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { getDataSaverEnabled, setDataSaverEnabled } from '../utils/studentExperience';
import SEO from '../../../shared/components/SEO';
import { SettingsSkeleton } from '../components/StudentSkeletons';
import LearningOverviewCard from '../components/learning/LearningOverviewCard';
import { usePreferences } from '../../../shared/hooks/usePreferences';
import { useThemeContext } from '../../../core/contexts/ThemeContext';
import { useAuth } from '../../../core/contexts/AuthContext';

const INPUT_CLS = 'w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono';

const TABS = ['appearance', 'notifications', 'learning', 'codeEditor', 'data', 'security', 'account'] as const;
type Tab = typeof TABS[number];

const PasswordField: React.FC<{ name: string; placeholder?: string; label: string; shake?: boolean; onAnimationEnd?: () => void; id: string }> = ({ name, placeholder = '••••••••', label, shake = false, onAnimationEnd, id }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">{label}</label>
        <div className={`relative${shake ? ' animate-shake-x' : ''}`} onAnimationEnd={onAnimationEnd}>
          <input id={id} type={show ? 'text' : 'password'} name={name} required placeholder={placeholder} className={`${INPUT_CLS} pr-11${shake ? ' input-error' : ''}`} />
        <button type="button" onClick={() => setShow((s) => !s)}
          aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors" tabIndex={-1}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
      checked ? 'bg-accent' : 'bg-border'
    }`}
    style={{ width: '44px', height: '24px', minWidth: '44px', minHeight: '24px' }}
  >
    <span
      className={`pointer-events-none inline-block rounded-full bg-bg shadow-lg transition-transform duration-200 ${
        checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
      }`}
      style={{ width: '20px', height: '20px' }}
    />
  </button>
);

const SettingsRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="min-w-0">
      <p className="text-sm font-bold text-text-primary">{label}</p>
      {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { preferences, loading: prefsLoading, saving: prefsSaving, updatePreferences, updateNotification, updateLearning, updateDisplay } = usePreferences();
  const { theme, setTheme } = useThemeContext();
  const [activeTab, setActiveTab] = useState<Tab>('appearance');

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
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingRecovery(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/sessions')
      .then((res) => { if (mounted) setSessions(res.data?.sessions || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingSessions(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (user) {
      setTwoFAEnabled((user as any).twoFactorEnabled || false);
    }
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const currentPassword = String(fd.get('current_password') || '');
    const newPassword = String(fd.get('new_password') || '');
    const confirmPassword = String(fd.get('confirm_password') || '');
    if (newPassword !== confirmPassword) { addToast(t('validation.passwordMismatch'), 'error'); return; }
    if (newPassword.length < 8) { addToast('Password must be at least 8 characters.', 'error'); return; }
    setChangingPwd(true);
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      addToast(t('toast.passwordUpdated'), 'success');
      form.reset();
    } catch (err: any) {
      setShakeCurrentPwd(true);
      addToast(err?.response?.data?.error || 'Password change failed.', 'error');
    } finally { setChangingPwd(false); }
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
      addToast('Recovery token acknowledged.', 'success');
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
      addToast('New recovery token generated.', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Failed to generate token.', 'error');
    } finally { setRegenerating(false); }
  };

  const handleToggle2FA = async () => {
    setToggling2FA(true);
    try {
      if (twoFAEnabled) {
        await api.post('/auth/2fa/disable');
        setTwoFAEnabled(false);
        addToast('2FA disabled.', 'success');
      } else {
        await api.post('/auth/2fa/enable');
        setTwoFAEnabled(true);
        addToast('2FA enabled.', 'success');
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Failed to update 2FA.', 'error');
    } finally { setToggling2FA(false); }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.post(`/profile/sessions/${sessionId}/revoke`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      addToast(t('student.settings.sessions.revokeSuccess'), 'success');
    } catch { addToast('Failed to revoke session.', 'error'); }
  };

  const handleRevokeAll = async () => {
    try {
      await api.post('/profile/sessions/revoke-all');
      const currentUA = navigator.userAgent;
      setSessions((prev) => prev.filter((s) => s.userAgent === currentUA));
      addToast(t('student.settings.sessions.revokeAllSuccess'), 'success');
    } catch { addToast('Failed to revoke sessions.', 'error'); }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/profile/account');
      addToast(t('student.settings.dangerZone.deleteSuccess'), 'success');
      window.location.href = '/';
    } catch (err: any) {
      addToast(err?.response?.data?.error || t('student.settings.dangerZone.deleteFailed'), 'error');
    } finally { setDeleting(false); setConfirmDelete(false); }
  };

  const handleThemeChange = async (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    await updateDisplay('theme', newTheme);
  };

  const handleLanguageChange = async (lang: string) => {
    await updateDisplay('language', lang);
    i18n.changeLanguage(lang).then(() => window.location.reload());
  };

  const handleDataSaverToggle = (enabled: boolean) => {
    setDataSaver(enabled);
    setDataSaverEnabled(enabled);
  };

  if (prefsLoading || loadingRecovery) return <SettingsSkeleton />;

  const tabIcons: Record<Tab, React.ReactNode> = {
    appearance: <Palette className="w-4 h-4" />,
    notifications: <Bell className="w-4 h-4" />,
    learning: <BookOpen className="w-4 h-4" />,
    codeEditor: <Code className="w-4 h-4" />,
    data: <Database className="w-4 h-4" />,
    security: <Shield className="w-4 h-4" />,
    account: <User className="w-4 h-4" />,
  };

  return (
    <div className="bg-bg">
      <SEO title={t('student.settings.seoTitle')} description={t('student.settings.seoDesc')} noindex />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
        <LearningOverviewCard
          icon={<SettingsIcon className="w-6 h-6 text-bg" />}
          title={t('student.settings.title')}
          description={t('student.settings.description')}
          action={{ label: t('student.profile.edit'), to: '/dashboard/profile', icon: <User className="w-4 h-4" /> }}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-56 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-primary hover:bg-accent/5'
                  }`}
                >
                  {tabIcons[tab]}
                  {t(`student.settings.tabs.${tab}`)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'appearance' && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border/30 bg-bg-card">
                  <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                    <Palette className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.appearance.title')}</h2>
                  </div>
                  <div className="p-6 divide-y divide-border/30">
                    <SettingsRow label={t('student.settings.appearance.theme')}>
                      <div className="flex gap-1 bg-bg rounded-xl p-1 border border-border/30">
                        <button onClick={() => handleThemeChange('dark')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-primary'}`}>
                          <Moon className="w-3.5 h-3.5" /> {t('student.settings.appearance.dark')}
                        </button>
                        <button onClick={() => handleThemeChange('light')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'light' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text-primary'}`}>
                          <Sun className="w-3.5 h-3.5" /> {t('student.settings.appearance.light')}
                        </button>
                      </div>
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.appearance.compactMode')} description={t('student.settings.appearance.compactModeDesc')}>
                      <Toggle checked={preferences.display.compactMode} onChange={(v) => updateDisplay('compactMode', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.appearance.showAnimations')} description={t('student.settings.appearance.showAnimationsDesc')}>
                      <Toggle checked={preferences.display.showAnimations} onChange={(v) => updateDisplay('showAnimations', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.appearance.fontSize')}>
                      <select id="settings-font-size" aria-label={t('student.settings.appearance.fontSize')} value={preferences.display.fontSize} onChange={(e) => updateDisplay('fontSize', e.target.value)}
                        className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary focus:border-accent outline-none">
                        <option value="small">{t('student.settings.appearance.small')}</option>
                        <option value="medium">{t('student.settings.appearance.medium')}</option>
                        <option value="large">{t('student.settings.appearance.large')}</option>
                      </select>
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.languageSection.title')} description={t('student.settings.languageSection.description')}>
                      <select id="settings-language" aria-label={t('student.settings.languageSection.title')} value={preferences.display.language || i18n.language} onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary focus:border-accent outline-none">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                        <option value="pt">Português</option>
                        <option value="ar">العربية</option>
                        <option value="hi">हिन्दी</option>
                        <option value="zh">中文</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="ru">Русский</option>
                        <option value="ha">Hausa</option>
                        <option value="yo">Yorùbá</option>
                        <option value="ig">Igbo</option>
                        <option value="sw">Kiswahili</option>
                      </select>
                    </SettingsRow>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'notifications' && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border/30 bg-bg-card">
                  <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                    <Bell className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.notifications.title')}</h2>
                  </div>
                  <div className="p-6 divide-y divide-border/30">
                    <SettingsRow label={t('student.settings.notifications.email')} description="Receive email notifications">
                      <Toggle checked={preferences.notifications.email} onChange={(v) => updateNotification('email', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.notifications.push')} description="Receive push notifications">
                      <Toggle checked={preferences.notifications.push} onChange={(v) => updateNotification('push', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.notifications.mission')} description="Course and mission updates">
                      <Toggle checked={preferences.notifications.courseUpdates} onChange={(v) => updateNotification('courseUpdates', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.notifications.cpAlerts')} description="CyberPoints alerts">
                      <Toggle checked={preferences.notifications.competitiveEvents} onChange={(v) => updateNotification('competitiveEvents', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.notifications.marketing')} description="Product and service updates">
                      <Toggle checked={preferences.notifications.newBlogs} onChange={(v) => updateNotification('newBlogs', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label="System updates" description="Platform and system notifications">
                      <Toggle checked={preferences.notifications.systemUpdates} onChange={(v) => updateNotification('systemUpdates', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label="Sound" description="Notification sounds">
                      <Toggle checked={preferences.notifications.soundEnabled} onChange={(v) => updateNotification('soundEnabled', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label="Desktop notifications" description="Browser notification popups">
                      <Toggle checked={preferences.notifications.desktopNotifications} onChange={(v) => updateNotification('desktopNotifications', v)} disabled={prefsSaving} />
                    </SettingsRow>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'learning' && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border/30 bg-bg-card">
                  <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.learningPrefs.title')}</h2>
                  </div>
                  <div className="p-6 divide-y divide-border/30">
                    <SettingsRow label={t('student.settings.learningPrefs.difficulty')}>
                      <select id="settings-preferred-difficulty" aria-label={t('student.settings.learningPrefs.difficulty')} value={preferences.learning.preferredDifficulty} onChange={(e) => updateLearning('preferredDifficulty', e.target.value)}
                        className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary focus:border-accent outline-none">
                        <option value="beginner">{t('student.settings.learningPrefs.beginner')}</option>
                        <option value="intermediate">{t('student.settings.learningPrefs.intermediate')}</option>
                        <option value="advanced">{t('student.settings.learningPrefs.advanced')}</option>
                      </select>
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.learningPrefs.weeklyGoal')}>
                      <input id="settings-weekly-goal" type="number" min={0} max={80} value={preferences.learning.weeklyGoalHours}
                        onChange={(e) => updateLearning('weeklyGoalHours', Number(e.target.value))}
                        className="w-20 bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary text-center focus:border-accent outline-none" />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.learningPrefs.showHints')} description={t('student.settings.learningPrefs.showHintsDesc')}>
                      <Toggle checked={preferences.learning.showHints} onChange={(v) => updateLearning('showHints', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.learningPrefs.autoPlayVideos')} description={t('student.settings.learningPrefs.autoPlayVideosDesc')}>
                      <Toggle checked={preferences.learning.autoPlayVideos} onChange={(v) => updateLearning('autoPlayVideos', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.learningPrefs.showCodeExamples')} description={t('student.settings.learningPrefs.showCodeExamplesDesc')}>
                      <Toggle checked={preferences.learning.showCodeExamples} onChange={(v) => updateLearning('showCodeExamples', v)} disabled={prefsSaving} />
                    </SettingsRow>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'codeEditor' && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border/30 bg-bg-card">
                  <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                    <Code className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.codeEditorPrefs.title')}</h2>
                  </div>
                  <div className="p-6 divide-y divide-border/30">
                    <SettingsRow label={t('student.settings.codeEditorPrefs.fontSize')}>
                      <input id="settings-code-font-size" type="number" min={10} max={24} value={preferences.display.codeFontSize}
                        onChange={(e) => updateDisplay('codeFontSize', Number(e.target.value))}
                        className="w-20 bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary text-center focus:border-accent outline-none" />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.codeEditorPrefs.fontFamily')}>
                      <select id="settings-code-font-family" aria-label={t('student.settings.codeEditorPrefs.fontFamily')} value={preferences.display.codeFontFamily} onChange={(e) => updateDisplay('codeFontFamily', e.target.value)}
                        className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary focus:border-accent outline-none">
                        <option value="Fira Code">Fira Code</option>
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Source Code Pro">Source Code Pro</option>
                        <option value="Cascadia Code">Cascadia Code</option>
                        <option value="monospace">System Monospace</option>
                      </select>
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.codeEditorPrefs.lineNumbers')}>
                      <Toggle checked={preferences.display.codeLineNumbers} onChange={(v) => updateDisplay('codeLineNumbers', v)} disabled={prefsSaving} />
                    </SettingsRow>
                    <SettingsRow label={t('student.settings.codeEditorPrefs.minimap')}>
                      <Toggle checked={preferences.display.codeMinimap} onChange={(v) => updateDisplay('codeMinimap', v)} disabled={prefsSaving} />
                    </SettingsRow>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'data' && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border/30 bg-bg-card">
                  <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                    <Database className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.dataStorage.title')}</h2>
                  </div>
                  <div className="p-6 divide-y divide-border/30">
                    <SettingsRow label={t('student.settings.dataStorage.dataSaver')} description={t('student.settings.dataStorage.dataSaverDesc')}>
                      <Toggle checked={dataSaver} onChange={handleDataSaverToggle} />
                    </SettingsRow>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* 2FA */}
                <ScrollReveal>
                  <div className="rounded-2xl border border-border/30 bg-bg-card">
                    <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                      <Shield className="h-5 w-5 text-accent" />
                      <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.twoFactor.title')}</h2>
                    </div>
                    <div className="p-6">
                      <SettingsRow label={twoFAEnabled ? t('student.settings.twoFactor.enabled') : t('student.settings.twoFactor.disabled')} description={t('student.settings.twoFactor.description')}>
                        <button onClick={handleToggle2FA} disabled={toggling2FA}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                            twoFAEnabled ? 'border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10' : 'btn-primary'
                          }`}>
                          {toggling2FA ? <Loader2 className="w-4 h-4 animate-spin" /> : twoFAEnabled ? t('student.settings.twoFactor.disable') : t('student.settings.twoFactor.enable')}
                        </button>
                      </SettingsRow>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Password */}
                <ScrollReveal>
                  <div className="rounded-2xl border border-border/30 bg-bg-card">
                    <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                      <Key className="h-5 w-5 text-accent" />
                      <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.password.title')}</h2>
                    </div>
                    <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                      <PasswordField name="current_password" id="settings-current-password" label={t('student.settings.password.currentLabel')} placeholder={t('student.settings.password.currentPlaceholder')} shake={shakeCurrentPwd} onAnimationEnd={() => setShakeCurrentPwd(false)} />
                      <PasswordField name="new_password" id="settings-new-password" label={t('student.settings.password.newLabel')} placeholder={t('student.settings.password.newPlaceholder')} />
                      <PasswordField name="confirm_password" id="settings-confirm-password" label={t('student.settings.password.confirmLabel')} placeholder={t('student.settings.password.confirmPlaceholder')} />
                      <button type="submit" disabled={changingPwd}
                        className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                        {changingPwd ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><Save className="w-4 h-4" /> {t('student.settings.password.update')}</>}
                      </button>
                    </form>
                  </div>
                </ScrollReveal>

                {/* Recovery Token */}
                <ScrollReveal>
                  <div className="rounded-2xl border border-border/30 bg-bg-card">
                    <div className="flex items-center gap-3 border-b border-border/30 px-6 py-4">
                      <Key className="h-5 w-5 text-accent" />
                      <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.recovery.title')}</h2>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 flex-none mt-0.5" />
                        <p className="text-xs text-text-secondary leading-relaxed">{t('student.settings.recovery.description')}</p>
                      </div>
                      {liveToken ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-accent-dim/30 border border-accent/30 rounded-xl">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">Copy this now — it won't be shown again</p>
                            <div className="relative">
                              <input id="settings-recovery-token" type="text" readOnly value={liveToken} className={`${INPUT_CLS} pr-12 select-all cursor-text bg-bg`} onFocus={(e) => e.target.select()} />
                              <button type="button" onClick={copyToken} aria-label="Copy token" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors">
                                {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <button onClick={acknowledgeToken} disabled={acking} className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                            {acking ? <><Loader2 className="w-4 h-4 animate-spin" /> Acknowledging...</> : <><CheckCircle2 className="w-4 h-4" /> I've saved my token</>}
                          </button>
                        </div>
                      ) : tokenAvailable ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-bg border border-border rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center shrink-0"><Key className="w-4 h-4 text-accent" /></div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-text-primary">{recoveryAcked ? 'Token saved' : 'Token exists'}</div>
                              {recoveryAcked && <div className="flex items-center gap-1 text-[10px] text-accent font-bold mt-0.5"><CheckCircle2 className="w-3 h-3" /> Acknowledged</div>}
                            </div>
                          </div>
                          {!confirmRegenerate ? (
                            <button onClick={() => setConfirmRegenerate(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm text-text-muted hover:border-accent/30 hover:text-accent transition-colors">
                              <RefreshCw className="w-4 h-4" /> {t('student.settings.recovery.generate')}
                            </button>
                          ) : (
                            <div className="p-4 border border-yellow-500/30 rounded-xl bg-yellow-500/5 space-y-3">
                              <p className="text-xs text-yellow-400 font-bold">This will invalidate your current token. Are you sure?</p>
                              <div className="flex gap-2">
                                <button onClick={() => setConfirmRegenerate(false)} className="flex-1 px-3 py-2 border border-border rounded-xl text-xs text-text-muted hover:border-accent/30 transition-colors">Cancel</button>
                                <button onClick={() => void regenerateToken()} disabled={regenerating} className="flex-1 px-3 py-2 border border-yellow-500/40 rounded-xl text-xs text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                                  {regenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</> : <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-text-muted">No recovery token yet. Generate one to protect your account.</p>
                          <button onClick={() => void regenerateToken()} disabled={regenerating} className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                            {regenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Key className="w-4 h-4" /> {t('student.settings.recovery.generate')}</>}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Sessions */}
                <ScrollReveal>
                  <div className="rounded-2xl border border-border/30 bg-bg-card">
                    <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-accent" />
                        <h2 className="text-base font-black uppercase tracking-widest">{t('student.settings.sessions.title')}</h2>
                      </div>
                      {sessions.length > 1 && (
                        <button onClick={handleRevokeAll} className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors">
                          {t('student.settings.sessions.revokeAll')}
                        </button>
                      )}
                    </div>
                    <div className="p-6">
                      {loadingSessions ? (
                        <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-accent" /></div>
                      ) : sessions.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-4">{t('student.settings.sessions.empty')}</p>
                      ) : (
                        <div className="space-y-3">
                          {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between gap-3 p-3 bg-bg border border-border/30 rounded-xl">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-text-primary truncate">{session.userAgent || t('student.settings.sessions.unknown')}</p>
                                  {session.isCurrent && <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-lg">{t('student.settings.sessions.current')}</span>}
                                </div>
                                <p className="text-[10px] text-text-muted font-mono mt-0.5">{session.ipAddress} · {new Date(session.createdAt).toLocaleDateString()}</p>
                              </div>
                              {!session.isCurrent && (
                                <button onClick={() => handleRevokeSession(session.id)} className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors shrink-0">
                                  {t('student.settings.sessions.revoke')}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}

            {activeTab === 'account' && (
              <ScrollReveal>
                <div className="rounded-2xl border border-red-500/20 bg-bg-card">
                  <div className="flex items-center gap-3 border-b border-red-500/20 px-6 py-4">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <h2 className="text-base font-black uppercase tracking-widest text-red-400">{t('student.settings.dangerZone.title')}</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-text-muted">{t('student.settings.dangerZone.deleteDescription')}</p>
                    {!confirmDelete ? (
                      <button onClick={() => setConfirmDelete(true)} className="btn-danger !py-2.5 text-sm flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> {t('student.settings.dangerZone.deleteAccount')}
                      </button>
                    ) : (
                      <div className="p-4 border border-red-500/30 rounded-xl bg-red-500/5 space-y-3">
                        <p className="text-xs text-red-400 font-bold">{t('student.settings.dangerZone.deleteConfirmDesc')}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setConfirmDelete(false)} className="flex-1 px-3 py-2 border border-border rounded-xl text-xs text-text-muted hover:border-accent/30 transition-colors">Cancel</button>
                          <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 px-3 py-2 btn-danger !text-xs disabled:opacity-50 flex items-center justify-center gap-1.5">
                            {deleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...</> : <><Trash2 className="w-3.5 h-3.5" /> {t('student.settings.dangerZone.confirmDelete')}</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
