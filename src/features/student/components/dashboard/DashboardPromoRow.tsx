import { useEffect, useState } from 'react';
import { QrCode, Smartphone, X } from 'lucide-react';
import { Button, Card } from '@/shared/components/ui';
import { BrandWhatsAppIcon } from '@/shared/components/icons';
import { useInstallPrompt } from '@/core/hooks/usePWA';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

const DISMISS_KEY = 'qyvora_dashboard_community_promo_dismissed';

/**
 * DashboardPromoRow — the two announcement cards above My Learning: the mobile
 * app promotion and the community invite. Copy is static; the install action
 * and community link come from the existing PWA service and site config.
 */
const DashboardPromoRow = () => {
  const { canPrompt, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismissCommunity = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  };

  const communityHref =
    SITE_CONFIG.social.find((entry) => entry.key === 'whatsapp')?.href ||
    'https://whatsapp.com/channel/0029Vb8Aw6L5EjxzLY6L2m1V';

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
      <Card
        as="section"
        tone="hero"
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:p-5"
      >
        <div className="min-w-0">
          <p className="type-meta inline-flex items-center gap-1.5 text-accent">
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            QYVORA app
          </p>
          <h2 className="mt-0.5 text-base font-bold text-text-primary sm:text-lg">
            The mobile app goes where you go
          </h2>
          <p className="mt-0.5 line-clamp-1 text-sm text-text-secondary">
            Keep your streak, labs and alerts in your pocket. Install QYVORA and pick up training between sessions.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {canPrompt && (
              <Button type="button" size="sm" onClick={() => void install()}>
                Install app
              </Button>
            )}
            <Button to="/dashboard/labs" variant="ghost" size="sm">
              Continue learning
            </Button>
          </div>
        </div>

        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-surface-raised text-text-primary"
          aria-hidden="true"
        >
          <QrCode className="h-8 w-8" strokeWidth={1.5} />
        </span>
      </Card>

      {!dismissed && (
        <Card
          as="section"
          tone="feature"
          className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:p-5"
        >
          <div className="min-w-0">
            <h2 className="text-base font-bold text-text-primary">Join our community</h2>
            <p className="mt-0.5 line-clamp-1 text-sm text-text-secondary">
              Get cohort updates, lab drops and help from other operators.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 self-start sm:self-auto">
            <Button
              href={communityHref}
              external
              variant="secondary"
              size="sm"
              icon={<BrandWhatsAppIcon className="h-4 w-4" />}
            >
              Join WhatsApp
            </Button>
            <button
              type="button"
              onClick={dismissCommunity}
              aria-label="Dismiss community promotion"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPromoRow;
