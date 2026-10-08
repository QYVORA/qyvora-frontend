import React, { useState } from 'react';
import CertificateRenderer from '@/shared/components/certificates/CertificateRenderer';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { DEMO_CREDENTIAL_IDS } from '@/core/services/credentialVerification';

type Programme = 'HPB' | 'QOSE';

interface TemplateSettings {
  templateName: string;
  programName: string;
  cohort: string;
  credentialId: string;
}

/**
 * The two certificate templates shipped by the platform — one per bootcamp.
 * Each keeps its own settings so switching programmes never overwrites the
 * other certificate.
 */
const TEMPLATE_DEFAULTS: Record<Programme, TemplateSettings> = {
  QOSE: {
    templateName: 'Certificate of Completion',
    programName: 'QYVORA Offensive Security Engineer Bootcamp',
    cohort: 'Cohort 1 - Nov 2026',
    credentialId: DEMO_CREDENTIAL_IDS.QOSE,
  },
  HPB: {
    templateName: 'Certificate of Completion',
    programName: 'Hacker Protocol Bootcamp',
    cohort: 'Cohort 1 - Nov 2026',
    credentialId: DEMO_CREDENTIAL_IDS.HPB,
  },
};

const PROGRAMME_LABELS: Record<Programme, string> = {
  QOSE: 'QOSE Certificate',
  HPB: 'HPB Certificate',
};

const TEST_NAMES: Record<'short' | 'medium' | 'long', string> = {
  short: 'Alex Chen',
  medium: 'Alex Johnson',
  long: 'Alexandra Maria Constantine-Rodriguez',
};

const TemplatesPage: React.FC = () => {
  const [active, setActive] = useState<Programme>('QOSE');
  const [settings, setSettings] = useState<Record<Programme, TemplateSettings>>(TEMPLATE_DEFAULTS);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [testName, setTestName] = useState<'short' | 'medium' | 'long'>('medium');
  const [showBoth, setShowBoth] = useState(false);

  const current = settings[active];

  const updateCurrent = (patch: Partial<TemplateSettings>) => {
    setSettings((prev) => ({ ...prev, [active]: { ...prev[active], ...patch } }));
  };

  const buildData = (programme: Programme) => ({
    recipientName: TEST_NAMES[testName],
    programName: settings[programme].programName,
    cohortIdentifier: settings[programme].cohort,
    completionDate: new Date().toISOString(),
    credentialId: settings[programme].credentialId,
  });

  const previewPane = (programme: Programme) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>{showBoth ? PROGRAMME_LABELS[programme] : 'Live Preview'}</span>
        <span className="text-accent">•</span>
        <span className="font-mono">{TEST_NAMES[testName]}</span>
        <span className="text-accent">•</span>
        <span className="font-mono">{orientation}</span>
      </div>
      <CertificateRenderer
        data={buildData(programme)}
        config={{
          name: settings[programme].templateName,
          orientation,
          program: programme,
        }}
      />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
          Certificate Templates
        </h1>
        <p className="mt-2 text-text-secondary">
          Two certificate templates ship with the platform — QOSE and HPB. Configure the active
          template and preview it live, or show both side by side.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface p-5">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Certificate
            </span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Certificate template">
              {(Object.keys(PROGRAMME_LABELS) as Programme[]).map((programme) => (
                <button
                  key={programme}
                  type="button"
                  aria-pressed={active === programme}
                  onClick={() => setActive(programme)}
                  className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                    active === programme
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-subtle bg-surface-raised text-text-secondary'
                  }`}
                >
                  {PROGRAMME_LABELS[programme]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="cert-template-name"
              className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted"
            >
              Template Name
            </label>
            <Input
              id="cert-template-name"
              value={current.templateName}
              onChange={(e) => updateCurrent({ templateName: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="cert-program-name"
              className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted"
            >
              Program Name
            </label>
            <Input
              id="cert-program-name"
              value={current.programName}
              onChange={(e) => updateCurrent({ programName: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="cert-cohort"
              className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted"
            >
              Cohort Identifier
            </label>
            <Input
              id="cert-cohort"
              value={current.cohort}
              onChange={(e) => updateCurrent({ cohort: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="cert-orientation"
              className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted"
            >
              Size
            </label>
            <Select
              id="cert-orientation"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
              options={[
                { value: 'landscape', label: 'Landscape — US Letter 11 × 8.5 in (Recommended)' },
                { value: 'portrait', label: 'Portrait — US Letter 8.5 × 11 in' },
              ]}
            />
          </div>

          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Test Name Length
            </span>
            <div className="flex gap-2" role="group" aria-label="Test name length">
              {(['short', 'medium', 'long'] as const).map((length) => (
                <button
                  key={length}
                  type="button"
                  aria-pressed={testName === length}
                  onClick={() => setTestName(length)}
                  className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                    testName === length
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-subtle bg-surface-raised text-text-secondary'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-text-muted">
              Preview
            </span>
            <div className="flex gap-2" role="group" aria-label="Preview mode">
              <button
                type="button"
                aria-pressed={!showBoth}
                onClick={() => setShowBoth(false)}
                className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                  !showBoth
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle bg-surface-raised text-text-secondary'
                }`}
              >
                Active only
              </button>
              <button
                type="button"
                aria-pressed={showBoth}
                onClick={() => setShowBoth(true)}
                className={`min-h-[44px] flex-1 rounded-lg border px-3 py-2 text-xs font-bold uppercase ${
                  showBoth
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-subtle bg-surface-raised text-text-secondary'
                }`}
              >
                Both
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              className="w-full"
              onClick={() => {
                console.log('Save template clicked', active, settings[active]);
              }}
            >
              Save as Default
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 overflow-auto rounded-2xl border border-border-subtle bg-bg-card p-6 md:p-8">
          {previewPane(active)}
          {showBoth && previewPane(active === 'QOSE' ? 'HPB' : 'QOSE')}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
