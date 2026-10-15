import { useState } from 'react';
import { FileImage, FileText, ImageDown } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import { exportCertificate, type CertificateFormat } from './certificateExport';
import type { CertificateOrientation, CertificateProgram } from './CertificateRenderer';

export interface CertificateExportActionsProps {
  /** Returns the certificate's native (unscaled) DOM node, or null if not mounted. */
  getNode: () => HTMLElement | null;
  program: CertificateProgram;
  orientation: CertificateOrientation;
  credentialId?: string;
  /** Called with a human-readable message when an export fails. */
  onError?: (message: string) => void;
  /** Called when an export starts and finishes (for page-level busy guards). */
  onBusyChange?: (busy: boolean) => void;
  className?: string;
}

const FORMATS: { format: CertificateFormat; label: string; icon: typeof FileText }[] = [
  { format: 'pdf', label: 'PDF', icon: FileText },
  { format: 'png', label: 'PNG', icon: ImageDown },
  { format: 'jpeg', label: 'JPEG', icon: FileImage },
];

/**
 * CertificateExportActions — the compact, single control area for downloading a
 * certificate. PDF is the print/submission format; PNG is the high-resolution
 * lossless image; JPEG is the sharing-friendly alternative. All three render
 * from the same certificate node, so the layout and branding never diverge.
 */
const CertificateExportActions: React.FC<CertificateExportActionsProps> = ({
  getNode,
  program,
  orientation,
  credentialId,
  onError,
  onBusyChange,
  className = '',
}) => {
  const [busy, setBusy] = useState<CertificateFormat | null>(null);

  const handleExport = async (format: CertificateFormat) => {
    const node = getNode();
    if (!node || busy) return;

    setBusy(format);
    onBusyChange?.(true);
    try {
      await exportCertificate(node, { format, orientation, program, credentialId });
    } catch {
      onError?.('Could not generate the download. Please try again.');
    } finally {
      setBusy(null);
      onBusyChange?.(false);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label="Download certificate">
      {FORMATS.map(({ format, label, icon: Icon }, index) => (
        <Button
          key={format}
          variant={index === 0 ? 'primary' : 'secondary'}
          size="sm"
          icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}
          loading={busy === format}
          disabled={busy !== null}
          ariaLabel={`Download certificate as ${label}`}
          onClick={() => handleExport(format)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default CertificateExportActions;
