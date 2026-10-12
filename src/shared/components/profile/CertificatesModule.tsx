import { motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Award, Check, ExternalLink } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import ModuleHeader from './ModuleHeader';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { credentialProgram } from '@/core/services/credentials';
import type { LearnerCredential } from '@/core/services/credentials';
import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';

export interface CertificatesModuleProps {
  /** The learner's own credentials. Empty when none have been issued. */
  credentials: LearnerCredential[];
  loading?: boolean;
  /** True when the credential service could not be reached. */
  error?: boolean;
  className?: string;
}

const formatDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const CredentialRow: React.FC<{ credential: LearnerCredential; index: number; reduced: boolean }> = ({
  credential,
  index,
  reduced,
}) => {
  const { copied, copy } = useCopyToClipboard();
  const program = credentialProgram(credential.programName);
  const revoked = credential.status !== 'ACTIVE';
  const shareUrl =
    credential.verifyUrl ||
    (typeof window !== 'undefined' ? `${window.location.origin}/verify/${credential.credentialId}` : '');

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : index * 0.05 }}
      className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-subtle bg-surface-raised/60 p-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={program === 'HPB' ? hpbLogo : qoseLogo}
          alt={program === 'HPB' ? 'Hacker Protocol Bootcamp' : 'QYVORA Offensive Security Engineer Bootcamp'}
          className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-widest text-text-primary">
            {credential.programName || 'QYVORA program'}
          </p>
          <p className="truncate text-xs text-text-muted">
            {formatDate(credential.completionDate)}
            {credential.result === 'PASS' ? ' · Completed' : ' · Not passed'}
          </p>
          {revoked && (
            <span className="mt-1 inline-block rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-danger">
              {credential.status}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          to={`/verify/${credential.credentialId}`}
          trailingIcon={<ExternalLink className="h-3.5 w-3.5" />}
        >
          Verify
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy(shareUrl)}
          ariaLabel="Copy verification link"
          icon={copied ? <Check className="h-3.5 w-3.5" /> : undefined}
        >
          {copied ? 'Copied' : 'Share'}
        </Button>
      </div>
    </motion.div>
  );
};

/**
 * CertificatesModule — the learner's own issued credentials, on their profile.
 *
 * Each row links to the public `/verify/<credentialId>` page and can be shared
 * by copying its verification URL. The module never invents a credential: while
 * loading it shows a placeholder, and on failure it says so rather than implying
 * the learner has none.
 */
const CertificatesModule: React.FC<CertificatesModuleProps> = ({
  credentials,
  loading = false,
  error = false,
  className = '',
}) => {
  const reduced = useReducedMotion();

  return (
    <div className={`rounded-2xl border border-border-subtle bg-surface p-5 md:p-6 ${className}`}>
      <ModuleHeader
        icon={<Award className="h-4 w-4" />}
        title="Certificates"
        trailing={
          credentials.length > 0 ? (
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
              {credentials.length}
            </span>
          ) : undefined
        }
      />

      {loading ? (
        <div className="space-y-3" role="status" aria-live="polite">
          <span className="sr-only">Loading certificates…</span>
          {[0, 1].map((i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-xl border border-border-subtle bg-surface-raised/60" />
          ))}
        </div>
      ) : error ? (
        <p className="py-4 text-center text-sm text-text-muted">
          Could not load your certificates right now. Please try again later.
        </p>
      ) : credentials.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-muted">
          No certificates yet. Complete a bootcamp to earn a verifiable credential.
        </p>
      ) : (
        <div className="space-y-3">
          {credentials.map((credential, index) => (
            <CredentialRow
              key={credential.credentialId}
              credential={credential}
              index={index}
              reduced={reduced}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesModule;
