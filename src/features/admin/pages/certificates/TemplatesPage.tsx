import React, { useState } from 'react';
import CertificateRenderer from '@/shared/components/certificates/CertificateRenderer';

const TemplatesPage: React.FC = () => {
  const [templateName, setTemplateName] = useState('Certificate of Completion');
  const [programName, setProgramName] = useState('QYVORA Offensive Security Engineer');
  const [programme, setProgramme] = useState<'HPB' | 'QOSE'>('QOSE');
  const [cohort, setCohort] = useState('Cohort 1 - Nov 2026');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [testName, setTestName] = useState<'short' | 'medium' | 'long'>('medium');

  const testNames = {
    short: 'Alex Chen',
    medium: 'Alex Johnson',
    long: 'Alexandra Maria Constantine-Rodriguez',
  };

  const sampleData = {
    recipientName: testNames[testName],
    programName,
    cohortIdentifier: cohort,
    completionDate: new Date().toISOString(),
    credentialId: '550e8400-e29b-41d4-a716-446655440000',
    verificationUrl: 'https://qyvora.org/verify/550e8400',
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
          Certificate Templates
        </h1>
        <p className="mt-2 text-text-secondary">
          Preview and configure certificate templates. Changes can be saved as defaults.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface p-5">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Programme
            </label>
            <select
              value={programme}
              onChange={(e) => {
                const newProgramme = e.target.value as 'HPB' | 'QOSE';
                setProgramme(newProgramme);
                setProgramName(
                  newProgramme === 'HPB' 
                    ? 'Hacker Protocol Bootcamp' 
                    : 'QYVORA Offensive Security Engineer'
                );
              }}
              className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm"
            >
              <option value="QOSE">QOSE Bootcamp</option>
              <option value="HPB">Hacker Protocol Bootcamp</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Template Name
            </label>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Program Name
            </label>
            <input
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Cohort Identifier
            </label>
            <input
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
              className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-sm"
            >
              <option value="landscape">Landscape (Recommended)</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Test Name Length
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTestName('short')}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                  testName === 'short'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle bg-surface-raised text-text-secondary'
                }`}
              >
                Short
              </button>
              <button
                type="button"
                onClick={() => setTestName('medium')}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                  testName === 'medium'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle bg-surface-raised text-text-secondary'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setTestName('long')}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                  testName === 'long'
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle bg-surface-raised text-text-secondary'
                }`}
              >
                Long
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                console.log('Save template clicked');
              }}
            >
              Save as Default
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center overflow-auto rounded-2xl border border-border-subtle bg-bg-card p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-xs text-text-muted">
            <span>Live Preview</span>
            <span className="text-accent">•</span>
            <span className="font-mono">{testNames[testName]}</span>
          </div>
          <CertificateRenderer
            data={sampleData}
            config={{ name: templateName, orientation, program: programme }}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
