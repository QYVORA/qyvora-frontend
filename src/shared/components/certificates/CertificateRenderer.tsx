import React from 'react';
import { Logo, QyvoraMark } from '@/shared/components/brand';
import DottedMapOverlay from '@/shared/components/ui/DottedMapOverlay';
import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';

export interface CertificateData {
  recipientName: string;
  programName: string;
  cohortIdentifier: string;
  completionDate: string;
  credentialId: string;
  verificationUrl?: string;
  issuerName?: string;
}

export interface CertificateTemplateConfig {
  name?: string;
  program?: 'HPB' | 'QOSE';
  orientation?: 'portrait' | 'landscape';
  showQr?: boolean;
  showSeal?: boolean;
  accentColor?: string;
}

export interface CertificateRendererProps {
  data: CertificateData;
  config?: CertificateTemplateConfig;
  className?: string;
  /** Optional element id — only set on the certificate being exported to PDF. */
  id?: string;
}

/**
 * Fluid sizing helper.
 *
 * Every dimension on the certificate is expressed as `max(<floor>px, <n>cqw)`
 * — the value scales with the certificate's own width (container query unit)
 * so the layout keeps identical proportions at admin-preview size, on mobile
 * and in print, with a px floor so small previews stay legible. Because the
 * certificate box and all of its text scale from the same unit, long recipient
 * names can never spill out of the certificate container.
 */
const fluid = (minPx: number, cqw: number) => `max(${minPx}px, ${cqw}cqw)`;

/**
 * Recipient names are the hero element. Size steps down as the name gets
 * longer so every name fits inside the certificate on one or two lines.
 */
const nameFontSize = (name: string) => {
  const length = name.trim().length;
  if (length <= 14) return fluid(24, 5.4);
  if (length <= 26) return fluid(21, 4.4);
  if (length <= 40) return fluid(18, 3.4);
  return fluid(15, 2.8);
};

/**
 * Issuer seal — a classic embossed-stamp treatment placed at the bottom-right
 * corner of every certificate: double ring, diagonal micro-stripes (the
 * premium ribbon motif), the QYVORA mark and the programme label. Decorative,
 * so it is hidden from assistive tech; the programme is stated in the body.
 */
const IssuerSeal: React.FC<{ program: 'HPB' | 'QOSE' }> = ({ program }) => (
  <div
    className="relative flex shrink-0 flex-col items-center justify-center gap-[2px] rounded-full border-2 border-accent/55 bg-white/60"
    style={{ width: fluid(58, 8.4), height: fluid(58, 8.4) }}
    aria-hidden="true"
  >
    <span className="absolute inset-[7%] rounded-full border border-accent/30" />
    <span
      className="absolute inset-[13%] rounded-full"
      style={{
        background:
          'repeating-linear-gradient(45deg, rgba(6,182,111,0.10) 0 4px, transparent 4px 8px)',
      }}
    />
    <QyvoraMark className="relative block h-auto" style={{ width: '46%' }} />
    <span
      className="relative font-black uppercase tracking-[0.16em] text-accent"
      style={{ fontSize: fluid(6, 0.85) }}
    >
      {program}
    </span>
  </div>
);

/**
 * QOSE award medallion — the certificate "seal on the ribbon". The vertical
 * side ribbon flares into a circular rosette at its foot: a spiked dashed
 * outer ring, a solid inner ring, and the main course badge seated inside the
 * circle. Decorative; the programme is already stated in the body copy.
 */
const AwardMedallion: React.FC = () => (
  <div
    className="pointer-events-none absolute left-0 flex items-center justify-center"
    style={{
      bottom: fluid(10, 3),
      width: fluid(54, 7.5),
      height: fluid(54, 7.5),
    }}
    aria-hidden="true"
  >
    {/* spiked / dashed seal edge */}
    <span
      className="absolute inset-0 rounded-full border-2 border-dashed"
      style={{ borderColor: 'rgba(6,182,111,0.55)' }}
    />
    {/* solid ring */}
    <span
      className="absolute inset-[11%] rounded-full border-2"
      style={{
        borderColor: 'rgba(6,182,111,0.7)',
        background: 'rgba(255,255,255,0.8)',
      }}
    />
    {/* main course badge */}
    <img src={qoseLogo} alt="" className="relative w-[56%] object-contain" />
  </div>
);

