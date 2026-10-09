import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import { sanitizeReturnPath } from '../oauth';

/**
 * AuthCallbackPage — the landing point after the backend GitHub OAuth callback
 * sets the session cookies. The access token lives in memory only, so this page
 * hydrates it by calling `refreshMe()` (GET /auth/me, authenticated by the
 * httpOnly cookie) and then continues to the original destination.
 */
const AuthCallbackPage: React.FC = () => {
  const { refreshMe } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [failed, setFailed] = useState(false);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const redirect = sanitizeReturnPath(params.get('redirect'));

    (async () => {
      try {
        await refreshMe();
        navigate(redirect, { replace: true });
      } catch {
        setFailed(true);
        addToast('Could not complete GitHub sign-in. Please try again.', 'error');
      }
    })();
  }, [params, refreshMe, navigate, addToast]);

  return (
    <AuthFormLayout>
      <SEO title="Signing in" description="Completing GitHub sign-in." noindex />
      <div
        role="status"
        aria-live="polite"
        className="w-full rounded-xl border border-border-subtle bg-surface p-5 text-center sm:p-8"
      >
        {failed ? (
          <>
            <h1 className="type-h2 mb-2 font-black uppercase tracking-tight text-text-primary">
              Sign-in <span className="text-accent">failed</span>
            </h1>
            <p className="type-body-sm mb-6">
              We could not complete GitHub sign-in. Head back to the login page and try again.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="min-h-[48px] w-full rounded-xl border border-border-subtle px-4 text-sm font-bold text-text-primary transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-6 w-6 animate-spin text-accent" aria-hidden="true" />
            <h1 className="type-h2 mb-2 font-black uppercase tracking-tight text-text-primary">
              Completing <span className="text-accent">sign-in</span>
            </h1>
            <p className="type-body-sm">Hang tight while we finish setting up your session.</p>
          </>
        )}
      </div>
    </AuthFormLayout>
  );
};

export default AuthCallbackPage;
