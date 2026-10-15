import React from 'react';
import { Logo } from '@/shared/components/brand';
import DottedMapOverlay from '@/shared/components/ui/DottedMapOverlay';
import { fluid } from './certificateFluid';
import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';

export type CertificateProgram = 'HPB' | 'QOSE';
export type CertificateOrientation = 'portrait' | 'landscape';

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
  program?: CertificateProgram;
  orientation?: CertificateOrientation;
  showQr?: boolean;
  showSeal?: boolean;
  accentColor?: string;
}

export interface CertificateRendererProps {
  data: CertificateData;
  config?: CertificateTemplateConfig;
  className?: string;
  /** Optional element id — only set on the certificate being exported. */
  id?: string;
}

const PROGRAMME_LOGO: Record<CertificateProgram, string> = { HPB: hpbLogo, QOSE: qoseLogo };
const PROGRAMME_LOGO_ALT: Record<CertificateProgram, string> = {
  HPB: 'Hacker Protocol Bootcamp',
  QOSE: 'QYVORA Offensive Security Engineer Bootcamp',
};
const PROGRAMME_LABEL: Record<CertificateProgram, string> = {
  HPB: 'Hacker Protocol Bootcamp',
  QOSE: 'Offensive Security Engineer',
};

/**
 * The certificate is a light "paper" artifact. Its theme text tokens must be
 * redirected to fixed dark ink, otherwise the dark theme's near-white text
 * renders invisibly on the light surface (white on white). These values mirror
 * the light-theme text tokens (#161C15 and its alphas).
 */
const INK = {
  primary: '#161C15',
  secondary: 'rgba(22, 28, 21, 0.82)',
  muted: 'rgba(22, 28, 21, 0.62)',
} as const;

/** Light text used on the charcoal header / premium footer bands. */
const ON_DARK = {
  strong: 'rgba(244, 248, 245, 0.96)',
  secondary: 'rgba(238, 242, 239, 0.72)',
  muted: 'rgba(238, 242, 239, 0.50)',
} as const;

interface TemplateTokens {
  /** Paper surface behind the light body. */
  paper: string;
  /** Charcoal header band behind the two logos. */
  header: string;
  /** Premium footer band; `null` keeps the footer on the paper surface. */
  footer: string | null;
  /** Outer card border. */
  border: string;
  /** Continuous inner hairline frame. */
  frame: string;
  /** Optional decorative texture laid over the header band. */
  headerTexture?: React.CSSProperties;
}

/**
 * Two complementary brand colours — charcoal (#0B0E0C) and QYVORA green
 * (#06B66F) — over a warm light neutral paper. Both templates share this
 * palette; they differ only in how much charcoal each uses, so the two
 * certificates read as one family.
 */
const TEMPLATE_TOKENS: Record<CertificateProgram, TemplateTokens> = {
  HPB: {
    paper: 'linear-gradient(160deg, #FCFCFB 0%, #F2F5F2 58%, #E9EFEB 100%)',
    header: 'linear-gradient(120deg, #0B0E0C 0%, #171D19 100%)',
    footer: null,
    border: 'rgba(17, 17, 17, 0.16)',
    frame: 'rgba(6, 182, 111, 0.26)',
  },
  QOSE: {
    paper: 'linear-gradient(160deg, #FCFCFB 0%, #EDF4EF 58%, #E0EBE4 100%)',
    header: 'linear-gradient(120deg, #090C0A 0%, #111A14 100%)',
    footer: 'linear-gradient(120deg, #111A14 0%, #090C0A 100%)',
    border: 'rgba(6, 182, 111, 0.45)',
    frame: 'rgba(6, 182, 111, 0.38)',
    headerTexture: {
      backgroundImage:
        'repeating-linear-gradient(135deg, rgba(6,182,111,0.16) 0 1px, transparent 1px 14px)',
    },
  },
};

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
 * Programme emblem — rendered bare and untinted directly on the charcoal
 * header, never wrapped in a card, border or panel.
 */
const ProgrammeLogo: React.FC<{ program: CertificateProgram }> = ({ program }) => (
  <img
    src={PROGRAMME_LOGO[program]}
    alt={PROGRAMME_LOGO_ALT[program]}
    className="w-auto shrink-0 object-contain"
    style={{ height: fluid(40, 6) }}
  />
);

const MetadataBlock: React.FC<{ label: string; value: string; dark?: boolean; breakAll?: boolean }> = ({
  label,
  value,
  dark,
  breakAll,
}) => (
  <div className="flex min-w-0 flex-col gap-1">
    <span
      className="font-black uppercase tracking-widest"
      style={{ fontSize: fluid(7, 1), color: dark ? ON_DARK.muted : INK.muted }}
    >
      {label}
    </span>
    <span
      className={`font-mono ${breakAll ? 'break-all' : 'break-words'}`}
      style={{ fontSize: fluid(9, 1.25), color: dark ? ON_DARK.secondary : INK.secondary }}
    >
      {value}
    </span>
  </div>
);

