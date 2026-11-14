import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { cn } from '@/shared/utils/cn';

type FrameworkStatus = 'Under consideration' | 'Applicable where relevant' | 'Applicable law';

interface Framework {
  name: string;
  scope: string;
  status: FrameworkStatus;
  variant: 'default' | 'info';
}

const FRAMEWORKS: Framework[] = [
  {
    name: 'ISO/IEC 27001:2022',
    scope: 'Information security management system',
    status: 'Under consideration',
    variant: 'default',
  },
  {
    name: 'ISO/IEC 27701',
    scope: 'Privacy information management',
    status: 'Under consideration',
    variant: 'default',
  },
  {
    name: 'ISO 9001:2015',
    scope: 'Quality management system',
    status: 'Under consideration',
    variant: 'default',
  },
  {
    name: 'ISO/IEC 42001:2023',
    scope: 'AI management system',
    status: 'Under consideration',
    variant: 'default',
  },
  {
    name: 'SOC 2',
    scope: 'Security, availability, and confidentiality controls',
    status: 'Under consideration',
    variant: 'default',
  },
  {
    name: 'GDPR',
    scope: 'EU/EEA personal data protection',
    status: 'Applicable where relevant',
    variant: 'info',
  },
  {
    name: 'Ghana Data Protection Act, 2012 (Act 843)',
    scope: 'Ghana personal data protection',
    status: 'Applicable law',
    variant: 'info',
  },
];

interface CompliancePostureProps {
  className?: string;
  headingId?: string;
}

const CompliancePosture: React.FC<CompliancePostureProps> = ({
  className,
  headingId = 'compliance-heading',
}) => (
  <section id="compliance" aria-labelledby={headingId} className={cn('scroll-mt-28', className)}>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-accent">
          Trust & compliance
        </p>
        <h2
          id={headingId}
          className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
        >
          Security and compliance posture
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          QYVORA is building its security, privacy, and quality programme. The frameworks
          below are under consideration or apply by law. We do not claim certification
          against any standard listed below, and we do not display badges we have not earned.
        </p>
        <p className="mt-3 text-base leading-relaxed text-text-secondary">
          Our{' '}
          <Link
            to="/privacy"
            className="font-bold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Privacy Policy
          </Link>{' '}
          explains how we handle personal data. Our{' '}
          <Link
            to="/security"
            className="font-bold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Security & Responsible Disclosure policy
          </Link>{' '}
          explains how to report a vulnerability.
        </p>
      </div>

      <Card as="div" className="p-5 sm:p-6">
        <h3 className="type-label uppercase tracking-[0.12em] text-accent">Framework status</h3>
        <ul className="mt-3 divide-y divide-border-subtle">
          {FRAMEWORKS.map((framework) => (
            <li
              key={framework.name}
              className="flex flex-col gap-2 py-4 first:pt-2 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary">{framework.name}</p>
                <p className="mt-1 text-xs text-text-muted">{framework.scope}</p>
              </div>
              <Badge variant={framework.variant} className="shrink-0 self-start">
                {framework.status}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-text-muted">
          Status reflects our internal assessment as of November 2026. It is not a
          certification, audit opinion, or legal guarantee.
        </p>
      </Card>
    </div>
  </section>
);

export default CompliancePosture;
