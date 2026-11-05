import React from 'react';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import LegalDocumentPage from './LegalDocumentPage';
import { accessibilityPolicy } from './content/accessibilityPolicy';

const CONTACT_EMAIL = SITE_CONFIG.contact.opsEmail;

const AccessibilityPage: React.FC = () => (
  <>
    <SEO
      title="Accessibility Statement | QYVORA"
      description="QYVORA's commitment to making the platform and learning materials usable by as many people as possible."
      breadcrumbName="Accessibility Statement"
    />
    <LegalDocumentPage
      doc={accessibilityPolicy}
      actions={
        <Button
          href={`mailto:${CONTACT_EMAIL}?subject=Accessibility`}
          trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        >
          Report a barrier
        </Button>
      }
      related={[
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Contact', to: '/contact' },
      ]}
    />
  </>
);

export default AccessibilityPage;
