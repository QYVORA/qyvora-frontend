import React from 'react';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import LegalDocumentPage from './LegalDocumentPage';
import { refundPolicy } from './content/refundPolicy';

const RefundPolicyPage: React.FC = () => (
  <>
    <SEO
      title="Refund & Cancellation Policy | QYVORA"
      description="How cancellations, refunds, and instalment payments work for QYVORA bootcamps, labs, and professional services."
      breadcrumbName="Refund & Cancellation Policy"
    />
    <LegalDocumentPage
      doc={refundPolicy}
      actions={
        <Button to="/contact" trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
          Request a refund
        </Button>
      }
      related={[
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'QOSE programme', to: '/qose' },
      ]}
    />
  </>
);

export default RefundPolicyPage;
