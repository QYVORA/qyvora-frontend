import React from 'react';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import LegalDocumentPage from './LegalDocumentPage';
import { privacyPolicy } from './content/privacyPolicy';

const PrivacyPage: React.FC = () => (
  <>
    <SEO
      title="Privacy Policy | QYVORA"
      description="How QYVORA collects, uses, shares, and protects personal data across its platform, training programmes, and professional services."
      breadcrumbName="Privacy Policy"
    />
    <LegalDocumentPage
      doc={privacyPolicy}
      actions={
        <Button to="/contact" variant="secondary" trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
          Contact us
        </Button>
      }
      related={[
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Security & Responsible Disclosure', to: '/security' },
        { label: 'Terms of Service', to: '/terms' },
      ]}
    />
  </>
);

export default PrivacyPage;
