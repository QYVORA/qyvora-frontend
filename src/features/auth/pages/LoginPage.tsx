import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, User, ArrowLeft, Send, Shield, Terminal, Zap, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Logo from '../../../shared/components/brand/Logo';
import HeroCanvas from '../../marketing/components/HeroCanvas';
import api from '../../../core/services/api';

type Mode = 'login' | 'register' | 'forgot' | 'reset-confirm' | 'verify-email' | 'change-password';

const HERO_STATS = [
  { label: 'Trained Operators', value: '847+' },
  { label: 'Live Labs', value: '42' },
  { label: 'CP Distributed', value: '85K+' },
];

const INPUT_BASE = 'w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-11 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm';

const PasswordInput = ({
  name,
  placeholder = '••••••••',
  required = true,
}: {
  name: string;
  placeholder?: string;
  required?: boolean;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        required={required}
        placeholder={placeholder}
        className={INPUT_BASE}
      />
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

const AuthHero: React.FC = () => (
  <div className="hidden lg:flex relative flex-col justify-between h-full bg-bg overflow-hidden p-12">
    <div className="absolute inset-0 bg-bg z-0" />
    <div className="absolute inset-0 dot-grid opacity-20 z-0" />
    <HeroCanvas />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg/60 z-10" />
    <div className="relative z-20">
      <Link to="/"><Logo size="lg" /></Link>
    </div>
    <div className="relative z-20 flex flex-col gap-8">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">
          // AFRICA'S OFFENSIVE SECURITY PLATFORM
        </div>
        <h2 className="text-4xl font-black text-text-primary leading-tight mb-4">
          Train Like a Hacker.<br />
          <span className="text-accent">Become</span> a Hacker.
        </h2>
        <p className="text-text-muted text-sm max-w-sm leading-relaxed">
          Real labs. Real techniques. Join the sharpest security community on the continent.
        </p>
      </div>
      <div className="flex gap-8">
        {HERO_STATS.map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-black text-accent font-mono">{s.value}</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {[
          { icon: Shield, text: 'Hands-on penetration testing labs' },
          { icon: Terminal, text: 'Real CVE exploitation challenges' },
          { icon: Zap, text: 'Earn CP and unlock exclusive tools' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
              <Icon className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-xs text-text-secondary">{text}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="relative z-20 font-mono text-[9px] text-accent/50 tracking-tighter">
      [ SECURE_CHANNEL_ESTABLISHED ] // TLS 1.3 // AES-256-GCM
    </div>
  </div>
);

const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token') || '';
  const urlEmail = params.get('email') || '';

  const initialMode: Mode =
    location.pathname === '/register' ? 'register' :
    location.pathname === '/forgot-password' ? 'forgot' :
    location.pathname === '/verify-email' ? 'verify-email' :
    location.pathname === '/reset-password' ? 'reset-confirm' :
    location.pathname === '/change-password' ? 'change-password' : 'login';

  const [mode, setMode] = useState<Mode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState(urlEmail);
  const [verifyEmail, setVerifyEmail] = useState(urlEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');

      if (mode === 'forgot') {
        await api.post('/auth/password-reset/request', { email });
        setResetEmail(email);
        addToast('If that email exists, a reset token has been stored. Use it below.', 'success');
        setMode('reset-confirm');

      } else if (mode === 'reset-confirm') {
        const token = String(formData.get('token') || urlToken);
        const newPassword = String(formData.get('new_password') || '');
        const confirmPassword = String(formData.get('confirm_password') || '');
        if (newPassword !== confirmPassword) {
          addToast('Passwords do not match.', 'error');
          return;
        }
        await api.post('/auth/password-reset/confirm', {
          token,
          email: resetEmail || email,
          password: newPassword,
        });
        addToast('Password reset successful. Log in with your new credentials.', 'success');
        setMode('login');

      } else if (mode === 'verify-email') {
        const token = String(formData.get('token') || urlToken);
        await api.post('/auth/verify-email/confirm', { token });
        addToast('Email verified. You can now log in.', 'success');
        setMode('login');

      } else if (mode === 'change-password') {
        const passwordChangeToken = String(formData.get('change_token') || urlToken);
        const newPassword = String(formData.get('new_password') || '');
        const confirmPassword = String(formData.get('confirm_password') || '');
        if (newPassword !== confirmPassword) {
          addToast('Passwords do not match.', 'error');
          return;
        }
        const res = await api.post('/auth/change-password', { passwordChangeToken, newPassword });
        if (res.data?.token) {
          const { setAccessToken } = await import('../../../core/services/api');
          setAccessToken(res.data.token);
        }
        addToast('Password changed. Session established.', 'success');
        navigate('/dashboard');

      } else if (mode === 'register') {
        const handle = String(formData.get('handle') || '').trim();
        const fullName = String(formData.get('full_name') || '').trim();
        const confirmPassword = String(formData.get('confirm_password') || '');
        if (password !== confirmPassword) {
          addToast('Passwords do not match.', 'error');
          return;
        }
        // Check email availability first
        const checkRes = await api.post('/auth/check-email', { email }).catch(() => null);
        if (checkRes?.data?.exists) {
          addToast('An account with that email already exists.', 'error');
          return;
        }
        await api.post('/auth/register', {
          role: 'student',
          inviteCode: '',
          profile: { fullName, organization: '', handle },
          credentials: { email, password },
        });
        await login({ email, password });
        addToast('Session established. Welcome, Operator.', 'success');
        navigate('/dashboard');

      } else {
        await login({ email, password });
        addToast('Session established. Welcome back, Operator.', 'success');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Authentication failed. Check credentials.';
      if (err?.response?.data?.verificationRequired) {
        setVerifyEmail(String((e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('[name="email"]')?.value || ''));
        addToast('Email not verified. Enter your verification token below.', 'error');
        setMode('verify-email');
        return;
      }
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg grid grid-cols-1 lg:grid-cols-2">
      <AuthHero />

      <div className="flex flex-col items-center justify-center p-5 md:p-12 relative">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden mb-6 self-start">
          <Link to="/"><Logo size="md" /></Link>
        </div>

        {/* Mobile mini stats strip */}
        <div className="lg:hidden w-full flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-1">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="flex-none px-4 py-2.5 bg-bg-card border border-border rounded-lg text-center min-w-[100px]">
              <div className="text-base font-black text-accent font-mono">{s.value}</div>
              <div className="text-[9px] uppercase tracking-widest text-text-muted whitespace-nowrap">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {/* ── LOGIN ── */}
            {mode === 'login' && (
              <motion.div key="login"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-1">Operator Login</h1>
                  <p className="text-text-muted text-sm">Enter credentials to establish secure session.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <input type="email" name="email" required placeholder="operator@hsociety.africa"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Password</label>
                      <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-bold text-accent hover:underline">Forgot?</button>
                    </div>
                    <PasswordInput name="password" />
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isLoading ? 'Authenticating...' : 'Establish Session'} <LogIn className="w-4 h-4" />
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-text-muted">
                  No operator UID?{' '}
                  <button onClick={() => setMode('register')} className="text-accent font-bold hover:underline">Request Access</button>
                </p>
              </motion.div>
            )}

            {/* ── REGISTER ── */}
            {mode === 'register' && (
              <motion.div key="register"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-1">Request Access</h1>
                  <p className="text-text-muted text-sm">Create your operator identity.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Operator Handle</label>
                    <div className="relative">
                      <input type="text" name="handle" required placeholder="hsociety_operator"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <input type="text" name="full_name" required placeholder="Operator Name"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <input type="email" name="email" required placeholder="operator@hsociety.africa"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Password</label>
                    <PasswordInput name="password" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Confirm Password</label>
                    <PasswordInput name="confirm_password" />
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isLoading ? 'Initialising...' : 'Create Operator Account'} <LogIn className="w-4 h-4" />
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-text-muted">
                  Already have access?{' '}
                  <button onClick={() => setMode('login')} className="text-accent font-bold hover:underline">Log In</button>
                </p>
              </motion.div>
            )}

            {/* ── FORGOT ── */}
            {mode === 'forgot' && (
              <motion.div key="forgot"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <button onClick={() => setMode('login')} className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>

                <div className="mb-8">
                  <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-1">Reset Credentials</h1>
                  <p className="text-text-muted text-sm">Enter your email to initiate a password reset.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Operator Email</label>
                    <div className="relative">
                      <input type="email" name="email" required placeholder="operator@hsociety.africa"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isLoading ? 'Processing...' : 'Request Reset'} <Send className="w-4 h-4" />
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-text-muted">
                  Already have a reset token?{' '}
                  <button onClick={() => setMode('reset-confirm')} className="text-accent font-bold hover:underline">Enter token</button>
                </p>
              </motion.div>
            )}

            {/* ── RESET CONFIRM ── */}
            {mode === 'reset-confirm' && (
              <motion.div key="reset-confirm"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <button onClick={() => setMode('forgot')} className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-1">Set New Password</h1>
                  <p className="text-text-muted text-sm">Enter your reset token and choose a new password.</p>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</label>
                    <div className="relative">
                      <input type="email" name="email" required defaultValue={resetEmail} placeholder="operator@hsociety.africa"
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Reset Token</label>
                    <div className="relative">
                      <input type="text" name="token" required defaultValue={urlToken} placeholder="Paste reset token here"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">New Password</label>
                    <PasswordInput name="new_password" placeholder="Min 8 characters" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Confirm Password</label>
                    <PasswordInput name="confirm_password" />
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isLoading ? 'Resetting...' : 'Reset Password'} <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── VERIFY EMAIL ── */}
            {mode === 'verify-email' && (
              <motion.div key="verify-email"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <button onClick={() => setMode('login')} className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-1">Verify Email</h1>
                  <p className="text-text-muted text-sm">
                    {verifyEmail ? `Enter the verification token sent to ${verifyEmail}.` : 'Enter your email verification token.'}
                  </p>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Verification Token</label>
                    <div className="relative">
                      <input type="text" name="token" required defaultValue={urlToken} placeholder="Paste verification token"
                        className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isLoading ? 'Verifying...' : 'Verify Email'} <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
                {verifyEmail && (
                  <p className="mt-6 text-center text-xs text-text-muted">
                    Didn't get a token?{' '}
                    <button
                      onClick={async () => {
                        try {
                          await api.post('/auth/verify-email/request', { email: verifyEmail });
                          addToast('Verification token re-sent if account exists.', 'success');
                        } catch {
                          addToast('Could not resend. Try again later.', 'error');
                        }
                      }}
                      className="text-accent font-bold hover:underline"
                    >
                      Resend token
                    </button>
                  </p>
                )}
              </motion.div>
            )}

            {/* ── CHANGE PASSWORD (mustChangePassword flow) ── */}
            {mode === 'change-password' && (
              <motion.div key="change-password"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Password Change Required</h1>
                  </div>
                  <p className="text-text-muted text-sm">Your account requires a password change before continuing.</p>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {!urlToken && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Change Token</label>
                      <div className="relative">
                        <input type="text" name="change_token" required placeholder="Paste token from login response"
                          className="w-full bg-bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-sm" />
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">New Password</label>
                    <PasswordInput name="new_password" placeholder="Min 8 characters" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Confirm Password</label>
                    <PasswordInput name="confirm_password" />
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-50">
                    {isLoading ? 'Updating...' : 'Set New Password'} <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
