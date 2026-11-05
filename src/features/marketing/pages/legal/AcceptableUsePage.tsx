import React from 'react';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import LegalDocumentPage from './LegalDocumentPage';
import { acceptableUsePolicy } from './content/acceptableUsePolicy';

const AcceptableUsePage: React.FC = () => (
  <>
    <SEO
      title="Acceptable Use & Community Guidelines | QYVORA"
      description="The standards we expect from everyone using QYVORA's platform, labs, programmes, and community channels."
      breadcrumbName="Acceptable Use & Community Guidelines"
    />
    <LegalDocumentPage
      doc={acceptableUsePolicy}
      actions={
        <Button to="/contact" trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
          Report a concern
        </Button>
      }
      related={[
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Security & Responsible Disclosure', to: '/security' },
        { label: 'Privacy Policy', to: '/privacy' },
      ]}
    />
  </>
);

export default AcceptableUsePage;
