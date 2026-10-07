import React from 'react';
import { Logo } from '@/shared/components/brand';
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
}

/**
 * Technical Certificate Frame Component
 * Renders subtle corner marks and coordinate-like structural elements
 */
const TechnicalFrame: React.FC = () => (
  <>
    {/* Top-left corner */}
    <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-accent/40" />
    <div className="absolute left-3 top-3 h-2 w-2 rounded-full border border-accent/60" />
    
    {/* Top-right corner */}
    <div className="absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-accent/40" />
    <div className="absolute right-3 top-3 h-2 w-2 rounded-full border border-accent/60" />
    
    {/* Bottom-left corner */}
    <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-accent/40" />
    <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full border border-accent/60" />
    
    {/* Bottom-right corner */}
    <div className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-accent/40" />
    <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full border border-accent/60" />
    
    {/* Subtle coordinate marks */}
    <div className="absolute left-16 top-0 h-4 w-px bg-accent/20" />
    <div className="absolute right-16 top-0 h-4 w-px bg-accent/20" />
    <div className="absolute bottom-0 left-16 h-4 w-px bg-accent/20" />
    <div className="absolute bottom-0 right-16 h-4 w-px bg-accent/20" />
  </>
);

/**
 * Metadata Block Component
 * Renders structured credential information
 */
const MetadataBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">
      {label}
    </div>
    <div className="font-mono text-xs text-text-primary md:text-sm">
      {value}
    </div>
  </div>
);

/**
 * Programme Logo Component
 * Renders the appropriate bootcamp logo with backdrop
 */
const ProgrammeLogo: React.FC<{ program?: 'HPB' | 'QOSE' }> = ({ program = 'QOSE' }) => {
  const logoSrc = program === 'HPB' ? hpbLogo : qoseLogo;
  const logoAlt = program === 'HPB' ? 'Hacker Protocol Bootcamp' : 'QYVORA Offensive Security Engineer';
  
  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-accent/5 p-4 md:p-6">
      <DottedMapOverlay className="rounded-xl" opacity={0.15} />
      <div className="relative flex items-center justify-center">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-16 w-auto object-contain md:h-20"
        />
      </div>
    </div>
  );
};

const CertificateRenderer: React.FC<CertificateRendererProps> = ({
  data,
  config = {},
  className = '',
}) => {
  const {
    recipientName,
    programName,
    cohortIdentifier,
    completionDate,
    credentialId,
    verificationUrl = `/verify/${credentialId}`,
    issuerName = 'QYVORA',
  } = data;

  const program = config.program || 'QOSE';
  const certificateTitle = config.name || 'Certificate of Completion';

  return (
    <div
      className={`relative mx-auto aspect-[11/8.5] w-full max-w-5xl ${className}`}
      id="certificate-render"
    >
      {/* Main certificate surface - light graphite with subtle texture */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-border/30 shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #f5f5f5, #e8e8e8)' }}>
        {/* Dotted map background - very subtle */}
        <DottedMapOverlay className="rounded-2xl" opacity={0.08} />
        
        {/* Technical frame overlay */}
        <TechnicalFrame />
        
        {/* Inner content frame */}
        <div className="absolute inset-8 flex flex-col md:inset-12">
          {/* Header section - QYVORA identity + Programme */}
          <div className="mb-8 flex items-start justify-between gap-4 md:mb-10">
            {/* QYVORA Logo */}
            <div className="flex-shrink-0">
              <Logo size="md" color="#06B66F" />
              <div className="mt-2 font-mono text-[9px] font-black uppercase tracking-widest text-gray-600">
                Issuing Authority
              </div>
            </div>
            
            {/* Programme Logo */}
            <div className="w-32 flex-shrink-0 md:w-40">
              <ProgrammeLogo program={program} />
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex flex-1 flex-col justify-center space-y-6 text-center md:space-y-8">
            {/* Certificate title */}
            <div>
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent md:text-xs">
                {certificateTitle}
              </div>
              <div className="mx-auto h-px w-16 bg-accent/40" />
            </div>
            
            {/* Presented to */}
            <div className="text-sm font-bold uppercase tracking-wider text-gray-600 md:text-base">
              Presented to
            </div>
            
            {/* Recipient name - hero element */}
            <div className="mx-auto max-w-3xl px-4">
              <h1 
                className="break-words font-display text-3xl font-black uppercase leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {recipientName}
              </h1>
            </div>
            
            {/* Achievement statement */}
            <div className="mx-auto max-w-2xl px-4">
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                has successfully completed the{' '}
                <span className="font-bold text-gray-900">{programName}</span>
                {cohortIdentifier && (
                  <>
                    {' — '}
                    <span className="font-mono text-sm text-gray-800">{cohortIdentifier}</span>
                  </>
                )}
              </p>
            </div>
            
            {/* Completion date */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-accent/30" />
              <div className="font-mono text-xs text-gray-600 md:text-sm">
                {new Date(completionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="h-px w-8 bg-accent/30" />
            </div>
          </div>
          
          {/* Footer section - Credential metadata + Verification */}
          <div className="mt-auto flex flex-col gap-4 border-t border-gray-300 pt-5 md:flex-row md:items-end md:justify-between md:pt-6">
            {/* Left - Credential metadata */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
              <MetadataBlock 
                label="Credential ID" 
                value={credentialId.split('-')[0].toUpperCase()} 
              />
              <MetadataBlock 
                label="Programme" 
                value={program} 
              />
              <MetadataBlock 
                label="Status" 
                value="Issued" 
              />
            </div>
            
            {/* Right - Verification section */}
            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start md:items-end">
                  <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                    Verification
                  </div>
                  <div className="font-mono text-[10px] text-gray-600 md:text-xs">
                    {verificationUrl}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent">
                  QYVORA Chain
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateRenderer;