const MetadataBlock: React.FC<{ label: string; value: string; breakAll?: boolean }> = ({
  label,
  value,
  breakAll,
}) => (
  <div className="flex min-w-0 flex-col gap-1">
    <span
      className="font-black uppercase tracking-widest text-text-muted"
      style={{ fontSize: fluid(7, 1.05) }}
    >
      {label}
    </span>
    <span
      className={`font-mono text-text-primary ${breakAll ? 'break-all' : 'break-words'}`}
      style={{ fontSize: fluid(10, 1.5) }}
    >
      {value}
    </span>
  </div>
);

/**
 * Programme logo — rendered bare, directly on the certificate surface.
 * The bootcamp badge/logo is intentionally NOT wrapped in a card, border or
 * tinted panel.
 */
const ProgrammeLogo: React.FC<{ program?: 'HPB' | 'QOSE' }> = ({ program = 'QOSE' }) => (
  <img
    src={program === 'HPB' ? hpbLogo : qoseLogo}
    alt={program === 'HPB' ? 'Hacker Protocol Bootcamp' : 'QYVORA Offensive Security Engineer Bootcamp'}
    className="w-auto max-w-[38%] shrink-0 object-contain"
    style={{ height: fluid(34, 6.5) }}
  />
);

const CertificateRenderer: React.FC<CertificateRendererProps> = ({
  data,
  config = {},
  className = '',
  id,
}) => {
  const {
    recipientName,
    programName,
    cohortIdentifier,
    completionDate,
    credentialId,
    verificationUrl = `/verify/${credentialId}`,
  } = data;

  const program = config.program || 'QOSE';
  const certificateTitle = config.name || 'Certificate of Completion';
  const orientation = config.orientation || 'landscape';
  // QOSE is the paid bootcamp — it carries the premium treatment: accent edge,
  // tinted graphite surface, striped side ribbon, programme watermark and
  // inner frame. HPB stays the clean standard edition. Both share the dotted
  // map backdrop and the issuer seal.
  const premium = program === 'QOSE';

  const pad = fluid(16, 4.2);
  const ribbonWidth = fluid(14, 3.4);

  const formattedDate = (() => {
    const parsed = new Date(completionDate);
    if (Number.isNaN(parsed.getTime())) return completionDate;
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  return (
    <div
      className={`relative mx-auto w-full ${className}`}
      id={id}
      style={{ containerType: 'inline-size' }}
    >
      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl border-2 shadow-2xl ${
          premium ? 'border-accent/40' : 'border-border/30'
        }`}
        style={{
          background: premium
            ? 'linear-gradient(to bottom right, #fbfbfb, #eef4f1 55%, #e3ebe7)'
            : 'linear-gradient(to bottom right, #f5f5f5, #e8e8e8)',
          padding: pad,
          // The QOSE side ribbon sits outside the normal padding so the body
          // copy stays aligned between the two templates.
          paddingLeft: premium ? `calc(${pad} + ${ribbonWidth})` : pad,
          // Industry-standard certificate trim as a *minimum* height: US Letter
          // landscape (11 × 8.5 in → 77.27cqw) or portrait (8.5 × 11 in →
          // 129.41cqw). Content keeps the exact ratio at every normal size, but
          // can never be clipped if a name runs long on a small preview — the
          // surface simply grows.
          minHeight:
            orientation === 'portrait' ? '129.41cqw' : '77.27cqw',
        }}
      >
        {/* Dotted-map backdrop — both templates */}
        <DottedMapOverlay className="rounded-2xl" opacity={0.08} />

        {premium && (
          <>
            {/* Diagonal-striped side ribbon — the premium edge treatment */}
            <span
              className="pointer-events-none absolute inset-y-0 left-0"
              style={{
                width: ribbonWidth,
                borderRight: '1px solid rgba(6,182,111,0.5)',
                background:
                  'repeating-linear-gradient(45deg, rgba(6,182,111,0.45) 0 7px, rgba(6,182,111,0.18) 7px 14px)',
              }}
              aria-hidden="true"
            />
            {/* The ribbon's circular foot — holds the course award badge */}
            <AwardMedallion />
            {/* Programme watermark — the premium surface's quiet signature */}
            <img
              src={qoseLogo}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
              style={{ width: '42cqw', opacity: 0.05 }}
            />
          </>
        )}

        {/* Continuous inner frame — one border, no dashes or corner angles */}
        <span
          className="pointer-events-none absolute inset-[2.5%] rounded-xl border"
          style={{
            borderColor: premium ? 'rgba(6,182,111,0.25)' : 'rgba(17,17,17,0.14)',
          }}
        />

        {/* Header — issuing authority + bare programme logo */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <div style={{ width: fluid(130, 22), maxWidth: '100%' }}>
              <Logo size="md" />
            </div>
            <span
              className="font-black uppercase tracking-widest text-gray-500"
              style={{ fontSize: fluid(7, 1.05) }}
            >
              Issuing Authority
            </span>
          </div>
          <ProgrammeLogo program={program} />
        </div>

        {/* Body */}
        <div
          className="relative flex flex-1 flex-col items-center justify-center gap-3 text-center"
          style={{ paddingBlock: fluid(8, 2) }}
        >
          <p
            className="font-black uppercase tracking-[0.3em] text-accent"
            style={{ fontSize: fluid(9, 1.45) }}
          >
            {certificateTitle}
          </p>

          <p
            className="font-bold uppercase tracking-wider text-gray-500"
            style={{ fontSize: fluid(11, 1.6) }}
          >
            Presented to
          </p>

          <p
            className="max-w-[88%] break-words font-black uppercase tracking-tight text-gray-900 [hyphens:auto] [overflow-wrap:anywhere]"
            style={{
              fontSize: nameFontSize(recipientName),
              lineHeight: 1.06,
            }}
          >
            {recipientName}
          </p>

          <p
            className="max-w-[80%] text-gray-700"
            style={{ fontSize: fluid(11, 1.65), lineHeight: 1.7 }}
          >
            has successfully completed the{' '}
            <span className="font-bold text-gray-900">{programName}</span>
          </p>

          {cohortIdentifier && (
            <p className="font-mono text-gray-600" style={{ fontSize: fluid(10, 1.4) }}>
              {cohortIdentifier}
            </p>
          )}

          <p className="font-mono text-gray-600" style={{ fontSize: fluid(10, 1.4) }}>
            {formattedDate}
          </p>
        </div>

        {/* Footer — credential metadata, then verification + issuer seal at
            the bottom-right corner. No divider line: the inner frame and
            spacing carry the structure instead. */}
        <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div
            className="grid min-w-0 gap-x-6 gap-y-3"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${fluid(96, 14)}, 1fr))`,
              flex: '1 1 300px',
            }}
          >
            <MetadataBlock label="Credential ID" value={credentialId} breakAll />
            <MetadataBlock label="Programme" value={program} />
            <MetadataBlock label="Status" value="Issued" />
          </div>

          <div className="flex flex-wrap items-end justify-end gap-x-6 gap-y-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span
                className="font-black uppercase tracking-widest text-text-muted"
                style={{ fontSize: fluid(7, 1.05) }}
              >
                Verification
              </span>
              <span
                className="break-all font-mono text-gray-600"
                style={{ fontSize: fluid(8, 1.25) }}
              >
                {verificationUrl}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span
                  className="font-black uppercase tracking-wider text-accent"
                  style={{ fontSize: fluid(7, 1.05) }}
                >
                  QYVORA Chain
                </span>
              </span>
            </div>

            {/* HPB carries the company seal at the bottom-right; QOSE's award
                seal lives on the side ribbon medallion instead. */}
            {!premium && <IssuerSeal program={program} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateRenderer;
