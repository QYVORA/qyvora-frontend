import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Key, Eye, EyeOff, Loader2, Save, Copy, CheckCircle2, AlertTriangle, RefreshCw, Trash2, ChevronDown } from 'lucide-react';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { getDataSaverEnabled, setDataSaverEnabled } from '../utils/studentExperience';
import SEO from '../../../shared/components/SEO';
import Button from '../../../shared/components/ui/Button';
import FadeIn from '../../../shared/components/ui/FadeIn';
import { SettingsSkeleton } from '../components/StudentSkeletons';
import { usePreferences } from '../../../shared/hooks/usePreferences';
import { useThemeContext } from '../../../core/contexts/ThemeContext';
import { SETTINGS_SECTIONS, type SettingsSectionId } from '../constants/settingsSections';

const INPUT_CLS = 'w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono';

const LABEL_CLS = 'text-[10px] font-black uppercase tracking-widest text-text-muted block mb-1.5';

const SectionHeader: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-black text-text-primary mb-2">{title}</h2>
    {description && <p className="text-sm text-text-muted">{description}</p>}
  </div>
);

const PasswordField: React.FC<{ name: string; placeholder?: string; label: string; shake?: boolean; onAnimationEnd?: () => void; id: string }> = ({ name, placeholder = '••••••••', label, shake = false, onAnimationEnd, id }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLS}>{label}</label>
      <div className={`relative${shake ? ' animate-shake-x' : ''}`} onAnimationEnd={onAnimationEnd}>
        <input id={id} type={show ? 'text' : 'password'} name={name} required placeholder={placeholder} className={`${INPUT_CLS} pr-11${shake ? ' input-error' : ''}`} />
        <button type="button" onClick={() => setShow((s) => !s)}
          aria-label={t('aria.togglePassword')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors" tabIndex={-1}>
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
    className="relative inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 focus:outline-none disabled:opacity-50 active:scale-95"
    style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
  >
    <span
      className={`pointer-events-none inline-flex items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-accent' : 'bg-border'
      }`}
      style={{ width: '44px', height: '24px' }}
    >
      <span
        className={`inline-block rounded-full bg-bg shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
    <div className="shrink-0">{children}</div>
  </div>
);

const SelectField: React.FC<{ id: string; ariaLabel: string; value: string; onChange: (v: string) => void; children: React.ReactNode }> = ({ id, ariaLabel, value, onChange, children }) => (
  <div className="relative">
    <select id={id} aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full sm:w-auto min-w-[9rem] bg-bg border border-border rounded-xl py-2.5 pl-3.5 pr-9 text-sm font-bold text-text-primary focus:border-accent outline-none transition-all cursor-pointer">
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
  </div>
);

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const { preferences, loading: prefsLoading, saving: prefsSaving, updatePreferences, updateNotification, updateLearning, updateDisplay } = usePreferences();
  const { theme, setTheme } = useThemeContext();
  const { section: sectionParam } = useParams<{ section?: string }>();

  const activeSection: SettingsSectionId = SETTINGS_SECTIONS.some((s) => s.id === sectionParam)
    ? (sectionParam as SettingsSectionId)
    : 'appearance';

  const sectionHeader: Record<SettingsSectionId, { title: string; description: string }> = {
    appearance: { title: t('student.settings.appearance.title'), description: t('student.settings.appearance.description') },
    notifications: { title: t('student.settings.notifications.title'), description: t('student.settings.notifications.description') },
    learning: { title: t('student.settings.learningPrefs.title'), description: t('student.settings.learningPrefs.description') },
    security: { title: t('student.settings.security.title'), description: t('student.settings.security.description') },
    account: { title: t('student.settings.dangerZone.title'), description: t('student.settings.dangerZone.description') },
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
    if (newPassword !== confirmPassword) { addToast(t('validation.passwordMismatch'), 'error'); return; }
    if (newPassword.length < 8) { addToast(t('toast.passwordMinLength'), 'error'); return; }
    setChangingPwd(true);
    try {
      await api.put('/profile/password', { currentPassword, newPassword });
      addToast(t('toast.passwordUpdated'), 'success');
      form.reset();
    } catch (err: any) {
      setShakeCurrentPwd(true);
      addToast(err?.response?.data?.error || t('toast.passwordChangeFailed'), 'error');
    } finally { setChangingPwd(false); }
  };

  const copyToken = async () => {
    if (!liveToken) return;
    try {
      await navigator.clipboard.writeText(liveToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { addToast(t('toast.copyFailed'), 'error'); }
  };

  const acknowledgeToken = async () => {
    setAcking(true);
    try {
      await api.post('/profile/recovery-token/ack', {});
      setRecoveryAcked(true);
      setLiveToken('');
      addToast(t('toast.recoveryTokenAcknowledged'), 'success');
    } catch { addToast(t('toast.couldNotAcknowledgeToken'), 'error'); }
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
      addToast(t('toast.newRecoveryTokenGenerated'), 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.error || t('toast.failedToGenerateToken'), 'error');
    } finally { setRegenerating(false); }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.post(`/profile/sessions/${sessionId}/revoke`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      addToast(t('student.settings.sessions.revokeSuccess'), 'success');
    } catch { addToast(t('toast.failedToRevokeSession'), 'error'); }
  };

  const handleRevokeAll = async () => {
    try {
      await api.post('/profile/sessions/revoke-all');
      const currentUA = navigator.userAgent;
      setSessions((prev) => prev.filter((s) => s.userAgent === currentUA));
      addToast(t('student.settings.sessions.revokeAllSuccess'), 'success');
    } catch { addToast(t('toast.failedToRevokeSessions'), 'error'); }
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

  return (
    <FadeIn>
    <>
      <SEO title={t('student.settings.seoTitle')} description={t('student.settings.seoDesc')} noindex />

      <div className="bg-bg min-h-screen px-3 md:px-4 lg:px-6 pt-8 pb-16 md:pb-20">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary">{sectionHeader[activeSection].title}</h1>
            <p className="text-sm md:text-base text-text-muted mt-2">{sectionHeader[activeSection].description}</p>
          </div>
          <div className="md:hidden">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">CONFIGURE</span>
          </div>
        </div>

        <div className="w-full space-y-6 md:space-y-8">

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="bg-bg-card border border-border/50 rounded-2xl p-5 md:p-8">
              <SectionHeader 
                title={t('student.settings.appearance.title')}
                description={t('student.settings.appearance.description')}
              />
              <div>
                <SettingsRow label={t('student.settings.appearance.theme')} description={t('student.settings.appearance.themeDesc')}>
                  <div className="flex gap-1 bg-bg rounded-xl p-1 border border-border/50">
                    <button onClick={() => handleThemeChange('dark')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-accent text-on-accent' : 'text-text-muted hover:text-text-primary'}`}>
                      {t('student.settings.appearance.dark')}
                    </button>
                    <button onClick={() => handleThemeChange('light')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'light' ? 'bg-accent text-on-accent' : 'text-text-muted hover:text-text-primary'}`}>
                      {t('student.settings.appearance.light')}
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
                  <SelectField id="settings-font-size" ariaLabel={t('student.settings.appearance.fontSize')} value={preferences.display.fontSize} onChange={(v) => updateDisplay('fontSize', v)}>
                    <option value="small">{t('student.settings.appearance.small')}</option>
                    <option value="medium">{t('student.settings.appearance.medium')}</option>
                    <option value="large">{t('student.settings.appearance.large')}</option>
                  </SelectField>
                </SettingsRow>
                <SettingsRow label={t('student.settings.dataStorage.dataSaver')} description={t('student.settings.dataStorage.dataSaverDesc')}>
                  <Toggle checked={dataSaver} onChange={handleDataSaverToggle} />
                </SettingsRow>
                <SettingsRow label={t('student.settings.languageSection.title')} description={t('student.settings.languageSection.description')}>
                  <SelectField id="settings-language" ariaLabel={t('student.settings.languageSection.title')} value={preferences.display.language || i18n.language} onChange={handleLanguageChange}>
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
                  </SelectField>
                </SettingsRow>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-bg-card border border-border/50 rounded-2xl p-5 md:p-8">
              <SectionHeader 
                title={t('student.settings.notifications.title')}
                description={t('student.settings.notifications.description')}
              />
              <div>
                <SettingsRow label={t('student.settings.notifications.email')} description={t('student.settings.notifications.receiveEmail')}>
                  <Toggle checked={preferences.notifications.email} onChange={(v) => updateNotification('email', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={t('student.settings.notifications.push')} description={t('student.settings.notifications.receivePush')}>
                  <Toggle checked={preferences.notifications.push} onChange={(v) => updateNotification('push', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={t('student.settings.notifications.mission')} description={t('student.settings.notifications.courseAndMission')}>
                  <Toggle checked={preferences.notifications.courseUpdates} onChange={(v) => updateNotification('courseUpdates', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={t('student.settings.notifications.cpAlerts')} description={t('student.settings.notifications.cpAlertsDesc')}>
                  <Toggle checked={preferences.notifications.competitiveEvents} onChange={(v) => updateNotification('competitiveEvents', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={t('student.settings.notifications.marketing')} description={t('student.settings.notifications.productService')}>
                  <Toggle checked={preferences.notifications.newBlogs} onChange={(v) => updateNotification('newBlogs', v)} disabled={prefsSaving} />
                </SettingsRow>
                <SettingsRow label={t('student.settings.notifications.systemUpdates')} description={t('student.settings.notifications.systemUpdatesDesc')}>
                  <Toggle checked={preferences.notifications.systemUpdates} onChange={(v) => updateNotification('systemUpdates', v)} disabled={prefsSaving} />
                </SettingsRow>
              </div>
            </div>
          )}

          {/* Learning Section */}
          {activeSection === 'learning' && (
            <div className="bg-bg-card border border-border/50 rounded-2xl p-5 md:p-8">
              <SectionHeader 
                title={t('student.settings.learningPrefs.title')}
                description={t('student.settings.learningPrefs.description')}
              />
              <div>
                <SettingsRow label={t('student.settings.learningPrefs.difficulty')}>
                  <SelectField id="settings-preferred-difficulty" ariaLabel={t('student.settings.learningPrefs.difficulty')} value={preferences.learning.preferredDifficulty} onChange={(v) => updateLearning('preferredDifficulty', v)}>
                    <option value="beginner">{t('student.settings.learningPrefs.beginner')}</option>
                    <option value="intermediate">{t('student.settings.learningPrefs.intermediate')}</option>
                    <option value="advanced">{t('student.settings.learningPrefs.advanced')}</option>
                  </SelectField>
                </SettingsRow>
                <SettingsRow label={t('student.settings.learningPrefs.weeklyGoal')}>
                  <input id="settings-weekly-goal" type="number" min={0} max={80} value={preferences.learning.weeklyGoalHours}
                    onChange={(e) => updateLearning('weeklyGoalHours', Number(e.target.value))}
                    className="w-24 bg-bg border border-border rounded-xl px-3 py-2.5 text-sm font-bold text-text-primary text-center focus:border-accent outline-none" />
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
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6 md:space-y-8">
              {/* Password */}
              <div className="bg-bg-card border border-border/50 rounded-2xl p-5 md:p-8">
                <SectionHeader 
                  title={t('student.settings.password.title')}
                />
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <PasswordField name="current_password" id="settings-current-password" label={t('student.settings.password.currentLabel')} placeholder={t('student.settings.password.currentPlaceholder')} shake={shakeCurrentPwd} onAnimationEnd={() => setShakeCurrentPwd(false)} />
                  <PasswordField name="new_password" id="settings-new-password" label={t('student.settings.password.newLabel')} placeholder={t('student.settings.password.newPlaceholder')} />
                  <PasswordField name="confirm_password" id="settings-confirm-password" label={t('student.settings.password.confirmLabel')} placeholder={t('student.settings.password.confirmPlaceholder')} />
                  <Button type="submit" loading={changingPwd}
                    className="w-full sm:w-auto !py-2.5 text-sm px-6">
                    {changingPwd ? t('common.updating') : <><Save className="w-4 h-4" /> {t('student.settings.password.update')}</>}
                  </Button>
                </form>
              </div>

              {/* Recovery Token */}
              <div className="bg-bg-card border border-border/50 rounded-2xl p-5 md:p-8">
                <SectionHeader 
                  title={t('student.settings.recovery.title')}
                />
                <div className="space-y-5">
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-none mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">{t('student.settings.recovery.description')}</p>
                  </div>
                  {liveToken ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent-dim/30 border border-accent/30 rounded-xl">
                        <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">{t('student.settings.recovery.copyNowWarning')}</p>
                        <div className="relative">
                          <input id="settings-recovery-token" type="text" readOnly value={liveToken} className={`${INPUT_CLS} pr-12 select-all cursor-text bg-bg`} onFocus={(e) => e.target.select()} />
                          <button type="button" onClick={copyToken} aria-label={t('aria.copyToken')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent active:scale-95 transition-colors">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button onClick={acknowledgeToken} loading={acking} className="w-full sm:w-auto !py-2.5 text-sm px-6">
                        {acking ? t('student.settings.recovery.acknowledging') : <><CheckCircle2 className="w-4 h-4" /> {t('student.settings.recovery.savedToken')}</>}
                      </Button>
                    </div>
                  ) : tokenAvailable ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-bg border border-border rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center shrink-0"><Key className="w-4 h-4 text-accent" /></div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-text-primary">{recoveryAcked ? t('student.settings.recovery.tokenSaved') : t('student.settings.recovery.tokenExists')}</div>
                          {recoveryAcked && <div className="flex items-center gap-1 text-[10px] text-accent font-bold mt-0.5"><CheckCircle2 className="w-3 h-3" /> {t('student.settings.recovery.acknowledged')}</div>}
                        </div>
                      </div>
                      {!confirmRegenerate ? (
                        <button onClick={() => setConfirmRegenerate(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-bold text-text-muted hover:text-accent active:scale-[0.98] transition-colors">
                          <RefreshCw className="w-4 h-4" /> {t('student.settings.recovery.generate')}
                        </button>
                      ) : (
                        <div className="p-4 border border-warning/30 rounded-xl bg-warning/5 space-y-3">
                          <p className="text-xs text-warning font-bold">{t('student.settings.recovery.invalidateWarning')}</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={() => setConfirmRegenerate(false)} className="flex-1 px-3 py-2 border border-border rounded-xl text-xs font-bold text-text-muted active:scale-[0.98] transition-colors">{t('button.cancel')}</button>
                            <button onClick={() => void regenerateToken()} disabled={regenerating} className="flex-1 px-3 py-2 border border-warning/40 rounded-xl text-xs font-bold text-warning hover:bg-warning/10 active:scale-[0.98] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                              {regenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t('student.settings.recovery.generating')}</> : <><RefreshCw className="w-3.5 h-3.5" /> {t('student.settings.recovery.regenerate')}</>}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-text-muted">{t('student.settings.recovery.noTokenYet')}</p>
                      <Button onClick={() => void regenerateToken()} loading={regenerating} className="w-full sm:w-auto !py-2.5 text-sm px-6">
                        {regenerating ? t('student.settings.recovery.generating') : <><Key className="w-4 h-4" /> {t('student.settings.recovery.generate')}</>}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sessions */}
              <div className="bg-bg-card border border-border/50 rounded-2xl p-5 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary mb-2">{t('student.settings.sessions.title')}</h2>
                    <p className="text-sm text-text-muted">{t('student.settings.sessions.description')}</p>
                  </div>
                  {sessions.length > 1 && (
                    <button onClick={handleRevokeAll} className="shrink-0 text-[10px] font-black uppercase tracking-widest text-danger hover:text-danger active:opacity-70 transition-colors">
                      {t('student.settings.sessions.revokeAll')}
                    </button>
                  )}
                </div>
                {loadingSessions ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-accent" /></div>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-text-muted text-center py-4">{t('student.settings.sessions.empty')}</p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between gap-3 p-3 bg-bg border border-border/50 rounded-xl">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-text-primary truncate">{session.userAgent || t('student.settings.sessions.unknown')}</p>
                            {session.isCurrent && <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-lg">{t('student.settings.sessions.current')}</span>}
                          </div>
                          <p className="text-[10px] text-text-muted font-mono mt-0.5">{session.ipAddress} · {new Date(session.createdAt).toLocaleDateString()}</p>
                        </div>
                        {!session.isCurrent && (
                          <button onClick={() => handleRevokeSession(session.id)} className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-danger active:opacity-70 transition-colors shrink-0">
                            {t('student.settings.sessions.revoke')}
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
            <div className="bg-bg-card border border-danger/20 rounded-2xl p-5 md:p-8">
              <SectionHeader 
                title={t('student.settings.dangerZone.title')}
                description={t('student.settings.dangerZone.description')}
              />
              <div className="bg-danger/5 border border-danger/20 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger flex-none mt-0.5" />
                  <div>
                    <h3 className="text-base font-black text-danger mb-2">{t('student.settings.dangerZone.deleteAccount')}</h3>
                    <p className="text-sm text-text-muted mb-4">{t('student.settings.dangerZone.deleteDescription')}</p>
                    {!confirmDelete ? (
                      <button onClick={() => setConfirmDelete(true)} className="btn-danger !py-2.5 text-sm flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> {t('student.settings.dangerZone.deleteAccount')}
                      </button>
                    ) : (
                      <div className="p-4 border border-danger/30 rounded-xl bg-danger/5 space-y-3">
                        <p className="text-xs text-danger font-bold">{t('student.settings.dangerZone.deleteConfirmDesc')}</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button onClick={() => setConfirmDelete(false)} className="flex-1 px-3 py-2 border border-border rounded-xl text-xs font-bold text-text-muted active:scale-[0.98] transition-colors">{t('button.cancel')}</button>
                          <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 px-3 py-2 btn-danger !text-xs disabled:opacity-50 flex items-center justify-center gap-1.5">
                            {deleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t('student.settings.dangerZone.deleting')}</> : <><Trash2 className="w-3.5 h-3.5" /> {t('student.settings.dangerZone.confirmDelete')}</>}
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
