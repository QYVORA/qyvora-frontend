import React from 'react';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import LegalDocumentPage from './LegalDocumentPage';
import { securityPolicy } from './content/securityPolicy';

const SECURITY_EMAIL = SITE_CONFIG.contact.securityDeskEmail;

const SecurityPage: React.FC = () => (
  <>
    <SEO
      title="Security & Responsible Disclosure | QYVORA"
      description="How to report a security vulnerability to QYVORA, what is in scope, our safe-harbour commitment, and what you can expect from us."
      breadcrumbName="Security & Responsible Disclosure"
    />
    <LegalDocumentPage
      doc={securityPolicy}
      actions={
        <>
          <Button
            href={`mailto:${SECURITY_EMAIL}?subject=Security%20report`}
            trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Report a vulnerability
          </Button>
          <Button href="/.well-known/security.txt" variant="secondary">
            security.txt
          </Button>
        </>
      }
      related={[
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Contact', to: '/contact' },
        { label: 'Terms of Service', to: '/terms' },
      ]}
    />
  </>
);

export default SecurityPage;
