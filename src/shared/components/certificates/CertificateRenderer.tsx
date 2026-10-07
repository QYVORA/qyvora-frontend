import React from 'react';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.png';
import qyvoraLogo from '@/assets/brand/logo-compact.svg';

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
  program?: string;
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

  const orientation = config.orientation || 'portrait';

  return (
    <div
      className={`relative mx-auto border border-border-subtle bg-white text-black ${
        orientation === 'landscape' ? 'aspect-[11/8.5] w-full max-w-5xl' : 'aspect-[1/1.414] w-full max-w-3xl'
      } ${className}`}
      id="certificate-render"
    >
      <div className="absolute inset-0 p-8 md:p-12">
        <div className="flex h-full flex-col border-4 border-surface-raised">
          <div className="flex items-center justify-between border-b-2 border-border-subtle px-6 py-4">
            <img src={qoseLogo} alt="QOSE Logo" className="h-12 object-contain" />
            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-text-muted">Certificate</div>
              <div className="text-sm font-bold text-text-primary">{issuerName}</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 text-sm uppercase tracking-[0.4em] text-gray-600">
              {config.name || 'Certificate of Completion'}
            </div>
            <div className="mb-2 text-3xl font-black md:text-4xl">{recipientName}</div>
            <div className="mb-6 max-w-2xl text-sm md:text-base">
              has successfully completed the <span className="font-bold">{programName}</span> — {cohortIdentifier}
            </div>
            <div className="mb-8 text-sm">
              Completion Date: <span className="font-mono">{new Date(completionDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-gray-300 px-6 py-4 text-xs">
            <div className="flex flex-col gap-1">
              <div className="font-mono text-gray-700">Credential ID: {credentialId}</div>
              <div className="font-mono text-gray-700">Verify: {verificationUrl}</div>
            </div>
            <img src={qyvoraLogo} alt="QYVORA" className="h-8 object-contain opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateRenderer;
