import React from 'react';
import { cn } from '@/shared/utils/cn';
import { fluid } from './certificateFluid';

export interface CertificateCredentialRibbonProps {
  /** Badge artwork rendered inside the circular credential seal. */
  logo: string;
  /** Accessible description of the badge artwork. */
  alt?: string;
  /** Short credential text set vertically along the strip (optional). */
  label?: string;
  /**
   * Accent that tints the strip, seal and label. Defaults to the QYVORA accent
   * token so the ribbon always resolves through the design system.
   */
  accent?: string;
  /** Extra classes on the positioning wrapper. */
  className?: string;
}

/**
 * CertificateCredentialRibbon — a single, broad, straight vertical sash with a
 * circular credential seal integrated at its lower end.
 *
 * Deliberately NOT a traditional award ribbon: no double strips, no forked or
 * folded tails, no waves, no bow. It is one rectangular strip that sits inside
 * the certificate (inset from every edge) and ends in a circular QOSE seal, so
 * the two read as one unified credential marker.
 *
 * Positioning is absolute, relative to the certificate surface. The surface
 * reserves a left gutter (`paddingLeft`) equal to the ribbon's footprint, so
 * the sash never overlaps recipient, programme or verification information —
 * and because it is anchored to the certificate edges rather than to its text,
 * it does not shift when recipient names change length.
 */
const CertificateCredentialRibbon: React.FC<CertificateCredentialRibbonProps> = ({
  logo,
  alt = '',
  label,
  accent = 'var(--color-accent)',
  className,
}) => {
  // Inset from the certificate edge / width of the strip / seal diameter.
  const inset = fluid(14, 2.8);
  const width = fluid(20, 3.8);
  const insetY = fluid(26, 5.2);
  const sealSize = fluid(48, 6.2);

  const tint = (percent: number) => `color-mix(in srgb, ${accent} ${percent}%, transparent)`;

  return (
    <div
      className={cn('pointer-events-none absolute z-[1]', className)}
      style={{ left: inset, top: insetY, bottom: insetY, width }}
      aria-hidden="true"
    >
      {/* The sash — one broad, perfectly straight vertical strip. */}
      <span
        data-testid="certificate-sash"
        className="absolute inset-0 rounded-[3px]"
        style={{
          border: `1px solid ${tint(50)}`,
          background:
            `repeating-linear-gradient(45deg, ${tint(16)} 0 6px, ${tint(4)} 6px 13px), ` +
            'linear-gradient(to bottom, #141414, #0a0a0a)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      />

      {label && (
        <span
          className="absolute left-1/2 top-[7%] font-black uppercase"
          style={{
            writingMode: 'vertical-rl',
            transform: 'translateX(-50%) rotate(180deg)',
            color: accent,
            fontSize: fluid(7, 1.05),
            letterSpacing: '0.34em',
          }}
        >
          {label}
        </span>
      )}

      {/* Circular credential seal, half-overlapping the foot of the sash. */}
      <span
        data-testid="certificate-seal"
        className="absolute left-1/2 flex items-center justify-center rounded-full"
        style={{
          bottom: 0,
          width: sealSize,
          height: sealSize,
          transform: 'translate(-50%, 50%)',
        }}
      >
        <span
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: tint(60), background: '#ffffff' }}
        />
        <span
          className="absolute inset-[12%] rounded-full border-2"
          style={{ borderColor: tint(70) }}
        />
        <span
          className="absolute inset-[24%] rounded-full"
          style={{
            background: `repeating-linear-gradient(45deg, ${tint(14)} 0 4px, transparent 4px 8px)`,
          }}
        />
        <img src={logo} alt={alt} className="relative w-[56%] object-contain" />
      </span>
    </div>
  );
};

CertificateCredentialRibbon.displayName = 'CertificateCredentialRibbon';

export default CertificateCredentialRibbon;
