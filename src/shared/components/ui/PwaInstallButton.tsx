import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { useInstallPrompt } from '@/core/hooks/usePWA';
import Button from './Button';
import { cn } from '@/shared/utils/cn';

interface PwaInstallButtonProps {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Custom label */
  label?: string;
  /** Show as icon-only button */
  iconOnly?: boolean;
}

/**
 * PwaInstallButton — prompts the user to install the PWA.
 *
 * Shows different states:
 * - Hidden: When PWA is not installable (already installed or not supported)
 * - Prompt: When install prompt is available
 * - Success: Briefly after successful install
 * - Error: If install was dismissed/failed
 *
 * On iOS Safari, shows instructions since browser doesn't support prompt API.
 */
const PwaInstallButton: React.FC<PwaInstallButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className,
  label = 'Install App',
  iconOnly = false,
}) => {
  const { canPrompt, isStandalone, isIos, install } = useInstallPrompt();
  const [status, setStatus] = useState<'idle' | 'installing' | 'success' | 'dismissed'>('idle');
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Don't show if already installed (standalone mode)
  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    // iOS Safari - show instructions
    if (isIos) {
      setShowIOSInstructions(true);
      return;
    }

    if (!canPrompt) {
      return;
    }

    setStatus('installing');
    const outcome = await install();

    if (outcome === 'accepted') {
      setStatus('success');
      // Hide button after short delay
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } else if (outcome === 'dismissed') {
      setStatus('dismissed');
      // Reset after a moment
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  // Show success state briefly
  if (status === 'success') {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn('animate-success-pop', className)}
        disabled
      >
        <Check className="h-5 w-5" aria-hidden="true" />
        {!iconOnly && <span>Installed!</span>}
      </Button>
    );
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Close"
          >
            ×
          </button>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-accent" aria-hidden="true" />
              <h3 className="text-lg font-black text-text-primary">Install QYVORA</h3>
            </div>
            
            <p className="text-sm text-text-secondary leading-relaxed">
              To install QYVORA on your iPhone or iPad:
            </p>
            
            <ol className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">1</span>
                <span>Tap the <strong className="text-text-primary">Share</strong> button at the bottom of Safari</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">2</span>
                <span>Scroll and tap <strong className="text-text-primary">"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">3</span>
                <span>Tap <strong className="text-text-primary">"Add"</strong> to install</span>
              </li>
            </ol>
            
            <Button
              onClick={() => setShowIOSInstructions(false)}
              variant="primary"
              size="md"
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Don't show if no install prompt available (not on mobile or already dismissed)
  if (!canPrompt && !isIos) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      loading={status === 'installing'}
      className={cn(
        'transition-all duration-[var(--dur-base)]',
        status === 'dismissed' && 'opacity-50',
        className
      )}
      icon={<Download className="h-5 w-5" aria-hidden="true" />}
      aria-label={iconOnly ? label : undefined}
    >
      {!iconOnly && (
        <span>
          {status === 'dismissed' ? 'Maybe later' : label}
        </span>
      )}
    </Button>
  );
};

export default PwaInstallButton;
