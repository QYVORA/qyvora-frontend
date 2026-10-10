import React, { useState } from 'react';
import { ExternalLink, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { BrandGithubIcon, BrandLinkedinIcon, BrandXIcon } from '@/shared/components/icons';
import Button from '@/shared/components/ui/Button';
import Toggle from '@/shared/components/ui/Toggle';
import { ConfirmDialog } from '@/shared/components/ui/Dialog';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { goToGithubLink } from '@/features/auth/oauth';

interface SocialAccountConnectionProps {
  githubConnected: boolean;
  githubUsername?: string;
  githubProfileUrl?: string;
  githubPublic: boolean;
  passwordSet: boolean;
  twitter?: string;
  linkedin?: string;
  website?: string;
  onChanged: () => void;
  className?: string;
}

const DISCONNECT_ERRORS: Record<string, string> = {
  no_alternative_login:
    'GitHub is your only sign-in method. Set a password before disconnecting GitHub.',
  not_connected: 'No GitHub account is connected.',
};

export const SocialAccountConnection: React.FC<SocialAccountConnectionProps> = ({
  githubConnected,
  githubUsername,
  githubProfileUrl,
  githubPublic,
  passwordSet,
  twitter,
  linkedin,
  website,
  onChanged,
  className = '',
}) => {
  const { addToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [confirmGithubDisconnect, setConfirmGithubDisconnect] = useState(false);

  const handleToggleGithubPublic = async (next: boolean) => {
    setBusy(true);
    try {
      await api.put('/profile', { githubPublic: next });
      addToast(
        next ? 'GitHub will appear on your public profile.' : 'GitHub hidden from your public profile.',
        'success'
      );
      onChanged();
    } catch {
      addToast('Could not update GitHub visibility.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnectGithub = async () => {
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
      aria-labelledby="social-connections-heading"
      className={`rounded-2xl border border-border bg-bg-card p-5 sm:p-6 md:p-8 ${className}`}
    >
      <div className="border-b border-border/60 pb-4">
        <h2
          id="social-connections-heading"
          className="font-mono text-sm font-black uppercase tracking-wider text-text-primary"
        >
          Connected Accounts & External Identity
        </h2>
        <p className="mt-1 font-mono text-xs text-text-muted">
          Manage linked accounts and control what external credentials are shown publicly.
        </p>
      </div>

      <div className="divide-y divide-border/40 pt-4">
        {/* ── 1. GitHub (OAuth integration) ─────────────────────────────────── */}
        <div className="py-4 first:pt-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-text-primary">
                <BrandGithubIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-black uppercase text-text-primary">GitHub</h3>
                  {githubConnected ? (
                    <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-accent">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                      Not Linked
                    </span>
                  )}
                </div>
                {githubConnected ? (
                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    Linked to{' '}
                    <a
                      href={githubProfileUrl || `https://github.com/${githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-accent hover:underline inline-flex items-center gap-1"
                    >
                      @{githubUsername}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-xs text-text-muted">
                    Connect GitHub to verify your developer identity and enable one-click sign-in.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {githubConnected ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => goToGithubLink('/dashboard/profile')}
                    disabled={busy}
                    className="!text-xs font-mono"
                  >
                    Reconnect
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmGithubDisconnect(true)}
                    disabled={busy || !passwordSet}
                    title={!passwordSet ? 'Set a password before disconnecting GitHub' : undefined}
                    className="!text-xs font-mono"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => goToGithubLink('/dashboard/profile')}
                  disabled={busy}
                  className="!text-xs font-mono"
                >
                  <BrandGithubIcon className="h-3.5 w-3.5 mr-1" />
                  Connect GitHub
                </Button>
              )}
            </div>
          </div>

          {githubConnected && (
            <div className="mt-4 rounded-xl border border-border/40 bg-surface/40 p-3">
              <Toggle
                label="Show GitHub on public profile"
                description="When disabled, your GitHub identity remains verified but private."
                checked={githubPublic}
                disabled={busy}
                onCheckedChange={handleToggleGithubPublic}
              />
              {!passwordSet && (
                <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-warning">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  GitHub is your sole sign-in method. Set an account password in Settings before disconnecting.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── 2. X / Twitter ─────────────────────────────────────────────────── */}
        <div className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-text-primary">
                <BrandXIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-black uppercase text-text-primary">X</h3>
                  {twitter ? (
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                      Configured
                    </span>
                  ) : (
                    <span className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                      Unset
                    </span>
                  )}
                </div>
                {twitter ? (
                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    Profile handle:{' '}
                    <span className="font-bold text-text-primary">{twitter}</span>
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-xs text-text-muted">
                    Add your X handle in profile settings to display it on your public profile.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. LinkedIn ────────────────────────────────────────────────────── */}
        <div className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-text-primary">
                <BrandLinkedinIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-black uppercase text-text-primary">LinkedIn</h3>
                  {linkedin ? (
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                      Configured
                    </span>
                  ) : (
                    <span className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                      Unset
                    </span>
                  )}
                </div>
                {linkedin ? (
                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    Profile:{' '}
                    <span className="font-bold text-text-primary truncate max-w-xs inline-block align-bottom">{linkedin}</span>
                  </p>
                ) : (
                  <p className="mt-1 font-mono text-xs text-text-muted">
                    Add your LinkedIn profile in profile settings to link your professional network.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmGithubDisconnect}
        onOpenChange={setConfirmGithubDisconnect}
        title="Disconnect GitHub?"
        description="This removes your verified GitHub link from QYVORA. Your achievements, CP balance, and course progression remain unaffected."
        confirmLabel="Disconnect"
        destructive
        onConfirm={handleDisconnectGithub}
      />
    </section>
  );
};

export default SocialAccountConnection;
