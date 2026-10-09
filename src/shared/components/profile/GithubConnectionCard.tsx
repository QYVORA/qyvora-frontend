import React, { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { BrandGithubIcon } from '@/shared/components/icons';
import Button from '@/shared/components/ui/Button';
import Toggle from '@/shared/components/ui/Toggle';
import { ConfirmDialog } from '@/shared/components/ui/Dialog';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { goToGithubLink } from '@/features/auth/oauth';

interface GithubConnectionCardProps {
  connected: boolean;
  username: string;
  profileUrl: string;
  isPublic: boolean;
  passwordSet: boolean;
  /** Re-fetch the profile after a connection change. */
  onChanged: () => void;
}

const DISCONNECT_ERRORS: Record<string, string> = {
  no_alternative_login:
    'GitHub is your only sign-in method. Set a password before disconnecting GitHub.',
  not_connected: 'No GitHub account is connected.',
};

/**
 * GitHub account connection card for the private profile. Keeps login
 * ("Sign in with GitHub") and linking ("Connect GitHub") as separate
 * operations — this card only ever starts the linking flow.
 */
const GithubConnectionCard: React.FC<GithubConnectionCardProps> = ({
  connected,
  username,
  profileUrl,
  isPublic,
  passwordSet,
  onChanged,
}) => {
  const { addToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleTogglePublic = async (next: boolean) => {
    setBusy(true);
    try {
      await api.put('/profile', { githubPublic: next });
      addToast(next ? 'GitHub will show on your public profile.' : 'GitHub hidden from your public profile.', 'success');
      onChanged();
    } catch {
      addToast('Could not update GitHub visibility.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    setBusy(true);
    try {
      await api.post('/auth/github/disconnect', {});
      addToast('GitHub disconnected.', 'success');
      onChanged();
    } catch (err: any) {
      const code = err?.response?.data?.code;
      addToast(DISCONNECT_ERRORS[code] || 'Could not disconnect GitHub.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-label="GitHub account"
      className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-text-secondary">
          <BrandGithubIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black uppercase tracking-tight text-text-primary">
            GitHub
          </h2>
          {connected ? (
            <p className="mt-1 text-sm text-text-secondary">
              Connected as{' '}
              <a
                href={profileUrl || `https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-accent hover:text-text-primary"
              >
                @{username}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </p>
          ) : (
            <p className="mt-1 text-sm text-text-secondary">
              Connect your GitHub account to show it on your profile and sign in with GitHub.
            </p>
          )}
        </div>
        {busy && <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden="true" />}
      </div>

      {connected ? (
        <div className="mt-4 space-y-1 border-t border-border-subtle pt-4">
          <Toggle
            label="Show GitHub profile on my public QYVORA profile"
            description="When off, your GitHub is never shown publicly."
            checked={isPublic}
            disabled={busy}
            onCheckedChange={handleTogglePublic}
          />
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => goToGithubLink('/dashboard/profile')}
              disabled={busy}
            >
              <BrandGithubIcon className="h-4 w-4" aria-hidden="true" />
              Reconnect
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => setConfirmOpen(true)}
              disabled={busy || !passwordSet}
              title={!passwordSet ? 'Set a password before disconnecting GitHub' : undefined}
            >
              Disconnect
            </Button>
          </div>
          {!passwordSet && (
            <p className="pt-1 text-xs text-text-muted">
              Set a password before disconnecting — GitHub is your only sign-in method.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4 border-t border-border-subtle pt-4">
          <Button variant="primary" size="md" onClick={() => goToGithubLink('/dashboard/profile')}>
            <BrandGithubIcon className="h-4 w-4" aria-hidden="true" />
            Connect GitHub
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Disconnect GitHub?"
        description="This removes the GitHub connection from your account. Your QYVORA account and progress are not affected."
        confirmLabel="Disconnect"
        destructive
        onConfirm={handleDisconnect}
      />
    </section>
  );
};

export default GithubConnectionCard;
