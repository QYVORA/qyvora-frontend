import { Award } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

export interface CertificateClaimCardProps {
  /** Link mode — sends the learner to the certificates page to claim (dashboard banner). */
  to?: string;
  /** Inline mode — claims immediately on this page (certificates page). */
  onClaim?: () => void;
  /** Disables the inline claim button while the request is in flight. */
  loading?: boolean;
  className?: string;
}

/**
 * CertificateClaimCard — the "you completed a bootcamp, claim your certificate"
 * call to action. Shared by the dashboard banner (link mode) and the
 * certificates page (inline claim mode) so the message and layout stay in sync.
 */
const CertificateClaimCard: React.FC<CertificateClaimCardProps> = ({
  to,
  onClaim,
  loading = false,
  className = '',
}) => (
  <Card
    selected
    className={`flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6 ${className}`}
  >
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
        <Award className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="type-label uppercase tracking-[0.12em] text-accent">Certificate ready</p>
        <h2 className="mt-1 text-lg font-black uppercase tracking-tight text-text-primary">
          Claim your HPB certificate
        </h2>
        <p className="mt-1 max-w-xl text-sm text-text-secondary">
          You completed the Hacker Protocol Bootcamp. Issue your certificate of completion to your
          account to view, verify and download it.
        </p>
      </div>
    </div>
    {onClaim ? (
      <Button
        className="shrink-0"
        onClick={onClaim}
        loading={loading}
        icon={<Award className="h-4 w-4" aria-hidden="true" />}
      >
        Claim certificate
      </Button>
    ) : to ? (
      <Button className="shrink-0" to={to} icon={<Award className="h-4 w-4" aria-hidden="true" />}>
        Claim certificate
      </Button>
    ) : null}
  </Card>
);

export default CertificateClaimCard;
