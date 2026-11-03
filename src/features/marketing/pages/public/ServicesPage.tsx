import React from 'react';
import { ArrowRight } from 'lucide-react';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { SERVICES, REQUEST_ASSESSMENT_LABEL, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

const ServicesPage = () => {
  return (
    <div className="min-h-dvh w-full bg-canvas">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Services"
          title="Security Services"
          description="Enterprise penetration testing, vulnerability assessments, and custom security training for your organization."
          actions={
            <Button onClick={() => openServiceRequestModal('Security Services')} size="lg">
              {REQUEST_ASSESSMENT_LABEL}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} />
          ))}
        </div>
      </PublicContainer>
    </div>
  );
};

const ServiceCard: React.FC<{ svc: ServiceConfig }> = ({ svc }) => {
  const Icon = svc.icon;

  return (
    <Card
      to={svc.path}
      interactive
      className="flex h-full min-h-[240px] flex-col gap-3 p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {svc.featured && (
          <span className="rounded-lg border border-accent/40 bg-accent/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-accent">
            {svc.badge}
          </span>
        )}
      </div>

      <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
        {svc.title}
      </h3>

      <p className="type-body-sm flex-1">{svc.overview}</p>

      <div className="space-y-2 border-t border-border-subtle pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-base font-black text-text-primary">{svc.price}</span>
          <span className="font-mono text-xs text-text-muted">{svc.priceLocal}</span>
        </div>
        <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
          View Details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
};

export default ServicesPage;