/**
 * The single canvas: a charcoal header carrying the two required logos, a
 * warm paper body, and a compact verification footer at the very bottom. HPB
 * and QOSE share every rule; only the amount of charcoal differs.
 */
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
  const tokens = TEMPLATE_TOKENS[program];
  // QOSE is the paid programme — its premium edition frames the body with
  // charcoal top *and* bottom; HPB stays the lighter standard edition.
  const premium = program === 'QOSE';

  const pad = fluid(22, 4.6);
  const headerPadY = fluid(20, 3.4);
  const bodyPadY = fluid(16, 3);
  const footerPadY = fluid(12, 2.2);

  const formattedDate = (() => {
    const parsed = new Date(completionDate);
    if (Number.isNaN(parsed.getTime())) return completionDate;
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  })();

  return (
    <div
      className={`relative mx-auto w-full ${className}`}
      id={id}
      style={
        {
          containerType: 'inline-size',
          '--color-text-primary': INK.primary,
          '--color-text-secondary': INK.secondary,
          '--color-text-muted': INK.muted,
        } as React.CSSProperties
      }
    >
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-2xl border-2 shadow-2xl"
        style={{
          background: tokens.paper,
          borderColor: tokens.border,
          // Industry-standard certificate trim as a *minimum* height: US Letter
          // landscape (11 × 8.5 in → 77.27cqw) or portrait (8.5 × 11 in →
          // 129.41cqw). Content owns the exact ratio at every normal size and
          // the surface can only *grow*, so text is never clipped.
          minHeight: orientation === 'portrait' ? '129.41cqw' : '77.27cqw',
        }}
      >
        {/* Dotted-map backdrop — both templates */}
        <DottedMapOverlay className="rounded-2xl" opacity={0.07} />

        {/* Continuous inner frame — one hairline, clear of the edge */}
        <span
          className="pointer-events-none absolute inset-[2.2%] z-[2] rounded-xl border"
          style={{ borderColor: tokens.frame }}
        />

        {/* ── Header band — the two required logos on charcoal ── */}
        <header
          className="relative z-[1] flex items-center justify-between gap-6"
          style={{ background: tokens.header, padding: `${headerPadY} ${pad}` }}
        >
          {tokens.headerTexture && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={tokens.headerTexture}
            />
          )}

          <div className="relative flex min-w-0 flex-col gap-1.5">
            <div style={{ width: fluid(150, 19), maxWidth: '100%' }}>
              <Logo size="md" />
            </div>
            <span
              className="font-black uppercase tracking-[0.28em]"
              style={{ fontSize: fluid(7, 1), color: ON_DARK.muted }}
            >
              Issuing Authority
            </span>
          </div>

          <div className="relative flex shrink-0 flex-col items-center gap-1.5">
            <ProgrammeLogo program={program} />
            <span
              className="font-black uppercase tracking-[0.2em]"
              style={{ fontSize: fluid(7, 1), color: ON_DARK.muted }}
            >
              {PROGRAMME_LABEL[program]}
            </span>
          </div>
        </header>

        {/* ── Body — the recipient's achievement on paper ── */}
        <div
          className="relative z-[1] flex flex-1 flex-col items-center justify-center gap-3 text-center"
          style={{ padding: `${bodyPadY} ${pad}` }}
        >
          <p
            className="font-black uppercase tracking-[0.34em] text-accent"
            style={{ fontSize: fluid(11, 1.25) }}
          >
            {certificateTitle}
          </p>

          <span className="h-[2px] w-[14%] rounded-full bg-accent/60" aria-hidden="true" />

          <p
            className="font-bold uppercase tracking-wider text-text-secondary"
            style={{ fontSize: fluid(11, 1.5) }}
          >
            Presented to
          </p>

          <p
            className="max-w-[88%] break-words font-black uppercase tracking-tight text-text-primary [hyphens:auto] [overflow-wrap:anywhere]"
            style={{ fontSize: nameFontSize(recipientName), lineHeight: 1.06 }}
          >
            {recipientName}
          </p>

          <p
            className="max-w-[78%] text-text-secondary"
            style={{ fontSize: fluid(11, 1.6), lineHeight: 1.7 }}
          >
            has successfully completed the{' '}
            <span className="font-bold text-text-primary">{programName}</span>
          </p>

          <p
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-mono text-text-secondary"
            style={{ fontSize: fluid(9, 1.3) }}
          >
            {cohortIdentifier && (
              <>
                <span>{cohortIdentifier}</span>
                <span className="text-accent">·</span>
              </>
            )}
            <span>{formattedDate}</span>
          </p>
        </div>

        {/* ── Footer — credential metadata, then a compact verification line
            pinned to the very bottom ── */}
        <footer
          className="relative z-[1]"
          style={
            tokens.footer
              ? { background: tokens.footer, padding: `${footerPadY} ${pad}` }
              : { padding: `${footerPadY} ${pad}` }
          }
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-[4%] top-0 h-px"
            style={{ background: premium ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.12)' }}
          />

          <div
            className="grid gap-x-6 gap-y-3"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(${fluid(96, 14)}, 1fr))`,
            }}
          >
            <MetadataBlock label="Credential ID" value={credentialId} breakAll dark={premium} />
            <MetadataBlock label="Programme" value={program} dark={premium} />
            <MetadataBlock label="Status" value="Issued" dark={premium} />
          </div>

          <div
            className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-t pt-2.5"
            style={{ borderColor: premium ? 'rgba(255,255,255,0.10)' : 'rgba(17,17,17,0.08)' }}
          >
            <span
              className="break-all font-mono"
              style={{ fontSize: fluid(8, 1.05), color: premium ? ON_DARK.muted : INK.muted }}
            >
              Verify at {verificationUrl}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span
                className="font-black uppercase tracking-[0.2em] text-accent"
                style={{ fontSize: fluid(7, 1) }}
              >
                QYVORA Chain
              </span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CertificateRenderer;
